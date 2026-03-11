---
stepsCompleted: [1, 2, 3, 4, 5, 6, 7, 8]
inputDocuments: ['_bmad-output/planning-artifacts/prd.md', '_bmad-output/planning-artifacts/ux-design-specification.md']
workflowType: 'architecture'
project_name: 'bmad-freelancer-tracking-demo-application-v6'
user_name: 'Marlon'
date: '2026-03-11'
lastStep: 8
status: 'complete'
completedAt: '2026-03-11'
---

# Architecture Decision Document

_This document builds collaboratively through step-by-step discovery. Sections are appended as we work through each architectural decision together._

## Project Context Analysis

### Requirements Overview

**Functional Requirements:**
36 FRs across 8 categories. Core capabilities: kanban board with customizable columns and drag-and-drop; task cards with embedded timer (start/stop, manual entry, editing); client and project management with inline creation; billable toggle and hourly rates at task/client/project level; revenue dashboard with daily/weekly/monthly summaries; task detail side panel; search and filter; data export (CSV/JSON), backup/restore; onboarding wizard; settings (dark mode, defaults). All data stored locally; no telemetry.

**Non-Functional Requirements:**
- **Performance:** Launch < 3s, 60fps animations, 1000+ tasks without slowdown, timer updates every second.
- **Security & Privacy:** Local-only storage, no telemetry, optional encryption (post-MVP).
- **Accessibility:** WCAG 2.1 AA, keyboard navigation, shortcuts, tooltips.
- **Reliability:** Auto-save, no data loss, crash recovery, offline PWA.
- **Usability:** No formal training required, clear hierarchy, intuitive interactions.

**Scale & Complexity:**
- Primary domain: Web (SPA/PWA)
- Complexity level: Low
- Estimated architectural components: Kanban board, task management, timer service, client/project store, revenue aggregation, export/backup, onboarding flow, settings/preferences

### Technical Constraints & Dependencies

- **Stack:** React, Vite, TypeScript, IndexedDB (e.g. Dexie.js)
- **No backend:** All data in browser; static hosting (Vercel, Netlify, GitHub Pages)
- **Timer:** setInterval/requestAnimationFrame; Web/Service Workers for background accuracy when tab inactive
- **State:** React Context for tasks, timer, clients, projects
- **Build:** Vite, ESLint, Prettier
- **Browsers:** Chrome, Firefox, Safari, Edge (last 2 versions)
- **Responsive:** Desktop-first 1024px+; adapts to 768px+

### Cross-Cutting Concerns Identified

- **Timer accuracy:** Background operation when tab inactive; Web/Service Workers; document drift behavior
- **State management:** Shared state for tasks, timer, clients, projects; sync with IndexedDB
- **Performance at scale:** Virtual scrolling for large boards; React.memo/useMemo; lazy loading for side panels
- **Accessibility:** WCAG 2.1 AA across all components; keyboard, focus, screen reader, reduced motion
- **Offline/PWA:** Service worker, caching, data persistence
- **Auto-save:** No manual save; persistence on change with crash recovery

## Starter Template Evaluation

### Primary Technology Domain

Web application (SPA/PWA) based on project requirements analysis—React + Vite + TypeScript, local-first, no backend.

### Starter Options Considered

| Starter | Pros | Cons |
|---------|------|------|
| **Official Vite `react-ts`** | Official, maintained, minimal, aligns with PRD stack | PWA, Tailwind, shadcn added separately |
| **PWA-Vite-React-Boilerplate** | PWA preconfigured | Third-party, may have outdated dependencies |
| **react-ts-webapp-template-2025** | Tailwind, conventions | Yarn 4, opinionated, less standard |
| **vite-react-pwa-cypress** | PWA + Cypress | Third-party, may lag updates |

**Recommendation:** Official Vite `react-ts` template. It aligns with PRD stack, is minimal and well-maintained, and allows controlled addition of PWA, Tailwind, and shadcn. Third-party starters risk outdated or conflicting configurations.

### Selected Starter: Vite `react-ts` (Official)

