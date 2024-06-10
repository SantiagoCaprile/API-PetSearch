import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config()

export function generateAuthJWTToken() {
    return jwt.sign({ id: 1, username: 'testuser' }, process.env.JWT_SECRET_KEY, { expiresIn: '10m' });
}