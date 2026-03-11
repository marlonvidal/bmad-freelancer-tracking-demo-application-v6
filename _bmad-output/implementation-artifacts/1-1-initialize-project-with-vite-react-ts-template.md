# Story 1.1: Initialize Project with Vite React-TS Template

**Status:** ready-for-dev

**Story ID:** 1.1  
**Story Key:** 1-1-initialize-project-with-vite-react-ts-template  
**Epic:** 1 - Foundation & Core Kanban  
**Date Created:** 2026-03-11

---

## Story

As a **developer**,  
I want to **initialize the project with the official Vite react-ts template**,  
so that **I have a runnable React + TypeScript foundation aligned with the Architecture**.

---

## Acceptance Criteria

### AC 1: Project Initialization
**Given** an empty or existing project directory  
**When** I run `npm create vite@latest . -- --template react-ts`  
**Then** the project is initialized with React 18+, TypeScript, Vite 6.x, and ES modules

### AC 2: Development Server
**Given** the initialized project  
**When** I run `npm run dev`  
**Then** the development server starts and the app is accessible on localhost

### AC 3: Production Build
**Given** the initialized project  
**When** I run `npm run build`  
**Then** a production build is created without errors

### AC 4: No Telemetry
**Given** the initialized project  
**When** the app runs  
**Then** the project has no telemetry or external data transmission (FR36, NFR6)

---

## Tasks / Subtasks

- [ ] **Initialize Vite project** (AC 1)
  - [ ] Run `npm create vite@latest . -- --template react-ts`
  - [ ] Verify all npm packages are installed
  - [ ] Confirm `package.json` has React 18+, Vite 6.x, TypeScript
  
