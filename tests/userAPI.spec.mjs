import { test, expect } from '@playwright/test';

test.describe('API USER Tests', () => {
    test('GET /users should return a list of users', async ({ request }) => {
        const response = await request.get('http://localhost:4000/users');
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
        const response = await request.get('http://localhost:4000/users');
        const users = await response.json();
        const randomUser = users[Math.floor(Math.random() * users.length)];
        const response2 = await request.get(`http://localhost:4000/users/${randomUser._id}`);
        expect(response2.ok()).toBeTruthy(); // Verifica que la respuesta sea correcta (status 200-299)
        const user = await response2.json();
        expect(user).toHaveProperty('_id'); // Verifica que el usuario tenga una propiedad `id`
        expect(user).toHaveProperty('name'); // Verifica que el usuario tenga una propiedad `name`
        expect(user._id).toBe(randomUser._id); // Verifica que el usuario retornado sea el mismo que el usuario aleatorio
    });
});
