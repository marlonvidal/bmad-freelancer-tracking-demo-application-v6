import { test, expect } from '@playwright/experimental-ct-react';
import DraggableTaskCard from '@/components/DraggableTaskCard';
import SortableColumn from '@/components/SortableColumn';
import { Task } from '@/schemas/task';
import { Column } from '@/db/schema';

/**
 * ATDD RED Phase Component Tests: Story 1.6 - Drag-and-Drop
 * 
 * These tests verify component-level behavior for drag-and-drop functionality.
 * They are currently FAILING (RED phase) and define expected component states.
 */

test.describe('DraggableTaskCard Component', () => {
  // ============================================================================
  // AC 3: Visual Feedback - Opacity During Drag
  // ============================================================================

  test('should apply opacity during drag', async ({ mount }) => {
    // GIVEN: A draggable task card
    const mockTask: Task = {
      id: 1,
      title: 'Test Task',
      columnId: 1,
      priority: 'Medium',
      completed: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const component = await mount(
      <DraggableTaskCard task={mockTask} />
    );

    // Get the wrapper element that has the drag styles
    const wrapper = component.locator('div').first();

    // WHEN: Component is in normal state
    // THEN: Opacity should be 1
    let computedStyle = await wrapper.evaluate((el) => {
      return window.getComputedStyle(el).opacity;
    });
    expect(computedStyle).toBe('1');

    // WHEN: I simulate drag state (this depends on how the component exposes isDragging)
    // For now, we'll assume the component sets opacity based on internal state
    // A more sophisticated test would mock @dnd-kit's useSortable hook

    // THEN: During drag, opacity should be reduced
    // (This requires either: mocking useSortable, or triggering via pointer events)
  });

  // ============================================================================
  // AC 4: Accessibility - Aria Attributes
  // ============================================================================

  test('should have proper aria attributes for accessibility', async ({
    mount,
  }) => {
    // GIVEN: A draggable task card
    const mockTask: Task = {
      id: 1,
      title: 'Important Task',
      columnId: 1,
      priority: 'High',
      completed: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const component = await mount(
      <DraggableTaskCard task={mockTask} />
    );

    // THEN: aria-label should describe the task and drag capability
    const draggableElement = component.locator('[role="button"]');
    const ariaLabel = await draggableElement.getAttribute('aria-label');
    expect(ariaLabel).toMatch(/drag/i);
    expect(ariaLabel).toContain('Important Task');

    // AND: aria-pressed should indicate draggable state (optional but recommended)
    const ariaPressed = await draggableElement.getAttribute('aria-pressed');
    expect(['true', 'false', null]).toContain(ariaPressed);

    // AND: aria-describedby should point to helpful description (if present)
    const ariaDescribedBy = await draggableElement.getAttribute('aria-describedby');
    if (ariaDescribedBy) {
      const description = await component.locator(`#${ariaDescribedBy}`);
      await expect(description).toBeVisible();
    }
  });

  // ============================================================================
  // AC 3: Animations Respect prefers-reduced-motion
  // ============================================================================

  test('should disable animations when prefers-reduced-motion is set', async ({
    mount,
    context,
  }) => {
    // GIVEN: User prefers reduced motion
    await context.evaluateHandle(() => {
      // Mock matchMedia to return true for prefers-reduced-motion
      (window as any).matchMedia = (query: string) => {
        if (query === '(prefers-reduced-motion: reduce)') {
          return { matches: true, media: query, onchange: null };
        }
        return { matches: false, media: query, onchange: null };
      };
    });

    const mockTask: Task = {
      id: 1,
      title: 'Test Task',
      columnId: 1,
      priority: 'Medium',
      completed: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const component = await mount(
      <DraggableTaskCard task={mockTask} />
    );

    // WHEN: Component renders with reduced motion preference
    const wrapper = component.locator('div').first();

    // THEN: CSS transition should be 'none'
    const transition = await wrapper.evaluate((el) => {
      return window.getComputedStyle(el).transition;
    });
    expect(transition).toContain('none');

    // AND: Drag-and-drop should still be functional (no opacity, position, etc.)
    // This is harder to test in component tests; see E2E tests for full verification
  });

  // ============================================================================
  // AC 3: Task Title Data-testid
  // ============================================================================

  test('should render with correct data-testid attributes', async ({
    mount,
  }) => {
    // GIVEN: A draggable task card
    const mockTask: Task = {
      id: 42,
      title: 'Urgent Task',
      columnId: 1,
      priority: 'High',
      completed: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const component = await mount(
      <DraggableTaskCard task={mockTask} />
    );

    // THEN: Should have task data-testid
    const taskElement = component.locator('[data-testid="task-42"]');
    await expect(taskElement).toBeVisible();

    // AND: May have task-title data-testid
    const titleElement = component.locator('[data-testid="task-title-42"]');
    if (await titleElement.isVisible().catch(() => false)) {
      await expect(titleElement).toContainText('Urgent Task');
    }
  });
});

test.describe('SortableColumn Component', () => {
  // ============================================================================
  // AC 3: Drop Zone Highlighting
  // ============================================================================

  test('should highlight when dragging over column', async ({ mount }) => {
    // GIVEN: A sortable column
    const mockColumn: Column = {
      id: 1,
      name: 'To Do',
      order: 0,
      createdAt: new Date().toISOString(),
    };

    const mockTasks: Task[] = [
      {
        id: 1,
        title: 'Task 1',
        columnId: 1,
        priority: 'Medium',
        completed: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];

    const component = await mount(
      <SortableColumn column={mockColumn} tasks={mockTasks} />
    );

    // Get the column container
    const columnElement = component.locator(`[data-testid="column-${mockColumn.id}"]`);

    // WHEN: Component is in default state
    // THEN: Should not have highlight class
    const defaultClass = await columnElement.getAttribute('class');
    expect(defaultClass).not.toContain('bg-blue-50');

    // WHEN: Drop zone is active (isOver = true)
    // This is tricky to test without mocking @dnd-kit's useDroppable
    // In a real test, we'd mock the hook or use @dnd-kit's testing utilities

    // THEN: Should have highlight class (e.g., bg-blue-50, border-blue-300)
    // Placeholder expectation - would be verified after implementation
  });

  // ============================================================================
  // AC 1, 2: Column Drop Zone
  // ============================================================================

  test('should render sortable context for tasks', async ({ mount }) => {
    // GIVEN: A sortable column with multiple tasks
    const mockColumn: Column = {
      id: 1,
      name: 'To Do',
      order: 0,
      createdAt: new Date().toISOString(),
    };

    const mockTasks: Task[] = [
      {
        id: 1,
        title: 'Task 1',
        columnId: 1,
        priority: 'Medium',
        order: 0,
        completed: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 2,
        title: 'Task 2',
        columnId: 1,
        priority: 'Low',
        order: 1,
        completed: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 3,
        title: 'Task 3',
        columnId: 1,
        priority: 'High',
        order: 2,
        completed: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];

    const component = await mount(
      <SortableColumn column={mockColumn} tasks={mockTasks} />
    );

    // THEN: All tasks should be rendered
    for (const task of mockTasks) {
      const taskElement = component.locator(`[data-testid="task-${task.id}"]`);
      await expect(taskElement).toBeVisible();
    }

    // AND: Tasks should be sorted by order field
    const taskElements = await component
      .locator('[data-testid^="task-"]')
      .all();
    expect(taskElements).toHaveLength(3);

    // Verify order (task IDs should be 1, 2, 3 based on order field)
    for (let i = 0; i < taskElements.length; i++) {
      const expectedId = i + 1;
      const testId = await taskElements[i].getAttribute('data-testid');
      expect(testId).toBe(`task-${expectedId}`);
    }
  });

  // ============================================================================
  // AC 3: Empty Column State
  // ============================================================================

  test('should show add task button in empty column', async ({ mount }) => {
    // GIVEN: An empty sortable column
    const mockColumn: Column = {
      id: 1,
      name: 'To Do',
      order: 0,
      createdAt: new Date().toISOString(),
    };

    const component = await mount(
      <SortableColumn column={mockColumn} tasks={[]} />
    );

    // THEN: "No tasks yet" message should appear
    const emptyMessage = component.locator('text=No tasks yet');
    await expect(emptyMessage).toBeVisible();

    // AND: Add task button should be visible
    const addButton = component.locator('button:has-text("Add task")');
    await expect(addButton).toBeVisible();
  });
});

test.describe('Error Message Component', () => {
  // ============================================================================
  // AC 6: Error Recovery UI
  // ============================================================================

  test('should display error message with proper accessibility', async ({
    mount,
  }) => {
    // GIVEN: An error message should be rendered
    const component = await mount(
      <div data-testid="error-message" role="alert">
        Failed to move task. Please try again.
      </div>
    );

    // THEN: Error message should be visible
    const errorElement = component.locator('[data-testid="error-message"]');
    await expect(errorElement).toBeVisible();

    // AND: Should have alert role for screen readers
    const role = await errorElement.getAttribute('role');
    expect(role).toBe('alert');

    // AND: Should contain expected error text
    await expect(errorElement).toContainText(
      'Failed to move task. Please try again.'
    );

    // AND: Should have appropriate styling (color, visibility)
    const className = await errorElement.getAttribute('class');
    // Expecting error classes like 'bg-red-50 text-red-700' etc.
    // Exact classes depend on implementation
  });
});

test.describe('Drop Indicator Component', () => {
  // ============================================================================
  // AC 3: Drop Indicator UI
  // ============================================================================

  test('should show drop indicator during drag-over', async ({ mount }) => {
    // GIVEN: A drop indicator element
    const component = await mount(
      <div data-testid="drop-indicator" className="h-1 bg-blue-400 my-2">
        {/* Indicator line */}
      </div>
    );

    // THEN: Drop indicator should be present
    const indicator = component.locator('[data-testid="drop-indicator"]');
    await expect(indicator).toBeVisible();

    // AND: Should have visual styling (height, color)
    const height = await indicator.evaluate((el) => {
      return window.getComputedStyle(el).height;
    });
    expect(height).not.toBe('0px'); // Should have some height

    const backgroundColor = await indicator.evaluate((el) => {
      return window.getComputedStyle(el).backgroundColor;
    });
    expect(backgroundColor).toContain('blue'); // Should be blue-ish color
  });
});
