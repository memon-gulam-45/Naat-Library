import { NextRequest, NextResponse } from "next/server";

import dbConnect from "@/lib/db/mongodb";

import { getAllNaats, createOneNaat } from "@/controllers/naat.controller";

import { requireAdmin } from "@/lib/auth/admin-auth";

export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const naats = await getAllNaats();

    return NextResponse.json({ success: true, data: naats }, { status: 200 });
  } catch (error: any) {
    console.error("Error in GET /api/naats:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch naats" },
      { status: 500 },
    );
  }
}

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

    const naat = await createOneNaat(body);

    return NextResponse.json(
      { success: true, message: "Naat created successfully", data: naat },
      { status: 201 },
    );
  } catch (error: any) {
    console.error("Error creating naat:", error);

    // Duplicate slug
    if (error.code === 11000) {
      return NextResponse.json(
        {
          success: false,
          message: "A naat with this slug already exists",
        },
        { status: 409 },
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: "Failed to create naat",
      },
      { status: 500 },
    );
  }
}
