import { Request, Response } from 'express';
import { MarketPrice } from '../models/MarketPrice';

// @desc    Get market / Mandi prices with filters
// @route   GET /api/market
export const getMarketPrices = async (req: Request, res: Response): Promise<void> => {
  try {
    const { crop, market, district, state, sort } = req.query;
    const filter: any = {};

    if (crop) {
      filter.crop = { $regex: String(crop), $options: 'i' };
    }
    if (market) {
      filter.market = { $regex: String(market), $options: 'i' };
    }
    if (district) {
      filter.district = { $regex: String(district), $options: 'i' };
    }
    if (state) {
      filter.state = { $regex: String(state), $options: 'i' };
    }

    let sortOption: any = { updatedAt: -1 };
    if (sort === 'price_asc') sortOption = { modalPrice: 1 };
    if (sort === 'price_desc') sortOption = { modalPrice: -1 };
    if (sort === 'crop') sortOption = { crop: 1 };

    const prices = await MarketPrice.find(filter).sort(sortOption);

    // Summary statistics for the header
    const topGainers = await MarketPrice.find({ trend: 'up' }).sort({ changePercent: -1 }).limit(3);
    const bestMarket = await MarketPrice.find().sort({ modalPrice: -1 }).limit(1);

    res.json({
      success: true,
      count: prices.length,
      data: prices,
      meta: {
        topGainers,
        bestMarket: bestMarket[0] || null,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Admin add market price entry
// @route   POST /api/market
export const createMarketPrice = async (req: Request, res: Response): Promise<void> => {
  try {
    const { crop, variety, market, district, state, minPrice, maxPrice, modalPrice, changePercent, trend } = req.body;

    if (!crop || !market || !district || !minPrice || !maxPrice || !modalPrice) {
      res.status(400).json({ success: false, message: 'Please provide all price details' });
      return;
    }

    const priceEntry = await MarketPrice.create({
      crop,
      variety: variety || 'Standard',
      market,
      district,
      state: state || 'Gujarat',
      minPrice: Number(minPrice),
      maxPrice: Number(maxPrice),
      modalPrice: Number(modalPrice),
      changePercent: changePercent !== undefined ? Number(changePercent) : 0,
      trend: trend || 'stable',
      priceHistory: [
        { date: '1 Week Ago', modalPrice: Number(modalPrice) * 0.96 },
        { date: '4 Days Ago', modalPrice: Number(modalPrice) * 0.98 },
        { date: '2 Days Ago', modalPrice: Number(modalPrice) * 0.99 },
        { date: 'Today', modalPrice: Number(modalPrice) },
      ],
    });

    res.status(201).json({ success: true, message: 'Mandi price entry created', data: priceEntry });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Admin update market price
// @route   PUT /api/market/:id
export const updateMarketPrice = async (req: Request, res: Response): Promise<void> => {
  try {
    const updated = await MarketPrice.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) {
      res.status(404).json({ success: false, message: 'Mandi price entry not found' });
      return;
    }
    res.json({ success: true, message: 'Mandi price updated', data: updated });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Admin delete market price
// @route   DELETE /api/market/:id
export const deleteMarketPrice = async (req: Request, res: Response): Promise<void> => {
  try {
    const deleted = await MarketPrice.findByIdAndDelete(req.params.id);
    if (!deleted) {
      res.status(404).json({ success: false, message: 'Mandi price record not found' });
      return;
    }
    res.json({ success: true, message: 'Mandi price deleted' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
