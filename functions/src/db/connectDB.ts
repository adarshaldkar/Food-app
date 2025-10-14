import mongoose from "mongoose";

const connectDB = async (): Promise<void> => {
  try {
    // Check if already connected
    if (mongoose.connections[0].readyState) {
      console.log("MongoDB already connected.");
      return;
    }

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    await mongoose.connect(process.env.MONGO_URI!);
    console.log("MongoDB connected.");
  } catch (error) {
    console.log("MongoDB connection error:", error);
    throw error;
  }
};

export default connectDB;
