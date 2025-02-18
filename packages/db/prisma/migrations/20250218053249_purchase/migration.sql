/*
  Warnings:

  - You are about to drop the column `remaining` on the `Slot` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Slot" DROP COLUMN "remaining";

-- CreateTable
CREATE TABLE "Purchase" (
    "purchaseId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "slotId" TEXT NOT NULL,

    CONSTRAINT "Purchase_pkey" PRIMARY KEY ("purchaseId")
);

-- AddForeignKey
ALTER TABLE "Purchase" ADD CONSTRAINT "Purchase_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Purchase" ADD CONSTRAINT "Purchase_slotId_fkey" FOREIGN KEY ("slotId") REFERENCES "Slot"("slotId") ON DELETE RESTRICT ON UPDATE CASCADE;
