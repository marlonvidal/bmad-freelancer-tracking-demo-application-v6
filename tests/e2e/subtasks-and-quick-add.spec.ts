/**
 * Subtasks & Quick-Add E2E Tests — Story 1.7
 *
 * Tests for creating subtasks under tasks and quick-adding tasks with minimal fields.
 * These tests are ready-to-activate once story 1.7 is implemented.
 *
 * Activation checklist:
 * - [ ] Task detail panel implemented with subtasks section
 * - [ ] data-testid="task-detail-panel" on detail panel
 * - [ ] data-testid="subtask-item" on each subtask row
 * - [ ] data-testid="subtask-checkbox" on each subtask checkbox
 * - [ ] data-testid="subtask-summary" on task card subtask summary (e.g., "2/3 subtasks done")
 * - [ ] data-testid="quick-add-input" on quick-add field
 * - [ ] data-testid="quick-add-button" on quick-add trigger
 * - [ ] Keyboard shortcut Cmd+Shift+N / Ctrl+Shift+N for quick-add
 * - [ ] Remove skip tags from tests as features are implemented
 */
import { test, expect } from '../support/fixtures/merged-fixtures';
import { createTask } from '../support/factories';
import { seedTasks, getTasksFromStorage } from '../support/helpers/local-storage';
import { BoardPage } from '../support/page-objects/board-page';

// Helper: open task detail panel by clicking on a task card
async function openTaskDetail(
  page: import('@playwright/test').Page,
  taskTitle: string,
): Promise<void> {
  const board = new BoardPage(page);
  const taskCard = board.getTaskCard(taskTitle);
  await taskCard.click();
  await expect(page.getByTestId('task-detail-panel')).toBeVisible();
}

test.describe('Subtasks — Create', () => {
  test.skip('[P0] should display subtasks section in task detail panel', async ({ page }) => {
    // Given a task exists on the board
    const task = createTask({ title: 'Task with subtasks' });
    await seedTasks(page, [task]);

    const board = new BoardPage(page);
    await board.goto();

    // When the task card is clicked to open detail panel
    await openTaskDetail(page, 'Task with subtasks');

    // Then the detail panel shows a Subtasks section
    const detailPanel = page.getByTestId('task-detail-panel');
    await expect(detailPanel.getByText(/subtasks/i)).toBeVisible();
    await expect(detailPanel.getByRole('button', { name: /add subtask/i })).toBeVisible();
  });

  test.skip('[P0] should create a subtask for a task', async ({ page }) => {
    // Given a task is open in the detail panel
    const task = createTask({ title: 'Parent task' });
    await seedTasks(page, [task]);

    const board = new BoardPage(page);
    await board.goto();
    await openTaskDetail(page, 'Parent task');

    const detailPanel = page.getByTestId('task-detail-panel');

    // When a subtask is added
    await detailPanel.getByRole('button', { name: /add subtask/i }).click();
    await detailPanel.getByRole('textbox', { name: /subtask title/i }).fill('First subtask');
    await page.keyboard.press('Enter');

    // Then the subtask appears in the detail panel
    await expect(detailPanel.getByTestId('subtask-item').filter({ hasText: 'First subtask' })).toBeVisible();
  });

  test.skip('[P0] should persist subtasks to storage after creation', async ({ page }) => {
    // Given a task is open in the detail panel
    const task = createTask({ title: 'Persistent subtask task' });
    await seedTasks(page, [task]);

    const board = new BoardPage(page);
    await board.goto();
    await openTaskDetail(page, 'Persistent subtask task');

    const detailPanel = page.getByTestId('task-detail-panel');

    // When a subtask is added
    await detailPanel.getByRole('button', { name: /add subtask/i }).click();
    await detailPanel.getByRole('textbox', { name: /subtask title/i }).fill('Persisted subtask');
    await page.keyboard.press('Enter');

    // And the page is reloaded
    await page.reload();
    await openTaskDetail(page, 'Persistent subtask task');

    // Then the subtask still exists
    const reloadedPanel = page.getByTestId('task-detail-panel');
    await expect(reloadedPanel.getByTestId('subtask-item').filter({ hasText: 'Persisted subtask' })).toBeVisible();
  });

  test.skip('[P1] should not create a subtask without a title', async ({ page }) => {
    // Given a task is open in the detail panel
    const task = createTask({ title: 'Validation task' });
    await seedTasks(page, [task]);

    const board = new BoardPage(page);
    await board.goto();
    await openTaskDetail(page, 'Validation task');

    const detailPanel = page.getByTestId('task-detail-panel');

    // When the subtask form is submitted without a title
    await detailPanel.getByRole('button', { name: /add subtask/i }).click();
    await page.keyboard.press('Enter');

    // Then a validation error is shown
    await expect(detailPanel.getByText(/title is required|please enter a title/i)).toBeVisible();

    // And no subtask is added
    await expect(detailPanel.getByTestId('subtask-item')).toHaveCount(0);
  });

  test.skip('[P1] should not create a subtask with title over 255 characters', async ({ page }) => {
    // Given a task is open in the detail panel
    const task = createTask({ title: 'Long title validation task' });
    await seedTasks(page, [task]);

    const board = new BoardPage(page);
    await board.goto();
    await openTaskDetail(page, 'Long title validation task');

    const detailPanel = page.getByTestId('task-detail-panel');

    // When a subtask title exceeding 255 characters is entered
    await detailPanel.getByRole('button', { name: /add subtask/i }).click();
    const longTitle = 'A'.repeat(256);
    await detailPanel.getByRole('textbox', { name: /subtask title/i }).fill(longTitle);
    await page.keyboard.press('Enter');

    // Then a validation error is shown
    await expect(detailPanel.getByText(/255 characters or less|too long/i)).toBeVisible();
  });

  test.skip('[P1] should create multiple subtasks in sequence', async ({ page }) => {
    // Given a task is open in the detail panel
    const task = createTask({ title: 'Multi-subtask task' });
    await seedTasks(page, [task]);

    const board = new BoardPage(page);
    await board.goto();
    await openTaskDetail(page, 'Multi-subtask task');

    const detailPanel = page.getByTestId('task-detail-panel');

    // When three subtasks are added
    const subtaskTitles = ['Design mockup', 'Implement feature', 'Write tests'];
    for (const title of subtaskTitles) {
      await detailPanel.getByRole('button', { name: /add subtask/i }).click();
      await detailPanel.getByRole('textbox', { name: /subtask title/i }).fill(title);
      await page.keyboard.press('Enter');
    }

    // Then all three subtasks are visible
    for (const title of subtaskTitles) {
      await expect(detailPanel.getByTestId('subtask-item').filter({ hasText: title })).toBeVisible();
    }

    // And the subtask count is 3
    await expect(detailPanel.getByTestId('subtask-item')).toHaveCount(3);
  });
});

