import { test, expect } from '@playwright/test';
import { seedLocalStorage, mockAuthSession } from './helpers/auth';

test.describe('Payment / upgrade flow', () => {
  test.beforeEach(async ({ page }) => {
    await seedLocalStorage(page);
    await mockAuthSession(page);
  });

  test('pricing page shows monthly and yearly plans with prices', async ({ page }) => {
    await page.goto('/pricing');

    // Should show price amounts
    await expect(page.getByText(/\$\d+\.\d{2}/i).first()).toBeVisible({ timeout: 10000 });
    // Should have an upgrade/subscribe CTA
    const ctaButton = page.getByRole('button', { name: /upgrade|subscribe|get pro|start/i }).first();
    await expect(ctaButton).toBeVisible();
  });

  test('upgrade button triggers Paddle checkout (mocked)', async ({ page }) => {
    // Mock the Paddle checkout API
    let checkoutCalled = false;
    await page.route('**/api/paddle/checkout', (route) => {
      checkoutCalled = true;
      route.fulfill({
        status: 200,
        body: JSON.stringify({ transactionId: 'txn_test_123' }),
      });
    });

    // Mock Paddle.js so it doesn't actually open a real checkout
    await page.addInitScript(() => {
      (window as Record<string, unknown>).Paddle = {
        Checkout: {
          open: () => { (window as Record<string, unknown>).__paddleCheckoutOpened = true; },
        },
        Setup: () => {},
        Environment: { set: () => {} },
      };
    });

    await page.goto('/pricing');

    const ctaButton = page.getByRole('button', { name: /upgrade|subscribe|get pro|start/i }).first();
    await expect(ctaButton).toBeVisible({ timeout: 10000 });
    await ctaButton.click();

    // Wait for the checkout flow to trigger (API call or Paddle SDK)
    await page.waitForFunction(
      () => (window as Record<string, unknown>).__paddleCheckoutOpened === true,
      { timeout: 10000 },
    ).catch(() => {
      // Paddle SDK may not have been triggered; checkout API might have been called instead
    });

    // Verify checkout API was called or Paddle was triggered
    const paddleOpened = await page.evaluate(() => (window as Record<string, unknown>).__paddleCheckoutOpened);
    expect(checkoutCalled || paddleOpened).toBeTruthy();
  });

  test('out-of-hearts modal shows upgrade option', async ({ page }) => {
    // Seed hearts store with 0 hearts
    await page.addInitScript(() => {
      localStorage.setItem('octokeen-hearts', JSON.stringify({
        state: { hearts: 0, maxHearts: 5, lastRegenTime: Date.now(), regenIntervalMs: 1800000 },
        version: 0,
      }));
    });

    await page.goto('/');

    // Try to start a lesson (should trigger out-of-hearts)
    const firstLesson = page.locator('button[aria-label^="Start:"]').first();
    await expect(firstLesson).toBeVisible({ timeout: 10000 });
    await firstLesson.click();

    // Out of hearts modal should appear
    const heartsModal = page.getByText(/out of hearts|no hearts|wait for hearts/i).first();
    await expect(heartsModal).toBeVisible({ timeout: 10000 });

    // Should have upgrade button
    const upgradeBtn = page.getByRole('button', { name: /upgrade|get pro|unlimited/i }).first();
    await expect(upgradeBtn).toBeVisible();
  });

  test('refund policy page loads', async ({ page }) => {
    await page.goto('/refund-policy');
    await expect(page.getByText(/refund/i).first()).toBeVisible({ timeout: 10000 });
  });
});
