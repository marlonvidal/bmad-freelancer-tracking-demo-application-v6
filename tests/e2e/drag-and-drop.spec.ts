/**
 * Drag-and-Drop E2E Tests — Story 1.6
 *
 * Tests for moving and reordering tasks via drag-and-drop.
 * These tests are ready-to-activate once story 1.6 is implemented.
 *
 * Activation checklist:
 * - [ ] @dnd-kit integrated into kanban board
 * - [ ] data-testid="task-card" on each task card
 * - [ ] data-testid="column-{name}" on each column
 * - [ ] data-testid="drop-indicator" on drop target indicator
 * - [ ] Keyboard DnD support via @dnd-kit keyboard sensor
 * - [ ] Remove skip tags from tests as features are implemented
 */
import { test, expect } from '../support/fixtures/merged-fixtures';
import {
  createTask,
  createInProgressTask,
  createCompletedTask,
} from '../support/factories';
import { seedTasks, getTasksFromStorage } from '../support/helpers/local-storage';
import { BoardPage } from '../support/page-objects/board-page';

// Helper: drag a task card to a target column using mouse events
async function dragTaskToColumn(
  page: import('@playwright/test').Page,
  taskTitle: string,
  targetColumnName: string,
): Promise<void> {
  const board = new BoardPage(page);
  const taskCard = board.getTaskCard(taskTitle);
  const targetColumn = board.getColumn(targetColumnName);

  const taskBox = await taskCard.boundingBox();
  const columnBox = await targetColumn.boundingBox();

  if (!taskBox || !columnBox) throw new Error(`Could not get bounding box for task or column`);

  // Drag from task card center to target column center
  await page.mouse.move(taskBox.x + taskBox.width / 2, taskBox.y + taskBox.height / 2);
  await page.mouse.down();
  await page.mouse.move(columnBox.x + columnBox.width / 2, columnBox.y + columnBox.height / 2, { steps: 10 });
  await page.mouse.up();
}

test.describe('Drag-and-Drop — Move Between Columns', () => {
  test.skip('[P0] should move a task from one column to another', async ({ page }) => {
    // Given a task in the Backlog column
    const task = createTask({ title: 'Move me task', status: 'todo' });
    await seedTasks(page, [task]);

    const board = new BoardPage(page);
    await board.goto();

    // When the task is dragged to the In Progress column
    await dragTaskToColumn(page, 'Move me task', 'In Progress');

    // Then the task appears in the In Progress column
    const inProgressColumn = board.getColumn('In Progress');
    await expect(inProgressColumn.getByText('Move me task')).toBeVisible();

    // And the task no longer appears in the Backlog column
    const backlogColumn = board.getColumn('Backlog');
    await expect(backlogColumn.getByText('Move me task')).not.toBeVisible();
  });

  test.skip('[P0] should persist task column change after page reload', async ({ page }) => {
    // Given a task is moved from Backlog to In Progress
    const task = createTask({ title: 'Persistent move task', status: 'todo' });
    await seedTasks(page, [task]);

    const board = new BoardPage(page);
    await board.goto();
    await dragTaskToColumn(page, 'Persistent move task', 'In Progress');

    // When the page is reloaded
    await page.reload();

    // Then the task is still in the In Progress column
    const inProgressColumn = board.getColumn('In Progress');
    await expect(inProgressColumn.getByText('Persistent move task')).toBeVisible();

    // And the task status is updated in storage
    const storedTasks = await getTasksFromStorage(page);
    const moved = storedTasks.find((t: { title: string }) => t.title === 'Persistent move task');
    expect(moved?.status).toBe('in-progress');
  });

  test.skip('[P0] should show visual drop indicator during drag', async ({ page }) => {
    // Given a task in the Backlog column
    const task = createTask({ title: 'Drag indicator task', status: 'todo' });
    await seedTasks(page, [task]);

    const board = new BoardPage(page);
    await board.goto();

    const taskCard = board.getTaskCard('Drag indicator task');
    const taskBox = await taskCard.boundingBox();
    if (!taskBox) throw new Error('No bounding box');

    // When the task is being dragged (mouse down, move but not release)
    await page.mouse.move(taskBox.x + taskBox.width / 2, taskBox.y + taskBox.height / 2);
    await page.mouse.down();

    const inProgressColumn = board.getColumn('In Progress');
    const columnBox = await inProgressColumn.boundingBox();
    if (!columnBox) throw new Error('No column bounding box');

    await page.mouse.move(columnBox.x + columnBox.width / 2, columnBox.y + columnBox.height / 2, { steps: 5 });

    // Then the target column is highlighted as a valid drop target
    await expect(inProgressColumn).toHaveClass(/highlight|drag-over|drop-target/);

    await page.mouse.up();
  });

  test.skip('[P1] should move task from In Progress to Done', async ({ page }) => {
    // Given a task in the In Progress column
    const task = createInProgressTask({ title: 'Completing task' });
    await seedTasks(page, [task]);

    const board = new BoardPage(page);
    await board.goto();

    // When the task is dragged to the Done column
    await dragTaskToColumn(page, 'Completing task', 'Done');

    // Then the task appears in the Done column
    const doneColumn = board.getColumn('Done');
    await expect(doneColumn.getByText('Completing task')).toBeVisible();

    // And the task status is updated in storage
    const storedTasks = await getTasksFromStorage(page);
    const moved = storedTasks.find((t: { title: string }) => t.title === 'Completing task');
    expect(moved?.status).toBe('done');
  });

  test.skip('[P1] should move task back from Done to Backlog', async ({ page }) => {
    // Given a completed task
    const task = createCompletedTask({ title: 'Reopen task' });
    await seedTasks(page, [task]);

    const board = new BoardPage(page);
    await board.goto();

    // When the task is dragged back to the Backlog column
    await dragTaskToColumn(page, 'Reopen task', 'Backlog');

    // Then the task appears in the Backlog column
    const backlogColumn = board.getColumn('Backlog');
    await expect(backlogColumn.getByText('Reopen task')).toBeVisible();
  });
});

