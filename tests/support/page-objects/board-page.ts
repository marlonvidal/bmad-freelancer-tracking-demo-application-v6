import { type Page, type Locator } from '@playwright/test';
import { TaskFormPage } from './task-form-page';

/**
 * Page Object for the Kanban Board page.
 * Encapsulates selectors and interactions for the board and its columns.
 *
 * Activation note: Update selectors once story 1.4 is implemented.
 * Add data-testid="column-{name}" and data-testid="task-card-{title}" to components.
 */
export class BoardPage {
  readonly page: Page;
  readonly boardContainer: Locator;
  readonly addColumnButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.boardContainer = page.getByTestId('kanban-board');
    this.addColumnButton = page.getByRole('button', { name: /add column/i });
  }

  async goto(): Promise<void> {
    await this.page.goto('/board');
  }

  getColumn(name: string): Locator {
    return this.page.getByTestId(`column-${name.toLowerCase().replace(/\s+/g, '-')}`);
  }

  getTaskCard(title: string): Locator {
    return this.page.getByTestId(`task-card`).filter({ hasText: title });
  }

  async openNewTaskForm(): Promise<TaskFormPage> {
    await this.page.getByRole('button', { name: /add task|new task|\+/i }).first().click();
    return new TaskFormPage(this.page);
  }

  async openTaskEditForm(taskTitle: string): Promise<TaskFormPage> {
    const card = this.getTaskCard(taskTitle);
    await card.getByRole('button', { name: /edit/i }).click();
    return new TaskFormPage(this.page);
  }

  async deleteTask(taskTitle: string): Promise<void> {
    const card = this.getTaskCard(taskTitle);
    await card.getByRole('button', { name: /delete/i }).click();
    // Confirm deletion if a dialog appears
    const confirmButton = this.page.getByRole('button', { name: /confirm|yes|delete/i });
    if (await confirmButton.isVisible()) {
      await confirmButton.click();
    }
  }

  async initiateDeleteTask(taskTitle: string): Promise<void> {
    const card = this.getTaskCard(taskTitle);
    await card.getByRole('button', { name: /delete/i }).click();
  }

  async cancelDelete(): Promise<void> {
    await this.page.getByRole('button', { name: /cancel|no/i }).click();
  }

  async addColumn(name: string): Promise<void> {
    await this.addColumnButton.click();
    await this.page.getByRole('textbox', { name: /column name/i }).fill(name);
    await this.page.getByRole('button', { name: /add|create|save/i }).click();
  }

  async renameColumn(currentName: string, newName: string): Promise<void> {
    const column = this.getColumn(currentName);
    await column.getByRole('button', { name: /rename|edit/i }).click();
    const input = this.page.getByRole('textbox', { name: /column name/i });
    await input.clear();
    await input.fill(newName);
    await this.page.getByRole('button', { name: /save|confirm/i }).click();
  }

  async deleteColumn(name: string): Promise<void> {
    const column = this.getColumn(name);
    await column.getByRole('button', { name: /delete column/i }).click();
    const confirmButton = this.page.getByRole('button', { name: /confirm|yes|delete/i });
    if (await confirmButton.isVisible()) {
      await confirmButton.click();
    }
  }
}
