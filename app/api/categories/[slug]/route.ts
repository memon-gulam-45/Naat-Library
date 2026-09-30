import { NextResponse, NextRequest } from "next/server";

import dbConnect from "@/lib/db/mongodb";

import {
  getCategoryBySlug,
  updateCategory,
  deleteCategory,
} from "@/controllers/category.controller";

import { requireAdmin } from "@/lib/auth/admin-auth";

// GET /api/categories/:slug
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    await dbConnect();

    const { slug } = await params;

    const category = await getCategoryBySlug(slug);

    return NextResponse.json(
      {
        success: true,
        data: category,
      },
      { status: 200 },
    );
  } catch (error: any) {
    console.error("Error fetching Category:", error);

    if (error.message === "Category not found") {
      return NextResponse.json(
        {
          success: false,
          message: "Category not found",
        },
        { status: 404 },
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch category",
      },
      { status: 500 },
    );
  }
}

// PUT /api/categories/:slug
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

    const category = await updateCategory(slug, body);

    return NextResponse.json(
      {
        success: true,
        message: "Category updated successfully",
        data: category,
      },
      { status: 200 },
    );
  } catch (error: any) {
    console.error("Error updating category:", error);

    if (error.message === "Category not found") {
      return NextResponse.json(
        {
          success: false,
          message: "Category not found",
        },
        { status: 404 },
      );
    }

    // Duplicate slug
    if (error.code === 11000) {
      return NextResponse.json(
        {
          success: false,
          message: "A category with this slug already exists",
        },
        { status: 409 },
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: "Failed to update category",
      },
      { status: 500 },
    );
  }
}

// DELETE /api/categories/:slug
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

    await deleteCategory(slug);

    return NextResponse.json(
      {
        success: true,
        message: "Category deleted successfully",
      },
      { status: 200 },
    );
  } catch (error: any) {
    console.error("Error deleting category:", error);

    if (error.message === "Category not found") {
      return NextResponse.json(
        {
          success: false,
          message: "Category not found",
        },
        { status: 404 },
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: "Failed to delete category",
      },
      { status: 500 },
    );
  }
}
