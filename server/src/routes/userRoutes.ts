import { Router } from 'express';
import { getAllUsers, toggleBlockUser, deleteUser } from '../controllers/userController';
import { protect, adminOnly } from '../middleware/auth';

const router = Router();

router.use(protect, adminOnly);

router.get('/', getAllUsers);
router.put('/:id/block', toggleBlockUser);
router.delete('/:id', deleteUser);

export default router;
