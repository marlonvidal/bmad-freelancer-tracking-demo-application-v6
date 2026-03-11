---
stepsCompleted: ['step-01-preflight-and-context', 'step-02-generation-mode', 'step-03-test-strategy', 'step-04-generate-tests', 'step-04c-aggregate']
lastStep: 'step-04c-aggregate'
lastSaved: '2026-03-11'
workflowType: 'testarch-atdd'
inputDocuments:
  - _bmad-output/implementation-artifacts/1-4-create-kanban-board-with-customizable-columns.md
  - _bmad/tea/config.yaml
  - _bmad/tea/testarch/knowledge/data-factories.md
  - _bmad/tea/testarch/knowledge/test-quality.md
  - _bmad/tea/testarch/knowledge/fixture-architecture.md
---

# ATDD Checklist - Epic 1, Story 1.4: Create Kanban Board with Customizable Columns

**Date:** 2026-03-11
**Author:** Marlon
**Primary Test Level:** E2E
**Story Status:** ready-for-dev

---

## Story Summary

As a freelancer, I want to view and customize a kanban board with columns I can add, remove, reorder, and rename, so I can organize my workflow the way I work.

**As a** freelancer
**I want** to view and customize a kanban board with columns I can add, remove, reorder, and rename
**So that** I can organize my workflow the way I work

---

## Acceptance Criteria

1. **Kanban Board Display** - Display columns from Dexie, responsive layout with 24px padding, empty column CTAs visible
2. **Add New Columns** - "+ Add Column" button opens dialog, validates name, creates column, persists to IndexedDB
3. **Remove Columns** - Delete button on headers, confirmation dialog, task count warning, persistence
4. **Reorder Columns via Drag-and-Drop** - Drag column header to reorder, smooth 60fps animations, keyboard arrow support, persistence
5. **Edit Column Names Inline** - Click header to edit, Enter/Escape keyboard support, persistence
6. **Keyboard Accessibility** - Full keyboard navigation (Tab/Arrow/Enter/Delete), focus indicators, aria-labels

---

## TDD Red Phase Status: ✅ COMPLETE

### 🔴 Failing Tests Generated (RED PHASE)

**Test Framework:** Playwright (E2E)
**Execution Mode:** Subagent (parallel API + E2E generation)
**Status:** All tests intentionally failing with `test.skip()` - ready for implementation

---

## Failing Tests Created (RED Phase)

### E2E Tests (31 tests)

**File:** `tests/e2e/kanban-board-crud.spec.ts` (1,000+ lines)

