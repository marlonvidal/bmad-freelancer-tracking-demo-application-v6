/**
 * Subtasks & Quick-Add E2E Tests — Story 1.7
 *
 * ATDD RED PHASE: All tests are intentionally failing (test.skip()).
 * These tests assert EXPECTED behavior before implementation.
 * Remove test.skip() calls after implementing each feature to verify GREEN phase.
 *
 * Activation checklist (add data-testid attributes to components):
 * - [ ] data-testid="task-detail-panel" on TaskDetailPanel/Sheet component
 * - [ ] data-testid="subtask-item" on each subtask row in SubtasksPanel
 * - [ ] data-testid="subtask-checkbox" on each subtask's checkbox element
 * - [ ] data-testid="subtask-title" on subtask title text element
 * - [ ] data-testid="subtask-delete-btn" on each subtask's delete button
 * - [ ] data-testid="subtask-summary" on task card subtask count badge (e.g., "2/3 subtasks done")
 * - [ ] data-testid="add-subtask-btn" on the "Add subtask" button in SubtasksPanel
 * - [ ] data-testid="subtask-input" on the subtask title input field
 * - [ ] data-testid="quick-add-input" on the QuickAddField input element
 * - [ ] data-testid="quick-add-btn" on the quick-add trigger button per column
 * - [ ] data-testid="quick-add-expand-btn" on the expand-to-full-form button
 * - [ ] Keyboard shortcut Cmd+Shift+N / Ctrl+Shift+N registered globally
 *
 * Story ACs covered:
 * AC1 - Create subtasks for a task (P0)
 * AC2 - Display subtask summary on task card (P0)
 * AC3 - Quick-add task with minimal fields (P0)
 * AC4 - Quick-add expansion to full fields (P1)
 * AC5 - Quick-add keyboard shortcut (P1)
 * AC6 - Quick-add column selection (P1)
 * AC7 - Subtask order and persistence (P2)
 * AC8 - Delete subtasks with confirmation (P1)
 * AC9 - Subtask completion state (P0)
 * AC10 - Quick-add focus/blur behavior (P1)
 * AC11 - Quick-add performance < 200ms (P2)
 * AC12 - Validation (required, max 255 chars) (P1)
 */

import { test, expect } from '../support/fixtures/merged-fixtures';
import { createTask } from '../support/factories';
import { createSubtask } from '../support/factories/subtask-factory';
import { seedTasks, seedSubtasks, getTasksFromStorage, getSubtasksFromStorage } from '../support/helpers/local-storage';
import { BoardPage } from '../support/page-objects/board-page';

// ─── Shared Helpers ───────────────────────────────────────────────────────────

/** Open task detail panel by clicking on a task card title. */
async function openTaskDetail(
  page: import('@playwright/test').Page,
  taskTitle: string,
): Promise<void> {
  const board = new BoardPage(page);
  const taskCard = board.getTaskCard(taskTitle);
  await taskCard.click();
  await expect(page.getByTestId('task-detail-panel')).toBeVisible();
}

/** Add a subtask via the detail panel UI. Returns the subtask item locator. */
async function addSubtaskViaUI(
  page: import('@playwright/test').Page,
  subtaskTitle: string,
): Promise<void> {
  const detailPanel = page.getByTestId('task-detail-panel');
  await detailPanel.getByTestId('add-subtask-btn').click();
  await detailPanel.getByTestId('subtask-input').fill(subtaskTitle);
  await page.keyboard.press('Enter');
}

// ─── AC1: Create Subtasks ─────────────────────────────────────────────────────

