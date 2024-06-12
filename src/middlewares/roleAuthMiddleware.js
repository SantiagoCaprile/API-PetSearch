// middlewares/roleMiddleware.js
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
