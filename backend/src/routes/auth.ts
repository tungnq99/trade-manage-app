import { Router, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { User } from '../models/User';

const router = Router();

// Validation schemas
const registerSchema = z.object({
    email: z.string().email('Invalid email format'),
    password: z
        .string()
        .min(8, 'Password must be at least 8 characters')
        .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .regex(/[0-9]/, 'Password must contain at least one number'),
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
});

const loginSchema = z.object({
    email: z.string().email('Invalid email format'),
    password: z.string().min(1, 'Password is required'),
});

/**
 * POST /api/auth/register
 * Đăng ký user mới
 */
router.post('/register', async (req: Request, res: Response) => {
    try {
        // Validate input
        const validatedData = registerSchema.parse(req.body);

        // Check email đã tồn tại chưa
        const existingUser = await User.findOne({ email: validatedData.email });
        if (existingUser) {
            return res.status(400).json({ error: 'Email already registered' });
        }

        // First user is admin, others are regular users
        const userCount = await User.countDocuments();
        const role = userCount === 0 ? 'admin' : 'user';

        // Tạo user mới
        const user = new User({
            ...validatedData,
            role,
        });
        await user.save();

        // Generate access token (short-lived) with role
        const accessToken = jwt.sign(
            { userId: user._id, email: user.email, role: user.role },
            process.env.JWT_SECRET || 'default-secret',
            { expiresIn: '15m' } // 15 minutes
        );

        // Generate refresh token (long-lived) with role
        const refreshToken = jwt.sign(
            { userId: user._id, email: user.email, role: user.role },
            process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET || 'default-refresh-secret',
            { expiresIn: '7d' } // 7 days
        );

        res.status(201).json({
            message: 'Registration successful',
            accessToken,
            refreshToken,
            user: {
                id: user._id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                role: user.role,
                createdAt: user.createdAt,
            },
        });
    } catch (error: any) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ error: error.errors[0].message });
        }
        console.error('❌ Register error:', error);
        console.error('Error name:', error.name);
        console.error('Error message:', error.message);
        res.status(500).json({
            error: 'Registration failed',
            details: error.message
        });
    }
});

/**
 * POST /api/auth/login
 * Đăng nhập
 */
router.post('/login', async (req: Request, res: Response) => {
    try {
        // Validate input
        const validatedData = loginSchema.parse(req.body);

        // Tìm user
        const user = await User.findOne({ email: validatedData.email });
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Check password
        const isPasswordValid = await user.comparePassword(validatedData.password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Generate access token (short-lived) with role
        const accessToken = jwt.sign(
            { userId: user._id, email: user.email, role: user.role },
            process.env.JWT_SECRET || 'default-secret',
            { expiresIn: '15m' } // 15 minutes
        );

        // Generate refresh token (long-lived) with role
        const refreshToken = jwt.sign(
            { userId: user._id, email: user.email, role: user.role },
            process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET || 'default-refresh-secret',
            { expiresIn: '7d' } // 7 days
        );

        res.json({
            message: 'Login successful',
            accessToken,
            refreshToken,
            user: {
                id: user._id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                role: user.role,
                createdAt: user.createdAt,
            },
        });
    } catch (error: any) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ error: error.errors[0].message });
        }
        console.error('Login error:', error);
        res.status(500).json({ error: 'Login failed' });
    }
});

/**
 * GET /api/auth/me
 * Lấy thông tin user hiện tại (requires authentication)
 */
router.get('/me', async (req: Request, res: Response) => {
    try {
        // Get token from header
        const token = req.headers.authorization?.replace('Bearer ', '');
        if (!token) {
            return res.status(401).json({ error: 'No token provided' });
        }

        // Verify token
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET || 'default-secret'
        ) as { userId: string; email: string; role: string };

        // Get user
        const user = await User.findById(decoded.userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json({
            user: {
                id: user._id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                role: user.role,
                createdAt: user.createdAt,
            },
        });
    } catch (error) {
        res.status(401).json({ error: 'Invalid token' });
    }
});

