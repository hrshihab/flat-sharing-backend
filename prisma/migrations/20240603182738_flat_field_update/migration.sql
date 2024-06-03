/*
  Warnings:

  - You are about to drop the column `rent` on the `flats` table. All the data in the column will be lost.
  - You are about to drop the column `squareFeet` on the `flats` table. All the data in the column will be lost.
  - You are about to drop the column `totalBedrooms` on the `flats` table. All the data in the column will be lost.
  - The `amenities` column on the `flats` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `bedrooms` to the `flats` table without a default value. This is not possible if the table is not empty.
  - Added the required column `rentAmount` to the `flats` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `flats` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "flats" DROP COLUMN "rent",
DROP COLUMN "squareFeet",
DROP COLUMN "totalBedrooms",
ADD COLUMN     "bedrooms" INTEGER NOT NULL,
ADD COLUMN     "rentAmount" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "userId" TEXT NOT NULL,
DROP COLUMN "amenities",
ADD COLUMN     "amenities" TEXT[];

-- AddForeignKey
ALTER TABLE "flats" ADD CONSTRAINT "flats_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
