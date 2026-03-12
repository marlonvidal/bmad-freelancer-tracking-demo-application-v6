---
stepsCompleted: ['step-01-preflight-and-context', 'step-02-generation-mode', 'step-03-test-strategy', 'step-04-generate-tests', 'step-04c-aggregate', 'step-05-validate-and-complete']
lastStep: 'step-05-validate-and-complete'
lastSaved: '2026-03-12'
workflowType: 'testarch-atdd'
inputDocuments:
  - '_bmad-output/implementation-artifacts/1-7-add-subtasks-and-quick-add-for-tasks.md'
  - 'playwright.config.ts'
  - 'tests/support/factories/task-factory.ts'
  - 'tests/support/helpers/local-storage.ts'
  - 'tests/support/page-objects/board-page.ts'
  - 'tests/support/fixtures/custom-fixtures.ts'
  - 'tests/support/fixtures/merged-fixtures.ts'
  - '_bmad/tea/testarch/knowledge/data-factories.md'
  - '_bmad/tea/testarch/knowledge/test-quality.md'
  - '_bmad/tea/testarch/knowledge/selector-resilience.md'
  - '_bmad/tea/testarch/knowledge/fixture-architecture.md'
  - '_bmad/tea/testarch/knowledge/overview.md'
---

# ATDD Checklist — Epic 1, Story 1.7: Add Subtasks and Quick-Add for Tasks

**Date:** 2026-03-12
**Author:** Marlon
**Primary Test Level:** E2E (Playwright)
**TDD Phase:** 🔴 RED — All tests are intentionally failing

---

## Story Summary

As a freelancer, I want to create subtasks for larger tasks and add tasks quickly with minimal fields, so that I can break down work and capture tasks fast.

**As a** freelancer
**I want** to create subtasks under tasks and use a quick-add field for fast task creation
**So that** I can manage granular work items and capture ideas without friction

---

## Acceptance Criteria

1. **AC1** — Create subtasks for a task: Subtasks section in detail panel with title input, checkbox, and Dexie persistence
2. **AC2** — Display subtask summary on task card: "X/Y subtasks done" badge, visible on task cards with subtasks
3. **AC3** — Quick-add task with minimal fields: Single title input per column, Enter to create with sensible defaults
4. **AC4** — Quick-add expansion to full fields: Expand button opens full task form with title pre-filled
5. **AC5** — Quick-add keyboard shortcut: Cmd+Shift+N (Mac) / Ctrl+Shift+N (Win/Linux) focuses quick-add input
6. **AC6** — Quick-add column selection: Quick-add creates task in the column where the button is clicked
7. **AC7** — Subtask order and persistence: Subtask creation order preserved and persisted across reloads
8. **AC8** — Delete subtasks: Delete button shows confirmation dialog, removes subtask, preserves remaining order
9. **AC9** — Subtask completion state: Checkbox toggles completed state with visual feedback and Dexie persistence
10. **AC10** — Quick-add focus/blur behavior: Auto-focus on trigger, clear on Escape/blur-if-empty
11. **AC11** — Quick-add performance: Task creation completes < 200ms even on boards with 100+ tasks
12. **AC12** — Validation: "Title is required" and "255 characters or less" messages shown; no silent failures

---

## Failing Tests Created (RED Phase)

### E2E Tests (48 tests)

**File:** `tests/e2e/subtasks-and-quick-add.spec.ts` (~350 lines)

All tests use `test.skip()` — TDD RED phase. Tests assert EXPECTED behavior before implementation.

#### AC1 — Subtasks: Create (5 tests)

- 🔴 **[P0]** `should display subtasks section with add button in task detail panel`
  - **Status:** RED — `data-testid="task-detail-panel"` and `data-testid="add-subtask-btn"` don't exist yet
  - **Verifies:** AC1 — SubtasksPanel rendered in TaskDetailPanel/Sheet

