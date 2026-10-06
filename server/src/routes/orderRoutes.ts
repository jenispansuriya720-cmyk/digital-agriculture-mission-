import { Router } from 'express';
import {
  createOrder,
  getMyOrders,
  getOrderById,
  updateOrderStatus,
} from '../controllers/orderController';
import { protect, adminOnly } from '../middleware/auth';

const router = Router();

router.use(protect);

router.route('/')
  .post(createOrder)
  .get(getMyOrders);

router.route('/:id')
  .get(getOrderById);

router.put('/:id/status', adminOnly, updateOrderStatus);

export default router;
