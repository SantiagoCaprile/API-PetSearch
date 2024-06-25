// middlewares/roleMiddleware.js

/**
 * @module roleAuthMiddleware
 * @description Middleware to authorize a role or a list of roles
 * The role is expected to be in the role header.
 * 
 * @param  {...string} roles - List of string with roles to authorize
 * @returns {Function} statusCode - 401 if no role provided, 403 if access denied. If the role is authorized, it calls the next middleware.
 * @example authorizeRole("admin", "user")
 */
export function authorizeRole(...roles) {
    return (req, res, next) => {
        const authHeader = req.headers['role'];
        const role = authHeader;
        if (!role) {
            console.log('No role provided');
            return res.status(401).json({ message: 'No role provided' });
        }
        if (!roles.includes(role)) {
            console.log('Access denied for that role');
            return res.status(403).json({ message: 'Access denied' });
        }
        next();
    };
}
