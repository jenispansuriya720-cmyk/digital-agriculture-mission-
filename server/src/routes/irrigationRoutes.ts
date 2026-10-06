import { Router } from 'express';
import {
  getIrrigation,
  scheduleIrrigation,
  toggleDemoIrrigation,
} from '../controllers/irrigationController';
import { protect } from '../middleware/auth';

const router = Router();

router.use(protect);

router.get('/', getIrrigation);
router.post('/schedule', scheduleIrrigation);
router.post('/demo-toggle', toggleDemoIrrigation);

export default router;
