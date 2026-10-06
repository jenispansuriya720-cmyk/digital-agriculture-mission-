import mongoose, { Document, Schema } from 'mongoose';

export interface IExpert extends Document {
  name: string;
  title: string;
  specialization: string;
  rating: number;
  reviewsCount: number;
  experienceYears: number;
  qualification: string;
  avatar: string;
  languages: string[];
  isAvailable: boolean;
  consultationsDone: number;
  bio: string;
  createdAt: Date;
  updatedAt: Date;
}

const ExpertSchema = new Schema<IExpert>(
  {
    name: { type: String, required: true },
    title: { type: String, required: true },
    specialization: { type: String, required: true }, // e.g. "Crop Specialist", "Soil Specialist", "Irrigation Expert"
    rating: { type: Number, default: 4.8, min: 1, max: 5 },
    reviewsCount: { type: Number, default: 48 },
    experienceYears: { type: Number, default: 12 },
    qualification: { type: String, default: 'Ph.D. in Agronomy / Agriculture Science' },
    avatar: { type: String, required: true },
    languages: [{ type: String }],
    isAvailable: { type: Boolean, default: true },
    consultationsDone: { type: Number, default: 320 },
    bio: { type: String, default: '' },
  },
  { timestamps: true }
);

export const Expert = mongoose.model<IExpert>('Expert', ExpertSchema);
