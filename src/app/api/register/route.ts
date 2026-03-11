import { NextRequest, NextResponse } from "next/server";

/**
 * Save code registration to database (Phase 2)
 * POST /api/register
 * Body: { hash, projectName, description, txHash, blockNumber, timestamp, userId }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { hash, projectName, txHash, blockNumber, timestamp, metadata } = body;

    if (!hash || !projectName) {
      return NextResponse.json(
        { error: "Hash and projectName are required" },
        { status: 400 }
      );
    }

    // Phase 2: Save registration to Prisma/PostgreSQL
    // Example Prisma code:
    // const registration = await prisma.registration.create({
    //   data: {
    //     hash,
    //     projectName,
    //     description: metadata?.description,
    //     txHash,
    //     blockNumber,
    //     timestamp: BigInt(timestamp),
    //     userId,
    //     isPublic: true,
    //   },
    // });

    return NextResponse.json(
      {
        note: "Database save implementation coming in Phase 2",
        hash,
        projectName,
        registered: false,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Invalid request" },
      { status: 400 }
    );
  }
}

/**
 * Get user registrations (Phase 2)
 * GET /api/register?userId=...
 */
export async function GET(request: NextRequest) {
  // Phase 2: Query registrations by user
  return NextResponse.json(
    {
      note: "User registration retrieval coming in Phase 2",
      registrations: [],
    },
    { status: 200 }
  );
}
