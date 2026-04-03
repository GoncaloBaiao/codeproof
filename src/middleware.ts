import { NextRequest, NextResponse } from "next/server";

/**
 * Middleware for CodeProof.
 *
 * Wallet authentication is handled client-side via MetaMask (useWallet hook).
 * PRO feature gating is enforced both client-side and in API routes.
 *
 * This middleware ensures API routes that require a wallet address
 * receive it; page-level auth is managed by client components.
 */
export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Protect wallet-dependent API routes: require walletAddress param
  if (
    pathname.startsWith("/api/wallet/") ||
    pathname.startsWith("/api/user/") ||
    pathname.startsWith("/api/registrations") ||
    pathname.startsWith("/api/license/")
  ) {
    if (req.method === "GET") {
      const walletAddress = req.nextUrl.searchParams.get("walletAddress");
      if (!walletAddress) {
        return NextResponse.json(
          { error: "walletAddress is required" },
          { status: 400 }
        );
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/api/wallet/:path*", "/api/user/:path*", "/api/registrations/:path*", "/api/license/:path*"],
};
