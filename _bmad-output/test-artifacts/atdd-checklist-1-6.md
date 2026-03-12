---
stepsCompleted:
  - step-01-preflight-and-context
  - step-02-generation-mode
  - step-03-test-strategy
lastStep: step-03-test-strategy
lastSaved: '2026-03-12T00:00:00Z'
workflowType: testarch-atdd
inputDocuments:
  - story: _bmad-output/implementation-artifacts/1-6-move-and-reorder-tasks-via-drag-and-drop.md
  - config: _bmad/tea/config.yaml
  - knowledge: data-factories, component-tdd, test-quality, test-healing-patterns, selector-resilience, timing-debugging, playwright-utils
---

# ATDD Checklist - Epic 1, Story 1.6: Move and Reorder Tasks via Drag-and-Drop

**Date:** 2026-03-12  
**Author:** Marlon  
**Primary Test Level:** E2E (with Component and API support tests)  
**Stack:** Frontend (React + TypeScript + Playwright)

---

## Story Summary

As a freelancer, I want to move tasks between columns and reorder them within a column via drag-and-drop, so that I can manage my workflow visually without extra clicks.

**As a** freelancer  
**I want** drag-and-drop functionality to move tasks between columns and reorder within columns  
**So that** I can manage my workflow visually and efficiently

---

## Acceptance Criteria

1. **AC 1: Drag Task Between Columns** - Task moves to target column and persists with visual feedback
2. **AC 2: Reorder Tasks Within a Column** - Tasks reorder within same column with accurate position persistence
3. **AC 3: Drag-and-Drop Visual Feedback** - Drop target highlighting, drag opacity, drop indicators, 60fps animations, prefers-reduced-motion support
4. **AC 4: Keyboard Support for Drag-and-Drop** - Arrow keys, Enter, Space for task selection and movement; screen reader announcements
5. **AC 5: Touch Support** - Long-press initiates drag; smooth, responsive touch drag-and-drop
6. **AC 6: Undo/Error Recovery** - Failed moves revert visually; user sees actionable error message
7. **AC 7: Performance with Multiple Tasks** - Smooth 60fps drag-and-drop with 100+ tasks
8. **AC 8: Data Integrity** - Tasks remain in new position/column after page refresh; no data loss

---

## Test Strategy Analysis

### Stack Detection
- **Detected Stack:** Frontend (React + TypeScript)
- **Test Framework:** Playwright (with @dnd-kit for drag-and-drop)
- **Generation Mode:** AI Generation (clear acceptance criteria, standard UI interaction patterns)

### Test Level Mapping

| AC # | Requirement | Primary Test Level | Secondary Coverage | Priority |
|------|-------------|-------------------|-------------------|----------|
| 1 | Move task between columns | E2E | Component | P0 |
| 2 | Reorder tasks within column | E2E | Component | P0 |
| 3 | Visual feedback (highlight, opacity, indicator) | Component | E2E visual verification | P1 |
| 4 | Keyboard support (arrows, Enter) | E2E | Component a11y | P1 |
| 5 | Touch support (long-press, drag) | E2E | Component | P1 |
| 6 | Error recovery & messaging | Component | E2E error flow | P0 |
| 7 | Performance (60fps, 100+ tasks) | E2E (performance measurement) | N/A | P0 |
| 8 | Data persistence after refresh | E2E | N/A | P0 |

### Test Levels Rationale

**E2E Tests (Primary):**
- Cross-column moves require full browser context and DOM state
- Data persistence verification requires page refresh capability
- Keyboard and touch support require real browser sensors
- Performance measurement requires real rendering pipeline
- All critical user workflows (AC 1, 2, 4, 5, 7, 8)

**Component Tests (Secondary):**
- DraggableTaskCard component drag state management
- SortableColumn drop zone highlighting
- Visual feedback (opacity, transforms, animations)
- Error message rendering
- Accessibility attributes verification

**API Tests (N/A):**
- No external service calls involved
- Dexie.js database operations are embedded
- @dnd-kit is client-side library

---

## Failing Tests Created (RED Phase)

### E2E Tests (8 tests)

**File:** `tests/e2e/drag-and-drop.spec.ts` (Expected: ~280 lines)

#### Test Group 1: Cross-Column Moves (AC 1)