**Rationale for Selection:**
- Matches PRD stack: React, Vite, TypeScript
- Official, actively maintained
- Minimal base; PWA, Tailwind, shadcn, Dexie added in implementation
- Clear separation of concerns and predictable structure

**Initialization Command:**

```bash
npm create vite@latest . -- --template react-ts
```

*(Use `.` for current directory, or replace with project name for a subfolder.)*

**Architectural Decisions Provided by Starter:**

**Language & Runtime:**
- TypeScript with strict mode
- ES modules
- React 18+ with JSX transform

**Styling Solution:**
- Plain CSS by default; Tailwind and shadcn added per UX spec

**Build Tooling:**
- Vite 6.x
- Rollup for production builds
- Fast HMR

**Testing Framework:**
- None by default; Vitest or similar added in implementation

**Code Organization:**
- `src/` with `main.tsx`, `App.tsx`, `index.css`
- `public/` for static assets
- `vite-env.d.ts` for Vite types

**Development Experience:**
- `npm run dev` for dev server
- `npm run build` for production
- `npm run preview` for preview build

**Note:** Project initialization using this command should be the first implementation story. Subsequent stories add: `vite-plugin-pwa`, Tailwind CSS, shadcn/ui, Dexie.js, and path aliases (`@/`).

## Core Architectural Decisions

### Decision Priority Analysis

**Critical Decisions (Block Implementation):**
- Dexie.js for IndexedDB persistence
- React Context for state management
- @dnd-kit for kanban drag-and-drop
- React Router for navigation
- Zod for data validation

**Important Decisions (Shape Architecture):**
- Tailwind + shadcn/ui (UX spec)
- vite-plugin-pwa for offline
- Path aliases (@/)

**Deferred Decisions (Post-MVP):**
- Optional encryption (NFR7)
- CI/CD pipeline details
- Advanced analytics (Phase 2)

### Data Architecture

| Decision | Choice | Version | Rationale |
|----------|--------|---------|-----------|
| Local database | Dexie.js | 4.x | IndexedDB wrapper with TypeScript, migrations, live queries; PRD-specified |
| Data validation | Zod | 4.x | TypeScript-first, runtime validation for forms and persisted data |
| Schema migrations | Dexie versioning | — | Built-in; supports schema evolution |

### Authentication & Security

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Authentication | None | Local-only app; no user accounts |
| Data storage | IndexedDB (browser) | PRD; no server; no telemetry |
| Encryption | Post-MVP | NFR7 deferred to Phase 3 |

### API & Communication Patterns

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Backend API | None | Local-first; no server |
| Error handling | Error boundaries + user feedback | Graceful failures; no telemetry |
| Inter-component | React Context, props | In-app communication |

### Frontend Architecture

| Decision | Choice | Version | Rationale |
|----------|--------|---------|-----------|
| State management | React Context | — | PRD; tasks, timer, clients, projects |
| Drag-and-drop | @dnd-kit | Latest | Kanban; accessibility, keyboard, touch |
| Routing | React Router | 7.x | Board \| Dashboard \| Settings |
| Styling | Tailwind + shadcn/ui | — | UX spec |
| Performance | Virtual scroll, memo, lazy load | — | NFR3 (1000+ tasks) |

### Infrastructure & Deployment

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Hosting | **Vercel** | Static hosting for SPA/PWA; simple deploys; Vite support |
| CI/CD | Deferred | Build + deploy; details later |
| Monitoring | None | No telemetry per PRD |

### Decision Impact Analysis

**Implementation Sequence:**
1. Vite react-ts init
2. Add Tailwind, shadcn, path aliases
3. Add vite-plugin-pwa
4. Add Dexie.js, define schema
5. Add React Router, base layout
6. Add @dnd-kit, kanban structure
7. Add React Context, state wiring
8. Add Zod, validation layer

**Cross-Component Dependencies:**
- Dexie schema → Context providers (tasks, clients, projects)
- Timer state → TaskCard, RevenueDashboard
- @dnd-kit → KanbanColumn, TaskCard
- React Router → Layout, navigation

## Implementation Patterns & Consistency Rules

### Pattern Categories Defined

**Critical Conflict Points Identified:**
6 areas where AI agents could make different choices without explicit rules

