export const PLANS = {
  FREE: {
    name: "Free",
    price: 0,
    monthlyRegistrations: 3,
    features: {
      blockchainRegistration: true,
      publicVerification: true,
      certificatePDF: false,
      githubIntegration: false,
      prioritySupport: false,
      unlimitedRegistrations: false,
    },
  },
  PRO: {
    name: "Pro",
    price: 9,
    monthlyRegistrations: Infinity,
    features: {
      blockchainRegistration: true,
      publicVerification: true,
      certificatePDF: true,
      githubIntegration: true,
      prioritySupport: true,
      unlimitedRegistrations: true,
    },
  },
} as const;

export type PlanType = keyof typeof PLANS;
