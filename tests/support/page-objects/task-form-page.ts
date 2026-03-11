import { type Page, type Locator } from '@playwright/test';
import { type TaskPriority } from '../factories/task-factory';

/**
 * Page Object for the Task Create/Edit Form.
 * Encapsulates selectors and interactions for the task form modal/panel.
 *
 * Activation note: Update selectors once story 1.5 is implemented.
 * Add data-testid attributes to form fields for reliable selection.
 */
export class TaskFormPage {
  readonly page: Page;
  readonly titleInput: Locator;
  readonly descriptionInput: Locator;
  readonly prioritySelect: Locator;
  readonly dueDateInput: Locator;
  readonly estimatedHoursInput: Locator;
  readonly tagInput: Locator;
  readonly submitButton: Locator;
  readonly cancelButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.titleInput = page.getByRole('textbox', { name: /title/i });
    this.descriptionInput = page.getByRole('textbox', { name: /description/i });
    this.prioritySelect = page.getByRole('combobox', { name: /priority/i });
    this.dueDateInput = page.getByLabel(/due date/i);
    this.estimatedHoursInput = page.getByRole('spinbutton', { name: /estimated hours/i });
    this.tagInput = page.getByRole('textbox', { name: /tag/i });
    this.submitButton = page.getByRole('button', { name: /save|create|submit/i });
    this.cancelButton = page.getByRole('button', { name: /cancel/i });
  }

  async fillTitle(title: string): Promise<void> {
    await this.titleInput.fill(title);
  }

  async clearTitle(): Promise<void> {
    await this.titleInput.clear();
  }

  async fillDescription(description: string): Promise<void> {
    await this.descriptionInput.fill(description);
  }

  async selectPriority(priority: TaskPriority): Promise<void> {
    await this.prioritySelect.selectOption(priority);
  }

  async fillDueDate(date: string): Promise<void> {
    await this.dueDateInput.fill(date);
  }

  async fillEstimatedHours(hours: number): Promise<void> {
    await this.estimatedHoursInput.fill(String(hours));
  }

  async addTag(tag: string): Promise<void> {
    await this.tagInput.fill(tag);
    await this.page.keyboard.press('Enter');
  }

  async submit(): Promise<void> {
    await this.submitButton.click();
  }

  async cancel(): Promise<void> {
    await this.cancelButton.click();
  }
}
