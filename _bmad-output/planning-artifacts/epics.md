---
stepsCompleted: ['step-01-validate-prerequisites', 'step-02-design-epics', 'step-03-create-stories', 'step-04-final-validation']
inputDocuments:
  - _bmad-output/planning-artifacts/prd.md
  - _bmad-output/planning-artifacts/architecture.md
  - _bmad-output/planning-artifacts/ux-design-specification.md
---

# bmad-freelancer-tracking-demo-application-v6 - Epic Breakdown

## Overview

This document provides the complete epic and story breakdown for bmad-freelancer-tracking-demo-application-v6, decomposing the requirements from the PRD, UX Design if it exists, and Architecture requirements into implementable stories.

## Requirements Inventory

### Functional Requirements

FR1: Users can view a kanban board with customizable columns for task visualization
FR2: Users can add, remove, and reorder columns via drag-and-drop
FR3: Users can edit column names inline
FR4: Users can create tasks with title, description, due date, priority, and tags
FR5: Users can move tasks between columns via drag-and-drop
FR6: Users can reorder tasks within a column via drag-and-drop
FR7: Users can create subtasks for breaking down larger tasks
FR8: Users can create tasks with a quick-add option
FR9: Users can start and stop a timer directly on task cards
FR10: Users can see elapsed time displayed on task cards when a timer is active
FR11: Users can see total time spent on task cards when no timer is running
FR12: Users can manually add time entries for tasks
FR13: Users can edit and delete existing time entries
FR14: Users can set time estimates for tasks
FR15: Users can see estimated vs actual time on task cards
FR16: The system continues running timers when the application is minimized or the tab is inactive
FR17: Users can create and manage clients (name, hourly rate, contact info)
FR18: Users can create and manage projects and assign them to clients
FR19: Users can assign tasks to clients and projects
FR20: Users can create clients and projects inline from task creation or editing
FR21: Users can mark tasks as billable or non-billable
FR22: Users can set hourly rates at task, client, or project level
FR23: Users can see real-time revenue potential (billable hours × rate) on task cards
FR24: Users can view a revenue dashboard with daily, weekly, and monthly summaries
FR25: Users can see revenue breakdown by client and project on the dashboard
FR26: Users can view and edit task details in a side panel
FR27: Users can search tasks by title, description, and tags
FR28: Users can filter tasks by client, project, billable status, priority, due date, and tags
FR29: Users can export time tracking data in CSV and JSON formats
FR30: Users can export revenue summaries
FR31: Users can backup and restore all application data
FR32: Users can configure application settings (dark mode, defaults, shortcuts)
FR33: Users can complete a guided onboarding wizard on first launch
FR34: Users can restart the onboarding wizard from settings
FR35: The system stores all data locally in the browser
FR36: The system does not send telemetry data

### NonFunctional Requirements

NFR1: The application shall launch and become interactive within 3 seconds on target platforms.
NFR2: The application shall maintain 60fps for all animations and interactions (e.g., drag-and-drop, transitions).
NFR3: The application shall handle 1000+ tasks without noticeable performance degradation.
NFR4: Timer display shall update at least once per second when a timer is active.
NFR5: The application shall store all data locally in the browser; no data shall be transmitted to external servers.
NFR6: The application shall not send telemetry or analytics data.
NFR7: The application shall provide optional encryption for sensitive data (post-MVP).
NFR8: The application shall comply with WCAG 2.1 AA.
NFR9: All interactive elements shall be operable via keyboard.
NFR10: The application shall provide keyboard shortcuts for common actions.
NFR11: The application shall provide tooltips and help documentation where appropriate.
NFR12: The application shall implement auto-save; no manual save shall be required.
NFR13: The application shall prevent data loss through persistent local storage.
NFR14: The application shall provide graceful error handling and crash recovery.
NFR15: The application shall work offline after initial load (PWA).
NFR16: The application shall be usable without formal training.
NFR17: The application shall present a clear visual hierarchy and intuitive interactions.

### Additional Requirements