test.describe('AC1 — Subtasks: Create', () => {
  test.skip('[P0] should display subtasks section with add button in task detail panel', async ({ page }) => {
    // Given a task exists on the board
    const task = createTask({ title: 'Task with subtasks', status: 'todo' });
    await seedTasks(page, [task]);

    const board = new BoardPage(page);
    await board.goto();

    // When the task card is clicked to open detail panel
    await openTaskDetail(page, 'Task with subtasks');

    // Then the detail panel shows a Subtasks section with an add button
    const detailPanel = page.getByTestId('task-detail-panel');
    await expect(detailPanel.getByText(/subtasks/i)).toBeVisible();
    await expect(detailPanel.getByTestId('add-subtask-btn')).toBeVisible();
  });

  test.skip('[P0] should create a subtask for a task via the detail panel', async ({ page }) => {
    // Given a task is open in the detail panel
    const task = createTask({ title: 'Parent task', status: 'todo' });
    await seedTasks(page, [task]);

    const board = new BoardPage(page);
    await board.goto();
    await openTaskDetail(page, 'Parent task');

    // When a subtask is added via the UI
    await addSubtaskViaUI(page, 'First subtask');

    // Then the subtask appears in the detail panel list
    const detailPanel = page.getByTestId('task-detail-panel');
    await expect(detailPanel.getByTestId('subtask-item').filter({ hasText: 'First subtask' })).toBeVisible();
  });

  test.skip('[P0] should persist subtasks to Dexie storage after creation', async ({ page }) => {
    // Given a task is open in the detail panel
    const task = createTask({ title: 'Persistent subtask task', status: 'todo' });
    await seedTasks(page, [task]);

    const board = new BoardPage(page);
    await board.goto();
    await openTaskDetail(page, 'Persistent subtask task');

    // When a subtask is added
    await addSubtaskViaUI(page, 'Persisted subtask');

    // And the page is reloaded
    await page.reload();
    await openTaskDetail(page, 'Persistent subtask task');

    // Then the subtask still exists after reload
    const reloadedPanel = page.getByTestId('task-detail-panel');
    await expect(reloadedPanel.getByTestId('subtask-item').filter({ hasText: 'Persisted subtask' })).toBeVisible();
  });

  test.skip('[P1] should create multiple subtasks in sequence', async ({ page }) => {
    // Given a task is open in the detail panel
    const task = createTask({ title: 'Multi-subtask task', status: 'todo' });
    await seedTasks(page, [task]);

    const board = new BoardPage(page);
    await board.goto();
    await openTaskDetail(page, 'Multi-subtask task');

    const detailPanel = page.getByTestId('task-detail-panel');
    const subtaskTitles = ['Design mockup', 'Implement feature', 'Write tests'];

    // When three subtasks are added
    for (const title of subtaskTitles) {
      await addSubtaskViaUI(page, title);
    }

    // Then all three subtasks are visible in order
    await expect(detailPanel.getByTestId('subtask-item')).toHaveCount(3);
    for (const title of subtaskTitles) {
      await expect(detailPanel.getByTestId('subtask-item').filter({ hasText: title })).toBeVisible();
    }
  });

  test.skip('[P1] should show empty state with CTA when no subtasks exist', async ({ page }) => {
    // Given a task with no subtasks is open
    const task = createTask({ title: 'Empty subtasks task', status: 'todo' });
    await seedTasks(page, [task]);

    const board = new BoardPage(page);
    await board.goto();
    await openTaskDetail(page, 'Empty subtasks task');

    const detailPanel = page.getByTestId('task-detail-panel');

    // Then the subtasks section shows a CTA to add the first subtask
    await expect(detailPanel.getByTestId('subtask-item')).toHaveCount(0);
    await expect(detailPanel.getByTestId('add-subtask-btn')).toBeVisible();
  });
});

// ─── AC2: Subtask Summary on Task Card ───────────────────────────────────────

test.describe('AC2 — Subtasks: Summary on Task Card', () => {
  test.skip('[P0] should display subtask summary badge on task card when subtasks exist', async ({ page }) => {
    // Given a task with pre-seeded subtasks exists
    const task = createTask({ title: 'Summary badge task', status: 'todo' });
    await seedTasks(page, [task]);

    // Seed subtasks directly (task needs an id; use numeric id from factory)
    const subtask1 = createSubtask({ taskId: task.id, title: 'Sub A', completed: false });
    const subtask2 = createSubtask({ taskId: task.id, title: 'Sub B', completed: true });
    await seedSubtasks(page, [subtask1, subtask2]);

    const board = new BoardPage(page);
    await board.goto();

    // Then the task card shows a subtask summary
    const taskCard = board.getTaskCard('Summary badge task');
    await expect(taskCard.getByTestId('subtask-summary')).toBeVisible();
    await expect(taskCard.getByTestId('subtask-summary')).toContainText(/1\/2|1 of 2/);
  });

  test.skip('[P0] should update subtask summary after completing a subtask', async ({ page }) => {
    // Given a task with two subtasks
    const task = createTask({ title: 'Summary update task', status: 'todo' });
    await seedTasks(page, [task]);

    const board = new BoardPage(page);
    await board.goto();
    await openTaskDetail(page, 'Summary update task');

    // When two subtasks are added
    await addSubtaskViaUI(page, 'Subtask one');
    await addSubtaskViaUI(page, 'Subtask two');

    // And one is marked complete
    const detailPanel = page.getByTestId('task-detail-panel');
    const subtaskItem = detailPanel.getByTestId('subtask-item').filter({ hasText: 'Subtask one' });
    await subtaskItem.getByTestId('subtask-checkbox').click();

    // Close the detail panel
    await page.keyboard.press('Escape');

    // Then the task card shows the correct summary "1/2"
    const taskCard = board.getTaskCard('Summary update task');
    await expect(taskCard.getByTestId('subtask-summary')).toContainText(/1\/2|1 of 2/);
  });

  test.skip('[P1] should not show subtask summary when task has no subtasks', async ({ page }) => {
    // Given a task with no subtasks
    const task = createTask({ title: 'No subtasks task', status: 'todo' });
    await seedTasks(page, [task]);

    const board = new BoardPage(page);
    await board.goto();

    // Then the task card does NOT show a subtask summary
    const taskCard = board.getTaskCard('No subtasks task');
    await expect(taskCard.getByTestId('subtask-summary')).not.toBeVisible();
  });

  test.skip('[P2] should show all-done state when all subtasks are complete', async ({ page }) => {
    // Given a task with all subtasks completed
    const task = createTask({ title: 'All done task', status: 'todo' });
    await seedTasks(page, [task]);

    const sub1 = createSubtask({ taskId: task.id, title: 'Sub A', completed: true });
    const sub2 = createSubtask({ taskId: task.id, title: 'Sub B', completed: true });
    await seedSubtasks(page, [sub1, sub2]);

    const board = new BoardPage(page);
    await board.goto();

    // Then the task card shows "2/2" or all-done indicator
    const taskCard = board.getTaskCard('All done task');
    await expect(taskCard.getByTestId('subtask-summary')).toContainText(/2\/2|2 of 2/);
  });
});

