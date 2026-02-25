import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('❌ MONGODB_URI is missing in environment variables');
}

// Cache connection for serverless
let cached = global.mongoose || { conn: null, promise: null };
global.mongoose = cached;

const connectDB = async () => {
  // Return cached connection if exists
  if (cached.conn) {
    console.log('📦 Using cached database connection');
    return cached.conn;
  }

  try {
    // Create new connection if no cached promise
    if (!cached.promise) {
      cached.promise = mongoose.connect(MONGODB_URI);
    }

    cached.conn = await cached.promise;

    console.log('✅ Database connected successfully');
    return cached.conn;

  } catch (error) {
    cached.promise = null; // Reset promise so future retries work
    console.error('❌ Database connection failed:', error.message);
    throw new Error('Database connection failed');
  }
};

// Handle disconnection gracefully
mongoose.connection.on('disconnected', () => {
  console.log('⚠️ Database disconnected');
  cached.conn = null;
  cached.promise = null;
});


export default connectDB;