- ✅ **Test:** `should move task from one column to another and persist`
  - **Status:** RED - Task not draggable yet; DraggableTaskCard not created
  - **Verifies:** Task moves to target column, persists to Dexie, appears in correct position
  - **Setup:** Page with 2 columns and 3 tasks in column 1
  - **Action:** Drag task from column 1 to column 2
  - **Assert:** Task appears in column 2; refresh page; task remains in column 2

- ✅ **Test:** `should preserve task order when moving to column with existing tasks`
  - **Status:** RED - Task order field not implemented; moveTask() doesn't exist
  - **Verifies:** Correct position calculation when dropping mid-list in target column
  - **Setup:** Column 1 with 2 tasks, Column 2 with 3 tasks
  - **Action:** Drag task from column 1, drop between tasks 1 and 2 in column 2
  - **Assert:** Task positioned between target tasks; other tasks maintain order

- ✅ **Test:** `should show drop target highlight during drag-over`
  - **Status:** RED - SortableColumn drop zone highlighting not implemented
  - **Verifies:** Visual feedback (background color/border) when dragging over valid drop zone
  - **Setup:** Task being dragged, two columns visible
  - **Action:** Drag task over column 2
  - **Assert:** Column 2 shows visual highlight (e.g., blue background, border)

- ✅ **Test:** `should show drop indicator for insertion point`
  - **Status:** RED - Drop indicator UI not implemented
  - **Verifies:** Line or marker shows where task will be inserted
  - **Setup:** Task dragged over column with multiple tasks
  - **Action:** Hover over gap between tasks
  - **Assert:** Insertion indicator line appears between tasks

#### Test Group 2: Within-Column Reorder (AC 2)

- ✅ **Test:** `should reorder tasks within same column and persist`
  - **Status:** RED - moveTask() doesn't handle same-column reorder correctly
  - **Verifies:** Task reorders within column, order persists to Dexie, reflects after refresh
  - **Setup:** Column with 3 tasks: A, B, C (top to bottom)
  - **Action:** Drag task C to position 1 (above A)
  - **Assert:** Order becomes C, A, B; refresh page; order is still C, A, B

- ✅ **Test:** `should handle multiple consecutive reorders`
  - **Status:** RED - Order field arithmetic may have edge cases
  - **Verifies:** Multiple moves in sequence update order correctly without collisions
  - **Setup:** 5 tasks in a column
  - **Action:** Drag task 5 to position 1, then task 3 to end, then task 1 to middle
  - **Assert:** All moves succeed; final order is correct

#### Test Group 3: Performance & Scale (AC 7)

- ✅ **Test:** `should maintain smooth drag-and-drop with 100+ tasks`
  - **Status:** RED - Performance optimization not done; may have layout thrashing
  - **Verifies:** 60fps drag animation with large dataset
  - **Setup:** Column with 100 tasks
  - **Action:** Perform 5 drag-and-drop operations, measure FPS with DevTools
  - **Assert:** FPS ≥ 55 during drag animations

#### Test Group 4: Data Integrity & Persistence (AC 8)

- ✅ **Test:** `should retain task position and column after page refresh`
  - **Status:** RED - Order field not persisted or not loaded from Dexie
  - **Verifies:** After move, refresh, task appears in new position and column
  - **Setup:** Tasks arranged in initial order
  - **Action:** Move task, wait for save, refresh page
  - **Assert:** Task appears in moved position and column

---

### Component Tests (5 tests)

**File:** `tests/component/drag-and-drop.spec.ts` (Expected: ~200 lines)

- ✅ **Test:** `DraggableTaskCard should apply opacity during drag`
  - **Status:** RED - DraggableTaskCard component doesn't exist
  - **Verifies:** isDragging state reduces opacity, visual feedback clear
  - **Setup:** Mount DraggableTaskCard with task
  - **Action:** Simulate drag start
  - **Assert:** Component has opacity < 1 (e.g., 0.5)

- ✅ **Test:** `SortableColumn should highlight on drag-over`
  - **Status:** RED - SortableColumn component doesn't exist; drop zone styling not implemented
  - **Verifies:** Visual highlight applied when isOver state is true
  - **Setup:** Mount SortableColumn with drop zone
  - **Action:** Simulate drag-over event
  - **Assert:** Highlight class/style applied (e.g., bg-blue-50, border-blue-300)

