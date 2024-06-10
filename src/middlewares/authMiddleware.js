import { verifyToken } from '../utils/auth.js';

export function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Espera el formato "Bearer TOKEN"

    if (!token) {
        return res.status(401).json({ message: 'No token provided' }); // No autorizado
    }

    try {
        const user = verifyToken(token);
        req.user = user;
        next();
    } catch (error) {
        res.status(403).json({ message: 'Invalid token' }); // Prohibido
    }
}
