import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode, FC } from 'react';
import type { Task, Column } from '@/db';
import { db } from '@/db';
import { TaskSchema, ColumnSchema } from '@/db/validation';

interface AppContextType {
  tasks: Task[];
  columns: Column[];
  isLoading: boolean;
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateTask: (id: number, updates: Partial<Task>) => Promise<void>;
  deleteTask: (id: number) => Promise<void>;
  addColumn: (column: Omit<Column, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  deleteColumn: (id: number) => Promise<void>;
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
      await db.columns.delete(id);
      setColumns(columns.filter(c => c.id !== id));
    } catch (error) {
      console.error('Failed to delete column:', error);
      throw error;
    }
  };

  return (
    <AppContext.Provider value={{ tasks, columns, isLoading, addTask, updateTask, deleteTask, addColumn, deleteColumn }}>
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
