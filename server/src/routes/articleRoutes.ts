import { Router } from 'express';
import {
  getArticles,
  getArticle,
  createArticle,
  updateArticle,
  deleteArticle,
} from '../controllers/articleController';
import { protect, adminOnly } from '../middleware/auth';

const router = Router();

router.get('/', getArticles);
router.get('/:slug', getArticle);
router.post('/', protect, adminOnly, createArticle);
router.put('/:id', protect, adminOnly, updateArticle);
router.delete('/:id', protect, adminOnly, deleteArticle);

export default router;
