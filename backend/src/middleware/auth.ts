import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Extend Express Request type to include user
declare global {
    namespace Express {
        interface Request {
            user?: {
                userId: string;
            };
        }
    }
}

// Export AuthRequest interface
export interface AuthRequest extends Request {
    user?: {
        userId: string;
    };
}

export const protect = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
        return res.status(401).json({ error: 'Access denied. No token provided.' });
    }

    try {
        const verified = jwt.verify(
            token,
            process.env.JWT_SECRET || 'default-secret'
        ) as { userId: string };

        (req as AuthRequest).user = verified;
        next();
    } catch (error) {
        res.status(403).json({ error: 'Invalid token.' });
    }
};
