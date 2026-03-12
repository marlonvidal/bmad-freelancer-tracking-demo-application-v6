import { mergeTests } from '@playwright/test';
import { test as networkErrorMonitorFixture } from '@seontechnologies/playwright-utils/network-error-monitor/fixtures';
import { test as customFixtures } from './custom-fixtures';
import { test as subtasksFixtures } from './subtasks.fixture';

/**
 * Merged test object combining:
 * - network-error-monitor: auto-detects HTTP 4xx/5xx errors during UI tests
 * - custom project fixtures: task, urgentTask, freelancer
 * - subtasks fixtures: taskWithSubtasks, taskWithoutSubtasks (Story 1.7)
 *
 * Import this `test` in all E2E test files instead of @playwright/test directly.
 */
export const test = mergeTests(networkErrorMonitorFixture, customFixtures, subtasksFixtures);

export { expect } from '@playwright/test';
