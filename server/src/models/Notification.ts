import mongoose, { Document, Schema } from 'mongoose';

export type NotificationType =
  | 'weather'
  | 'market'
  | 'crop'
  | 'irrigation'
  | 'scheme'
  | 'order'
  | 'expert'
  | 'system';

export interface INotification extends Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  message: string;
  type: NotificationType;
  isRead: boolean;
  link?: string;
  createdAt: Date;
  updatedAt: Date;
}

const NotificationSchema = new Schema<INotification>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    title: { type: String, required: true },
    message: { type: String, required: true },
    type: {
      type: String,
      enum: ['weather', 'market', 'crop', 'irrigation', 'scheme', 'order', 'expert', 'system'],
      default: 'system',
    },
    isRead: { type: Boolean, default: false },
    link: { type: String, default: '' },
  },
  { timestamps: true }
);

export const Notification = mongoose.model<INotification>('Notification', NotificationSchema);
