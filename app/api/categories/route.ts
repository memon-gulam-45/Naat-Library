import { NextRequest, NextResponse } from "next/server";

import dbConnect from "@/lib/db/mongodb";

import {
  getAllCategories,
  createOneCategory,
} from "@/controllers/category.controller";

// GET /api/categories
export async function GET() {
  try {
    await dbConnect();

    const categories = await getAllCategories();

    return NextResponse.json(
      {
        success: true,
        data: categories,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error fetching categories:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch categories",
      },
      { status: 500 },
    );
  }
}

// POST /api/categories
export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const body = await request.json();

    const category = await createOneCategory(body);

    return NextResponse.json(
      {
        success: true,
        message: "Category created successfully",
        data: category,
      },
      { status: 201 },
    );
  } catch (error: any) {
    console.error("Error creating category:", error);

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
        message: "Failed to create category",
      },
      { status: 500 },
    );
  }
}
