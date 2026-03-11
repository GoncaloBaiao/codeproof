"use client";

import { useState, useEffect } from "react";
import {
  isMetaMaskInstalled,
  connectMetaMask,
  getConnectedAccount,
  formatAddress,
} from "@/lib/ethereum";

export function WalletConnect() {
  const [account, setAccount] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check if already connected on mount
  useEffect(() => {
    const checkConnection = async () => {
      const connectedAccount = await getConnectedAccount();
      setAccount(connectedAccount);
    };

    if (typeof window !== "undefined" && isMetaMaskInstalled()) {
      checkConnection();
    }
  }, []);

  const handleConnect = async () => {
    if (!isMetaMaskInstalled()) {
      setError("MetaMask not installed");
      window.open("https://metamask.io/download/", "_blank");
      return;
    }

    setIsConnecting(true);
    setError(null);

    try {
      const accounts = await connectMetaMask();
      setAccount(accounts[0]);
    } catch (err) {
      setError("Failed to connect wallet");
    } finally {
      setIsConnecting(false);
    }
  };

  if (!isMetaMaskInstalled()) {
    return (
      <button
        onClick={handleConnect}
        className="px-5 py-2 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white rounded-lg font-semibold transition-all duration-200 text-sm hover:shadow-lg hover:shadow-blue-500/30"
      >
        Install MetaMask
      </button>
    );
  }

  if (account) {
    return (
      <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-950 to-green-900/50 border border-green-500/50 rounded-lg">
        <div className="w-2.5 h-2.5 bg-green-500 rounded-full shadow-lg shadow-green-500/50"></div>
        <span className="text-green-400 font-mono text-sm font-bold">{formatAddress(account)}</span>
      </div>
    );
  }

  return (
    <div>
      <button
        onClick={handleConnect}
        disabled={isConnecting}
        className="px-5 py-2 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 disabled:from-gray-600 disabled:to-gray-600 text-white rounded-lg font-semibold transition-all duration-200 text-sm hover:shadow-lg hover:shadow-blue-500/30"
      >
        {isConnecting ? "Connecting..." : "Connect Wallet"}
      </button>
      {error && <p className="text-red-400 text-sm mt-2 font-medium">{error}</p>}
    </div>
  );
}
