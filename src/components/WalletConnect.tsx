"use client";

import { useWallet } from "@/hooks/useWallet";
import { formatAddress } from "@/lib/ethereum";
import { PlanBadge } from "@/components/PlanBadge";

export function WalletConnect() {
  const { address, isConnected, plan, isLoading, connect } = useWallet();

  if (isConnected && address) {
    return (
      <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-950 to-green-900/50 border border-green-500/50 rounded-lg">
        <div className="w-2.5 h-2.5 bg-green-500 rounded-full shadow-lg shadow-green-500/50"></div>
        <span className="text-green-400 font-mono text-sm font-bold">{formatAddress(address)}</span>
        <PlanBadge plan={plan} />
      </div>
    );
  }

  return (
    <div>
      <button
        onClick={connect}
        disabled={isLoading}
        className="px-5 py-2 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 disabled:from-gray-600 disabled:to-gray-600 text-white rounded-lg font-semibold transition-all duration-200 text-sm hover:shadow-lg hover:shadow-blue-500/30"
      >
        {isLoading ? "Connecting..." : "Connect Wallet"}
      </button>
    </div>
  );
}
