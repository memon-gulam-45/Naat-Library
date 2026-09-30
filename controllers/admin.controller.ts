import { NextResponse, NextRequest } from "next/server";
import bcrypt from "bcrypt";

import dbConnect from "@/lib/db/mongodb";
import User from "@/models/User";

import { createToken } from "@/lib/auth/jwt";

export async function loginAdmin(request: NextRequest) {
  try {
    await dbConnect();

    const body = await request.json();

    const { username, password } = body;

    // Validate input
    if (!username || !password) {
      return Response.json(
        {
          success: false,
          message: "Username and password are required",
        },
        { status: 400 },
      );
    }

    // Find user
    const user = await User.findOne({
      username: username.toLowerCase(),
    }).select("+password");

    if (!user) {
      return Response.json(
        {
          success: false,
          message: "Invalid username or password",
        },
        { status: 401 },
      );
    }

    // Check role
    if (user.role !== "admin") {
      return Response.json(
        {
          success: false,
          message: "Access denied",
        },
        { status: 403 },
      );
    }

    // Check account status
    if (!user.isActive) {
      return Response.json(
        {
          success: false,
          message: "Admin account is inactive",
        },
        { status: 403 },
      );
    }

    // Compare password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return Response.json(
        {
          success: false,
          message: "Invalid username or password",
        },
        { status: 401 },
      );
    }

    // Create JWT
    const token = await createToken(user._id.toString());

    // Store token as sessionId
    user.sessionId = token;

    await user.save();

    // Create response
    const response = Response.json({
      success: true,
      message: "Login successful",
      data: {
        id: user._id,
        name: user.name,
        username: user.username,
        role: user.role,
      },
    });

    // Set HTTP-only cookie
    response.headers.set(
      "Set-Cookie",
      [
        `admin_token=${token}`,
        "HttpOnly",
        "Path=/",
        "SameSite=Lax",
        "Max-Age=2592000",
        process.env.NODE_ENV === "production" ? "Secure" : "",
      ]
        .filter(Boolean)
        .join("; "),
    );

    return response;
  } catch (error) {
    console.error("Admin login error:", error);

    return Response.json(
      {
        success: false,
        message: "Login failed",
      },
      { status: 500 },
    );
  }
}