test.describe('Subtasks — Toggle Completion', () => {
  test.skip('[P0] should mark a subtask as complete', async ({ page }) => {
    // Given a task with a subtask
    const task = createTask({ title: 'Completable task' });
    await seedTasks(page, [task]);

    const board = new BoardPage(page);
    await board.goto();
    await openTaskDetail(page, 'Completable task');

    const detailPanel = page.getByTestId('task-detail-panel');

    // Create a subtask
    await detailPanel.getByRole('button', { name: /add subtask/i }).click();
    await detailPanel.getByRole('textbox', { name: /subtask title/i }).fill('Complete me');
    await page.keyboard.press('Enter');

    // When the subtask checkbox is clicked
    const subtaskItem = detailPanel.getByTestId('subtask-item').filter({ hasText: 'Complete me' });
    await subtaskItem.getByTestId('subtask-checkbox').click();

    // Then the subtask is marked as complete
    await expect(subtaskItem.getByTestId('subtask-checkbox')).toBeChecked();
  });

  test.skip('[P0] should update subtask summary on task card', async ({ page }) => {
    // Given a task with subtasks exists
    const task = createTask({ title: 'Summary task' });
    await seedTasks(page, [task]);

    const board = new BoardPage(page);
    await board.goto();
    await openTaskDetail(page, 'Summary task');

    const detailPanel = page.getByTestId('task-detail-panel');

    // Create two subtasks
    for (const title of ['Subtask one', 'Subtask two']) {
      await detailPanel.getByRole('button', { name: /add subtask/i }).click();
      await detailPanel.getByRole('textbox', { name: /subtask title/i }).fill(title);
      await page.keyboard.press('Enter');
    }

    // Complete one subtask
    const subtaskItem = detailPanel.getByTestId('subtask-item').filter({ hasText: 'Subtask one' });
    await subtaskItem.getByTestId('subtask-checkbox').click();

    // Close the detail panel
    await page.keyboard.press('Escape');

    // Then the task card shows the subtask summary "1/2 subtasks done"
    const taskCard = new BoardPage(page).getTaskCard('Summary task');
    await expect(taskCard.getByTestId('subtask-summary')).toContainText(/1\/2|1 of 2/);
  });

  test.skip('[P1] should persist subtask completion state after reload', async ({ page }) => {
    // Given a task with a completed subtask
    const task = createTask({ title: 'Persistent completion task' });
    await seedTasks(page, [task]);

    const board = new BoardPage(page);
    await board.goto();
    await openTaskDetail(page, 'Persistent completion task');

    const detailPanel = page.getByTestId('task-detail-panel');

    // Create and complete a subtask
    await detailPanel.getByRole('button', { name: /add subtask/i }).click();
    await detailPanel.getByRole('textbox', { name: /subtask title/i }).fill('Completed subtask');
    await page.keyboard.press('Enter');
    await detailPanel.getByTestId('subtask-item').filter({ hasText: 'Completed subtask' }).getByTestId('subtask-checkbox').click();

    // When the page is reloaded
    await page.reload();
    await openTaskDetail(page, 'Persistent completion task');

    // Then the subtask is still marked as complete
    const reloadedPanel = page.getByTestId('task-detail-panel');
    const subtaskItem = reloadedPanel.getByTestId('subtask-item').filter({ hasText: 'Completed subtask' });
    await expect(subtaskItem.getByTestId('subtask-checkbox')).toBeChecked();
  });

  test.skip('[P1] should toggle subtask back to incomplete', async ({ page }) => {
    // Given a task with a completed subtask
    const task = createTask({ title: 'Toggle task' });
    await seedTasks(page, [task]);

    const board = new BoardPage(page);
    await board.goto();
    await openTaskDetail(page, 'Toggle task');

    const detailPanel = page.getByTestId('task-detail-panel');

    // Create and complete a subtask
    await detailPanel.getByRole('button', { name: /add subtask/i }).click();
    await detailPanel.getByRole('textbox', { name: /subtask title/i }).fill('Toggle me');
    await page.keyboard.press('Enter');
    const subtaskItem = detailPanel.getByTestId('subtask-item').filter({ hasText: 'Toggle me' });
    await subtaskItem.getByTestId('subtask-checkbox').click();

    // When the checkbox is clicked again
    await subtaskItem.getByTestId('subtask-checkbox').click();

    // Then the subtask is marked as incomplete
    await expect(subtaskItem.getByTestId('subtask-checkbox')).not.toBeChecked();
  });
});

