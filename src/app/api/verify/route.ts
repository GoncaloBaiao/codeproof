import { NextRequest, NextResponse } from "next/server";

/**
 * Verify a code hash registration (Phase 2: will query database)
 * GET /api/verify?hash=0x123...
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const hash = searchParams.get("hash");

  if (!hash) {
    return NextResponse.json(
      { error: "Hash parameter is required" },
      { status: 400 }
    );
  }

  // Phase 2: Query database for registration
  return NextResponse.json(
    {
      note: "Database query implementation coming in Phase 2",
      hash,
      found: false,
    },
    { status: 200 }
  );
}

/**
 * Save registration metadata to database (Phase 2)
 * POST /api/verify { hash, userId, metadata }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { hash, metadata } = body;

    if (!hash || !metadata) {
      return NextResponse.json(
        { error: "Hash and metadata are required" },
        { status: 400 }
      );
    }

    // Phase 2: Save to Prisma/PostgreSQL
    return NextResponse.json(
      {
        note: "Database save implementation coming in Phase 2",
        hash,
        saved: false,
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Invalid request" },
      { status: 400 }
    );
  }
}
