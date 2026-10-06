import { Request, Response } from 'express';
import { Product } from '../models/Product';

// @desc    Get all marketplace products
// @route   GET /api/products
export const getProducts = async (req: Request, res: Response): Promise<void> => {
  try {
    const { category, search, minPrice, maxPrice, sort, featured } = req.query;
    const filter: any = {};

    if (category && category !== 'All') {
      filter.category = category;
    }

    if (search) {
      filter.$or = [
        { name: { $regex: String(search), $options: 'i' } },
        { brand: { $regex: String(search), $options: 'i' } },
        { description: { $regex: String(search), $options: 'i' } },
      ];
    }

    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    if (featured === 'true') {
      filter.isFeatured = true;
    }

    let sortOption: any = { createdAt: -1 };
    if (sort === 'price_asc') sortOption = { price: 1 };
    if (sort === 'price_desc') sortOption = { price: -1 };
    if (sort === 'rating') sortOption = { rating: -1 };

    const products = await Product.find(filter).sort(sortOption);
    res.json({ success: true, count: products.length, data: products });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single product by ID
// @route   GET /api/products/:id
export const getProductById = async (req: Request, res: Response): Promise<void> => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      res.status(404).json({ success: false, message: 'Product not found' });
      return;
    }
    res.json({ success: true, data: product });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Admin create new product
// @route   POST /api/products
export const createProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, category, brand, price, originalPrice, image, description, unit, stockQuantity } = req.body;

    if (!name || !category || !price || !brand) {
      res.status(400).json({ success: false, message: 'Please provide all mandatory product fields' });
      return;
    }

    const product = await Product.create({
      name,
      category,
      brand,
      price: Number(price),
      originalPrice: originalPrice ? Number(originalPrice) : Number(price) * 1.15,
      discountPercentage: originalPrice ? Math.round(((Number(originalPrice) - Number(price)) / Number(originalPrice)) * 100) : 10,
      image: image || 'https://images.unsplash.com/photo-1592417817098-8f3d6eb22510?auto=format&fit=crop&q=80&w=400',
      description: description || 'High-quality agricultural product tested and certified for Indian farming conditions.',
      unit: unit || '1 pack',
      stockQuantity: stockQuantity ? Number(stockQuantity) : 50,
      inStock: true,
      rating: 4.8,
      reviewsCount: 14,
    });

    res.status(201).json({ success: true, message: 'Product added to marketplace', data: product });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Admin update product
// @route   PUT /api/products/:id
export const updateProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const updated = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) {
      res.status(404).json({ success: false, message: 'Product not found' });
      return;
    }
    res.json({ success: true, message: 'Product updated successfully', data: updated });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Admin delete product
// @route   DELETE /api/products/:id
export const deleteProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);
    if (!deleted) {
      res.status(404).json({ success: false, message: 'Product not found' });
      return;
    }
    res.json({ success: true, message: 'Product deleted from marketplace' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
