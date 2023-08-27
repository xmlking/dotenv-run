import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
  await page.goto('http://localhost:4200/');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/%NGX_VERSION%/);

  // Expect h1 to contain a text.
  await expect(page.locator('h1')).toHaveText('16.1.1');
});
