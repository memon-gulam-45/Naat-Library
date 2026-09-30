import bcrypt from "bcrypt";
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
import mongoose from "mongoose";
// import dbConnect from "@/lib/db/mongodb";
import User from "@/models/User";

const MONGODB_URI = process.env.MONGODB_URI;

const ADMIN_USERNAME = process.env.ADMIN_USERNAME;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

async function createAdmin() {
  try {
    if (!MONGODB_URI) {
      throw new Error("MONGODB_URI is not defined");
    }

    await mongoose.connect(MONGODB_URI);

    console.log("Connected to MongoDB");

    // Check if admin already exists
    const existingAdmin = await User.findOne({
      username: ADMIN_USERNAME?.toLowerCase(),
    });

    if (existingAdmin) {
      await User.deleteOne({ role: "admin" });
      console.log("Existing Admin deleted.");
      // return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 12);

    // Create admin
    const user = await User.create({
      username: ADMIN_USERNAME?.toLowerCase(),
      password: hashedPassword,
    });

    console.log("User created successfully.");
    console.log({
      id: user._id.toString(),
      username: user.username,
      role: user.role,
    });
  } catch (error) {
    console.error("Failed to create user:", error);
  } finally {
    await mongoose.disconnect();
  }
}

createAdmin();
