import { Request, Response } from 'express';
import { Scheme } from '../models/Scheme';

// @desc    Get all government schemes
// @route   GET /api/schemes
export const getSchemes = async (req: Request, res: Response): Promise<void> => {
  try {
    const { category, search, state } = req.query;
    const filter: any = {};

    if (category && category !== 'All') {
      filter.category = category;
    }

    if (search) {
      filter.$or = [
        { title: { $regex: String(search), $options: 'i' } },
        { description: { $regex: String(search), $options: 'i' } },
        { benefits: { $regex: String(search), $options: 'i' } },
      ];
    }

    if (state && state !== 'All') {
      filter.applicableStates = { $in: [String(state), 'All India'] };
    }

    const schemes = await Scheme.find(filter).sort({ featured: -1, createdAt: -1 });
    res.json({ success: true, count: schemes.length, data: schemes });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Find schemes matched specifically to farmer's attributes
// @route   POST /api/schemes/recommend
export const recommendSchemes = async (req: Request, res: Response): Promise<void> => {
  try {
    const { state, landArea, crop, farmerType, irrigationType } = req.body;
    const area = landArea ? Number(landArea) : 5;

    // Filter schemes that apply to this state and land criteria
    const allSchemes = await Scheme.find();

    const matched = allSchemes.filter((scheme) => {
      // State check
      const stateMatch =
        scheme.applicableStates.includes('All India') ||
        (state && scheme.applicableStates.some((s) => s.toLowerCase() === state.toLowerCase()));

      // Land check
      const minArea = scheme.minLandArea ?? 0;
      const maxArea = scheme.maxLandArea ?? 1000;
      const areaMatch = area >= minArea && area <= maxArea;

      return stateMatch && areaMatch;
    });

    res.json({
      success: true,
      count: matched.length,
      data: matched,
      criteria: { state, landArea: area, crop, farmerType, irrigationType },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Admin create scheme
// @route   POST /api/schemes
export const createScheme = async (req: Request, res: Response): Promise<void> => {
  try {
    const scheme = await Scheme.create(req.body);
    res.status(201).json({ success: true, message: 'Government scheme added', data: scheme });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Admin update scheme
// @route   PUT /api/schemes/:id
export const updateScheme = async (req: Request, res: Response): Promise<void> => {
  try {
    const updated = await Scheme.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) {
      res.status(404).json({ success: false, message: 'Scheme not found' });
      return;
    }
    res.json({ success: true, message: 'Scheme updated', data: updated });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Admin delete scheme
// @route   DELETE /api/schemes/:id
export const deleteScheme = async (req: Request, res: Response): Promise<void> => {
  try {
    const deleted = await Scheme.findByIdAndDelete(req.params.id);
    if (!deleted) {
      res.status(404).json({ success: false, message: 'Scheme not found' });
      return;
    }
    res.json({ success: true, message: 'Scheme deleted' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
