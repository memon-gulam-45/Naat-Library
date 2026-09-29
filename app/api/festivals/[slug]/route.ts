import { NextResponse, NextRequest } from "next/server";

import dbConnect from "@/lib/db/mongodb";

import {
  getFestivalBySlug,
  updateFestival,
  deleteFestival,
} from "@/controllers/festival.controller";

// GET /api/festivals/:slug
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    await dbConnect();

    const { slug } = await params;

    const festival = await getFestivalBySlug(slug);

    return NextResponse.json(
      {
        success: true,
        data: festival,
      },
      { status: 200 },
    );
  } catch (error: any) {
    console.error("Error fetching festival:", error);

    if (error.message === "Festival not found") {
      return NextResponse.json(
        {
          success: false,
          message: "Festival not found",
        },
        { status: 404 },
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch festival",
      },
      { status: 500 },
    );
  }
}

// PUT /api/festivals/:slug
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    await dbConnect();

    const { slug } = await params;

    const body = await request.json();

    const festival = await updateFestival(slug, body);

    return NextResponse.json(
      {
        success: true,
        message: "Festival updated successfully",
        data: festival,
      },
      { status: 200 },
    );
  } catch (error: any) {
    console.error("Error updating festival:", error);

    if (error.message === "Festival not found") {
      return NextResponse.json(
        {
          success: false,
          message: "Festival not found",
        },
        { status: 404 },
      );
    }

    // Duplicate slug
    if (error.code === 11000) {
      return NextResponse.json(
        {
          success: false,
          message: "A festival with this slug already exists",
        },
        { status: 409 },
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: "Failed to update festival",
      },
      { status: 500 },
    );
  }
}

// DELETE /api/festivals/:slug
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    await dbConnect();

    const { slug } = await params;

    await deleteFestival(slug);

    return NextResponse.json(
      {
        success: true,
        message: "Festival deleted successfully",
      },
      { status: 200 },
    );
  } catch (error: any) {
    console.error("Error deleting festival:", error);

    if (error.message === "Festival not found") {
      return NextResponse.json(
        {
          success: false,
          message: "Festival not found",
        },
        { status: 404 },
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: "Failed to delete festival",
      },
      { status: 500 },
    );
  }
}
