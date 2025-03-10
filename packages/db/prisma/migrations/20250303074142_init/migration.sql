/*
  Warnings:

  - You are about to drop the column `adminName` on the `Admin` table. All the data in the column will be lost.
  - Added the required column `name` to the `Admin` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "AdminRole" AS ENUM ('admin', 'superadmin');

-- AlterTable
ALTER TABLE "Admin" DROP COLUMN "adminName",
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "role" "AdminRole" NOT NULL DEFAULT 'admin';