test.describe('Drag-and-Drop — Reorder Within Column', () => {
  test.skip('[P0] should reorder tasks within the same column', async ({ page }) => {
    // Given two tasks in the Backlog column
    const tasks = [
      createTask({ title: 'First task', status: 'todo' }),
      createTask({ title: 'Second task', status: 'todo' }),
      createTask({ title: 'Third task', status: 'todo' }),
    ];
    await seedTasks(page, tasks);

    const board = new BoardPage(page);
    await board.goto();

    const backlogColumn = board.getColumn('Backlog');

    // Verify initial order: First, Second, Third
    const initialCards = await backlogColumn.getByTestId('task-card').all();
    expect(initialCards).toHaveLength(3);

    // When the first task is dragged below the third task
    const firstCard = board.getTaskCard('First task');
    const thirdCard = board.getTaskCard('Third task');

    const firstBox = await firstCard.boundingBox();
    const thirdBox = await thirdCard.boundingBox();
    if (!firstBox || !thirdBox) throw new Error('No bounding box');

    await page.mouse.move(firstBox.x + firstBox.width / 2, firstBox.y + firstBox.height / 2);
    await page.mouse.down();
    await page.mouse.move(thirdBox.x + thirdBox.width / 2, thirdBox.y + thirdBox.height + 5, { steps: 10 });
    await page.mouse.up();

    // Then the order changes: Second, Third, First
    const reorderedCards = await backlogColumn.getByTestId('task-card').all();
    const firstCardText = await reorderedCards[0].textContent();
    expect(firstCardText).toContain('Second task');
  });

  test.skip('[P0] should persist reordered task positions after reload', async ({ page }) => {
    // Given two tasks in the Backlog column
    const tasks = [
      createTask({ title: 'Alpha task', status: 'todo' }),
      createTask({ title: 'Beta task', status: 'todo' }),
    ];
    await seedTasks(page, tasks);

    const board = new BoardPage(page);
    await board.goto();

    // When Alpha is dragged below Beta
    const alphaCard = board.getTaskCard('Alpha task');
    const betaCard = board.getTaskCard('Beta task');

    const alphaBox = await alphaCard.boundingBox();
    const betaBox = await betaCard.boundingBox();
    if (!alphaBox || !betaBox) throw new Error('No bounding box');

    await page.mouse.move(alphaBox.x + alphaBox.width / 2, alphaBox.y + alphaBox.height / 2);
    await page.mouse.down();
    await page.mouse.move(betaBox.x + betaBox.width / 2, betaBox.y + betaBox.height + 5, { steps: 10 });
    await page.mouse.up();

    // When the page is reloaded
    await page.reload();

    // Then the order is preserved: Beta first, Alpha second
    const backlogColumn = board.getColumn('Backlog');
    const cards = await backlogColumn.getByTestId('task-card').all();
    const firstText = await cards[0].textContent();
    expect(firstText).toContain('Beta task');
  });

  test.skip('[P1] should show drop indicator during reorder', async ({ page }) => {
    // Given two tasks in the Backlog column
    const tasks = [
      createTask({ title: 'Task A', status: 'todo' }),
      createTask({ title: 'Task B', status: 'todo' }),
    ];
    await seedTasks(page, tasks);

    const board = new BoardPage(page);
    await board.goto();

    const taskACard = board.getTaskCard('Task A');
    const taskBCard = board.getTaskCard('Task B');

    const taskABox = await taskACard.boundingBox();
    const taskBBox = await taskBCard.boundingBox();
    if (!taskABox || !taskBBox) throw new Error('No bounding box');

    // When dragging Task A over Task B
    await page.mouse.move(taskABox.x + taskABox.width / 2, taskABox.y + taskABox.height / 2);
    await page.mouse.down();
    await page.mouse.move(taskBBox.x + taskBBox.width / 2, taskBBox.y + taskBBox.height / 2, { steps: 5 });

    // Then a drop indicator is visible
    await expect(page.getByTestId('drop-indicator')).toBeVisible();

    await page.mouse.up();
  });
});