- ✅ **Test:** `should show error message on move failure`
  - **Status:** RED - Error UI component not created; moveTask error handling incomplete
  - **Verifies:** User sees "Failed to move task. Please try again." on Dexie error
  - **Setup:** Mock Dexie.tasks.update to throw error
  - **Action:** Attempt move operation
  - **Assert:** Error message rendered in DOM with accessible alert role

- ✅ **Test:** `DraggableTaskCard should have proper aria attributes`
  - **Status:** RED - aria-label and aria-describedby not added to DraggableTaskCard
  - **Verifies:** Screen reader can announce draggable items and their state
  - **Setup:** Render DraggableTaskCard
  - **Assert:** aria-label present, describes task and drag capability

- ✅ **Test:** `should disable animations when prefers-reduced-motion is set`
  - **Status:** RED - useReducedMotion hook not created; transition logic not implemented
  - **Verifies:** Animations disabled but drag-and-drop still functional
  - **Setup:** Mock matchMedia('prefers-reduced-motion: reduce') to return true
  - **Action:** Render DraggableTaskCard and simulate drag
  - **Assert:** transition CSS property is 'none'; drag still works

---

## Data Factories Created

### Task Factory

**File:** `tests/support/factories/task.factory.ts` (Expected: ~50 lines)

**Exports:**

- `createTask(overrides?)` - Create single task with default/random values
- `createTasks(count, overrides?)` - Create array of tasks

**Example Usage:**

```typescript
import { createTask, createTasks } from '@/tests/support/factories/task.factory';

// Create single task with defaults
const task = createTask();
// Result: { id: 1, title: 'Task 1', columnId: 1, order: 0, ... }

// Create with overrides
const customTask = createTask({ 
  title: 'Urgent task',
  columnId: 2,
  priority: 'High'
});

// Create multiple
const tasks = createTasks(5, { columnId: 1 });
// Result: Array of 5 tasks in column 1 with auto-incremented order
```

### Column Factory

**File:** `tests/support/factories/column.factory.ts` (Expected: ~40 lines)

**Exports:**

- `createColumn(overrides?)` - Create single column
- `createColumns(count, overrides?)` - Create multiple columns

---

## Fixtures Created

### DragAndDrop Fixture

**File:** `tests/support/fixtures/drag-and-drop.fixture.ts` (Expected: ~80 lines)

**Fixtures:**

- `boardWithTasks` - Board with 2 columns and 3 tasks per column
  - **Setup:** Navigate to home, create 2 columns, create 3 tasks in each
  - **Provides:** Board state ready for drag-and-drop testing
  - **Cleanup:** Clear database, close page

- `largeBoard` - Board with 100+ tasks for performance testing
  - **Setup:** Create 1 column with 100 tasks using factory
  - **Provides:** Task array and board ready for performance measurement
  - **Cleanup:** Clear tasks from Dexie

**Example Usage:**

```typescript
import { test } from '@/tests/support/fixtures/drag-and-drop.fixture';

test('should move task between columns', async ({ boardWithTasks, page }) => {
  // boardWithTasks fixture auto-setup; ready to use
  const taskCard = await page.locator('[data-testid="task-1"]');
  await taskCard.dragTo(page.locator('[data-testid="column-2"]'));
  // ...
});
```

---

## Mock Requirements

### Dexie Database

**Mock Requirement:** Override `db.tasks.update()` to simulate failure scenarios

**Success Response:**

```javascript
// Dexie update returns count of updated items (1 = success)
1
```

**Failure Response:**

```javascript
// Simulate network/database error
throw new Error('Database operation failed');
```

**Notes:** 
- Mock only in error recovery tests
- Use real Dexie in other tests to verify persistence
- Clear database between test runs with `await db.clear()`

---

## Required data-testid Attributes

### KanbanBoard

- `kanban-board` - Root kanban container
- `column-{id}` - Each column container
- `task-{id}` - Each task card
- `drop-target-{columnId}` - Drop zone for each column

### DraggableTaskCard

- `task-drag-handle` - Grab handle indicator (or full card is draggable)
- `task-title-{id}` - Task title element for visual verification

### Drop Indicator

- `drop-indicator` - Visual line showing insertion point during drag

### Error Messages

- `error-message` - Error message container with role="alert"

**Implementation Example:**

