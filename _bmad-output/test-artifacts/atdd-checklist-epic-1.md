---
stepsCompleted: ['step-01-preflight-and-context', 'step-02-generation-mode', 'step-03-test-strategy', 'step-04-generate-tests', 'step-04c-aggregate', 'step-05-validate-and-complete']
lastStep: 'step-05-validate-and-complete'
lastSaved: '2026-03-11'
workflowType: 'testarch-atdd'
inputDocuments:
  - _bmad/tea/config.yaml
  - playwright.config.ts
  - _bmad-output/implementation-artifacts/sprint-status.yaml
  - _bmad-output/implementation-artifacts/1-3-set-up-local-data-storage-and-base-layout.md
  - _bmad-output/implementation-artifacts/1-4-create-kanban-board-with-customizable-columns.md
  - _bmad-output/implementation-artifacts/1-5-create-and-manage-tasks-with-full-fields.md
  - _bmad-output/implementation-artifacts/1-6-move-and-reorder-tasks-via-drag-and-drop.md
  - _bmad-output/implementation-artifacts/1-7-add-subtasks-and-quick-add-for-tasks.md
  - tests/support/factories/task-factory.ts
  - tests/support/fixtures/merged-fixtures.ts
  - tests/support/helpers/local-storage.ts
  - tests/support/page-objects/board-page.ts
  - tests/support/page-objects/task-form-page.ts
  - _bmad/tea/testarch/knowledge/data-factories.md
  - _bmad/tea/testarch/knowledge/test-quality.md
  - _bmad/tea/testarch/knowledge/selector-resilience.md
---

# ATDD Checklist — Epic 1: Foundation & Core Kanban (Stories 1.3–1.7)

**Date:** 2026-03-11
**Author:** Marlon
**Workflow:** testarch-atdd
**Primary Test Level:** E2E (Playwright)
**TDD Phase:** RED — All tests use `test.skip()` until implementation is complete

---

## Story Summary

Epic 1 builds the full foundation for the freelancer tracking app:
- **1.3** — Local data storage (Dexie.js/IndexedDB) + base layout with navigation
- **1.4** — Kanban board with customizable columns (add, rename, delete, reorder)
- **1.5** — Task CRUD with full fields (title, description, priority, due date, tags)
- **1.6** — Drag-and-drop to move and reorder tasks between/within columns
- **1.7** — Subtasks under tasks + quick-add for fast task creation

---

## Failing Tests Created (RED Phase)

### Story 1.3 — Navigation & Layout (E2E)

**File:** `tests/e2e/navigation.spec.ts` (145 lines)

| Test | Priority | Verifies |
|------|----------|---------|
| `[P1] should display navigation tabs for Board, Revenue, and Settings` | P1 | AC3: Navigation tabs visible |
| `[P1] should navigate to Board page` | P1 | AC2: Board route works |
| `[P1] should navigate to Revenue page` | P1 | AC2: Revenue route works |
| `[P1] should navigate to Settings page` | P1 | AC2: Settings route works |
| `[P1] should highlight the active navigation tab` | P1 | AC3: Active tab highlighted |
| `[P1] should support keyboard navigation between tabs` | P1 | AC3: Keyboard accessible |
| `[P0] should persist tasks after page reload` | P0 | AC4: Data persistence |
| `[P0] should not make external network requests` | P0 | AC5: No external data transmission |
| `[P1] should persist data across navigation` | P1 | AC4: Cross-navigation persistence |

**Status:** ✅ RED — All 9 tests use `test.skip()` | **Coverage:** AC2, AC3, AC4, AC5

---

### Story 1.4 — Kanban Board (E2E)

**File:** `tests/e2e/kanban-board.spec.ts` (147 lines)

| Test | Priority | Verifies |
|------|----------|---------|
| `[P0] should render board with default columns` | P0 | AC1: Default columns visible |
| `[P0] should display task cards in correct columns` | P0 | AC1: Tasks in correct columns |
| `[P0] should show empty state when column has no tasks` | P0 | AC1: Empty column CTA |
| `[P1] should add a new custom column` | P1 | AC2: Add column |
| `[P1] should rename an existing column` | P1 | AC5: Edit column name |
| `[P1] should delete a custom column` | P1 | AC3: Remove column |
| `[P1] should display task count badge on each column` | P1 | AC1: Column task count |
| `[P2] should persist custom columns after page reload` | P2 | AC2: Column persistence |

