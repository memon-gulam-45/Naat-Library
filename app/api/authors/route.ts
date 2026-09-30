import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db/mongodb";

import {
  getAllAuthors,
  createOneAuthor,
} from "@/controllers/author.controller";

import { requireAdmin } from "@/lib/auth/admin-auth";

export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    const authors = await getAllAuthors();
    return NextResponse.json({ success: true, data: authors }, { status: 200 });
  } catch (error) {
    console.error("Error fetching authors:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch authors" },
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
    console.log(body);
    const author = await createOneAuthor(body);
    return NextResponse.json(
      { success: true, message: "Author created successfully", data: author },
      { status: 201 },
    );
  } catch (error: any) {
    console.error("Error creating author:", error);

    if (error.code === 11000) {
      return NextResponse.json(
        { success: false, error: "Author with this slug already exists" },
        { status: 409 },
      );
    }

    return NextResponse.json(
      { success: false, error: "Failed to create author" },
      { status: 500 },
    );
  }
}