// ─── AC9: Subtask Completion State ───────────────────────────────────────────

test.describe('AC9 — Subtasks: Toggle Completion State', () => {
  test.skip('[P0] should mark a subtask as complete via checkbox', async ({ page }) => {
    // Given a task with a subtask is open in the detail panel
    const task = createTask({ title: 'Completable task', status: 'todo' });
    await seedTasks(page, [task]);

    const board = new BoardPage(page);
    await board.goto();
    await openTaskDetail(page, 'Completable task');
    await addSubtaskViaUI(page, 'Complete me');

    const detailPanel = page.getByTestId('task-detail-panel');
    const subtaskItem = detailPanel.getByTestId('subtask-item').filter({ hasText: 'Complete me' });

    // When the subtask checkbox is clicked
    await subtaskItem.getByTestId('subtask-checkbox').click();

    // Then the subtask is marked as complete (checkbox checked)
    await expect(subtaskItem.getByTestId('subtask-checkbox')).toBeChecked();
  });

  test.skip('[P0] should show completed subtask with strikethrough and muted text', async ({ page }) => {
    // Given a task with a subtask is open
    const task = createTask({ title: 'Strikethrough task', status: 'todo' });
    await seedTasks(page, [task]);

    const board = new BoardPage(page);
    await board.goto();
    await openTaskDetail(page, 'Strikethrough task');
    await addSubtaskViaUI(page, 'Strikethrough me');

    const detailPanel = page.getByTestId('task-detail-panel');
    const subtaskItem = detailPanel.getByTestId('subtask-item').filter({ hasText: 'Strikethrough me' });

    // When the subtask is marked complete
    await subtaskItem.getByTestId('subtask-checkbox').click();

    // Then the subtask title is visually distinct (strikethrough)
    const subtaskTitle = subtaskItem.getByTestId('subtask-title');
    await expect(subtaskTitle).toHaveCSS('text-decoration-line', /line-through/);
  });

  test.skip('[P0] should toggle subtask back to incomplete', async ({ page }) => {
    // Given a task with a completed subtask
    const task = createTask({ title: 'Toggle task', status: 'todo' });
    await seedTasks(page, [task]);

    const board = new BoardPage(page);
    await board.goto();
    await openTaskDetail(page, 'Toggle task');
    await addSubtaskViaUI(page, 'Toggle me');

    const detailPanel = page.getByTestId('task-detail-panel');
    const subtaskItem = detailPanel.getByTestId('subtask-item').filter({ hasText: 'Toggle me' });

    // Complete then uncomplete
    await subtaskItem.getByTestId('subtask-checkbox').click();
    await expect(subtaskItem.getByTestId('subtask-checkbox')).toBeChecked();

    await subtaskItem.getByTestId('subtask-checkbox').click();

    // Then the subtask is back to incomplete
    await expect(subtaskItem.getByTestId('subtask-checkbox')).not.toBeChecked();
  });

  test.skip('[P1] should persist subtask completion state after page reload', async ({ page }) => {
    // Given a task with a completed subtask
    const task = createTask({ title: 'Persistent completion task', status: 'todo' });
    await seedTasks(page, [task]);

    const board = new BoardPage(page);
    await board.goto();
    await openTaskDetail(page, 'Persistent completion task');
    await addSubtaskViaUI(page, 'Completed subtask');

    const detailPanel = page.getByTestId('task-detail-panel');
    await detailPanel.getByTestId('subtask-item').filter({ hasText: 'Completed subtask' }).getByTestId('subtask-checkbox').click();

    // When the page is reloaded
    await page.reload();
    await openTaskDetail(page, 'Persistent completion task');

    // Then the subtask is still marked as complete
    const reloadedPanel = page.getByTestId('task-detail-panel');
    const subtaskItem = reloadedPanel.getByTestId('subtask-item').filter({ hasText: 'Completed subtask' });
    await expect(subtaskItem.getByTestId('subtask-checkbox')).toBeChecked();
  });
});

// ─── AC8: Delete Subtasks ─────────────────────────────────────────────────────