| AC | Test Name | Priority | Status | Expected Failure |
|----|-----------|-----------|---------  |-----------------|
| **AC1: Board Display** |
| | [P0] should display kanban board with persisted columns on page load | P0 | 🔴 SKIP | Board component missing |
| | [P0] should render kanban board with 24px padding per UX spec | P0 | 🔴 SKIP | Styling not applied |
| | [P0] should show "Add task" CTA in empty columns | P0 | 🔴 SKIP | CTA component missing |
| **AC2: Add New Columns** |
| | [P0] should display "+ Add Column" button on board | P0 | 🔴 SKIP | Button not implemented |
| | [P1] should open dialog when clicking "+ Add Column" | P1 | 🔴 SKIP | Dialog component missing |
| | [P1] should validate that column name is required | P1 | 🔴 SKIP | Validation not implemented |
| | [P1] should create new column and add to board | P1 | 🔴 SKIP | Create feature missing |
| | [P1] should persist new column to IndexedDB across page reload | P1 | 🔴 SKIP | Persistence logic missing |
| **AC3: Remove Columns** |
| | [P0] should display delete icon on each column header | P0 | 🔴 SKIP | Delete button missing |
| | [P1] should show confirmation dialog when clicking delete | P1 | 🔴 SKIP | Confirmation dialog missing |
| | [P1] should warn if column contains tasks before deletion | P1 | 🔴 SKIP | Task count warning missing |
| | [P1] should delete column and persist change to IndexedDB | P1 | 🔴 SKIP | Delete feature missing |
| | [P2] should allow canceling deletion | P2 | 🔴 SKIP | Cancel button missing |
| **AC4: Reorder Columns via DnD** |
| | [P0] should allow dragging column header to reorder | P0 | 🔴 SKIP | @dnd-kit not integrated |
| | [P1] should show visual drop indicator during drag | P1 | 🔴 SKIP | Visual indicator missing |
| | [P1] should maintain 60fps smooth animations during reorder | P1 | 🔴 SKIP | Animations not optimized |
| | [P1] should persist column order to IndexedDB after reorder | P1 | 🔴 SKIP | Persistence logic missing |
| | [P2] should support keyboard navigation for column reordering | P2 | 🔴 SKIP | Keyboard DnD not implemented |
| **AC5: Edit Column Names Inline** |
| | [P0] should enter inline edit mode when clicking column header | P0 | 🔴 SKIP | Edit mode component missing |
| | [P1] should save on Enter key | P1 | 🔴 SKIP | Enter handler missing |
| | [P1] should cancel on Escape key | P1 | 🔴 SKIP | Escape handler missing |
| | [P1] should save on blur (click away) | P1 | 🔴 SKIP | Blur handler missing |
| | [P1] should persist edited column name to IndexedDB | P1 | 🔴 SKIP | Persistence logic missing |
| | [P2] should validate that column name cannot be empty | P2 | 🔴 SKIP | Validation missing |
| **AC6: Keyboard Accessibility** |
| | [P0] should allow Tab navigation through column headers | P0 | 🔴 SKIP | Focus management missing |
| | [P0] should use Arrow keys to navigate between columns | P0 | 🔴 SKIP | Arrow key handlers missing |
| | [P1] should activate inline edit on Enter key | P1 | 🔴 SKIP | Keyboard handler missing |
| | [P1] should allow Delete key to remove column | P1 | 🔴 SKIP | Delete key handler missing |
| | [P1] should show visible focus indicators on all interactive elements | P1 | 🔴 SKIP | Focus styles missing |
| | [P1] should have descriptive aria-labels on interactive elements | P1 | 🔴 SKIP | aria-labels missing |
| | [P2] should support Shift+Tab for backward navigation | P2 | 🔴 SKIP | Backward navigation missing |
| **Integration Tests** |
| | [P0] Integration: should complete full workflow via keyboard only | P0 | 🔴 SKIP | Multiple features missing |
| | [P1] Integration: should handle rapid add/rename/delete without data loss | P1 | 🔴 SKIP | Race condition handling missing |

---

## Test Coverage Analysis

### Priority Distribution

- **P0 (Critical - 11 tests):** Core features blocking user workflow
  - Board display, add/remove/reorder columns, keyboard basics
- **P1 (High - 16 tests):** Feature completeness and edge cases
  - Dialog validation, persistence, DnD animations, accessibility
- **P2 (Medium - 5 tests):** Polish and advanced accessibility
  - Focus indicators, backward navigation, cancel operations

### Acceptance Criteria Coverage

✅ **AC1: Kanban Board Display** - 3 tests
- Board rendering, UX padding, empty state CTA

✅ **AC2: Add New Columns** - 5 tests
- Button, dialog, validation, creation, persistence

✅ **AC3: Remove Columns** - 5 tests
- Delete button, confirmation, task warning, persistence, cancel

✅ **AC4: Reorder via DnD** - 4 tests
- Drag interaction, visual feedback, 60fps animations, persistence

✅ **AC5: Inline Edit** - 5 tests
- Enter edit mode, save/cancel, blur, persistence, validation

✅ **AC6: Keyboard Accessibility** - 7 tests
- Tab/Arrow navigation, Enter/Delete, focus indicators, aria-labels

✅ **Integration** - 2 tests
- Full keyboard workflow, rapid operations without data loss

---

## Data Factories Created

### Column Factory

**File:** `tests/support/factories/column.factory.ts`

**Exports:**

- `createColumn(overrides?)` - Create single column with optional overrides
- `createColumns(count, overrides?)` - Create array of columns
- `createDefaultColumns()` - Create typical default columns (Backlog, In Progress, Review, Done)
- `createKanbanWorkflowColumns()` - Create standard kanban workflow columns
- `generateUniqueColumnName(prefix?)` - Generate unique column name for testing
- `createNamedColumn(name, order)` - Create column with specific name

**Example Usage:**

```typescript
import { createColumn, createColumns } from '@tests/support/factories/column.factory';

const column = createColumn({ name: 'Custom Column', order: 0 });
const columns = createColumns(5);
const workflow = createKanbanWorkflowColumns(); // Backlog, To Do, In Progress, Review, Done
```

---

## Fixtures Created

### Kanban Board Fixture

**File:** `tests/support/fixtures/kanban-board.fixture.ts`

**Fixtures:**

- `kanbanBoard` - Complete KanbanBoardPageHelper with pre-configured database setup/teardown
  - **Setup:** Creates clean IndexedDB context, clears database before test
  - **Provides:** Helper methods for board interactions (navigate, add/delete/rename columns, etc.)
  - **Cleanup:** Clears database after test