test.describe('Subtasks — Delete', () => {
  test.skip('[P1] should delete a subtask with confirmation', async ({ page }) => {
    // Given a task with a subtask
    const task = createTask({ title: 'Delete subtask task' });
    await seedTasks(page, [task]);

    const board = new BoardPage(page);
    await board.goto();
    await openTaskDetail(page, 'Delete subtask task');

    const detailPanel = page.getByTestId('task-detail-panel');

    // Create a subtask
    await detailPanel.getByRole('button', { name: /add subtask/i }).click();
    await detailPanel.getByRole('textbox', { name: /subtask title/i }).fill('Delete me subtask');
    await page.keyboard.press('Enter');

    // When the delete button is clicked on the subtask
    const subtaskItem = detailPanel.getByTestId('subtask-item').filter({ hasText: 'Delete me subtask' });
    await subtaskItem.getByRole('button', { name: /delete/i }).click();

    // Then a confirmation dialog appears
    await expect(page.getByRole('dialog')).toBeVisible();
    await expect(page.getByText(/delete this subtask/i)).toBeVisible();

    // When confirmed
    await page.getByRole('button', { name: /confirm|yes|delete/i }).click();

    // Then the subtask is removed
    await expect(detailPanel.getByTestId('subtask-item').filter({ hasText: 'Delete me subtask' })).not.toBeVisible();
  });

  test.skip('[P1] should cancel subtask deletion', async ({ page }) => {
    // Given a task with a subtask
    const task = createTask({ title: 'Cancel delete subtask task' });
    await seedTasks(page, [task]);

    const board = new BoardPage(page);
    await board.goto();
    await openTaskDetail(page, 'Cancel delete subtask task');

    const detailPanel = page.getByTestId('task-detail-panel');

    // Create a subtask
    await detailPanel.getByRole('button', { name: /add subtask/i }).click();
    await detailPanel.getByRole('textbox', { name: /subtask title/i }).fill('Keep me subtask');
    await page.keyboard.press('Enter');

    // When delete is initiated but cancelled
    const subtaskItem = detailPanel.getByTestId('subtask-item').filter({ hasText: 'Keep me subtask' });
    await subtaskItem.getByRole('button', { name: /delete/i }).click();
    await page.getByRole('button', { name: /cancel|no/i }).click();

    // Then the subtask remains
    await expect(detailPanel.getByTestId('subtask-item').filter({ hasText: 'Keep me subtask' })).toBeVisible();
  });

  test.skip('[P2] should preserve remaining subtask order after deletion', async ({ page }) => {
    // Given a task with three subtasks
    const task = createTask({ title: 'Order preservation task' });
    await seedTasks(page, [task]);

    const board = new BoardPage(page);
    await board.goto();
    await openTaskDetail(page, 'Order preservation task');

    const detailPanel = page.getByTestId('task-detail-panel');

    // Create three subtasks
    for (const title of ['First', 'Second', 'Third']) {
      await detailPanel.getByRole('button', { name: /add subtask/i }).click();
      await detailPanel.getByRole('textbox', { name: /subtask title/i }).fill(title);
      await page.keyboard.press('Enter');
    }

    // When the second subtask is deleted
    const secondItem = detailPanel.getByTestId('subtask-item').filter({ hasText: 'Second' });
    await secondItem.getByRole('button', { name: /delete/i }).click();
    await page.getByRole('button', { name: /confirm|yes|delete/i }).click();

    // Then First and Third remain in order
    const remainingItems = await detailPanel.getByTestId('subtask-item').all();
    expect(remainingItems).toHaveLength(2);
    await expect(remainingItems[0]).toContainText('First');
    await expect(remainingItems[1]).toContainText('Third');
  });
});

