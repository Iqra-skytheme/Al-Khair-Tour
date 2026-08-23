import mongoose from "mongoose";

let connected = false;

export async function connectDB() {
  if (connected) return mongoose.connection;

  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error(
      "MONGODB_URI is not set. Copy .env.example to .env and fill in your MongoDB connection string.",
    );
  }

  await mongoose.connect(uri);
  connected = true;
  console.log("[mongodb] connected");
  return mongoose.connection;
}
