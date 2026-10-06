import { Router } from 'express';
import { getAdminStats } from '../controllers/adminController';
import { protect, adminOnly } from '../middleware/auth';

const router = Router();

router.use(protect, adminOnly);

router.get('/stats', getAdminStats);

export default router;
