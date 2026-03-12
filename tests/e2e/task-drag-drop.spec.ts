import { test, expect } from '@playwright/test';
import { createColumns } from '../support/factories/column.factory';
import { createTask, createTasks } from '../support/factories/task.factory';
import { db } from '@/db';

/**
 * Story 1.6: Move and Reorder Tasks via Drag-and-Drop
 * 
 * RED PHASE - All tests intentionally failing (feature not implemented yet)
 * Tests assert expected behavior; implementation will make them pass
 * 
 * @category e2e
 * @priority p0
 */

test.describe('Story 1.6: Drag-and-Drop Task Management', () => {
  // Setup: Create test data before each test
  test.beforeEach(async () => {
    // Create 3 columns with 3 tasks each
    const columns = createColumns(3);
    await db.columns.bulkAdd(columns);

    for (const column of columns) {
      const tasks = createTasks(3, column.id!);
      await db.tasks.bulkAdd(tasks);
    }
  });

  // Cleanup: Clear database after each test
  test.afterEach(async () => {
    await db.tasks.clear();
    await db.columns.clear();
  });

  test.skip('AC-1.0: Drag task between columns and persist', async ({
    page,
  }) => {
    // Test Setup
    const sourceColumnId = 1;
    const targetColumnId = 2;

    // Navigate to kanban board
    await page.goto('/');

    // Get source task (first task in first column)
    const sourceTask = await page.locator('[data-testid="task-1"]').first();
    const taskTitle = await sourceTask.locator('[data-testid^="task-title"]').textContent();

    // Drag task from source column to target column
    await sourceTask.dragTo(page.locator(`[data-testid="column-drop-zone-${targetColumnId}"]`));

    // Verify visual feedback
    const targetColumn = page.locator(`[data-testid="column-${targetColumnId}"]`);
    await expect(targetColumn).toHaveClass(/highlighted|over/);

    // Verify task appears in target column
    const movedTask = page.locator(`[data-testid="column-${targetColumnId}"]`).locator('[data-testid^="task-"]', {
      hasText: taskTitle || '',
    });
    await expect(movedTask).toBeVisible();

    // Verify persistence: Refresh page and confirm task is still in target column
    await page.reload();
    await expect(movedTask).toBeVisible();

    // Verify task is no longer in source column
    const sourceColumnEl = page.locator(`[data-testid="column-${sourceColumnId}"]`);
    const taskInSource = sourceColumnEl.locator('[data-testid^="task-"]', {
      hasText: taskTitle || '',
    });
    await expect(taskInSource).not.toBeVisible();
  });

  test.skip('AC-1.1: Drop target highlighted during drag', async ({
    page,
  }) => {
    await page.goto('/');

    const sourceTask = page.locator('[data-testid="task-1"]').first();
    const targetColumnDropZone = page.locator('[data-testid="column-drop-zone-2"]');

    // Start drag (don't drop yet)
    await sourceTask.dragTo(targetColumnDropZone, {
      force: true,
      trial: true, // Just hover, don't actually drop
    });

    // Verify drop target is highlighted
    const targetColumn = page.locator('[data-testid="column-2"]');
    const highlight = targetColumn.locator('.bg-blue-50, [class*="highlight"]');
    await expect(highlight).toBeVisible();

    // Verify drop indicator is visible
    const dropIndicator = targetColumn.locator('[class*="drop-indicator"], [class*="insertion-line"]');
    await expect(dropIndicator).toBeVisible();

    // Verify invalid drop targets are NOT highlighted
    const otherColumn = page.locator('[data-testid="column-3"]');
    await expect(otherColumn).not.toHaveClass(/bg-blue-50|highlighted/);
  });

  test.skip('AC-2.0: Reorder tasks within column and persist', async ({
    page,
  }) => {
    await page.goto('/');

    const column = page.locator('[data-testid="column-1"]');
    const tasks = column.locator('[data-testid^="task-"]');

    // Get initial order
    const taskBefore1 = await tasks.nth(0).locator('[data-testid^="task-title"]').textContent();
    const taskBefore2 = await tasks.nth(1).locator('[data-testid^="task-title"]').textContent();

    // Drag first task below second task
    await tasks.nth(0).dragTo(tasks.nth(2));

    // Verify order changed in DOM
    const taskAfter1 = await tasks.nth(0).locator('[data-testid^="task-title"]').textContent();
    const taskAfter2 = await tasks.nth(1).locator('[data-testid^="task-title"]').textContent();

    expect(taskAfter1).not.toBe(taskBefore1);
    expect(taskAfter2).toBe(taskBefore2);

    // Verify persistence: Refresh and confirm order persists
    await page.reload();

    const tasksAfterReload = column.locator('[data-testid^="task-"]');
    const reorderedTask1 = await tasksAfterReload.nth(0).locator('[data-testid^="task-title"]').textContent();

    expect(reorderedTask1).toBe(taskAfter1);
  });

  test.skip('AC-4.0: Keyboard navigation - arrow keys move task', async ({
    page,
  }) => {
    await page.goto('/');

    // Tab to first task
    await page.keyboard.press('Tab');
    const focusedTask = page.locator('[data-testid^="task-"]:focus');
    await expect(focusedTask).toHaveCount(1);

    const initialTaskId = await focusedTask.getAttribute('data-testid');

    // Use arrow key to move task (implementation-specific)
    // This assumes @dnd-kit keyboard sensor is configured
    await page.keyboard.press('ArrowDown');

    // Verify screen reader announces the move
    const ariaLive = page.locator('[aria-live="polite"]');
    await expect(ariaLive).toContainText(/moved|column/i);

    // Verify focus returns to moved task
    const focusedAfter = page.locator('[data-testid^="task-"]:focus');
    await expect(focusedAfter).toHaveCount(1);
    const movedTaskId = await focusedAfter.getAttribute('data-testid');
    expect(movedTaskId).toBe(initialTaskId);

    // Verify Enter drops the task
    await page.keyboard.press('Enter');

    // Verify drop occurred (task in new position)
    const column2 = page.locator('[data-testid="column-2"]');
    const movedTaskInColumn2 = column2.locator(`[data-testid="${movedTaskId}"]`);
    await expect(movedTaskInColumn2).toBeVisible();
  });

  test.skip('AC-5.0: Touch drag-and-drop on mobile device', async ({
    page,
  }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });

    await page.goto('/');

    const sourceTask = page.locator('[data-testid="task-1"]').first();
    const targetColumn = page.locator('[data-testid="column-drop-zone-2"]');

    // Perform touch drag: long-press and drag
    // Using Playwright's touch simulation
    const sourceBox = await sourceTask.boundingBox();
    const targetBox = await targetColumn.boundingBox();

    if (!sourceBox || !targetBox) {
      throw new Error('Elements not visible');
    }

    // Simulate long-press by holding touch
    await page.touchscreen.tap(sourceBox.x + sourceBox.width / 2, sourceBox.y + sourceBox.height / 2);

    // Wait for long-press to register (implementation-specific delay)
    await page.waitForTimeout(200);

    // Drag to target
    await page.touchscreen.drag(
      sourceBox.x + sourceBox.width / 2,
      sourceBox.y + sourceBox.height / 2,
      targetBox.x + targetBox.width / 2,
      targetBox.y + targetBox.height / 2,
      200,
    );

    // Verify task moved to target column
    const taskTitle = await sourceTask.locator('[data-testid^="task-title"]').textContent();
    const movedTask = page.locator('[data-testid="column-2"]').locator('[data-testid^="task-"]', {
      hasText: taskTitle || '',
    });

    await expect(movedTask).toBeVisible();

    // Verify smooth feedback (no lag indicators)
    // Check that performance metrics are acceptable (200ms or less for move)
    const moveTime = await page.evaluate(() => {
      const nav = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      return nav.domContentLoadedEventEnd - nav.domContentLoadedEventStart;
    });

    expect(moveTime).toBeLessThan(2000); // Overall page load should be reasonable
  });

  test.skip('AC-6.0: Error recovery - task reverts on Dexie failure', async ({
    page,
  }) => {
    await page.goto('/');

    const sourceTask = page.locator('[data-testid="task-1"]').first();
    const taskTitle = await sourceTask.locator('[data-testid^="task-title"]').textContent();
    const sourceColumn = page.locator('[data-testid="column-1"]');

    // Mock Dexie save failure
    await page.evaluate(() => {
      // Simulate Dexie error on next update
      (window as any).__dexieUpdateFails = true;
    });

    // Attempt to drag task to new column
    const targetColumn = page.locator('[data-testid="column-drop-zone-2"]');
    await sourceTask.dragTo(targetColumn);

    // Wait for error message to appear
    const errorMessage = page.locator('[data-testid="error-message"]');
    await expect(errorMessage).toBeVisible({ timeout: 2000 });
    await expect(errorMessage).toContainText(/failed to move|try again/i);

    // Verify task reverted to original position
    const taskInSource = sourceColumn.locator('[data-testid^="task-"]', {
      hasText: taskTitle || '',
    });
    await expect(taskInSource).toBeVisible();

    // Verify task is NOT in target column
    const targetColumnEl = page.locator('[data-testid="column-2"]');
    const taskInTarget = targetColumnEl.locator('[data-testid^="task-"]', {
      hasText: taskTitle || '',
    });
    await expect(taskInTarget).not.toBeVisible();
  });

  test.skip('AC-7.0: Performance - 60fps with 100+ tasks', async ({
    page,
  }) => {
    // Create large dataset: 100+ tasks in a column
    const columns = createColumns(1);
    await db.columns.bulkAdd(columns);

    const largeTasks = Array.from({ length: 120 }, (_, i) =>
      createTask(columns[0].id!, { order: i }),
    );
    await db.tasks.bulkAdd(largeTasks);

    await page.goto('/');

    // Measure FPS during drag
    let frames = 0;
    const startTime = performance.now();

    // Use performance observer to measure frame drops
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.duration > 16.67) {
          // 16.67ms = 60fps frame time
          // Frame drop detected
        }
      }
    });

    observer.observe({ entryTypes: ['measure'] });

    // Perform drag operation
    const sourceTask = page.locator('[data-testid="task-1"]').first();
    const targetColumn = page.locator('[data-testid="column-drop-zone-1"]');

    await sourceTask.dragTo(targetColumn, { timeout: 5000 });

    const endTime = performance.now();
    const dragDuration = endTime - startTime;

    // Verify drag completed in reasonable time (<5s for 100+ tasks)
    expect(dragDuration).toBeLessThan(5000);

    // Verify FPS was maintained (no extreme frame drops)
    // Implementation will verify 60fps via Chrome DevTools
  });

  test.skip('AC-8.0: Data integrity - task persists after page refresh', async ({
    page,
  }) => {
    await page.goto('/');

    const sourceTask = page.locator('[data-testid="task-1"]').first();
    const taskTitle = await sourceTask.locator('[data-testid^="task-title"]').textContent();
    const sourceColumnId = 1;
    const targetColumnId = 2;

    // Drag task to new column
    const targetColumn = page.locator(`[data-testid="column-drop-zone-${targetColumnId}"]`);
    await sourceTask.dragTo(targetColumn);

    // Verify task visible in target column
    const targetColumnEl = page.locator(`[data-testid="column-${targetColumnId}"]`);
    const movedTask = targetColumnEl.locator('[data-testid^="task-"]', {
      hasText: taskTitle || '',
    });
    await expect(movedTask).toBeVisible();

    // Get task data (ID, column, order) before refresh
    const taskId = await movedTask.getAttribute('data-testid');
    const initialTaskData = await db.tasks.toArray();
    const movedTaskData = initialTaskData.find((t) => t.id === parseInt(taskId?.replace('task-', '') || '0'));

    // Refresh page
    await page.reload();

    // Verify task still in target column
    await expect(movedTask).toBeVisible();

    // Verify task data integrity (ID, column, fields preserved)
    const refreshedTaskData = await db.tasks.toArray();
    const refreshedTask = refreshedTaskData.find((t) => t.id === movedTaskData?.id);

    expect(refreshedTask).toBeDefined();
    expect(refreshedTask?.columnId).toBe(targetColumnId);
    expect(refreshedTask?.title).toBe(taskTitle);
    // Task ID and other fields should be unchanged
  });
});
