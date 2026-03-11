---
stepsCompleted: ['step-01-detect-mode', 'step-02-load-context', 'step-03-risk-and-testability', 'step-04-coverage-plan', 'step-05-generate-output']
lastStep: 'step-05-generate-output'
lastSaved: '2026-03-11'
epic: 1
mode: epic-level
---

# Test Design: Epic 1 - Foundation & Core Kanban

**Date:** 2026-03-11
**Author:** Marlon
**Status:** Draft

---

## Executive Summary

**Scope:** Full test design for Epic 1 — Foundation & Core Kanban (Stories 1.1–1.7)

**Epic Goal:** Users can manage tasks on a kanban board with customizable columns and drag-and-drop. All data persists locally in the browser with no external transmission.

**FRs Covered:** FR1, FR2, FR3, FR4, FR5, FR6, FR7, FR8, FR35, FR36

**Risk Summary:**

- Total risks identified: 12
- High-priority risks (≥6): 5
- Critical categories: DATA, TECH, PERF

**Coverage Summary:**

- P0 scenarios: 14 (~28–42 hours)
- P1 scenarios: 18 (~18–36 hours)
- P2/P3 scenarios: 12 (~6–18 hours)
- **Total effort**: ~52–96 hours (~7–12 days)

---

## Not in Scope

| Item | Reasoning | Mitigation |
| ---- | --------- | ---------- |
| **Time Tracking (FR9–FR16)** | Epic 2 scope; not yet implemented | Covered in test-design-epic-2.md |
| **Client/Project Management (FR17–FR25)** | Epic 3 scope | Covered in test-design-epic-3.md |
| **Search/Filter/Export (FR27–FR34)** | Epic 4 scope | Covered in test-design-epic-4.md |
| **Backend API / Server** | No backend; all data is local | Architecture confirms no backend |
| **Cross-browser compatibility** | PWA targets modern Chromium/Firefox/Safari; no legacy IE | Playwright multi-browser config handles this |
| **Accessibility audit (WCAG 2.1 AA full)** | NFR8 is post-MVP; keyboard operability (NFR9) is in scope | Manual accessibility audit deferred |

---

## Risk Assessment

### High-Priority Risks (Score ≥6)

| Risk ID | Category | Description | Probability | Impact | Score | Mitigation | Owner | Timeline |
| ------- | -------- | ----------- | ----------- | ------ | ----- | ---------- | ----- | -------- |
| R-001 | DATA | IndexedDB data loss on schema migration — Dexie.js version upgrade without migration script could silently corrupt or wipe task/column data | 2 | 3 | 6 | Write explicit Dexie version migration tests; seed data before upgrade and verify post-upgrade integrity | Dev | Before 1.3 merge |
| R-002 | TECH | @dnd-kit drag-and-drop state desync — after drag, in-memory React state and IndexedDB may diverge if persistence write fails silently | 3 | 2 | 6 | Intercept Dexie write errors; add E2E tests that verify column order persists after reload post-drag | Dev/QA | Before 1.6 merge |
| R-003 | PERF | 1000+ tasks render performance — kanban board with 1000 tasks may drop below 60fps (NFR2, NFR3) | 2 | 3 | 6 | Add performance smoke test with 1000 seeded tasks; assert FPS ≥ 60 and load time ≤ 3s | Dev | Before Epic 1 sign-off |
| R-004 | DATA | Zod validation bypass — if Zod schema is not applied before every Dexie write, invalid task data (e.g., missing required title) could be persisted | 2 | 3 | 6 | Unit test all Zod schemas; integration test that invalid data is rejected before DB write | Dev | Before 1.5 merge |
| R-005 | TECH | PWA service worker cache stale — after app update, service worker may serve stale JS/CSS, causing runtime errors | 2 | 3 | 6 | Test service worker update flow; verify `skipWaiting` or user-prompted refresh behavior | Dev | Before 1.2 merge |

### Medium-Priority Risks (Score 3–5)

