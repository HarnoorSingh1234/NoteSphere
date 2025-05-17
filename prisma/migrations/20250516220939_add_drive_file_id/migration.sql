/*
  Warnings:

  - You are about to drop the column `parentId` on the `Comment` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[number,yearId]` on the table `Semester` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `yearId` to the `Semester` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('USER', 'ADMIN');

-- DropForeignKey
ALTER TABLE "Comment" DROP CONSTRAINT "Comment_parentId_fkey";

-- DropIndex
DROP INDEX "Semester_number_key";

-- AlterTable
ALTER TABLE "Comment" DROP COLUMN "parentId";

-- AlterTable
ALTER TABLE "Note" ADD COLUMN     "driveFileId" TEXT,
ADD COLUMN     "isPublic" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Semester" ADD COLUMN     "yearId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "role" "UserRole" NOT NULL DEFAULT 'USER';

-- CreateTable
CREATE TABLE "Year" (
    "id" TEXT NOT NULL,
    "number" INTEGER NOT NULL,

    CONSTRAINT "Year_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserAuth" (
    "id" TEXT NOT NULL,
    "clerkId" TEXT NOT NULL,
    "googleAccessToken" TEXT,
    "googleRefreshToken" TEXT,
    "googleTokenExpiry" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserAuth_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Year_number_key" ON "Year"("number");

-- CreateIndex
CREATE UNIQUE INDEX "UserAuth_clerkId_key" ON "UserAuth"("clerkId");

-- CreateIndex
CREATE UNIQUE INDEX "Semester_number_yearId_key" ON "Semester"("number", "yearId");

-- AddForeignKey
ALTER TABLE "Semester" ADD CONSTRAINT "Semester_yearId_fkey" FOREIGN KEY ("yearId") REFERENCES "Year"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
