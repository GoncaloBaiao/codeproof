"use client";

import Link from "next/link";
import { BrandLogo } from "./BrandLogo";
import { WalletConnect } from "./WalletConnect";

export function Navbar() {
  return (
    <nav className="sticky top-0 z-50 w-full bg-gray-950/95 backdrop-blur-xl border-b border-gray-800/50 shadow-lg">
      <div className="max-w-7xl mx-auto px-8 lg:px-12 py-5 flex items-center justify-between h-20">
        <BrandLogo iconSize={42} textSizeClassName="text-2xl" />

        {/* Navigation Links */}
        <div className="flex items-center gap-12">
          <Link href="/register" className="text-gray-300 hover:text-white font-medium transition-colors duration-200 text-sm">
            Register
          </Link>
          <Link href="/verify" className="text-gray-300 hover:text-white font-medium transition-colors duration-200 text-sm">
            Verify
          </Link>
          <Link href="/dashboard" className="text-gray-300 hover:text-white font-medium transition-colors duration-200 text-sm">
            Dashboard
          </Link>
          <Link href="/pricing" className="text-gray-300 hover:text-white font-medium transition-colors duration-200 text-sm">
            Pricing
          </Link>

          {/* Wallet Connect */}
          <div className="ml-4 pl-12 border-l border-gray-800">
            <WalletConnect />
          </div>
        </div>
      </div>
    </nav>
  );
}
