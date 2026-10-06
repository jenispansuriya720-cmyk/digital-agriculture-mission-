import mongoose, { Document, Schema } from 'mongoose';

export interface IOrderItem {
  productId: mongoose.Types.ObjectId;
  name: string;
  price: number;
  quantity: number;
  image: string;
  unit: string;
}

export interface IOrder extends Document {
  orderId: string;
  userId: mongoose.Types.ObjectId;
  items: IOrderItem[];
  subtotal: number;
  deliveryFee: number;
  totalAmount: number;
  paymentMethod: string;
  paymentStatus: 'Pending' | 'Paid' | 'Failed';
  orderStatus: 'Pending' | 'Confirmed' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  shippingAddress: {
    fullName: string;
    phone: string;
    village: string;
    district: string;
    state: string;
    pincode: string;
    landmark?: string;
  };
  trackingUpdates: Array<{
    status: string;
    timestamp: Date;
    description: string;
  }>;
  createdAt: Date;
  updatedAt: Date;
}

const OrderSchema = new Schema<IOrder>(
  {
    orderId: { type: String, required: true, unique: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    items: [
      {
        productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
        name: { type: String, required: true },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true, min: 1 },
        image: { type: String, required: true },
        unit: { type: String, default: '1 unit' },
      },
    ],
    subtotal: { type: Number, required: true },
    deliveryFee: { type: Number, default: 0 },
    totalAmount: { type: Number, required: true },
    paymentMethod: { type: String, default: 'Cash on Delivery (Kisan Pay)' },
    paymentStatus: {
      type: String,
      enum: ['Pending', 'Paid', 'Failed'],
      default: 'Paid',
    },
    orderStatus: {
      type: String,
      enum: ['Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered', 'Cancelled'],
      default: 'Processing',
    },
    shippingAddress: {
      fullName: String,
      phone: String,
      village: String,
      district: String,
      state: String,
      pincode: String,
      landmark: String,
    },
    trackingUpdates: [
      {
        status: String,
        timestamp: { type: Date, default: Date.now },
        description: String,
      },
    ],
  },
  { timestamps: true }
);

export const Order = mongoose.model<IOrder>('Order', OrderSchema);
