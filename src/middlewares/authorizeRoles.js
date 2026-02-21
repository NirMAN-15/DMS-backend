/**
 * middlewares/authorizeRoles.js
 * Role-Based Access Control (RBAC) middleware.
 * Usage: router.get('/admin-route', verifyToken, authorizeRoles('admin'), handler)
 * Usage: router.get('/sales-route', verifyToken, authorizeRoles('admin', 'sales_rep'), handler)
 */

const authorizeRoles = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user || !allowedRoles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: `Access denied. Required role(s): ${allowedRoles.join(', ')}.`,
            });
        }
        next();
    };
};

module.exports = authorizeRoles;