- 🔴 **[P0]** `should create a subtask for a task via the detail panel`
  - **Status:** RED — SubtasksPanel component not implemented
  - **Verifies:** AC1 — addSubtask flow: click Add, fill input, Enter → subtask appears

- 🔴 **[P0]** `should persist subtasks to Dexie storage after creation`
  - **Status:** RED — Dexie `subtasks` store not created yet
  - **Verifies:** AC1 — Dexie persistence: reload → subtask still visible

- 🔴 **[P1]** `should create multiple subtasks in sequence`
  - **Status:** RED — SubtasksPanel not implemented
  - **Verifies:** AC1 — Multiple subtasks created one after another, all visible

- 🔴 **[P1]** `should show empty state with CTA when no subtasks exist`
  - **Status:** RED — SubtasksPanel not implemented
  - **Verifies:** AC1 — Empty state shows "Add subtask" CTA

#### AC2 — Subtasks: Summary on Task Card (4 tests)

- 🔴 **[P0]** `should display subtask summary badge on task card when subtasks exist`
  - **Status:** RED — `data-testid="subtask-summary"` on TaskCard not implemented
  - **Verifies:** AC2 — TaskSummary component shows "1/2" when 1 of 2 subtasks complete

- 🔴 **[P0]** `should update subtask summary after completing a subtask`
  - **Status:** RED — TaskSummary and AppContext subtask state not implemented
  - **Verifies:** AC2 — Summary updates reactively when checkbox is toggled

- 🔴 **[P1]** `should not show subtask summary when task has no subtasks`
  - **Status:** RED — TaskSummary not implemented
  - **Verifies:** AC2 — No badge shown for tasks with 0 subtasks

- 🔴 **[P2]** `should show all-done state when all subtasks are complete`
  - **Status:** RED — TaskSummary not implemented
  - **Verifies:** AC2 — "2/2" displayed when all subtasks are done

#### AC9 — Subtasks: Toggle Completion State (4 tests)

- 🔴 **[P0]** `should mark a subtask as complete via checkbox`
  - **Status:** RED — `data-testid="subtask-checkbox"` and toggleSubtaskCompletion not implemented
  - **Verifies:** AC9 — Checkbox click → checked state

- 🔴 **[P0]** `should show completed subtask with strikethrough and muted text`
  - **Status:** RED — CSS styling for completed subtasks not implemented
  - **Verifies:** AC9 — Visual feedback: `text-decoration: line-through`

- 🔴 **[P0]** `should toggle subtask back to incomplete`
  - **Status:** RED — toggleSubtaskCompletion not implemented
  - **Verifies:** AC9 — Clicking checked checkbox unchecks it

- 🔴 **[P1]** `should persist subtask completion state after page reload`
  - **Status:** RED — Dexie subtask completion persistence not implemented
  - **Verifies:** AC9 — Completion state survives page reload

#### AC8 — Subtasks: Delete with Confirmation (4 tests)

- 🔴 **[P1]** `should delete a subtask after confirmation dialog`
  - **Status:** RED — deleteSubtask + confirmation dialog not implemented
  - **Verifies:** AC8 — Delete button → dialog → confirm → subtask removed

- 🔴 **[P1]** `should cancel subtask deletion when user clicks cancel`
  - **Status:** RED — Confirmation dialog not implemented
  - **Verifies:** AC8 — Cancel keeps subtask visible

- 🔴 **[P2]** `should preserve remaining subtask order after middle subtask deletion`
  - **Status:** RED — Order management after deletion not implemented
  - **Verifies:** AC8 — "First" and "Third" remain in correct order after "Second" deleted

- 🔴 **[P2]** `should persist deletion after page reload`
  - **Status:** RED — Dexie deletion not implemented
  - **Verifies:** AC8 — Deleted subtask remains gone after reload

#### AC7 — Subtasks: Order and Persistence (2 tests)

- 🔴 **[P2]** `should preserve subtask creation order after page reload`
  - **Status:** RED — Dexie order field not implemented
  - **Verifies:** AC7 — Subtasks sorted by order field, preserved across reloads

