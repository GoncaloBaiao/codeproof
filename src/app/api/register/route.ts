import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * Save code registration to database
 * POST /api/register
 * Body: { hash, projectName, description, txHash, walletAddress, isPublic }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { hash, projectName, description, txHash, walletAddress, isPublic } = body;

    if (!hash || !projectName || !walletAddress) {
      return NextResponse.json(
        { error: "Hash, projectName, and walletAddress are required" },
        { status: 400 }
      );
    }

    const normalizedWalletAddress = String(walletAddress).toLowerCase();

    const result = await prisma.$transaction(async (transaction) => {
      const existingUser = await transaction.walletUser.findUnique({
        where: { walletAddress: normalizedWalletAddress },
      });

      const now = new Date();
      const shouldResetMonth = existingUser
        ? now.getMonth() !== existingUser.lastResetDate.getMonth() ||
          now.getFullYear() !== existingUser.lastResetDate.getFullYear()
        : false;

      const user = existingUser
        ? await transaction.walletUser.update({
            where: { walletAddress: normalizedWalletAddress },
            data: shouldResetMonth
              ? { monthlyRegistrations: 0, lastResetDate: now }
              : {},
          })
        : await transaction.walletUser.create({
            data: { walletAddress: normalizedWalletAddress },
          });

      const registration = await transaction.registration.create({
        data: {
          hash: String(hash),
          projectName: String(projectName),
          description: description ? String(description) : null,
          txHash: txHash ? String(txHash) : null,
          walletAddress: normalizedWalletAddress,
          isPublic: typeof isPublic === "boolean" ? isPublic : true,
        },
      });

      const updatedUser = await transaction.walletUser.update({
        where: { walletAddress: normalizedWalletAddress },
        data: {
          monthlyRegistrations: {
            increment: 1,
          },
        },
      });

      return { registration, updatedUser };
    });

    return NextResponse.json(
      {
        registered: true,
        registrationId: result.registration.id,
        hash: result.registration.hash,
        projectName: result.registration.projectName,
        monthlyRegistrations: result.updatedUser.monthlyRegistrations,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Invalid request" },
      { status: 400 }
    );
  }
}

/**
 * Get registrations by wallet
 * GET /api/register?walletAddress=...
 */
export async function GET(request: NextRequest) {
  try {
    const walletAddress = request.nextUrl.searchParams.get("walletAddress");

    if (!walletAddress) {
      return NextResponse.json({ error: "walletAddress is required" }, { status: 400 });
    }

    const registrations = await prisma.registration.findMany({
      where: { walletAddress: walletAddress.toLowerCase() },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ registrations }, { status: 200 });
  } catch (error) {
    console.error("Registration list error:", error);
    return NextResponse.json({ error: "Failed to load registrations" }, { status: 500 });
  }
}
