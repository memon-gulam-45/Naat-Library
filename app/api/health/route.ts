import dbConnect from "@/lib/db/mongodb";

export async function GET() {
  try {
    await dbConnect();

    return Response.json({
      success: true,
      message: "Database connected successfully",
    });
  } catch (error) {
    console.error("Database connection error:", error);

    return Response.json(
      {
        success: false,
        message: "Database connection failed",
      },
      { status: 500 },
    );
  }
}
