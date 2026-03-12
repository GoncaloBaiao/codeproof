import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const walletAddress = req.nextUrl.searchParams.get("walletAddress");

    if (!walletAddress) {
      return NextResponse.json({ error: "walletAddress query param is required" }, { status: 400 });
    }

    const user = await prisma.walletUser.findUnique({
      where: { walletAddress: walletAddress.toLowerCase() },
    });

    if (!user || user.plan !== "PRO") {
      return NextResponse.json({ isPro: false });
    }

    return NextResponse.json({
      isPro: true,
      activatedAt: user.licenseActivatedAt?.toISOString() ?? null,
    });
  } catch (error) {
    console.error("License check error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