**From Architecture:**
- **Starter Template (Epic 1 Story 1):** Initialize project with official Vite `react-ts` template via `npm create vite@latest . -- --template react-ts`. Subsequent stories add vite-plugin-pwa, Tailwind CSS, shadcn/ui, Dexie.js, and path aliases (`@/`).
- Use Dexie.js 4.x for IndexedDB persistence with stores: tasks, clients, projects, timeEntries, columns, settings.
- Use React Context for state management (tasks, timer, clients, projects).
- Use @dnd-kit for kanban drag-and-drop (accessibility, keyboard, touch).
- Use React Router 7.x for navigation (Board | Dashboard | Settings).
- Use Zod 4.x for data validation before persistence.
- Use Tailwind + shadcn/ui per UX spec.
- Use vite-plugin-pwa for offline capability.
- Use path aliases (`@/`) for imports.
- Timer: setInterval/requestAnimationFrame; Web/Service Workers for background accuracy when tab inactive.
- Implementation sequence: Vite init → Tailwind, shadcn, aliases → PWA → Dexie → Router → @dnd-kit → Context → Zod.
- Hosting: Vercel for static SPA/PWA deployment.
- Naming: camelCase for DB/stores; PascalCase for components; `@/` for imports.
- Error handling: React Error Boundaries; user-facing actionable messages; no silent failures.
- No backend; all data local; no telemetry.

**From UX Design:**
- Desktop-first layout at 1024px+; adapts to 768px+ without breaking core flows.
- Design direction: Spacious Calm—20px card padding, 24px column padding; 16px card titles, 14px body, 36px timer button.
- One-tap actions for timer start/stop, billable toggle, and task movement.
- Timer states: Active = accent + subtle pulse/glow; paused = muted accent; stopped = neutral.
- Touch targets: Minimum 44×44px for timer, buttons, cards.
- Respect `prefers-reduced-motion`; avoid non-essential animation.
- Button hierarchy: Primary (timer), Secondary (Add task, Export), Tertiary (filters), Destructive (delete) with confirmation.
- Empty states with clear CTAs; skeleton loading for lists.
- Side panel (Sheet) for task details; board stays visible.
- Semantic color mapping: Success (billable), muted (non-billable), accent (active timer), warning (overdue).

### FR Coverage Map

FR1: Epic 1 - Kanban board with customizable columns
FR2: Epic 1 - Add, remove, reorder columns via drag-and-drop
FR3: Epic 1 - Edit column names inline
FR4: Epic 1 - Create tasks with title, description, due date, priority, tags
FR5: Epic 1 - Move tasks between columns via drag-and-drop
FR6: Epic 1 - Reorder tasks within a column via drag-and-drop
FR7: Epic 1 - Create subtasks for larger tasks
FR8: Epic 1 - Quick-add task option
FR9: Epic 2 - Start and stop timer on task cards
FR10: Epic 2 - Elapsed time displayed when timer active
FR11: Epic 2 - Total time spent on task cards
FR12: Epic 2 - Manually add time entries
FR13: Epic 2 - Edit and delete time entries
FR14: Epic 2 - Set time estimates for tasks
FR15: Epic 2 - Estimated vs actual time on cards
FR16: Epic 2 - Timer continues when tab inactive
FR17: Epic 3 - Create and manage clients
FR18: Epic 3 - Create and manage projects
FR19: Epic 3 - Assign tasks to clients and projects
FR20: Epic 3 - Inline client/project creation from task form
FR21: Epic 3 - Mark tasks billable or non-billable
FR22: Epic 3 - Set hourly rates at task/client/project level
FR23: Epic 3 - Real-time revenue on task cards
FR24: Epic 3 - Revenue dashboard with daily/weekly/monthly summaries
FR25: Epic 3 - Revenue breakdown by client and project
FR26: Epic 2 - View and edit task details in side panel
FR27: Epic 4 - Search tasks by title, description, tags
FR28: Epic 4 - Filter tasks by client, project, billable, priority, due date, tags
FR29: Epic 4 - Export time tracking data (CSV/JSON)
FR30: Epic 4 - Export revenue summaries
FR31: Epic 4 - Backup and restore all data
FR32: Epic 4 - Configure settings (dark mode, defaults, shortcuts)
FR33: Epic 4 - Guided onboarding wizard on first launch
FR34: Epic 4 - Restart onboarding wizard from settings
FR35: Epic 1 - Local storage in browser
FR36: Epic 1 - No telemetry data sent

## Epic List

