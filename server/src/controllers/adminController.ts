import { Request, Response } from 'express';
import { User } from '../models/User';
import { Farm } from '../models/Farm';
import { Crop } from '../models/Crop';
import { Product } from '../models/Product';
import { Order } from '../models/Order';
import { Expert } from '../models/Expert';
import { Article } from '../models/Article';
import { Scheme } from '../models/Scheme';
import { MarketPrice } from '../models/MarketPrice';

// @desc    Get aggregated Admin Dashboard statistics
// @route   GET /api/admin/stats
export const getAdminStats = async (req: Request, res: Response): Promise<void> => {
  try {
    const [
      totalFarmers,
      totalFarms,
      totalCrops,
      totalProducts,
      orders,
      totalExperts,
      totalArticles,
      totalSchemes,
      totalMarketRecords,
    ] = await Promise.all([
      User.countDocuments({ role: 'farmer' }),
      Farm.countDocuments(),
      Crop.countDocuments(),
      Product.countDocuments(),
      Order.find(),
      Expert.countDocuments(),
      Article.countDocuments(),
      Scheme.countDocuments(),
      MarketPrice.countDocuments(),
    ]);

    const totalRevenue = orders.reduce((sum, ord) => sum + (ord.totalAmount || 0), 0);

    // Crop distribution aggregation
    const cropAggregation = await Crop.aggregate([
      { $group: { _id: '$cropName', count: { $sum: 1 }, totalArea: { $sum: '$area' } } },
      { $sort: { count: -1 } },
    ]);

    // Order status aggregation
    const ordersByStatus = orders.reduce((acc: any, ord) => {
      acc[ord.orderStatus] = (acc[ord.orderStatus] || 0) + 1;
      return acc;
    }, {});

    // Recent activity
    const recentFarmers = await User.find().select('-password').sort({ createdAt: -1 }).limit(5);
    const recentOrders = await Order.find().populate('userId', 'name email').sort({ createdAt: -1 }).limit(5);

    res.json({
      success: true,
      data: {
        totalFarmers,
        totalFarms,
        totalCrops,
        totalProducts,
        totalOrders: orders.length,
        totalRevenue,
        totalExperts,
        totalArticles,
        totalSchemes,
        totalMarketRecords,
        cropDistribution: cropAggregation.map(c => ({ name: c._id, count: c.count, area: c.totalArea })),
        ordersByStatus,
        recentFarmers,
        recentOrders,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
