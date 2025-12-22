import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
const dbURI = process.env.MONGODB_URI;
export async function connectDB() {
  try {
    await mongoose.connect(dbURI!);
  } catch (err: any) {
    process.exit(1);
  }
}
