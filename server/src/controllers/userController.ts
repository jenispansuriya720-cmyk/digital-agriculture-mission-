import { Request, Response } from 'express';
import { User } from '../models/User';
import { Farm } from '../models/Farm';
import { Crop } from '../models/Crop';

// @desc    Get all users (with search & pagination)
// @route   GET /api/users
export const getAllUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const { search, role } = req.query;
    const query: any = {};

    if (search) {
      query.$or = [
        { name: { $regex: String(search), $options: 'i' } },
        { email: { $regex: String(search), $options: 'i' } },
        { mobile: { $regex: String(search), $options: 'i' } },
        { village: { $regex: String(search), $options: 'i' } },
        { district: { $regex: String(search), $options: 'i' } },
      ];
    }

    if (role) {
      query.role = role;
    }

    const users = await User.find(query).select('-password').sort({ createdAt: -1 });
    res.json({ success: true, count: users.length, data: users });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Toggle block/unblock status
// @route   PUT /api/users/:id/block
export const toggleBlockUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      res.status(404).json({ success: false, message: 'User not found' });
      return;
    }

    user.isBlocked = !user.isBlocked;
    await user.save();

    res.json({
      success: true,
      message: `Farmer account has been ${user.isBlocked ? 'suspended' : 'activated'}`,
      data: user,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete user
// @route   DELETE /api/users/:id
export const deleteUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      res.status(404).json({ success: false, message: 'User not found' });
      return;
    }

    // Cascade delete associated farms & crops
    await Farm.deleteMany({ userId: user._id });
    await Crop.deleteMany({ userId: user._id });
    await User.findByIdAndDelete(user._id);

    res.json({ success: true, message: 'User and associated farm data deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