test.describe('AC8 — Subtasks: Delete with Confirmation', () => {
  test.skip('[P1] should delete a subtask after confirmation dialog', async ({ page }) => {
    // Given a task with a subtask
    const task = createTask({ title: 'Delete subtask task', status: 'todo' });
    await seedTasks(page, [task]);

    const board = new BoardPage(page);
    await board.goto();
    await openTaskDetail(page, 'Delete subtask task');
    await addSubtaskViaUI(page, 'Delete me subtask');

    const detailPanel = page.getByTestId('task-detail-panel');
    const subtaskItem = detailPanel.getByTestId('subtask-item').filter({ hasText: 'Delete me subtask' });

    // When the delete button is clicked on the subtask
    await subtaskItem.getByTestId('subtask-delete-btn').click();

    // Then a confirmation dialog appears
    await expect(page.getByRole('dialog')).toBeVisible();
    await expect(page.getByText(/delete this subtask/i)).toBeVisible();

    // When deletion is confirmed
    await page.getByRole('button', { name: /confirm|yes|delete/i }).click();

    // Then the subtask is removed
    await expect(detailPanel.getByTestId('subtask-item').filter({ hasText: 'Delete me subtask' })).not.toBeVisible();
  });

  test.skip('[P1] should cancel subtask deletion when user clicks cancel', async ({ page }) => {
    // Given a task with a subtask
    const task = createTask({ title: 'Cancel delete subtask task', status: 'todo' });
    await seedTasks(page, [task]);

    const board = new BoardPage(page);
    await board.goto();
    await openTaskDetail(page, 'Cancel delete subtask task');
    await addSubtaskViaUI(page, 'Keep me subtask');

    const detailPanel = page.getByTestId('task-detail-panel');
    const subtaskItem = detailPanel.getByTestId('subtask-item').filter({ hasText: 'Keep me subtask' });

    // When delete is initiated but cancelled
    await subtaskItem.getByTestId('subtask-delete-btn').click();
    await page.getByRole('button', { name: /cancel|no/i }).click();

    // Then the subtask still exists
    await expect(detailPanel.getByTestId('subtask-item').filter({ hasText: 'Keep me subtask' })).toBeVisible();
  });

  test.skip('[P2] should preserve remaining subtask order after middle subtask deletion', async ({ page }) => {
    // Given a task with three subtasks
    const task = createTask({ title: 'Order preservation task', status: 'todo' });
    await seedTasks(page, [task]);

    const board = new BoardPage(page);
    await board.goto();
    await openTaskDetail(page, 'Order preservation task');

    // Create three subtasks
    for (const title of ['First', 'Second', 'Third']) {
      await addSubtaskViaUI(page, title);
    }

    const detailPanel = page.getByTestId('task-detail-panel');

    // When the second subtask is deleted
    const secondItem = detailPanel.getByTestId('subtask-item').filter({ hasText: 'Second' });
    await secondItem.getByTestId('subtask-delete-btn').click();
    await page.getByRole('button', { name: /confirm|yes|delete/i }).click();

    // Then First and Third remain in correct order
    const remainingItems = await detailPanel.getByTestId('subtask-item').all();
    expect(remainingItems).toHaveLength(2);
    await expect(remainingItems[0]).toContainText('First');
    await expect(remainingItems[1]).toContainText('Third');
  });

  test.skip('[P2] should persist deletion after page reload', async ({ page }) => {
    // Given a task with a subtask that is then deleted
    const task = createTask({ title: 'Persist delete task', status: 'todo' });
    await seedTasks(page, [task]);

    const board = new BoardPage(page);
    await board.goto();
    await openTaskDetail(page, 'Persist delete task');
    await addSubtaskViaUI(page, 'Deleted subtask');

    const detailPanel = page.getByTestId('task-detail-panel');
    const subtaskItem = detailPanel.getByTestId('subtask-item').filter({ hasText: 'Deleted subtask' });
    await subtaskItem.getByTestId('subtask-delete-btn').click();
    await page.getByRole('button', { name: /confirm|yes|delete/i }).click();

    // When the page is reloaded
    await page.reload();
    await openTaskDetail(page, 'Persist delete task');

    // Then the deleted subtask is still gone
    const reloadedPanel = page.getByTestId('task-detail-panel');
    await expect(reloadedPanel.getByTestId('subtask-item').filter({ hasText: 'Deleted subtask' })).not.toBeVisible();
  });
});

// ─── AC7: Subtask Order and Persistence ──────────────────────────────────────

test.describe('AC7 — Subtasks: Order and Persistence', () => {
  test.skip('[P2] should preserve subtask creation order after page reload', async ({ page }) => {
    // Given a task with multiple subtasks created in sequence
    const task = createTask({ title: 'Order task', status: 'todo' });
    await seedTasks(page, [task]);

    const board = new BoardPage(page);
    await board.goto();
    await openTaskDetail(page, 'Order task');

    const subtaskTitles = ['Alpha subtask', 'Beta subtask', 'Gamma subtask'];
    for (const title of subtaskTitles) {
      await addSubtaskViaUI(page, title);
    }

    // When the page is reloaded
    await page.reload();
    await openTaskDetail(page, 'Order task');

    // Then the subtasks are in the same order
    const reloadedPanel = page.getByTestId('task-detail-panel');
    const items = await reloadedPanel.getByTestId('subtask-item').all();
    expect(items).toHaveLength(3);
    await expect(items[0]).toContainText('Alpha subtask');
    await expect(items[1]).toContainText('Beta subtask');
    await expect(items[2]).toContainText('Gamma subtask');
  });

  test.skip('[P2] should maintain order field in storage for each subtask', async ({ page }) => {
    // Given a task with subtasks
    const task = createTask({ title: 'Storage order task', status: 'todo' });
    await seedTasks(page, [task]);

    const board = new BoardPage(page);
    await board.goto();
    await openTaskDetail(page, 'Storage order task');

    await addSubtaskViaUI(page, 'First');
    await addSubtaskViaUI(page, 'Second');

    // Then subtasks in storage have sequential order values
    const storedSubtasks = await getSubtasksFromStorage(page);
    const taskSubtasks = storedSubtasks.filter((s: { taskId: string }) => s.taskId === task.id);
    expect(taskSubtasks).toHaveLength(2);
    expect(taskSubtasks[0].order).toBeDefined();
    expect(taskSubtasks[1].order).toBeGreaterThan(taskSubtasks[0].order);
  });
});

