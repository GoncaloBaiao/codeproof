"use client";

import { useState } from "react";
import Link from "next/link";
import { Footer } from "@/components/Footer";
import { useWallet } from "@/hooks/useWallet";
import { PlanBadge } from "@/components/PlanBadge";
import { PLANS } from "@/lib/plans";

export default function PricingPage() {
  const { address, isConnected, plan, isPro, connect } = useWallet();
  const [isCheckoutLoading, setIsCheckoutLoading] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);

  const handleCheckout = async () => {
    if (!address) return;
    setIsCheckoutLoading(true);
    setCheckoutError(null);

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ walletAddress: address }),
      });

      const data = await res.json();

      if (res.ok && data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
        return;
      }

      setCheckoutError(data.error || "Checkout unavailable at the moment. Please try again in a few minutes.");
    } catch (error) {
      console.error("Checkout error:", error);
      setCheckoutError("Error starting payment. Please check your connection and try again.");
    } finally {
      setIsCheckoutLoading(false);
    }
  };

  return (
    <main className="w-full min-h-screen bg-gradient-to-b from-gray-950 via-blue-950/20 to-gray-950">
      {/* Pricing Header */}
      <section className="w-full px-12 lg:px-20 xl:px-32 py-32">
        <div className="max-w-5xl mx-auto w-full text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6">
            Simple and Transparent Pricing
          </h1>
          <p className="text-lg text-gray-300 mb-12 max-w-2xl mx-auto">
            Choose the perfect plan for your code authentication needs. Pay only for what you use.
          </p>

          {isConnected && (
            <div className="flex items-center justify-center gap-3 mb-8">
              <span className="text-gray-400 text-sm">Current plan:</span>
              <PlanBadge plan={plan} />
            </div>
          )}

          {/* Pricing Plans - 2 cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-16 max-w-3xl mx-auto">
            {/* Free Plan */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl blur opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
              <div className="relative p-10 bg-gray-900/50 border border-gray-800 rounded-2xl hover:border-blue-500/30 transition-all duration-300 flex flex-col h-full">
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-white mb-2">Free</h3>
                  <div className="text-4xl font-bold text-blue-400">
                    €0<span className="text-lg text-gray-400">/mo</span>
                  </div>
                </div>

                <p className="text-gray-400 text-sm mb-6">Perfect for trying out and personal projects</p>

                <ul className="space-y-3 mb-8 flex-grow">
                  <li className="flex items-center text-gray-300">
                    <span className="w-5 h-5 rounded-full bg-blue-500/30 text-blue-400 flex items-center justify-center mr-3 text-xs">✓</span>
                    {PLANS.FREE.monthlyRegistrations} registrations/mo
                  </li>
                  <li className="flex items-center text-gray-300">
                    <span className="w-5 h-5 rounded-full bg-blue-500/30 text-blue-400 flex items-center justify-center mr-3 text-xs">✓</span>
                    Hash SHA-256 client-side
                  </li>
                  <li className="flex items-center text-gray-300">
                    <span className="w-5 h-5 rounded-full bg-blue-500/30 text-blue-400 flex items-center justify-center mr-3 text-xs">✓</span>
                    Polygon blockchain
                  </li>
                  <li className="flex items-center text-gray-400">
                    <span className="w-5 h-5 rounded-full bg-gray-700/30 text-gray-600 flex items-center justify-center mr-3 text-xs">✗</span>
                    PDF Certificates
                  </li>
                  <li className="flex items-center text-gray-400">
                    <span className="w-5 h-5 rounded-full bg-gray-700/30 text-gray-600 flex items-center justify-center mr-3 text-xs">✗</span>
                    Priority Support
                  </li>
                </ul>

                {!isConnected ? (
                  <button
                    onClick={connect}
                    className="w-full bg-gray-800 hover:bg-gray-700 text-white py-3 rounded-lg font-semibold transition-colors duration-200"
                  >
                    Connect Wallet
                  </button>
                ) : plan === "FREE" ? (
                  <div className="w-full bg-gray-800 text-gray-400 py-3 rounded-lg font-semibold text-center">
                    Current Plan
                  </div>
                ) : (
                  <Link
                    href="/register"
                    className="w-full bg-gray-800 hover:bg-gray-700 text-white py-3 rounded-lg font-semibold transition-colors duration-200 block text-center"
                  >
                    Get Started
                  </Link>
                )}
              </div>
            </div>

            {/* Pro Plan */}
            <div className="relative group md:scale-105">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur opacity-20 group-hover:opacity-40 transition-opacity duration-300"></div>
              <div className="relative p-10 bg-gray-900/80 border border-blue-500/50 rounded-2xl hover:border-blue-400 transition-all duration-300 flex flex-col h-full">
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-blue-500 to-purple-500 px-4 py-1 rounded-full text-white text-sm font-bold">
                  ⚡ Recommended
                </div>

                <div className="text-center mb-6 mt-4">
                  <h3 className="text-2xl font-bold text-white mb-2">Pro</h3>
                  <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                    €{PLANS.PRO.price}<span className="text-lg text-gray-400">/mo</span>
                  </div>
                </div>

                <p className="text-gray-400 text-sm mb-6">For active developers and teams</p>

                <ul className="space-y-3 mb-8 flex-grow">
                  <li className="flex items-center text-gray-300">
                    <span className="w-5 h-5 rounded-full bg-purple-500/30 text-purple-400 flex items-center justify-center mr-3 text-xs">✓</span>
                    Unlimited registrations
                  </li>
                  <li className="flex items-center text-gray-300">
                    <span className="w-5 h-5 rounded-full bg-purple-500/30 text-purple-400 flex items-center justify-center mr-3 text-xs">✓</span>
                    Hash SHA-256 client-side
                  </li>
                  <li className="flex items-center text-gray-300">
                    <span className="w-5 h-5 rounded-full bg-purple-500/30 text-purple-400 flex items-center justify-center mr-3 text-xs">✓</span>
                    Multiple blockchain networks
                  </li>
                  <li className="flex items-center text-gray-300">
                    <span className="w-5 h-5 rounded-full bg-purple-500/30 text-purple-400 flex items-center justify-center mr-3 text-xs">✓</span>
                    PDF Certificates
                  </li>
                  <li className="flex items-center text-gray-300">
                    <span className="w-5 h-5 rounded-full bg-purple-500/30 text-purple-400 flex items-center justify-center mr-3 text-xs">✓</span>
                    Priority Support
                  </li>
                </ul>

                {!isConnected ? (
                  <button
                    onClick={connect}
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white py-3 rounded-lg font-semibold transition-all duration-200 hover:shadow-lg hover:shadow-blue-500/40"
                  >
                    Connect Wallet
                  </button>
                ) : isPro ? (
                  <div className="w-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 text-blue-400 py-3 rounded-lg font-semibold text-center">
                    ⚡ Active Plan
                  </div>
                ) : (
                  <div className="space-y-3">
                    <button
                      onClick={handleCheckout}
                      disabled={isCheckoutLoading}
                      className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 disabled:opacity-50 text-white py-3 rounded-lg font-semibold transition-all duration-200 hover:shadow-lg hover:shadow-blue-500/40"
                    >
                      {isCheckoutLoading ? "Redirecting to payment..." : "Upgrade to PRO"}
                    </button>
                    <p className="text-xs text-gray-400 text-center">
                      Already have a license key? <Link href="/dashboard" className="text-blue-400 hover:underline">Activate in Dashboard</Link>
                    </p>
                    {checkoutError && (
                      <p className="text-xs text-red-400 text-center">{checkoutError}</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="w-full px-12 lg:px-20 xl:px-32 py-32 bg-gray-900/30">
        <div className="max-w-4xl mx-auto w-full">
          <h2 className="text-3xl font-bold text-white mb-16 text-center">Frequently Asked Questions</h2>

          <div className="space-y-6">
            <div className="p-8 bg-gray-900/50 border border-gray-800 rounded-xl">
              <h3 className="text-lg font-bold text-white mb-3">Can I change plans?</h3>
              <p className="text-gray-400">Yes, you can upgrade at any time. The change takes effect immediately after license activation.</p>
            </div>

            <div className="p-8 bg-gray-900/50 border border-gray-800 rounded-xl">
              <h3 className="text-lg font-bold text-white mb-3">What payment methods do you accept?</h3>
              <p className="text-gray-400">We accept credit/debit cards and PayPal through Lemon Squeezy.</p>
            </div>

            <div className="p-8 bg-gray-900/50 border border-gray-800 rounded-xl">
              <h3 className="text-lg font-bold text-white mb-3">What happens when I reach the Free plan limit?</h3>
              <p className="text-gray-400">You'll be prompted to upgrade. The counter resets at the beginning of each month.</p>
            </div>

            <div className="p-8 bg-gray-900/50 border border-gray-800 rounded-xl">
              <h3 className="text-lg font-bold text-white mb-3">Is my code sent to any server?</h3>
              <p className="text-gray-400">Never. The hash is generated locally in your browser. Only the SHA-256 hash is registered on the blockchain.</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
