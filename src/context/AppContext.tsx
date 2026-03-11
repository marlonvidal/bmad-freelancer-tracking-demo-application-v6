import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode, FC } from 'react';
import type { Task, Column } from '@/db';
import { db } from '@/db';

interface AppContextType {
  tasks: Task[];
  columns: Column[];
  addTask: (task: Omit<Task, 'id'>) => Promise<void>;
  updateTask: (id: number, updates: Partial<Task>) => Promise<void>;
  addColumn: (column: Omit<Column, 'id'>) => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [columns, setColumns] = useState<Column[]>([]);

  // Load data on mount
  useEffect(() => {
    const loadData = async () => {
      const [tasksData, columnsData] = await Promise.all([
        db.tasks.toArray(),
        db.columns.toArray(),
      ]);
      setTasks(tasksData);
      setColumns(columnsData);
    };
    loadData();
  }, []);

  const addTask = async (task: Omit<Task, 'id'>) => {
    const id = await db.tasks.add(task as Task);
    const newTask = { ...task, id } as Task;
    setTasks([...tasks, newTask]);
  };

  const updateTask = async (id: number, updates: Partial<Task>) => {
    await db.tasks.update(id, updates);
    setTasks(tasks.map(t => t.id === id ? { ...t, ...updates } : t));
  };

  const addColumn = async (column: Omit<Column, 'id'>) => {
    const id = await db.columns.add(column as Column);
    const newColumn = { ...column, id } as Column;
    setColumns([...columns, newColumn]);
  };

  return (
    <AppContext.Provider value={{ tasks, columns, addTask, updateTask, addColumn }}>
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
