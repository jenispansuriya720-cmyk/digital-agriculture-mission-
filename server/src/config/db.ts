import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongoMemoryServer: MongoMemoryServer | null = null;

export const connectDB = async (): Promise<void> => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/krishi_digital';

  try {
    // Set connection timeout low so if local daemon isn't available we fallback quickly
    mongoose.set('strictQuery', false);
    
    // Attempt standard connection first
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 2500,
    });
    console.log(`✅ MongoDB Connected successfully to: ${mongoose.connection.host}/${mongoose.connection.name}`);
  } catch (primaryErr) {
    console.warn(`⚠️ Could not connect to primary MongoDB URI (${uri}). Initializing embedded MongoDB engine...`);
    try {
      mongoMemoryServer = await MongoMemoryServer.create({
        instance: {
          dbName: 'krishi_digital',
        },
      });
      const memUri = mongoMemoryServer.getUri();
      await mongoose.connect(memUri);
      console.log(`✅ Connected to Embedded In-Memory MongoDB Engine at: ${memUri}`);
      console.log(`💡 Note: For persistent storage across restarts, set a live MONGODB_URI in server/.env (e.g. MongoDB Atlas).`);
    } catch (fallbackErr) {
      console.error('❌ Failed to connect to MongoDB and in-memory fallback failed:', fallbackErr);
      process.exit(1);
    }
  }
};

export const disconnectDB = async (): Promise<void> => {
  await mongoose.disconnect();
  if (mongoMemoryServer) {
    await mongoMemoryServer.stop();
  }
};
