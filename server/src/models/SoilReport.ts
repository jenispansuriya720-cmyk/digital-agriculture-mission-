import mongoose, { Document, Schema } from 'mongoose';

export interface ISoilReport extends Document {
  userId: mongoose.Types.ObjectId;
  farmId: mongoose.Types.ObjectId;
  reportDate: Date;
  overallScore: number; // 0 to 100
  rating: 'Poor' | 'Moderate' | 'Good' | 'Excellent';
  pH: number;
  nitrogen: number; // kg/ha
  phosphorus: number; // kg/ha
  potassium: number; // kg/ha
  moisture: number; // %
  organicCarbon: number; // %
  electricalConductivity: number; // dS/m
  recommendations: string[];
  reportPdfUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

const SoilReportSchema = new Schema<ISoilReport>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    farmId: { type: Schema.Types.ObjectId, ref: 'Farm', required: true, index: true },
    reportDate: { type: Date, default: Date.now },
    overallScore: { type: Number, default: 82, min: 0, max: 100 },
    rating: {
      type: String,
      enum: ['Poor', 'Moderate', 'Good', 'Excellent'],
      default: 'Excellent',
    },
    pH: { type: Number, required: true, default: 6.8 },
    nitrogen: { type: Number, required: true, default: 280 },
    phosphorus: { type: Number, required: true, default: 42 },
    potassium: { type: Number, required: true, default: 310 },
    moisture: { type: Number, required: true, default: 68 },
    organicCarbon: { type: Number, required: true, default: 0.75 },
    electricalConductivity: { type: Number, default: 0.45 },
    recommendations: [
      { type: String },
    ],
    reportPdfUrl: { type: String, default: '' },
  },
  { timestamps: true }
);

export const SoilReport = mongoose.model<ISoilReport>('SoilReport', SoilReportSchema);