// ─── AC12: Validation ─────────────────────────────────────────────────────────

test.describe('AC12 — Subtasks: Validation', () => {
  test.skip('[P1] should show validation error when subtask title is empty', async ({ page }) => {
    // Given a task is open in the detail panel
    const task = createTask({ title: 'Validation task', status: 'todo' });
    await seedTasks(page, [task]);

    const board = new BoardPage(page);
    await board.goto();
    await openTaskDetail(page, 'Validation task');

    const detailPanel = page.getByTestId('task-detail-panel');

    // When the subtask form is submitted without a title (Enter on empty input)
    await detailPanel.getByTestId('add-subtask-btn').click();
    await page.keyboard.press('Enter');

    // Then a validation error is shown
    await expect(detailPanel.getByText(/title is required/i)).toBeVisible();

    // And no subtask is added
    await expect(detailPanel.getByTestId('subtask-item')).toHaveCount(0);
  });

  test.skip('[P1] should show validation error when subtask title exceeds 255 characters', async ({ page }) => {
    // Given a task is open in the detail panel
    const task = createTask({ title: 'Long title validation task', status: 'todo' });
    await seedTasks(page, [task]);

    const board = new BoardPage(page);
    await board.goto();
    await openTaskDetail(page, 'Long title validation task');

    const detailPanel = page.getByTestId('task-detail-panel');

    // When a subtask title exceeding 255 characters is entered
    await detailPanel.getByTestId('add-subtask-btn').click();
    const longTitle = 'A'.repeat(256);
    await detailPanel.getByTestId('subtask-input').fill(longTitle);
    await page.keyboard.press('Enter');

    // Then a validation error is shown
    await expect(detailPanel.getByText(/255 characters or less|too long/i)).toBeVisible();

    // And no subtask is created
    await expect(detailPanel.getByTestId('subtask-item')).toHaveCount(0);
  });

  test.skip('[P1] should allow subtask with exactly 255 characters', async ({ page }) => {
    // Given a task is open in the detail panel
    const task = createTask({ title: 'Max length task', status: 'todo' });
    await seedTasks(page, [task]);

    const board = new BoardPage(page);
    await board.goto();
    await openTaskDetail(page, 'Max length task');

    const detailPanel = page.getByTestId('task-detail-panel');

    // When a subtask title of exactly 255 characters is entered
    await detailPanel.getByTestId('add-subtask-btn').click();
    const maxTitle = 'A'.repeat(255);
    await detailPanel.getByTestId('subtask-input').fill(maxTitle);
    await page.keyboard.press('Enter');

    // Then the subtask is created successfully (no validation error)
    await expect(detailPanel.getByText(/title is required|255 characters or less/i)).not.toBeVisible();
    await expect(detailPanel.getByTestId('subtask-item')).toHaveCount(1);
  });

  test.skip('[P1] should cancel subtask creation with Escape key', async ({ page }) => {
    // Given the subtask input is shown
    const task = createTask({ title: 'Cancel subtask task', status: 'todo' });
    await seedTasks(page, [task]);

    const board = new BoardPage(page);
    await board.goto();
    await openTaskDetail(page, 'Cancel subtask task');

    const detailPanel = page.getByTestId('task-detail-panel');
    await detailPanel.getByTestId('add-subtask-btn').click();
    await detailPanel.getByTestId('subtask-input').fill('Cancelled subtask');

    // When Escape is pressed
    await page.keyboard.press('Escape');

    // Then the input is cleared/dismissed and no subtask is added
    await expect(detailPanel.getByTestId('subtask-item')).toHaveCount(0);
  });
});

// ─── AC3: Quick-Add Task ──────────────────────────────────────────────────────

