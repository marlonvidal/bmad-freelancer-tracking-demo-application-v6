/**
 * Navigation & Layout E2E Tests — Story 1.3
 *
 * Tests for the base layout with navigation tabs (Board, Revenue, Settings)
 * and data persistence via Dexie.js/IndexedDB.
 * These tests are ready-to-activate once story 1.3 is implemented.
 *
 * Activation checklist:
 * - [ ] Navigation tabs are rendered with correct labels
 * - [ ] Routes /board, /revenue, /settings are configured
 * - [ ] data-testid attributes added to navigation components
 * - [ ] Remove skip tags from tests as features are implemented
 */
import { test, expect } from '../support/fixtures/merged-fixtures';
import { createTask } from '../support/factories';
import { seedTasks, getTasksFromStorage } from '../support/helpers/local-storage';

test.describe('Navigation & Layout', () => {
  test.skip('[P1] should display navigation tabs for Board, Revenue, and Settings', async ({ page }) => {
    // Given the app is loaded
    await page.goto('/');

    // Then all navigation tabs are visible
    await expect(page.getByRole('tab', { name: 'Board' })).toBeVisible();
    await expect(page.getByRole('tab', { name: 'Revenue' })).toBeVisible();
    await expect(page.getByRole('tab', { name: 'Settings' })).toBeVisible();
  });

  test.skip('[P1] should navigate to Board page', async ({ page }) => {
    // Given the app is loaded
    await page.goto('/');

    // When the Board tab is clicked
    await page.getByRole('tab', { name: 'Board' }).click();

    // Then the Board page is displayed
    await expect(page).toHaveURL(/\/board/);
    await expect(page.getByRole('heading', { name: /board/i })).toBeVisible();
  });

  test.skip('[P1] should navigate to Revenue page', async ({ page }) => {
    // Given the app is loaded
    await page.goto('/');

    // When the Revenue tab is clicked
    await page.getByRole('tab', { name: 'Revenue' }).click();

    // Then the Revenue page is displayed
    await expect(page).toHaveURL(/\/revenue/);
    await expect(page.getByRole('heading', { name: /revenue/i })).toBeVisible();
  });

  test.skip('[P1] should navigate to Settings page', async ({ page }) => {
    // Given the app is loaded
    await page.goto('/');

    // When the Settings tab is clicked
    await page.getByRole('tab', { name: 'Settings' }).click();

    // Then the Settings page is displayed
    await expect(page).toHaveURL(/\/settings/);
    await expect(page.getByRole('heading', { name: /settings/i })).toBeVisible();
  });

  test.skip('[P1] should highlight the active navigation tab', async ({ page }) => {
    // Given the app navigates to the Board page
    await page.goto('/board');

    // Then the Board tab is highlighted as active
    const boardTab = page.getByRole('tab', { name: 'Board' });
    await expect(boardTab).toHaveAttribute('aria-selected', 'true');

    // And other tabs are not active
    const revenueTab = page.getByRole('tab', { name: 'Revenue' });
    await expect(revenueTab).toHaveAttribute('aria-selected', 'false');
  });

  test.skip('[P1] should support keyboard navigation between tabs', async ({ page }) => {
    // Given the app is loaded and Board tab is focused
    await page.goto('/');
    await page.getByRole('tab', { name: 'Board' }).focus();

    // When arrow key is pressed
    await page.keyboard.press('ArrowRight');

    // Then focus moves to the next tab
    const revenueTab = page.getByRole('tab', { name: 'Revenue' });
    await expect(revenueTab).toBeFocused();
  });
});

test.describe('Data Persistence', () => {
  test.skip('[P0] should persist tasks after page reload', async ({ page }) => {
    // Given tasks are seeded into storage
    const tasks = [
      createTask({ title: 'Persistent task 1' }),
      createTask({ title: 'Persistent task 2' }),
    ];
    await seedTasks(page, tasks);
    await page.goto('/');

    // When the page is reloaded
    await page.reload();

    // Then the tasks are still in storage
    const storedTasks = await getTasksFromStorage(page);
    expect(storedTasks).toHaveLength(2);
    const titles = storedTasks.map((t: { title: string }) => t.title);
    expect(titles).toContain('Persistent task 1');
    expect(titles).toContain('Persistent task 2');
  });

  test.skip('[P0] should not make external network requests', async ({ page }) => {
    // Given we monitor all network requests
    const externalRequests: string[] = [];
    page.on('request', (request) => {
      const url = request.url();
      // Ignore localhost and vite HMR requests
      if (!url.includes('localhost') && !url.includes('127.0.0.1') && !url.includes('vite')) {
        externalRequests.push(url);
      }
    });

    // When the app loads
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Then no external requests were made (privacy compliance NFR5, NFR6)
    expect(externalRequests).toHaveLength(0);
  });

  test.skip('[P1] should persist data across navigation', async ({ page }) => {
    // Given tasks are seeded and the board is loaded
    await seedTasks(page, [createTask({ title: 'Navigation persistence test' })]);
    await page.goto('/board');

    // When navigating to Settings and back to Board
    await page.getByRole('tab', { name: 'Settings' }).click();
    await page.getByRole('tab', { name: 'Board' }).click();

    // Then the task is still visible on the board
    await expect(page.getByText('Navigation persistence test')).toBeVisible();
  });
});
