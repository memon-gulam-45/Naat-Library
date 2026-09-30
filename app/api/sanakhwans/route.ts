import { NextResponse, NextRequest } from "next/server";

import dbConnect from "@/lib/db/mongodb";

import {
  getAllSanakhwans,
  createOneSanakhwan,
} from "@/controllers/sanakhwan.controller";

import { requireAdmin } from "@/lib/auth/admin-auth";

// GET /api/sanakhwans
export async function GET() {
  try {
    await dbConnect();

    const sanakhwans = await getAllSanakhwans();

    return NextResponse.json({
      success: true,
      data: sanakhwans,
    });
  } catch (error) {
    console.error("Error fetching sanakhwans:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch sanakhwans",
      },
      { status: 500 },
    );
  }
}

// POST /api/sanakhwans
export async function POST(request: NextRequest) {
  try {
    const auth = await requireAdmin(request);

    if (!auth.authenticated) {
      return NextResponse.json(
        {
          success: false,
          message: auth.message,
        },
        { status: 401 },
      );
    }
    await dbConnect();

    const body = await request.json();

    const sanakhwan = await createOneSanakhwan(body);

    return NextResponse.json(
      {
        success: true,
        message: "Sanakhwan created successfully",
        data: sanakhwan,
      },
      { status: 201 },
    );
  } catch (error: any) {
    console.error("Error creating sanakhwan:", error);

    // Duplicate slug
    if (error.code === 11000) {
      return NextResponse.json(
        {
          success: false,
          message: "A sanakhwan with this slug already exists",
        },
        { status: 409 },
      );
    }

    // Mongoose validation error
    if (error.name === "ValidationError") {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid sanakhwan data",
          errors: error.errors,
        },
        { status: 400 },
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: "Failed to create sanakhwan",
      },
      { status: 500 },
    );
  }
}
