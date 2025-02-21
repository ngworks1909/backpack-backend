-- CreateEnum
CREATE TYPE "Status" AS ENUM ('Pending', 'Success', 'Failed');

-- CreateTable
CREATE TABLE "User" (
    "userId" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "mobile" TEXT NOT NULL,
    "otp" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("userId")
);

-- CreateTable
CREATE TABLE "Wallet" (
    "walletId" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Wallet_pkey" PRIMARY KEY ("walletId")
);

-- CreateTable
CREATE TABLE "Card" (
    "cardId" TEXT NOT NULL,
    "cardName" TEXT NOT NULL,
    "cardImage" TEXT NOT NULL,

    CONSTRAINT "Card_pkey" PRIMARY KEY ("cardId")
);

-- CreateTable
CREATE TABLE "Slot" (
    "slotId" TEXT NOT NULL,
    "cardId" TEXT NOT NULL,
    "start" INTEGER NOT NULL,
    "end" INTEGER NOT NULL,
    "total" INTEGER NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Slot_pkey" PRIMARY KEY ("slotId")
);

-- CreateTable
CREATE TABLE "Purchase" (
    "purchaseId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "slotId" TEXT NOT NULL,
    "createdOn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Purchase_pkey" PRIMARY KEY ("purchaseId")
);

-- CreateTable
CREATE TABLE "Payment" (
    "orderId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "status" "Status" NOT NULL DEFAULT 'Pending',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "purchaseId" TEXT NOT NULL,

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("orderId")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_mobile_key" ON "User"("mobile");

-- CreateIndex
CREATE UNIQUE INDEX "Wallet_userId_key" ON "Wallet"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Payment_purchaseId_key" ON "Payment"("purchaseId");

-- AddForeignKey
ALTER TABLE "Wallet" ADD CONSTRAINT "Wallet_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Slot" ADD CONSTRAINT "Slot_cardId_fkey" FOREIGN KEY ("cardId") REFERENCES "Card"("cardId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Purchase" ADD CONSTRAINT "Purchase_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Purchase" ADD CONSTRAINT "Purchase_slotId_fkey" FOREIGN KEY ("slotId") REFERENCES "Slot"("slotId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_purchaseId_fkey" FOREIGN KEY ("purchaseId") REFERENCES "Purchase"("purchaseId") ON DELETE CASCADE ON UPDATE CASCADE;
