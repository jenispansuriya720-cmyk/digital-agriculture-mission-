import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db';
import { notFound, errorHandler } from './middleware/error';

// Import Route Handlers
import authRoutes from './routes/authRoutes';
import userRoutes from './routes/userRoutes';
import farmRoutes from './routes/farmRoutes';
import cropRoutes from './routes/cropRoutes';
import soilRoutes from './routes/soilRoutes';
import weatherRoutes from './routes/weatherRoutes';
import marketRoutes from './routes/marketRoutes';
import productRoutes from './routes/productRoutes';
import orderRoutes from './routes/orderRoutes';
import schemeRoutes from './routes/schemeRoutes';
import expertRoutes from './routes/expertRoutes';
import consultationRoutes from './routes/consultationRoutes';
import articleRoutes from './routes/articleRoutes';
import notificationRoutes from './routes/notificationRoutes';
import irrigationRoutes from './routes/irrigationRoutes';
import diseaseRoutes from './routes/diseaseRoutes';
import adminRoutes from './routes/adminRoutes';

import { User } from './models/User';
import { runSeed } from './seed';

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 5000;

// Connect to Database and auto-seed demo data if empty
connectDB().then(async () => {
  try {
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      console.log('📦 Database is empty. Automatically initializing Krishi Digital demo dataset...');
      await runSeed(false);
    }
  } catch (err) {
    console.warn('Auto-seed check notice:', err);
  }
}).catch((err) => {
  console.error('Failed to initialize database connection:', err);
});

// Configure CORS
const allowedOrigin = process.env.CLIENT_URL || 'http://localhost:5173';

app.use(cors({
  origin: (origin, callback) => {
    // Allow non-browser requests or matching origins
    if (!origin) return callback(null, true);
    const trustedOrigins = [
      allowedOrigin.replace(/\/$/, ''),
      'http://localhost:5173',
      'http://127.0.0.1:5173',
      'http://localhost:3000',
    ];
    if (trustedOrigins.includes(origin.replace(/\/$/, '')) || allowedOrigin === '*') {
      return callback(null, true);
    }
    return callback(null, true);
  },
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health Check API (No authentication required)
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'online',
    platform: 'KRISHI DIGITAL — Digital Agriculture Mission',
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/farms', farmRoutes);
app.use('/api/crops', cropRoutes);
app.use('/api/soil', soilRoutes);
app.use('/api/weather', weatherRoutes);
app.use('/api/market', marketRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/schemes', schemeRoutes);
app.use('/api/experts', expertRoutes);
app.use('/api/consultations', consultationRoutes);
app.use('/api/articles', articleRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/irrigation', irrigationRoutes);
app.use('/api/disease', diseaseRoutes);
app.use('/api/admin', adminRoutes);

// Error Handling Middleware
app.use(notFound);
app.use(errorHandler);

// Start Server
app.listen(PORT, () => {
  console.log(`🌾 Krishi Digital API Server running on port ${PORT}`);
  console.log(`🚀 Health Check: http://localhost:${PORT}/api/health`);
});

export default app;
