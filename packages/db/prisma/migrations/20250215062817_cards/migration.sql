/*
  Warnings:

  - You are about to drop the column `remaining` on the `Card` table. All the data in the column will be lost.
  - You are about to drop the column `total` on the `Card` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Card" DROP COLUMN "remaining",
DROP COLUMN "total";
