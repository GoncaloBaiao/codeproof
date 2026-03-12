export type Plan = "FREE" | "PRO";

export interface WalletUser {
  id: string;
  walletAddress: string;
  plan: Plan;
  licenseKey?: string | null;
  licenseActivatedAt?: Date | null;
  monthlyRegistrations: number;
  lastResetDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface CodeRegistration {
  id: string;
  hash: string;
  walletAddress: string;
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

export interface WalletStatus {
  plan: Plan;
  registrationsUsed: number;
  registrationsLimit: number | "unlimited";
  canRegister: boolean;
}