test.describe('Drag-and-Drop — Keyboard Accessibility', () => {
  test.skip('[P1] should support keyboard-based task movement between columns', async ({ page }) => {
    // Given a task in the Backlog column
    const task = createTask({ title: 'Keyboard move task', status: 'todo' });
    await seedTasks(page, [task]);

    const board = new BoardPage(page);
    await board.goto();

    // When the task card is focused and moved via keyboard
    const taskCard = board.getTaskCard('Keyboard move task');
    await taskCard.focus();

    // Activate drag mode (Space key per @dnd-kit)
    await page.keyboard.press('Space');

    // Move to next column (ArrowRight per @dnd-kit keyboard sensor)
    await page.keyboard.press('ArrowRight');

    // Drop (Space or Enter to confirm)
    await page.keyboard.press('Space');

    // Then the task is in the In Progress column
    const inProgressColumn = board.getColumn('In Progress');
    await expect(inProgressColumn.getByText('Keyboard move task')).toBeVisible();
  });

  test.skip('[P1] should announce drag-and-drop actions to screen readers', async ({ page }) => {
    // Given a task in the Backlog column
    const task = createTask({ title: 'Accessible drag task', status: 'todo' });
    await seedTasks(page, [task]);

    const board = new BoardPage(page);
    await board.goto();

    const taskCard = board.getTaskCard('Accessible drag task');
    await taskCard.focus();
    await page.keyboard.press('Space');

    // Then an aria-live region announces the drag start
    const liveRegion = page.locator('[aria-live]');
    await expect(liveRegion).toContainText(/picked up|dragging|lifted/i);

    await page.keyboard.press('Escape'); // Cancel drag
  });

  test.skip('[P2] should cancel drag with Escape key', async ({ page }) => {
    // Given a task in the Backlog column
    const task = createTask({ title: 'Cancel drag task', status: 'todo' });
    await seedTasks(page, [task]);

    const board = new BoardPage(page);
    await board.goto();

    const taskCard = board.getTaskCard('Cancel drag task');
    const taskBox = await taskCard.boundingBox();
    if (!taskBox) throw new Error('No bounding box');

    // When drag is initiated then cancelled with Escape
    await page.mouse.move(taskBox.x + taskBox.width / 2, taskBox.y + taskBox.height / 2);
    await page.mouse.down();
    await page.mouse.move(taskBox.x + 200, taskBox.y, { steps: 5 });
    await page.keyboard.press('Escape');
    await page.mouse.up();

    // Then the task remains in the Backlog column
    const backlogColumn = board.getColumn('Backlog');
    await expect(backlogColumn.getByText('Cancel drag task')).toBeVisible();
  });
});

