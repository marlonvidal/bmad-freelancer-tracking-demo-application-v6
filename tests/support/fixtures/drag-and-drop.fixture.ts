import { test as base } from '@playwright/test';
import { createStandardKanbanColumns } from './factories/column.factory';
import { createTasks } from './factories/task.factory';

/**
 * Drag-and-Drop Test Fixtures
 * 
 * Provides pre-configured board states for testing drag-and-drop functionality.
 * All fixtures handle setup, cleanup, and Dexie database management.
 */

/**
 * Board with tasks fixture
 * 
 * Setup: Creates 2 standard columns (To Do, In Progress, Done) with 3 tasks per column
 * Provides: Ready-to-test board state with known task data
 * Cleanup: Clears database and closes page
 */
export const boardWithTasks = base.extend({
  boardWithTasks: async ({ page }, use) => {
    // Navigate to home page
    await page.goto('/');

    // Wait for app to load
    await page.waitForSelector('[data-testid="kanban-board"]', { timeout: 5000 });

    // Initialize database via app context
    // (Assumes the app exposes db for testing purposes)
    const boardData = await page.evaluate(async () => {
      const columns = [
        { id: 1, name: 'To Do', order: 0, createdAt: new Date().toISOString() },
        { id: 2, name: 'In Progress', order: 1, createdAt: new Date().toISOString() },
        { id: 3, name: 'Done', order: 2, createdAt: new Date().toISOString() },
      ];

      const tasks = [];
      let taskId = 1;

      // Create 3 tasks in each column
      for (const column of columns) {
        for (let i = 0; i < 3; i++) {
          tasks.push({
            id: taskId,
            title: `${column.name} Task ${i + 1}`,
            description: `Task in ${column.name}`,
            columnId: column.id,
            priority: 'Medium',
            order: i,
            completed: false,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          });
          taskId++;
        }
      }

      // Store in window for test access
      (window as any).__testBoardState = {
        columns,
        tasks,
      };

      return { columns, tasks };
    });

    // Provide fixture data to test
    await use(boardData);

    // CLEANUP: Clear database and reset state
    await page.evaluate(async () => {
      // Clear Dexie database
      if ((window as any).db) {
        await (window as any).db.tasks.clear();
        await (window as any).db.columns.clear();
      }

      // Clear test state
      delete (window as any).__testBoardState;
    });

    // Close page
    await page.close();
  },
});

/**
 * Large board fixture for performance testing
 * 
 * Setup: Creates 1 column with 100+ tasks
 * Provides: Large dataset ready for performance measurement
 * Cleanup: Clears tasks from Dexie
 */