### Epic 1: Foundation & Core Kanban

Users can manage tasks on a kanban board with customizable columns and drag-and-drop.
**FRs covered:** FR1, FR2, FR3, FR4, FR5, FR6, FR7, FR8, FR35, FR36

### Epic 2: Time Tracking

Users can track time on task cards (start/stop timer, manual entries, estimates) and view/edit details in a side panel.
**FRs covered:** FR9, FR10, FR11, FR12, FR13, FR14, FR15, FR16, FR26

### Epic 3: Client/Project Organization & Revenue

Users can manage clients and projects, assign billable rates, and see revenue on cards and dashboard.
**FRs covered:** FR17, FR18, FR19, FR20, FR21, FR22, FR23, FR24, FR25

### Epic 4: Data Management & Polish

Users can search, filter, export, backup/restore, configure settings, and complete onboarding.
**FRs covered:** FR27, FR28, FR29, FR30, FR31, FR32, FR33, FR34

---

## Epic 1: Foundation & Core Kanban

Users can manage tasks on a kanban board with customizable columns and drag-and-drop.

**FRs covered:** FR1, FR2, FR3, FR4, FR5, FR6, FR7, FR8, FR35, FR36

### Story 1.1: Initialize Project with Vite React-TS Template

As a developer,
I want to initialize the project with the official Vite react-ts template,
So that I have a runnable React + TypeScript foundation aligned with the Architecture.

**Acceptance Criteria:**

**Given** an empty or existing project directory
**When** I run `npm create vite@latest . -- --template react-ts`
**Then** the project is initialized with React 18+, TypeScript, Vite 6.x, and ES modules
**And** `npm run dev` starts the development server
**And** `npm run build` produces a production build
**And** the project has no telemetry or external data transmission (FR36)

### Story 1.2: Add Tailwind, shadcn/ui, PWA, and Path Aliases

As a developer,
I want to add Tailwind CSS, shadcn/ui, vite-plugin-pwa, and path aliases (`@/`),
So that the app has styling, accessible components, offline capability, and clean imports.

**Acceptance Criteria:**

**Given** the Vite react-ts project from Story 1.1
**When** I add Tailwind CSS, shadcn/ui (via components.json), vite-plugin-pwa, and configure `@/` in tsconfig and vite.config
**Then** Tailwind utilities and shadcn components are available
**And** the app is installable as a PWA with a service worker
**And** imports like `@/components/...` resolve correctly
**And** the app works offline after initial load (NFR15)

### Story 1.3: Set Up Local Data Storage and Base Layout

As a freelancer,
I want my task and column data to persist locally in the browser,
So that I never lose my work when I close or refresh the app.

**Acceptance Criteria:**

**Given** the styled app from Story 1.2
**When** I add Dexie.js with schema for `tasks` and `columns` stores (camelCase, plural)
**And** I add React Router with routes for Board, Revenue (placeholder), Settings (placeholder)
**And** I add a base Layout with navigation tabs
**Then** data persists in IndexedDB across refresh and browser close (FR35)
**And** I can navigate between Board, Revenue, and Settings
**And** no data is sent to external servers (NFR5, NFR6)
**And** changes auto-save without a manual save button (NFR12)

### Story 1.4: Create Kanban Board with Customizable Columns

As a freelancer,
I want to view and customize a kanban board with columns I can add, remove, reorder, and rename,
So that I can organize my workflow the way I work.

**Acceptance Criteria:**

**Given** the app with persisted tasks and columns from Story 1.3
**When** I view the Board page
**Then** I see a horizontal kanban board with columns (FR1)
**And** I can add new columns via a clear CTA
**And** I can remove columns (with confirmation if they contain tasks)
**And** I can reorder columns via drag-and-drop (FR2)
**And** I can edit column names inline by clicking the header (FR3)
**And** columns use 24px padding per UX Spacious Calm (UX spec)
**And** all interactions are keyboard operable (NFR9)

### Story 1.5: Create and Manage Tasks with Full Fields

As a freelancer,
I want to create tasks with title, description, due date, priority, and tags,
So that I can capture and organize my work with the right context.

**Acceptance Criteria:**