test.describe('AC3 — Quick-Add: Create Task with Minimal Fields', () => {
  test.skip('[P0] should create a task via quick-add with title only', async ({ page }) => {
    // Given the board is loaded
    const board = new BoardPage(page);
    await board.goto();

    // When a task is created via quick-add (click button, type, Enter)
    await page.getByTestId('quick-add-btn').first().click();
    await page.getByTestId('quick-add-input').fill('Quick task title');
    await page.keyboard.press('Enter');

    // Then the task appears on the board
    await expect(board.getTaskCard('Quick task title')).toBeVisible();
  });

  test.skip('[P0] should create quick-add task with sensible defaults in storage', async ({ page }) => {
    // Given the board is loaded
    const board = new BoardPage(page);
    await board.goto();

    // When a task is created via quick-add
    await page.getByTestId('quick-add-btn').first().click();
    await page.getByTestId('quick-add-input').fill('Default priority task');
    await page.keyboard.press('Enter');

    // Then the task is in storage with correct defaults
    const storedTasks = await getTasksFromStorage(page);
    const created = storedTasks.find((t: { title: string }) => t.title === 'Default priority task');
    expect(created).toBeTruthy();
    expect(created?.priority).toMatch(/medium/i);
    expect(created?.completed ?? false).toBe(false);
  });

  test.skip('[P0] should not create a quick-add task without a title', async ({ page }) => {
    // Given the board is loaded
    const board = new BoardPage(page);
    await board.goto();

    const initialTaskCount = (await getTasksFromStorage(page)).length;

    // When quick-add is submitted without a title (Enter on empty field)
    await page.getByTestId('quick-add-btn').first().click();
    await page.keyboard.press('Enter');

    // Then a validation error is shown and no task is created
    await expect(page.getByText(/title is required/i)).toBeVisible();
    const newTaskCount = (await getTasksFromStorage(page)).length;
    expect(newTaskCount).toBe(initialTaskCount);
  });

  test.skip('[P1] should clear quick-add input after successful task creation', async ({ page }) => {
    // Given the board is loaded and quick-add is triggered
    const board = new BoardPage(page);
    await board.goto();

    await page.getByTestId('quick-add-btn').first().click();
    await page.getByTestId('quick-add-input').fill('Created task');
    await page.keyboard.press('Enter');

    // Then the input is cleared (ready for next task)
    await expect(page.getByTestId('quick-add-input')).toHaveValue('');
  });

  test.skip('[P1] should create multiple tasks in sequence via quick-add', async ({ page }) => {
    // Given the board is loaded
    const board = new BoardPage(page);
    await board.goto();

    // When three tasks are created via quick-add in sequence
    const titles = ['Task Alpha', 'Task Beta', 'Task Gamma'];
    await page.getByTestId('quick-add-btn').first().click();
    for (const title of titles) {
      await page.getByTestId('quick-add-input').fill(title);
      await page.keyboard.press('Enter');
    }

    // Then all three tasks appear on the board
    for (const title of titles) {
      await expect(board.getTaskCard(title)).toBeVisible();
    }

    // And all three are in storage
    const storedTasks = await getTasksFromStorage(page);
    const createdTitles = storedTasks.map((t: { title: string }) => t.title);
    for (const title of titles) {
      expect(createdTitles).toContain(title);
    }
  });
});

// ─── AC10: Quick-Add Focus/Blur Behavior ─────────────────────────────────────

test.describe('AC10 — Quick-Add: Focus and Blur Behavior', () => {
  test.skip('[P1] should cancel quick-add and clear input on Escape key', async ({ page }) => {
    // Given the board is loaded and quick-add is active
    const board = new BoardPage(page);
    await board.goto();

    await page.getByTestId('quick-add-btn').first().click();
    await page.getByTestId('quick-add-input').fill('Cancelled task');

    // When Escape is pressed
    await page.keyboard.press('Escape');

    // Then no task is created and input is cleared/dismissed
    await expect(board.getTaskCard('Cancelled task')).not.toBeVisible();
    const storedTasks = await getTasksFromStorage(page);
    const found = storedTasks.find((t: { title: string }) => t.title === 'Cancelled task');
    expect(found).toBeFalsy();
  });

  test.skip('[P1] should clear quick-add input when user clicks away (blur on empty field)', async ({ page }) => {
    // Given the board is loaded with quick-add open and empty
    const board = new BoardPage(page);
    await board.goto();

    await page.getByTestId('quick-add-btn').first().click();

    // When clicking outside the input (blur on empty field)
    await page.click('body');

    // Then the quick-add input returns to a normal state (no error shown)
    await expect(page.getByText(/title is required/i)).not.toBeVisible();
  });

  test.skip('[P1] should auto-focus quick-add input when triggered', async ({ page }) => {
    // Given the board is loaded
    const board = new BoardPage(page);
    await board.goto();

    // When quick-add is triggered via button
    await page.getByTestId('quick-add-btn').first().click();

    // Then the quick-add input is focused immediately
    await expect(page.getByTestId('quick-add-input')).toBeFocused();
  });
});

// ─── AC5: Quick-Add Keyboard Shortcut ────────────────────────────────────────

test.describe('AC5 — Quick-Add: Keyboard Shortcut', () => {
  test.skip('[P1] should activate quick-add via Cmd+Shift+N (Mac)', async ({ page }) => {
    // Given the board is loaded with no quick-add active
    const board = new BoardPage(page);
    await board.goto();

    // When the Mac keyboard shortcut is pressed
    await page.keyboard.press('Meta+Shift+N');

    // Then the quick-add input is focused and active
    await expect(page.getByTestId('quick-add-input')).toBeFocused();
  });

  test.skip('[P1] should activate quick-add via Ctrl+Shift+N (Windows/Linux)', async ({ page }) => {
    // Given the board is loaded with no quick-add active
    const board = new BoardPage(page);
    await board.goto();

    // When the Windows/Linux keyboard shortcut is pressed
    await page.keyboard.press('Control+Shift+N');

    // Then the quick-add input is focused and active
    await expect(page.getByTestId('quick-add-input')).toBeFocused();
  });

  test.skip('[P1] should create a task and keep quick-add focused for sequential creation', async ({ page }) => {
    // Given the board is loaded
    const board = new BoardPage(page);
    await board.goto();

    // When a task is created via keyboard shortcut
    await page.keyboard.press('Meta+Shift+N');
    await page.getByTestId('quick-add-input').fill('Keyboard shortcut task');
    await page.keyboard.press('Enter');

    // Then the task appears on the board
    await expect(board.getTaskCard('Keyboard shortcut task')).toBeVisible();

    // And focus returns to quick-add for sequential creation
    await expect(page.getByTestId('quick-add-input')).toBeFocused();
  });

  test.skip('[P2] should dismiss quick-add via Escape after keyboard shortcut activation', async ({ page }) => {
    // Given quick-add is activated via keyboard shortcut
    const board = new BoardPage(page);
    await board.goto();

    await page.keyboard.press('Meta+Shift+N');
    await expect(page.getByTestId('quick-add-input')).toBeFocused();

    // When Escape is pressed
    await page.keyboard.press('Escape');

    // Then quick-add input is not focused (dismissed or reset)
    await expect(page.getByTestId('quick-add-input')).not.toBeFocused();
  });
});

