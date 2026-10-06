import mongoose, { Document, Schema } from 'mongoose';

export interface IConsultation extends Document {
  userId: mongoose.Types.ObjectId;
  expertId?: mongoose.Types.ObjectId;
  problemTitle: string;
  category: 'Crop' | 'Soil' | 'Pest' | 'Irrigation' | 'Fertilizer';
  crop: string;
  description: string;
  imageUrl?: string;
  status: 'Pending' | 'In Progress' | 'Answered' | 'Closed';
  expertReply?: {
    expertName: string;
    advice: string;
    suggestedTreatment?: string;
    repliedAt: Date;
  };
  createdAt: Date;
  updatedAt: Date;
}

const ConsultationSchema = new Schema<IConsultation>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    expertId: { type: Schema.Types.ObjectId, ref: 'Expert' },
    problemTitle: { type: String, required: true },
    category: {
      type: String,
      enum: ['Crop', 'Soil', 'Pest', 'Irrigation', 'Fertilizer'],
      required: true,
    },
    crop: { type: String, required: true },
    description: { type: String, required: true },
    imageUrl: { type: String, default: '' },
    status: {
      type: String,
      enum: ['Pending', 'In Progress', 'Answered', 'Closed'],
      default: 'Pending',
    },
    expertReply: {
      expertName: String,
      advice: String,
      suggestedTreatment: String,
      repliedAt: Date,
    },
  },
  { timestamps: true }
);

export const Consultation = mongoose.model<IConsultation>('Consultation', ConsultationSchema);