**Given** the kanban board with columns from Story 1.4
**When** I add a task to a column
**Then** I can set title (required), description, due date, priority, and tags (FR4)
**And** the task appears in the column immediately
**And** I can edit any task field and changes auto-save
**And** task cards use 20px padding and 16px titles per UX (UX spec)
**And** empty columns show a clear "Add task" CTA (UX spec)
**And** validation uses Zod before persistence (Architecture)

### Story 1.6: Move and Reorder Tasks via Drag-and-Drop

As a freelancer,
I want to move tasks between columns and reorder them within a column via drag-and-drop,
So that I can manage my workflow visually without extra clicks.

**Acceptance Criteria:**

**Given** tasks in columns from Story 1.5
**When** I drag a task to another column
**Then** the task moves to the target column and persists (FR5)
**And** I can reorder tasks within a column via drag-and-drop (FR6)
**And** the drop target is visually highlighted during drag (UX spec)
**And** drag-and-drop works with keyboard (NFR9) and touch
**And** animations maintain 60fps (NFR2)
**And** @dnd-kit is used per Architecture

### Story 1.7: Add Subtasks and Quick-Add for Tasks

As a freelancer,
I want to create subtasks for larger tasks and add tasks quickly with minimal fields,
So that I can break down work and capture tasks fast.

**Acceptance Criteria:**

**Given** tasks from Story 1.6
**When** I create or edit a task
**Then** I can add subtasks to break down the work (FR7)
**And** I can mark subtasks complete
**And** I can add a task via quick-add (title only) for speed (FR8)
**And** quick-add creates a task in the selected or default column
**And** I can expand quick-add to full fields if needed

---

## Epic 2: Time Tracking

Users can track time on task cards (start/stop timer, manual entries, estimates) and view/edit details in a side panel.

**FRs covered:** FR9, FR10, FR11, FR12, FR13, FR14, FR15, FR16, FR26

### Story 2.1: Add Timer Button to Task Cards

As a freelancer,
I want to start and stop a timer directly on a task card with one tap,
So that I can track time without leaving the board.

**Acceptance Criteria:**

**Given** task cards from Epic 1
**When** I click the timer button (play icon) on a task card
**Then** the timer starts and the icon changes to stop (FR9)
**And** clicking again stops the timer
**And** only one timer can run at a time across the board
**And** the timer button is at least 44×44px (UX spec)
**And** the button has `aria-label` "Start timer" / "Stop timer" (NFR8)
**And** the timer uses setInterval or requestAnimationFrame per Architecture

### Story 2.2: Display Elapsed and Total Time on Task Cards

As a freelancer,
I want to see elapsed time when a timer is running and total time spent when it is stopped,
So that I always know how much time I have on each task.

**Acceptance Criteria:**

**Given** the timer from Story 2.1
**When** a timer is active on a task
**Then** elapsed time is displayed on the card and updates every second (FR10, NFR4)
**And** the card has a visual indicator (accent + pulse) for active timer (UX spec)
**When** no timer is running
**Then** total time spent is displayed on the card (FR11)
**And** time is formatted in a human-readable way (e.g., 1h 23m)

### Story 2.3: Implement Task Detail Side Panel

As a freelancer,
I want to view and edit task details in a side panel,
So that I can see and update full task information without losing sight of the board.

**Acceptance Criteria:**

**Given** task cards from Story 2.2
**When** I click a task card
**Then** a side panel (Sheet) opens with full task details (FR26)
**And** I can edit title, description, due date, priority, tags
**And** changes auto-save
**And** I can close the panel with a button or ESC
**And** the board remains visible beside the panel (UX spec)
**And** the panel is keyboard accessible (NFR9)

### Story 2.4: Add Manual Time Entry and Editing

As a freelancer,
I want to manually add, edit, and delete time entries when I forget to start the timer,
So that I can correct my time without losing billable hours.

**Acceptance Criteria:**

**Given** the task detail panel from Story 2.3
**When** I click "Add Time" in the panel
**Then** I can enter duration (hours/minutes) and an optional note (FR12)
**And** the time is saved and the task total updates
**And** I can edit an existing time entry (FR13)
**And** I can delete a time entry (with confirmation)
**And** the task card reflects the updated total immediately
**And** the flow feels simple and non-judgmental (UX: recovery over perfection)

### Story 2.5: Add Time Estimates and Estimated vs Actual Display

