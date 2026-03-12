"use client";

import { useState, useEffect, useCallback } from "react";
import {
  isMetaMaskInstalled,
  connectMetaMask,
  getConnectedAccount,
} from "@/lib/ethereum";
import type { PlanType } from "@/lib/plans";

interface WalletState {
  address: string | null;
  isConnected: boolean;
  plan: PlanType;
  registrationsUsed: number;
  registrationsLimit: number | "unlimited";
  canRegister: boolean;
  isPro: boolean;
  isLoading: boolean;
  connect: () => Promise<void>;
  disconnect: () => void;
  refreshStatus: () => Promise<void>;
}

export function useWallet(): WalletState {
  const [address, setAddress] = useState<string | null>(null);
  const [plan, setPlan] = useState<PlanType>("FREE");
  const [registrationsUsed, setRegistrationsUsed] = useState(0);
  const [registrationsLimit, setRegistrationsLimit] = useState<number | "unlimited">(3);
  const [canRegister, setCanRegister] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const refreshStatus = useCallback(async () => {
    if (!address) return;

    try {
      const res = await fetch(`/api/wallet/status?walletAddress=${address}`);
      if (res.ok) {
        const data = await res.json();
        setPlan(data.plan);
        setRegistrationsUsed(data.registrationsUsed);
        setRegistrationsLimit(data.registrationsLimit);
        setCanRegister(data.canRegister);
      }
    } catch (error) {
      console.error("Failed to refresh wallet status:", error);
    }
  }, [address]);

  const registerWallet = useCallback(async (addr: string) => {
    try {
      await fetch("/api/wallet/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ walletAddress: addr }),
      });
    } catch (error) {
      console.error("Failed to register wallet:", error);
    }
  }, []);

  const connect = useCallback(async () => {
    if (!isMetaMaskInstalled()) {
      window.open("https://metamask.io/download/", "_blank");
      return;
    }

    setIsLoading(true);
    try {
      const accounts = await connectMetaMask();
      const addr = accounts[0];
      setAddress(addr);
      await registerWallet(addr);
    } catch (error) {
      console.error("Failed to connect wallet:", error);
    } finally {
      setIsLoading(false);
    }
  }, [registerWallet]);

  const disconnect = useCallback(() => {
    setAddress(null);
    setPlan("FREE");
    setRegistrationsUsed(0);
    setRegistrationsLimit(3);
    setCanRegister(true);
  }, []);

  // Check already connected on mount
  useEffect(() => {
    const init = async () => {
      if (typeof window !== "undefined" && isMetaMaskInstalled()) {
        const account = await getConnectedAccount();
        if (account) {
          setAddress(account);
          await registerWallet(account);
        }
      }
    };
    init();
  }, [registerWallet]);

  // Refresh status when address changes
  useEffect(() => {
    if (address) {
      refreshStatus();
    }
  }, [address, refreshStatus]);

  // Listen for MetaMask account changes
  useEffect(() => {
    if (typeof window === "undefined" || !window.ethereum?.on) return;

    const handleAccountsChanged = (accounts: string[]) => {
      if (accounts.length === 0) {
        disconnect();
      } else {
        setAddress(accounts[0]);
      }
    };

    window.ethereum.on("accountsChanged", handleAccountsChanged);
    return () => {
      window.ethereum?.removeListener?.("accountsChanged", handleAccountsChanged);
    };
  }, [disconnect]);

  return {
    address,
    isConnected: !!address,
    plan,
    registrationsUsed,
    registrationsLimit,
    canRegister,
    isPro: plan === "PRO",
    isLoading,
    connect,
    disconnect,
    refreshStatus,
  };
}
