import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { PLANS } from "@/lib/plans";

export async function GET(req: NextRequest) {
  try {
    const walletAddress = req.nextUrl.searchParams.get("walletAddress");

    if (!walletAddress) {
      return NextResponse.json({ error: "walletAddress query param is required" }, { status: 400 });
    }

    const normalized = walletAddress.toLowerCase();

    let user = await prisma.walletUser.findUnique({
      where: { walletAddress: normalized },
    });

    if (!user) {
      return NextResponse.json({
        plan: "FREE",
        registrationsUsed: 0,
        registrationsLimit: PLANS.FREE.monthlyRegistrations,
        canRegister: true,
      });
    }

    // Reset monthly count if we're in a new month
    const now = new Date();
    const lastReset = new Date(user.lastResetDate);
    if (now.getMonth() !== lastReset.getMonth() || now.getFullYear() !== lastReset.getFullYear()) {
      user = await prisma.walletUser.update({
        where: { walletAddress: normalized },
        data: { monthlyRegistrations: 0, lastResetDate: now },
      });
    }

    const limit = PLANS[user.plan as keyof typeof PLANS].monthlyRegistrations;
    const canRegister = user.plan === "PRO" || user.monthlyRegistrations < limit;

    return NextResponse.json({
      plan: user.plan,
      registrationsUsed: user.monthlyRegistrations,
      registrationsLimit: limit === Infinity ? "unlimited" : limit,
      canRegister,
    });
  } catch (error) {
    console.error("Wallet status error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
