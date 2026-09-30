import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (MONGODB_URI === undefined) {
  throw new Error("Please define the MONGODB_URI environment variable");
}

async function dbConnect() {
  await mongoose.connect(MONGODB_URI);
  return mongoose;
}

export default dbConnect;
