import mongoose, { Document, Schema } from 'mongoose';

export type GrowthStage = 'Planting' | 'Germination' | 'Vegetative' | 'Flowering' | 'Fruiting' | 'Harvest';

export interface ICrop extends Document {
  userId: mongoose.Types.ObjectId;
  farmId: mongoose.Types.ObjectId;
  cropName: string;
  variety: string;
  plantingDate: Date;
  expectedHarvest: Date;
  growthStage: GrowthStage;
  healthScore: number; // 0 to 100
  area: number; // in acres
  irrigationRequirement: string;
  fertilizerSchedule: Array<{
    stage: string;
    date: string;
    details: string;
    completed: boolean;
  }>;
  notes?: string;
  icon?: string;
  createdAt: Date;
  updatedAt: Date;
}

const CropSchema = new Schema<ICrop>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    farmId: { type: Schema.Types.ObjectId, ref: 'Farm', required: true, index: true },
    cropName: { type: String, required: true },
    variety: { type: String, required: true },
    plantingDate: { type: Date, required: true },
    expectedHarvest: { type: Date, required: true },
    growthStage: {
      type: String,
      enum: ['Planting', 'Germination', 'Vegetative', 'Flowering', 'Fruiting', 'Harvest'],
      default: 'Vegetative',
    },
    healthScore: { type: Number, default: 85, min: 0, max: 100 },
    area: { type: Number, required: true, default: 1.5 },
    irrigationRequirement: { type: String, default: '500-650 mm (Medium to High)' },
    fertilizerSchedule: [
      {
        stage: String,
        date: String,
        details: String,
        completed: { type: Boolean, default: false },
      },
    ],
    notes: { type: String, default: '' },
    icon: { type: String, default: '🌱' },
  },
  { timestamps: true }
);

export const Crop = mongoose.model<ICrop>('Crop', CropSchema);
