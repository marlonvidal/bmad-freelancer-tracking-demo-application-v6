/**
 * Kanban Board E2E Tests — Story 1.4
 *
 * Tests for the Kanban board with customizable columns.
 * These tests are ready-to-activate once story 1.4 is implemented.
 *
 * Activation checklist:
 * - [ ] BoardPage page object selectors match actual implementation
 * - [ ] Column names match default columns defined in story 1.4
 * - [ ] data-testid attributes added to board components
 * - [ ] Remove skip tags from tests as features are implemented
 */
import { test, expect } from '../support/fixtures/merged-fixtures';
import {
  createTask,
  createInProgressTask,
  createCompletedTask,
} from '../support/factories';
import { seedTasks } from '../support/helpers/local-storage';
import { BoardPage } from '../support/page-objects/board-page';

test.describe('Kanban Board', () => {
  test.skip('[P0] should render board with default columns', async ({ page }) => {
    // Given the app loads with no pre-seeded data
    const board = new BoardPage(page);
    await board.goto();

    // Then the default columns are visible
    await expect(board.getColumn('Backlog')).toBeVisible();
    await expect(board.getColumn('In Progress')).toBeVisible();
    await expect(board.getColumn('Review')).toBeVisible();
    await expect(board.getColumn('Done')).toBeVisible();
  });

  test.skip('[P0] should display task cards in correct columns', async ({ page }) => {
    // Given tasks are seeded across all statuses
    const tasks = [
      createTask({ title: 'Backlog task', status: 'todo' }),
      createInProgressTask({ title: 'Active task' }),
      createTask({ title: 'Review task', status: 'review' }),
      createCompletedTask({ title: 'Completed task' }),
    ];
    await seedTasks(page, tasks);

    // When the board loads
    const board = new BoardPage(page);
    await board.goto();

    // Then each task appears in its correct column
    await expect(board.getTaskCard('Backlog task')).toBeVisible();
    await expect(board.getTaskCard('Active task')).toBeVisible();
    await expect(board.getTaskCard('Review task')).toBeVisible();
    await expect(board.getTaskCard('Completed task')).toBeVisible();

    // And tasks are in the correct columns
    const backlogColumn = board.getColumn('Backlog');
    await expect(backlogColumn.getByText('Backlog task')).toBeVisible();

    const inProgressColumn = board.getColumn('In Progress');
    await expect(inProgressColumn.getByText('Active task')).toBeVisible();
  });

  test.skip('[P0] should show empty state when column has no tasks', async ({ page }) => {
    // Given only a todo task is seeded
    await seedTasks(page, [createTask({ status: 'todo' })]);

    // When the board loads
    const board = new BoardPage(page);
    await board.goto();

    // Then empty columns show an empty state indicator
    const inProgressColumn = board.getColumn('In Progress');
    await expect(inProgressColumn.getByText(/no tasks|empty/i)).toBeVisible();
  });

  test.skip('[P1] should add a new custom column', async ({ page }) => {
    // Given the board is loaded
    const board = new BoardPage(page);
    await board.goto();

    // When a new column is added
    await board.addColumn('Testing');

    // Then the new column appears on the board
    await expect(board.getColumn('Testing')).toBeVisible();
  });

  test.skip('[P1] should rename an existing column', async ({ page }) => {
    // Given the board is loaded with default columns
    const board = new BoardPage(page);
    await board.goto();

    // When the "Backlog" column is renamed to "To Do"
    await board.renameColumn('Backlog', 'To Do');

    // Then the column shows the new name
    await expect(board.getColumn('To Do')).toBeVisible();
    await expect(board.getColumn('Backlog')).not.toBeVisible();
  });

  test.skip('[P1] should delete a custom column', async ({ page }) => {
    // Given a custom column exists
    const board = new BoardPage(page);
    await board.goto();
    await board.addColumn('Staging');
    await expect(board.getColumn('Staging')).toBeVisible();

    // When the custom column is deleted
    await board.deleteColumn('Staging');

    // Then the column is removed from the board
    await expect(board.getColumn('Staging')).not.toBeVisible();
  });

  test.skip('[P1] should display task count badge on each column', async ({ page }) => {
    // Given 3 tasks in the Backlog column
    const tasks = [
      createTask({ status: 'todo' }),
      createTask({ status: 'todo' }),
      createTask({ status: 'todo' }),
    ];
    await seedTasks(page, tasks);

    // When the board loads
    const board = new BoardPage(page);
    await board.goto();

    // Then the Backlog column shows a count of 3
    const backlogColumn = board.getColumn('Backlog');
    await expect(backlogColumn.getByText('3')).toBeVisible();
  });

  test.skip('[P2] should persist custom columns after page reload', async ({ page }) => {
    // Given a custom column is added
    const board = new BoardPage(page);
    await board.goto();
    await board.addColumn('Custom Column');
    await expect(board.getColumn('Custom Column')).toBeVisible();

    // When the page is reloaded
    await page.reload();

    // Then the custom column persists
    await expect(board.getColumn('Custom Column')).toBeVisible();
  });
});
