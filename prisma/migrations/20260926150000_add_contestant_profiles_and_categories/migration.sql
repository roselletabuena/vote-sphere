-- CreateEnum
CREATE TYPE "ContestantDivision" AS ENUM ('FEMALE', 'MALE', 'LGBTQ', 'TEEN');

-- CreateEnum
CREATE TYPE "ContestantStatus" AS ENUM ('ACTIVE', 'HIDDEN', 'WITHDRAWN');

-- CreateEnum
CREATE TYPE "MediaType" AS ENUM ('PHOTO', 'VIDEO_EMBED');

-- CreateEnum
CREATE TYPE "EmbedPlatform" AS ENUM ('YOUTUBE', 'TIKTOK', 'INSTAGRAM', 'FACEBOOK', 'NONE');

-- DropIndex
DROP INDEX IF EXISTS "Contestant_eventId_contestantNumber_key";

-- AlterTable
ALTER TABLE "Contestant" ADD COLUMN IF NOT EXISTS "advocacy" TEXT,
ADD COLUMN IF NOT EXISTS "division" "ContestantDivision" NOT NULL DEFAULT 'FEMALE',
ADD COLUMN IF NOT EXISTS "facebookUrl" TEXT,
ADD COLUMN IF NOT EXISTS "heightCm" INTEGER,
ADD COLUMN IF NOT EXISTS "hometown" TEXT,
ADD COLUMN IF NOT EXISTS "instagramUrl" TEXT,
ADD COLUMN IF NOT EXISTS "status" "ContestantStatus" NOT NULL DEFAULT 'ACTIVE',
ADD COLUMN IF NOT EXISTS "tiktokUrl" TEXT,
ALTER COLUMN "bio" DROP NOT NULL;

-- CreateTable
CREATE TABLE IF NOT EXISTS "ContestantMedia" (
    "id" TEXT NOT NULL,
    "contestantId" TEXT NOT NULL,
    "mediaType" "MediaType" NOT NULL DEFAULT 'PHOTO',
    "url" TEXT NOT NULL,
    "embedPlatform" "EmbedPlatform" NOT NULL DEFAULT 'NONE',
    "embedId" TEXT,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "aspectRatio" TEXT NOT NULL DEFAULT '4:5',
    "isCover" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ContestantMedia_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "AwardCategory" (
    "id" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "isVotingOpen" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AwardCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "ContestantCategoryAssignment" (
    "id" TEXT NOT NULL,
    "contestantId" TEXT NOT NULL,
    "awardCategoryId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ContestantCategoryAssignment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX IF NOT EXISTS "ContestantMedia_contestantId_displayOrder_idx" ON "ContestantMedia"("contestantId", "displayOrder");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "AwardCategory_eventId_idx" ON "AwardCategory"("eventId");

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "AwardCategory_eventId_name_key" ON "AwardCategory"("eventId", "name");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "ContestantCategoryAssignment_contestantId_idx" ON "ContestantCategoryAssignment"("contestantId");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "ContestantCategoryAssignment_awardCategoryId_idx" ON "ContestantCategoryAssignment"("awardCategoryId");

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "ContestantCategoryAssignment_contestantId_awardCategoryId_key" ON "ContestantCategoryAssignment"("contestantId", "awardCategoryId");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "Contestant_eventId_status_idx" ON "Contestant"("eventId", "status");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "Contestant_eventId_division_idx" ON "Contestant"("eventId", "division");

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "Contestant_eventId_division_contestantNumber_key" ON "Contestant"("eventId", "division", "contestantNumber");

-- AddForeignKey
ALTER TABLE "ContestantMedia" DROP CONSTRAINT IF EXISTS "ContestantMedia_contestantId_fkey";
ALTER TABLE "ContestantMedia" ADD CONSTRAINT "ContestantMedia_contestantId_fkey" FOREIGN KEY ("contestantId") REFERENCES "Contestant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AwardCategory" DROP CONSTRAINT IF EXISTS "AwardCategory_eventId_fkey";
ALTER TABLE "AwardCategory" ADD CONSTRAINT "AwardCategory_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContestantCategoryAssignment" DROP CONSTRAINT IF EXISTS "ContestantCategoryAssignment_contestantId_fkey";
ALTER TABLE "ContestantCategoryAssignment" ADD CONSTRAINT "ContestantCategoryAssignment_contestantId_fkey" FOREIGN KEY ("contestantId") REFERENCES "Contestant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContestantCategoryAssignment" DROP CONSTRAINT IF EXISTS "ContestantCategoryAssignment_awardCategoryId_fkey";
ALTER TABLE "ContestantCategoryAssignment" ADD CONSTRAINT "ContestantCategoryAssignment_awardCategoryId_fkey" FOREIGN KEY ("awardCategoryId") REFERENCES "AwardCategory"("id") ON DELETE CASCADE ON UPDATE CASCADE;