| Risk ID | Category | Description | Probability | Impact | Score | Mitigation | Owner |
| ------- | -------- | ----------- | ----------- | ------ | ----- | ---------- | ----- |
| R-006 | TECH | React Router navigation state loss — navigating away from Board and back may reset unsaved in-progress edits | 2 | 2 | 4 | E2E test: start editing task → navigate away → navigate back → assert edit state | Dev |
| R-007 | BUS | Column deletion with tasks — deleting a column containing tasks without confirmation could cause data loss | 2 | 2 | 4 | E2E test: add tasks to column → delete column → assert confirmation dialog → assert tasks handled | QA |
| R-008 | PERF | Drag-and-drop animation frame drops — complex re-renders during drag may cause jank on lower-end hardware | 2 | 2 | 4 | Manual smoke test on mid-range device; defer automated perf test to post-MVP | Dev |
| R-009 | DATA | Auto-save race condition — rapid edits (e.g., typing in task title) may cause concurrent Dexie writes | 2 | 2 | 4 | Debounce auto-save writes; unit test debounce logic; E2E test rapid edits | Dev |
| R-010 | TECH | Path alias resolution failure — `@/` imports may break in test environment if tsconfig paths not mirrored in Playwright/Vitest config | 2 | 2 | 4 | Verify `@/` resolves in both dev and test builds; add CI check | Dev |

### Low-Priority Risks (Score 1–2)

| Risk ID | Category | Description | Probability | Impact | Score | Action |
| ------- | -------- | ----------- | ----------- | ------ | ----- | ------ |
| R-011 | OPS | Vercel deployment config drift — static SPA routing may 404 on direct URL access if `vercel.json` rewrite rules are missing | 1 | 2 | 2 | Document required `vercel.json` config; add to deployment checklist | Monitor |
| R-012 | BUS | Inline column rename UX confusion — double-click vs single-click to edit column name may be non-obvious | 1 | 1 | 1 | UX smoke test: verify edit affordance is discoverable | Monitor |

### Risk Category Legend

- **TECH**: Technical/Architecture (flaws, integration, scalability)
- **SEC**: Security (access controls, auth, data exposure)
- **PERF**: Performance (SLA violations, degradation, resource limits)
- **DATA**: Data Integrity (loss, corruption, inconsistency)
- **BUS**: Business Impact (UX harm, logic errors, revenue)
- **OPS**: Operations (deployment, config, monitoring)

---

## Entry Criteria

- [ ] Stories 1.1 and 1.2 are marked `done` in sprint-status.yaml ✅ (already done)
- [ ] Story under test is deployed to local dev environment (`npm run dev`)
- [ ] Playwright test environment configured (`playwright.config.ts` present ✅)
- [ ] Test factories and page objects available (`tests/support/` ✅)
- [ ] IndexedDB accessible in test browser context (Chromium via Playwright)
- [ ] `data-testid` attributes added to board/task components per story acceptance criteria

## Exit Criteria

- [ ] All P0 tests passing (100% pass rate)
- [ ] All P1 tests passing or failures triaged with documented waivers
- [ ] No open DATA or TECH risks with score ≥6 unmitigated
- [ ] Performance smoke test: board loads in ≤3s with 1000 tasks
- [ ] Data persistence verified: tasks/columns survive page reload
- [ ] No telemetry calls detected in network traffic (FR36/NFR5/NFR6)

---

## Test Coverage Plan

### P0 (Critical) — Run on every commit

**Criteria**: Blocks core journey + High risk (≥6) + No workaround

