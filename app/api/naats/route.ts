import { NextRequest, NextResponse } from "next/server";

import dbConnect from "@/lib/db/mongodb";

import { getAllNaats, createOneNaat } from "@/controllers/naat.controller";

export async function GET(req: NextRequest) {
  try {
    await dbConnect();

    const naats = await getAllNaats();

    return NextResponse.json({ success: true, data: naats }, { status: 200 });
  } catch (error) {
    console.error("Error in GET /api/naats:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch naats" },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    const body = await req.json();

    const naat = await createOneNaat(body);

    return NextResponse.json(
      { success: true, message: "Naat created successfully", data: naat },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error in POST /api/naats:", error);
    return NextResponse.json(
      { success: false, message: "Failed to create naat" },
      { status: 500 },
    );
  }
}
