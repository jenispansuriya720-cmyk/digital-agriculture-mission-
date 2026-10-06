import { Router } from 'express';
import {
  getMarketPrices,
  createMarketPrice,
  updateMarketPrice,
  deleteMarketPrice,
} from '../controllers/marketController';
import { protect, adminOnly } from '../middleware/auth';

const router = Router();

router.get('/', getMarketPrices);
router.post('/', protect, adminOnly, createMarketPrice);
router.put('/:id', protect, adminOnly, updateMarketPrice);
router.delete('/:id', protect, adminOnly, deleteMarketPrice);

export default router;
