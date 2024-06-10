// middlewares/roleMiddleware.js
export function authorizeRole(...roles) {
    return (req, res, next) => {
        const authHeader = req.headers['role'];
        const role = authHeader;
        if (!role) {
            return res.status(401).json({ message: 'No role provided' });
        }
        if (!roles.includes(role)) {
            return res.status(403).json({ message: 'Access denied' });
        }
        next();
    };
}
