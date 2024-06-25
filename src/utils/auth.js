import { config } from 'dotenv';
config();
import jwt from 'jsonwebtoken';

const secretKey = process.env.JWT_SECRET_KEY;

/**
 * Generate a token with the user data
 * @param {Object} user - The user object containing the necessary data
 * @param {string} user._id - The user's ID
 * @param {string} user.email - The user's email
 * @param {string} user.role - The user's role
 * @returns {string} - The generated token
 */
export function generateToken(user) {
    return jwt.sign(
        { id: user._id, email: user.email, role: user.role },
        secretKey,
        { expiresIn: '24h' }
        // Token expires in 24 hours like the cookie session in the frontend
    );
}

/**
 * Verify if the token is valid
 * @param {string} token - The token to verify
 * @returns {Object} - The decoded token
 */
export function verifyToken(token) {
    try {
        return jwt.verify(token, secretKey);
    } catch (error) {
        throw new Error('Token inválido');
    }
}
