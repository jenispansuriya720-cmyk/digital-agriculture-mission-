import mongoose, { Document, Schema } from 'mongoose';

export interface IScheme extends Document {
  title: string;
  category: 'Financial Support' | 'Crop Insurance' | 'Equipment Subsidy' | 'Irrigation' | 'Soil Health' | 'Organic Farming';
  description: string;
  eligibility: string[];
  benefits: string;
  documents: string[];
  deadline: string;
  applicationLink: string;
  applicableStates: string[];
  minLandArea?: number;
  maxLandArea?: number;
  featured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const SchemeSchema = new Schema<IScheme>(
  {
    title: { type: String, required: true, trim: true },
    category: {
      type: String,
      required: true,
      enum: [
        'Financial Support',
        'Crop Insurance',
        'Equipment Subsidy',
        'Irrigation',
        'Soil Health',
        'Organic Farming',
      ],
      index: true,
    },
    description: { type: String, required: true },
    eligibility: [{ type: String }],
    benefits: { type: String, required: true },
    documents: [{ type: String }],
    deadline: { type: String, default: 'Ongoing / Open Year-Round' },
    applicationLink: { type: String, default: 'https://pmkisan.gov.in' },
    applicableStates: [{ type: String, default: 'All India' }],
    minLandArea: { type: Number, default: 0 },
    maxLandArea: { type: Number, default: 100 },
    featured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const Scheme = mongoose.model<IScheme>('Scheme', SchemeSchema);
