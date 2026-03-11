import { test as base, Page, expect } from '@playwright/test';
import * as indexedDBAPI from 'fake-indexeddb';

/**
 * Kanban Board Test Fixtures for ATDD Tests
 * 
 * Provides pre-configured browser context with:
 * - Clean IndexedDB setup/teardown
 * - Sample data factories
 * - Database state helpers
 * - Common wait/navigation utilities
 */

interface KanbanBoardFixtures {
  kanbanBoard: KanbanBoardPageHelper;
  cleanDatabase: void;
}

class KanbanBoardPageHelper {
  constructor(private page: Page) {}

  /**
   * Navigate to the board page
   */
  async navigateToBoard(): Promise<void> {
    await this.page.goto('/');
    // Wait for navigation to complete
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Open the Add Column dialog
   */
  async openAddColumnDialog(): Promise<void> {
    const addButton = this.page.getByRole('button', { name: /add column/i });
    await addButton.click();
    
    const dialog = this.page.getByRole('dialog', { name: /add.*column/i });
    await expect(dialog).toBeVisible();
  }

  /**
   * Create a column by name
   */
  async createColumn(name: string): Promise<void> {
    await this.openAddColumnDialog();
    
    const dialog = this.page.getByRole('dialog', { name: /add.*column/i });
    const input = dialog.getByRole('textbox', { name: /column name/i });
    await input.fill(name);
    
    const submitButton = dialog.getByRole('button', { name: /create|add|submit/i });
    await submitButton.click();
    
    // Wait for dialog to close and column to render
    await expect(dialog).not.toBeVisible();
    await this.page.waitForSelector(`[data-testid="column-${name}"]`);
  }

  /**
   * Get column count
   */
  async getColumnCount(): Promise<number> {
    const columns = this.page.getByTestId(/^column-/);
    return columns.count();
  }

  /**
   * Get all column names in order
   */
  async getColumnNames(): Promise<string[]> {
    const columns = this.page.getByTestId(/^column-/);
    const names: string[] = [];
    
    const count = await columns.count();
    for (let i = 0; i < count; i++) {
      const testId = await columns.nth(i).getAttribute('data-testid');
      if (testId) {
        // Extract name from data-testid="column-{name}"
        const name = testId.replace('column-', '');
        names.push(name);
      }
    }
    
    return names;
  }

  /**
   * Delete a column and confirm
   */
  async deleteColumn(columnName: string): Promise<void> {
    const column = this.page.getByTestId(`column-${columnName}`);
    const deleteButton = column.getByRole('button', { name: /delete|remove|x/i });
    await deleteButton.click();
    
    const confirmDialog = this.page.getByRole('dialog', { name: /confirm|delete|remove/i });
    await expect(confirmDialog).toBeVisible();
    
    const confirmButton = confirmDialog.getByRole('button', { name: /yes|confirm|delete/i });
    await confirmButton.click();
    
    await expect(confirmDialog).not.toBeVisible();
  }

  /**
   * Rename a column inline
   */
  async renameColumn(oldName: string, newName: string): Promise<void> {
    const column = this.page.getByTestId(`column-${oldName}`);
    const header = column.getByRole('heading').first();
    
    await header.click();
    
    const input = header.locator('input[type="text"]');
    await expect(input).toBeVisible();
    
    await input.clear();
    await input.fill(newName);
    
    await this.page.keyboard.press('Enter');
    
    // Wait for new column element to be available
    await this.page.waitForSelector(`[data-testid="column-${newName}"]`);
  }

  /**
   * Drag column to new position
   */
  async dragColumnToPosition(
    columnName: string,
    position: 'left' | 'right' | number
  ): Promise<void> {
    const columns = this.page.getByTestId(/^column-/);
    const targetColumn = this.page.getByTestId(`column-${columnName}`);
    
    // Determine target position
    let targetIndex = 0;
    if (position === 'left') {
      targetIndex = 0;
    } else if (position === 'right') {
      targetIndex = (await columns.count()) - 1;
    } else {
      targetIndex = position;
    }
    
    const dropZone = columns.nth(targetIndex);
    
    // Perform drag
    await targetColumn.hover();
    await this.page.mouse.down();
    await dropZone.hover({ position: { x: 150, y: 50 } });
    await this.page.mouse.up();
    
    // Wait for visual update
    await this.page.waitForTimeout(300);
  }

  /**
   * Wait for board to be fully loaded
   */
  async waitForBoardReady(): Promise<void> {
    const board = this.page.getByTestId('kanban-board');
    await expect(board).toBeVisible();
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Get database state (columns in IndexedDB)
   */
  async getDatabaseState(): Promise<any> {
    const dbState = await this.page.evaluate(async () => {
      return new Promise((resolve, reject) => {
        const request = indexedDB.open('freelancer-db', 1);
        
        request.onsuccess = (event: any) => {
          const db = event.target.result;
          const transaction = db.transaction('columns', 'readonly');
          const store = transaction.objectStore('columns');
          const getAllRequest = store.getAll();
          
          getAllRequest.onsuccess = () => {
            resolve(getAllRequest.result);
          };
          
          getAllRequest.onerror = () => {
            reject(getAllRequest.error);
          };
        };
        
        request.onerror = () => {
          reject(request.error);
        };
      });
    });
    
    return dbState;
  }

  /**
   * Clear all database data (for cleanup)
   */
  async clearDatabase(): Promise<void> {
    await this.page.evaluate(async () => {
      return new Promise((resolve, reject) => {
        const request = indexedDB.open('freelancer-db', 1);
        
        request.onsuccess = (event: any) => {
          const db = event.target.result;
          const transaction = db.transaction('columns', 'readwrite');
          const store = transaction.objectStore('columns');
          const clearRequest = store.clear();
          
          clearRequest.onsuccess = () => {
            resolve(undefined);
          };
          
          clearRequest.onerror = () => {
            reject(clearRequest.error);
          };
        };
        
        request.onerror = () => {
          reject(request.error);
        };
      });
    });
  }
}

/**
 * Extend Playwright test with Kanban board fixtures
 */
export const test = base.extend<KanbanBoardFixtures>({
  kanbanBoard: async ({ page }, use) => {
    const helper = new KanbanBoardPageHelper(page);
    
    // Setup: Clear database before each test
    await helper.clearDatabase();
    
    // Use fixture in test
    await use(helper);
    
    // Teardown: Clear database after each test
    await helper.clearDatabase();
  },

  cleanDatabase: async ({ page }, use) => {
    // Provide a way to manually clear database in tests
    const clearDB = async () => {
      await page.evaluate(async () => {
        return new Promise((resolve, reject) => {
          const request = indexedDB.open('freelancer-db', 1);
          
          request.onsuccess = (event: any) => {
            const db = event.target.result;
            const transaction = db.transaction('columns', 'readwrite');
            const store = transaction.objectStore('columns');
            const clearRequest = store.clear();
            
            clearRequest.onsuccess = () => {
              resolve(undefined);
            };
            
            clearRequest.onerror = () => {
              reject(clearRequest.error);
            };
          };
          
          request.onerror = () => {
            reject(request.error);
          };
        });
      });
    };
    
    await use(clearDB);
  },
});

export { expect };