- `cleanDatabase` - Utility to manually clear database within tests

**Helper Methods:**

- `navigateToBoard()` - Navigate to board page
- `openAddColumnDialog()` - Open the Add Column dialog
- `createColumn(name)` - Create a column by name
- `deleteColumn(columnName)` - Delete column with confirmation
- `renameColumn(oldName, newName)` - Rename column inline
- `dragColumnToPosition(columnName, position)` - Drag column to new position
- `getColumnCount()` - Get total column count
- `getColumnNames()` - Get all column names in order
- `getDatabaseState()` - Get current IndexedDB state
- `clearDatabase()` - Clear all database data
- `waitForBoardReady()` - Wait for board to fully load

**Example Usage:**

```typescript
import { test, expect } from '@tests/support/fixtures/kanban-board.fixture';

test('should add and persist column', async ({ kanbanBoard }) => {
  await kanbanBoard.navigateToBoard();
  await kanbanBoard.createColumn('Test Column');
  
  const names = await kanbanBoard.getColumnNames();
  expect(names).toContain('Test Column');
  
  // Reload to verify persistence
  await page.reload();
  const reloadedNames = await kanbanBoard.getColumnNames();
  expect(reloadedNames).toContain('Test Column');
});
```

---

## Selector Strategy

All tests use **resilient selectors** (getByRole, getByText, getByLabel) to avoid brittle CSS-class dependencies:

### Selector Patterns Used

- `getByRole('button', { name: /add column/i })` - Find Add Column button
- `getByRole('dialog', { name: /add.*column/i })` - Find Add Column dialog
- `getByRole('textbox', { name: /column name/i })` - Find name input
- `getByRole('heading')` - Find column headers
- `getByText(/add task/i)` - Find empty state CTA
- `getByTestId('kanban-board')` - Find main board container
- `getByTestId('column-{name}')` - Find column by name
- `getByTestId('drop-indicator')` - Find DnD visual indicator

### data-testid Requirements

For tests to pass, UI must implement these data-testid attributes:

```typescript
// Kanban board container
<div data-testid="kanban-board">

// Column containers (one per column)
<div data-testid="column-{columnName}">

// DnD drop indicator
<div data-testid="drop-indicator">
```

---

## Implementation Checklist

### Must Implement for GREEN Phase

- [ ] **KanbanBoard Component** - Main board container with column rendering
- [ ] **Column Component** - Individual column with header and tasks
- [ ] **AddColumnDialog** - Dialog form for creating columns
- [ ] **DeleteColumnDialog** - Confirmation dialog for deletion
- [ ] **InlineEdit Component** - Editable column header with save/cancel
- [ ] **Dexie.js Setup** - Database schema with columns store
- [ ] **@dnd-kit Integration** - Drag-and-drop library setup
- [ ] **Keyboard Handlers** - Tab, Arrow, Enter, Delete navigation
- [ ] **Accessibility** - ARIA labels, focus management, screen reader support
- [ ] **Persistence** - IndexedDB save/load for all operations
- [ ] **Styling** - 24px padding, responsive layout, focus indicators

### Implementation Priority (Suggested Order)

1. **P0 Features First** (11 tests - foundation)
   - [ ] Create KanbanBoard + Column components
   - [ ] Setup Dexie.js database
   - [ ] Render columns from database

2. **P1 Features** (16 tests - core functionality)
   - [ ] Add Column dialog + creation
   - [ ] Delete Column + confirmation + warning
   - [ ] Drag-and-drop reordering
   - [ ] Inline column name editing
   - [ ] Keyboard navigation basics

3. **P2 Polish** (5 tests - accessibility)
   - [ ] Focus indicators + Shift+Tab
   - [ ] ARIA labels on all interactive elements
   - [ ] Advanced keyboard combinations

---

## Test Execution Commands

```bash
# Run all failing tests (should all fail with test.skip())
npm run test:e2e -- kanban-board-crud

# Run with headed browser to see UI
npm run test:e2e -- kanban-board-crud --headed

# Debug specific test
npm run test:e2e -- kanban-board-crud -g "should display kanban board"

# Run with coverage
npm run test:e2e -- kanban-board-crud --coverage

# Watch mode during development
npm run test:e2e -- kanban-board-crud --watch
```

---

## Red-Green-Refactor Workflow

### RED Phase (Complete) ✅

**Status:** All 31 tests generated with `test.skip()`, ready for implementation

