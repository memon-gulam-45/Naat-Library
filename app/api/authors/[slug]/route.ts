import { NextRequest, NextResponse } from "next/server";

import dbConnect from "@/lib/db/mongodb";

import {
  getAuthorBySlug,
  updateAuthor,
  deleteAuthor,
} from "@/controllers/author.controller";

import { requireAdmin } from "@/lib/auth/admin-auth";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    await dbConnect();
    const { slug } = await params;
    const author = await getAuthorBySlug(slug);
    return NextResponse.json({ success: true, data: author }, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching author by slug:", error);

    if (error.message === "Author not found") {
      return NextResponse.json(
        { success: false, error: "Author not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(
      { success: false, error: "Failed to fetch author" },
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
    const body = await request.json();
    const updatedAuthor = await updateAuthor(slug, body);
    return NextResponse.json(
      {
        success: true,
        message: "Author updated successfully",
        data: updatedAuthor,
      },
      { status: 200 },
    );
  } catch (error: any) {
    console.error("Error updating author:", error);
    if (error.message === "Author not found") {
      return NextResponse.json(
        { success: false, error: "Author not found" },
        { status: 404 },
      );
    }

    // Duplicate slug
    if (error.code === 11000) {
      return NextResponse.json(
        {
          success: false,
          message: "A author with this slug already exists",
        },
        { status: 409 },
      );
    }

    return NextResponse.json(
      { success: false, error: "Failed to update author" },
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
    const deletedAuthor = await deleteAuthor(slug);
    return NextResponse.json(
      {
        success: true,
        message: "Author deleted successfully",
        data: deletedAuthor,
      },
      { status: 200 },
    );
  } catch (error: any) {
    console.error("Error deleting author:", error);
    if (error.message === "Author not found") {
      return NextResponse.json(
        { success: false, error: "Author not found" },
        { status: 404 },
      );
    }
    return NextResponse.json(
      { success: false, error: "Failed to delete author" },
      { status: 500 },
    );
  }
}