export const largeBoard = base.extend({
  largeBoard: async ({ page }, use) => {
    // Navigate to home page
    await page.goto('/');

    // Wait for app to load
    await page.waitForSelector('[data-testid="kanban-board"]', { timeout: 5000 });

    // Create large dataset
    const boardData = await page.evaluate(async () => {
      const column = {
        id: 1,
        name: 'Large Column',
        order: 0,
        createdAt: new Date().toISOString(),
      };

      const tasks = [];
      const taskCount = 150; // 150 tasks for performance testing

      for (let i = 0; i < taskCount; i++) {
        tasks.push({
          id: i + 1,
          title: `Task ${i + 1}`,
          description: `Performance test task`,
          columnId: column.id,
          priority: 'Medium',
          order: i,
          completed: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
      }

      (window as any).__testLargeBoardState = {
        column,
        tasks,
      };

      return { column, tasks };
    });

    // Provide fixture to test
    await use(boardData);

    // CLEANUP
    await page.evaluate(async () => {
      if ((window as any).db) {
        await (window as any).db.tasks.clear();
      }
      delete (window as any).__testLargeBoardState;
    });

    await page.close();
  },
});

/**
 * Empty board fixture
 * 
 * Setup: Creates 2 columns with no tasks
 * Provides: Clean slate for testing add and drag scenarios
 * Cleanup: Clears database
 */
export const emptyBoard = base.extend({
  emptyBoard: async ({ page }, use) => {
    await page.goto('/');
    await page.waitForSelector('[data-testid="kanban-board"]', { timeout: 5000 });

    const boardData = await page.evaluate(async () => {
      const columns = [
        { id: 1, name: 'To Do', order: 0, createdAt: new Date().toISOString() },
        { id: 2, name: 'Done', order: 1, createdAt: new Date().toISOString() },
      ];

      (window as any).__testEmptyBoardState = { columns, tasks: [] };
      return { columns, tasks: [] };
    });

    await use(boardData);

    await page.evaluate(async () => {
      if ((window as any).db) {
        await (window as any).db.tasks.clear();
        await (window as any).db.columns.clear();
      }
      delete (window as any).__testEmptyBoardState;
    });

    await page.close();
  },
});

/**
 * Unbalanced board fixture
 * 
 * Setup: Creates 3 columns with different task counts (1, 5, 10)
 * Provides: Testing cross-column moves with varying densities
 * Cleanup: Clears database
 */
export const unbalancedBoard = base.extend({
  unbalancedBoard: async ({ page }, use) => {
    await page.goto('/');
    await page.waitForSelector('[data-testid="kanban-board"]', { timeout: 5000 });

    const boardData = await page.evaluate(async () => {
      const columns = [
        { id: 1, name: 'To Do', order: 0, createdAt: new Date().toISOString() },
        { id: 2, name: 'In Progress', order: 1, createdAt: new Date().toISOString() },
        { id: 3, name: 'Done', order: 2, createdAt: new Date().toISOString() },
      ];

      const tasks = [];
      const tasksPerColumn = [1, 5, 10]; // Unbalanced distribution

      let taskId = 1;
      for (let colIndex = 0; colIndex < columns.length; colIndex++) {
        const column = columns[colIndex];
        const count = tasksPerColumn[colIndex];

        for (let i = 0; i < count; i++) {
          tasks.push({
            id: taskId++,
            title: `${column.name} Task ${i + 1}`,
            columnId: column.id,
            priority: 'Medium',
            order: i,
            completed: false,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          });
        }
      }

      (window as any).__testUnbalancedBoardState = { columns, tasks };
      return { columns, tasks };
    });

    await use(boardData);

    await page.evaluate(async () => {
      if ((window as any).db) {
        await (window as any).db.tasks.clear();
        await (window as any).db.columns.clear();
      }
      delete (window as any).__testUnbalancedBoardState;
    });

    await page.close();
  },
});

/**
 * Board with completed tasks fixture
 * 
 * Setup: Columns with mix of completed and active tasks
 * Provides: Testing drag operations with different task states
 * Cleanup: Clears database
 */
export const boardWithCompletedTasks = base.extend({
  boardWithCompletedTasks: async ({ page }, use) => {
    await page.goto('/');
    await page.waitForSelector('[data-testid="kanban-board"]', { timeout: 5000 });

    const boardData = await page.evaluate(async () => {
      const columns = [
        { id: 1, name: 'To Do', order: 0, createdAt: new Date().toISOString() },
        { id: 2, name: 'In Progress', order: 1, createdAt: new Date().toISOString() },
        { id: 3, name: 'Done', order: 2, createdAt: new Date().toISOString() },
      ];

      const tasks = [];
      let taskId = 1;

      // To Do: 2 active tasks
      for (let i = 0; i < 2; i++) {
        tasks.push({
          id: taskId++,
          title: `To Do Task ${i + 1}`,
          columnId: 1,
          priority: 'Medium',
          order: i,
          completed: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
      }

      // In Progress: 1 active task
      tasks.push({
        id: taskId++,
        title: 'In Progress Task 1',
        columnId: 2,
        priority: 'High',
        order: 0,
        completed: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });

      // Done: 3 completed tasks
      for (let i = 0; i < 3; i++) {
        tasks.push({
          id: taskId++,
          title: `Done Task ${i + 1}`,
          columnId: 3,
          priority: 'Low',
          order: i,
          completed: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
      }

      (window as any).__testCompletedBoardState = { columns, tasks };
      return { columns, tasks };
    });

    await use(boardData);

    await page.evaluate(async () => {
      if ((window as any).db) {
        await (window as any).db.tasks.clear();
        await (window as any).db.columns.clear();
      }
      delete (window as any).__testCompletedBoardState;
    });

    await page.close();
  },
});

// Export combined fixture for convenience
export const test = base.extend({
  boardWithTasks: async ({ page }, use) => {
    await page.goto('/');
    await page.waitForSelector('[data-testid="kanban-board"]', { timeout: 5000 });

    const boardData = await page.evaluate(async () => {
      const columns = [
        { id: 1, name: 'To Do', order: 0, createdAt: new Date().toISOString() },
        { id: 2, name: 'In Progress', order: 1, createdAt: new Date().toISOString() },
        { id: 3, name: 'Done', order: 2, createdAt: new Date().toISOString() },
      ];

      const tasks = [];
      let taskId = 1;

      for (const column of columns) {
        for (let i = 0; i < 3; i++) {
          tasks.push({
            id: taskId,
            title: `${column.name} Task ${i + 1}`,
            columnId: column.id,
            priority: 'Medium',
            order: i,
            completed: false,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          });
          taskId++;
        }
      }

      return { columns, tasks };
    });

    await use(boardData);

    await page.evaluate(async () => {
      if ((window as any).db) {
        await (window as any).db.tasks.clear();
        await (window as any).db.columns.clear();
      }
    });

    await page.close();
  },
});
