// middlewares/apiKeyMiddleware.js
import { config } from 'dotenv';
config();
const API_KEY = process.env.FRONTEND_API_KEY;

export function validateApiKey(req, res, next) {
    const apiKey = req.headers['x-api-key'];

    if (!apiKey) {
        return res.status(401).json({ message: 'No token provided' });
    }
    if (apiKey !== API_KEY) {
        return res.status(403).json({ message: 'Invalid API key' });
    }

    next();
}
