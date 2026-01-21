import express from 'express';
import { getCalendar } from '../controllers/news.controller';
import { protect } from '../middleware/auth';

const router = express.Router();

// All routes require authentication
router.use(protect);

// @route   GET /api/news/calendar
router.get('/calendar', getCalendar);

export default router;
