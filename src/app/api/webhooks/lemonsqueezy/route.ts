import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  try {
    const secret = process.env.LEMON_SQUEEZY_WEBHOOK_SECRET;
    if (!secret) {
      return NextResponse.json({ error: "Webhook not configured" }, { status: 500 });
    }

    const rawBody = await req.text();
    const signature = req.headers.get("x-signature");

    if (!signature) {
      return NextResponse.json({ error: "Missing signature" }, { status: 401 });
    }

    // Verify HMAC signature
    const hmac = crypto.createHmac("sha256", secret);
    hmac.update(rawBody);
    const digest = hmac.digest("hex");

    if (!crypto.timingSafeEqual(Buffer.from(digest), Buffer.from(signature))) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    const payload = JSON.parse(rawBody);
    const eventName = payload.meta?.event_name;

    if (eventName === "order_created" || eventName === "subscription_created") {
      const walletAddress = payload.meta?.custom_data?.wallet_address;

      if (walletAddress) {
        const { prisma } = await import("@/lib/prisma");
        const normalized = String(walletAddress).toLowerCase();

        await prisma.walletUser.upsert({
          where: { walletAddress: normalized },
          update: {
            plan: "PRO",
            licenseActivatedAt: new Date(),
          },
          create: {
            walletAddress: normalized,
            plan: "PRO",
            licenseActivatedAt: new Date(),
          },
        });

        console.log(`Lemon Squeezy ${eventName}: PRO activated for ${normalized}`);
      } else {
        console.log(`Lemon Squeezy ${eventName}: no wallet_address in custom_data`);
      }
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
  }
}
