import { test, expect } from '@playwright/experimental-ct-react';
import Layout from '../../src/components/Layout';
import { BrowserRouter } from 'react-router-dom';

/**
 * Component Tests for Layout
 * 
 * RED PHASE: Tests verify Layout component behavior before implementation
 * These tests will fail until the Layout component is fully implemented.
 */

const LayoutWrapper = () => (
  <BrowserRouter>
    <Layout>
      <div data-testid="content">Test Content</div>
    </Layout>
  </BrowserRouter>
);

test.describe('Layout Component - RED PHASE', () => {
  test('[P1] Renders navigation with three tabs', async ({ mount }) => {
    // RED: Layout component doesn't exist yet
    // EXPECTED: Layout renders three tabs (Board, Revenue, Settings)
    const component = await mount(<LayoutWrapper />);

    const boardTab = component.getByRole('tab', { name: /board/i });
    const revenueTab = component.getByRole('tab', { name: /revenue/i });
    const settingsTab = component.getByRole('tab', { name: /settings/i });

    await expect(boardTab).toBeVisible();
    await expect(revenueTab).toBeVisible();
    await expect(settingsTab).toBeVisible();
  });

  test('[P1] Renders main content area', async ({ mount }) => {
    // RED: Layout structure not implemented
    // EXPECTED: Main content area receives and displays children
    const component = await mount(<LayoutWrapper />);

    const content = component.getByTestId('content');
    await expect(content).toBeVisible();
    await expect(content).toHaveText('Test Content');
  });

  test('[P1] Has semantic nav element', async ({ mount }) => {
    // RED: No nav element in Layout
    // EXPECTED: Navigation uses semantic HTML <nav>
    const component = await mount(<LayoutWrapper />);

    const nav = component.locator('nav');
    await expect(nav).toBeVisible();
  });

  test('[P1] Has tablist role for accessibility', async ({ mount }) => {
    // RED: ARIA attributes not added
    // EXPECTED: Tab container has role="tablist"
    const component = await mount(<LayoutWrapper />);

    const tablist = component.locator('[role="tablist"]');
    await expect(tablist).toBeVisible();

    const tabs = component.locator('[role="tab"]');
    expect(await tabs.count()).toBe(3);
  });

  test('[P1] Applies Spacious Calm styling (24px padding)', async ({ mount }) => {
    // RED: Styling not applied
    // EXPECTED: Main content area has p-6 (24px) padding
    const component = await mount(<LayoutWrapper />);

    const main = component.locator('main');
    const paddingValue = await main.evaluate((el) => window.getComputedStyle(el).padding);

    // p-6 in Tailwind = 1.5rem = 24px
    expect(paddingValue).toBe('24px');
  });

  test('[P1] Tab styling shows active state', async ({ mount }) => {
    // RED: Active state styling not implemented
    // EXPECTED: Active tab has specific styling/border
    const component = await mount(<LayoutWrapper />);

    const boardTab = component.getByRole('tab', { name: /board/i });
    const activeState = await boardTab.getAttribute('data-state');

    expect(activeState).toBe('active');
  });

  test('[P1] Renders with full height layout', async ({ mount }) => {
    // RED: Layout structure not implemented
    // EXPECTED: Layout uses flex column with full height
    const component = await mount(<LayoutWrapper />);

    const container = component.locator('div').first();
    const display = await container.evaluate((el) => window.getComputedStyle(el).display);
    const height = await container.evaluate((el) => window.getComputedStyle(el).height);

    expect(display).toBe('flex');
    expect(height).toBe('100vh');
  });
});
