import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode, FC } from 'react';
import type { Task, Column } from '@/db';
import { db } from '@/db';
import { TaskSchema, TaskFormSchema, ColumnSchema } from '@/db/validation';
import type { TaskFormData } from '@/db/validation';

interface AppContextType {
  tasks: Task[];
  columns: Column[];
  isLoading: boolean;
  createTask: (columnId: number, data: TaskFormData) => Promise<Task>;
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateTask: (id: number, updates: Partial<Task>) => Promise<void>;
  deleteTask: (id: number) => Promise<void>;
  addColumn: (column: Omit<Column, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateColumn: (id: number, updates: Partial<Column>) => Promise<void>;
  deleteColumn: (id: number) => Promise<void>;
  reorderColumns: (columns: Column[]) => Promise<void>;
  moveTask: (taskId: number, targetColumnId: number, newOrder: number) => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [columns, setColumns] = useState<Column[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const getCurrentTimestamp = () => new Date().toISOString();

  // Load data on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        
        // Load all data
        const [tasksData, columnsData] = await Promise.all([
          db.tasks.toArray(),
          db.columns.toArray(),
        ]);
        
        // Migrate task order field for existing tasks
        let migratedTasks = [...tasksData];
        let needsUpdate = false;
        
        for (const task of migratedTasks) {
          if (task.order === undefined || task.order === null) {
            // Assign order based on creation date within each column
            needsUpdate = true;
          }
        }
        
        if (needsUpdate) {
          // Group tasks by column and sort by creation date
          const tasksByColumn: Record<number, Task[]> = {};
          for (const task of migratedTasks) {
            if (!tasksByColumn[task.columnId]) {
              tasksByColumn[task.columnId] = [];
            }
            tasksByColumn[task.columnId].push(task);
          }
          
          // Assign order within each column
          for (const columnId in tasksByColumn) {
            const columnTasks = tasksByColumn[columnId];
            columnTasks.sort((a, b) => 
              new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
            );
            
            for (let i = 0; i < columnTasks.length; i++) {
              if (columnTasks[i].order === undefined || columnTasks[i].order === null) {
                columnTasks[i].order = i;
                await db.tasks.update(columnTasks[i].id!, { order: i });
              }
            }
          }
          
          migratedTasks = await db.tasks.toArray();
        }
        
        setTasks(migratedTasks);
        setColumns(columnsData);
      } catch (error) {
        console.error('Failed to load data from IndexedDB:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  const createTask = async (columnId: number, data: TaskFormData): Promise<Task> => {
    try {
      // Validate form data
      const validData = TaskFormSchema.parse(data);
      
      // Calculate order: count existing tasks in column and add 1
      const columnTasks = tasks.filter(t => t.columnId === columnId);
      const newOrder = Math.max(...columnTasks.map(t => t.order ?? 0), -1) + 1;
      
      const now = getCurrentTimestamp();
      const taskData: Omit<Task, 'id'> = {
        ...validData,
        columnId,
        order: newOrder,
        completed: false,
        createdAt: now,
        updatedAt: now,
      };
      
      // Validate full task before persistence
      const validatedTask = TaskSchema.parse(taskData);
      
      const id = await db.tasks.add(validatedTask);
      const newTask: Task = { ...validatedTask, id };
      setTasks([...tasks, newTask]);
      return newTask;
    } catch (error: any) {
      console.error('Failed to create task:', error);
      throw new Error(error.message || 'Failed to create task');
    }
  };

  const addTask = async (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const now = getCurrentTimestamp();
      const taskWithTimestamps = {
        ...task,
        createdAt: now,
        updatedAt: now,
      } as Task;
      
      // Validate task against schema before persistence
      const validatedTask = TaskSchema.parse(taskWithTimestamps);
      
      const id = await db.tasks.add(validatedTask);
      const newTask = { ...validatedTask, id } as Task;
      setTasks([...tasks, newTask]);
    } catch (error) {
      console.error('Failed to add task:', error);
      throw error;
    }
  };

  const updateTask = async (id: number, updates: Partial<Task>) => {
    try {
      const updateWithTimestamp = {
        ...updates,
        updatedAt: getCurrentTimestamp(),
      };
      
      await db.tasks.update(id, updateWithTimestamp);
      setTasks(tasks.map(t => t.id === id ? { ...t, ...updateWithTimestamp } : t));
    } catch (error) {
      console.error('Failed to update task:', error);
      throw error;
    }
  };

  const deleteTask = async (id: number) => {
    try {
      await db.tasks.delete(id);
      setTasks(tasks.filter(t => t.id !== id));
    } catch (error) {
      console.error('Failed to delete task:', error);
      throw error;
    }
  };

  const addColumn = async (column: Omit<Column, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const now = getCurrentTimestamp();
      const columnWithTimestamps = {
        ...column,
        createdAt: now,
        updatedAt: now,
      } as Column;
      
      // Validate column against schema before persistence
      const validatedColumn = ColumnSchema.parse(columnWithTimestamps);
      
      const id = await db.columns.add(validatedColumn);
      const newColumn = { ...validatedColumn, id } as Column;
      setColumns([...columns, newColumn]);
    } catch (error) {
      console.error('Failed to add column:', error);
      throw error;
    }
  };

