import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { PLANS } from "@/lib/plans";

export async function POST(req: NextRequest) {
  try {
    const { walletAddress } = await req.json();

    if (!walletAddress || typeof walletAddress !== "string") {
      return NextResponse.json({ error: "walletAddress is required" }, { status: 400 });
    }

    const normalized = walletAddress.toLowerCase();

    const user = await prisma.walletUser.upsert({
      where: { walletAddress: normalized },
      update: {},
      create: { walletAddress: normalized },
    });

    return NextResponse.json({
      walletAddress: user.walletAddress,
      plan: user.plan,
      monthlyRegistrations: user.monthlyRegistrations,
      limit: PLANS[user.plan].monthlyRegistrations,
    });
  } catch (error) {
    console.error("Wallet register error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