test.describe('Drag-and-Drop — Error Recovery', () => {
  test.skip('[P1] should show error message if Dexie save fails during move', async ({ page }) => {
    // Given a task in the Backlog column
    const task = createTask({ title: 'Error recovery task', status: 'todo' });
    await seedTasks(page, [task]);

    const board = new BoardPage(page);
    await board.goto();

    // When IndexedDB is unavailable (simulate by intercepting storage)
    await page.addInitScript(() => {
      // Override indexedDB to simulate failure
      const originalOpen = indexedDB.open.bind(indexedDB);
      let callCount = 0;
      Object.defineProperty(window, 'indexedDB', {
        get: () => ({
          open: (...args: Parameters<typeof originalOpen>) => {
            callCount++;
            if (callCount > 5) {
              // Fail after initial load
              const req = originalOpen(...args);
              req.addEventListener('success', () => {
                // Force transaction failure
              });
              return req;
            }
            return originalOpen(...args);
          },
        }),
      });
    });

    await dragTaskToColumn(page, 'Error recovery task', 'In Progress');

    // Then an error message is shown
    await expect(page.getByText(/failed to move task|please try again/i)).toBeVisible();

    // And the task reverts to its original column
    const backlogColumn = board.getColumn('Backlog');
    await expect(backlogColumn.getByText('Error recovery task')).toBeVisible();
  });
});

test.describe('Drag-and-Drop — Performance', () => {
  test.skip('[P2] should handle 20+ tasks without performance degradation', async ({ page }) => {
    // Given 20 tasks spread across columns
    const tasks = [
      ...Array.from({ length: 8 }, (_, i) => createTask({ title: `Backlog task ${i + 1}`, status: 'todo' })),
      ...Array.from({ length: 6 }, (_, i) => createInProgressTask({ title: `Active task ${i + 1}` })),
      ...Array.from({ length: 6 }, (_, i) => createCompletedTask({ title: `Done task ${i + 1}` })),
    ];
    await seedTasks(page, tasks);

    const board = new BoardPage(page);
    await board.goto();

    // When a task is dragged between columns
    const startTime = Date.now();
    await dragTaskToColumn(page, 'Backlog task 1', 'In Progress');
    const elapsed = Date.now() - startTime;

    // Then the drag operation completes within 2 seconds
    expect(elapsed).toBeLessThan(2000);

    // And the task is in the correct column
    const inProgressColumn = board.getColumn('In Progress');
    await expect(inProgressColumn.getByText('Backlog task 1')).toBeVisible();
  });

  test.skip('[P2] should respect prefers-reduced-motion', async ({ page }) => {
    // Given the user prefers reduced motion
    await page.emulateMedia({ reducedMotion: 'reduce' });

    const task = createTask({ title: 'Reduced motion task', status: 'todo' });
    await seedTasks(page, [task]);

    const board = new BoardPage(page);
    await board.goto();

    // When a task is dragged
    await dragTaskToColumn(page, 'Reduced motion task', 'In Progress');

    // Then the task moves without animation (no transition classes)
    const inProgressColumn = board.getColumn('In Progress');
    await expect(inProgressColumn.getByText('Reduced motion task')).toBeVisible();

    // And no animation-related CSS classes are applied during drag
    const taskCard = board.getTaskCard('Reduced motion task');
    const classes = await taskCard.getAttribute('class');
    expect(classes).not.toMatch(/animate|transition|motion/);
  });
});

test.describe('Drag-and-Drop — Data Integrity', () => {
  test.skip('[P0] should preserve all task fields after move', async ({ page }) => {
    // Given a task with all fields populated
    const task = createTask({
      title: 'Full field drag task',
      description: 'Detailed description',
      priority: 'high',
      tags: ['frontend', 'critical'],
      estimatedHours: 8,
      status: 'todo',
    });
    await seedTasks(page, [task]);

    const board = new BoardPage(page);
    await board.goto();

    // When the task is moved to In Progress
    await dragTaskToColumn(page, 'Full field drag task', 'In Progress');

    // Then all task fields are preserved in storage
    const storedTasks = await getTasksFromStorage(page);
    const moved = storedTasks.find((t: { title: string }) => t.title === 'Full field drag task');

    expect(moved).toBeTruthy();
    expect(moved?.description).toBe('Detailed description');
    expect(moved?.priority).toBe('high');
    expect(moved?.tags).toEqual(['frontend', 'critical']);
    expect(moved?.estimatedHours).toBe(8);
    expect(moved?.id).toBe(task.id);
  });
});
