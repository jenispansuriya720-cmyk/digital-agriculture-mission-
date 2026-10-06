import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';
import { AuthRequest } from '../middleware/auth';

const generateToken = (id: string): string => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'krishi_secret', {
    expiresIn: '30d',
  });
};

// @desc    Register a new farmer
// @route   POST /api/auth/register
export const registerUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, mobile, password, state, district, village, landArea, primaryCrop } = req.body;

    if (!name || !email || !mobile || !password) {
      res.status(400).json({ success: false, message: 'Please provide all required fields' });
      return;
    }

    const userExists = await User.findOne({ email: email.toLowerCase() });
    if (userExists) {
      res.status(400).json({ success: false, message: 'An account with this email already exists' });
      return;
    }

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      mobile,
      password,
      state: state || 'Gujarat',
      district: district || 'Ahmedabad',
      village: village || 'Sanand',
      landArea: landArea ? Number(landArea) : 5,
      primaryCrop: primaryCrop || 'Cotton',
    });

    res.status(201).json({
      success: true,
      message: 'Farmer account created successfully',
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        mobile: user.mobile,
        role: user.role,
        state: user.state,
        district: user.district,
        village: user.village,
        landArea: user.landArea,
        primaryCrop: user.primaryCrop,
        avatar: user.avatar,
        token: generateToken(user._id.toString()),
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Server error during registration' });
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
export const loginUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const identifier = req.body.emailOrMobile || req.body.email;
    const { password } = req.body;

    if (!identifier || !password) {
      res.status(400).json({ success: false, message: 'Please provide email/mobile and password' });
      return;
    }

    // Find by email or mobile
    const user = await User.findOne({
      $or: [
        { email: identifier.toLowerCase() },
        { mobile: identifier },
      ],
    });

    if (!user) {
      res.status(401).json({ success: false, message: 'Invalid credentials or account does not exist' });
      return;
    }

    if (user.isBlocked) {
      res.status(403).json({ success: false, message: 'This account has been deactivated. Contact administration.' });
      return;
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      res.status(401).json({ success: false, message: 'Invalid email or password' });
      return;
    }

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        mobile: user.mobile,
        role: user.role,
        state: user.state,
        district: user.district,
        village: user.village,
        landArea: user.landArea,
        primaryCrop: user.primaryCrop,
        avatar: user.avatar,
        token: generateToken(user._id.toString()),
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Server error during login' });
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
export const getMe = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Not authorized' });
      return;
    }
    res.json({
      success: true,
      data: req.user,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update profile
// @route   PUT /api/auth/profile
export const updateProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Not authorized' });
      return;
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      res.status(404).json({ success: false, message: 'User not found' });
      return;
    }

    user.name = req.body.name || user.name;
    user.mobile = req.body.mobile || user.mobile;
    user.state = req.body.state || user.state;
    user.district = req.body.district || user.district;
    user.village = req.body.village || user.village;
    user.landArea = req.body.landArea !== undefined ? Number(req.body.landArea) : user.landArea;
    user.primaryCrop = req.body.primaryCrop || user.primaryCrop;
    if (req.body.avatar) user.avatar = req.body.avatar;

    const updatedUser = await user.save();

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        mobile: updatedUser.mobile,
        role: updatedUser.role,
        state: updatedUser.state,
        district: updatedUser.district,
        village: updatedUser.village,
        landArea: updatedUser.landArea,
        primaryCrop: updatedUser.primaryCrop,
        avatar: updatedUser.avatar,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Change password
// @route   PUT /api/auth/change-password
export const changePassword = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Not authorized' });
      return;
    }

    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      res.status(400).json({ success: false, message: 'Please provide both current and new password' });
      return;
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      res.status(404).json({ success: false, message: 'User not found' });
      return;
    }

    const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch) {
      res.status(400).json({ success: false, message: 'Incorrect current password' });
      return;
    }

    user.password = newPassword;
    await user.save();

    res.json({ success: true, message: 'Password updated successfully' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
