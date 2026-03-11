---
stepsCompleted: ['step-01-init', 'step-02-discovery', 'step-02b-vision', 'step-02c-executive-summary', 'step-03-success', 'step-04-journeys', 'step-05-domain', 'step-06-innovation', 'step-07-project-type', 'step-08-scoping', 'step-09-functional', 'step-10-nonfunctional', 'step-11-polish', 'step-12-complete']
inputDocuments: ['docs/original-prd.md']
workflowType: 'prd'
briefCount: 0
researchCount: 0
brainstormingCount: 0
projectDocsCount: 1
classification:
  projectType: web_app
  domain: general
  complexity: low
  projectContext: brownfield
---

# Product Requirements Document - bmad-freelancer-tracking-demo-application-v6

**Author:** Marlon
**Date:** 2026-03-11

## Executive Summary

Solo freelancers lose billable hours and productivity because task management and time tracking live in separate tools. Generic solutions (Asana, Trello) require paid tiers for customization and keep time tracking separate, increasing friction and administrative overhead. This product is a single web app that combines kanban task management with integrated time tracking, built for solo freelancers who manage multiple clients and projects. It targets freelancers who need accurate billable hours, clear revenue visibility, and minimal context switching.

### What Makes This Special

Time tracking is embedded directly on task cards—no separate app or screen. Users start and stop timers where they work, reducing friction and improving accuracy. The product is freelancer-specific: billable vs non-billable, hourly rates at task/client/project level, and real-time revenue views without paid tiers. It is privacy-first (local storage, no telemetry) and desktop-first for long work sessions. The core insight: combining kanban and time tracking in one place removes the friction that causes lost billable hours and improves capture of billable time.

### Project Classification

| Attribute | Value |
|-----------|-------|
| **Project Type** | Web Application (SPA/PWA) |
| **Domain** | General (Productivity / Freelancer Tools) |
| **Complexity** | Low |
| **Project Context** | Brownfield (existing PRD as source) |

## Success Criteria

The following criteria define what winning looks like for this product.

### User Success

- **Accurate time capture:** Users can track billable hours for tasks without switching between tools.
- **Revenue visibility:** Users see real-time revenue and billable vs non-billable work at a glance.
- **Low friction:** Users can start and stop timers directly on task cards.
- **Organized workflow:** Users can manage multiple clients and projects in one kanban board.
- **Onboarding:** New users complete the setup wizard and create their first task with a timer in under 5 minutes.

### Business Success

- **Adoption:** Solo freelancers adopt the app as their primary task and time-tracking tool.
- **Trust:** Users rely on the app for billable-hour accuracy and invoicing.
- **Retention:** Users continue using the app after the first week (no quick drop-off).

### Technical Success

- **Performance:** App launches in under 3 seconds; 60fps for animations and interactions.
- **Scale:** App handles 1000+ tasks without noticeable slowdown.
- **Offline:** App works offline after initial load (PWA).
- **Reliability:** No data loss; auto-save and crash recovery.
- **Accessibility:** WCAG 2.1 AA compliance.

### Measurable Outcomes

| Outcome | Target |
|---------|--------|
| Time to first tracked task | < 5 minutes for new users |
| Timer accuracy | No drift when tab is inactive |
| Board responsiveness | 60fps during drag-and-drop |
| Data persistence | 100% (no loss on refresh/close) |

## Product Scope & Phased Development

Scope is organized into three phases. The MVP delivers the minimum that solves the core problem: accurate billable time capture with minimal friction.

### MVP Strategy & Philosophy

**MVP Approach:** Problem-solving MVP—deliver the minimum that solves the core problem: accurate billable time capture with minimal friction.

**Resource Requirements:** Single developer or small team. React + Vite + IndexedDB stack. No backend required.

### Phase 1: MVP (Epics 1–4)

- Epic 1: Foundation & Core Kanban (columns, tasks, drag-and-drop)
- Epic 2: Time Tracking (timer on cards, manual entries, background operation)
- Epic 3: Client/Project Organization & Revenue (billable toggle, rates, revenue dashboard)
- Epic 4: Data Management & Polish (export, backup/restore, dark mode, settings, onboarding)

**Core User Journeys Supported:** First-time setup, core workflow, forgot-timer recovery, weekly review.

**Must-Have Capabilities:** Kanban board with customizable columns and drag-and-drop; task creation with title, description, due date, priority, tags; timer on task cards (start/stop, background operation); manual time entry and editing; client and project management (inline creation); billable toggle and hourly rates; revenue dashboard; task detail side panel; search and filter; data export (CSV/JSON), backup/restore; dark mode, settings, onboarding wizard.

### Phase 2: Growth (Post-MVP)

- Time analytics (by client, project, task type)
- Productivity metrics (tasks completed, time efficiency)
- Multiple boards per user
- Date range filtering on revenue dashboard

### Phase 3: Expansion (Future)

- Optional encryption for sensitive data
- System preference detection for dark mode
- Advanced time analytics and reporting

