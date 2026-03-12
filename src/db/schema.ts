import Dexie from 'dexie';
import type { Table } from 'dexie';

export interface Subtask {
  id?: number;
  taskId: number;
  title: string;
  completed: boolean;
  order?: number;
  createdAt: string;
  updatedAt: string;
}

// Define types for each store
export interface Task {
  id?: number;
  title: string;
  description?: string;
  columnId: number;
  dueDate?: string;
  priority: 'Low' | 'Medium' | 'High' | 'Urgent';
  tags?: string[];
  order?: number;
  completed: boolean;
  clientId?: number;
  projectId?: number;
  billable?: boolean;
  hourlyRate?: number;
  timeEstimate?: number; // in minutes
  createdAt: string;
  updatedAt: string;
}

export interface Column {
  id?: number;
  name: string;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface Client {
  id?: number;
  name: string;
  hourlyRate?: number;
  contactInfo?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Project {
  id?: number;
  name: string;
  clientId?: number;
  hourlyRate?: number;
  createdAt: string;
  updatedAt: string;
}

export interface TimeEntry {
  id?: number;
  taskId: number;
  duration: number; // in minutes
  note?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Settings {
  id?: number;
  key: string;
  value: string | number | boolean | object;
  createdAt: string;
  updatedAt: string;
}

// Define the database
export class FreelancerDB extends Dexie {
  tasks!: Table<Task>;
  columns!: Table<Column>;
  clients!: Table<Client>;
  projects!: Table<Project>;
  timeEntries!: Table<TimeEntry>;
  settings!: Table<Settings>;
  subtasks!: Table<Subtask>;

  constructor() {
    super('FreelancerTrackerDB');
    this.version(1).stores({
      tasks: '++id, columnId, clientId, projectId, order',
      columns: '++id',
      clients: '++id',
      projects: '++id, clientId',
      timeEntries: '++id, taskId',
      settings: '++id, key'
    });
    this.version(2).stores({
      tasks: '++id, columnId, clientId, projectId, order',
      columns: '++id',
      clients: '++id',
      projects: '++id, clientId',
      timeEntries: '++id, taskId',
      settings: '++id, key',
      subtasks: '++id, taskId, order'
    });
  }
}

export const db = new FreelancerDB();