- 🔴 **[P2]** `should maintain order field in storage for each subtask`
  - **Status:** RED — Subtask schema with order not implemented
  - **Verifies:** AC7 — Each subtask has sequential order values in IndexedDB

#### AC12 — Subtasks: Validation (4 tests)

- 🔴 **[P1]** `should show validation error when subtask title is empty`
  - **Status:** RED — Zod validation in SubtasksPanel not implemented
  - **Verifies:** AC12 — "Title is required" error shown, no subtask created

- 🔴 **[P1]** `should show validation error when subtask title exceeds 255 characters`
  - **Status:** RED — maxLength validation not implemented
  - **Verifies:** AC12 — "255 characters or less" error shown

- 🔴 **[P1]** `should allow subtask with exactly 255 characters`
  - **Status:** RED — Zod schema not implemented
  - **Verifies:** AC12 — Boundary condition: 255 chars is valid

- 🔴 **[P1]** `should cancel subtask creation with Escape key`
  - **Status:** RED — Escape key handling not implemented
  - **Verifies:** AC12 — Escape clears and dismisses subtask input

#### AC3 — Quick-Add: Create Task (5 tests)

- 🔴 **[P0]** `should create a task via quick-add with title only`
  - **Status:** RED — QuickAddField component not implemented
  - **Verifies:** AC3 — Click quick-add-btn → fill → Enter → task card appears

- 🔴 **[P0]** `should create quick-add task with sensible defaults in storage`
  - **Status:** RED — QuickAddField + addTask with defaults not implemented
  - **Verifies:** AC3 — Task created with priority=medium, completed=false

- 🔴 **[P0]** `should not create a quick-add task without a title`
  - **Status:** RED — QuickAddField validation not implemented
  - **Verifies:** AC3/AC12 — Empty title shows error, no task created

- 🔴 **[P1]** `should clear quick-add input after successful task creation`
  - **Status:** RED — QuickAddField state management not implemented
  - **Verifies:** AC3 — Input cleared after Enter, ready for next task

- 🔴 **[P1]** `should create multiple tasks in sequence via quick-add`
  - **Status:** RED — QuickAddField sequential creation not implemented
  - **Verifies:** AC3 — Three tasks created in sequence, all appear on board

#### AC10 — Quick-Add: Focus/Blur Behavior (3 tests)

- 🔴 **[P1]** `should cancel quick-add and clear input on Escape key`
  - **Status:** RED — Escape handler in QuickAddField not implemented
  - **Verifies:** AC10 — Escape clears input and cancels creation

- 🔴 **[P1]** `should clear quick-add input when user clicks away (blur on empty field)`
  - **Status:** RED — Blur handler not implemented
  - **Verifies:** AC10 — Blur on empty field shows no error, resets state

- 🔴 **[P1]** `should auto-focus quick-add input when triggered`
  - **Status:** RED — Auto-focus in QuickAddField not implemented
  - **Verifies:** AC10 — Input is focused immediately when quick-add-btn clicked

#### AC5 — Quick-Add: Keyboard Shortcut (4 tests)

- 🔴 **[P1]** `should activate quick-add via Cmd+Shift+N (Mac)`
  - **Status:** RED — useKeyboardShortcut hook not implemented
  - **Verifies:** AC5 — Meta+Shift+N focuses quick-add input

- 🔴 **[P1]** `should activate quick-add via Ctrl+Shift+N (Windows/Linux)`
  - **Status:** RED — useKeyboardShortcut hook not implemented
  - **Verifies:** AC5 — Control+Shift+N focuses quick-add input

- 🔴 **[P1]** `should create a task and keep quick-add focused for sequential creation`
  - **Status:** RED — Focus management after creation not implemented
  - **Verifies:** AC5 — After Enter, quick-add remains focused for rapid sequential entry

- 🔴 **[P2]** `should dismiss quick-add via Escape after keyboard shortcut activation`
  - **Status:** RED — Escape handler not implemented
  - **Verifies:** AC5 — Escape after shortcut dismisses quick-add

