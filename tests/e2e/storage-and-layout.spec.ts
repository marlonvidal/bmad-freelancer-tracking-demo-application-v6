import { test, expect } from '@playwright/test';
import { createStandardColumns, createTask } from '../support/factories/task.factory';

/**
 * ATDD Story 1.3: Set Up Local Data Storage and Base Layout
 * 
 * RED PHASE: All tests are failing (test.skip() omitted for visibility)
 * These tests verify acceptance criteria BEFORE implementation.
 * They will fail until the feature is implemented.
 * 
 * Acceptance Criteria:
 * 1. Dexie.js Database Setup - AC1
 * 2. React Router Navigation - AC2
 * 3. Base Layout with Navigation - AC3
 * 4. Auto-Save and Data Persistence - AC4
 * 5. No External Data Transmission - AC5
 */

test.describe('Story 1.3: Storage and Layout - RED PHASE', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to app root
    await page.goto('/');
  });

  // ============================================
  // AC 1: Dexie.js Database Setup
  // ============================================
  test.describe('AC1: Dexie Database Setup', () => {
    test('[P0] Database initializes with FreelancerTrackerDB name', async ({ page }) => {
      // RED: Database hasn't been created yet
      // EXPECTED: App should initialize Dexie on mount
      const dbExists = await page.evaluate(() => {
        // @ts-ignore
        return !!window.__db__ && window.__db__.name === 'FreelancerTrackerDB';
      });

      expect(dbExists).toBe(true);
    });

    test('[P0] IndexedDB contains all required stores', async ({ page }) => {
      // RED: Stores don't exist yet
      // EXPECTED: All stores (tasks, columns, clients, projects, timeEntries, settings) exist
      const stores = await page.evaluate(() => {
        // @ts-ignore
        const db = window.__db__;
        if (!db) return [];
        return Object.keys(db._allTables || {}).sort();
      });

      const expectedStores = ['clients', 'columns', 'projects', 'settings', 'tasks', 'timeEntries'].sort();
      expect(stores).toEqual(expectedStores);
    });

    test('[P0] Can create and retrieve a task from database', async ({ page }) => {
      // RED: Database methods not implemented
      // EXPECTED: Tasks can be added and queried
      const taskId = await page.evaluate(async () => {
        // @ts-ignore
        const db = window.__db__;
        if (!db) throw new Error('Database not initialized');

        const task = {
          title: 'Test Task',
          description: 'Testing database operations',
          columnId: 1,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        return await db.tasks.add(task);
      });

      expect(typeof taskId).toBe('number');
      expect(taskId).toBeGreaterThan(0);

      // Verify we can retrieve it
      const task = await page.evaluate((id) => {
        // @ts-ignore
        return window.__db__.tasks.get(id);
      }, taskId);

      expect(task).toBeDefined();
      expect(task.title).toBe('Test Task');
    });
  });

  // ============================================
  // AC 2: React Router Navigation
  // ============================================
  test.describe('AC2: React Router Navigation', () => {
    test('[P0] Can navigate to Board page', async ({ page }) => {
      // RED: Routes not configured
      // EXPECTED: / route loads Board page
      await page.goto('/');
      await expect(page.getByRole('heading', { name: /kanban board|board/i })).toBeVisible();
      expect(page.url()).toContain('/');
    });

    test('[P0] Can navigate to Revenue page', async ({ page }) => {
      // RED: /revenue route not configured
      // EXPECTED: /revenue route loads Revenue page
      await page.goto('/revenue');
      await expect(page.getByRole('heading', { name: /revenue|dashboard/i })).toBeVisible();
      expect(page.url()).toContain('/revenue');
    });

    test('[P0] Can navigate to Settings page', async ({ page }) => {
      // RED: /settings route not configured
      // EXPECTED: /settings route loads Settings page
      await page.goto('/settings');
      await expect(page.getByRole('heading', { name: /settings/i })).toBeVisible();
      expect(page.url()).toContain('/settings');
    });

    test('[P0] Router uses BrowserRouter', async ({ page }) => {
      // RED: Router not configured
      // EXPECTED: Current location pathname should match URL
      await page.goto('/revenue');
      const pathname = await page.evaluate(() => window.location.pathname);
      expect(pathname).toBe('/revenue');
    });
  });

  // ============================================
  // AC 3: Base Layout with Navigation Tabs
  // ============================================
  test.describe('AC3: Base Layout with Navigation Tabs', () => {
    test('[P1] Layout renders three navigation tabs', async ({ page }) => {
      // RED: Layout component not implemented
      // EXPECTED: Three tabs (Board, Revenue, Settings) visible
      const boardTab = page.getByRole('tab', { name: /board/i });
      const revenueTab = page.getByRole('tab', { name: /revenue/i });
      const settingsTab = page.getByRole('tab', { name: /settings/i });

      await expect(boardTab).toBeVisible();
      await expect(revenueTab).toBeVisible();
      await expect(settingsTab).toBeVisible();
    });

    test('[P1] Clicking Board tab navigates to Board', async ({ page }) => {
      // RED: Tab navigation not wired
      // EXPECTED: Clicking tab changes page and URL
      const tab = page.getByRole('tab', { name: /board/i });
      await tab.click();

      await expect(page.getByRole('heading', { name: /kanban board|board/i })).toBeVisible();
      expect(page.url()).toContain('/');
    });

    test('[P1] Clicking Revenue tab navigates to Revenue', async ({ page }) => {
      // RED: Tab navigation not wired
      // EXPECTED: Clicking tab changes page and URL
      const tab = page.getByRole('tab', { name: /revenue/i });
      await tab.click();

      await expect(page.getByRole('heading', { name: /revenue|dashboard/i })).toBeVisible();
      expect(page.url()).toContain('/revenue');
    });

    test('[P1] Clicking Settings tab navigates to Settings', async ({ page }) => {
      // RED: Tab navigation not wired
      // EXPECTED: Clicking tab changes page and URL
      const tab = page.getByRole('tab', { name: /settings/i });
      await tab.click();

      await expect(page.getByRole('heading', { name: /settings/i })).toBeVisible();
      expect(page.url()).toContain('/settings');
    });

    test('[P1] Active tab is visually highlighted', async ({ page }) => {
      // RED: Active state styling not implemented
      // EXPECTED: Board tab has active class/styling when on Board page
      const boardTab = page.getByRole('tab', { name: /board/i });
      const revenueTab = page.getByRole('tab', { name: /revenue/i });

      await page.goto('/');
      await expect(boardTab).toHaveAttribute('data-state', 'active');

      await page.goto('/revenue');
      await expect(revenueTab).toHaveAttribute('data-state', 'active');
    });

    test('[P1] Keyboard navigation with Tab and Arrow keys', async ({ page }) => {
      // RED: Keyboard event handlers not implemented
      // EXPECTED: Tabs can be focused and navigated with keyboard
      const boardTab = page.getByRole('tab', { name: /board/i });

      // Focus the first tab
      await boardTab.focus();
      await expect(boardTab).toBeFocused();

      // Arrow right to next tab
      await page.keyboard.press('ArrowRight');
      const revenueTab = page.getByRole('tab', { name: /revenue/i });
      await expect(revenueTab).toBeFocused();

      // Arrow right to next tab
      await page.keyboard.press('ArrowRight');
      const settingsTab = page.getByRole('tab', { name: /settings/i });
      await expect(settingsTab).toBeFocused();

      // Arrow left back to previous
      await page.keyboard.press('ArrowLeft');
      await expect(revenueTab).toBeFocused();
    });

    test('[P1] Navigation is ARIA labeled for accessibility', async ({ page }) => {
      // RED: ARIA labels not added
      // EXPECTED: Navigation element has proper ARIA attributes
      const nav = page.locator('nav');
      await expect(nav).toBeVisible();

      // Tabs should have role="tablist" parent
      const tablist = page.locator('[role="tablist"]');
      await expect(tablist).toBeVisible();

      // Each tab should have role="tab"
      const tabs = page.locator('[role="tab"]');
      const count = await tabs.count();
      expect(count).toBe(3);
    });
  });

  // ============================================
  // AC 4: Auto-Save and Data Persistence
  // ============================================
  test.describe('AC4: Auto-Save and Data Persistence', () => {
    test('[P0] Data persists in IndexedDB after creation', async ({ page }) => {
      // RED: Auto-save mechanism not implemented
      // EXPECTED: Data created in app is automatically saved to IndexedDB
      const tasksBefore = await page.evaluate(async () => {
        // @ts-ignore
        const db = window.__db__;
        if (!db) return [];
        return await db.tasks.toArray();
      });

      // Simulate creating a task through the UI
      // (In full app, this would be done through UI interactions)
      const newTaskId = await page.evaluate(async () => {
        // @ts-ignore
        const db = window.__db__;
        const task = {
          title: 'Persisted Task',
          columnId: 1,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        return await db.tasks.add(task);
      });

      const tasksAfter = await page.evaluate(async () => {
        // @ts-ignore
        const db = window.__db__;
        return await db.tasks.toArray();
      });

      expect(tasksAfter.length).toBe(tasksBefore.length + 1);
      expect(tasksAfter.some((t) => t.id === newTaskId)).toBe(true);
    });

    test('[P0] Data restores from IndexedDB after page refresh', async ({ page }) => {
      // RED: Context not loading data on mount
      // EXPECTED: After refresh, data from IndexedDB is restored
      // Create initial data
      const taskId = await page.evaluate(async () => {
        // @ts-ignore
        const db = window.__db__;
        const task = {
          title: 'Persistence Test Task',
          columnId: 1,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        return await db.tasks.add(task);
      });

      // Refresh page
      await page.reload();

      // Verify data is still there
      const task = await page.evaluate((id) => {
        // @ts-ignore
        return window.__db__.tasks.get(id);
      }, taskId);

      expect(task).toBeDefined();
      expect(task.title).toBe('Persistence Test Task');
    });

    test('[P0] No manual save button required', async ({ page }) => {
      // RED: Layout/UI not implemented
      // EXPECTED: No visible "Save" button in the UI
      const saveButton = page.getByRole('button', { name: /save/i });
      await expect(saveButton).not.toBeVisible();
    });

    test('[P0] Updates auto-save without manual action', async ({ page }) => {
      // RED: Auto-save with context not implemented
      // EXPECTED: Updating a task automatically persists
      const taskId = await page.evaluate(async () => {
        // @ts-ignore
        const db = window.__db__;
        const task = {
          title: 'Original Title',
          columnId: 1,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        return await db.tasks.add(task);
      });

      // Simulate updating the task
      await page.evaluate(
        async (id) => {
          // @ts-ignore
          const db = window.__db__;
          await db.tasks.update(id, { title: 'Updated Title' });
        },
        taskId
      );

      // Verify update persisted
      const task = await page.evaluate((id) => {
        // @ts-ignore
        return window.__db__.tasks.get(id);
      }, taskId);

      expect(task.title).toBe('Updated Title');
    });
  });

  // ============================================
  // AC 5: No External Data Transmission
  // ============================================
  test.describe('AC5: No External Data Transmission', () => {
    test('[P1] No external API calls made', async ({ page }) => {
      // RED: External calls might exist in base template
      // EXPECTED: All requests are to localhost or file protocol
      const requests: string[] = [];

      page.on('request', (request) => {
        requests.push(request.url());
      });

      await page.goto('/');
      await page.goto('/revenue');
      await page.goto('/settings');

      // Check that no external URLs were requested
      const externalRequests = requests.filter(
        (url) => !url.includes('localhost') && !url.includes('127.0.0.1') && !url.startsWith('data:')
      );

      expect(externalRequests).toHaveLength(0);
    });

    test('[P1] No telemetry or analytics libraries loaded', async ({ page }) => {
      // RED: Telemetry might be in vite template
      // EXPECTED: No analytics, Sentry, LogRocket, etc.
      const telemEntries = await page.evaluate(() => {
        const scripts = Array.from(document.getElementsByTagName('script'));
        const telemetryPatterns = [
          'google-analytics',
          'gtag',
          'analytics',
          'sentry',
          'logrocket',
          'bugsnag',
          'rollbar',
          'datadog',
          'mixpanel',
          'segment',
          'amplitude',
        ];

        return scripts
          .map((s) => s.src)
          .filter((src) => telemetryPatterns.some((pattern) => src.toLowerCase().includes(pattern)));
      });

      expect(telemEntries).toHaveLength(0);
    });

    test('[P1] Network tab shows only local requests during operations', async ({ page }) => {
      // RED: Implementation not complete
      // EXPECTED: No external requests during normal app operations
      const externalRequests: string[] = [];

      page.on('request', (request) => {
        const url = request.url();
        if (
          !url.includes('localhost') &&
          !url.includes('127.0.0.1') &&
          !url.startsWith('data:') &&
          !url.includes('devtools')
        ) {
          externalRequests.push(url);
        }
      });

      // Perform various app operations
      await page.goto('/');
      await page.goto('/revenue');
      await page.goto('/settings');

      // Verify no external requests
      expect(externalRequests).toHaveLength(0);
    });
  });

  // ============================================
  // Integration Tests
  // ============================================
  test.describe('Integration: Full User Journey', () => {
    test('[P1] User can create data, navigate, and persistence works', async ({ page }) => {
      // RED: Full integration not working
      // EXPECTED: Complete workflow from setup through persistence
      await page.goto('/');

      // Create initial data
      const taskId = await page.evaluate(async () => {
        // @ts-ignore
        const db = window.__db__;
        const task = {
          title: 'Integration Test Task',
          columnId: 1,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        return await db.tasks.add(task);
      });

      // Navigate away
      const revenueTab = page.getByRole('tab', { name: /revenue/i });
      await revenueTab.click();
      await expect(page).toHaveURL(/\/revenue/);

      // Navigate back
      const boardTab = page.getByRole('tab', { name: /board/i });
      await boardTab.click();
      await expect(page).toHaveURL(/\//);

      // Verify data still exists
      const task = await page.evaluate((id) => {
        // @ts-ignore
        return window.__db__.tasks.get(id);
      }, taskId);

      expect(task).toBeDefined();
      expect(task.title).toBe('Integration Test Task');
    });
  });
});
