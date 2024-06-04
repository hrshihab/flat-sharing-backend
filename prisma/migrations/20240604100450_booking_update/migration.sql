/*
  Warnings:

  - Added the required column `name` to the `bookings` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `maritalStatus` on the `bookings` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "MaritalStatus" AS ENUM ('SINGLE', 'MARRIED', 'SEPERATED');

-- AlterTable
ALTER TABLE "bookings" ADD COLUMN     "name" TEXT NOT NULL,
DROP COLUMN "maritalStatus",
ADD COLUMN     "maritalStatus" "MaritalStatus" NOT NULL;