**Status:** ✅ RED — All 7 tests use `test.skip()` | **Coverage:** AC1, AC2, AC3, AC5

**Gaps noted (not yet covered):**
- AC4: Column drag-and-drop reorder (covered in 1.6 drag-and-drop tests)
- AC6: Keyboard accessibility for column operations

---

### Story 1.5 — Task CRUD (E2E)

**File:** `tests/e2e/task-crud.spec.ts` (219 lines)

| Test | Priority | Verifies |
|------|----------|---------|
| `[P0] should create a new task with required fields` | P0 | AC1: Task creation |
| `[P0] should create a task with all fields populated` | P0 | AC1: Full field creation |
| `[P1] should not create a task without a title` | P1 | AC5: Title required validation |
| `[P1] should create task with urgent priority` | P1 | AC1: Priority selection |
| `[P0] should display task cards with title and priority` | P0 | AC2: Card display |
| `[P1] should display overdue tasks with visual indicator` | P1 | AC2: Overdue indicator |
| `[P1] should display task tags on card` | P1 | AC2: Tags on card |
| `[P0] should edit a task title` | P0 | AC3: Edit task |
| `[P1] should change task priority` | P1 | AC3: Edit priority |
| `[P0] should delete a task` | P0 | AC6: Task deletion |
| `[P1] should confirm before deleting a task` | P1 | AC6: Deletion confirmation |

**Status:** ✅ RED — All 11 tests use `test.skip()` | **Coverage:** AC1, AC2, AC3, AC5, AC6

**Gaps noted (not yet covered):**
- AC4: Auto-save and persistence after page refresh
- AC7: Empty state and "Add task" CTA behavior

---

### Story 1.6 — Drag-and-Drop (E2E) ← **NEW**

**File:** `tests/e2e/drag-and-drop.spec.ts` (new, ~250 lines)

| Test | Priority | Verifies |
|------|----------|---------|
| `[P0] should move a task from one column to another` | P0 | AC1: Cross-column drag |
| `[P0] should persist task column change after page reload` | P0 | AC1: Persistence after move |
| `[P0] should show visual drop indicator during drag` | P0 | AC3: Visual feedback |
| `[P1] should move task from In Progress to Done` | P1 | AC1: Multi-column move |
| `[P1] should move task back from Done to Backlog` | P1 | AC1: Reverse move |
| `[P0] should reorder tasks within the same column` | P0 | AC2: Within-column reorder |
| `[P0] should persist reordered task positions after reload` | P0 | AC2: Reorder persistence |
| `[P1] should show drop indicator during reorder` | P1 | AC3: Drop indicator |
| `[P1] should support keyboard-based task movement` | P1 | AC4: Keyboard DnD |
| `[P1] should announce drag-and-drop actions to screen readers` | P1 | AC4: Accessibility |
| `[P2] should cancel drag with Escape key` | P2 | AC4: Keyboard cancel |
| `[P1] should show error message if Dexie save fails` | P1 | AC6: Error recovery |
| `[P2] should handle 20+ tasks without performance degradation` | P2 | AC7: Performance |
| `[P2] should respect prefers-reduced-motion` | P2 | AC3: Reduced motion |
| `[P0] should preserve all task fields after move` | P0 | AC8: Data integrity |

**Status:** ✅ RED — All 15 tests use `test.skip()` | **Coverage:** AC1, AC2, AC3, AC4, AC6, AC7, AC8

---

### Story 1.7 — Subtasks & Quick-Add (E2E) ← **NEW**

**File:** `tests/e2e/subtasks-and-quick-add.spec.ts` (new, ~300 lines)

