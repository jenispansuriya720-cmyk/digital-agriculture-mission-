import { Response } from 'express';
import { Crop } from '../models/Crop';
import { Farm } from '../models/Farm';
import { AuthRequest } from '../middleware/auth';

// @desc    Get crops (for user or specific farm)
// @route   GET /api/crops
export const getCrops = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    let query: any = {};
    if (req.user?.role !== 'admin' || req.query.self === 'true') {
      query.userId = req.user?._id;
    }

    if (req.query.farmId) {
      query.farmId = req.query.farmId;
    }

    const crops = await Crop.find(query).populate('farmId', 'farmName location').sort({ createdAt: -1 });
    res.json({ success: true, count: crops.length, data: crops });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single crop by ID
// @route   GET /api/crops/:id
export const getCropById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const crop = await Crop.findById(req.params.id).populate('farmId');
    if (!crop) {
      res.status(404).json({ success: false, message: 'Crop record not found' });
      return;
    }
    res.json({ success: true, data: crop });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Add new crop
// @route   POST /api/crops
export const createCrop = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Not authorized' });
      return;
    }

    const {
      farmId,
      cropName,
      variety,
      plantingDate,
      expectedHarvest,
      growthStage,
      healthScore,
      area,
      irrigationRequirement,
      fertilizerSchedule,
      notes,
    } = req.body;

    if (!cropName || !variety || !plantingDate || !expectedHarvest || !area) {
      res.status(400).json({ success: false, message: 'Please provide all mandatory crop details' });
      return;
    }

    let targetFarmId = farmId;
    if (!targetFarmId) {
      // Find user's first farm or create a default farm
      let farm = await Farm.findOne({ userId: req.user._id });
      if (!farm) {
        farm = await Farm.create({
          userId: req.user._id,
          farmName: `${req.user.name}'s Farm`,
          location: `${req.user.village}, ${req.user.district}`,
          village: req.user.village,
          district: req.user.district,
          state: req.user.state,
          area: Number(area) || 5,
        });
      }
      targetFarmId = farm._id;
    }

    // Default icon selection
    const icons: Record<string, string> = {
      cotton: '🌱',
      wheat: '🌾',
      rice: '🌾',
      groundnut: '🥜',
      maize: '🌽',
      tomato: '🍅',
      onion: '🧅',
      potato: '🥔',
    };
    const key = cropName.toLowerCase();
    const icon = Object.keys(icons).find(k => key.includes(k)) ? icons[Object.keys(icons).find(k => key.includes(k))!] : '🌱';

    const defaultSchedule = fertilizerSchedule && fertilizerSchedule.length > 0 ? fertilizerSchedule : [
      { stage: 'Basal / Sowing', date: 'Day 0', details: 'DAP + Potash + Zinc Sulphate', completed: true },
      { stage: 'Vegetative', date: 'Day 30', details: 'Urea top dressing + Micronutrients', completed: true },
      { stage: 'Flowering', date: 'Day 60', details: '0:52:34 Foliar Spray + Boron', completed: false },
      { stage: 'Boll / Fruit Formation', date: 'Day 90', details: 'Potassium Nitrate 13:0:45', completed: false },
    ];

    const crop = await Crop.create({
      userId: req.user._id,
      farmId: targetFarmId,
      cropName,
      variety,
      plantingDate: new Date(plantingDate),
      expectedHarvest: new Date(expectedHarvest),
      growthStage: growthStage || 'Vegetative',
      healthScore: healthScore !== undefined ? Number(healthScore) : 85,
      area: Number(area),
      irrigationRequirement: irrigationRequirement || '500-650 mm (Medium)',
      fertilizerSchedule: defaultSchedule,
      notes: notes || '',
      icon,
    });

    res.status(201).json({ success: true, message: 'Crop registered successfully', data: crop });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update crop
// @route   PUT /api/crops/:id
export const updateCrop = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const crop = await Crop.findById(req.params.id);
    if (!crop) {
      res.status(404).json({ success: false, message: 'Crop record not found' });
      return;
    }

    if (req.user?.role !== 'admin' && crop.userId.toString() !== req.user?._id.toString()) {
      res.status(403).json({ success: false, message: 'Not authorized to edit this crop' });
      return;
    }

    const updated = await Crop.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, message: 'Crop updated successfully', data: updated });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete crop
// @route   DELETE /api/crops/:id
export const deleteCrop = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const crop = await Crop.findById(req.params.id);
    if (!crop) {
      res.status(404).json({ success: false, message: 'Crop record not found' });
      return;
    }

    if (req.user?.role !== 'admin' && crop.userId.toString() !== req.user?._id.toString()) {
      res.status(403).json({ success: false, message: 'Not authorized to delete this crop' });
      return;
    }

    await Crop.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Crop deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