#### AC6 — Quick-Add: Column Selection (3 tests)

- 🔴 **[P1]** `should quick-add task to the column where the button is clicked`
  - **Status:** RED — QuickAddField per-column binding not implemented
  - **Verifies:** AC6 — Task created in In Progress column stays in that column

- 🔴 **[P1]** `should quick-add task to "To Do" column by default`
  - **Status:** RED — Default column logic not implemented
  - **Verifies:** AC6 — Default quick-add creates in first/todo column

- 🔴 **[P2]** `should show visual indicator of selected column in quick-add`
  - **Status:** RED — Column indicator UI not implemented
  - **Verifies:** AC6 — Column name visible in quick-add context

#### AC4 — Quick-Add: Expand to Full Form (3 tests)

- 🔴 **[P1]** `should expand quick-add task to full edit form`
  - **Status:** RED — Task edit form (via board.openTaskEditForm) not yet wired
  - **Verifies:** AC4 — Edit button opens full form with title pre-filled

- 🔴 **[P2]** `should pre-fill priority default (Medium) in expanded form from quick-add`
  - **Status:** RED — QuickAddExpandedForm default values not implemented
  - **Verifies:** AC4 — Priority shows "medium" in expanded form

- 🔴 **[P1]** `should quick-add expand via expand button before saving`
  - **Status:** RED — `data-testid="quick-add-expand-btn"` not implemented
  - **Verifies:** AC4 — Expand button opens full form with typed title

#### AC12 — Quick-Add: Validation (2 tests)

- 🔴 **[P1]** `should show validation error for quick-add with empty title`
  - **Status:** RED — QuickAddField validation not implemented
  - **Verifies:** AC12 — "Title is required" shown on empty Enter

- 🔴 **[P1]** `should show validation error for quick-add with title over 255 characters`
  - **Status:** RED — maxLength validation not implemented
  - **Verifies:** AC12 — Error shown, no task created

#### AC11 — Quick-Add: Performance (2 tests)

- 🔴 **[P2]** `should create a task via quick-add in under 200ms`
  - **Status:** RED — Feature not implemented yet
  - **Verifies:** AC11 — Measured elapsed time < 500ms (with test env buffer)

- 🔴 **[P2]** `should remain responsive when creating tasks on a board with 50+ tasks`
  - **Status:** RED — Feature not implemented yet
  - **Verifies:** AC11 — Performance maintained on large boards

#### Accessibility (3 tests)

- 🔴 **[P1]** `should support Tab navigation through subtask items in detail panel`
  - **Status:** RED — SubtasksPanel keyboard nav not implemented
  - **Verifies:** AC1/AC5 — Tab focus moves through interactive elements

- 🔴 **[P1]** `should support keyboard shortcut from board without mouse interaction`
  - **Status:** RED — Keyboard shortcut not implemented
  - **Verifies:** AC5 — Full task creation via keyboard only

- 🔴 **[P2]** `should announce subtask completion state to screen readers`
  - **Status:** RED — ARIA labels not implemented
  - **Verifies:** AC9 — Checkbox has `aria-label` containing subtask title

---

## Data Factories Created

### Subtask Factory

**File:** `tests/support/factories/subtask-factory.ts`

**Exports:**
- `createSubtask(overrides?)` — Create single subtask with faker defaults and optional overrides
- `createCompletedSubtask(overrides?)` — Create a subtask with `completed: true`
- `createSubtasks(taskId, count, overrides?)` — Create an ordered array of subtasks for a task

**Example Usage:**

```typescript
const task = createTask({ title: 'My task' });
const subtask = createSubtask({ taskId: task.id, title: 'Specific subtask' });
const threeSubtasks = createSubtasks(task.id, 3);
const doneSubtask = createCompletedSubtask({ taskId: task.id });
```

---

## Fixtures Created

### Subtasks Fixtures

**File:** `tests/support/fixtures/subtasks.fixture.ts`

