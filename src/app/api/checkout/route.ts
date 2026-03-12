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
    url.searchParams.set("checkout[custom][wallet_address]", walletAddress.toLowerCase());

    return NextResponse.json({ checkoutUrl: url.toString() });
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