### Naming Patterns

**Database Naming Conventions (Dexie/IndexedDB):**
- Store names: camelCase, plural (e.g. `tasks`, `clients`, `projects`, `timeEntries`, `columns`)
- Field names: camelCase (e.g. `taskId`, `clientId`, `hourlyRate`, `createdAt`)
- Primary key: `id` (string UUID or auto-increment)
- Foreign keys: `{entity}Id` (e.g. `clientId`, `projectId`, `columnId`)
- Index names: `by{Field}` or `idx_{store}_{field}` (e.g. `byClientId`, `byProjectId`)

**Code Naming Conventions:**
- Components: PascalCase (e.g. `TaskCard`, `KanbanColumn`, `TimerButton`)
- Files: PascalCase for components (`TaskCard.tsx`), camelCase for utilities (`formatCurrency.ts`)
- Hooks: camelCase with `use` prefix (e.g. `useTimer`, `useTasks`)
- Context providers: PascalCase with `Provider` suffix (e.g. `TasksProvider`, `TimerProvider`)
- Functions/variables: camelCase
- Constants: UPPER_SNAKE_CASE for true constants
- Types/interfaces: PascalCase (e.g. `Task`, `Client`, `TimeEntry`)

### Structure Patterns

**Project Organization:**
- Components: `src/components/` — feature subfolders (e.g. `kanban/`, `timer/`, `revenue/`)
- Shared components: `src/components/ui/` (shadcn) and `src/components/common/`
- Hooks: `src/hooks/`
- Context: `src/contexts/`
- Services: `src/services/` (Dexie DB, timer logic)
- Utils: `src/utils/`
- Types: `src/types/` or co-located
- Routes: `src/routes/` or route config in `src/`
- Tests: co-located `*.test.ts(x)` next to source, or `src/__tests__/` per feature

**File Structure Patterns:**
- One component per file; export default for page/route components
- Barrel exports (`index.ts`) for feature folders when useful
- Config: `vite.config.ts`, `tailwind.config.js` at root
- Env: `.env`, `.env.local` (gitignored)

### Format Patterns

**Data Exchange Formats (IndexedDB, JSON export/backup):**
- JSON field naming: camelCase (matches TypeScript/React)
- Dates: ISO 8601 strings (e.g. `2026-03-11T14:30:00.000Z`)
- Booleans: `true`/`false`
- Null: use `null` for missing; avoid `undefined` in persisted data
- Decimals: numbers for currency; store cents or use precise rounding for display

**Export/Backup Formats:**
- CSV: headers as camelCase; dates as ISO string
- JSON backup: full app state; schema version included

### Communication Patterns

**State Management Patterns:**
- Updates: immutable; use spread/copy, never mutate
- Context actions: `{verb}{Entity}` (e.g. `addTask`, `updateTask`, `deleteTask`, `startTimer`, `stopTimer`)
- State shape: flat where possible; avoid deep nesting
- Persistence: sync to Dexie on change; no manual save

**Event Patterns:**
- No global event bus; use Context + callbacks
- Timer events: `onStart`, `onStop`, `onTick` (callback props)

### Process Patterns

**Error Handling Patterns:**
- React Error Boundaries for component tree failures
- User-facing: short, actionable messages (e.g. "Could not save task. Try again.")
- No silent failures for user actions
- Log to console in dev; no telemetry in prod
- Validation errors: inline, next to field; use Zod for schema

**Loading State Patterns:**
- Naming: `isLoading`, `isSaving`, `isInitializing`
- Global: app init, DB open
- Local: per component or feature (e.g. `isTaskPanelOpen`)
- UI: Skeleton for lists; spinner for buttons/actions when appropriate
- Avoid: blocking full-page loader for non-critical ops

### Enforcement Guidelines

**All AI Agents MUST:**
- Use camelCase for Dexie stores, fields, and JSON
- Use PascalCase for React components and files
- Place new components in the correct feature folder
- Use immutable updates for state
- Validate user input with Zod before persistence
- Use `@/` path alias for imports (e.g. `@/components/kanban/TaskCard`)

