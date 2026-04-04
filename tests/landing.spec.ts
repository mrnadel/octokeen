import { test, expect } from '@playwright/test';

test.describe('Landing page (unauthenticated)', () => {
  test('renders hero section with brand name and CTA', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    await expect(page.getByText('Octokeen')).toBeVisible();
    await expect(page.getByRole('link', { name: /get started|sign up/i })).toBeVisible();
  });

  test('shows demo questions that are interactive', async ({ page }) => {
    await page.goto('/');

    // Scroll to demo section and find a question
    const demoQuestion = page.getByText('A beam is supported at both ends');
    await expect(demoQuestion).toBeVisible({ timeout: 10000 });
    await demoQuestion.scrollIntoViewIfNeeded();
    // Click an answer option
    const option = page.getByText('Directly at the left support');
    await option.click();
    // Should show feedback (explanation text appears)
    await expect(page.getByText(/equilibrium/i)).toBeVisible({ timeout: 5000 });
  });

  test('shows profession cards', async ({ page }) => {
    await page.goto('/');
    // Scroll down to see profession cards
    const professionCard = page.getByText(/mechanical engineering/i).first();
    await professionCard.scrollIntoViewIfNeeded();
    await expect(professionCard).toBeVisible();
  });

  test('login link navigates to login page', async ({ page }) => {
    await page.goto('/');
    const loginLink = page.getByRole('link', { name: /sign in|log in/i }).first();
    await loginLink.click();
    await expect(page).toHaveURL(/\/login/);
  });

  test('signup link navigates to register page', async ({ page }) => {
    await page.goto('/');
    const signupLink = page.getByRole('link', { name: /get started|sign up/i }).first();
    await signupLink.click();
    await expect(page).toHaveURL(/\/(register|get-started)/);
  });
});
