import { Request, Response } from 'express';
import { Expert } from '../models/Expert';

// @desc    Get all agriculture experts
// @route   GET /api/experts
export const getExperts = async (req: Request, res: Response): Promise<void> => {
  try {
    const { specialization, available } = req.query;
    const filter: any = {};

    if (specialization) {
      filter.specialization = { $regex: String(specialization), $options: 'i' };
    }
    if (available === 'true') {
      filter.isAvailable = true;
    }

    const experts = await Expert.find(filter).sort({ rating: -1 });
    res.json({ success: true, count: experts.length, data: experts });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single expert by ID
// @route   GET /api/experts/:id
export const getExpertById = async (req: Request, res: Response): Promise<void> => {
  try {
    const expert = await Expert.findById(req.params.id);
    if (!expert) {
      res.status(404).json({ success: false, message: 'Expert not found' });
      return;
    }
    res.json({ success: true, data: expert });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Admin create expert
// @route   POST /api/experts
export const createExpert = async (req: Request, res: Response): Promise<void> => {
  try {
    const expert = await Expert.create(req.body);
    res.status(201).json({ success: true, message: 'Agriculture expert added', data: expert });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Admin update expert
// @route   PUT /api/experts/:id
export const updateExpert = async (req: Request, res: Response): Promise<void> => {
  try {
    const updated = await Expert.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) {
      res.status(404).json({ success: false, message: 'Expert not found' });
      return;
    }
    res.json({ success: true, message: 'Expert updated', data: updated });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Admin delete expert
// @route   DELETE /api/experts/:id
export const deleteExpert = async (req: Request, res: Response): Promise<void> => {
  try {
    const deleted = await Expert.findByIdAndDelete(req.params.id);
    if (!deleted) {
      res.status(404).json({ success: false, message: 'Expert not found' });
      return;
    }
    res.json({ success: true, message: 'Expert removed' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