**Pattern Enforcement:**
- ESLint + TypeScript for naming and structure
- Code review checklist references this architecture
- Update this document when patterns change

### Pattern Examples

**Good Examples:**
```ts
// Store: tasks, clients
// Field: taskId, clientId, hourlyRate
// Component: TaskCard.tsx
// Hook: useTimer()
// Action: addTask, updateTask
// Import: import { TaskCard } from '@/components/kanban/TaskCard'
```

**Anti-Patterns:**
- `task_id`, `user_id` (snake_case in DB)
- `task-card.tsx` (kebab-case for components)
- `Tasks` or `Task` for store names (use plural camelCase)
- Direct mutation: `task.completed = true` (use immutable update)
- `get_user_data` (use camelCase for functions)

## Project Structure & Boundaries

### Complete Project Directory Structure

```
bmad-freelancer-tracking-demo-application-v6/
├── README.md
├── package.json
├── package-lock.json
├── vite.config.ts
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.node.json
├── tailwind.config.js
├── postcss.config.js
├── components.json                    # shadcn/ui config
├── .env.example
├── .env.local                         # gitignored
├── .gitignore
├── vercel.json                        # Vercel deployment config
├── public/
│   ├── favicon.ico
│   ├── manifest.json                 # PWA manifest
│   └── icons/                        # PWA icons
├── src/
│   ├── main.tsx
│   ├── App.tsx
│   ├── index.css
│   ├── vite-env.d.ts
│   ├── components/
│   │   ├── ui/                       # shadcn components
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── input.tsx
│   │   │   ├── sheet.tsx
│   │   │   ├── badge.tsx
│   │   │   ├── skeleton.tsx
│   │   │   └── ...
│   │   ├── common/
│   │   │   ├── Layout.tsx
│   │   │   ├── NavTabs.tsx
│   │   │   └── ErrorBoundary.tsx
│   │   ├── kanban/
│   │   │   ├── KanbanBoard.tsx
│   │   │   ├── KanbanColumn.tsx
│   │   │   ├── TaskCard.tsx
│   │   │   ├── TaskCard.tsx.test.tsx
│   │   │   ├── AddTaskButton.tsx
│   │   │   └── index.ts
│   │   ├── timer/
│   │   │   ├── TimerButton.tsx
│   │   │   ├── TimerButton.tsx.test.tsx
│   │   │   ├── TimeDisplay.tsx
│   │   │   └── index.ts
│   │   ├── task-detail/
│   │   │   ├── TaskDetailPanel.tsx
│   │   │   ├── TaskForm.tsx
│   │   │   ├── TimeEntriesList.tsx
│   │   │   ├── AddTimeForm.tsx
│   │   │   └── index.ts
│   │   ├── revenue/
│   │   │   ├── RevenueDashboard.tsx
│   │   │   ├── RevenueSummary.tsx
│   │   │   ├── ClientBreakdown.tsx
│   │   │   └── index.ts
│   │   ├── onboarding/
│   │   │   ├── OnboardingWizard.tsx
│   │   │   ├── OnboardingStep.tsx
│   │   │   └── index.ts
│   │   ├── settings/
│   │   │   ├── SettingsPanel.tsx
│   │   │   ├── ExportModal.tsx
│   │   │   ├── BackupRestore.tsx
│   │   │   ├── DarkModeToggle.tsx
│   │   │   └── index.ts
│   │   └── clients/
│   │       ├── ClientSelect.tsx
│   │       ├── ProjectSelect.tsx
│   │       ├── InlineClientForm.tsx
│   │       └── index.ts
│   ├── contexts/
│   │   ├── TasksProvider.tsx
│   │   ├── TimerProvider.tsx
│   │   ├── ClientsProvider.tsx
│   │   ├── ProjectsProvider.tsx
│   │   ├── SettingsProvider.tsx
│   │   └── index.ts
│   ├── hooks/
│   │   ├── useTimer.ts
│   │   ├── useTasks.ts
│   │   ├── useClients.ts
│   │   ├── useProjects.ts
│   │   └── useOnboarding.ts
│   ├── services/
│   │   ├── db.ts                     # Dexie instance & schema
│   │   ├── timerService.ts          # Web Worker / background timer
│   │   ├── exportService.ts
│   │   └── backupService.ts
│   ├── utils/
│   │   ├── formatCurrency.ts
│   │   ├── formatDuration.ts
│   │   ├── formatDate.ts
│   │   └── cn.ts                    # Tailwind merge
│   ├── types/
│   │   ├── task.ts
│   │   ├── client.ts
│   │   ├── project.ts
│   │   ├── timeEntry.ts
│   │   ├── column.ts
│   │   └── index.ts
│   ├── routes/
│   │   ├── AppRoutes.tsx
│   │   ├── BoardPage.tsx
│   │   ├── RevenuePage.tsx
│   │   ├── SettingsPage.tsx
│   │   └── index.ts
│   └── lib/
│       └── utils.ts                  # shadcn utils
└── _bmad-output/                    # planning artifacts (existing)
```