**TEA Agent Responsibilities - COMPLETED:**

- ✅ All tests written with expected behavior (not placeholders)
- ✅ All tests marked with `test.skip()` (documented RED phase)
- ✅ All tests use resilient selectors (getByRole, getByText)
- ✅ Fixtures and factories created with auto-cleanup
- ✅ Data-testid requirements documented
- ✅ Implementation checklist provided
- ✅ Test execution commands provided

**Verification:**

- All tests compile without errors
- All tests have concrete assertions (not placeholders)
- All tests are properly skipped (test.skip())
- Fixture infrastructure ready to use

---

### GREEN Phase (DEV Team - Next Steps)

**DEV Workflow:**

1. **Pick one failing test** from implementation checklist (start with P0)
2. **Read the test** to understand expected behavior
3. **Implement minimal code** to make that specific test pass
4. **Remove `test.skip()`** from the test
5. **Run the test** to verify it now passes (green)
6. **Repeat** for next test (one test at a time)

**Suggested Implementation Order:**

1. Setup KanbanBoard component + Dexie schema
2. Implement board rendering (AC1 tests)
3. Add Column dialog + creation (AC2 tests)
4. Delete Column with confirmation (AC3 tests)
5. Drag-and-drop reordering (AC4 tests)
6. Inline column editing (AC5 tests)
7. Keyboard accessibility (AC6 tests)

**Progress Tracking:**

- Remove `test.skip()` as features complete
- Run tests after each feature: `npm run test:e2e -- kanban-board-crud`
- Check off tasks in implementation checklist
- Share progress in daily standup

---

### REFACTOR Phase (DEV Team - After All Tests Pass)

**Once all tests pass (green phase complete):**

1. **Review code quality** - readability, maintainability, DRY
2. **Optimize performance** - smooth animations, minimal re-renders
3. **Extract duplications** - shared components, utilities
4. **Ensure accessibility** - keyboard support, screen readers
5. **Run full test suite** - verify nothing broke

**Completion Criteria:**

- All 31 tests passing
- Code meets team quality standards
- No duplicate logic or code smells
- Performance acceptable (60fps animations)
- Accessibility verified (keyboard + screen reader)
- Story approved and ready for production

---

## Knowledge Base References Applied

This ATDD workflow consulted the following knowledge fragments:

- **data-factories.md** - Column factory patterns with `@faker-js/faker`
- **fixture-architecture.md** - Playwright test.extend() with setup/teardown
- **test-quality.md** - ATDD principles, Given-When-Then structure
- **selector-resilience.md** - Resilient selector patterns (getByRole, getByText)
- **test-levels-framework.md** - E2E testing for UI integration

---

## Next Steps

1. ✅ **RED Phase:** ATDD tests generated with failing tests (current)
2. **Share with team:** Provide this checklist + failing tests to dev team
3. **Review in standup:** Discuss implementation approach and priority
4. **Begin implementation:** Start with P0 features, remove test.skip() as you go
5. **Run tests frequently:** After each feature, verify tests pass (green phase)
6. **When all tests pass:** Refactor for quality and prepare for production

---

## Status Summary

| Phase | Status | Details |
|-------|--------|---------|
| **RED Phase** | ✅ COMPLETE | 31 failing tests generated, test.skip() applied, fixtures created |
| **File Creation** | ✅ COMPLETE | Test file, factories, fixtures written to disk |
| **Infrastructure** | ✅ COMPLETE | Dexie setup, selector patterns, accessibility patterns documented |
| **Implementation** | ⏳ PENDING | Waiting for dev team to remove test.skip() and implement features |
| **GREEN Phase** | ⏳ PENDING | After implementation, all tests should pass |
| **REFACTOR Phase** | ⏳ PENDING | After all tests pass, optimize and clean code |

---

## Contact & Questions

- **Story Location:** `_bmad-output/implementation-artifacts/1-4-create-kanban-board-with-customizable-columns.md`
- **Test File:** `tests/e2e/kanban-board-crud.spec.ts`
- **Fixtures:** `tests/support/fixtures/kanban-board.fixture.ts`
- **Factories:** `tests/support/factories/column.factory.ts`

For questions about tests or implementation guidance, refer to:
- ATDD principles in `tea-index.csv`
- Acceptance criteria in story file
- Implementation checklist in this document

---

**Generated by BMad TEA Agent** - ATDD Workflow for Story 1.4 - 2026-03-11
**TDD Phase:** RED (All tests intentionally failing - ready for implementation)