As a freelancer,
I want to set time estimates for tasks and see estimated vs actual on cards,
So that I can plan and track accuracy.

**Acceptance Criteria:**

**Given** tasks with time tracking from Story 2.4
**When** I create or edit a task
**Then** I can set a time estimate (FR14)
**And** the task card shows estimated vs actual time when both exist (FR15)
**And** the display is clear (e.g., "2h / 1h 30m" or "1h 30m of 2h")
**And** estimate is optional

### Story 2.6: Enable Timer to Run When Tab Is Inactive

As a freelancer,
I want the timer to continue running when I minimize the app or switch tabs,
So that my time is accurate even when I am not looking at the board.

**Acceptance Criteria:**

**Given** the timer from Story 2.1
**When** I start a timer and switch to another tab or minimize the browser
**Then** the timer continues running (FR16)
**And** when I return, elapsed time reflects the correct duration
**And** Web/Service Workers are used for background accuracy per Architecture
**And** timer drift is documented if some drift is acceptable for MVP

---

## Epic 3: Client/Project Organization & Revenue

Users can manage clients and projects, assign billable rates, and see revenue on cards and dashboard.

**FRs covered:** FR17, FR18, FR19, FR20, FR21, FR22, FR23, FR24, FR25

### Story 3.1: Create and Manage Clients

As a freelancer,
I want to create and manage clients with name, hourly rate, and contact info,
So that I can organize my work by client and billing.

**Acceptance Criteria:**

**Given** the app from Epic 2
**When** I add a client (e.g., from Settings or a dedicated flow)
**Then** I can set name (required), hourly rate, and contact info (FR17)
**And** clients are stored in the `clients` Dexie store
**And** I can edit and delete clients
**And** deleting a client with assigned tasks shows a warning or reassignment option

### Story 3.2: Create and Manage Projects

As a freelancer,
I want to create and manage projects and assign them to clients,
So that I can organize tasks within client work.

**Acceptance Criteria:**

**Given** clients from Story 3.1
**When** I add a project
**Then** I can set name and assign it to a client (FR18)
**And** projects can have an optional hourly rate (overrides client rate)
**And** projects are stored in the `projects` Dexie store
**And** I can edit and delete projects

### Story 3.3: Assign Tasks to Clients and Projects

As a freelancer,
I want to assign tasks to clients and projects,
So that I can track work and revenue by client and project.

**Acceptance Criteria:**

**Given** clients and projects from Stories 3.1 and 3.2
**When** I create or edit a task
**Then** I can assign it to a client and project (FR19)
**And** client and project are displayed on the task card
**And** assignment is optional (tasks can be unassigned)
**And** I can change assignment from the task detail panel

### Story 3.4: Add Inline Client and Project Creation

As a freelancer,
I want to create clients and projects inline when creating or editing a task,
So that I do not have to leave the task form to add a new client or project.

**Acceptance Criteria:**

**Given** the task form from Story 3.3
**When** I am selecting a client or project
**Then** I have an option to "Add new client" or "Add new project" inline (FR20)
**And** a compact form or modal lets me create without leaving the task
**And** the new client/project is immediately available for selection
**And** I can set name and rate in the inline flow

### Story 3.5: Add Billable Toggle and Hourly Rates

As a freelancer,
I want to mark tasks as billable or non-billable and set hourly rates at task, client, or project level,
So that I can track revenue accurately.

**Acceptance Criteria:**

**Given** tasks with client/project assignment from Story 3.4
**When** I create or edit a task
**Then** I can mark it as billable or non-billable (FR21)
**And** hourly rate is inherited from client or project, or overridden at task level (FR22)
**And** the billable indicator is visible on the task card (UX: semantic color)
**And** rate can be set when creating client or project
**And** one-tap billable toggle on the card (UX spec)

### Story 3.6: Display Revenue on Task Cards

As a freelancer,
I want to see real-time revenue (billable hours × rate) on task cards,
So that I know the value of each task at a glance.

**Acceptance Criteria:**

**Given** tasks with billable status and rates from Story 3.5
**When** a task has billable time and a rate
**Then** revenue is displayed on the card (FR23)
**And** revenue updates when time or rate changes
**And** non-billable tasks show no revenue or a muted indicator (UX spec)
**And** currency is formatted appropriately

