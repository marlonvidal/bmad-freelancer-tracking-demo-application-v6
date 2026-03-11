import { test as base, expect } from '@playwright/test';
import type { Task, Column } from '@/db';

/**
 * Storage Fixture
 * Provides utilities for testing IndexedDB persistence
 */

interface StorageFixture {
  /**
   * Get all tasks from IndexedDB
   */
  getAllTasks: () => Promise<Task[]>;

  /**
   * Get all columns from IndexedDB
   */
  getAllColumns: () => Promise<Column[]>;

  /**
   * Clear all data from IndexedDB
   */
  clearDatabase: () => Promise<void>;

  /**
   * Add a task to IndexedDB
   */
  addTask: (task: Omit<Task, 'id'>) => Promise<number>;

  /**
   * Add a column to IndexedDB
   */
  addColumn: (column: Omit<Column, 'id'>) => Promise<number>;

  /**
   * Wait for data to be persisted (debounced auto-save)
   */
  waitForPersist: () => Promise<void>;
}

export const test = base.extend<StorageFixture>({
  getAllTasks: async ({ page }, use) => {
    const getAllTasks = async () => {
      return await page.evaluate(async () => {
        // @ts-ignore - accessing Dexie from window context
        const db = window.__db__;
        if (!db) throw new Error('Database not initialized');
        return await db.tasks.toArray();
      });
    };

    await use(getAllTasks);
  },

  getAllColumns: async ({ page }, use) => {
    const getAllColumns = async () => {
      return await page.evaluate(async () => {
        // @ts-ignore
        const db = window.__db__;
        if (!db) throw new Error('Database not initialized');
        return await db.columns.toArray();
      });
    };

    await use(getAllColumns);
  },

  clearDatabase: async ({ page }, use) => {
    const clearDatabase = async () => {
      await page.evaluate(async () => {
        // @ts-ignore
        const db = window.__db__;
        if (!db) throw new Error('Database not initialized');
        await db.tasks.clear();
        await db.columns.clear();
        await db.clients.clear();
        await db.projects.clear();
        await db.timeEntries.clear();
        await db.settings.clear();
      });
    };

    await use(clearDatabase);

    // Cleanup after test
    await clearDatabase();
  },

  addTask: async ({ page }, use) => {
    const addTask = async (task: Omit<Task, 'id'>) => {
      return await page.evaluate(
        async (taskData) => {
          // @ts-ignore
          const db = window.__db__;
          if (!db) throw new Error('Database not initialized');
          return await db.tasks.add(taskData);
        },
        task
      );
    };

    await use(addTask);
  },

  addColumn: async ({ page }, use) => {
    const addColumn = async (column: Omit<Column, 'id'>) => {
      return await page.evaluate(
        async (columnData) => {
          // @ts-ignore
          const db = window.__db__;
          if (!db) throw new Error('Database not initialized');
          return await db.columns.add(columnData);
        },
        column
      );
    };

    await use(addColumn);
  },

  waitForPersist: async ({ page }, use) => {
    const waitForPersist = async () => {
      // Wait for auto-save to complete (debounced or via context state update)
      await page.waitForTimeout(100); // Small buffer for state update
    };

    await use(waitForPersist);
  },
});

export { expect };
