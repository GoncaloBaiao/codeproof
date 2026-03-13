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

    // Validate license with Lemon Squeezy
    const validateResponse = await fetch("https://api.lemonsqueezy.com/v1/licenses/validate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        license_key: trimmedKey,
        instance_name: normalized,
      }),
    });

    const validateData = await validateResponse.json();

    if (!validateData.valid) {
      return NextResponse.json(
        { success: false, message: validateData.error || "Invalid or expired license key" },
        { status: 400 }
      );
    }

    // Activate license instance on Lemon Squeezy
    await fetch("https://api.lemonsqueezy.com/v1/licenses/activate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        license_key: trimmedKey,
        instance_name: normalized,
      }),
    });

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