### Risk Mitigation Strategy

**Technical Risks:** Background timer accuracy when tab is inactive—use Web/Service Workers; accept some drift for MVP. Mitigation: document behavior and consider periodic sync.

**Market Risks:** Adoption by freelancers—validate with onboarding completion and retention. Mitigation: onboarding wizard and clear value proposition.

**Resource Risks:** Scope creep—MVP limited to Epics 1–4. Mitigation: strict MVP boundary; analytics and multi-board deferred to Phase 2.

## User Journeys

These narrative journeys illustrate how users interact with the product and reveal required capabilities.

### Journey 1: Alex — First-Time Setup (New User)

**Opening scene:** Alex is a freelance designer who has been juggling Trello and a separate timer app. They've lost billable hours because they forget to start the timer or switch between tools. They've just discovered the app and opened it for the first time.

**Rising action:** The onboarding wizard appears. Alex adds their first client (Acme Corp, $85/hr), creates a project (Website Redesign), and customizes board columns (Backlog, In Progress, Review, Done). They create a sample task and start the timer to see how it works.

**Climax:** Within minutes, Alex has a working board with a running timer on a task. They see elapsed time updating in real time on the card.

**Resolution:** Alex feels confident they can use this for real work. They delete the sample task and start using it for actual client work.

**Capabilities revealed:** Onboarding wizard, inline client/project creation, column customization, quick-add task, timer demo.

---

### Journey 2: Alex — Core Workflow (Success Path)

**Opening scene:** Alex starts their workday with several tasks across two clients. They open the kanban board and see tasks organized by client and project.

**Rising action:** Alex clicks Start on "Design homepage mockups" (Acme Corp). The timer runs while they work. They move the task to In Progress, then to Review when done. They stop the timer and start another task. The board shows time spent and revenue per task.

**Climax:** At midday, Alex opens the revenue dashboard and sees today's billable hours and revenue. They can see which client and project generated the most value.

**Resolution:** Alex finishes the day with accurate time entries and a clear view of billable hours and revenue. They feel in control of their time and billing.

**Capabilities revealed:** Timer on task cards, drag-and-drop, billable toggle, revenue dashboard, client/project filtering.

---

### Journey 3: Alex — Forgot to Start Timer (Edge Case)

**Opening scene:** Alex worked on a task for 2 hours but forgot to start the timer. They only notice when they're about to move the task to Done.

**Rising action:** Alex opens the task detail panel and selects "Add Time" to manually enter 2 hours. They add a note ("Design iteration session") and save. The task card updates with the new total time and revenue.

**Climax:** Alex sees the corrected time and revenue on the card. They're relieved they didn't lose billable hours.

**Resolution:** Alex continues working, more mindful of starting the timer. They know they can fix mistakes with manual entries.

**Capabilities revealed:** Manual time entry, task detail panel, time entry editing, revenue recalculation.

---

### Journey 4: Alex — Weekly Review & Export

**Opening scene:** It's Friday. Alex needs to invoice clients and wants to export time data for their records.

**Rising action:** Alex opens the revenue dashboard and reviews daily and weekly totals by client. They go to Settings and export time tracking data as CSV for invoicing and backup.

**Climax:** Alex downloads a CSV with tasks, time entries, clients, and rates. They can use it for invoicing and record-keeping.

**Resolution:** Alex feels confident their data is accurate and exportable. They run a backup before the weekend.

**Capabilities revealed:** Revenue dashboard (daily/weekly), data export (CSV/JSON), backup/restore.

---

### Journey Requirements Summary

| Journey | Capabilities Revealed |
|---------|----------------------|
| First-Time Setup | Onboarding wizard, inline client/project creation, column management, quick-add task, timer demo |
| Core Workflow | Timer on cards, drag-and-drop, billable toggle, revenue dashboard, client/project filtering |
| Forgot Timer | Manual time entry, task detail panel, time entry editing |
| Weekly Review | Revenue dashboard, CSV/JSON export, backup/restore |

## Web Application Specific Requirements

### Project-Type Overview

Desktop-first single-page application (SPA) with Progressive Web App (PWA) capabilities. Built with React, Vite, and IndexedDB. No backend—all data stored locally. Supports Windows, macOS, and Linux via modern browsers.

### Technical Architecture Considerations

**Architecture:** SPA with React, Vite, IndexedDB. PWA for offline and installability. No server-side rendering.

### Browser Matrix

| Browser | Minimum Version | Notes |
|---------|-----------------|-------|
| Chrome | Last 2 versions | Primary target |
| Firefox | Last 2 versions | Full support |
| Safari | Last 2 versions | macOS |
| Edge | Last 2 versions | Chromium-based |

**Platforms:** Windows, macOS, Linux (desktop browsers). Responsive layout for different window sizes.

### Responsive Design

- Desktop-first: primary layout for 1024px+ width
- Adapts to smaller windows (e.g. 768px+) without breaking core flows
- Kanban board scrolls horizontally when needed
- Side panels and modals scale with viewport

