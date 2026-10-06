import { Response } from 'express';
import { Irrigation } from '../models/Irrigation';
import { Farm } from '../models/Farm';
import { Notification } from '../models/Notification';
import { AuthRequest } from '../middleware/auth';

// @desc    Get irrigation sensors and schedule
// @route   GET /api/irrigation
export const getIrrigation = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    let query: any = {};
    if (req.user?.role !== 'admin' || req.query.self === 'true') {
      query.userId = req.user?._id;
    }

    let records = await Irrigation.find(query).sort({ updatedAt: -1 });

    if (records.length === 0 && req.user) {
      // Create initial demo irrigation system record
      const farm = await Farm.findOne({ userId: req.user._id });
      const record = await Irrigation.create({
        userId: req.user._id,
        farmId: farm ? farm._id : req.user._id,
        farmName: farm ? farm.farmName : `${req.user.name}'s Field`,
        zoneName: 'Zone A - Main Cotton Field',
        soilMoisture: 32,
        requiredMoisture: 55,
        status: 'Irrigation Required',
        waterAmountLitres: 1200,
        scheduledTime: '6:00 AM – 8:00 AM',
        sensors: {
          soilMoisture: 32,
          temperature: 29,
          humidity: 58,
          waterTankLevel: 78,
          flowRate: 24,
        },
        historyData: [
          { time: '00:00', moisture: 38 },
          { time: '04:00', moisture: 36 },
          { time: '08:00', moisture: 35 },
          { time: '12:00', moisture: 33 },
          { time: '16:00', moisture: 32 },
          { time: '20:00', moisture: 32 },
          { time: 'Now', moisture: 32 },
        ],
      });
      records = [record];
    }

    res.json({ success: true, count: records.length, data: records });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Schedule new irrigation session
// @route   POST /api/irrigation/schedule
export const scheduleIrrigation = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Not authorized' });
      return;
    }

    const { farmId, zoneName, waterAmountLitres, scheduledTime, scheduledDate } = req.body;
    let farm = await Farm.findById(farmId);
    if (!farm) farm = await Farm.findOne({ userId: req.user._id });

    const newSchedule = await Irrigation.create({
      userId: req.user._id,
      farmId: farm ? farm._id : req.user._id,
      farmName: farm ? farm.farmName : 'My Farm Field',
      zoneName: zoneName || 'Zone A - Micro Drip Line',
      soilMoisture: 32,
      requiredMoisture: 55,
      status: 'Irrigation Required',
      waterAmountLitres: Number(waterAmountLitres) || 1200,
      scheduledTime: scheduledTime || '6:00 AM – 8:00 AM',
      scheduledDate: scheduledDate ? new Date(scheduledDate) : new Date(),
      sensors: {
        soilMoisture: 32,
        temperature: 28,
        humidity: 62,
        waterTankLevel: 80,
        flowRate: 24,
      },
      historyData: [
        { time: '06:00', moisture: 32 },
        { time: '07:00', moisture: 42 },
        { time: '08:00', moisture: 56 },
      ],
    });

    await Notification.create({
      userId: req.user._id,
      title: '💧 Irrigation Scheduled',
      message: `Automated drip irrigation scheduled for ${zoneName || 'Zone A'} (${waterAmountLitres || 1200} Litres) at ${scheduledTime || '6:00 AM – 8:00 AM'}.`,
      type: 'irrigation',
      link: '/irrigation',
    });

    res.status(201).json({ success: true, message: 'Irrigation scheduled successfully', data: newSchedule });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Toggle or start demo irrigation run
// @route   POST /api/irrigation/demo-toggle
export const toggleDemoIrrigation = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const record = await Irrigation.findOne({ userId: req.user?._id }).sort({ updatedAt: -1 });
    if (!record) {
      res.status(404).json({ success: false, message: 'No irrigation profile found' });
      return;
    }

    if (record.status === 'Irrigating') {
      record.status = 'Normal';
      record.soilMoisture = 65;
      record.sensors.soilMoisture = 65;
      record.sensors.waterTankLevel = Math.max(record.sensors.waterTankLevel - 15, 20);
      record.historyData.push({ time: 'After Drip', moisture: 65 });
    } else {
      record.status = 'Irrigating';
      record.soilMoisture = 48;
      record.sensors.soilMoisture = 48;
    }

    await record.save();

    res.json({
      success: true,
      message: record.status === 'Irrigating' ? 'Demo irrigation pump turned ON 💧' : 'Demo irrigation completed. Soil moisture restored to optimal 65% 🌱',
      data: record,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
