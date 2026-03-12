"use client";

import type { PlanType } from "@/lib/plans";

interface PlanBadgeProps {
  plan: PlanType;
  className?: string;
}

export function PlanBadge({ plan, className = "" }: PlanBadgeProps) {
  if (plan === "PRO") {
    return (
      <span
        className={`inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 px-2.5 py-0.5 text-xs font-semibold text-white ${className}`}
      >
        ⚡ PRO
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center rounded-full bg-gray-700 px-2.5 py-0.5 text-xs font-medium text-gray-300 ${className}`}
    >
      FREE
    </span>
  );
}
