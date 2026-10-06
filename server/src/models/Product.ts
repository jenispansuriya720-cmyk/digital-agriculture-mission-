import mongoose, { Document, Schema } from 'mongoose';

export type ProductCategory =
  | 'Seeds'
  | 'Fertilizers'
  | 'Pest Control'
  | 'Nutrients'
  | 'Irrigation'
  | 'Machinery'
  | 'Tools'
  | 'Organic Products';

export interface IProduct extends Document {
  name: string;
  category: ProductCategory;
  brand: string;
  price: number;
  originalPrice: number;
  discountPercentage: number;
  rating: number;
  reviewsCount: number;
  image: string;
  inStock: boolean;
  stockQuantity: number;
  unit: string; // e.g. "1 kg pack", "50 kg bag", "1 unit"
  description: string;
  specifications: Record<string, string>;
  isFeatured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true, trim: true },
    category: {
      type: String,
      required: true,
      enum: [
        'Seeds',
        'Fertilizers',
        'Pest Control',
        'Nutrients',
        'Irrigation',
        'Machinery',
        'Tools',
        'Organic Products',
      ],
      index: true,
    },
    brand: { type: String, required: true },
    price: { type: Number, required: true },
    originalPrice: { type: Number, required: true },
    discountPercentage: { type: Number, default: 0 },
    rating: { type: Number, default: 4.5, min: 1, max: 5 },
    reviewsCount: { type: Number, default: 12 },
    image: { type: String, required: true },
    inStock: { type: Boolean, default: true },
    stockQuantity: { type: Number, default: 100 },
    unit: { type: String, default: '1 unit' },
    description: { type: String, required: true },
    specifications: { type: Map, of: String },
    isFeatured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const Product = mongoose.model<IProduct>('Product', ProductSchema);