- [ ] **Verify dev server** (AC 2)
  - [ ] Run `npm run dev`
  - [ ] Confirm app launches without errors
  - [ ] Verify localhost access (typically http://localhost:5173)
  
- [ ] **Verify production build** (AC 3)
  - [ ] Run `npm run build`
  - [ ] Confirm `dist/` folder is created with bundle
  - [ ] Run `npm run preview` to test production build locally
  
- [ ] **Validate no telemetry** (AC 4)
  - [ ] Review generated `package.json` for telemetry packages (none should be present)
  - [ ] Check `vite.config.ts` for analytics code (should be none)
  - [ ] Confirm no external API calls are made by the default template

---

## Developer Context

### Epic 1 Overview: Foundation & Core Kanban

This epic establishes the foundational React + TypeScript application with Vite. Story 1.1 is the **first critical story** and unblocks all subsequent work in this epic and the entire project.

**What follows after this story:**
- Story 1.2: Tailwind CSS, shadcn/ui, PWA support, path aliases
- Story 1.3: Dexie.js local storage, React Router, base layout
- Story 1.4+: Kanban board, task management, drag-and-drop

### Key Architecture Requirements for This Story

From the Architecture document, these are **CRITICAL** for this story:

1. **Vite react-ts Template (Official)**
   - **Why Selected:** Official, minimal, well-maintained, aligns with PRD stack
   - **Initialization Command:** `npm create vite@latest . -- --template react-ts`
   - **Use `.` for current directory** (do not create a subfolder)

2. **Technology Versions (Per Architecture)**
   - React: 18+
   - Vite: 6.x
   - TypeScript: strict mode
   - Node: Recommended 18+ (for npm create)

3. **Project Structure Foundation**
   - Generated structure includes:
     - `src/` with `main.tsx`, `App.tsx`, `index.css`
     - `public/` for static assets
     - `vite-env.d.ts` for Vite types
     - `vite.config.ts`, `tsconfig.json`

4. **Development Experience**
   - `npm run dev` starts dev server with HMR
   - `npm run build` creates production bundle
   - `npm run preview` serves production build locally

5. **NO Telemetry**
   - The official Vite template contains NO telemetry
   - Verify this is maintained in the generated project

### Implementation Sequence Context

```
Story 1.1 (THIS STORY) - Initialize Vite react-ts ✓
    ↓ (unblocks)
Story 1.2 - Add Tailwind, shadcn/ui, PWA, path aliases
    ↓ (unblocks)
Story 1.3 - Add Dexie.js, React Router, base layout
    ↓ (unblocks)
Story 1.4+ - Kanban board, timer, clients, etc.
```

**This story MUST complete before Story 1.2 can begin.**

---

## Technical Requirements

### Required Versions (Locked per Architecture)

| Technology | Version | Rationale |
|-----------|---------|-----------|
| React | 18+ | Modern hooks, concurrent features, JSX transform |
| TypeScript | 5.x+ (latest stable) | Type safety, strict mode |
| Vite | 6.x | Latest stable; fast HMR; ESM-native |
| Node.js | 18+ | npm create support; ES modules |

### Generated File Structure

After running the Vite template, you should have:

```
.
├── index.html              # Entry point
├── package.json            # Dependencies
├── package-lock.json       # Lock file
├── vite.config.ts          # Vite configuration
├── tsconfig.json           # TypeScript config
├── tsconfig.app.json       # App-specific TypeScript config
├── tsconfig.node.json      # Node TypeScript config
├── src/
│   ├── main.tsx            # React DOM render
│   ├── App.tsx             # Root component
│   ├── App.css             # App styles (plain CSS)
│   ├── index.css           # Global styles
│   └── vite-env.d.ts       # Vite type definitions
└── public/
    └── vite.svg            # Default logo (can be replaced)
```

### Build Scripts

After initialization, verify `package.json` has these scripts:

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0"  // May be present
  }
}
```

### Dependencies to Expect

**Core dependencies:**
- `react` (18+)
- `react-dom` (18+)

**Dev dependencies:**
- `@types/react`
- `@types/react-dom`
- `@vitejs/plugin-react` (already includes JSX transform)
- `typescript`
- `vite`

**No telemetry packages should be present**

---

## Architecture Compliance

### Naming Conventions

This story doesn't introduce components/hooks yet, but the generated structure follows:

- **Config files:** `vite.config.ts`, `tsconfig.json` (lowercase with extensions)
- **Entry:** `main.tsx`, `App.tsx` (PascalCase for components)
- **Styles:** `index.css`, `App.css` (camelCase/descriptive)

### Project Organization

Generated structure aligns with the planned architecture from the Architecture document:

```
src/
├── main.tsx                # Entry point (will add providers later)
├── App.tsx                 # Root component (will add Router here in Story 1.3)
├── index.css               # Global styles (Tailwind will be added in Story 1.2)
└── vite-env.d.ts           # Vite types
```

**Future stories will add:**
- `src/components/` — UI components
- `src/contexts/` — Context providers
- `src/hooks/` — Custom hooks
- `src/services/` — Business logic (Dexie, timer, export)
- `src/utils/` — Utility functions
- `src/types/` — TypeScript types
- `src/routes/` — Route definitions

### Error Handling & Validation

The generated template includes:

- **React Error Boundary support:** (manually added in Story 1.3)
- **TypeScript strict mode:** Enforces type safety
- **ESLint config:** (if included) helps catch common mistakes

---

## File Structure Requirements

### Files to Verify/Modify

**DO NOT MODIFY** the generated files in this story. Simply verify they are correct.

- ✅ `vite.config.ts` — Should be minimal; no modifications needed
- ✅ `tsconfig.json` — Should be correct; no modifications needed
- ✅ `package.json` — Verify dependencies; no modifications needed

**Next story (1.2) will:**
- Add Tailwind CSS configuration
- Add shadcn/ui setup
- Configure vite-plugin-pwa
- Add path aliases (`@/`)

---

## Testing Requirements

### Manual Verification Tests

1. **Initialization Test**
   ```bash
   npm create vite@latest . -- --template react-ts
   npm install
   ```
   - ✅ All packages install without errors
   - ✅ No warnings about security issues
   - ✅ `node_modules/` folder is created

2. **Development Server Test**
   ```bash
   npm run dev
   ```
   - ✅ Server starts (typically on `http://localhost:5173`)
   - ✅ Browser opens to default Vite React app
   - ✅ No console errors
   - ✅ App displays the Vite + React logo

3. **Production Build Test**
   ```bash
   npm run build
   ```
   - ✅ Build completes without errors
   - ✅ `dist/` folder is created
   - ✅ `dist/index.html` exists
   - ✅ No TypeScript compilation errors

4. **Preview Build Test**
   ```bash
   npm run preview
   ```
   - ✅ Production build can be previewed locally
   - ✅ App displays correctly
   - ✅ No console errors

5. **No Telemetry Test**
   - ✅ `package.json` has NO telemetry packages
   - ✅ Network tab (DevTools) shows NO outbound requests to analytics services
   - ✅ `vite.config.ts` has NO external analytics code

### Code Quality Checks

- ✅ TypeScript strict mode compilation succeeds
- ✅ ESLint passes (if configured)
- ✅ No console errors or warnings in dev mode

---

## Dev Notes

### Critical Implementation Notes

