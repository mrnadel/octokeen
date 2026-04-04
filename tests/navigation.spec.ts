import { test, expect } from '@playwright/test';
import { seedLocalStorage, mockAuthSession } from './helpers/auth';

test.describe('Navigation (authenticated)', () => {
  test.beforeEach(async ({ page }) => {
    await seedLocalStorage(page);
    await mockAuthSession(page);
  });

  test('pricing page loads and shows plans', async ({ page }) => {
    await page.goto('/pricing');
    await expect(page.getByText(/pro|premium|upgrade/i).first()).toBeVisible({ timeout: 10000 });
    // Should show monthly and yearly options
    await expect(page.getByText(/month/i).first()).toBeVisible();
    await expect(page.getByText(/year/i).first()).toBeVisible();
  });

  test('pricing page shows feature list', async ({ page }) => {
    await page.goto('/pricing');
    await expect(page.getByText(/unlimited hearts/i)).toBeVisible({ timeout: 10000 });
    await expect(page.getByText(/streak freeze/i)).toBeVisible();
  });

  test('profile page loads', async ({ page }) => {
    await page.goto('/profile');
    // Should show profile content or redirect to login
    await expect(page).toHaveURL(/\/(profile|login)/, { timeout: 10000 });
  });

  test('league page loads', async ({ page }) => {
    await page.goto('/league');
    // Should show league content
    const leagueContent = page.getByText(/league|bronze|silver|gold|rank/i).first();
    await expect(leagueContent).toBeVisible({ timeout: 10000 });
  });

  test('friends page loads', async ({ page }) => {
    await page.goto('/friends');
    await expect(page).toHaveURL(/\/(friends|login)/, { timeout: 10000 });
  });

  test('shop page loads', async ({ page }) => {
    await page.goto('/shop');
    // Should show shop or gem-related content
    const shopContent = page.getByText(/shop|gem|item/i).first();
    await expect(shopContent).toBeVisible({ timeout: 10000 });
  });

  test('settings page loads', async ({ page }) => {
    await page.goto('/settings');
    await expect(page).toHaveURL(/\/(settings|login)/, { timeout: 10000 });
  });

  test('terms page renders legal content', async ({ page }) => {
    await page.goto('/terms');
    await expect(page.getByText(/terms of service|terms of use/i).first()).toBeVisible({ timeout: 10000 });
    await expect(page.getByText(/Octokeen/i).first()).toBeVisible();
  });

  test('privacy page renders legal content', async ({ page }) => {
    await page.goto('/privacy');
    await expect(page.getByText(/privacy policy/i).first()).toBeVisible({ timeout: 10000 });
  });

  test('contact page renders', async ({ page }) => {
    await page.goto('/contact');
    await expect(page.getByText(/contact/i).first()).toBeVisible({ timeout: 10000 });
  });
});
