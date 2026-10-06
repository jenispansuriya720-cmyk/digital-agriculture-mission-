import { Router } from 'express';
import {
  getFarms,
  getFarmById,
  createFarm,
  updateFarm,
  deleteFarm,
} from '../controllers/farmController';
import { protect } from '../middleware/auth';

const router = Router();

router.use(protect);

router.route('/')
  .get(getFarms)
  .post(createFarm);

router.route('/:id')
  .get(getFarmById)
  .put(updateFarm)
  .delete(deleteFarm);

export default router;
