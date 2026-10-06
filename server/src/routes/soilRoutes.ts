import { Router } from 'express';
import { getSoilReports, createSoilReport } from '../controllers/soilController';
import { protect } from '../middleware/auth';

const router = Router();

router.use(protect);

router.route('/')
  .get(getSoilReports)
  .post(createSoilReport);

export default router;
