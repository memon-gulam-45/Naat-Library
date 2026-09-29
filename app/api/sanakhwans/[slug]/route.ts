import { NextResponse, NextRequest } from "next/server";

import dbConnect from "@/lib/db/mongodb";

import {
  getSanakhwanBySlug,
  updateSanakhwan,
  deleteSanakhwan,
} from "@/controllers/sanakhwan.controller";

// GET /api/sanakhwans/:slug
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    await dbConnect();

    const { slug } = await params;

    const sanakhwan = await getSanakhwanBySlug(slug);

    return NextResponse.json({
      success: true,
      data: sanakhwan,
    });
  } catch (error: any) {
    console.error("Error fetching sanakhwan:", error);

    if (error.message === "Sanakhwan not found") {
      return NextResponse.json(
        {
          success: false,
          message: "Sanakhwan not found",
        },
        { status: 404 },
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch sanakhwan",
      },
      { status: 500 },
    );
  }
}

// PUT /api/sanakhwans/:slug
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    await dbConnect();

    const { slug } = await params;

    const body = await request.json();

    const sanakhwan = await updateSanakhwan(slug, body);

    return NextResponse.json({
      success: true,
      message: "Sanakhwan updated successfully",
      data: sanakhwan,
    });
  } catch (error: any) {
    console.error("Error updating sanakhwan:", error);

    if (error.message === "Sanakhwan not found") {
      return NextResponse.json(
        {
          success: false,
          message: "Sanakhwan not found",
        },
        { status: 404 },
      );
    }

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
        message: "Failed to update sanakhwan",
      },
      { status: 500 },
    );
  }
}

// DELETE /api/sanakhwans/:slug
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    await dbConnect();

    const { slug } = await params;

    await deleteSanakhwan(slug);

    return NextResponse.json({
      success: true,
      message: "Sanakhwan deleted successfully",
    });
  } catch (error: any) {
    console.error("Error deleting sanakhwan:", error);

    if (error.message === "Sanakhwan not found") {
      return NextResponse.json(
        {
          success: false,
          message: "Sanakhwan not found",
        },
        { status: 404 },
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: "Failed to delete sanakhwan",
      },
      { status: 500 },
    );
  }
}
