import { type Page, type Locator } from '@playwright/test';

/**
 * Page Object for the main Freelancer Tracking App page.
 * Encapsulates selectors and interactions for the app shell.
 */
export class AppPage {
  readonly page: Page;
  readonly heading: Locator;
  readonly counterValue: Locator;
  readonly incrementButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.heading = page.getByRole('heading', { name: 'Freelancer Tracking App' });
    this.counterValue = page.getByText(/Count:/);
    this.incrementButton = page.getByRole('button', { name: 'Increment Counter' });
  }

  async goto(): Promise<void> {
    await this.page.goto('/');
  }

  async incrementCounter(): Promise<void> {
    await this.incrementButton.click();
  }

  async getCounterValue(): Promise<number> {
    const text = await this.counterValue.textContent();
    const match = text?.match(/\d+/);
    return match ? parseInt(match[0], 10) : 0;
  }
}
