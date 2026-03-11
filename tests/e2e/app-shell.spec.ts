import { test, expect } from '../support/fixtures/merged-fixtures';
import { AppPage } from '../support/page-objects/app-page';

test.describe('App Shell', () => {
  test('[P1] should display the application heading', async ({ page }) => {
    // Given the app is loaded
    const appPage = new AppPage(page);
    await appPage.goto();

    // Then the main heading is visible
    await expect(appPage.heading).toBeVisible();
  });

  test('[P2] should display the tech stack description', async ({ page }) => {
    // Given the app is loaded
    await page.goto('/');

    // Then the tech stack description is shown
    await expect(page.getByText('Vite + React + TypeScript + Tailwind + shadcn/ui')).toBeVisible();
  });

  test('[P2] should increment counter when button is clicked', async ({ page }) => {
    // Given the app is loaded
    const appPage = new AppPage(page);
    await appPage.goto();

    // When the counter is incremented
    await appPage.incrementCounter();

    // Then the counter value increases
    await expect(page.getByText('1')).toBeVisible();
  });

  test('[P2] should increment counter multiple times', async ({ page }) => {
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

  test('[P2] should display all feature checkmarks', async ({ page }) => {
    // Given the app is loaded
    await page.goto('/');

    // Then all features are listed as ready
    await expect(page.getByText('Tailwind CSS styling')).toBeVisible();
    await expect(page.getByText('shadcn/ui components (Button, Card)')).toBeVisible();
    await expect(page.getByText('Path aliases (@/components, @/lib)')).toBeVisible();
    await expect(page.getByText('PWA ready with service worker')).toBeVisible();
  });

  test('[P2] should reset counter on page reload', async ({ page }) => {
    // Given the counter has been incremented
    const appPage = new AppPage(page);
    await appPage.goto();
    await appPage.incrementCounter();
    await appPage.incrementCounter();
    await expect(page.getByText('2')).toBeVisible();

    // When the page is reloaded
    await page.reload();

    // Then the counter resets to 0 (counter is in-memory state, not persisted)
    await expect(page.getByText('Count:')).toBeVisible();
    await expect(page.getByText('0')).toBeVisible();
  });

  test('[P2] should have accessible increment button', async ({ page }) => {
    // Given the app is loaded
    const appPage = new AppPage(page);
    await appPage.goto();

    // Then the increment button has correct accessibility attributes
    const button = page.getByRole('button', { name: 'Increment Counter' });
    await expect(button).toBeVisible();
    await expect(button).toBeEnabled();
  });

  test('[P2] should display page title in browser tab', async ({ page }) => {
    // Given the app is loaded
    await page.goto('/');

    // Then the page title is set correctly
    await expect(page).toHaveTitle('Freelancer Tracking App');
  });

  test('[P2] should render logo images', async ({ page }) => {
    // Given the app is loaded
    await page.goto('/');

    // Then the Vite and React logos are present
    await expect(page.getByAltText('Vite logo')).toBeVisible();
    await expect(page.getByAltText('React logo')).toBeVisible();
  });
});
