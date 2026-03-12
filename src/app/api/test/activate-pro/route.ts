import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  // Block in production
  if (process.env.NODE_ENV !== "development") {
    return NextResponse.json({ error: "Not available in production" }, { status: 403 });
  }

  try {
    const { walletAddress } = await req.json();

    if (!walletAddress) {
      return NextResponse.json({ error: "walletAddress is required" }, { status: 400 });
    }

    const normalized = walletAddress.toLowerCase();

    await prisma.walletUser.upsert({
      where: { walletAddress: normalized },
      update: { plan: "PRO", licenseActivatedAt: new Date() },
      create: {
        walletAddress: normalized,
        plan: "PRO",
        licenseActivatedAt: new Date(),
      },
    });

    return NextResponse.json({ success: true, message: "Pro activated for testing" });
  } catch (error) {
    console.error("Test activate error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