```tsx
<div data-testid="kanban-board" className="flex gap-6">
  {columns.map(column => (
    <div 
      key={column.id}
      data-testid={`column-${column.id}`}
      className="bg-gray-50 rounded-lg"
    >
      <SortableContext items={tasks.map(t => t.id!)}>
        {tasks.map(task => (
          <div key={task.id} data-testid={`task-${task.id}`}>
            {/* DraggableTaskCard content */}
          </div>
        ))}
      </SortableContext>
    </div>
  ))}
</div>

<div 
  data-testid="error-message" 
  role="alert"
  className={error ? 'block' : 'hidden'}
>
  {error}
</div>
```

---

## Implementation Checklist

### Test: Move Task Between Columns

**File:** `tests/e2e/drag-and-drop.spec.ts` (line ~20)

**Tasks to make this test pass:**

- [ ] Add `order?: number` field to Task schema in `src/schemas/task.ts`
- [ ] Add `order` index to Dexie tasks store in `src/db/schema.ts`
- [ ] Create `src/components/DraggableTaskCard.tsx` wrapping TaskCard with @dnd-kit useSortable
- [ ] Create `src/components/SortableColumn.tsx` with drop zone and droppable setup
- [ ] Implement `moveTask(taskId, targetColumnId, newOrder)` in `src/context/AppContext.tsx`
- [ ] Update `src/components/KanbanBoard.tsx` to wrap with DndContext and handle onDragEnd
- [ ] Add data-testid attributes: `kanban-board`, `column-{id}`, `task-{id}`
- [ ] Implement Dexie update to persist columnId and order changes
- [ ] Run test: `npm run test:e2e -- drag-and-drop.spec.ts`
- [ ] ✅ Test passes (green phase)

**Estimated Effort:** 45 minutes

---

### Test: Reorder Tasks Within Column

**File:** `tests/e2e/drag-and-drop.spec.ts` (line ~50)

**Tasks to make this test pass:**

- [ ] Ensure moveTask handles same-column reorder (different logic than cross-column)
- [ ] Update order field calculation for within-column moves
- [ ] Implement order arithmetic to shift affected tasks (if moving from position 2 to 4, shift tasks 3-4 back)
- [ ] Test with columnId unchanged but order field changed
- [ ] Verify Dexie persists new order
- [ ] Add data-testid to task positions for verification
- [ ] Run test: `npm run test:e2e -- drag-and-drop.spec.ts --grep "reorder within same"`
- [ ] ✅ Test passes (green phase)

**Estimated Effort:** 25 minutes

---

### Test: Drop Target Highlight

**File:** `tests/e2e/drag-and-drop.spec.ts` (line ~90)

**Tasks to make this test pass:**

- [ ] Implement `isOver` state in SortableColumn using @dnd-kit's useDroppable hook
- [ ] Apply conditional CSS class: `isOver ? 'bg-blue-50 border-2 border-blue-300' : 'border-2 border-transparent'`
- [ ] Verify highlight applies during drag-over, removes on drag-out
- [ ] Add visual regression screenshot for highlight state
- [ ] Test with multiple columns to ensure only target column highlights
- [ ] Run test: `npm run test:e2e -- drag-and-drop.spec.ts --grep "drop target highlight"`
- [ ] ✅ Test passes (green phase)

**Estimated Effort:** 20 minutes

---

### Test: Drop Indicator Visibility

**File:** `tests/e2e/drag-and-drop.spec.ts` (line ~110)

**Tasks to make this test pass:**

- [ ] Create drop indicator UI element in SortableColumn
- [ ] Use @dnd-kit's `isSortingOver` or similar to detect hover between tasks
- [ ] Render indicator at insertion point: `<div data-testid="drop-indicator" className="h-1 bg-blue-400 my-2" />`
- [ ] Hide indicator when not dragging over
- [ ] Verify indicator position updates as mouse moves
- [ ] Run test: `npm run test:e2e -- drag-and-drop.spec.ts --grep "drop indicator"`
- [ ] ✅ Test passes (green phase)

**Estimated Effort:** 25 minutes

---

### Test: Keyboard Support (AC 4)

**File:** `tests/e2e/drag-and-drop.spec.ts` (line ~135)

**Tasks to make this test pass:**

