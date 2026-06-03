import mongoose from 'mongoose';

export const connectDB = async (): Promise<void> => {
  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) {
    console.log('⚠️  No MONGODB_URI provided — running in mock/memory mode');
    return;
  }
  try {
    await mongoose.connect(mongoUri);
    console.log('✅ MongoDB connected');
  } catch (err) {
    console.error('❌ MongoDB connection failed:', err);
    process.exit(1);
  }
};