| Test | Priority | Verifies |
|------|----------|---------|
| `[P0] should display subtasks section in task detail panel` | P0 | AC1: Subtasks section visible |
| `[P0] should create a subtask for a task` | P0 | AC1: Create subtask |
| `[P0] should persist subtasks to storage after creation` | P0 | AC1: Subtask persistence |
| `[P1] should not create a subtask without a title` | P1 | AC1: Subtask validation |
| `[P1] should not create a subtask with title over 255 chars` | P1 | AC1: Length validation |
| `[P1] should create multiple subtasks in sequence` | P1 | AC1: Multiple subtasks |
| `[P0] should mark a subtask as complete` | P0 | AC1: Toggle completion |
| `[P0] should update subtask summary on task card` | P0 | AC2: Card summary display |
| `[P1] should persist subtask completion state after reload` | P1 | AC1: Completion persistence |
| `[P1] should toggle subtask back to incomplete` | P1 | AC9: Toggle incomplete |
| `[P1] should delete a subtask with confirmation` | P1 | AC8: Delete subtask |
| `[P1] should cancel subtask deletion` | P1 | AC8: Cancel delete |
| `[P2] should preserve remaining subtask order after deletion` | P2 | AC7: Order after delete |
| `[P0] should create a task via quick-add with title only` | P0 | AC3: Quick-add create |
| `[P0] should not create a quick-add task without a title` | P0 | AC3: Quick-add validation |
| `[P1] should cancel quick-add with Escape key` | P1 | AC3: Quick-add cancel |
| `[P1] should create multiple tasks in sequence via quick-add` | P1 | AC3: Sequential quick-add |
| `[P1] should activate quick-add via Cmd+Shift+N (Mac)` | P1 | AC5: Keyboard shortcut |
| `[P1] should activate quick-add via Ctrl+Shift+N (Windows/Linux)` | P1 | AC5: Cross-platform shortcut |
| `[P2] should return focus to board after quick-add creation` | P2 | AC5: Focus management |
| `[P1] should quick-add task to a specific column` | P1 | AC6: Column selection |
| `[P2] should indicate which column is selected in quick-add` | P2 | AC6: Column indicator |
| `[P1] should expand quick-add task to full edit form` | P1 | AC4: Expand to full form |
| `[P2] should pre-fill defaults in expanded form from quick-add` | P2 | AC4: Default pre-fill |
| `[P2] should preserve subtask order after page reload` | P2 | AC7: Order persistence |

**Status:** ✅ RED — All 25 tests use `test.skip()` | **Coverage:** AC1, AC2, AC3, AC4, AC5, AC6, AC7, AC8, AC9

---

## Summary: All Tests

| Story | File | Tests | P0 | P1 | P2 | Status |
|-------|------|-------|----|----|-----|--------|
| 1.3 Navigation & Layout | `navigation.spec.ts` | 9 | 2 | 7 | 0 | RED ✅ |
| 1.4 Kanban Board | `kanban-board.spec.ts` | 7 | 3 | 3 | 1 | RED ✅ |
| 1.5 Task CRUD | `task-crud.spec.ts` | 11 | 4 | 7 | 0 | RED ✅ |
| 1.6 Drag-and-Drop | `drag-and-drop.spec.ts` | 15 | 5 | 6 | 4 | RED ✅ |
| 1.7 Subtasks & Quick-Add | `subtasks-and-quick-add.spec.ts` | 25 | 6 | 13 | 6 | RED ✅ |
| **TOTAL** | **5 files** | **67** | **20** | **36** | **11** | **RED ✅** |

---

## Data Factories

### Task Factory

**File:** `tests/support/factories/task-factory.ts`

**Exports:**
- `createTask(overrides?)` — Create a task with sensible defaults (status: 'todo', priority: 'medium')
- `createInProgressTask(overrides?)` — Task with status: 'in-progress'
- `createCompletedTask(overrides?)` — Task with status: 'done'
- `createUrgentTask(overrides?)` — Task with priority: 'urgent'
- `createOverdueTask(overrides?)` — Task with past due date, status: 'todo'

**Used by:** All 5 story test files

---

## Fixtures

### Merged Fixtures

**File:** `tests/support/fixtures/merged-fixtures.ts`

- `test` — Merged Playwright test with `network-error-monitor` + custom fixtures
- `task` — Auto-created task object (no storage seeding)
- `urgentTask` — Auto-created urgent task
- `freelancer` — Auto-created freelancer

### LocalStorage Helpers

**File:** `tests/support/helpers/local-storage.ts`

- `seedTasks(page, tasks)` — Seeds tasks into localStorage before page load (via `addInitScript`)
- `seedFreelancers(page, freelancers)` — Seeds freelancers
- `clearAppData(page)` — Clears all localStorage
- `getTasksFromStorage(page)` — Reads tasks from localStorage for assertions

---

## Required `data-testid` Attributes

### Story 1.3 — Navigation Layout

| Component | `data-testid` | Description |
|-----------|--------------|-------------|
| Nav tab | _(use ARIA `role="tab"`)_ | Navigation tabs — use ARIA roles |
| Board page | _(use ARIA `role="heading"`)_ | Page heading |

### Story 1.4 — Kanban Board

| Component | `data-testid` | Description |
|-----------|--------------|-------------|
| Board container | `kanban-board` | Root board element |
| Column | `column-{name}` | e.g., `column-backlog`, `column-in-progress` |
| Task card | `task-card` | Each task card (filter by text for specific card) |