1. **Run in Project Root**
   - Execute `npm create vite@latest . -- --template react-ts` in the **project root** (the current folder is `.`)
   - **Do NOT** create a subfolder unless necessary for your setup

2. **Post-Initialization Cleanup (Optional)**
   - You may delete `public/vite.svg` (will be replaced with PWA icons later)
   - You may delete `src/App.css` (Tailwind will be added in Story 1.2)
   - Keep `src/index.css` for global styles (Tailwind will be imported here)

3. **Environment Setup**
   - Create `.env.local` if needed (will be used in future stories)
   - Add `.env.local` to `.gitignore` (should already be there)

4. **Version Pinning**
   - The `npm create vite` command uses the latest `@latest` version of the template
   - This ensures you get the current Vite 6.x + React 18+ versions
   - Lock versions in `package-lock.json` for reproducibility

### Known Template Behavior

1. **ESLint Configuration**
   - The template may include ESLint config; it's optional for this story
   - Linting errors are not blockers for this story

2. **React Fast Refresh**
   - HMR (Hot Module Replacement) is enabled by default
   - Code changes will reflect immediately in the browser

3. **CSS Handling**
   - Plain CSS by default (no CSS-in-JS)
   - Tailwind CSS will be added in Story 1.2

### Project Structure Notes

Alignment with the planned project structure from the Architecture document:

- **This story creates:** Base structure from Vite template
- **Story 1.2 adds:** Tailwind, shadcn/ui, PWA, path aliases
- **Story 1.3 adds:** Dexie, React Router, base Layout
- **Later stories add:** Feature components in `src/components/`

### References

- [Vite Official Docs](https://vitejs.dev/) — Latest Vite documentation and guides
- [React Official Docs](https://react.dev/) — React 18+ documentation
- [TypeScript Docs](https://www.typescriptlang.org/docs/) — TypeScript strict mode and configuration
- **Architecture Document:** `_bmad-output/planning-artifacts/architecture.md` — Full architectural decisions and structure

**Architecture Sections Referenced:**
- Starter Template Evaluation (Section 2)
- Selected Starter: Vite react-ts (Section 2.2)
- Implementation Sequence (Section 3.2)
- Project Structure & Boundaries (Section 4)

---

## Acceptance Criteria Mapping

| AC # | Requirement | How to Verify |
|------|-------------|---------------|
| 1 | React 18+, TypeScript, Vite 6.x, ES modules | Check `package.json`, `vite.config.ts`, `tsconfig.json` |
| 2 | `npm run dev` works | Run command; verify localhost access |
| 3 | `npm run build` works | Run command; verify `dist/` created; `npm run preview` |
| 4 | No telemetry | Verify no telemetry packages; DevTools network tab |

---

## Known Constraints & Gotchas

1. **Node Version**
   - The `npm create vite` command requires Node.js 16+ (recommended 18+)
   - Verify your Node version: `node --version`

2. **Directory State**
   - If running in a directory with existing files, Vite will warn about conflicts
   - Ensure the directory is clean or review conflicts carefully

3. **Lock File**
   - `package-lock.json` will be generated; commit this to version control
   - Do NOT delete `package-lock.json`

4. **Port Already in Use**
   - If `localhost:5173` is already in use, Vite will try the next available port
   - Check console output for the actual port

5. **TypeScript Configuration**
   - The generated `tsconfig.json` is already configured correctly
   - Do NOT modify it unless Architecture requires changes

---

## Success Criteria

This story is **complete** when:

1. ✅ `npm create vite@latest . -- --template react-ts` runs successfully
2. ✅ `npm install` completes without errors
3. ✅ `npm run dev` starts the development server
4. ✅ `npm run build` creates a production build
5. ✅ `npm run preview` allows previewing the production build
6. ✅ No telemetry packages are present
7. ✅ All generated files match the expected structure
8. ✅ TypeScript strict mode compilation succeeds
9. ✅ No console errors or warnings in development
10. ✅ Project is ready for Story 1.2 (Tailwind, shadcn/ui, PWA, path aliases)

---

## Story Completion Status

**Status:** ready-for-dev

**Prepared by:** Ultimate Story Context Engine  
**Analysis Completed:** 2026-03-11  
**Ready for Development:** Yes

**Notes:**
- This story is a critical foundation story
- All subsequent stories depend on successful completion
- Straightforward initialization; no code complexity at this stage
- Estimated effort: 10-15 minutes
- Next story (1.2) can begin immediately after verification

**Developer Instructions:**
1. Read this entire story document
2. Execute the Vite initialization command
3. Verify all acceptance criteria
4. Commit the generated code to git
5. Proceed to Story 1.2
