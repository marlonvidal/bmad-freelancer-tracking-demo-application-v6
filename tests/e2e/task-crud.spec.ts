/**
 * Task CRUD E2E Tests — Story 1.5
 *
 * Tests for creating and managing tasks with full fields.
 * These tests are ready-to-activate once story 1.5 is implemented.
 *
 * Activation checklist:
 * - [ ] TaskFormPage page object selectors match actual implementation
 * - [ ] data-testid attributes added to task form and card components
 * - [ ] Remove skip tags from tests as features are implemented
 */
import { test, expect } from '../support/fixtures/merged-fixtures';
import {
  createTask,
  createUrgentTask,
  createOverdueTask,
} from '../support/factories';
import { seedTasks, getTasksFromStorage } from '../support/helpers/local-storage';
import { BoardPage } from '../support/page-objects/board-page';
import { TaskFormPage } from '../support/page-objects/task-form-page';

test.describe('Task CRUD — Create', () => {
  test.skip('[P0] should create a new task with required fields', async ({ page }) => {
    // Given the board is loaded
    const board = new BoardPage(page);
    await board.goto();

    // When a new task is created with a title
    const form = await board.openNewTaskForm();
    await form.fillTitle('My new task');
    await form.submit();

    // Then the task appears on the board
    await expect(board.getTaskCard('My new task')).toBeVisible();

    // And the task is persisted in storage
    const storedTasks = await getTasksFromStorage(page);
    const created = storedTasks.find((t: { title: string }) => t.title === 'My new task');
    expect(created).toBeTruthy();
    expect(created.status).toBe('todo');
  });

  test.skip('[P0] should create a task with all fields populated', async ({ page }) => {
    // Given the board is loaded
    const board = new BoardPage(page);
    await board.goto();

    // When a task is created with all fields
    const form = await board.openNewTaskForm();
    await form.fillTitle('Full task');
    await form.fillDescription('Detailed description for this task');
    await form.selectPriority('high');
    await form.fillDueDate('2026-12-31');
    await form.fillEstimatedHours(8);
    await form.addTag('frontend');
    await form.submit();

    // Then the task card displays all fields
    const card = board.getTaskCard('Full task');
    await expect(card).toBeVisible();
    await expect(card.getByText('high')).toBeVisible();
    await expect(card.getByText('frontend')).toBeVisible();
  });

  test.skip('[P1] should not create a task without a title', async ({ page }) => {
    // Given the board is loaded
    const board = new BoardPage(page);
    await board.goto();

    // When a task form is submitted without a title
    const form = await board.openNewTaskForm();
    await form.submit();

    // Then a validation error is shown
    await expect(page.getByText(/title is required|please enter a title/i)).toBeVisible();

    // And no task is created in storage
    const storedTasks = await getTasksFromStorage(page);
    expect(storedTasks).toHaveLength(0);
  });

  test.skip('[P1] should create task with urgent priority', async ({ page }) => {
    // Given the board is loaded
    const board = new BoardPage(page);
    await board.goto();

    // When an urgent task is created
    const form = await board.openNewTaskForm();
    await form.fillTitle('Urgent blocker');
    await form.selectPriority('urgent');
    await form.submit();

    // Then the task card shows the urgent priority badge
    const card = board.getTaskCard('Urgent blocker');
    await expect(card.getByText('urgent')).toBeVisible();
  });
});

test.describe('Task CRUD — Read', () => {
  test.skip('[P0] should display task cards with title and priority', async ({ page }) => {
    // Given tasks are seeded with different priorities
    const tasks = [
      createTask({ title: 'Low priority task', priority: 'low' }),
      createTask({ title: 'High priority task', priority: 'high' }),
      createUrgentTask({ title: 'Urgent task' }),
    ];
    await seedTasks(page, tasks);

    // When the board loads
    const board = new BoardPage(page);
    await board.goto();

    // Then each task card is visible with its priority
    await expect(board.getTaskCard('Low priority task')).toBeVisible();
    await expect(board.getTaskCard('High priority task')).toBeVisible();
    await expect(board.getTaskCard('Urgent task')).toBeVisible();
  });

  test.skip('[P1] should display overdue tasks with visual indicator', async ({ page }) => {
    // Given an overdue task is seeded
    const overdueTask = createOverdueTask({ title: 'Overdue task' });
    await seedTasks(page, [overdueTask]);

    // When the board loads
    const board = new BoardPage(page);
    await board.goto();

    // Then the overdue task shows a visual indicator (e.g., red date)
    const card = board.getTaskCard('Overdue task');
    await expect(card).toBeVisible();
    // The due date should have an overdue visual indicator
    await expect(card.locator('[data-testid="overdue-indicator"]')).toBeVisible();
  });

  test.skip('[P1] should display task tags on card', async ({ page }) => {
    // Given a task with tags is seeded
    const task = createTask({ title: 'Tagged task', tags: ['frontend', 'bug'] });
    await seedTasks(page, [task]);

    // When the board loads
    const board = new BoardPage(page);
    await board.goto();

    // Then the task card shows the tags
    const card = board.getTaskCard('Tagged task');
    await expect(card.getByText('frontend')).toBeVisible();
    await expect(card.getByText('bug')).toBeVisible();
  });
});

test.describe('Task CRUD — Update', () => {
  test.skip('[P0] should edit a task title', async ({ page }) => {
    // Given a task is seeded
    await seedTasks(page, [createTask({ title: 'Original title' })]);

    // When the task is edited
    const board = new BoardPage(page);
    await board.goto();
    const form = await board.openTaskEditForm('Original title');
    await form.clearTitle();
    await form.fillTitle('Updated title');
    await form.submit();

    // Then the updated title appears on the board
    await expect(board.getTaskCard('Updated title')).toBeVisible();
    await expect(board.getTaskCard('Original title')).not.toBeVisible();
  });

  test.skip('[P1] should change task priority', async ({ page }) => {
    // Given a medium priority task is seeded
    await seedTasks(page, [createTask({ title: 'Priority task', priority: 'medium' })]);

    // When the priority is changed to high
    const board = new BoardPage(page);
    await board.goto();
    const form = await board.openTaskEditForm('Priority task');
    await form.selectPriority('high');
    await form.submit();

    // Then the task card shows the updated priority
    const card = board.getTaskCard('Priority task');
    await expect(card.getByText('high')).toBeVisible();
  });
});

test.describe('Task CRUD — Delete', () => {
  test.skip('[P0] should delete a task', async ({ page }) => {
    // Given a task is seeded
    await seedTasks(page, [createTask({ title: 'Task to delete' })]);

    // When the task is deleted
    const board = new BoardPage(page);
    await board.goto();
    await board.deleteTask('Task to delete');

    // Then the task is no longer visible on the board
    await expect(board.getTaskCard('Task to delete')).not.toBeVisible();

    // And the task is removed from storage
    const storedTasks = await getTasksFromStorage(page);
    const deleted = storedTasks.find((t: { title: string }) => t.title === 'Task to delete');
    expect(deleted).toBeUndefined();
  });

  test.skip('[P1] should confirm before deleting a task', async ({ page }) => {
    // Given a task is seeded
    await seedTasks(page, [createTask({ title: 'Protected task' })]);

    // When delete is initiated but cancelled
    const board = new BoardPage(page);
    await board.goto();
    await board.initiateDeleteTask('Protected task');
    await board.cancelDelete();

    // Then the task remains on the board
    await expect(board.getTaskCard('Protected task')).toBeVisible();
  });
});
