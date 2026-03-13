import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { walletAddress } = await req.json();

    if (!walletAddress) {
      return NextResponse.json({ error: "walletAddress is required" }, { status: 400 });
    }

    const checkoutUrl = process.env.LEMON_SQUEEZY_CHECKOUT_URL;

    if (!checkoutUrl) {
      return NextResponse.json({ error: "Checkout not configured" }, { status: 503 });
    }

    // Append wallet address as custom data via query params
    const url = new URL(checkoutUrl);
    const appUrl = (process.env.NEXT_PUBLIC_APP_URL || "https://codeproof.net").replace(/\/$/, "");
    const successUrl = process.env.LEMON_SQUEEZY_SUCCESS_URL || `${appUrl}/dashboard`;
    const cancelUrl = process.env.LEMON_SQUEEZY_CANCEL_URL || `${appUrl}/pricing`;

    // Force production callbacks to avoid accidental vercel/localhost redirects.
    url.searchParams.set("checkout[success_url]", successUrl);
    url.searchParams.set("checkout[cancel_url]", cancelUrl);
    url.searchParams.set("checkout[custom][wallet_address]", walletAddress.toLowerCase());

    return NextResponse.json({ checkoutUrl: url.toString() });
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