### Story 3.7: Create Revenue Dashboard

As a freelancer,
I want to view a revenue dashboard with daily, weekly, and monthly summaries by client and project,
So that I can see my earnings and prepare for invoicing.

**Acceptance Criteria:**

**Given** tasks with time and revenue from Story 3.6
**When** I navigate to the Revenue page
**Then** I see daily, weekly, and monthly revenue summaries (FR24)
**And** I see a breakdown by client and project (FR25)
**And** the dashboard uses summary cards and clear hierarchy (UX spec)
**And** data is calculated from stored time entries and rates

---

## Epic 4: Data Management & Polish

Users can search, filter, export, backup/restore, configure settings, and complete onboarding.

**FRs covered:** FR27, FR28, FR29, FR30, FR31, FR32, FR33, FR34

### Story 4.1: Add Search and Filter

As a freelancer,
I want to search tasks by title, description, and tags and filter by client, project, billable status, priority, due date, and tags,
So that I can find and focus on relevant tasks.

**Acceptance Criteria:**

**Given** the board with tasks from Epic 3
**When** I use the search bar
**Then** I can search by title, description, and tags (FR27)
**And** results update as I type (or on submit)
**When** I use filters
**Then** I can filter by client, project, billable status, priority, due date, and tags (FR28)
**And** filters can be combined
**And** the filter bar collapses when inactive (UX spec)
**And** filtered view is keyboard accessible

### Story 4.2: Add Data Export (CSV and JSON)

As a freelancer,
I want to export time tracking data and revenue summaries in CSV and JSON formats,
So that I can use the data for invoicing and records.

**Acceptance Criteria:**

**Given** tasks with time entries and revenue from Epic 3
**When** I go to Settings and choose Export
**Then** I can export time tracking data as CSV (FR29)
**And** I can export time tracking data as JSON (FR29)
**And** I can export revenue summaries (FR30)
**And** CSV uses camelCase headers and ISO dates (Architecture)
**And** a brief success message confirms the download (UX spec)

### Story 4.3: Add Backup and Restore

As a freelancer,
I want to backup and restore all application data,
So that I can recover from data loss or migrate to another device.

**Acceptance Criteria:**

**Given** the app with local data from Epic 3
**When** I choose Backup in Settings
**Then** I download a JSON file with all app data (FR31)
**And** the backup includes schema version (Architecture)
**When** I choose Restore and select a backup file
**Then** I can restore all data from the backup
**And** I am warned before overwriting current data
**And** after restore, the app reflects the restored state

### Story 4.4: Add Settings Panel (Dark Mode, Defaults, Shortcuts)

As a freelancer,
I want to configure application settings including dark mode, defaults, and shortcuts,
So that the app fits my preferences and workflow.

**Acceptance Criteria:**

**Given** the app from Story 4.3
**When** I navigate to Settings
**Then** I can toggle dark mode (FR32)
**And** I can configure defaults (e.g., default column, default rate)
**And** I can view and optionally customize keyboard shortcuts (FR32, NFR10)
**And** settings persist across sessions
**And** settings are stored in the `settings` Dexie store

### Story 4.5: Add Onboarding Wizard

As a freelancer,
I want to complete a guided onboarding wizard on first launch,
So that I can set up my first client, project, columns, and task with a timer in under 5 minutes.

**Acceptance Criteria:**

**Given** a first-time user (no existing data)
**When** the app loads
**Then** the onboarding wizard appears (FR33)
**And** the wizard guides me to add a client, create a project, customize columns, create a sample task, and start the timer
**And** I can complete setup and have a running timer within 5 minutes (Success Criteria)
**And** when I finish, I have a working board
**And** the wizard does not appear again on subsequent launches
**And** empty states have clear CTAs (UX spec)

### Story 4.6: Add Restart Onboarding from Settings

As a freelancer,
I want to restart the onboarding wizard from settings,
So that I can re-run the setup flow if I want to.

**Acceptance Criteria:**

**Given** the app with onboarding from Story 4.5
**When** I go to Settings
**Then** I have an option to "Restart onboarding" (FR34)
**And** when I choose it, the onboarding wizard runs again
**And** I can complete or dismiss it
**And** existing data is preserved (onboarding does not clear data)