| ID | Requirement / Scenario | Test Level | Risk Link | Test Count | Notes |
| -- | ---------------------- | ---------- | --------- | ---------- | ----- |
| 1.3-E2E-001 | Board renders with default columns (Backlog, In Progress, Review, Done) | E2E | — | 1 | FR1; existing skeleton in kanban-board.spec.ts |
| 1.3-E2E-002 | Tasks persist in IndexedDB across page reload | E2E | R-001 | 2 | FR35; seed → reload → assert |
| 1.3-E2E-003 | No data sent to external servers (network monitor) | E2E | — | 1 | FR36/NFR5/NFR6; intercept all outbound requests |
| 1.3-UNIT-001 | Dexie schema migration preserves existing data | Unit | R-001 | 3 | Dexie version bump test |
| 1.4-E2E-001 | Task cards display in correct columns after seed | E2E | — | 1 | FR1; existing skeleton in kanban-board.spec.ts |
| 1.4-E2E-002 | Add new column — appears on board and persists after reload | E2E | — | 1 | FR2 |
| 1.4-E2E-003 | Delete column with tasks — confirmation dialog shown | E2E | R-007 | 1 | BUS risk |
| 1.5-E2E-001 | Create task with all fields (title, description, due date, priority, tags) | E2E | — | 1 | FR4 |
| 1.5-E2E-002 | Task creation rejected if title is empty (Zod validation) | E2E | R-004 | 1 | DATA risk |
| 1.5-UNIT-001 | Zod task schema rejects invalid data (missing title, invalid priority) | Unit | R-004 | 4 | All invalid permutations |
| 1.6-E2E-001 | Drag task between columns — task moves and persists after reload | E2E | R-002 | 2 | FR5; drag + reload |
| 1.6-E2E-002 | Column order persists after drag-and-drop reorder + reload | E2E | R-002 | 1 | FR2; state sync risk |
| 1.7-E2E-001 | Quick-add task (title only) creates task in selected column | E2E | — | 1 | FR8 |
| 1.7-E2E-002 | Subtask created and marked complete | E2E | — | 1 | FR7 |

**Total P0**: 14 tests, ~28–42 hours

### P1 (High) — Run on PR to main

**Criteria**: Important features + Medium risk (3–5) + Common workflows

| ID | Requirement / Scenario | Test Level | Risk Link | Test Count | Notes |
| -- | ---------------------- | ---------- | --------- | ---------- | ----- |
| 1.3-E2E-004 | Navigation between Board, Revenue (placeholder), Settings (placeholder) | E2E | R-006 | 3 | FR; existing navigation.spec.ts |
| 1.3-E2E-005 | Auto-save: edit task → close tab → reopen → assert changes persisted | E2E | R-009 | 1 | NFR12 |
| 1.4-E2E-004 | Rename column inline — new name persists | E2E | — | 1 | FR3 |
| 1.4-E2E-005 | Delete custom column (empty) — removed from board | E2E | — | 1 | FR2 |
| 1.4-E2E-006 | Column shows task count badge | E2E | — | 1 | UX spec |
| 1.4-E2E-007 | Empty column shows "Add task" CTA | E2E | — | 1 | UX spec |
| 1.5-E2E-003 | Edit existing task fields — changes auto-save | E2E | R-009 | 1 | NFR12 |
| 1.5-E2E-004 | Task card displays correct priority badge and due date | E2E | — | 1 | FR4 |
| 1.5-E2E-005 | Task with tags — tags displayed on card | E2E | — | 1 | FR4 |
| 1.5-UNIT-002 | Zod task schema accepts valid data (all field combinations) | Unit | R-004 | 4 | Positive cases |
| 1.6-E2E-003 | Reorder tasks within a column via drag-and-drop | E2E | — | 1 | FR6 |
| 1.6-E2E-004 | Keyboard drag-and-drop (NFR9) — task moves via keyboard | E2E | — | 1 | NFR9 |
| 1.7-E2E-003 | Quick-add expands to full task form | E2E | — | 1 | FR8 |
| 1.7-E2E-004 | Subtask list shows completion progress | E2E | — | 1 | FR7 |
| 1.2-E2E-001 | PWA service worker registered and app installable | E2E | R-005 | 1 | NFR15 |
| 1.2-E2E-002 | Path alias `@/` resolves correctly in production build | Integration | R-010 | 1 | TECH risk |
| 1.3-UNIT-002 | Auto-save debounce — rapid edits trigger single DB write | Unit | R-009 | 2 | DATA race condition |
| 1.4-E2E-008 | Column reorder persists after page reload | E2E | R-002 | 1 | FR2 persistence |

