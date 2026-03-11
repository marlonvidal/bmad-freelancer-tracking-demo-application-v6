---
project_name: 'bmad-freelancer-tracking-demo-application-v6'
user_name: 'Marlon'
date: '2026-03-11'
sections_completed: ['technology_stack', 'language_rules', 'framework_rules', 'testing_rules', 'quality_rules', 'workflow_rules', 'anti_patterns']
status: 'complete'
rule_count: 32
optimized_for_llm: true
---

# Project Context for AI Agents

_This file contains critical rules and patterns that AI agents must follow when implementing code in this project. Focus on unobvious details that agents might otherwise miss._

---

## Technology Stack & Versions

- **React** 18+ with JSX transform
- **Vite** 6.x (build), **TypeScript** strict mode
- **Dexie.js** 4.x (IndexedDB), **Zod** 4.x (validation)
- **@dnd-kit** latest (kanban DnD), **React Router** 7.x
- **Tailwind CSS** + **shadcn/ui** (styling)
- **vite-plugin-pwa** (offline/PWA)
- **Path alias:** `@/` → `src/`
- **Hosting:** Vercel (static SPA); no backend, no telemetry
- **Browsers:** Chrome, Firefox, Safari, Edge (last 2 versions)

## Critical Implementation Rules

### Language-Specific Rules

- TypeScript strict mode: no implicit any; explicit return types for exported functions when non-obvious
- Imports: use `@/` alias (e.g. `import { TaskCard } from '@/components/kanban/TaskCard'`)
- Dates: ISO 8601 strings in persisted data; avoid `undefined` in IndexedDB/JSON
- Error handling: Error Boundaries for component failures; short, actionable user messages; no silent failures; console in dev only, no telemetry

### Framework-Specific Rules

- **React:** One component per file; PascalCase for components; hooks with `use` prefix
- **State:** React Context only; actions `{verb}{Entity}` (e.g. `addTask`, `updateTask`, `startTimer`); immutable updates only
- **Persistence:** Sync to Dexie on change; no manual save; no direct Dexie access in components (use Context)
- **Structure:** Feature folders (`kanban/`, `timer/`, `revenue/`, etc.); `components/ui/` for shadcn; `components/common/` for shared

### Testing Rules

- Co-located `*.test.tsx` next to components
- Vitest (add with testing story)
- Mock external services; prefer integration for critical flows

### Code Quality & Style Rules

- **DB/JSON:** camelCase stores and fields (e.g. `tasks`, `taskId`, `clientId`)
- **Components:** PascalCase files and names (`TaskCard.tsx`, `KanbanColumn`)
- **Utils:** camelCase (`formatCurrency.ts`)
- **Constants:** UPPER_SNAKE_CASE
- ESLint + Prettier; follow project config
- Validate user input with Zod before persistence

### Development Workflow Rules

- No branch/commit conventions specified; defer to team standards
- Build: `npm run build` → `dist/`; Vercel deploys static site
- No CI/CD pipeline yet; add `vercel.json` SPA rewrites before first deploy

### Critical Don't-Miss Rules

- **Never:** snake_case in DB (`task_id`), kebab-case for components (`task-card.tsx`), direct mutation (`task.completed = true`)
- **Always:** Immutable updates, Zod validation before persistence, `@/` for imports
- **Timer:** Web Worker for background when tab inactive; document drift behavior
- **Performance:** Virtual scroll for large boards; React.memo/useMemo; lazy load side panels
- **Accessibility:** WCAG 2.1 AA; keyboard nav, focus, screen reader, reduced motion

---

## Usage Guidelines

**For AI Agents:**

- Read this file before implementing any code
- Follow ALL rules exactly as documented
- When in doubt, prefer the more restrictive option
- Update this file if new patterns emerge

**For Humans:**

- Keep this file lean and focused on agent needs
- Update when technology stack changes
- Review quarterly for outdated rules
- Remove rules that become obvious over time

Last Updated: 2026-03-11