test.describe('Quick-Add — Create Task', () => {
  test.skip('[P0] should create a task via quick-add with title only', async ({ page }) => {
    // Given the board is loaded
    const board = new BoardPage(page);
    await board.goto();

    // When a task is created via quick-add
    await page.getByTestId('quick-add-button').click();
    await page.getByTestId('quick-add-input').fill('Quick task title');
    await page.keyboard.press('Enter');

    // Then the task appears on the board
    await expect(board.getTaskCard('Quick task title')).toBeVisible();

    // And the task is persisted in storage with sensible defaults
    const storedTasks = await getTasksFromStorage(page);
    const created = storedTasks.find((t: { title: string }) => t.title === 'Quick task title');
    expect(created).toBeTruthy();
    expect(created?.priority).toBe('medium');
    expect(created?.status).toBe('todo');
  });

  test.skip('[P0] should not create a quick-add task without a title', async ({ page }) => {
    // Given the board is loaded
    const board = new BoardPage(page);
    await board.goto();

    // When quick-add is submitted without a title
    await page.getByTestId('quick-add-button').click();
    await page.keyboard.press('Enter');

    // Then no task is created
    const storedTasks = await getTasksFromStorage(page);
    expect(storedTasks).toHaveLength(0);
  });

  test.skip('[P1] should cancel quick-add with Escape key', async ({ page }) => {
    // Given the board is loaded and quick-add is open
    const board = new BoardPage(page);
    await board.goto();

    await page.getByTestId('quick-add-button').click();
    await page.getByTestId('quick-add-input').fill('Cancelled task');

    // When Escape is pressed
    await page.keyboard.press('Escape');

    // Then no task is created
    const storedTasks = await getTasksFromStorage(page);
    expect(storedTasks).toHaveLength(0);

    // And the quick-add input is dismissed
    await expect(page.getByTestId('quick-add-input')).not.toBeVisible();
  });

  test.skip('[P1] should create multiple tasks in sequence via quick-add', async ({ page }) => {
    // Given the board is loaded
    const board = new BoardPage(page);
    await board.goto();

    // When three tasks are created via quick-add in sequence
    const titles = ['Task Alpha', 'Task Beta', 'Task Gamma'];
    for (const title of titles) {
      await page.getByTestId('quick-add-button').click();
      await page.getByTestId('quick-add-input').fill(title);
      await page.keyboard.press('Enter');
    }

    // Then all three tasks appear on the board
    for (const title of titles) {
      await expect(board.getTaskCard(title)).toBeVisible();
    }

    // And all three are in storage
    const storedTasks = await getTasksFromStorage(page);
    expect(storedTasks).toHaveLength(3);
  });
});

