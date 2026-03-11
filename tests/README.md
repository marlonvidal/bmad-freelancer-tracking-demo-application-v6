# Test Framework — Freelancer Tracking App

Playwright E2E test suite with Pact.js consumer contract testing.

---

## Quick Start

### Prerequisites

- Node 24+ (see `.nvmrc`)
- Install dependencies: `npm install`
- Install Playwright browsers: `npx playwright install`

### Running Tests

```bash
# Run all E2E tests (headless)
npm run test:e2e

# Run in headed mode (watch the browser)
npm run test:e2e:headed

# Run in UI mode (interactive test explorer)
npm run test:e2e:ui

# Debug a specific test
npm run test:e2e:debug

# Run contract tests
npm run test:pact:consumer
```

### Environment Setup

Copy `.env.example` to `.env` and fill in values:

```bash
cp .env.example .env
```

Key variables:

| Variable | Default | Description |
|---|---|---|
| `BASE_URL` | `http://localhost:5173` | App URL for tests |
| `PACT_BROKER_BASE_URL` | — | PactFlow instance URL |
| `PACT_BROKER_TOKEN` | — | PactFlow API token |

---

## Architecture

```
tests/
├── e2e/                              # Playwright E2E tests
│   ├── app-shell.spec.ts             # App shell / navigation tests
│   ├── task-management.spec.ts       # Data layer tests (localStorage)
│   ├── kanban-board.spec.ts          # Kanban board tests (story 1.4 — skipped until implemented)
│   ├── task-crud.spec.ts             # Task CRUD tests (story 1.5 — skipped until implemented)
│   └── navigation.spec.ts            # Navigation & persistence (story 1.3 — skipped until implemented)
│
├── support/
│   ├── fixtures/
│   │   ├── merged-fixtures.ts        # ⭐ Single test object — import this in all tests
│   │   └── custom-fixtures.ts        # Project-specific fixtures (task, urgentTask, freelancer)
│   │
│   ├── factories/
│   │   ├── task-factory.ts           # Task data factory (faker-based)
│   │   ├── freelancer-factory.ts     # Freelancer data factory
│   │   └── index.ts                  # Re-exports all factories
│   │
│   ├── helpers/
│   │   └── local-storage.ts          # localStorage seeding helpers
│   │
│   └── page-objects/
│       ├── app-page.ts               # Page Object for main app page
│       ├── board-page.ts             # Page Object for Kanban board (story 1.4)
│       └── task-form-page.ts         # Page Object for task create/edit form (story 1.5)
│
└── contract/                         # Pact consumer contract tests
    ├── consumer/
    │   └── get-tasks.pacttest.ts     # Tasks API contract
    └── support/
        ├── pact-config.ts            # PactV4 factory
        ├── provider-states.ts        # Provider state factories
        └── consumer-helpers.ts       # Local pactjs-utils shim
```

### Test Status by Story

| File | Status | Story |
|------|--------|-------|
| `app-shell.spec.ts` | ✅ Active (9 tests) | Stories 1.1–1.2 |
| `task-management.spec.ts` | ✅ Active (8 tests) | Data layer foundation |
| `kanban-board.spec.ts` | ⏸ Skipped (7 tests) | Story 1.4 — remove `test.skip` when implemented |
| `task-crud.spec.ts` | ⏸ Skipped (9 tests) | Story 1.5 — remove `test.skip` when implemented |
| `navigation.spec.ts` | ⏸ Skipped (9 tests) | Story 1.3 — remove `test.skip` when implemented |

---

## Key Patterns

### 1. Always Import from `merged-fixtures.ts`

```typescript
// ✅ Correct — includes network-error-monitor + custom fixtures
import { test, expect } from '../support/fixtures/merged-fixtures';

// ❌ Wrong — missing network monitoring and custom fixtures
import { test, expect } from '@playwright/test';
```

### 2. Use Factories for Test Data

```typescript
import { createTask, createUrgentTask } from '../support/factories';

// Default task
const task = createTask();

// Urgent in-progress task (explicit intent)
const urgentTask = createUrgentTask({ title: 'Fix production bug' });
```

### 3. Seed Data via localStorage (not UI)

```typescript
import { seedTasks } from '../support/helpers/local-storage';

test('shows tasks', async ({ page }) => {
  const tasks = [createTask(), createTask()];
  await seedTasks(page, tasks);  // Fast — bypasses UI setup
  await page.goto('/');
  // ... assertions
});
```

### 4. Use Page Objects for Selectors

```typescript
import { AppPage } from '../support/page-objects/app-page';

test('increments counter', async ({ page }) => {
  const appPage = new AppPage(page);
  await appPage.goto();
  await appPage.incrementCounter();
});
```

### 5. Use `data-testid` for Selectors

When adding new UI elements, always add `data-testid` attributes:

```tsx
<button data-testid="create-task-btn">Create Task</button>
```

Then in tests:

```typescript
await page.getByTestId('create-task-btn').click();
```

---

## Network Error Monitoring

The `network-error-monitor` fixture is auto-enabled via `merged-fixtures.ts`. It automatically fails tests when HTTP 4xx/5xx errors occur during test execution — even if the UI appears to work.

To opt out for tests that intentionally trigger errors:

```typescript
test('handles 404', { annotation: [{ type: 'skipNetworkMonitoring' }] }, async ({ page }) => {
  // Network errors won't fail this test
});
```

---

## Contract Testing (Pact)

Consumer contract tests live in `tests/contract/consumer/` with the `.pacttest.ts` extension.

**Important**: When the app has a real API client, replace `fetch()` calls in contract tests with imports of your actual consumer functions. CDC testing validates YOUR consumer code — not raw HTTP calls.

```bash
# Run contract tests
npm run test:pact:consumer

# Publish pacts to PactFlow
npm run publish:pact

# Check deployment safety
PACTICIPANT=FreelancerTrackingApp npm run can:i:deploy:consumer

# Record deployment
PACTICIPANT=FreelancerTrackingApp npm run record:consumer:deployment
```

---

## CI Integration

The test suite is configured for GitHub Actions:

- **E2E tests**: Run on every PR and push to main
- **Contract tests**: See `.github/workflows/contract-test-consumer.yml`
- **Artifacts**: HTML report, JUnit XML, traces (on failure)

Playwright config automatically:
- Retries failed tests 2x in CI
- Uses 50% of available workers
- Retains traces/screenshots/video on failure

---

## Adding New Tests

1. Create test file in `tests/e2e/` with `.spec.ts` extension
2. Import `test` and `expect` from `../support/fixtures/merged-fixtures`
3. Use factories for test data, page objects for selectors
4. Seed data via `localStorage` helpers, not UI interactions
5. Add `data-testid` attributes to new UI components

---

## Knowledge Base

This framework was scaffolded using the TEA (Test Engineering Automation) framework with the following patterns:

- **Fixture composition**: `@seontechnologies/playwright-utils` + `mergeTests`
- **Network error monitoring**: Auto-detects silent backend failures
- **Data factories**: Faker-based, parallel-safe, override-friendly
- **Pact CDC**: PactV4 builder pattern, `pactjs-utils` conventions
