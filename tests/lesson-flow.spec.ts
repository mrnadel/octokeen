import { test, expect } from '@playwright/test';
import { seedLocalStorage, mockAuthSession } from './helpers/auth';

test.describe('Lesson flow (authenticated)', () => {
  test.beforeEach(async ({ page }) => {
    await seedLocalStorage(page);
    await mockAuthSession(page);
    // Also mock the mastery API so lesson completion doesn't fail
    await page.route('**/api/mastery', (route) => {
      route.fulfill({ status: 200, body: JSON.stringify({ ok: true }) });
    });
    await page.route('**/api/course-progress', (route) => {
      route.fulfill({ status: 200, body: JSON.stringify({ ok: true }) });
    });
  });

  test('can start a lesson and see a question', async ({ page }) => {
    await page.goto('/');

    // Click on the first lesson node using its aria-label
    const firstLesson = page.locator('button[aria-label^="Start:"]').first();
    await expect(firstLesson).toBeVisible({ timeout: 10000 });
    await firstLesson.click();

    // Wait for lesson to load (course data lazy loads ~5MB) -- look for the lesson UI
    const lessonContent = page.locator('[role="progressbar"]').first();
    await expect(lessonContent).toBeVisible({ timeout: 15000 });
  });

  test('shows progress bar during lesson', async ({ page }) => {
    await page.goto('/');

    const firstLesson = page.locator('button[aria-label^="Start:"]').first();
    await expect(firstLesson).toBeVisible({ timeout: 10000 });
    await firstLesson.click();

    // Progress bar should be visible (LessonProgressBar renders role="progressbar")
    const progressBar = page.locator('[role="progressbar"]').first();
    await expect(progressBar).toBeVisible({ timeout: 15000 });
  });

  test('shows heart display during lesson', async ({ page }) => {
    await page.goto('/');

    const firstLesson = page.locator('button[aria-label^="Start:"]').first();
    await expect(firstLesson).toBeVisible({ timeout: 10000 });
    await firstLesson.click();

    // Heart display should show (free tier has limited hearts)
    // CourseHeader renders hearts with aria-label like "5 hearts"
    const hearts = page.locator('[aria-label*="hearts"]').first();
    await expect(hearts).toBeVisible({ timeout: 15000 });
  });

  test('can answer a multiple choice question', async ({ page }) => {
    await page.goto('/');

    const firstLesson = page.locator('button[aria-label^="Start:"]').first();
    await expect(firstLesson).toBeVisible({ timeout: 10000 });
    await firstLesson.click();

    // Wait for lesson content to load
    await expect(page.locator('[role="progressbar"]').first()).toBeVisible({ timeout: 15000 });

    // Look for the Check button (LessonView renders a "Check" button for MC questions)
    const checkButton = page.getByRole('button', { name: /check/i }).first();

    // Look for answer option buttons -- they contain text and are clickable
    const options = page.locator('[role="radio"], [role="button"]').filter({ hasText: /[A-Za-z]/ });
    // Wait for options to appear (teaching cards may appear first, so use generous timeout)
    await expect(options.first()).toBeVisible({ timeout: 15000 });

    // Select the first option
    await options.first().click();

    // CHECK button should become enabled and visible
    await expect(checkButton).toBeVisible({ timeout: 5000 });
    await checkButton.click();

    // Should show correct/incorrect feedback -- Continue or Finish button appears
    const continueButton = page.getByRole('button', { name: /continue|finish/i }).first();
    await expect(continueButton).toBeVisible({ timeout: 5000 });
  });

  test('exit button shows confirmation when answers exist', async ({ page }) => {
    await page.goto('/');

    const firstLesson = page.locator('button[aria-label^="Start:"]').first();
    await expect(firstLesson).toBeVisible({ timeout: 10000 });
    await firstLesson.click();

    // Wait for lesson to load
    await expect(page.locator('[role="progressbar"]').first()).toBeVisible({ timeout: 15000 });

    // Answer a question first
    const options = page.locator('[role="radio"], [role="button"]').filter({ hasText: /[A-Za-z]/ });
    await expect(options.first()).toBeVisible({ timeout: 15000 });
    await options.first().click();

    const checkButton = page.getByRole('button', { name: /check|submit/i }).first();
    await expect(checkButton).toBeVisible({ timeout: 5000 });
    await checkButton.click();

    // Wait for feedback to appear before trying to exit
    const continueButton = page.getByRole('button', { name: /continue|finish/i }).first();
    await expect(continueButton).toBeVisible({ timeout: 5000 });

    // Try to exit -- the exit button has aria-label "Close lesson" (or similar exitLabel)
    const exitButton = page.locator('button[aria-label*="Close"], button[aria-label*="Exit"]').first();
    await expect(exitButton).toBeVisible({ timeout: 5000 });
    await exitButton.click();

    // Confirmation dialog should appear
    const confirmDialog = page.getByText(/are you sure|quit|leave/i).first();
    await expect(confirmDialog).toBeVisible({ timeout: 3000 });
  });
});
