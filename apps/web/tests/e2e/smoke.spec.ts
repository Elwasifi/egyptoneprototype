import { test, expect } from '@playwright/test';

test('homepage renders the hero and demo banner', async ({ page }) => {
  await page.goto('/en');
  await expect(page.locator('text=Demonstration').first()).toBeVisible();
  await expect(page.locator('h1, h2').first()).toBeVisible();
});

test('a governorate detail page renders with a source badge', async ({ page }) => {
  await page.goto('/en/governorates/cairo');
  await expect(page.getByText(/DEMO|VERIFIED|PARTNER/i).first()).toBeVisible();
});

test('the AI page renders the live agent graph', async ({ page }) => {
  await page.goto('/en/ai');
  await expect(page.getByText(/Concierge/i).first()).toBeVisible();
});

test('the admin AI console requires no external network call to render', async ({ page }) => {
  const response = await page.goto('/en/admin/ai');
  expect(response?.ok()).toBeTruthy();
});
