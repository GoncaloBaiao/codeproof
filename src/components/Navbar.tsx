"use client";

import Link from "next/link";
import { WalletConnect } from "./WalletConnect";

export function Navbar() {
  return (
    <nav className="sticky top-0 z-50 bg-gray-950/95 backdrop-blur-xl border-b border-gray-800/50 shadow-lg">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-5 flex items-center justify-between h-20">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 transition-all duration-200 group">
          <div className="w-3 h-3 bg-gradient-to-br from-blue-500 to-blue-400 rounded-full shadow-lg group-hover:shadow-blue-500/50 transition-all duration-200"></div>
          <span className="text-2xl font-black text-white group-hover:text-blue-400 transition-colors">CodeProof</span>
        </Link>

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
          <Link href="#pricing" className="text-gray-300 hover:text-white font-medium transition-colors duration-200 text-sm">
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