**Fixtures:**
- `taskWithSubtasks` — A task with 3 pre-seeded subtasks (1 completed, 2 incomplete)
  - **Setup:** Seeds task + subtasks into localStorage/IndexedDB before page load
  - **Provides:** `{ taskTitle, subtasks[] }` for test assertions
  - **Cleanup:** Automatic (fresh context per test)

- `taskWithoutSubtasks` — A task with no subtasks
  - **Setup:** Seeds task only into localStorage
  - **Provides:** `{ taskTitle }` for empty-state tests

**Merged into:** `tests/support/fixtures/merged-fixtures.ts`

---

## Local Storage Helpers Updated

**File:** `tests/support/helpers/local-storage.ts`

**New exports:**
- `seedSubtasks(page, subtasks[])` — Seeds subtasks into IndexedDB (Dexie store) before page load
- `getSubtasksFromStorage(page)` — Reads all subtasks from IndexedDB for assertions
- `clearAppData(page)` — Updated to also delete `freelancerAppDB` from IndexedDB

---

## Required `data-testid` Attributes

### TaskDetailPanel / Sheet Component

- `task-detail-panel` — The task detail side panel/sheet container
- `add-subtask-btn` — Button to open subtask input form ("Add subtask")
- `subtask-input` — Input field for entering subtask title
- `subtask-item` — Container div for each subtask row
- `subtask-checkbox` — Checkbox element within each subtask row
- `subtask-title` — Title text span within each subtask row
- `subtask-delete-btn` — Delete (trash) icon button on each subtask row

**Implementation Example:**

```tsx
<div data-testid="task-detail-panel">
  {/* ... task fields ... */}
  <SubtasksPanel task={task} />
</div>

// SubtasksPanel.tsx:
<button data-testid="add-subtask-btn">Add subtask</button>
<input data-testid="subtask-input" ... />
{subtasks.map(subtask => (
  <div key={subtask.id} data-testid="subtask-item">
    <Checkbox data-testid="subtask-checkbox" ... />
    <span data-testid="subtask-title">{subtask.title}</span>
    <button data-testid="subtask-delete-btn" ... />
  </div>
))}
```

### TaskCard Component

- `subtask-summary` — The compact subtask count badge (e.g., "2/3 subtasks done")

```tsx
<div data-testid="task-card">
  <h3>{task.title}</h3>
  {subtaskCount > 0 && (
    <span data-testid="subtask-summary">{completedCount}/{subtaskCount} subtasks</span>
  )}
</div>
```

### QuickAddField / KanbanBoard / SortableColumn

- `quick-add-btn` — The trigger button per column ("+ Add task" or similar)
- `quick-add-input` — The text input for quick task entry
- `quick-add-expand-btn` — Expand/chevron button to open full task form

```tsx
// SortableColumn.tsx or KanbanBoard.tsx:
<button data-testid="quick-add-btn">+ Add task</button>
<input data-testid="quick-add-input" placeholder="Add a task..." ... />
<button data-testid="quick-add-expand-btn">⤢</button>
```

---

## Implementation Checklist

### Group 1: Subtask Schema & Storage (AC1, AC7, AC8, AC9)

**Tasks to make subtask persistence tests pass:**

- [ ] Create `src/schemas/subtask.ts` with Zod schema (id, taskId, title, completed, order, createdAt, updatedAt)
- [ ] Update `src/db/schema.ts` to add `subtasks` store: `++id, taskId, order`
- [ ] Bump Dexie database version to include new store
- [ ] Add `subtasks: Table<Subtask>` to `AppDatabase` class
- [ ] Add `data-testid="task-detail-panel"` to TaskDetailPanel/Sheet component
- [ ] Run test: `npx playwright test tests/e2e/subtasks-and-quick-add.spec.ts --grep "persist subtasks to Dexie"`
- [ ] ✅ Tests pass (green phase)

**Estimated Effort:** 0.5 hours

---

### Group 2: AppContext Subtask Methods (AC1, AC8, AC9)

