// middlewares/apiKeyMiddleware.js
import { config } from 'dotenv';
config();
const API_KEY = process.env.FRONTEND_API_KEY;

/**
 * @description Middleware to validate the API key 
 * 
 * The API key is expected to be in the x-api-key header.
 */
export function validateApiKey(req, res, next) {
    const apiKey = req.headers['x-api-key'];

    if (!apiKey) {
        console.log('No api key provided');
        return res.status(401).json({ message: 'No token provided' });
    }
    if (apiKey !== API_KEY) {
        console.log('Invalid API key');
        return res.status(403).json({ message: 'Invalid API key' });
    }

    next();
}
