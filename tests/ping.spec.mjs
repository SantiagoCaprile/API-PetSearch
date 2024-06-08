import { test, expect } from '@playwright/test';

test('try PING', async ({ page }) => {
  await page.goto('http://localhost:4000');
  await expect(page.locator('body')).toHaveText('PING!');
});