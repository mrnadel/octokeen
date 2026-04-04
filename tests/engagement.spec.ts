import { test, expect } from '@playwright/test';
import { seedLocalStorage, mockAuthSession } from './helpers/auth';

test.describe('Engagement systems', () => {
  test.beforeEach(async ({ page }) => {
    await seedLocalStorage(page);
    await mockAuthSession(page);
  });

  test('streak counter is visible on course map', async ({ page }) => {
    await page.goto('/');
    // CourseHeader renders streak button with aria-label like "1 day streak"
    const streakElement = page.locator('[aria-label*="day streak"]').first();
    await expect(streakElement).toBeVisible({ timeout: 10000 });
  });

  test('gem count displays in header or stats', async ({ page }) => {
    await page.goto('/');
    // CourseHeader renders gem button with aria-label like "50 gems"
    const gemElement = page.locator('[aria-label*="gem"]').first();
    await expect(gemElement).toBeVisible({ timeout: 10000 });
  });

  test('streak freeze preserves streak when day is missed', async ({ page }) => {
    // Seed with a streak that would break (last practice was 2 days ago)
    const twoDaysAgo = new Date();
    twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

    await page.addInitScript((dateStr) => {
      const stored = JSON.parse(localStorage.getItem('octokeen-engagement') || '{}');
      if (stored.state?.streak) {
        stored.state.streak.lastPracticeDate = dateStr;
        stored.state.streak.current = 5;
        stored.state.streak.freezesAvailable = 1;
      }
      localStorage.setItem('octokeen-engagement', JSON.stringify(stored));
    }, twoDaysAgo.toISOString().slice(0, 10));

    await page.goto('/');

    // Streak freeze modal or automatic freeze usage should appear
    // This is genuinely conditional: the freeze UI may not appear if the app
    // processes the freeze silently without a modal in some configurations.
    const freezeUI = page.getByText(/streak freeze|streak saved|freeze used/i).first();
    await expect(freezeUI).toBeVisible({ timeout: 10000 });
  });

  test('league page shows current tier and competitors', async ({ page }) => {
    await page.goto('/league');

    // Should show league tier
    const tierLabel = page.getByText(/bronze|silver|gold|platinum|diamond/i).first();
    await expect(tierLabel).toBeVisible({ timeout: 10000 });
  });
});