**Total P1**: 18 tests, ~18–36 hours

### P2 (Medium) — Run nightly

**Criteria**: Secondary flows + Low risk (1–2) + Edge cases

| ID | Requirement / Scenario | Test Level | Risk Link | Test Count | Notes |
| -- | ---------------------- | ---------- | --------- | ---------- | ----- |
| 1.4-E2E-009 | Custom column persists after page reload | E2E | — | 1 | Existing skeleton in kanban-board.spec.ts |
| 1.5-E2E-006 | Task with all optional fields empty — creates successfully | E2E | — | 1 | Edge case |
| 1.5-E2E-007 | Task description with special characters (markdown, emoji) | E2E | — | 1 | Data integrity |
| 1.5-E2E-008 | Tags with spaces and special characters | E2E | — | 1 | Data integrity |
| 1.6-E2E-005 | Drop target visual highlight during drag | E2E | — | 1 | UX spec |
| 1.6-E2E-006 | Touch drag-and-drop (mobile viewport) | E2E | — | 1 | NFR; mobile touch |
| 1.7-E2E-005 | Multiple subtasks — reorder subtasks | E2E | — | 1 | FR7 |
| 1.3-E2E-006 | App loads within 3 seconds (NFR1) | E2E | R-003 | 1 | Performance |
| 1.3-E2E-007 | Board with 1000 tasks — no visible jank | E2E | R-003 | 1 | NFR3 |
| 1.4-E2E-010 | Cannot delete last remaining column | E2E | — | 1 | Guard rail |

**Total P2**: 10 tests, ~5–15 hours

### P3 (Low) — Run on-demand / full regression

**Criteria**: Nice-to-have + Exploratory + Performance benchmarks

| ID | Requirement / Scenario | Test Level | Test Count | Notes |
| -- | ---------------------- | ---------- | ---------- | ----- |
| 1.6-PERF-001 | Drag-and-drop maintains 60fps (NFR2) — performance profiling | E2E | 1 | Use browser perf API |
| 1.3-E2E-008 | App works offline after initial load (PWA/NFR15) | E2E | 1 | Intercept network, reload |
| 1.4-E2E-011 | Column rename via keyboard only | E2E | 1 | NFR9 extended |
| 1.5-E2E-009 | Vercel deployment — direct URL access returns 200 (not 404) | E2E | 1 | R-011 OPS risk |

**Total P3**: 4 tests, ~2–5 hours

---

## Execution Order

### Smoke Tests (<5 min)

**Purpose**: Fast feedback, catch build-breaking issues

- [ ] Board renders with default columns (1.3-E2E-001) — ~30s
- [ ] Navigation between routes works (1.3-E2E-004) — ~45s
- [ ] Create task with title — appears on board (1.5-E2E-001 smoke) — ~45s

**Total**: 3 scenarios

### P0 Tests (<15 min)

**Purpose**: Critical path validation — data integrity, core CRUD, persistence

- [ ] 1.3-UNIT-001: Dexie schema migration (Unit)
- [ ] 1.5-UNIT-001: Zod validation rejects invalid data (Unit)
- [ ] 1.3-E2E-002: Tasks persist across reload (E2E)
- [ ] 1.3-E2E-003: No external network calls (E2E)
- [ ] 1.4-E2E-001: Task cards in correct columns (E2E)
- [ ] 1.4-E2E-002: Add column + persist (E2E)
- [ ] 1.4-E2E-003: Column delete confirmation (E2E)
- [ ] 1.5-E2E-001: Create task with all fields (E2E)
- [ ] 1.5-E2E-002: Zod rejects empty title (E2E)
- [ ] 1.6-E2E-001: Drag task between columns + persist (E2E)
- [ ] 1.6-E2E-002: Column order persists after drag (E2E)
- [ ] 1.7-E2E-001: Quick-add task (E2E)
- [ ] 1.7-E2E-002: Subtask create + complete (E2E)

**Total**: 13 scenarios

### P1 Tests (<30 min)

**Purpose**: Important feature coverage — column management, task editing, PWA

