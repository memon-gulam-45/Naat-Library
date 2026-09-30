import { NextRequest, NextResponse } from "next/server";

import dbConnect from "@/lib/db/mongodb";

import {
  getNaatBySlug,
  updateNaat,
  deleteNaat,
} from "@/controllers/naat.controller";

import { requireAdmin } from "@/lib/auth/admin-auth";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    await dbConnect();

    const { slug } = await params;
    const naat = await getNaatBySlug(slug);
    return NextResponse.json({ success: true, data: naat }, { status: 200 });
  } catch (error) {
    console.error("Error fetching naat by slug:", error);
    return NextResponse.json(
      { error: "Failed to fetch naat by slug" },
      { status: 500 },
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
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
    const { slug } = await params;
    const data = await request.json();
    const naat = await updateNaat(slug, data);
    return NextResponse.json(
      { success: true, message: "Naat updated successfully", data: naat },
      { status: 200 },
    );
  } catch (error: any) {
    console.error("Error updating naat:", error);

    if (error.message === "Naat not found") {
      return NextResponse.json(
        { success: false, error: "Naat not found" },
        { status: 404 },
      );
    }

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
      { error: "Failed to update naat" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
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

    const { slug } = await params;
    const naat = await deleteNaat(slug);

    return NextResponse.json(
      { success: true, message: "Naat deleted successfully", data: naat },
      { status: 200 },
    );
  } catch (error: any) {
    console.error("Error deleting naat:", error);

    if (error.message === "Naat not found") {
      return NextResponse.json(
        { success: false, error: "Naat not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(
      { error: "Failed to delete naat" },
      { status: 500 },
    );
  }
}
