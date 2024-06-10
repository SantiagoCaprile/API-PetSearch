import { config } from 'dotenv';
config();
import jwt from 'jsonwebtoken';

const secretKey = process.env.JWT_SECRET_KEY;

export function generateToken(user) {
    return jwt.sign(
        { id: user._id, email: user.email, role: user.role },
        secretKey,
        { expiresIn: '1h' } // El token expira en 1 hora
    );
}

export function verifyToken(token) {
    try {
        return jwt.verify(token, secretKey);
    } catch (error) {
        throw new Error('Token inválido');
    }
}
