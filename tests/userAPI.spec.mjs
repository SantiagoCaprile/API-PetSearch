import { test, expect } from '@playwright/test';
import { generateAuthJWTToken } from './utils.js';
import { faker } from '@faker-js/faker/locale/es';
import { config } from 'dotenv';
config();

test.describe('API USER Tests', () => {
    test('GET /users should return a list of users', async ({ request }) => {
        const response = await request.get('http://localhost:4000/users', {
            headers: {
                'authorization': 'Bearer ' + generateAuthJWTToken(),
            },
        });
        expect(response.ok()).toBeTruthy(); // Verifica que la respuesta sea correcta (status 200-299)
        const users = await response.json();
        expect(users).toBeInstanceOf(Array); // Verifica que la respuesta sea un array
        // Agrega más verificaciones según sea necesario, por ejemplo:
        expect(users.length).toBeGreaterThan(0); // Verifica que la lista de usuarios no esté vacía
        users.forEach(user => {
            expect(user).toHaveProperty('_id'); // Verifica que cada usuario tenga una propiedad `id`
            expect(user).toHaveProperty('name'); // Verifica que cada usuario tenga una propiedad `name`
        });
    });


    test('GET /users/:id should return a user by id', async ({ request }) => {
        const token = generateAuthJWTToken();
        const response = await request.get('http://localhost:4000/users', {
            headers: {
                'authorization': 'Bearer ' + token,
            },
        });
        const users = await response.json();
        const randomUser = users[faker.number.int({ min: 0, max: users.length - 1 })];
        const response2 = await request.get(`http://localhost:4000/users/${randomUser._id}`, {
            headers: {
                authorization: 'Bearer ' + token,
            },
        });
        expect(response2.ok()).toBeTruthy();
        const user = await response2.json();
        expect(user).toHaveProperty('_id');
        expect(user).toHaveProperty('name');
        expect(user._id).toBe(randomUser._id);
    });

    test('POST /users/verify should return 401 if the user not exists', async ({ request }) => {
        const user = {
            email: faker.internet.email(),
            password: faker.internet.password(),
        };
        const response = await request.post('http://localhost:4000/users/verify', {
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': process.env.FRONTEND_API_KEY,
            },
            json: user.toString(),
        });
        expect(response.status()).toBe(401);
        const responseBody = await response.json();
        expect(responseBody).toHaveProperty('message', 'Usuario no existe');
    });

});
