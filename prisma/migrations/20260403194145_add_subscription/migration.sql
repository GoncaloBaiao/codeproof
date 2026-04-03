-- CreateTable
CREATE TABLE "subscriptions" (
    "id" TEXT NOT NULL,
    "walletAddress" TEXT NOT NULL,
    "lemonSqueezyId" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "currentPeriodEnd" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "subscriptions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "subscriptions_lemonSqueezyId_key" ON "subscriptions"("lemonSqueezyId");

-- AddForeignKey
ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_walletAddress_fkey" FOREIGN KEY ("walletAddress") REFERENCES "wallet_users"("walletAddress") ON DELETE RESTRICT ON UPDATE CASCADE;
