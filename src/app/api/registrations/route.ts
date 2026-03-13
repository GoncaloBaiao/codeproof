import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/registrations?walletAddress=0x...
 * Returns all registrations for a wallet, ordered by newest first.
 */
export async function GET(request: NextRequest) {
  try {
    const walletAddress = request.nextUrl.searchParams.get("walletAddress");

    if (!walletAddress) {
      return NextResponse.json(
        { error: "walletAddress is required" },
        { status: 400 }
      );
    }

    const registrations = await prisma.registration.findMany({
      where: { walletAddress: walletAddress.toLowerCase() },
      select: {
        id: true,
        hash: true,
        projectName: true,
        description: true,
        txHash: true,
        createdAt: true,
        isPublic: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ registrations });
  } catch (error) {
    console.error("Registrations fetch error:", error);
    return NextResponse.json(
      { error: "Failed to load registrations" },
      { status: 500 }
    );
  }
}
