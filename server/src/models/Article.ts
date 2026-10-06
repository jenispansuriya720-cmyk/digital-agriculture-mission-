import mongoose, { Document, Schema } from 'mongoose';

export type ArticleCategory =
  | 'Crop Guides'
  | 'Organic Farming'
  | 'Soil Health'
  | 'Water Management'
  | 'Pest Management'
  | 'Modern Farming'
  | 'Government Updates';

export interface IArticle extends Document {
  title: string;
  slug: string;
  category: ArticleCategory;
  author: string;
  authorTitle: string;
  summary: string;
  content: string;
  readTime: string; // e.g. "4 min read"
  viewsCount: number;
  featured: boolean;
  image: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

const ArticleSchema = new Schema<IArticle>(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    category: {
      type: String,
      required: true,
      enum: [
        'Crop Guides',
        'Organic Farming',
        'Soil Health',
        'Water Management',
        'Pest Management',
        'Modern Farming',
        'Government Updates',
      ],
      index: true,
    },
    author: { type: String, required: true },
    authorTitle: { type: String, default: 'Agricultural Extension Specialist' },
    summary: { type: String, required: true },
    content: { type: String, required: true },
    readTime: { type: String, default: '5 min read' },
    viewsCount: { type: Number, default: 120 },
    featured: { type: Boolean, default: false },
    image: { type: String, required: true },
    tags: [{ type: String }],
  },
  { timestamps: true }
);

export const Article = mongoose.model<IArticle>('Article', ArticleSchema);
