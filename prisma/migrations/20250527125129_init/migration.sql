/*
  Warnings:

  - A unique constraint covering the columns `[userId,noticeId]` on the table `Like` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Comment" DROP CONSTRAINT "Comment_noteId_fkey";

-- DropForeignKey
ALTER TABLE "Like" DROP CONSTRAINT "Like_noteId_fkey";

-- AlterTable
ALTER TABLE "Comment" ADD COLUMN     "noticeId" TEXT,
ALTER COLUMN "noteId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Like" ADD COLUMN     "noticeId" TEXT,
ALTER COLUMN "noteId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Note" ADD COLUMN     "isRejected" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "rejectedAt" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "RejectedNote" (
    "id" TEXT NOT NULL,
    "originalNoteId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "authorClerkId" TEXT NOT NULL,
    "authorName" TEXT NOT NULL,
    "subjectId" TEXT,
    "subjectName" TEXT,
    "rejectedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "rejectionReason" TEXT,
    "driveFileId" TEXT,

    CONSTRAINT "RejectedNote_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Feedback" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "viewed" BOOLEAN NOT NULL DEFAULT false,
    "authorClerkId" TEXT,

    CONSTRAINT "Feedback_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notice" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "driveLink" TEXT NOT NULL,
    "driveFileId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "authorId" TEXT NOT NULL,
    "isPublished" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Notice_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "RejectedNote_authorClerkId_idx" ON "RejectedNote"("authorClerkId");

-- CreateIndex
CREATE INDEX "RejectedNote_rejectedAt_idx" ON "RejectedNote"("rejectedAt");

-- CreateIndex
CREATE INDEX "RejectedNote_subjectId_idx" ON "RejectedNote"("subjectId");

-- CreateIndex
CREATE INDEX "Notice_createdAt_idx" ON "Notice"("createdAt");

-- CreateIndex
CREATE INDEX "Notice_isPublished_idx" ON "Notice"("isPublished");

-- CreateIndex
CREATE UNIQUE INDEX "Like_userId_noticeId_key" ON "Like"("userId", "noticeId");

-- AddForeignKey
ALTER TABLE "Like" ADD CONSTRAINT "Like_noteId_fkey" FOREIGN KEY ("noteId") REFERENCES "Note"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Like" ADD CONSTRAINT "Like_noticeId_fkey" FOREIGN KEY ("noticeId") REFERENCES "Notice"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_noteId_fkey" FOREIGN KEY ("noteId") REFERENCES "Note"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_noticeId_fkey" FOREIGN KEY ("noticeId") REFERENCES "Notice"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Feedback" ADD CONSTRAINT "Feedback_authorClerkId_fkey" FOREIGN KEY ("authorClerkId") REFERENCES "User"("clerkId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notice" ADD CONSTRAINT "Notice_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("clerkId") ON DELETE RESTRICT ON UPDATE CASCADE;