  const deleteColumn = async (id: number) => {
    try {
      // First, delete all tasks in this column to avoid orphaned data
      const tasksInColumn = await db.tasks.where('columnId').equals(id).toArray();
      await Promise.all(tasksInColumn.map(t => db.tasks.delete(t.id!)));
      
      // Remove tasks from state
      setTasks(tasks.filter(t => t.columnId !== id));
      
      // Then delete the column
      await db.columns.delete(id);
      setColumns(columns.filter(c => c.id !== id));
    } catch (error) {
      console.error('Failed to delete column:', error);
      throw error;
    }
  };

  const updateColumn = async (id: number, updates: Partial<Column>) => {
    try {
      const updateWithTimestamp = {
        ...updates,
        updatedAt: getCurrentTimestamp(),
      };
      
      await db.columns.update(id, updateWithTimestamp);
      setColumns(columns.map(c => c.id === id ? { ...c, ...updateWithTimestamp } : c));
    } catch (error) {
      console.error('Failed to update column:', error);
      throw error;
    }
  };

  const reorderColumns = async (newColumns: Column[]) => {
    try {
      const now = getCurrentTimestamp();
      const updates = newColumns.map((col, idx) => ({
        ...col,
        order: idx,
        updatedAt: now,
      }));
      
      await Promise.all(
        updates.map(col => db.columns.update(col.id!, { order: col.order, updatedAt: col.updatedAt }))
      );
      
      setColumns(updates);
    } catch (error) {
      console.error('Failed to reorder columns:', error);
      throw error;
    }
  };

  const moveTask = async (taskId: number, targetColumnId: number, newOrder: number): Promise<void> => {
    try {
      const task = tasks.find(t => t.id === taskId);
      if (!task) throw new Error('Task not found');

      // If moving to new column, update all order values in target column
      if (task.columnId !== targetColumnId) {
        // Increment order for tasks in target column that are >= newOrder
        const targetColumnTasks = tasks.filter(
          t => t.columnId === targetColumnId && (t.order ?? 0) >= newOrder
        );
        
        for (const t of targetColumnTasks) {
          if (t.id && t.id !== taskId) {
            await db.tasks.update(t.id, { order: (t.order ?? 0) + 1 });
          }
        }

        // Update task: new column and order
        await db.tasks.update(taskId, { columnId: targetColumnId, order: newOrder });
      } else {
        // Same column reorder
        const oldOrder = task.order ?? 0;
        if (newOrder > oldOrder) {
          // If moving down, decrement order for tasks between old and new position
          const affectedTasks = tasks.filter(
            t => t.columnId === targetColumnId && 
                 (t.order ?? 0) > oldOrder && 
                 (t.order ?? 0) <= newOrder
          );
          for (const t of affectedTasks) {
            if (t.id && t.id !== taskId) {
              await db.tasks.update(t.id, { order: (t.order ?? 0) - 1 });
            }
          }
        } else if (newOrder < oldOrder) {
          // If moving up, increment order for tasks between new and old position
          const affectedTasks = tasks.filter(
            t => t.columnId === targetColumnId && 
                 (t.order ?? 0) >= newOrder && 
                 (t.order ?? 0) < oldOrder
          );
          for (const t of affectedTasks) {
            if (t.id && t.id !== taskId) {
              await db.tasks.update(t.id, { order: (t.order ?? 0) + 1 });
            }
          }
        }

        // Update task order
        await db.tasks.update(taskId, { order: newOrder });
      }

      // Reload tasks from Dexie to ensure consistency
      const updatedTasks = await db.tasks.toArray();
      setTasks(updatedTasks);
    } catch (err: any) {
      console.error('Failed to move task:', err);
      throw new Error(err.message || 'Failed to move task');
    }
  };

  return (
    <AppContext.Provider value={{ tasks, columns, isLoading, createTask, addTask, updateTask, deleteTask, addColumn, updateColumn, deleteColumn, reorderColumns, moveTask }}>
      {children}
    </AppContext.Provider>
  );
};

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}
