import { test, expect } from '@playwright/test';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config()

const protectedRoute = 'http://localhost:4000/users/';

test('should allow access with valid token', async ({ request }) => {
    const token = jwt.sign({ id: 1, username: 'testuser' }, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });
    const response = await request.get(protectedRoute, {
        headers: {
            'authorization': 'Bearer ' + token,
        },
    });

    expect(response.status()).toBe(200);
    const responseBody = await response.json();
    expect(responseBody).toBeInstanceOf(Array);
});

test('should deny access without token', async ({ request }) => {
    const response = await request.get(protectedRoute);
    expect(response.status()).toBe(401);
    const responseBody = await response.json();
    expect(responseBody).toHaveProperty('message', 'No token provided');
});

test('should deny access with invalid token', async ({ request }) => {
    const token = 'invalid.token';
    const response = await request.get(protectedRoute, {
        headers: {
            authorization: 'Bearer ' + token,
        },
    });
    expect(response.status()).toBe(403);
    const responseBody = await response.json();
    expect(responseBody).toHaveProperty('message', 'Invalid token');
});