### Story 1.5 — Task CRUD

| Component | `data-testid` | Description |
|-----------|--------------|-------------|
| Overdue indicator | `overdue-indicator` | Red indicator on overdue task cards |
| Task form | _(use ARIA roles)_ | Form fields use `getByRole`/`getByLabel` |

### Story 1.6 — Drag-and-Drop

| Component | `data-testid` | Description |
|-----------|--------------|-------------|
| Drop indicator | `drop-indicator` | Visual line/highlight showing drop position |

### Story 1.7 — Subtasks & Quick-Add

| Component | `data-testid` | Description |
|-----------|--------------|-------------|
| Task detail panel | `task-detail-panel` | Slide-over or modal for task details |
| Subtask item | `subtask-item` | Each subtask row in the detail panel |
| Subtask checkbox | `subtask-checkbox` | Completion checkbox on each subtask |
| Subtask summary | `subtask-summary` | "X/Y subtasks done" on task card |
| Quick-add button | `quick-add-button` | Button to open quick-add input |
| Quick-add input | `quick-add-input` | Text input for quick task creation |

---

## Implementation Checklist

### Story 1.3 — Navigation & Layout

- [ ] Install `dexie` and configure `src/db/schema.ts`
- [ ] Install `react-router-dom` and configure routes (`/board`, `/revenue`, `/settings`)
- [ ] Create `src/components/Layout.tsx` with tab navigation
- [ ] Add `role="tab"` and `aria-selected` to navigation tabs
- [ ] Implement auto-save via `useEffect` + Dexie sync
- [ ] Verify no external network requests in Network tab
- [ ] Run: `npx playwright test tests/e2e/navigation.spec.ts`
- [ ] Remove `test.skip()` from passing tests ✅

### Story 1.4 — Kanban Board

- [ ] Create `src/pages/Board.tsx` with Kanban layout
- [ ] Query columns from `db.columns` sorted by order
- [ ] Add `data-testid="kanban-board"` to board container
- [ ] Add `data-testid="column-{name}"` to each column
- [ ] Add `data-testid="task-card"` to each task card
- [ ] Implement Add Column dialog with name input
- [ ] Implement inline column rename (click header to edit)
- [ ] Implement Delete Column with confirmation dialog
- [ ] Show task count badge on each column header
- [ ] Run: `npx playwright test tests/e2e/kanban-board.spec.ts`
- [ ] Remove `test.skip()` from passing tests ✅

### Story 1.5 — Task CRUD

- [ ] Create task creation form (modal or slide-over)
- [ ] Add title, description, priority, due date, tags, estimatedHours fields
- [ ] Add `data-testid="overdue-indicator"` to overdue date display
- [ ] Implement Zod validation (title required, max 255 chars, valid date)
- [ ] Implement task edit form with pre-filled values
- [ ] Implement task deletion with confirmation dialog
- [ ] Persist all changes to Dexie `tasks` store
- [ ] Run: `npx playwright test tests/e2e/task-crud.spec.ts`
- [ ] Remove `test.skip()` from passing tests ✅

### Story 1.6 — Drag-and-Drop

- [ ] Install `@dnd-kit/core`, `@dnd-kit/sortable`, `@dnd-kit/utilities`
- [ ] Wrap board in `DndContext` with mouse + keyboard sensors
- [ ] Implement `SortableContext` per column for within-column reorder
- [ ] Add `data-testid="drop-indicator"` to drop position indicator
- [ ] Highlight target column during drag (add CSS class)
- [ ] Persist new column/order to Dexie on `onDragEnd`
- [ ] Implement error recovery: revert on Dexie save failure + show error toast
- [ ] Add `aria-live` region for screen reader announcements
- [ ] Respect `prefers-reduced-motion` (disable animations)
- [ ] Run: `npx playwright test tests/e2e/drag-and-drop.spec.ts`
- [ ] Remove `test.skip()` from passing tests ✅

### Story 1.7 — Subtasks & Quick-Add

