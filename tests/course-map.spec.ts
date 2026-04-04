import { test, expect } from '@playwright/test';
import { seedLocalStorage, mockAuthSession } from './helpers/auth';

test.describe('Course map (authenticated)', () => {
  test.beforeEach(async ({ page }) => {
    await seedLocalStorage(page);
    await mockAuthSession(page);
  });

  test('renders course header with unit title and progress', async ({ page }) => {
    await page.goto('/');
    // Should show the course map, not the landing page
    await expect(page.getByText(/statics|equilibrium/i).first()).toBeVisible({ timeout: 10000 });
  });

  test('shows lesson nodes on the course map', async ({ page }) => {
    await page.goto('/');
    // Lesson nodes have aria-labels like "Start: ...", "Replay: ...", "Upcoming: ..."
    const lessonNodes = page.locator('button[aria-label^="Start:"], button[aria-label^="Replay:"], button[aria-label^="Upcoming:"]');
    // Wait for at least one lesson node to appear
    await expect(lessonNodes.first()).toBeVisible({ timeout: 10000 });
    const count = await lessonNodes.count();
    expect(count).toBeGreaterThan(0);
  });

  test('first lesson is unlocked and clickable', async ({ page }) => {
    await page.goto('/');
    // Find the first lesson node via its aria-label (should be "Start: ...")
    const firstLesson = page.locator('button[aria-label^="Start:"]').first();
    await expect(firstLesson).toBeVisible({ timeout: 10000 });
    await expect(firstLesson).toBeEnabled();
  });

  test('shows daily goal bar', async ({ page }) => {
    await page.goto('/');
    // DailyGoalBar renders a progressbar role element
    const goalBar = page.locator('[role="progressbar"]').first();
    await expect(goalBar).toBeVisible({ timeout: 10000 });
  });

  test('practice card is visible', async ({ page }) => {
    await page.goto('/');
    // PracticeCard should show up for authenticated users
    const practiceCard = page.getByText(/practice/i).first();
    await expect(practiceCard).toBeVisible({ timeout: 10000 });
  });
});
