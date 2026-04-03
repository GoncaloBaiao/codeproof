import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";

/**
 * Lemon Squeezy webhook handler.
 * Always returns 200 so LS doesn't retry on transient errors.
 */
export async function POST(req: NextRequest) {
  try {
    const secret = process.env.LEMON_SQUEEZY_WEBHOOK_SECRET;
    if (!secret) {
      console.error("LEMON_SQUEEZY_WEBHOOK_SECRET not configured");
      return NextResponse.json({ received: true }, { status: 200 });
    }

    const rawBody = await req.text();
    const signature = req.headers.get("x-signature");

    if (!signature) {
      return NextResponse.json({ received: true }, { status: 200 });
    }

    // Verify HMAC-SHA256 signature
    const hmac = crypto.createHmac("sha256", secret);
    hmac.update(rawBody);
    const digest = hmac.digest("hex");

    if (
      digest.length !== signature.length ||
      !crypto.timingSafeEqual(Buffer.from(digest), Buffer.from(signature))
    ) {
      return NextResponse.json({ received: true }, { status: 200 });
    }

    const payload = JSON.parse(rawBody);
    const eventName: string | undefined = payload.meta?.event_name;
    const walletAddress: string | undefined =
      payload.meta?.custom_data?.wallet_address;

    if (!walletAddress) {
      console.log(`Lemon Squeezy ${eventName}: no wallet_address in custom_data`);
      return NextResponse.json({ received: true }, { status: 200 });
    }

    const normalized = String(walletAddress).toLowerCase();
    const subscriptionId = String(
      payload.data?.id ?? payload.data?.attributes?.subscription_id ?? ""
    );
    const attrs = payload.data?.attributes ?? {};

    switch (eventName) {
      case "order_created":
      case "subscription_created": {
        // Activate PRO
        await prisma.walletUser.upsert({
          where: { walletAddress: normalized },
          update: { plan: "PRO", licenseActivatedAt: new Date() },
          create: { walletAddress: normalized, plan: "PRO", licenseActivatedAt: new Date() },
        });

        if (subscriptionId) {
          await prisma.subscription.upsert({
            where: { lemonSqueezyId: subscriptionId },
            update: {
              status: attrs.status ?? "active",
              currentPeriodEnd: attrs.renews_at ? new Date(attrs.renews_at) : null,
            },
            create: {
              walletAddress: normalized,
              lemonSqueezyId: subscriptionId,
              status: attrs.status ?? "active",
              currentPeriodEnd: attrs.renews_at ? new Date(attrs.renews_at) : null,
            },
          });
        }

        console.log(`LS ${eventName}: PRO activated for ${normalized}`);
        break;
      }

      case "subscription_updated": {
        const status: string = attrs.status ?? "active";
        const isActive = status === "active" || status === "on_trial";

        await prisma.walletUser.upsert({
          where: { walletAddress: normalized },
          update: { plan: isActive ? "PRO" : "FREE" },
          create: { walletAddress: normalized, plan: isActive ? "PRO" : "FREE" },
        });

        if (subscriptionId) {
          await prisma.subscription.upsert({
            where: { lemonSqueezyId: subscriptionId },
            update: {
              status,
              currentPeriodEnd: attrs.renews_at ? new Date(attrs.renews_at) : null,
            },
            create: {
              walletAddress: normalized,
              lemonSqueezyId: subscriptionId,
              status,
              currentPeriodEnd: attrs.renews_at ? new Date(attrs.renews_at) : null,
            },
          });
        }

        console.log(`LS subscription_updated: ${normalized} → ${status}`);
        break;
      }

      case "subscription_cancelled":
      case "subscription_expired": {
        await prisma.walletUser.updateMany({
          where: { walletAddress: normalized },
          data: { plan: "FREE" },
        });

        if (subscriptionId) {
          await prisma.subscription.upsert({
            where: { lemonSqueezyId: subscriptionId },
            update: {
              status: eventName === "subscription_cancelled" ? "cancelled" : "expired",
              currentPeriodEnd: attrs.ends_at ? new Date(attrs.ends_at) : null,
            },
            create: {
              walletAddress: normalized,
              lemonSqueezyId: subscriptionId,
              status: eventName === "subscription_cancelled" ? "cancelled" : "expired",
              currentPeriodEnd: attrs.ends_at ? new Date(attrs.ends_at) : null,
            },
          });
        }

        console.log(`LS ${eventName}: PRO deactivated for ${normalized}`);
        break;
      }

      default:
        console.log(`LS webhook: unhandled event ${eventName}`);
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error) {
    console.error("Webhook error:", error);
    // Always 200 so Lemon Squeezy doesn't retry
    return NextResponse.json({ received: true }, { status: 200 });
  }
}