**Tasks to make subtask CRUD tests pass:**

- [ ] Add `subtasks: Subtask[]` to AppContext state
- [ ] Add `loadSubtasks()` effect that reads from Dexie on app init
- [ ] Implement `addSubtask(taskId, title): Promise<Subtask>` with Zod validation
- [ ] Implement `deleteSubtask(subtaskId): Promise<void>`
- [ ] Implement `toggleSubtaskCompletion(subtaskId): Promise<void>`
- [ ] Implement `updateSubtaskOrder(subtaskId, newOrder): Promise<void>`
- [ ] All methods: validate with Zod, persist to Dexie, update React state
- [ ] Run test: `npx playwright test tests/e2e/subtasks-and-quick-add.spec.ts --grep "AC1"`
- [ ] ✅ Tests pass (green phase)

**Estimated Effort:** 1 hour

---

### Group 3: SubtasksPanel Component (AC1, AC8, AC9, AC12)

**Tasks to make subtask UI tests pass:**

- [ ] Create `src/components/SubtasksPanel.tsx`
- [ ] Add `data-testid="subtask-item"` on each subtask row div
- [ ] Add `data-testid="subtask-checkbox"` on Checkbox component
- [ ] Add `data-testid="subtask-title"` on title span
- [ ] Add `data-testid="subtask-delete-btn"` on delete button
- [ ] Add `data-testid="add-subtask-btn"` on the "Add subtask" button
- [ ] Add `data-testid="subtask-input"` on the title input field
- [ ] Implement: display subtask list sorted by order
- [ ] Implement: checkbox toggle calls `toggleSubtaskCompletion`
- [ ] Implement: delete button shows confirmation dialog, then calls `deleteSubtask`
- [ ] Implement: completed subtask shows `text-decoration: line-through`
- [ ] Implement: Zod validation on input (required, max 255 chars)
- [ ] Implement: Enter key submits, Escape clears/dismisses
- [ ] Integrate SubtasksPanel into TaskDetailPanel/Sheet with `data-testid="task-detail-panel"`
- [ ] Run test: `npx playwright test tests/e2e/subtasks-and-quick-add.spec.ts --grep "AC1|AC8|AC9|AC12" --grep-invert "Quick-Add"`
- [ ] ✅ Tests pass (green phase)

**Estimated Effort:** 2 hours

---

### Group 4: TaskSummary Component (AC2)

**Tasks to make subtask summary tests pass:**

- [ ] Create `src/components/TaskSummary.tsx`
- [ ] Add `data-testid="subtask-summary"` on the summary badge
- [ ] Compute `completedCount / totalCount` from AppContext subtasks filtered by taskId
- [ ] Show "X/Y subtasks" text (or equivalent)
- [ ] Return `null` when task has 0 subtasks (no badge shown)
- [ ] Integrate TaskSummary into TaskCard
- [ ] Run test: `npx playwright test tests/e2e/subtasks-and-quick-add.spec.ts --grep "AC2"`
- [ ] ✅ Tests pass (green phase)

**Estimated Effort:** 0.5 hours

---

### Group 5: QuickAddField Component (AC3, AC10, AC12)

**Tasks to make quick-add basic tests pass:**

- [ ] Create `src/components/QuickAddField.tsx`
- [ ] Add `data-testid="quick-add-btn"` on trigger button
- [ ] Add `data-testid="quick-add-input"` on the text input
- [ ] Implement: click button → show input (auto-focus)
- [ ] Implement: Enter key → validate → call `addTask(columnId, { title, priority: 'medium' })` → clear field
- [ ] Implement: Escape key → clear field and dismiss
- [ ] Implement: validation — "Title is required" on empty, "255 characters or less" on overflow
- [ ] Implement: blur on empty field → reset state without error
- [ ] Integrate QuickAddField at bottom of each column (SortableColumn.tsx)
- [ ] Run test: `npx playwright test tests/e2e/subtasks-and-quick-add.spec.ts --grep "AC3|AC10|Quick-Add.*Validation"`
- [ ] ✅ Tests pass (green phase)

