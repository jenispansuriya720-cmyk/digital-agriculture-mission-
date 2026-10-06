import { Router } from 'express';
import {
  getSchemes,
  recommendSchemes,
  createScheme,
  updateScheme,
  deleteScheme,
} from '../controllers/schemeController';
import { protect, adminOnly } from '../middleware/auth';

const router = Router();

router.get('/', getSchemes);
router.post('/recommend', recommendSchemes);
router.post('/', protect, adminOnly, createScheme);
router.put('/:id', protect, adminOnly, updateScheme);
router.delete('/:id', protect, adminOnly, deleteScheme);

export default router;