### Performance Targets

| Metric | Target |
|--------|--------|
| Initial load | < 3 seconds |
| Animations/interactions | 60fps |
| Task capacity | 1000+ tasks without slowdown |
| Timer updates | Every second when active |

**Techniques:** Virtual scrolling for large boards, React.memo/useMemo, lazy loading for side panels.

### SEO Strategy

- Minimal SEO focus (local-first, app-like)
- Basic meta tags for PWA manifest
- No crawler-dependent content; app is user-installed

### Accessibility Level

- **Target:** WCAG 2.1 AA
- Keyboard navigation for all interactive elements
- Sufficient color contrast
- Screen reader support for tasks and status
- Visible focus indicators
- Semantic HTML and ARIA where needed

### Implementation Considerations

- **State:** React Context for tasks, timer, clients, projects
- **Storage:** IndexedDB (e.g. via Dexie.js)
- **Timer:** setInterval/requestAnimationFrame; Web/Service Workers for background accuracy
- **Build:** Vite, TypeScript, ESLint, Prettier
- **Deploy:** Static hosting (Vercel, Netlify, GitHub Pages)

## Functional Requirements

The following capabilities define the product contract. All design, architecture, and development work traces to these requirements.

### Kanban Board & Task Management

- FR1: Users can view a kanban board with customizable columns for task visualization
- FR2: Users can add, remove, and reorder columns via drag-and-drop
- FR3: Users can edit column names inline
- FR4: Users can create tasks with title, description, due date, priority, and tags
- FR5: Users can move tasks between columns via drag-and-drop
- FR6: Users can reorder tasks within a column via drag-and-drop
- FR7: Users can create subtasks for breaking down larger tasks
- FR8: Users can create tasks with a quick-add option

### Time Tracking

- FR9: Users can start and stop a timer directly on task cards
- FR10: Users can see elapsed time displayed on task cards when a timer is active
- FR11: Users can see total time spent on task cards when no timer is running
- FR12: Users can manually add time entries for tasks
- FR13: Users can edit and delete existing time entries
- FR14: Users can set time estimates for tasks
- FR15: Users can see estimated vs actual time on task cards
- FR16: The system continues running timers when the application is minimized or the tab is inactive

### Client & Project Organization

- FR17: Users can create and manage clients (name, hourly rate, contact info)
- FR18: Users can create and manage projects and assign them to clients
- FR19: Users can assign tasks to clients and projects
- FR20: Users can create clients and projects inline from task creation or editing

### Revenue & Billing

- FR21: Users can mark tasks as billable or non-billable
- FR22: Users can set hourly rates at task, client, or project level
- FR23: Users can see real-time revenue potential (billable hours × rate) on task cards
- FR24: Users can view a revenue dashboard with daily, weekly, and monthly summaries
- FR25: Users can see revenue breakdown by client and project on the dashboard

### Task Detail & Filtering

- FR26: Users can view and edit task details in a side panel
- FR27: Users can search tasks by title, description, and tags
- FR28: Users can filter tasks by client, project, billable status, priority, due date, and tags

### Data Management & Export

- FR29: Users can export time tracking data in CSV and JSON formats
- FR30: Users can export revenue summaries
- FR31: Users can backup and restore all application data

### User Preferences & Onboarding

- FR32: Users can configure application settings (dark mode, defaults, shortcuts)
- FR33: Users can complete a guided onboarding wizard on first launch
- FR34: Users can restart the onboarding wizard from settings

### Data Storage & Privacy

- FR35: The system stores all data locally in the browser
- FR36: The system does not send telemetry data

## Non-Functional Requirements

### Performance

- NFR1: The application shall launch and become interactive within 3 seconds on target platforms.
- NFR2: The application shall maintain 60fps for all animations and interactions (e.g., drag-and-drop, transitions).
- NFR3: The application shall handle 1000+ tasks without noticeable performance degradation.
- NFR4: Timer display shall update at least once per second when a timer is active.

### Security & Privacy

- NFR5: The application shall store all data locally in the browser; no data shall be transmitted to external servers.
- NFR6: The application shall not send telemetry or analytics data.
- NFR7: The application shall provide optional encryption for sensitive data (post-MVP).

### Accessibility

- NFR8: The application shall comply with WCAG 2.1 AA.
- NFR9: All interactive elements shall be operable via keyboard.
- NFR10: The application shall provide keyboard shortcuts for common actions.
- NFR11: The application shall provide tooltips and help documentation where appropriate.

### Reliability

- NFR12: The application shall implement auto-save; no manual save shall be required.
- NFR13: The application shall prevent data loss through persistent local storage.
- NFR14: The application shall provide graceful error handling and crash recovery.
- NFR15: The application shall work offline after initial load (PWA).

### Usability

- NFR16: The application shall be usable without formal training.
- NFR17: The application shall present a clear visual hierarchy and intuitive interactions.