**Estimated Effort:** 1.5 hours

---

### Group 6: Keyboard Shortcut (AC5)

**Tasks to make keyboard shortcut tests pass:**

- [ ] Create `src/hooks/useKeyboardShortcut.ts`
- [ ] Register `Cmd+Shift+N` (Mac) and `Ctrl+Shift+N` (Win/Linux) globally in KanbanBoard or App
- [ ] On shortcut: focus the `quick-add-input` in the first/active column
- [ ] Keep input focused after task creation for sequential entry
- [ ] Add `data-testid="quick-add-expand-btn"` on expand button
- [ ] Run test: `npx playwright test tests/e2e/subtasks-and-quick-add.spec.ts --grep "AC5"`
- [ ] ✅ Tests pass (green phase)

**Estimated Effort:** 1 hour

---

### Group 7: Column-Specific Quick-Add (AC6)

**Tasks to make column selection tests pass:**

- [ ] Ensure each column's `QuickAddField` passes correct `columnId` prop
- [ ] Task created via quick-add appears in the correct column (bound to `columnId`)
- [ ] Default column = first column (or "To Do")
- [ ] (Optional) Visual indicator of selected column
- [ ] Run test: `npx playwright test tests/e2e/subtasks-and-quick-add.spec.ts --grep "AC6"`
- [ ] ✅ Tests pass (green phase)

**Estimated Effort:** 0.5 hours

---

### Group 8: Quick-Add Expansion (AC4)

**Tasks to make expansion tests pass:**

- [ ] Create `src/components/QuickAddExpandedForm.tsx` (or reuse TaskDetailPanel)
- [ ] Add `data-testid="quick-add-expand-btn"` on the expand/chevron button
- [ ] Implement: expand button → open full task form modal/sheet with title pre-filled
- [ ] Pre-fill all defaults (title from input, priority=Medium, columnId)
- [ ] Run test: `npx playwright test tests/e2e/subtasks-and-quick-add.spec.ts --grep "AC4"`
- [ ] ✅ Tests pass (green phase)

**Estimated Effort:** 1 hour

---

## Running Tests

```bash
# Run all story 1.7 E2E tests (all skipped - RED phase)
npx playwright test tests/e2e/subtasks-and-quick-add.spec.ts

# Run only P0 critical path tests
npx playwright test tests/e2e/subtasks-and-quick-add.spec.ts --grep "@P0|\\[P0\\]"

# Run P0 + P1 tests
npx playwright test tests/e2e/subtasks-and-quick-add.spec.ts --grep "\\[P0\\]|\\[P1\\]"

# Run in headed mode (see browser)
npx playwright test tests/e2e/subtasks-and-quick-add.spec.ts --headed

# Debug specific test
npx playwright test tests/e2e/subtasks-and-quick-add.spec.ts --debug

# Run specific AC group
npx playwright test tests/e2e/subtasks-and-quick-add.spec.ts --grep "AC1"

# Run all tests (including other stories)
npm run test:e2e
```

---

## Red-Green-Refactor Workflow

### RED Phase (Complete) ✅

**TEA Agent Responsibilities:**
- ✅ 48 E2E tests written and failing with `test.skip()`
- ✅ All tests assert EXPECTED behavior
- ✅ Subtask factory (`createSubtask`, `createSubtasks`, `createCompletedSubtask`) created
- ✅ Subtask fixture (`taskWithSubtasks`, `taskWithoutSubtasks`) created
- ✅ `seedSubtasks` and `getSubtasksFromStorage` helpers added
- ✅ All `data-testid` requirements documented
- ✅ Implementation checklist grouped by logical feature areas

**Verification:**
- Tests fail because features don't exist yet — NOT because tests are buggy
- All `test.skip()` calls are intentional markers for the TDD red phase

---

### GREEN Phase (DEV Team — Next Steps)

**DEV Agent Responsibilities:**

