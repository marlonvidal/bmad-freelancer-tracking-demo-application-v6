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
        const [tasksData, columnsData] = await Promise.all([
          db.tasks.toArray(),
          db.columns.toArray(),
        ]);
        setTasks(tasksData);
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
      
      const now = getCurrentTimestamp();
      const taskData: Omit<Task, 'id'> = {
        ...validData,
        columnId,
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

  return (
    <AppContext.Provider value={{ tasks, columns, isLoading, createTask, addTask, updateTask, deleteTask, addColumn, updateColumn, deleteColumn, reorderColumns }}>
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