test.describe('Quick-Add — Keyboard Shortcut', () => {
  test.skip('[P1] should activate quick-add via Cmd+Shift+N (Mac)', async ({ page }) => {
    // Given the board is loaded
    const board = new BoardPage(page);
    await board.goto();

    // When the keyboard shortcut is pressed (Mac)
    await page.keyboard.press('Meta+Shift+N');

    // Then the quick-add input is focused and active
    await expect(page.getByTestId('quick-add-input')).toBeFocused();
  });

  test.skip('[P1] should activate quick-add via Ctrl+Shift+N (Windows/Linux)', async ({ page }) => {
    // Given the board is loaded
    const board = new BoardPage(page);
    await board.goto();

    // When the keyboard shortcut is pressed (Windows/Linux)
    await page.keyboard.press('Control+Shift+N');

    // Then the quick-add input is focused and active
    await expect(page.getByTestId('quick-add-input')).toBeFocused();
  });

  test.skip('[P2] should return focus to board after quick-add creation', async ({ page }) => {
    // Given the board is loaded
    const board = new BoardPage(page);
    await board.goto();

    // When a task is created via keyboard shortcut
    await page.keyboard.press('Meta+Shift+N');
    await page.getByTestId('quick-add-input').fill('Keyboard shortcut task');
    await page.keyboard.press('Enter');

    // Then focus returns to the quick-add input for sequential creation
    await expect(page.getByTestId('quick-add-input')).toBeFocused();
  });
});

test.describe('Quick-Add — Column Selection', () => {
  test.skip('[P1] should quick-add task to a specific column', async ({ page }) => {
    // Given the board is loaded
    const board = new BoardPage(page);
    await board.goto();

    // When quick-add is triggered from the In Progress column
    const inProgressColumn = board.getColumn('In Progress');
    await inProgressColumn.getByTestId('quick-add-button').click();
    await page.getByTestId('quick-add-input').fill('Column-specific task');
    await page.keyboard.press('Enter');

    // Then the task appears in the In Progress column
    await expect(inProgressColumn.getByText('Column-specific task')).toBeVisible();

    // And the task has the correct status
    const storedTasks = await getTasksFromStorage(page);
    const created = storedTasks.find((t: { title: string }) => t.title === 'Column-specific task');
    expect(created?.status).toBe('in-progress');
  });

  test.skip('[P2] should indicate which column is selected in quick-add', async ({ page }) => {
    // Given the board is loaded
    const board = new BoardPage(page);
    await board.goto();

    // When quick-add is triggered from the Review column
    const reviewColumn = board.getColumn('Review');
    await reviewColumn.getByTestId('quick-add-button').click();

    // Then the quick-add UI indicates the Review column is selected
    await expect(page.getByTestId('quick-add-input')).toBeVisible();
    await expect(page.getByText(/review/i)).toBeVisible();
  });
});

test.describe('Quick-Add — Expand to Full Form', () => {
  test.skip('[P1] should expand quick-add task to full edit form', async ({ page }) => {
    // Given a task was created via quick-add
    const board = new BoardPage(page);
    await board.goto();

    await page.getByTestId('quick-add-button').click();
    await page.getByTestId('quick-add-input').fill('Expandable task');
    await page.keyboard.press('Enter');

    // When the edit button is clicked on the task card
    const form = await board.openTaskEditForm('Expandable task');

    // Then the full task form is shown with the title pre-filled
    await expect(form.titleInput).toHaveValue('Expandable task');

    // And all other fields are available
    await expect(form.descriptionInput).toBeVisible();
    await expect(form.prioritySelect).toBeVisible();
    await expect(form.dueDateInput).toBeVisible();
  });

  test.skip('[P2] should pre-fill defaults in expanded form from quick-add', async ({ page }) => {
    // Given a task was created via quick-add
    const board = new BoardPage(page);
    await board.goto();

    await page.getByTestId('quick-add-button').click();
    await page.getByTestId('quick-add-input').fill('Defaults task');
    await page.keyboard.press('Enter');

    // When the full edit form is opened
    const form = await board.openTaskEditForm('Defaults task');

    // Then the priority defaults to Medium
    await expect(form.prioritySelect).toHaveValue('medium');
  });
});

test.describe('Subtasks — Order and Persistence', () => {
  test.skip('[P2] should preserve subtask order after page reload', async ({ page }) => {
    // Given a task with multiple subtasks
    const task = createTask({ title: 'Order task' });
    await seedTasks(page, [task]);

    const board = new BoardPage(page);
    await board.goto();
    await openTaskDetail(page, 'Order task');

    const detailPanel = page.getByTestId('task-detail-panel');

    // Create subtasks in order
    const subtaskTitles = ['Alpha subtask', 'Beta subtask', 'Gamma subtask'];
    for (const title of subtaskTitles) {
      await detailPanel.getByRole('button', { name: /add subtask/i }).click();
      await detailPanel.getByRole('textbox', { name: /subtask title/i }).fill(title);
      await page.keyboard.press('Enter');
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
});
