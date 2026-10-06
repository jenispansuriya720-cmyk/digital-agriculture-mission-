import { Router } from 'express';
import {
  createConsultation,
  getMyConsultations,
  replyConsultation,
} from '../controllers/consultationController';
import { protect, adminOnly } from '../middleware/auth';

const router = Router();

router.use(protect);

router.route('/')
  .post(createConsultation)
  .get(getMyConsultations);

router.put('/:id/reply', adminOnly, replyConsultation);

export default router;