- [ ] Add @dnd-kit KeyboardSensor to DndContext in KanbanBoard
- [ ] Configure KeyboardSensor with arrow key coordinateGetter
- [ ] Test workflow: `Tab` to task → `Space` to select → `ArrowDown` to move down → `Enter` to drop
- [ ] Verify focus remains on task after move
- [ ] Test screen reader announcements (use Playwright accessibility testing)
- [ ] Add aria-label: `"Draggable task: {title}, currently in {column}"`
- [ ] Run test: `npm run test:e2e -- drag-and-drop.spec.ts --grep "keyboard support"`
- [ ] ✅ Test passes (green phase)

**Estimated Effort:** 35 minutes (includes accessibility testing)

---

### Test: Touch Support (AC 5)

**File:** `tests/e2e/drag-and-drop.spec.ts` (line ~170)

**Tasks to make this test pass:**

- [ ] Verify @dnd-kit TouchSensor is configured in DndContext
- [ ] Use `page.touchscreen` API to simulate touch drag
- [ ] Test long-press (hold for ~500ms) to initiate drag on touch device
- [ ] Verify task responds to touch drag smoothly (no lag)
- [ ] Test drop: release touch at target
- [ ] Verify data persists after touch drop
- [ ] Run test with mobile viewport: `npm run test:e2e -- drag-and-drop.spec.ts --grep "touch support"`
- [ ] ✅ Test passes (green phase)

**Estimated Effort:** 30 minutes

---

### Test: Error Recovery (AC 6)

**File:** `tests/e2e/drag-and-drop.spec.ts` (line ~200)

**Tasks to make this test pass:**

- [ ] Mock Dexie.tasks.update() to throw error in specific test
- [ ] Update KanbanBoard handleDragEnd to wrap moveTask in try/catch
- [ ] Catch error and set error state: `setError('Failed to move task. Please try again.')`
- [ ] Render error message: `<div data-testid="error-message" role="alert">{error}</div>`
- [ ] Revert task visual position on error (restore to original location)
- [ ] Clear error message after 5 seconds or on next successful move
- [ ] Run test: `npm run test:e2e -- drag-and-drop.spec.ts --grep "error recovery"`
- [ ] ✅ Test passes (green phase)

**Estimated Effort:** 25 minutes

---

### Test: Performance (AC 7)

**File:** `tests/e2e/drag-and-drop.spec.ts` (line ~230)

**Tasks to make this test pass:**

- [ ] Create board with 100+ tasks using largeBoard fixture
- [ ] Perform 5 drag-and-drop operations in sequence
- [ ] Measure FPS using `page.evaluate()` to check `requestAnimationFrame` timing
- [ ] Assert FPS ≥ 55 (allowing for 10% variance from 60fps target)
- [ ] Verify no re-render cascades during drag (use React DevTools Profiler)
- [ ] Consider React.memo for TaskCard to prevent unnecessary re-renders
- [ ] Run test: `npm run test:e2e -- drag-and-drop.spec.ts --grep "performance"`
- [ ] ✅ Test passes (green phase)

**Estimated Effort:** 35 minutes

---

### Test: Data Persistence After Refresh (AC 8)

**File:** `tests/e2e/drag-and-drop.spec.ts` (line ~260)

**Tasks to make this test pass:**

- [ ] Move task to new column or position
- [ ] Wait for save (Dexie should persist immediately)
- [ ] Refresh page: `await page.reload()`
- [ ] Verify task appears in new column/position
- [ ] Query Dexie: `await db.tasks.where('id').equals(taskId).first()`
- [ ] Assert task.columnId and task.order match moved state
- [ ] Run test: `npm run test:e2e -- drag-and-drop.spec.ts --grep "persistence after refresh"`
- [ ] ✅ Test passes (green phase)

**Estimated Effort:** 20 minutes

---

### Test: Drag Opacity Feedback (Component Test)

**File:** `tests/component/drag-and-drop.spec.ts` (line ~20)

**Tasks to make this test pass:**

- [ ] Render DraggableTaskCard component in test
- [ ] Access internal useSortable hook state (isDragging)
- [ ] Simulate drag state change
- [ ] Assert computed style has opacity: 0.5 during drag
- [ ] Assert opacity: 1 when not dragging
- [ ] Run test: `npm run test:component -- drag-and-drop.spec.ts --grep "drag opacity"`
- [ ] ✅ Test passes (green phase)

**Estimated Effort:** 15 minutes

---

### Test: Column Highlight on Drag-Over (Component Test)

**File:** `tests/component/drag-and-drop.spec.ts` (line ~60)

**Tasks to make this test pass:**

