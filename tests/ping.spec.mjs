import { test, expect } from '@playwright/test';

test('GET PING to check if server is working', async ({ request }) => {
  const response = await request.get('http://localhost:4000/');
  expect(response.status()).toBe(200);
});