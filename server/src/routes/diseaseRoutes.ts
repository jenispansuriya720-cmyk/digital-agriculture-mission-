import { Router } from 'express';
import {
  analyzeCropDisease,
  getMyDiseaseHistory,
} from '../controllers/diseaseController';
import { protect } from '../middleware/auth';

const router = Router();

router.use(protect);

router.post('/analyze', analyzeCropDisease);
router.get('/history', getMyDiseaseHistory);

export default router;
