import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/user/subscription?walletAddress=0x...
 * Returns the current subscription state for the given wallet.
 */
export async function GET(req: NextRequest) {
  try {
    const walletAddress = req.nextUrl.searchParams.get("walletAddress");

    if (!walletAddress) {
      return NextResponse.json(
        { error: "walletAddress query param is required" },
        { status: 400 }
      );
    }

    const normalized = walletAddress.toLowerCase();

    const user = await prisma.walletUser.findUnique({
      where: { walletAddress: normalized },
    });

    if (!user || user.plan !== "PRO") {
      return NextResponse.json({ isPro: false, subscription: null });
    }

    const subscription = await prisma.subscription.findFirst({
      where: { walletAddress: normalized },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      isPro: true,
      subscription: subscription
        ? {
            status: subscription.status,
            currentPeriodEnd: subscription.currentPeriodEnd?.toISOString() ?? null,
          }
        : null,
    });
  } catch (error) {
    console.error("Subscription check error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