### Architectural Boundaries

**API Boundaries:**
- No API; local-only; no external endpoints

**Component Boundaries:**
- **Pages:** `BoardPage`, `RevenuePage`, `SettingsPage` — route-level containers
- **Features:** `kanban/`, `timer/`, `revenue/`, `task-detail/`, `onboarding/`, `settings/` — each owns its UI and logic
- **Shared:** `ui/` (shadcn), `common/` — used across features
- **Communication:** Context providers + props; no shared event bus

**Service Boundaries:**
- `db.ts` — Dexie access; single source for persistence
- `timerService.ts` — timer logic; Web Worker for background
- `exportService.ts` — CSV/JSON export
- `backupService.ts` — backup/restore

**Data Boundaries:**
- Dexie stores: `tasks`, `clients`, `projects`, `timeEntries`, `columns`, `settings`
- Context providers consume from Dexie; components consume from Context
- No direct Dexie access in components

### Requirements to Structure Mapping

**Epic 1: Foundation & Core Kanban**
- `src/components/kanban/` — KanbanBoard, KanbanColumn, TaskCard, AddTaskButton
- `src/contexts/TasksProvider.tsx`
- `src/services/db.ts` (tasks, columns)
- `src/types/task.ts`, `column.ts`

**Epic 2: Time Tracking**
- `src/components/timer/` — TimerButton, TimeDisplay
- `src/components/task-detail/` — TimeEntriesList, AddTimeForm
- `src/contexts/TimerProvider.tsx`
- `src/services/timerService.ts`
- `src/hooks/useTimer.ts`

**Epic 3: Client/Project & Revenue**
- `src/components/clients/` — ClientSelect, ProjectSelect, InlineClientForm
- `src/components/revenue/` — RevenueDashboard, RevenueSummary, ClientBreakdown
- `src/contexts/ClientsProvider.tsx`, `ProjectsProvider.tsx`
- `src/types/client.ts`, `project.ts`

**Epic 4: Data Management & Polish**
- `src/components/onboarding/` — OnboardingWizard
- `src/components/settings/` — SettingsPanel, ExportModal, BackupRestore, DarkModeToggle
- `src/services/exportService.ts`, `backupService.ts`
- `src/contexts/SettingsProvider.tsx`

**Cross-Cutting Concerns:**
- Layout: `src/components/common/Layout.tsx`, `NavTabs.tsx`
- Error handling: `src/components/common/ErrorBoundary.tsx`
- Routing: `src/routes/`

### Integration Points

**Internal Communication:**
- Context → components via `useContext` or custom hooks
- Components → Context via `dispatch` actions
- Dexie ↔ Context providers via `useLiveQuery` or `db.table.toArray()`

**External Integrations:**
- None

**Data Flow:**
1. User action → Context action → Dexie write
2. Dexie change → Context state → component re-render
3. Timer: `timerService` → `TimerProvider` → `TaskCard` / `TimeDisplay`

### File Organization Patterns

**Configuration Files:**
- Root: `vite.config.ts`, `tailwind.config.js`, `tsconfig.json`, `components.json`
- `vercel.json` for Vercel deployment

**Source Organization:**
- Feature-based under `components/`; shared under `ui/` and `common/`
- One component per file; barrel `index.ts` per feature

