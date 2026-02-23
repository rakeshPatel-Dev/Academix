import mongoose from "mongoose"

const MONGO_URI = process.env.MONGODB_URI;


const connectDB = async () => {

  if (!MONGO_URI) {
    console.log("MONGODB URI is missing in ENV file.");
  }
  try {
    await mongoose.connect(MONGO_URI)
    console.log("Database connected successfully!");
  } catch (error) {
    console.log("Failed to connect to database.");
  }
}

export default connectDB;