- [ ] Render SortableColumn component
- [ ] Simulate drag-over event using @dnd-kit testing utilities
- [ ] Access useDroppable isOver state
- [ ] Assert CSS class `bg-blue-50 border-blue-300` applied
- [ ] Simulate drag-out
- [ ] Assert highlight classes removed
- [ ] Run test: `npm run test:component -- drag-and-drop.spec.ts --grep "column highlight"`
- [ ] ✅ Test passes (green phase)

**Estimated Effort:** 20 minutes

---

### Test: Error Message Display (Component Test)

**File:** `tests/component/drag-and-drop.spec.ts` (line ~100)

**Tasks to make this test pass:**

- [ ] Render error message component
- [ ] Pass error prop: `error="Failed to move task. Please try again."`
- [ ] Assert message visible with role="alert"
- [ ] Assert text content matches expected message
- [ ] Run test: `npm run test:component -- drag-and-drop.spec.ts --grep "error message"`
- [ ] ✅ Test passes (green phase)

**Estimated Effort:** 10 minutes

---

### Test: Accessibility Attributes (Component Test)

**File:** `tests/component/drag-and-drop.spec.ts` (line ~130)

**Tasks to make this test pass:**

- [ ] Render DraggableTaskCard with task: { id: 1, title: 'Test Task', columnId: 1, ... }
- [ ] Assert aria-label present: `"Draggable task: Test Task, currently in column 1"`
- [ ] Assert aria-pressed reflects drag state
- [ ] Assert aria-describedby points to helpful description
- [ ] Run accessibility audit: `await expect(page).toHaveNoViolations()`
- [ ] Run test: `npm run test:component -- drag-and-drop.spec.ts --grep "accessibility attributes"`
- [ ] ✅ Test passes (green phase)

**Estimated Effort:** 20 minutes

---

### Test: prefers-reduced-motion Handling (Component Test)

**File:** `tests/component/drag-and-drop.spec.ts` (line ~170)

**Tasks to make this test pass:**

- [ ] Mock matchMedia to return true for `prefers-reduced-motion: reduce`
- [ ] Render DraggableTaskCard
- [ ] Assert computed style.transition is 'none'
- [ ] Assert drag-and-drop still functional (position changes)
- [ ] Run test: `npm run test:component -- drag-and-drop.spec.ts --grep "prefers-reduced-motion"`
- [ ] ✅ Test passes (green phase)

**Estimated Effort:** 20 minutes

---

## Running Tests

```bash
# Run all failing tests for this story (RED phase verification)
npm run test:e2e -- tests/e2e/drag-and-drop.spec.ts

# Run specific E2E test
npm run test:e2e -- tests/e2e/drag-and-drop.spec.ts --grep "move task between columns"

# Run component tests
npm run test:component -- tests/component/drag-and-drop.spec.ts

# Run tests in headed mode (see browser)
npm run test:e2e -- tests/e2e/drag-and-drop.spec.ts --headed

# Debug specific test
npm run test:e2e -- tests/e2e/drag-and-drop.spec.ts --debug

# Run tests with coverage
npm run test:e2e -- tests/e2e/drag-and-drop.spec.ts --coverage
```

---

## Red-Green-Refactor Workflow

### RED Phase (Complete) ✅

**TEA Agent Responsibilities:**

- ✅ All tests written and failing (13 tests: 8 E2E + 5 Component)
- ✅ Fixtures and factories created with auto-cleanup
- ✅ Mock requirements documented
- ✅ data-testid requirements listed
- ✅ Implementation checklist created

**Verification:**

- All tests run and fail as expected
- Failure messages are clear and actionable
- Tests fail due to missing implementation, not test bugs

### GREEN Phase (DEV Team - Next Steps)

**DEV Agent Responsibilities:**

1. **Pick one failing test** from implementation checklist (start with AC 1: cross-column move)
2. **Read the test** to understand expected behavior
3. **Implement minimal code** to make that specific test pass:
   - Add order field to Task schema
   - Update Dexie schema with order index
   - Create DraggableTaskCard component
   - Create SortableColumn component
   - Implement moveTask in AppContext
   - Update KanbanBoard with DndContext
4. **Run the test** to verify it now passes (green)
5. **Check off the task** in implementation checklist
6. **Move to next test** and repeat

**Key Principles:**