- [ ] 1.3-E2E-005: Auto-save persists (E2E)
- [ ] 1.4-E2E-004: Rename column (E2E)
- [ ] 1.4-E2E-005: Delete empty column (E2E)
- [ ] 1.5-E2E-003: Edit task auto-save (E2E)
- [ ] 1.5-UNIT-002: Zod accepts valid data (Unit)
- [ ] 1.6-E2E-003: Reorder tasks within column (E2E)
- [ ] 1.6-E2E-004: Keyboard drag-and-drop (E2E)
- [ ] 1.2-E2E-001: PWA installable (E2E)
- [ ] 1.3-UNIT-002: Auto-save debounce (Unit)
- [ ] 1.4-E2E-008: Column reorder persists (E2E)

**Total**: 10 scenarios

### P2/P3 Tests (<60 min)

**Purpose**: Full regression coverage — edge cases, performance, offline

- [ ] All P2 scenarios (10 tests)
- [ ] All P3 scenarios (4 tests)

**Total**: 14 scenarios

---

## Resource Estimates

### Test Development Effort

| Priority | Count | Hours/Test | Total Hours | Notes |
| -------- | ----- | ---------- | ----------- | ----- |
| P0 | 14 | 2–3 | ~28–42 | Complex setup: Dexie seeding, drag simulation, network intercept |
| P1 | 18 | 1–2 | ~18–36 | Standard coverage; some unit tests are fast |
| P2 | 10 | 0.5–1.5 | ~5–15 | Edge cases; some reuse P0/P1 setup |
| P3 | 4 | 0.5–1.25 | ~2–5 | Exploratory; perf profiling |
| **Total** | **46** | **—** | **~53–98 hours** | **~7–12 days** |

### Prerequisites

**Test Data:**

- `createTask()` factory — faker-based, all fields, auto-cleanup ✅ (exists in `tests/support/factories.ts`)
- `createInProgressTask()`, `createCompletedTask()`, `createOverdueTask()`, `createUrgentTask()` ✅ (exist)
- `seedTasks()`, `clearAppData()`, `getTasksFromStorage()` helpers ✅ (exist in `tests/support/helpers/local-storage.ts`)
- `BoardPage` page object ✅ (exists in `tests/support/page-objects/board-page.ts`)
- `TaskFormPage` page object ✅ (exists in `tests/support/page-objects/task-form-page.ts`)
- **Missing**: `createColumn()` factory for column seeding
- **Missing**: `seedColumns()` helper for IndexedDB column seeding
- **Missing**: `DragHelper` utility for @dnd-kit drag simulation in Playwright

**Tooling:**

- Playwright (configured ✅) — E2E browser automation
- Vitest — unit tests for Zod schemas and utility functions
- `@playwright/test` network interception — for FR36/NFR5 telemetry checks
- `page.evaluate()` — for IndexedDB direct access in tests

**Environment:**

- Local dev server (`npm run dev`) on `localhost:5173`
- Playwright Chromium (primary), Firefox and Safari (P2/P3)
- IndexedDB available in Playwright browser context

---

## Quality Gate Criteria

### Pass/Fail Thresholds

- **P0 pass rate**: 100% (no exceptions — blocks merge)
- **P1 pass rate**: ≥95% (waivers require documented justification)
- **P2/P3 pass rate**: ≥90% (informational; does not block release)
- **High-risk mitigations (R-001 to R-005)**: 100% complete or approved waivers before Epic 1 sign-off

### Coverage Targets

- **Data persistence paths**: 100% (FR35 is non-negotiable)
- **Zod validation paths**: 100% (R-004 DATA risk)
- **Core CRUD (create/read/update/delete tasks)**: ≥90%
- **Drag-and-drop persistence**: ≥80%
- **Edge cases (empty states, special chars)**: ≥60%

### Non-Negotiable Requirements