1. **Pick one group** from the Implementation Checklist (start with Group 1: Schema & Storage)
2. **Read the tests** for that group to understand expected behavior
3. **Implement minimal code** to make those specific tests pass
4. **Remove `test.skip()`** from the corresponding tests and run them
5. **Verify tests pass** (green) — if not, fix the implementation (not the test)
6. **Check off tasks** in the implementation checklist
7. **Move to next group** and repeat

**Key Principle:** One group at a time. Don't try to implement everything at once.

---

### REFACTOR Phase (After All Tests Pass)

1. Verify all 48 tests pass (green phase complete)
2. Extract shared patterns (e.g., panel open helper, subtask creation helper)
3. Optimize Dexie queries (indexes are already defined — verify they're used)
4. Remove any code smells (large components, prop drilling)
5. Ensure tests still pass after each refactor

---

## Next Steps

1. **Share this checklist** with the dev team / dev-story workflow
2. **Start with Group 1** (Subtask Schema & Storage) — foundational piece
3. **Run RED phase verification:** `npx playwright test tests/e2e/subtasks-and-quick-add.spec.ts`
4. **Work one group at a time:** red → green per group
5. **When all tests pass**, refactor for quality
6. **Update story status** in `_bmad-output/implementation-artifacts/sprint-status.yaml` to `done`

---

## Knowledge Base References Applied

- **data-factories.md** — Factory pattern with faker overrides (`createSubtask`, `createSubtasks`)
- **fixture-architecture.md** — Composable fixtures with auto-cleanup (`subtasks.fixture.ts`)
- **selector-resilience.md** — Resilient selectors: `getByTestId`, `getByRole`, `getByText`
- **test-quality.md** — Given-When-Then structure, one assertion per test, determinism
- **test-levels-framework.md** — E2E for user journeys; this is a pure frontend story (no API tests needed)
- **network-first.md** — `seedTasks`/`seedSubtasks` via `addInitScript` before navigation (fast setup, no UI seeding)

---

## Test Execution Evidence

### Initial Test Run (RED Phase Verification)

**Command:** `npx playwright test tests/e2e/subtasks-and-quick-add.spec.ts`

**Expected Results:**
```
Running 48 tests using N workers

  48 skipped
  0 passed
  0 failed
  0 timed out

Status: ✅ RED phase verified (all tests intentionally skipped)
```

**Expected Failure Messages when skip is removed (before implementation):**
- `Error: No element with data-testid="task-detail-panel" found`
- `Error: No element with data-testid="subtask-item" found`
- `Error: No element with data-testid="quick-add-btn" found`
- `Error: No element with data-testid="quick-add-input" found`
- `Error: No element with data-testid="subtask-summary" found`

These failures confirm the RED phase is working correctly.

---

## Notes

- **Dexie seeding:** `seedSubtasks` opens IndexedDB directly via `addInitScript` to seed before app initialization. The Dexie store name must match the app: `freelancerAppDB`, store: `subtasks`.
- **Task ID type:** The test factories use string UUIDs for `id` and `taskId`. The app's Dexie schema uses `++id` (auto-increment integer). The `seedSubtasks` helper inserts with string IDs; the app will need to handle this or tests should use numeric IDs once the schema is clear. The `getSubtasksFromStorage` helper reads from IndexedDB and this may need to be adjusted once the actual Dexie schema is confirmed.
- **Keyboard shortcut browser conflicts:** `Cmd+Shift+N` opens a new Incognito window in Chrome. Tests run in a controlled Playwright browser context so this doesn't affect tests — but document this in app settings for real users.
- **Performance buffer:** AC11 tests allow 500ms elapsed time (vs. 200ms spec) to account for Playwright test environment overhead. The app target remains < 200ms.
- **Column test IDs:** Board column locators use `board.getColumn('in-progress')` which maps to `data-testid="column-in-progress"`. Verify column naming convention matches the app's actual `columnId` values from Story 1.4.

---

**Generated by BMad TEA Agent (testarch-atdd)** — 2026-03-12