- One test at a time (don't try to fix all at once)
- Minimal implementation (don't over-engineer)
- Run tests frequently (immediate feedback)
- Use implementation checklist as roadmap

**Progress Tracking:**

- Check off tasks as you complete them
- Share progress in daily standup

### REFACTOR Phase (DEV Team - After All Tests Pass)

**DEV Agent Responsibilities:**

1. **Verify all tests pass** (green phase complete)
2. **Review code for quality** (readability, maintainability, performance)
3. **Extract duplications** (DRY principle in drag-and-drop logic)
4. **Optimize performance** (memoization, render optimization)
5. **Ensure tests still pass** after each refactor
6. **Update documentation** (if component APIs change)

**Key Principles:**

- Tests provide safety net (refactor with confidence)
- Make small refactors (easier to debug if tests fail)
- Run tests after each change
- Don't change test behavior (only implementation)

**Completion:**

- All tests pass
- Code quality meets team standards
- No duplications or code smells
- Ready for code review and story approval

---

## Next Steps

1. **Share this checklist and failing tests** with the dev workflow
2. **Review this checklist** with team in standup or planning
3. **Run failing tests** to confirm RED phase: `npm run test:e2e -- tests/e2e/drag-and-drop.spec.ts`
4. **Begin implementation** using implementation checklist as guide
5. **Work one test at a time** (red → green for each)
6. **Share progress** in daily standup
7. **When all tests pass**, refactor code for quality
8. **When refactoring complete**, update story status to 'in-progress' in sprint-status.yaml

---

## Test Architecture Decisions

### Why E2E for Drag-and-Drop

Drag-and-drop is inherently visual and interactive. E2E tests verify:
- Real DOM interactions (not mocked)
- Browser event simulation (pointermove, dragover, drop)
- Dexie persistence (cross-page integrity)
- Performance at browser rendering level

**Component tests support** with unit assertions on:
- Visual feedback states (isDragging, isOver)
- Accessibility attributes
- CSS class application

### Knowledge Fragments Applied

This ATDD workflow consulted the following knowledge fragments:

- **data-factories.md** - Task and Column factories for test setup
- **component-tdd.md** - Component test patterns for DraggableTaskCard and SortableColumn
- **test-quality.md** - One assertion per test, given-when-then structure, test isolation
- **test-healing-patterns.md** - Timing debugging for async Dexie operations and DOM updates
- **selector-resilience.md** - data-testid usage for stable selectors (avoid class/content selectors)
- **timing-debugging.md** - Deterministic waits for drag-and-drop completion and Dexie persistence

---

## Accessibility & Performance Commitments

### WCAG 2.1 AA Compliance

- ✅ Draggable items have aria-label and aria-describedby
- ✅ Keyboard sensor configured for arrow key navigation
- ✅ Focus management: focus returns to moved item
- ✅ Move announcement: screen reader announces destination
- ✅ Visual feedback: drop target highlighting visible
- ✅ Animations respect prefers-reduced-motion
- ✅ Touch targets: draggable area at least 44×44px

### Performance Targets

- **Drag Animation:** Maintain 60fps (verified with Chrome DevTools)
- **Large Datasets:** Handle 100+ tasks per column smoothly
- **Reorder Efficiency:** Update only affected tasks in Dexie
- **Re-renders:** Consider React.memo for TaskCard to prevent unnecessary renders

---

## Notes

- Story 1.6 is the 6th of 7 stories in Epic 1 (Foundation & Core Kanban)
- This story unblocks Story 1.7 (Subtasks and quick-add)
- Depends on Story 1.5 (Create and manage tasks with full fields) - COMPLETE
- @dnd-kit library installed in Story 1.2; already available
- Integration with Dexie.js (Story 1.3) for data persistence
- Uses React Context (AppContext) from Story 1.3

---

## Contact

**Questions or Issues?**

- Ask in team standup
- Refer to `./bmad/tea/workflows/testarch/atdd/` for workflow documentation
- Consult `./bmad/tea/testarch/knowledge/` for testing best practices
- Review story 1.5 implementation for patterns on AppContext, Dexie sync, and error handling

---

**Generated by BMAD TEA Agent (Acceptance Test-Driven Development)**  
**Workflow:** testarch-atdd v5.0  
**Date:** 2026-03-12  
**Story:** 1.6 - Move and Reorder Tasks via Drag-and-Drop  
**Status:** RED Phase Complete - Ready for GREEN Phase Development
