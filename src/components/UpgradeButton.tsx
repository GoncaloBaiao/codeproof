"use client";

import { useState } from "react";

interface UpgradeButtonProps {
  walletAddress: string;
  className?: string;
}

export function UpgradeButton({ walletAddress, className }: UpgradeButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCheckout = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ walletAddress }),
      });

      const data = await res.json();

      if (res.ok && data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
        return;
      }

      setError(data.error || "Checkout unavailable. Please try again.");
    } catch {
      setError("Error starting payment. Please check your connection.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <button
        onClick={handleCheckout}
        disabled={isLoading}
        className={
          className ??
          "w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 disabled:opacity-50 text-white py-3 rounded-lg font-semibold transition-all duration-200 hover:shadow-lg hover:shadow-blue-500/40"
        }
      >
        {isLoading ? "Redirecting to payment..." : "Upgrade to PRO"}
      </button>
      {error && <p className="text-xs text-red-400 text-center mt-2">{error}</p>}
    </div>
  );
}
