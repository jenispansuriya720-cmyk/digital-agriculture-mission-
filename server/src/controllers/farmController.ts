import { Response } from 'express';
import { Farm } from '../models/Farm';
import { Crop } from '../models/Crop';
import { AuthRequest } from '../middleware/auth';

// @desc    Get all farms for logged in user (or all if admin)
// @route   GET /api/farms
export const getFarms = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    let query: any = {};
    if (req.user?.role !== 'admin' || req.query.self === 'true') {
      query.userId = req.user?._id;
    }

    const farms = await Farm.find(query).sort({ createdAt: -1 });
    res.json({ success: true, count: farms.length, data: farms });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single farm by id
// @route   GET /api/farms/:id
export const getFarmById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const farm = await Farm.findById(req.params.id);
    if (!farm) {
      res.status(404).json({ success: false, message: 'Farm not found' });
      return;
    }

    // Also get crops for this farm
    const crops = await Crop.find({ farmId: farm._id });

    res.json({ success: true, data: { ...farm.toObject(), crops } });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create new farm
// @route   POST /api/farms
export const createFarm = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Not authorized' });
      return;
    }

    const {
      farmName,
      location,
      state,
      district,
      village,
      area,
      soilType,
      irrigationType,
      waterSource,
      latitude,
      longitude,
    } = req.body;

    if (!farmName || !location || !village || !area) {
      res.status(400).json({ success: false, message: 'Please provide farm name, location, village, and land area' });
      return;
    }

    const farm = await Farm.create({
      userId: req.user._id,
      farmName,
      location,
      state: state || req.user.state || 'Gujarat',
      district: district || req.user.district || 'Ahmedabad',
      village,
      area: Number(area),
      soilType: soilType || 'Black Cotton Soil',
      irrigationType: irrigationType || 'Drip Irrigation',
      waterSource: waterSource || 'Borewell & Canal',
      latitude: latitude ? Number(latitude) : 23.0225,
      longitude: longitude ? Number(longitude) : 72.5714,
    });

    res.status(201).json({ success: true, message: 'Farm registered successfully', data: farm });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update farm
// @route   PUT /api/farms/:id
export const updateFarm = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const farm = await Farm.findById(req.params.id);
    if (!farm) {
      res.status(404).json({ success: false, message: 'Farm not found' });
      return;
    }

    if (req.user?.role !== 'admin' && farm.userId.toString() !== req.user?._id.toString()) {
      res.status(403).json({ success: false, message: 'Not authorized to update this farm' });
      return;
    }

    const updated = await Farm.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, message: 'Farm updated successfully', data: updated });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete farm
// @route   DELETE /api/farms/:id
export const deleteFarm = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const farm = await Farm.findById(req.params.id);
    if (!farm) {
      res.status(404).json({ success: false, message: 'Farm not found' });
      return;
    }

    if (req.user?.role !== 'admin' && farm.userId.toString() !== req.user?._id.toString()) {
      res.status(403).json({ success: false, message: 'Not authorized to delete this farm' });
      return;
    }

    await Crop.deleteMany({ farmId: farm._id });
    await Farm.findByIdAndDelete(farm._id);

    res.json({ success: true, message: 'Farm and associated crops deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
