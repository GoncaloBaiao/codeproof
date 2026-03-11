export type Plan = "FREE" | "PRO";

export interface User {
  id: string;
  email?: string;
  walletAddress?: string;
  name?: string;
  plan: Plan;
  createdAt: Date;
}

export interface CodeRegistration {
  id: string;
  hash: string;
  projectName: string;
  description?: string;
  txHash?: string;
  blockNumber?: number;
  timestamp?: bigint;
  isPublic: boolean;
  createdAt: Date;
}

export interface BlockchainRegistration {
  author: string;
  timestamp: bigint;
  metadata: string;
}
