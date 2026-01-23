import { Request, Response, NextFunction } from 'express';

// Extend Express Request type to include user with role
declare global {
    namespace Express {
        interface Request {
            user?: {
                userId: string;
                email: string;
                role: 'admin' | 'user';
            };
        }
    }
}

/**
 * Middleware to check if user has required role
 * Usage: checkRole(['admin']) or checkRole(['admin', 'user'])
 */
export const checkRole = (allowedRoles: ('admin' | 'user')[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        // Check if user is authenticated (should be set by auth middleware)
        if (!req.user) {
            return res.status(401).json({
                error: 'Unauthorized',
                message: 'Authentication required'
            });
        }

        // Check if user has required role
        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({
                error: 'Forbidden',
                message: `Access denied. Required role: ${allowedRoles.join(' or ')}`,
                userRole: req.user.role
            });
        }

        next();
    };
};
