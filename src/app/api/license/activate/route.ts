import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { walletAddress, licenseKey } = await req.json();

    if (!walletAddress || !licenseKey) {
      return NextResponse.json(
        { success: false, message: "walletAddress and licenseKey are required" },
        { status: 400 }
      );
    }

    const normalized = walletAddress.toLowerCase();
    const trimmedKey = licenseKey.trim();

    // Check if license is already used by another wallet
    const existingLicense = await prisma.walletUser.findUnique({
      where: { licenseKey: trimmedKey },
    });

    if (existingLicense && existingLicense.walletAddress !== normalized) {
      return NextResponse.json(
        { success: false, message: "License already activated on another wallet" },
        { status: 409 }
      );
    }

    // Validate license with Lemon Squeezy API
    const apiKey = process.env.LEMON_SQUEEZY_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { success: false, message: "License validation service unavailable" },
        { status: 503 }
      );
    }

    const lsResponse = await fetch("https://api.lemonsqueezy.com/v1/licenses/validate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ license_key: trimmedKey }),
    });

    const lsData = await lsResponse.json();

    if (!lsData.valid) {
      return NextResponse.json(
        { success: false, message: lsData.error || "Invalid license key" },
        { status: 400 }
      );
    }

    // Activate: upsert user and assign PRO + license
    await prisma.walletUser.upsert({
      where: { walletAddress: normalized },
      update: {
        plan: "PRO",
        licenseKey: trimmedKey,
        licenseActivatedAt: new Date(),
      },
      create: {
        walletAddress: normalized,
        plan: "PRO",
        licenseKey: trimmedKey,
        licenseActivatedAt: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      message: "Pro plan activated successfully!",
      plan: "PRO",
    });
  } catch (error) {
    console.error("License activation error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
