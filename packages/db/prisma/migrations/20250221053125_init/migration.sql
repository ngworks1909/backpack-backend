/*
  Warnings:

  - Added the required column `paymentType` to the `Payment` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "PaymentType" AS ENUM ('Razorpay', 'Wallet');

-- DropForeignKey
ALTER TABLE "Payment" DROP CONSTRAINT "Payment_userId_fkey";

-- DropForeignKey
ALTER TABLE "Purchase" DROP CONSTRAINT "Purchase_slotId_fkey";

-- DropForeignKey
ALTER TABLE "Purchase" DROP CONSTRAINT "Purchase_userId_fkey";

-- DropForeignKey
ALTER TABLE "Slot" DROP CONSTRAINT "Slot_cardId_fkey";

-- DropForeignKey
ALTER TABLE "Wallet" DROP CONSTRAINT "Wallet_userId_fkey";

-- AlterTable
ALTER TABLE "Payment" ADD COLUMN     "paymentType" "PaymentType" NOT NULL;

-- AddForeignKey
ALTER TABLE "Wallet" ADD CONSTRAINT "Wallet_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Slot" ADD CONSTRAINT "Slot_cardId_fkey" FOREIGN KEY ("cardId") REFERENCES "Card"("cardId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Purchase" ADD CONSTRAINT "Purchase_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Purchase" ADD CONSTRAINT "Purchase_slotId_fkey" FOREIGN KEY ("slotId") REFERENCES "Slot"("slotId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE CASCADE ON UPDATE CASCADE;