- [ ] All P0 tests pass before any story is merged to main
- [ ] R-001 (Dexie migration) mitigated before Story 1.3 merge
- [ ] R-004 (Zod bypass) mitigated before Story 1.5 merge
- [ ] R-002 (dnd-kit state desync) mitigated before Story 1.6 merge
- [ ] No outbound network calls detected (FR36 / NFR5 / NFR6)

---

## Mitigation Plans

### R-001: IndexedDB Data Loss on Schema Migration (Score: 6)

**Mitigation Strategy:** Write explicit Dexie version migration tests that seed data at version N, upgrade to version N+1, and assert all existing records are preserved. Use `dexie-export-import` or `page.evaluate()` to read IndexedDB directly in tests.

**Owner:** Dev (Story 1.3)
**Timeline:** Before Story 1.3 merge
**Status:** Planned
**Verification:** `1.3-UNIT-001` passes; manual smoke test of DB upgrade path

---

### R-002: @dnd-kit State Desync (Score: 6)

**Mitigation Strategy:** After every drag-and-drop action in E2E tests, reload the page and assert the new column/task order matches what was dragged. Add error boundary around Dexie writes to surface silent failures.

**Owner:** Dev (Story 1.6)
**Timeline:** Before Story 1.6 merge
**Status:** Planned
**Verification:** `1.6-E2E-001` and `1.6-E2E-002` pass

---

### R-003: 1000+ Tasks Performance (Score: 6)

**Mitigation Strategy:** Add a P2 E2E test that seeds 1000 tasks via `seedTasks()`, loads the board, and asserts: (a) load time ≤3s (NFR1), (b) no visible jank during scroll. Use `page.evaluate(() => performance.now())` for timing.

**Owner:** Dev (Epic 1 sign-off)
**Timeline:** Before Epic 1 retrospective
**Status:** Planned
**Verification:** `1.3-E2E-007` and `1.3-E2E-008` pass

---

### R-004: Zod Validation Bypass (Score: 6)

**Mitigation Strategy:** Unit test all Zod schemas for task and column models (valid + invalid permutations). Add E2E test that attempts to submit a task form with empty title and asserts validation error is shown without DB write.

**Owner:** Dev (Story 1.5)
**Timeline:** Before Story 1.5 merge
**Status:** Planned
**Verification:** `1.5-UNIT-001` and `1.5-E2E-002` pass

---

### R-005: PWA Service Worker Stale Cache (Score: 6)

**Mitigation Strategy:** Test that after a simulated app update (new build hash), the service worker prompts for refresh or auto-updates. Verify `vite-plugin-pwa` `skipWaiting` behavior. Add E2E test that loads app, simulates SW update, and asserts new content is served.

**Owner:** Dev (Story 1.2)
**Timeline:** Before Story 1.2 sign-off
**Status:** Planned
**Verification:** `1.2-E2E-001` passes; manual install test on Chrome

---

## Assumptions and Dependencies

### Assumptions

1. Stories 1.1 and 1.2 are complete and the dev environment runs without errors.
2. `data-testid` attributes will be added to all interactive elements per the story acceptance criteria before E2E tests are activated.
3. The `BoardPage` and `TaskFormPage` page objects will be updated to match actual implementation selectors.
4. Dexie.js is used for IndexedDB persistence (as per Architecture); no localStorage fallback for task/column data.
5. @dnd-kit is the drag-and-drop library; Playwright's `dragTo()` or `mouse.move()` will be used for simulation.

### Dependencies

1. `data-testid` attributes on board/column/task components — Required before activating skipped E2E tests (Stories 1.3–1.7)
2. `createColumn()` factory and `seedColumns()` helper — Required before column-related P0/P1 tests (Story 1.4)
3. `DragHelper` utility for @dnd-kit simulation — Required before drag-and-drop P0 tests (Story 1.6)
4. Vitest configured for unit tests — Required before Zod unit tests (Story 1.5)

### Risks to Plan

- **Risk**: `data-testid` attributes not added during implementation
  - **Impact**: All E2E tests remain skipped; P0 coverage gap
  - **Contingency**: Add `data-testid` as explicit acceptance criterion in each story's DoD

