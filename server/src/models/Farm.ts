import mongoose, { Document, Schema } from 'mongoose';

export interface IFarm extends Document {
  userId: mongoose.Types.ObjectId;
  farmName: string;
  location: string;
  state: string;
  district: string;
  village: string;
  area: number; // in acres
  soilType: string;
  irrigationType: string;
  waterSource: string;
  latitude: number;
  longitude: number;
  sensorsCount: number;
  activeStatus: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const FarmSchema = new Schema<IFarm>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    farmName: { type: String, required: true, trim: true },
    location: { type: String, required: true },
    state: { type: String, required: true, default: 'Gujarat' },
    district: { type: String, required: true, default: 'Ahmedabad' },
    village: { type: String, required: true },
    area: { type: Number, required: true, default: 2.5 },
    soilType: { type: String, required: true, default: 'Black Cotton Soil' },
    irrigationType: { type: String, required: true, default: 'Drip Irrigation' },
    waterSource: { type: String, required: true, default: 'Borewell & Canal' },
    latitude: { type: Number, default: 23.0225 },
    longitude: { type: Number, default: 72.5714 },
    sensorsCount: { type: Number, default: 3 },
    activeStatus: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Farm = mongoose.model<IFarm>('Farm', FarmSchema);
