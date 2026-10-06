import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  name: string;
  email: string;
  mobile: string;
  password?: string;
  role: 'farmer' | 'admin' | 'expert';
  state: string;
  district: string;
  village: string;
  landArea: number; // in acres
  primaryCrop: string;
  avatar?: string;
  isBlocked: boolean;
  matchPassword(enteredPassword: string): Promise<boolean>;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    mobile: { type: String, required: true, trim: true },
    password: { type: String, required: true, minlength: 6 },
    role: { type: String, enum: ['farmer', 'admin', 'expert'], default: 'farmer' },
    state: { type: String, default: 'Gujarat' },
    district: { type: String, default: 'Ahmedabad' },
    village: { type: String, default: 'Sanand' },
    landArea: { type: Number, default: 5 },
    primaryCrop: { type: String, default: 'Cotton' },
    avatar: { type: String, default: 'https://images.unsplash.com/photo-1595278069441-2cf29f8005a4?auto=format&fit=crop&q=80&w=300' },
    isBlocked: { type: Boolean, default: false },
  },
  { timestamps: true }
);

UserSchema.pre('save', async function (next) {
  if (!this.isModified('password') || !this.password) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

UserSchema.methods.matchPassword = async function (enteredPassword: string): Promise<boolean> {
  return await bcrypt.compare(enteredPassword, this.password);
};

export const User = mongoose.model<IUser>('User', UserSchema);