/**
 * PUT /api/auth/profile
 * Update user profile (firstName, lastName, email)
 */
router.put('/profile', async (req: Request, res: Response) => {
    try {
        // Get token from header
        const token = req.headers.authorization?.replace('Bearer ', '');
        if (!token) {
            return res.status(401).json({ error: 'No token provided' });
        }

        // Verify token
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET || 'default-secret'
        ) as { userId: string; email: string; role: string };

        // Validate input
        const updateSchema = z.object({
            firstName: z.string().min(1, 'First name is required').optional(),
            lastName: z.string().min(1, 'Last name is required').optional(),
            email: z.string().email('Invalid email format').optional(),
        });

        const validatedData = updateSchema.parse(req.body);

        // Check if email is being changed and if it's already taken
        if (validatedData.email && validatedData.email !== decoded.email) {
            const existingUser = await User.findOne({ email: validatedData.email });
            if (existingUser) {
                return res.status(400).json({ error: 'Email already in use' });
            }
        }

        // Update user
        const user = await User.findByIdAndUpdate(
            decoded.userId,
            { $set: validatedData },
            { new: true, runValidators: true }
        );

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json({
            message: 'Profile updated successfully',
            user: {
                id: user._id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                role: user.role,
                createdAt: user.createdAt,
            },
        });
    } catch (error: any) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ error: error.errors[0].message });
        }
        console.error('Update profile error:', error);
        res.status(500).json({ error: 'Failed to update profile' });
    }
});

/**
 * POST /api/auth/change-password
 * Change user password
 */
router.post('/change-password', async (req: Request, res: Response) => {
    try {
        // Get token from header
        const token = req.headers.authorization?.replace('Bearer ', '');
        if (!token) {
            return res.status(401).json({ error: 'No token provided' });
        }

        // Verify token
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET || 'default-secret'
        ) as { userId: string; email: string; role: string };

        // Validate input
        const changePasswordSchema = z.object({
            currentPassword: z.string().min(1, 'Current password is required'),
            newPassword: z.string().min(6, 'New password must be at least 6 characters'),
        });

        const validatedData = changePasswordSchema.parse(req.body);

        // Get user from database
        const user = await User.findById(decoded.userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Verify current password
        const isPasswordValid = await bcrypt.compare(
            validatedData.currentPassword,
            user.password
        );

        if (!isPasswordValid) {
            return res.status(400).json({ error: 'Current password is incorrect' });
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(validatedData.newPassword, 10);

        // Update password
        user.password = hashedPassword;
        await user.save();

        res.json({
            message: 'Password changed successfully',
        });
    } catch (error: any) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ error: error.errors[0].message });
        }
        console.error('Change password error:', error);
        res.status(500).json({ error: 'Failed to change password' });
    }
});


/**
 * POST /api/auth/refresh
 * Refresh access token using refresh token
 */
router.post('/refresh', async (req: Request, res: Response) => {
    try {
        const { refreshToken } = req.body;

        if (!refreshToken) {
            return res.status(401).json({ error: 'Refresh token required' });
        }

        // Verify refresh token
        const decoded = jwt.verify(
            refreshToken,
            process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET || 'default-refresh-secret'
        ) as { userId: string };

        // Get user to ensure they still exist
        const user = await User.findById(decoded.userId);
        if (!user) {
            return res.status(401).json({ error: 'User not found' });
        }

        // Generate new access token with role
        const accessToken = jwt.sign(
            { userId: user._id, email: user.email, role: user.role },
            process.env.JWT_SECRET || 'default-secret',
            { expiresIn: '15m' }
        );

        // Optionally rotate refresh token (generate new one)
        const newRefreshToken = jwt.sign(
            { userId: user._id, email: user.email, role: user.role },
            process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET || 'default-refresh-secret',
            { expiresIn: '7d' }
        );

        res.json({
            accessToken,
            refreshToken: newRefreshToken,
        });
    } catch (error) {
        console.error('Refresh token error:', error);
        res.status(401).json({ error: 'Invalid or expired refresh token' });
    }
});

export default router;
