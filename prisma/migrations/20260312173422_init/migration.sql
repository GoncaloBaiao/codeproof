-- CreateEnum
CREATE TYPE "Plan" AS ENUM ('FREE', 'PRO');

-- CreateTable
CREATE TABLE "wallet_users" (
    "id" TEXT NOT NULL,
    "walletAddress" TEXT NOT NULL,
    "plan" "Plan" NOT NULL DEFAULT 'FREE',
    "licenseKey" TEXT,
    "licenseActivatedAt" TIMESTAMP(3),
    "monthlyRegistrations" INTEGER NOT NULL DEFAULT 0,
    "lastResetDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "wallet_users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "registrations" (
    "id" TEXT NOT NULL,
    "hash" TEXT NOT NULL,
    "walletAddress" TEXT NOT NULL,
    "projectName" TEXT NOT NULL,
    "description" TEXT,
    "txHash" TEXT,
    "blockNumber" INTEGER,
    "isPublic" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "registrations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "certificates" (
    "id" TEXT NOT NULL,
    "registrationId" TEXT NOT NULL,
    "pdfUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "certificates_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "wallet_users_walletAddress_key" ON "wallet_users"("walletAddress");

-- CreateIndex
CREATE UNIQUE INDEX "wallet_users_licenseKey_key" ON "wallet_users"("licenseKey");

-- CreateIndex
CREATE UNIQUE INDEX "registrations_hash_key" ON "registrations"("hash");

-- AddForeignKey
ALTER TABLE "registrations" ADD CONSTRAINT "registrations_walletAddress_fkey" FOREIGN KEY ("walletAddress") REFERENCES "wallet_users"("walletAddress") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "certificates" ADD CONSTRAINT "certificates_registrationId_fkey" FOREIGN KEY ("registrationId") REFERENCES "registrations"("id") ON DELETE CASCADE ON UPDATE CASCADE;
