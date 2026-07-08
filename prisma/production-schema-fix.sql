ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "avatarUrl" TEXT;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'SpaceNeedStatus') THEN
    CREATE TYPE "SpaceNeedStatus" AS ENUM ('NEW', 'IN_REVIEW', 'MATCHED', 'CLOSED');
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS "SpaceNeedRequest" (
  "id" TEXT NOT NULL,
  "spaceType" TEXT NOT NULL,
  "city" TEXT NOT NULL,
  "district" TEXT,
  "expectedDate" TEXT,
  "capacity" INTEGER NOT NULL,
  "budgetMin" DOUBLE PRECISION,
  "budgetMax" DOUBLE PRECISION,
  "details" TEXT,
  "status" "SpaceNeedStatus" NOT NULL DEFAULT 'NEW',
  "adminNote" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "buyerId" TEXT NOT NULL,
  "typeId" TEXT,
  CONSTRAINT "SpaceNeedRequest_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "SpaceNeedRequest_buyerId_createdAt_idx" ON "SpaceNeedRequest"("buyerId", "createdAt");
CREATE INDEX IF NOT EXISTS "SpaceNeedRequest_status_createdAt_idx" ON "SpaceNeedRequest"("status", "createdAt");
CREATE INDEX IF NOT EXISTS "SpaceNeedRequest_typeId_idx" ON "SpaceNeedRequest"("typeId");
CREATE INDEX IF NOT EXISTS "SpaceNeedRequest_city_idx" ON "SpaceNeedRequest"("city");

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'SpaceNeedRequest_buyerId_fkey') THEN
    ALTER TABLE "SpaceNeedRequest"
      ADD CONSTRAINT "SpaceNeedRequest_buyerId_fkey"
      FOREIGN KEY ("buyerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'SpaceNeedRequest_typeId_fkey') THEN
    ALTER TABLE "SpaceNeedRequest"
      ADD CONSTRAINT "SpaceNeedRequest_typeId_fkey"
      FOREIGN KEY ("typeId") REFERENCES "SpaceType"("id") ON DELETE SET NULL ON UPDATE CASCADE;
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS "SpaceReview" (
  "id" TEXT NOT NULL,
  "rating" INTEGER NOT NULL,
  "comment" TEXT,
  "isVisible" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "spaceId" TEXT NOT NULL,
  "buyerId" TEXT NOT NULL,
  "bookingId" TEXT NOT NULL,
  CONSTRAINT "SpaceReview_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "SpaceReview_bookingId_key" ON "SpaceReview"("bookingId");
CREATE INDEX IF NOT EXISTS "SpaceReview_spaceId_isVisible_createdAt_idx" ON "SpaceReview"("spaceId", "isVisible", "createdAt");
CREATE INDEX IF NOT EXISTS "SpaceReview_buyerId_idx" ON "SpaceReview"("buyerId");
CREATE INDEX IF NOT EXISTS "SpaceReview_rating_idx" ON "SpaceReview"("rating");

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'SpaceReview_spaceId_fkey') THEN
    ALTER TABLE "SpaceReview"
      ADD CONSTRAINT "SpaceReview_spaceId_fkey"
      FOREIGN KEY ("spaceId") REFERENCES "Space"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'SpaceReview_buyerId_fkey') THEN
    ALTER TABLE "SpaceReview"
      ADD CONSTRAINT "SpaceReview_buyerId_fkey"
      FOREIGN KEY ("buyerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'SpaceReview_bookingId_fkey') THEN
    ALTER TABLE "SpaceReview"
      ADD CONSTRAINT "SpaceReview_bookingId_fkey"
      FOREIGN KEY ("bookingId") REFERENCES "Booking"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
END $$;