// ─── AC6: Quick-Add Column Selection ─────────────────────────────────────────

test.describe('AC6 — Quick-Add: Column Selection', () => {
  test.skip('[P1] should quick-add task to the column where the button is clicked', async ({ page }) => {
    // Given the board has multiple columns
    const board = new BoardPage(page);
    await board.goto();

    // When quick-add is triggered from the "In Progress" column
    const inProgressColumn = board.getColumn('in-progress');
    await inProgressColumn.getByTestId('quick-add-btn').click();
    await page.getByTestId('quick-add-input').fill('Column-specific task');
    await page.keyboard.press('Enter');

    // Then the task appears in the In Progress column specifically
    await expect(inProgressColumn.getByText('Column-specific task')).toBeVisible();
  });

  test.skip('[P1] should quick-add task to "To Do" column by default', async ({ page }) => {
    // Given the board is loaded
    const board = new BoardPage(page);
    await board.goto();

    // When a task is created via the first quick-add button (default column)
    await page.getByTestId('quick-add-btn').first().click();
    await page.getByTestId('quick-add-input').fill('Default column task');
    await page.keyboard.press('Enter');

    // Then the task appears in the first (default) column
    const firstColumn = board.getColumn('todo');
    await expect(firstColumn.getByText('Default column task')).toBeVisible();
  });

  test.skip('[P2] should show visual indicator of selected column in quick-add', async ({ page }) => {
    // Given the board is loaded
    const board = new BoardPage(page);
    await board.goto();

    // When quick-add is triggered from the Review column
    const reviewColumn = board.getColumn('review');
    await reviewColumn.getByTestId('quick-add-btn').click();

    // Then the quick-add UI indicates which column is selected
    await expect(page.getByTestId('quick-add-input')).toBeVisible();
    // The column name should be visible in the quick-add context
    await expect(page.getByText(/review/i)).toBeVisible();
  });
});

// ─── AC4: Quick-Add Expansion to Full Form ───────────────────────────────────

test.describe('AC4 — Quick-Add: Expand to Full Form', () => {
  test.skip('[P1] should expand quick-add task to full edit form', async ({ page }) => {
    // Given a task was created via quick-add
    const board = new BoardPage(page);
    await board.goto();

    await page.getByTestId('quick-add-btn').first().click();
    await page.getByTestId('quick-add-input').fill('Expandable task');
    await page.keyboard.press('Enter');

    // When the edit button is clicked on the task card
    const form = await board.openTaskEditForm('Expandable task');

    // Then the full task form is shown with the title pre-filled
    await expect(form.titleInput).toHaveValue('Expandable task');

    // And all standard fields are available for editing
    await expect(form.descriptionInput).toBeVisible();
    await expect(form.prioritySelect).toBeVisible();
    await expect(form.dueDateInput).toBeVisible();
  });

  test.skip('[P2] should pre-fill priority default (Medium) in expanded form from quick-add', async ({ page }) => {
    // Given a task was created via quick-add
    const board = new BoardPage(page);
    await board.goto();

    await page.getByTestId('quick-add-btn').first().click();
    await page.getByTestId('quick-add-input').fill('Defaults task');
    await page.keyboard.press('Enter');

    // When the full edit form is opened
    const form = await board.openTaskEditForm('Defaults task');

    // Then the priority field shows the default (Medium)
    await expect(form.prioritySelect).toHaveValue(/medium/i);
  });

  test.skip('[P1] should quick-add expand via expand button before saving', async ({ page }) => {
    // Given quick-add is active with a title typed
    const board = new BoardPage(page);
    await board.goto();

    await page.getByTestId('quick-add-btn').first().click();
    await page.getByTestId('quick-add-input').fill('Expand before save');

    // When the expand button (chevron/Edit) is clicked
    await page.getByTestId('quick-add-expand-btn').click();

    // Then the full task form opens with the typed title pre-filled
    await expect(page.getByRole('dialog')).toBeVisible();
    await expect(page.getByRole('textbox', { name: /title/i })).toHaveValue('Expand before save');
  });
});

// ─── AC12: Quick-Add Validation ──────────────────────────────────────────────

