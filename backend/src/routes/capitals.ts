import { Router } from 'express';
import { getCapitalSummary, updateCapitalSettings } from '../controllers/capital.controller';
import { protect } from '../middleware/auth';

const router = Router();

router.get('/summary', protect, getCapitalSummary);
router.post('/settings', protect, updateCapitalSettings);

export default router;