- **Risk**: @dnd-kit drag simulation is unreliable in Playwright headless mode
  - **Impact**: Drag-and-drop E2E tests (R-002) may be flaky
  - **Contingency**: Use `page.evaluate()` to directly call @dnd-kit's programmatic API, or test drag via keyboard (which is more reliable)

---

## Existing Test Coverage Analysis

### What Already Exists

| File | Coverage | Status |
| ---- | -------- | ------ |
| `tests/e2e/app-shell.spec.ts` | App shell renders, heading visible | Active (passing) |
| `tests/e2e/navigation.spec.ts` | Route navigation (Board/Revenue/Settings) | Active (passing) |
| `tests/e2e/task-management.spec.ts` | Data layer: localStorage seeding, factory validation | Active (passing) |
| `tests/e2e/kanban-board.spec.ts` | Board columns, task cards, column CRUD | **Skipped** (pending 1.4 implementation) |
| `tests/e2e/task-crud.spec.ts` | Task CRUD operations | Needs review |
| `tests/support/page-objects/board-page.ts` | BoardPage POM | Ready |
| `tests/support/page-objects/task-form-page.ts` | TaskFormPage POM | Ready |

### Coverage Gaps (Must Fill)

1. **No Dexie/IndexedDB persistence tests** — current tests use `localStorage` helpers; need IndexedDB-aware helpers for Dexie
2. **No Zod validation unit tests** — R-004 risk unmitigated
3. **No drag-and-drop tests** — R-002 risk unmitigated
4. **No performance tests** — R-003 risk unmitigated
5. **No telemetry/network-intercept test** — FR36/NFR5/NFR6 unverified

---

## Interworking & Regression

| Service/Component | Impact | Regression Scope |
| ----------------- | ------ | ---------------- |
| **Dexie.js (IndexedDB)** | Core persistence layer; all task/column data | All P0 data persistence tests must pass |
| **React Router** | Navigation between Board/Revenue/Settings | `navigation.spec.ts` must pass |
| **@dnd-kit** | Drag-and-drop for tasks and columns | Drag E2E tests must pass before 1.6 merge |
| **vite-plugin-pwa** | Service worker, offline capability | PWA E2E test must pass; SW must not break on update |
| **Zod** | Data validation before every DB write | All Zod unit tests must pass before 1.5 merge |
| **shadcn/ui + Tailwind** | UI components and styling | App shell tests must pass; no visual regression |

---

## Follow-on Workflows (Manual)

- Run `*atdd` to generate failing P0 tests for Stories 1.3–1.7 (separate workflow; not auto-run).
- Run `*automate` for broader coverage once each story is implemented.
- Run `*trace` after Epic 1 completion to validate requirement-to-test traceability.

---

## Approval

**Test Design Approved By:**

- [ ] Product Manager: Marlon — Date: ___
- [ ] Tech Lead: ___ — Date: ___
- [ ] QA Lead: ___ — Date: ___

**Comments:**

---

## Appendix

### Knowledge Base References

- `risk-governance.md` — Risk classification framework (probability × impact, gate decisions)
- `probability-impact.md` — Risk scoring methodology (1–9 scale, DOCUMENT/MONITOR/MITIGATE/BLOCK)
- `test-levels-framework.md` — Test level selection (Unit/Integration/E2E decision matrix)
- `test-priorities-matrix.md` — P0–P3 prioritization (revenue, security, user impact)

### Related Documents

- PRD: `_bmad-output/planning-artifacts/prd.md`
- Epic 1: `_bmad-output/planning-artifacts/epics.md` (Epic 1 section)
- Architecture: `_bmad-output/planning-artifacts/architecture.md`
- Sprint Status: `_bmad-output/implementation-artifacts/sprint-status.yaml`
- Automation Summary: `_bmad-output/test-artifacts/automation-summary.md`

---

**Generated by**: BMad TEA Agent - Test Architect Module
**Workflow**: `_bmad/tea/testarch/test-design`
**Version**: 5.0 (Step-File Architecture)
**Mode**: Epic-Level (Phase 4)
