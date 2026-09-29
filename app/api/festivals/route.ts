import { NextResponse, NextRequest } from "next/server";

import dbConnect from "@/lib/db/mongodb";

import {
  getAllFestivals,
  createOneFestival,
} from "@/controllers/festival.controller";

// GET /api/festivals
export async function GET() {
  try {
    await dbConnect();

    const festivals = await getAllFestivals();

    return NextResponse.json(
      {
        success: true,
        data: festivals,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error fetching festivals:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch festivals",
      },
      { status: 500 },
    );
  }
}

// POST /api/festivals
export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const body = await request.json();

    const festival = await createOneFestival(body);

    return NextResponse.json(
      {
        success: true,
        message: "Festival created successfully",
        data: festival,
      },
      { status: 201 },
    );
  } catch (error: any) {
    console.error("Error creating festival:", error);

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
        message: "Failed to create festival",
      },
      { status: 500 },
    );
  }
}
