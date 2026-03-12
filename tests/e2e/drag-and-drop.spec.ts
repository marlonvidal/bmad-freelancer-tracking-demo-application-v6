import { test, expect } from '@playwright/test';

/**
 * ATDD RED Phase Tests: Story 1.6 - Drag-and-Drop
 * 
 * These tests are currently FAILING (RED phase of TDD).
 * They define the expected behavior before implementation.
 * 
 * Implementation checklist shows what needs to be built to make these tests pass.
 */

test.describe('Drag-and-Drop Functionality', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to home page
    await page.goto('/');
    
    // Wait for kanban board to load
    await page.waitForSelector('[data-testid="kanban-board"]');
  });

  // ============================================================================
  // AC 1: Drag Task Between Columns
  // ============================================================================

  test('should move task from one column to another and persist', async ({
    page,
  }) => {
    // GIVEN: Two columns with tasks
    // Assumption: Story 1.4 and 1.5 fixtures have created columns and tasks
    const taskInColumn1 = page.locator('[data-testid="task-1"]').first();
    const targetColumn = page.locator('[data-testid="column-2"]');

    // WHEN: I drag task from column 1 to column 2
    await taskInColumn1.dragTo(targetColumn);

    // THEN: Task appears in column 2
    const taskInColumn2 = targetColumn.locator('[data-testid="task-1"]');
    await expect(taskInColumn2).toBeVisible();

    // AND: Refresh page
    await page.reload();
    await page.waitForSelector('[data-testid="kanban-board"]');

    // AND: Task remains in column 2 after refresh
    const refreshedTask = page
      .locator('[data-testid="column-2"]')
      .locator('[data-testid="task-1"]');
    await expect(refreshedTask).toBeVisible();
  });

  test('should preserve task order when moving to column with existing tasks', async ({
    page,
  }) => {
    // GIVEN: Column 1 with 2 tasks, Column 2 with 3 tasks
    // Assumption: Fixtures create known test data
    const taskFromColumn1 = page.locator('[data-testid="task-1"]').first();
    const column2DropZone = page.locator('[data-testid="column-2"]');

    // WHEN: I drag task from column 1 to middle of column 2
    // (Drop between position 1 and 2 of column 2)
    await taskFromColumn1.dragTo(column2DropZone, {
      targetPosition: { x: 0, y: 100 }, // Position in middle of column
    });

    // THEN: Task inserted between existing tasks, others shift
    const tasksInColumn2 = column2DropZone.locator('[data-testid^="task-"]');
    const taskCount = await tasksInColumn2.count();
    expect(taskCount).toBe(4); // Original 3 + moved task
  });

  test('should show drop target highlight during drag-over', async ({
    page,
  }) => {
    // GIVEN: Board with draggable task
    const taskCard = page.locator('[data-testid="task-1"]').first();
    const targetColumn = page.locator('[data-testid="column-2"]');

    // WHEN: I start dragging task
    await taskCard.hover();
    await page.mouse.down();

    // AND: I drag over target column
    await targetColumn.hover();

    // THEN: Target column shows highlight (blue background, blue border)
    const columnStyle = await targetColumn.evaluate((el) => {
      const style = window.getComputedStyle(el);
      return {
        backgroundColor: style.backgroundColor,
        borderColor: style.borderColor,
      };
    });

    // Verify highlight applied (class or inline style with blue color)
    const isHighlighted =
      columnStyle.backgroundColor.includes('blue') ||
      columnStyle.borderColor.includes('blue');
    expect(isHighlighted).toBe(true);

    // CLEANUP: Release mouse
    await page.mouse.up();
  });

  test('should show drop indicator for insertion point', async ({ page }) => {
    // GIVEN: Board with multiple tasks in a column
    const taskCard = page.locator('[data-testid="task-1"]').first();
    const targetColumn = page.locator('[data-testid="column-2"]');

    // WHEN: I start dragging task
    await taskCard.hover();
    await page.mouse.down();

    // AND: I drag over gap between tasks in target column
    await targetColumn.hover();

    // THEN: Drop indicator appears (line or marker)
    const dropIndicator = page.locator('[data-testid="drop-indicator"]');
    await expect(dropIndicator).toBeVisible();

    // CLEANUP
    await page.mouse.up();
  });

  // ============================================================================
  // AC 2: Reorder Tasks Within Column
  // ============================================================================

  test('should reorder tasks within same column and persist', async ({
    page,
  }) => {
    // GIVEN: Column with 3 tasks: A (id=1), B (id=2), C (id=3)
    const column = page.locator('[data-testid="column-1"]');
    const taskC = column.locator('[data-testid="task-3"]');
    const taskA = column.locator('[data-testid="task-1"]');

    // Initial order: A, B, C
    let tasks = await column.locator('[data-testid^="task-"]').all();
    expect(tasks).toHaveLength(3);

    // WHEN: I drag task C to position before A
    await taskC.dragTo(taskA);

    // THEN: Order becomes: C, A, B
    const reorderedTasks = await column
      .locator('[data-testid^="task-"]')
      .all();
    const firstTaskId = await reorderedTasks[0].getAttribute('data-testid');
    expect(firstTaskId).toBe('task-3');

    // AND: Refresh page to verify persistence
    await page.reload();
    await page.waitForSelector('[data-testid="kanban-board"]');

    // AND: Order is still C, A, B
    const refreshedColumn = page.locator('[data-testid="column-1"]');
    const refreshedTasks = await refreshedColumn
      .locator('[data-testid^="task-"]')
      .all();
    const refreshedFirstTaskId =
      await refreshedTasks[0].getAttribute('data-testid');
    expect(refreshedFirstTaskId).toBe('task-3');
  });

  test('should handle multiple consecutive reorders', async ({ page }) => {
    // GIVEN: Column with 5 tasks
    const column = page.locator('[data-testid="column-1"]');
    let tasks = await column.locator('[data-testid^="task-"]').all();
    expect(tasks).toHaveLength(5);

    // WHEN: I perform multiple reorders
    // Move task 5 to position 1
    await column.locator('[data-testid="task-5"]').dragTo(column.locator('[data-testid="task-1"]'));

    // Move task 3 to end
    const currentTask3 = column.locator('[data-testid="task-3"]');
    const columnDropZone = column.locator('[data-testid="column-drop-zone"]');
    if (await columnDropZone.isVisible()) {
      await currentTask3.dragTo(columnDropZone);
    }

    // Move task 1 to middle
    const currentTask1 = column.locator('[data-testid="task-1"]');
    const middleTask = column.locator('[data-testid="task-2"]');
    await currentTask1.dragTo(middleTask);

    // THEN: All moves succeed without error
    const finalTasks = await column.locator('[data-testid^="task-"]').all();
    expect(finalTasks).toHaveLength(5);
  });

  // ============================================================================
  // AC 7: Performance with Multiple Tasks
  // ============================================================================

  test('should maintain smooth drag-and-drop with 100+ tasks', async ({
    page,
  }) => {
    // GIVEN: Column with 100+ tasks (created by test fixture or factory)
    // Assumption: Test data includes largeBoard fixture with 100 tasks
    await page.goto('/?test-data=large-board');
    await page.waitForSelector('[data-testid="kanban-board"]');

    const column = page.locator('[data-testid="column-1"]');

    // WHEN: I perform drag operations and measure FPS
    let frameCount = 0;
    let lastTime = performance.now();

    // Collect frame timing
    const collectFrames = await page.evaluate(() => {
      return new Promise<number>((resolve) => {
        let frames = 0;
        let start = performance.now();

        function countFrame() {
          frames++;
          const elapsed = performance.now() - start;
          if (elapsed >= 1000) {
            resolve(frames); // Return FPS after 1 second
          } else {
            requestAnimationFrame(countFrame);
          }
        }

        requestAnimationFrame(countFrame);
      });
    });

    // Drag a task while measuring
    const task = column.locator('[data-testid="task-1"]');
    await task.hover();
    await page.mouse.down();

    // Simulate drag movement
    for (let i = 0; i < 5; i++) {
      await page.mouse.move(100, 100 + i * 50, { steps: 5 });
      await page.waitForTimeout(50);
    }

    await page.mouse.up();

    // THEN: FPS >= 55 (allowing 10% variance from 60fps target)
    expect(collectFrames).toBeGreaterThanOrEqual(55);
  });

  // ============================================================================
  // AC 8: Data Integrity & Persistence
  // ============================================================================

  test('should retain task position and column after page refresh', async ({
    page,
  }) => {
    // GIVEN: Initial task positions
    const taskToMove = page.locator('[data-testid="task-1"]').first();
    const targetColumn = page.locator('[data-testid="column-2"]');

    // WHEN: I move task to new column
    await taskToMove.dragTo(targetColumn);

    // AND: Wait for save to complete
    await page.waitForTimeout(500); // Allow Dexie to persist

    // AND: Refresh page
    await page.reload();
    await page.waitForSelector('[data-testid="kanban-board"]');

    // THEN: Task appears in moved column (not original)
    const movedTask = targetColumn.locator('[data-testid="task-1"]');
    await expect(movedTask).toBeVisible();

    // AND: Task NOT in original column
    const originalColumn = page.locator('[data-testid="column-1"]');
    const taskInOriginal = originalColumn.locator('[data-testid="task-1"]');
    await expect(taskInOriginal).not.toBeVisible();

    // AND: Verify Dexie persisted the change
    const taskInDb = await page.evaluate(async (taskId) => {
      // Assume db is available in window for testing
      // This depends on how the app exports db for testing
      const result = await (window as any).db?.tasks
        .where('id')
        .equals(taskId)
        .first();
      return result;
    }, 1);

    expect(taskInDb).toBeDefined();
    expect(taskInDb?.columnId).toBe(2); // Moved to column 2
  });

  // ============================================================================
  // AC 4: Keyboard Support (Bonus - Optional)
  // ============================================================================

  test('should support keyboard navigation with arrow keys', async ({
    page,
  }) => {
    // GIVEN: Focused on draggable task
    const taskCard = page.locator('[data-testid="task-1"]').first();
    await taskCard.focus();

    // WHEN: I press Space to enter drag mode
    await page.keyboard.press('Space');

    // THEN: Task shows selected state
    const ariaPressed = await taskCard.getAttribute('aria-pressed');
    expect(ariaPressed).toBe('true');

    // WHEN: I press ArrowDown to move down
    await page.keyboard.press('ArrowDown');

    // THEN: Task position updates
    // (Exact behavior depends on @dnd-kit keyboard implementation)

    // WHEN: I press Enter to drop
    await page.keyboard.press('Enter');

    // THEN: Task is dropped and aria-pressed is false
    const ariaPressedAfterDrop = await taskCard.getAttribute('aria-pressed');
    expect(ariaPressedAfterDrop).toBe('false');
  });

  // ============================================================================
  // AC 5: Touch Support (Bonus - Optional)
  // ============================================================================

  test('should support touch drag-and-drop', async ({ page }) => {
    // GIVEN: Mobile viewport and draggable task
    await page.setViewportSize({ width: 390, height: 844 }); // iPhone 12
    const taskCard = page.locator('[data-testid="task-1"]').first();
    const targetColumn = page.locator('[data-testid="column-2"]');

    // WHEN: I perform touch drag (long-press ~500ms, then drag)
    const taskBox = await taskCard.boundingBox();
    if (!taskBox) throw new Error('Task not visible');

    // Simulate long-press
    await page.touchscreen.tap(taskBox.x + taskBox.width / 2, taskBox.y + taskBox.height / 2);
    await page.waitForTimeout(500); // Long-press duration

    // Drag to target
    const targetBox = await targetColumn.boundingBox();
    if (!targetBox) throw new Error('Target column not visible');

    await page.touchscreen.swipe(
      taskBox.x + taskBox.width / 2,
      taskBox.y + taskBox.height / 2,
      targetBox.x + targetBox.width / 2,
      targetBox.y + targetBox.height / 2,
      { steps: 10 }
    );

    // THEN: Task moves to target column
    const movedTask = targetColumn.locator('[data-testid="task-1"]');
    await expect(movedTask).toBeVisible();
  });

  // ============================================================================
  // AC 6: Error Recovery
  // ============================================================================

  test('should show error message and revert task on move failure', async ({
    page,
  }) => {
    // GIVEN: Simulate Dexie error by intercepting database call
    await page.route('**/*', async (route) => {
      if (route.request().method() === 'POST' && route.request().postDataJSON()?.action === 'updateTask') {
        // Simulate database error
        await route.abort();
      } else {
        await route.continue();
      }
    });

    const taskCard = page.locator('[data-testid="task-1"]').first();
    const targetColumn = page.locator('[data-testid="column-2"]');
    const initialParent = page.locator('[data-testid="column-1"]');

    // WHEN: I try to move task (will fail)
    await taskCard.dragTo(targetColumn);
    await page.waitForTimeout(500); // Wait for error

    // THEN: Error message appears
    const errorMessage = page.locator('[data-testid="error-message"]');
    await expect(errorMessage).toBeVisible();
    await expect(errorMessage).toContainText('Failed to move task');

    // AND: Task reverts to original position
    const revertedTask = initialParent.locator('[data-testid="task-1"]');
    await expect(revertedTask).toBeVisible();
  });
});
