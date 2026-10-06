import { Router } from 'express';
import {
  getCrops,
  getCropById,
  createCrop,
  updateCrop,
  deleteCrop,
} from '../controllers/cropController';
import { protect } from '../middleware/auth';

const router = Router();

router.use(protect);

router.route('/')
  .get(getCrops)
  .post(createCrop);

router.route('/:id')
  .get(getCropById)
  .put(updateCrop)
  .delete(deleteCrop);

export default router;
