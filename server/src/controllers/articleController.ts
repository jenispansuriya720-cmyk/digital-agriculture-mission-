import { Request, Response } from 'express';
import { Article } from '../models/Article';

// @desc    Get all knowledge articles
// @route   GET /api/articles
export const getArticles = async (req: Request, res: Response): Promise<void> => {
  try {
    const { category, search, featured } = req.query;
    const filter: any = {};

    if (category && category !== 'All') {
      filter.category = category;
    }

    if (search) {
      filter.$or = [
        { title: { $regex: String(search), $options: 'i' } },
        { summary: { $regex: String(search), $options: 'i' } },
        { tags: { $in: [new RegExp(String(search), 'i')] } },
      ];
    }

    if (featured === 'true') {
      filter.featured = true;
    }

    const articles = await Article.find(filter).sort({ featured: -1, createdAt: -1 });
    res.json({ success: true, count: articles.length, data: articles });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single article by slug or ID
// @route   GET /api/articles/:slug
export const getArticle = async (req: Request, res: Response): Promise<void> => {
  try {
    const article = await Article.findOne({
      $or: [{ slug: req.params.slug }, { _id: req.params.slug.match(/^[0-9a-fA-F]{24}$/) ? req.params.slug : null }],
    });

    if (!article) {
      res.status(404).json({ success: false, message: 'Article not found' });
      return;
    }

    // Increment views
    article.viewsCount += 1;
    await article.save();

    res.json({ success: true, data: article });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Admin create article
// @route   POST /api/articles
export const createArticle = async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, category, author, authorTitle, summary, content, readTime, image, tags, featured } = req.body;

    if (!title || !category || !content || !summary) {
      res.status(400).json({ success: false, message: 'Please provide title, category, summary, and content' });
      return;
    }

    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '') + '-' + Math.floor(100 + Math.random() * 900);

    const article = await Article.create({
      title,
      slug,
      category,
      author: author || 'Krishi Extension Scientist',
      authorTitle: authorTitle || 'Agronomy Division',
      summary,
      content,
      readTime: readTime || '5 min read',
      image: image || 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&q=80&w=600',
      tags: tags || ['Farming', 'Agriculture'],
      featured: featured || false,
    });

    res.status(201).json({ success: true, message: 'Article published', data: article });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Admin update article
// @route   PUT /api/articles/:id
export const updateArticle = async (req: Request, res: Response): Promise<void> => {
  try {
    const updated = await Article.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) {
      res.status(404).json({ success: false, message: 'Article not found' });
      return;
    }
    res.json({ success: true, message: 'Article updated', data: updated });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Admin delete article
// @route   DELETE /api/articles/:id
export const deleteArticle = async (req: Request, res: Response): Promise<void> => {
  try {
    const deleted = await Article.findByIdAndDelete(req.params.id);
    if (!deleted) {
      res.status(404).json({ success: false, message: 'Article not found' });
      return;
    }
    res.json({ success: true, message: 'Article deleted' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
