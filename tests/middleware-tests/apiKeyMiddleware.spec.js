
import { test, expect } from '@playwright/test';
import { faker } from '@faker-js/faker/locale/es';
import dotenv from 'dotenv';
dotenv.config();

const protectedRoute = 'http://localhost:4000/users/verify';

//this test will fail because the x-api-key is not being sent in the headers

test('should deny access without API key', async ({ request }) => {
    const response = await request.post(protectedRoute, {
        headers: {
            'Content-Type': 'application/json',
        },
        json: {
            email: faker.internet.email(),
            password: faker.internet.password(),
        },
    });
    expect(response.status()).toBe(401);
    const responseBody = await response.json();
    expect(responseBody).toHaveProperty('message', 'No token provided');
});

test('should deny access with invalid API key', async ({ request }) => {
    const fakeApiKey = faker.string.alphanumeric(10);
    const response = await request.post(protectedRoute, {
        headers: {
            'Content-Type': 'application/json',
            'x-api-key': fakeApiKey,
        },
        json: {
            email: faker.internet.email(),
            password: faker.internet.password(),
        },
    });
    expect(response.status()).toBe(403);
    const responseBody = await response.json();
    expect(responseBody).toHaveProperty('message', 'Invalid API key');
});
