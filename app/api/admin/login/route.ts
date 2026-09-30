import { NextRequest } from "next/server";

import { loginAdmin } from "@/controllers/admin.controller";

export async function POST(request: NextRequest) {
  return loginAdmin(request);
}
