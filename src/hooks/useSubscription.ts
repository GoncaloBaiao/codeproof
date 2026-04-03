"use client";

import { useState, useEffect, useCallback } from "react";

interface SubscriptionState {
  isPro: boolean;
  isLoading: boolean;
  subscription: {
    status: string;
    currentPeriodEnd: string | null;
  } | null;
  refresh: () => Promise<void>;
}

export function useSubscription(walletAddress: string | null): SubscriptionState {
  const [isPro, setIsPro] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [subscription, setSubscription] = useState<SubscriptionState["subscription"]>(null);

  const refresh = useCallback(async () => {
    if (!walletAddress) return;
    setIsLoading(true);
    try {
      const res = await fetch(
        `/api/user/subscription?walletAddress=${encodeURIComponent(walletAddress)}`
      );
      if (res.ok) {
        const data = await res.json();
        setIsPro(data.isPro);
        setSubscription(data.subscription ?? null);
      }
    } catch (error) {
      console.error("Failed to fetch subscription:", error);
    } finally {
      setIsLoading(false);
    }
  }, [walletAddress]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { isPro, isLoading, subscription, refresh };
}
