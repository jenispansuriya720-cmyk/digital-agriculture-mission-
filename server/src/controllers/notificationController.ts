import { Response } from 'express';
import { Notification } from '../models/Notification';
import { AuthRequest } from '../middleware/auth';

// @desc    Get user notifications
// @route   GET /api/notifications
export const getMyNotifications = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Not authorized' });
      return;
    }

    let notifications = await Notification.find({ userId: req.user._id }).sort({ createdAt: -1 }).limit(20);

    // If user has no notifications, create default alerts
    if (notifications.length === 0) {
      const defaultAlerts = [
        {
          userId: req.user._id,
          title: '⚠️ Weather Alert: Rainfall Predicted',
          message: 'Scattered rain showers expected tomorrow afternoon. Plan harvesting and spraying accordingly.',
          type: 'weather' as const,
          link: '/weather',
          isRead: false,
        },
        {
          userId: req.user._id,
          title: '🌱 Fertilization Recommended',
          message: 'Your Cotton crop is entering flowering stage. Foliar application of 0:52:34 is advised.',
          type: 'crop' as const,
          link: '/crops',
          isRead: false,
        },
        {
          userId: req.user._id,
          title: '📈 Cotton Mandi Price Update',
          message: 'Cotton modal price increased by +4.2% to ₹7,200/Q in Ahmedabad APMC market.',
          type: 'market' as const,
          link: '/market',
          isRead: false,
        },
        {
          userId: req.user._id,
          title: '💧 Irrigation Reminder',
          message: 'Sensor indicates Zone A moisture has dipped to 32%. Irrigation recommended tomorrow 6:00 AM.',
          type: 'irrigation' as const,
          link: '/irrigation',
          isRead: false,
        },
      ];

      await Notification.insertMany(defaultAlerts);
      notifications = await Notification.find({ userId: req.user._id }).sort({ createdAt: -1 });
    }

    const unreadCount = notifications.filter(n => !n.isRead).length;

    res.json({
      success: true,
      count: notifications.length,
      unreadCount,
      data: notifications,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Mark one notification as read
// @route   PUT /api/notifications/:id/read
export const markNotificationRead = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const notification = await Notification.findById(req.params.id);
    if (!notification) {
      res.status(404).json({ success: false, message: 'Notification not found' });
      return;
    }

    notification.isRead = true;
    await notification.save();

    res.json({ success: true, message: 'Marked as read', data: notification });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Mark all user notifications as read
// @route   PUT /api/notifications/read-all
export const markAllNotificationsRead = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Not authorized' });
      return;
    }

    await Notification.updateMany({ userId: req.user._id, isRead: false }, { isRead: true });
    res.json({ success: true, message: 'All notifications marked as read' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