test.describe('AC12 — Quick-Add: Validation', () => {
  test.skip('[P1] should show validation error for quick-add with empty title', async ({ page }) => {
    // Given the board is loaded and quick-add is open
    const board = new BoardPage(page);
    await board.goto();

    await page.getByTestId('quick-add-btn').first().click();

    // When Enter is pressed with no title
    await page.keyboard.press('Enter');

    // Then validation error is shown
    await expect(page.getByText(/title is required/i)).toBeVisible();
  });

  test.skip('[P1] should show validation error for quick-add with title over 255 characters', async ({ page }) => {
    // Given the board is loaded and quick-add is open
    const board = new BoardPage(page);
    await board.goto();

    await page.getByTestId('quick-add-btn').first().click();

    // When a title over 255 characters is entered
    const longTitle = 'A'.repeat(256);
    await page.getByTestId('quick-add-input').fill(longTitle);
    await page.keyboard.press('Enter');

    // Then validation error is shown and task is not created
    await expect(page.getByText(/255 characters or less|too long/i)).toBeVisible();
    const storedTasks = await getTasksFromStorage(page);
    expect(storedTasks).toHaveLength(0);
  });
});

// ─── AC11: Quick-Add Performance ─────────────────────────────────────────────

test.describe('AC11 — Quick-Add: Performance', () => {
  test.skip('[P2] should create a task via quick-add in under 200ms', async ({ page }) => {
    // Given the board is loaded
    const board = new BoardPage(page);
    await board.goto();

    await page.getByTestId('quick-add-btn').first().click();
    await page.getByTestId('quick-add-input').fill('Performance task');

    // When the task is created (measure time)
    const start = Date.now();
    await page.keyboard.press('Enter');

    // Then the task appears on the board
    await expect(board.getTaskCard('Performance task')).toBeVisible();
    const elapsed = Date.now() - start;

    // And the operation completed in under 200ms (plus Playwright overhead)
    expect(elapsed).toBeLessThan(500); // Allow 500ms buffer for test environment overhead
  });

  test.skip('[P2] should remain responsive when creating tasks on a board with 50+ tasks', async ({ page }) => {
    // Given the board has 50 existing tasks
    const existingTasks = Array.from({ length: 50 }, (_, i) =>
      createTask({ title: `Existing task ${i + 1}`, status: 'todo' }),
    );
    await seedTasks(page, existingTasks);

    const board = new BoardPage(page);
    await board.goto();

    // When a new task is created via quick-add on a board with 50+ tasks
    await page.getByTestId('quick-add-btn').first().click();
    await page.getByTestId('quick-add-input').fill('New task on large board');

    const start = Date.now();
    await page.keyboard.press('Enter');

    await expect(board.getTaskCard('New task on large board')).toBeVisible();
    const elapsed = Date.now() - start;

    // Then the creation still completes within performance budget
    expect(elapsed).toBeLessThan(500);
  });
});

// ─── Accessibility ────────────────────────────────────────────────────────────

test.describe('Accessibility — Keyboard Navigation', () => {
  test.skip('[P1] should support Tab navigation through subtask items in detail panel', async ({ page }) => {
    // Given a task with subtasks is open
    const task = createTask({ title: 'Accessible task', status: 'todo' });
    await seedTasks(page, [task]);

    const board = new BoardPage(page);
    await board.goto();
    await openTaskDetail(page, 'Accessible task');
    await addSubtaskViaUI(page, 'Tab me');

    // When Tab is pressed from the add button area
    await page.getByTestId('task-detail-panel').getByTestId('add-subtask-btn').focus();
    await page.keyboard.press('Tab');

    // Then focus moves to subtask items (checkbox or delete button)
    const focusedElement = page.locator(':focus');
    await expect(focusedElement).toBeVisible();
  });

  test.skip('[P1] should support keyboard shortcut from board without mouse interaction', async ({ page }) => {
    // Given the board is loaded and focused
    const board = new BoardPage(page);
    await board.goto();
    await page.click(board.boardContainer);

    // When the keyboard shortcut is used
    await page.keyboard.press('Meta+Shift+N');

    // Then quick-add is accessible via keyboard
    await expect(page.getByTestId('quick-add-input')).toBeFocused();

    // And a task can be created without touching the mouse
    await page.keyboard.type('Keyboard-only task');
    await page.keyboard.press('Enter');

    await expect(board.getTaskCard('Keyboard-only task')).toBeVisible();
  });

  test.skip('[P2] should announce subtask completion state to screen readers', async ({ page }) => {
    // Given a subtask exists
    const task = createTask({ title: 'Screen reader task', status: 'todo' });
    await seedTasks(page, [task]);

    const board = new BoardPage(page);
    await board.goto();
    await openTaskDetail(page, 'Screen reader task');
    await addSubtaskViaUI(page, 'Announced subtask');

    const detailPanel = page.getByTestId('task-detail-panel');
    const subtaskCheckbox = detailPanel
      .getByTestId('subtask-item')
      .filter({ hasText: 'Announced subtask' })
      .getByTestId('subtask-checkbox');

    // Then the checkbox has an accessible label
    await expect(subtaskCheckbox).toHaveAttribute('aria-label', /Announced subtask/i);
  });
});
