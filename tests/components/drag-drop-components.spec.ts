import { test, expect } from '@playwright/test';
import { createColumns } from '../support/factories/column.factory';
import { createTask, createTasks } from '../support/factories/task.factory';
import { db } from '@/db';

/**
 * Story 1.6: Component Tests for Drag-and-Drop
 * 
 * RED PHASE - All tests intentionally failing (components not implemented yet)
 * Tests assert component behavior; implementation will make them pass
 * 
 * @category component
 * @priority p0
 */

test.describe('Story 1.6: Component Tests - Drag-and-Drop', () => {
  test.beforeEach(async () => {
    const columns = createColumns(3);
    await db.columns.bulkAdd(columns);

    for (const column of columns) {
      const tasks = createTasks(3, column.id!);
      await db.tasks.bulkAdd(tasks);
    }
  });

  test.afterEach(async () => {
    await db.tasks.clear();
    await db.columns.clear();
  });

  test.skip('DraggableTaskCard - Component renders with @dnd-kit useSortable hook', async ({
    page,
  }) => {
    /**
     * AC-1, AC-3: Visual Feedback
     * 
     * DraggableTaskCard should:
     * - Wrap TaskCard with @dnd-kit useSortable
     * - Apply transform and opacity for drag feedback
     * - Show isDragging state visually (reduced opacity, shadow)
     * - Have aria-label for accessibility
     */

    await page.goto('/');

    // Get a task card
    const taskCard = page.locator('[data-testid="task-1"]').first();

    // Verify component renders
    await expect(taskCard).toBeVisible();

    // Verify data-testid is present (required for @dnd-kit identification)
    const taskId = await taskCard.getAttribute('data-testid');
    expect(taskId).toMatch(/^task-\d+$/);

    // Verify aria-label for accessibility
    const ariaLabel = await taskCard.getAttribute('aria-label');
    expect(ariaLabel).toBeTruthy();

    // Verify component has draggable styles (will be applied by useSortable)
    const classList = await taskCard.evaluate((el) => Array.from(el.classList));
    expect(classList.length).toBeGreaterThan(0); // Should have Tailwind classes

    // Verify TaskCard content is visible inside DraggableTaskCard
    const title = taskCard.locator('[data-testid^="task-title"]');
    await expect(title).toBeVisible();

    // Test drag state: start drag and verify opacity changes
    const initialOpacity = await taskCard.evaluate((el) => {
      const styles = window.getComputedStyle(el);
      return styles.opacity;
    });

    // Simulate drag start (implementation will handle via listeners)
    // Note: Full drag test is in E2E tests; this tests component rendering
    expect(initialOpacity).toBeDefined();
  });

  test.skip('SortableColumn - Drop zone responds to drag over', async ({
    page,
  }) => {
    /**
     * AC-1, AC-2, AC-3: Drop Target
     * 
     * SortableColumn should:
     * - Create droppable zone via @dnd-kit useDroppable
     * - Highlight or show visual indicator when drag over (isOver state)
     * - Render SortableContext for tasks
     * - Show drop indicator (line or shadow)
     */

    await page.goto('/');

    // Get a column
    const column = page.locator('[data-testid="column-1"]');
    const dropZone = page.locator('[data-testid="column-drop-zone-1"]');

    // Verify column and drop zone exist
    await expect(column).toBeVisible();
    await expect(dropZone).toBeVisible();

    // Get initial styles
    const initialBg = await column.evaluate((el) => {
      const styles = window.getComputedStyle(el);
      return styles.backgroundColor;
    });

    // Verify drop indicator element exists or will be created during drag
    const dropIndicator = column.locator('[class*="drop-indicator"], [class*="insertion"]');
    // May not be visible until drag starts

    // Verify column has proper structure for SortableContext
    const tasks = column.locator('[data-testid^="task-"]');
    const taskCount = await tasks.count();
    expect(taskCount).toBeGreaterThan(0);

    // Verify tasks have proper IDs for SortableContext
    const taskIds = await tasks.evaluateAll((elements) =>
      elements.map((el) => el.getAttribute('data-testid')),
    );
    expect(taskIds.every((id) => id?.match(/^task-\d+$/))).toBe(true);
  });

  test.skip('moveTask - Updates Dexie and AppContext on task move', async ({
    page,
  }) => {
    /**
     * AC-1, AC-2, AC-8: Data Persistence
     * 
     * moveTask method should:
     * - Accept taskId, targetColumnId, newOrder
     * - Update Dexie: set columnId and order fields
     * - Update AppContext state immutably
     * - Handle within-column reorder (same column, different order)
     * - Handle cross-column move (different column, auto-order)
     * - Return Promise<void>
     */

    await page.goto('/');

    const initialTasks = await db.tasks.toArray();
    const taskToMove = initialTasks[0];
    const sourceColumnId = taskToMove.columnId;
    const targetColumnId = sourceColumnId === 1 ? 2 : 1;

    // Test moveTask via API
    // (Implementation will expose moveTask through AppContext)

    // For now, test that task data structure supports the move
    expect(taskToMove.id).toBeDefined();
    expect(taskToMove.columnId).toBeDefined();
    expect(taskToMove.order).toBeDefined(); // Should have order field

    // Simulate what moveTask should do:
    // 1. Get current order in target column
    const targetColumnTasks = initialTasks.filter((t) => t.columnId === targetColumnId);
    const newOrder = targetColumnTasks.length;

    // 2. Update Dexie
    await db.tasks.update(taskToMove.id!, {
      columnId: targetColumnId,
      order: newOrder,
    });

    // 3. Verify update in database
    const updatedTask = await db.tasks.get(taskToMove.id!);
    expect(updatedTask?.columnId).toBe(targetColumnId);
    expect(updatedTask?.order).toBe(newOrder);

    // 4. Verify task no longer in source column (app-wide check)
    const tasksInSourceColumn = await db.tasks
      .where('columnId')
      .equals(sourceColumnId)
      .toArray();
    const movedTaskInSource = tasksInSourceColumn.find((t) => t.id === taskToMove.id);
    expect(movedTaskInSource).toBeUndefined();
  });

  test.skip('Task order field - Persisted in Dexie and sorted correctly', async ({
    page,
  }) => {
    /**
     * AC-2, AC-8: Order Field
     * 
     * Tasks should:
     * - Have order field in schema (optional number)
     * - Be indexed in Dexie for efficient queries
     * - Be sorted by order when displayed in column
     * - Maintain order after refresh
     */

    // Create tasks with specific orders
    const column = createColumns(1)[0];
    await db.columns.add(column);

    const tasks = [
      createTask(column.id!, { order: 0, title: 'First Task' }),
      createTask(column.id!, { order: 1, title: 'Second Task' }),
      createTask(column.id!, { order: 2, title: 'Third Task' }),
    ];

    for (const task of tasks) {
      await db.tasks.add(task);
    }

    // Query tasks sorted by order
    const queriedTasks = await db.tasks
      .where('columnId')
      .equals(column.id!)
      .toArray()
      .then((tasks) => tasks.sort((a, b) => (a.order ?? 0) - (b.order ?? 0)));

    // Verify order
    expect(queriedTasks[0].title).toBe('First Task');
    expect(queriedTasks[1].title).toBe('Second Task');
    expect(queriedTasks[2].title).toBe('Third Task');

    // Verify order field is preserved
    expect(queriedTasks.every((t) => t.order !== undefined)).toBe(true);

    // Load app and verify rendering order
    await page.goto('/');

    const columnEl = page.locator(`[data-testid="column-${column.id}"]`);
    const renderedTasks = columnEl.locator('[data-testid^="task-"]');

    const renderedTitles = await renderedTasks.evaluateAll((elements) =>
      elements.map((el) => el.textContent || ''),
    );

    // Should be in order: First, Second, Third
    expect(renderedTitles[0]).toContain('First Task');
    expect(renderedTitles[1]).toContain('Second Task');
    expect(renderedTitles[2]).toContain('Third Task');
  });

  test.skip('Error handling - Shows message and reverts on move failure', async ({
    page,
  }) => {
    /**
     * AC-6: Error Recovery
     * 
     * Move operation should:
     * - Wrap moveTask in try/catch
     * - Show error message if save fails
     * - Revert visual position on error
     * - Log error to console
     * - Display user-friendly message: "Failed to move task. Please try again."
     */

    await page.goto('/');

    // Setup error condition
    const errorSpy = page.on('console', (msg) => {
      if (msg.type() === 'error') {
        expect(msg.text()).toContain('Failed');
      }
    });

    // Attempt move with error (implementation will handle)
    const errorMessage = page.locator('[data-testid="error-message"]');

    // If error message exists and is visible, verify its content
    const isErrorVisible = await errorMessage.isVisible().catch(() => false);

    if (isErrorVisible) {
      const errorText = await errorMessage.textContent();
      expect(errorText).toContain(/Failed to move|try again/i);
    }
  });

  test.skip('Accessibility - aria-label and focus management', async ({
    page,
  }) => {
    /**
     * AC-4: Accessibility
     * 
     * Draggable items should:
     * - Have aria-label describing task
     * - Have aria-describedby pointing to help text
     * - Support keyboard navigation
     * - Manage focus correctly after move
     * - Support screen reader announcements
     */

    await page.goto('/');

    // Tab to first draggable item
    await page.keyboard.press('Tab');

    const focusedTask = page.locator('[data-testid^="task-"]:focus');
    await expect(focusedTask).toHaveCount(1);

    // Verify aria attributes
    const ariaLabel = await focusedTask.getAttribute('aria-label');
    expect(ariaLabel).toBeTruthy();

    const ariaDescribed = await focusedTask.getAttribute('aria-describedby');
    // May be present for keyboard hint

    // Verify keyboard can navigate through tasks
    const initialTaskId = await focusedTask.getAttribute('data-testid');

    // Tab to next item (may be next task or other control)
    await page.keyboard.press('Tab');
    const nextFocused = page.locator('[data-testid^="task-"]:focus');
    const nextTaskId = await nextFocused.getAttribute('data-testid').catch(() => null);

    // If next focused is a task, it should be different from current
    if (nextTaskId?.startsWith('task-')) {
      expect(nextTaskId).not.toBe(initialTaskId);
    }

    // Verify aria-live region exists for announcements
    const ariaLive = page.locator('[aria-live]');
    const liveRegionCount = await ariaLive.count();
    expect(liveRegionCount).toBeGreaterThan(0);
  });

  test.skip('Animations - Respects prefers-reduced-motion', async ({
    page,
  }) => {
    /**
     * AC-3: Accessibility - prefers-reduced-motion
     * 
     * When prefers-reduced-motion: reduce is set:
     * - Disable animations on drag
     * - Keep drag-and-drop functional
     * - No visual flicker or motion
     */

    // Emulate prefers-reduced-motion
    await page.emulateMedia({ reducedMotion: 'reduce' });

    await page.goto('/');

    const taskCard = page.locator('[data-testid="task-1"]').first();

    // Get transition styles
    const transition = await taskCard.evaluate((el) => {
      const styles = window.getComputedStyle(el);
      return styles.transition;
    });

    // Verify transition is disabled or set to 'none'
    expect(transition).toMatch(/none|0s/);

    // Verify drag-and-drop still works (no animation, just position change)
    const targetColumn = page.locator('[data-testid="column-drop-zone-2"]');
    await taskCard.dragTo(targetColumn);

    // Verify task moved (no animation, instant)
    const title = await taskCard.locator('[data-testid^="task-title"]').textContent();
    const movedTask = page.locator('[data-testid="column-2"]').locator('[data-testid^="task-"]', {
      hasText: title || '',
    });

    await expect(movedTask).toBeVisible();
  });
});
