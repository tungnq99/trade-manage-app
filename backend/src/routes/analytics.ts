import express from 'express';
import {
    getAnalyticsStats,
    getEquityCurve,
    getBreakdownBySymbol,
    getBreakdownBySession
} from '../controllers/analytics.controller';
import { protect } from '../middleware/auth';

const router = express.Router();

/**
 * @route   GET /api/analytics/stats
 * @desc    Get key performance statistics (Win Rate, Profit Factor, etc.)
 * @access  Private
 */
router.get('/stats', protect, getAnalyticsStats);

/**
 * @route   GET /api/analytics/equity-curve
 * @desc    Get equity curve data (Time-series balance)
 * @access  Private
 */
router.get('/equity-curve', protect, getEquityCurve);

/**
 * @route   GET /api/analytics/breakdown-by-symbol
 * @desc    Get performance breakdown by symbol
 * @access  Private
 */
router.get('/breakdown-by-symbol', protect, getBreakdownBySymbol);

/**
 * @route   GET /api/analytics/breakdown-by-session
 * @desc    Get performance breakdown by session
 * @access  Private
 */
router.get('/breakdown-by-session', protect, getBreakdownBySession);

export default router;
