import { NextRequest } from "next/server";
import dbConnect from "@/lib/db/mongodb";
import { verifyToken } from "@/lib/auth/jwt";
import User from "@/models/User";

export async function requireAdmin(request: NextRequest) {
  try {
    const token = request.cookies.get("admin_token")?.value;

    if (!token) {
      return {
        authenticated: false,
        message: "Authentication required",
      };
    }

    const payload = await verifyToken(token);

    if (!payload) {
      return {
        authenticated: false,
        message: "Invalid or expired session",
      };
    }

    await dbConnect();
    const user = await User.findById(payload.userId).select("+sessionId");

    if (!user) {
      return { authenticated: false, message: "User not found" };
    }

    if (payload.role !== "admin" || !payload.userId) {
      return {
        authenticated: false,
        message: "Admin access required",
      };
    }

    if (user.sessionId !== token) {
      return {
        authenticated: false,
        message: "Session expired. Please log in again.",
      };
    }

    return {
      authenticated: true,
      userId: payload.userId.toString(),
      role: payload.role,
    };
  } catch (error) {
    console.error("Error in requireAdmin:", error);
    return {
      authenticated: false,
      message: "An error occurred during authentication",
    };
  }
}
