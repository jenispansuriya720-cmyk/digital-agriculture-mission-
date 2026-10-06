import mongoose, { Document, Schema } from 'mongoose';

export interface IMarketPrice extends Document {
  crop: string;
  variety: string;
  market: string;
  district: string;
  state: string;
  minPrice: number; // ₹ per Quintal
  maxPrice: number; // ₹ per Quintal
  modalPrice: number; // ₹ per Quintal
  changePercent: number; // e.g. +4.2% or -1.5%
  trend: 'up' | 'down' | 'stable';
  date: Date;
  priceHistory: Array<{
    date: string;
    modalPrice: number;
  }>;
  createdAt: Date;
  updatedAt: Date;
}

const MarketPriceSchema = new Schema<IMarketPrice>(
  {
    crop: { type: String, required: true, index: true },
    variety: { type: String, default: 'Standard' },
    market: { type: String, required: true, index: true },
    district: { type: String, required: true },
    state: { type: String, required: true, default: 'Gujarat' },
    minPrice: { type: Number, required: true },
    maxPrice: { type: Number, required: true },
    modalPrice: { type: Number, required: true },
    changePercent: { type: Number, default: 0 },
    trend: { type: String, enum: ['up', 'down', 'stable'], default: 'stable' },
    date: { type: Date, default: Date.now },
    priceHistory: [
      {
        date: String,
        modalPrice: Number,
      },
    ],
  },
  { timestamps: true }
);

export const MarketPrice = mongoose.model<IMarketPrice>('MarketPrice', MarketPriceSchema);