**Test Organization:**
- Co-located `*.test.tsx` next to components

**Asset Organization:**
- `public/` for static assets
- PWA icons in `public/icons/`

### Development Workflow Integration

**Development Server Structure:**
- `npm run dev` — Vite dev server; `src/` as entry

**Build Process Structure:**
- `npm run build` — Vite build → `dist/`
- PWA assets generated by vite-plugin-pwa

**Deployment Structure:**
- Vercel deploys `dist/` as static site
- `vercel.json` for SPA routing (rewrites)

## Architecture Validation Results

### Coherence Validation ✅

**Decision Compatibility:**
All technology choices align: Vite react-ts + Dexie + React Context + @dnd-kit + React Router + Tailwind + shadcn/ui + vite-plugin-pwa. Versions compatible. No conflicts.

**Pattern Consistency:**
Naming (camelCase DB, PascalCase components), structure (feature folders), and communication (Context + props) match the stack and PRD.

**Structure Alignment:**
Project structure supports all decisions; feature folders map to epics; boundaries are clear.

### Requirements Coverage Validation ✅

**Epic/Feature Coverage:**
- Epic 1 (Kanban): kanban/, TasksProvider, db.ts ✅
- Epic 2 (Time Tracking): timer/, task-detail/, TimerProvider, timerService ✅
- Epic 3 (Client/Project & Revenue): clients/, revenue/, ClientsProvider, ProjectsProvider ✅
- Epic 4 (Data & Polish): onboarding/, settings/, exportService, backupService ✅

**Functional Requirements Coverage:**
All 36 FRs covered by components, contexts, and services in the structure.

**Non-Functional Requirements Coverage:**
- Performance: virtual scroll, memo, lazy load, PWA ✅
- Security: local-only, no telemetry ✅
- Accessibility: WCAG 2.1 AA, shadcn primitives ✅
- Reliability: auto-save, Dexie persistence, ErrorBoundary ✅

### Implementation Readiness Validation ✅

**Decision Completeness:**
Critical decisions documented with versions; implementation sequence defined.

**Structure Completeness:**
Project tree defined; epic-to-structure mapping complete.

**Pattern Completeness:**
Naming, structure, format, communication, and process patterns documented with examples.

### Gap Analysis Results

**Critical Gaps:** None

**Important Gaps:**
- Timer Web Worker implementation details deferred to implementation (acceptable per PRD risk mitigation)
- Zod schema definitions deferred to implementation

**Nice-to-Have Gaps:**
- Vitest setup not in initial structure (add with testing story)
- vercel.json SPA rewrites (add before first deploy)

### Validation Issues Addressed

No blocking issues. Architecture is coherent and complete.

### Architecture Completeness Checklist

**✅ Requirements Analysis**
- [x] Project context thoroughly analyzed
- [x] Scale and complexity assessed
- [x] Technical constraints identified
- [x] Cross-cutting concerns mapped

**✅ Architectural Decisions**
- [x] Critical decisions documented with versions
- [x] Technology stack fully specified
- [x] Integration patterns defined
- [x] Performance considerations addressed

**✅ Implementation Patterns**
- [x] Naming conventions established
- [x] Structure patterns defined
- [x] Communication patterns specified
- [x] Process patterns documented

**✅ Project Structure**
- [x] Complete directory structure defined
- [x] Component boundaries established
- [x] Integration points mapped
- [x] Requirements to structure mapping complete

### Architecture Readiness Assessment

**Overall Status:** READY FOR IMPLEMENTATION

**Confidence Level:** High — validation shows full coverage and coherence.

**Key Strengths:**
- Clear stack aligned with PRD
- Feature-based structure
- Consistent patterns
- Epic-to-structure mapping

**Areas for Future Enhancement:**
- Timer Web Worker details
- Vitest configuration
- vercel.json SPA routing

### Implementation Handoff

**AI Agent Guidelines:**
- Follow all architectural decisions as documented
- Use implementation patterns consistently
- Respect project structure and boundaries
- Use this document as the source of truth

**First Implementation Priority:**
```bash
npm create vite@latest . -- --template react-ts
```
