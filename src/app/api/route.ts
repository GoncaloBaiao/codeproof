import { NextResponse } from "next/server";

/**
 * Health check endpoint for the API
 */
export async function GET() {
  return NextResponse.json(
    {
      status: "ok",
      message: "CodeProof API is running",
      version: "1.0.0",
    },
    { status: 200 }
  );
}
