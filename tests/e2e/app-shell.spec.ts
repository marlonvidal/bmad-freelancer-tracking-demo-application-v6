import { test, expect } from '../support/fixtures/merged-fixtures';
import { AppPage } from '../support/page-objects/app-page';

test.describe('App Shell', () => {
  test('should display the application heading', async ({ page }) => {
    // Given the app is loaded
    const appPage = new AppPage(page);
    await appPage.goto();

    // Then the main heading is visible
    await expect(appPage.heading).toBeVisible();
  });

  test('should display the tech stack description', async ({ page }) => {
    // Given the app is loaded
    await page.goto('/');

    // Then the tech stack description is shown
    await expect(page.getByText('Vite + React + TypeScript + Tailwind + shadcn/ui')).toBeVisible();
  });

  test('should increment counter when button is clicked', async ({ page }) => {
    // Given the app is loaded
    const appPage = new AppPage(page);
    await appPage.goto();

    // When the counter is incremented
    await appPage.incrementCounter();

    // Then the counter value increases
    await expect(page.getByText('1')).toBeVisible();
  });

  test('should increment counter multiple times', async ({ page }) => {
    // Given the app is loaded
    const appPage = new AppPage(page);
    await appPage.goto();

    // When the counter is incremented 3 times
    await appPage.incrementCounter();
    await appPage.incrementCounter();
    await appPage.incrementCounter();

    // Then the counter shows 3
    await expect(page.getByText('3')).toBeVisible();
  });

  test('should display all feature checkmarks', async ({ page }) => {
    // Given the app is loaded
    await page.goto('/');

    // Then all features are listed as ready
    await expect(page.getByText('Tailwind CSS styling')).toBeVisible();
    await expect(page.getByText('shadcn/ui components (Button, Card)')).toBeVisible();
    await expect(page.getByText('Path aliases (@/components, @/lib)')).toBeVisible();
    await expect(page.getByText('PWA ready with service worker')).toBeVisible();
  });
});
