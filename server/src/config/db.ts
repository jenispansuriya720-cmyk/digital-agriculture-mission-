import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongoMemoryServer: MongoMemoryServer | null = null;

export const connectDB = async (): Promise<void> => {
  try {
    const mongoUri = process.env.MONGODB_URI;

    if (!mongoUri) {
      if (process.env.NODE_ENV === 'production') {
        throw new Error('MONGODB_URI is not configured in environment variables');
      }
      console.warn('⚠️ MONGODB_URI not provided. Starting embedded MongoDB engine for local development...');
      mongoMemoryServer = await MongoMemoryServer.create({
        instance: { dbName: 'krishi_digital' },
      });
      const memUri = mongoMemoryServer.getUri();
      await mongoose.connect(memUri);
      console.log(`✅ Connected to Embedded In-Memory MongoDB Engine at: ${memUri}`);
      return;
    }

    // Connect to configured MongoDB URI (e.g. MongoDB Atlas)
    await mongoose.connect(mongoUri);
    console.log(`✅ MongoDB connected successfully to: ${mongoose.connection.host}/${mongoose.connection.name}`);
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error);

    // If local dev and primary connection failed, attempt in-memory fallback
    if (process.env.NODE_ENV !== 'production' && !mongoMemoryServer) {
      try {
        console.warn('⚠️ Attempting fallback to embedded in-memory MongoDB engine...');
        mongoMemoryServer = await MongoMemoryServer.create({
          instance: { dbName: 'krishi_digital' },
        });
        const memUri = mongoMemoryServer.getUri();
        await mongoose.connect(memUri);
        console.log(`✅ Connected to Embedded In-Memory MongoDB Engine at: ${memUri}`);
        return;
      } catch (fallbackErr) {
        console.error('❌ In-memory MongoDB fallback also failed:', fallbackErr);
      }
    }

    process.exit(1);
  }
};

export const disconnectDB = async (): Promise<void> => {
  await mongoose.disconnect();
  if (mongoMemoryServer) {
    await mongoMemoryServer.stop();
  }
};
