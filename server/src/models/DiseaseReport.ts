import mongoose, { Document, Schema } from 'mongoose';

export interface IDiseaseReport extends Document {
  userId: mongoose.Types.ObjectId;
  cropName: string;
  diseaseName: string;
  scientificName?: string;
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  confidence: number; // e.g. 89%
  imageUrl: string;
  symptoms: string[];
  recommendations: string[];
  chemicalControl?: string[];
  organicControl?: string[];
  isDemo: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const DiseaseReportSchema = new Schema<IDiseaseReport>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    cropName: { type: String, required: true },
    diseaseName: { type: String, required: true },
    scientificName: { type: String, default: '' },
    severity: {
      type: String,
      enum: ['Low', 'Medium', 'High', 'Critical'],
      default: 'Medium',
    },
    confidence: { type: Number, required: true, default: 89 },
    imageUrl: { type: String, required: true },
    symptoms: [{ type: String }],
    recommendations: [{ type: String }],
    chemicalControl: [{ type: String }],
    organicControl: [{ type: String }],
    isDemo: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const DiseaseReport = mongoose.model<IDiseaseReport>('DiseaseReport', DiseaseReportSchema);
