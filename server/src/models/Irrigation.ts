import mongoose, { Document, Schema } from 'mongoose';

export interface IIrrigation extends Document {
  userId: mongoose.Types.ObjectId;
  farmId: mongoose.Types.ObjectId;
  farmName: string;
  zoneName: string;
  soilMoisture: number; // current %
  requiredMoisture: number; // required %
  status: 'Normal' | 'Irrigation Required' | 'Irrigating' | 'Completed';
  waterAmountLitres: number;
  scheduledTime: string; // e.g. "06:00 AM - 08:00 AM"
  scheduledDate: Date;
  sensors: {
    soilMoisture: number;
    temperature: number;
    humidity: number;
    waterTankLevel: number; // %
    flowRate: number; // L/min
  };
  historyData: Array<{
    time: string;
    moisture: number;
  }>;
  isCompleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const IrrigationSchema = new Schema<IIrrigation>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    farmId: { type: Schema.Types.ObjectId, ref: 'Farm', required: true, index: true },
    farmName: { type: String, required: true },
    zoneName: { type: String, default: 'Zone A - Main Field' },
    soilMoisture: { type: Number, required: true, default: 32 },
    requiredMoisture: { type: Number, required: true, default: 55 },
    status: {
      type: String,
      enum: ['Normal', 'Irrigation Required', 'Irrigating', 'Completed'],
      default: 'Irrigation Required',
    },
    waterAmountLitres: { type: Number, default: 1200 },
    scheduledTime: { type: String, default: '6:00 AM – 8:00 AM' },
    scheduledDate: { type: Date, default: Date.now },
    sensors: {
      soilMoisture: { type: Number, default: 32 },
      temperature: { type: Number, default: 29 },
      humidity: { type: Number, default: 58 },
      waterTankLevel: { type: Number, default: 78 },
      flowRate: { type: Number, default: 24 },
    },
    historyData: [
      {
        time: String,
        moisture: Number,
      },
    ],
    isCompleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const Irrigation = mongoose.model<IIrrigation>('Irrigation', IrrigationSchema);
