import { Router } from 'express';
import {
  getExperts,
  getExpertById,
  createExpert,
  updateExpert,
  deleteExpert,
} from '../controllers/expertController';
import { protect, adminOnly } from '../middleware/auth';

const router = Router();

router.get('/', getExperts);
router.get('/:id', getExpertById);
router.post('/', protect, adminOnly, createExpert);
router.put('/:id', protect, adminOnly, updateExpert);
router.delete('/:id', protect, adminOnly, deleteExpert);

export default router;
