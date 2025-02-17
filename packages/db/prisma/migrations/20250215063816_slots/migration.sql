/*
  Warnings:

  - Added the required column `remaining` to the `Slot` table without a default value. This is not possible if the table is not empty.
  - Added the required column `total` to the `Slot` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Slot" ADD COLUMN     "remaining" INTEGER NOT NULL,
ADD COLUMN     "total" INTEGER NOT NULL;