- [ ] Create task detail panel (`data-testid="task-detail-panel"`)
- [ ] Add Subtasks section with "Add subtask" button
- [ ] Add `data-testid="subtask-item"` to each subtask row
- [ ] Add `data-testid="subtask-checkbox"` to each subtask checkbox
- [ ] Add `data-testid="subtask-summary"` to task card (e.g., "2/3 subtasks done")
- [ ] Persist subtasks to Dexie with `parentTaskId` and `order` fields
- [ ] Add subtask deletion with confirmation dialog
- [ ] Add `data-testid="quick-add-button"` to each column
- [ ] Add `data-testid="quick-add-input"` to quick-add text field
- [ ] Implement `Cmd+Shift+N` / `Ctrl+Shift+N` keyboard shortcut
- [ ] Quick-add creates task in correct column with Medium priority default
- [ ] Implement "Expand to full form" from quick-add task card
- [ ] Run: `npx playwright test tests/e2e/subtasks-and-quick-add.spec.ts`
- [ ] Remove `test.skip()` from passing tests ✅

---

## Running Tests

```bash
# Run all ATDD failing tests (RED phase — all will be skipped)
npx playwright test tests/e2e/

# Run tests for a specific story
npx playwright test tests/e2e/navigation.spec.ts
npx playwright test tests/e2e/kanban-board.spec.ts
npx playwright test tests/e2e/task-crud.spec.ts
npx playwright test tests/e2e/drag-and-drop.spec.ts
npx playwright test tests/e2e/subtasks-and-quick-add.spec.ts

# Run tests in headed mode (see browser)
npx playwright test tests/e2e/ --headed

# Debug a specific test
npx playwright test tests/e2e/drag-and-drop.spec.ts --debug

# Run only P0 tests
npx playwright test tests/e2e/ --grep "\[P0\]"

# Run with UI mode (interactive)
npx playwright test --ui
```

---

## Red-Green-Refactor Workflow

### RED Phase (Complete) ✅

**TEA Agent Responsibilities:**

- ✅ All 67 tests written and using `test.skip()` (TDD red phase)
- ✅ Tests assert EXPECTED behavior from acceptance criteria
- ✅ Factories and fixtures created with auto-cleanup
- ✅ `data-testid` requirements documented
- ✅ Implementation checklist created per story

**Verification:**

- All tests run and are reported as "skipped" (not failed, not passed)
- Tests are written for expected UI behavior, not placeholder assertions
- Tests fail due to missing implementation when `test.skip()` is removed

---

### GREEN Phase (DEV Team — Next Steps)

**DEV Agent Responsibilities:**

1. **Pick one story** from the implementation checklist (start with 1.3 — it's the foundation)
2. **Implement the story** following the checklist tasks
3. **Remove `test.skip()`** from tests for that story
4. **Run the tests** to verify they pass: `npx playwright test tests/e2e/navigation.spec.ts`
5. **Fix any failures** (either implementation bug or test needs adjustment)
6. **Move to next story** in sequence (1.3 → 1.4 → 1.5 → 1.6 → 1.7)

**Key Principles:**

- Stories must be implemented in sequence (each builds on the previous)
- Story 1.3 (Dexie + routing) is required before any other story
- One story at a time — don't start 1.4 until 1.3 tests pass

**Progress Tracking:**

- Check off implementation tasks as you complete them
- Remove `test.skip()` from tests as features are verified

---

### REFACTOR Phase (DEV Team — After All Tests Pass)

1. **Verify all 67 tests pass** (green phase complete)
2. **Review code quality** — DRY, readable, performant
3. **Ensure tests still pass** after each refactor
4. **Update sprint-status.yaml** — mark stories as 'done'

---

## Next Steps

1. **Start with Story 1.3** — foundation for all other stories
2. **Run tests in watch mode** during development: `npx playwright test --ui`
3. **Check `data-testid` requirements** before implementing each story
4. **Remove `test.skip()`** story by story as implementation completes
5. **When all tests pass**, update `sprint-status.yaml` to mark epic-1 as 'done'

---

## Notes

- **localStorage vs Dexie**: Existing test helpers (`seedTasks`, `getTasksFromStorage`) use `localStorage`. Story 1.3 introduces Dexie/IndexedDB. The helpers may need updating once Dexie is implemented — the app may use Dexie internally while the test helpers continue to use localStorage for seeding (if the app reads from localStorage on init), or new Dexie-specific helpers may be needed.
- **Drag-and-drop tests**: Mouse-based drag tests use raw `page.mouse` events. These may need adjustment based on the actual `@dnd-kit` implementation. The keyboard-based tests are more reliable and should be prioritized.
- **Subtask storage**: The `Task` type in `task-factory.ts` does not yet include a `subtasks` field. This will need to be added when Story 1.7 is implemented.

---

**Generated by BMad TEA Agent** — 2026-03-11
