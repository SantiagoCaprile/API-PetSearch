// middlewares/apiKeyMiddleware.js
import { config } from 'dotenv';
config();
const API_KEY = process.env.FRONTEND_API_KEY; // Asegúrate de definir esto en tus variables de entorno

export function validateApiKey(req, res, next) {
    const apiKey = req.headers['x-api-key'];

    if (apiKey !== API_KEY) {
        return res.status(403).json({ message: 'Invalid API key' });
    }

    next();
}
