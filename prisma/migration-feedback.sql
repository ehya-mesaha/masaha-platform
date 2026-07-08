CREATE TABLE "SpaceReview" (
  "id" TEXT NOT NULL,
  "rating" INTEGER NOT NULL,
  "comment" TEXT,
  "isVisible" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  "spaceId" TEXT NOT NULL,
  "buyerId" TEXT NOT NULL,
  "bookingId" TEXT NOT NULL,
  CONSTRAINT "SpaceReview_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "SpaceReview_bookingId_key" ON "SpaceReview"("bookingId");
CREATE INDEX "SpaceReview_spaceId_isVisible_createdAt_idx" ON "SpaceReview"("spaceId", "isVisible", "createdAt");
CREATE INDEX "SpaceReview_buyerId_idx" ON "SpaceReview"("buyerId");
CREATE INDEX "SpaceReview_rating_idx" ON "SpaceReview"("rating");

ALTER TABLE "SpaceReview"
  ADD CONSTRAINT "SpaceReview_spaceId_fkey"
  FOREIGN KEY ("spaceId") REFERENCES "Space"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "SpaceReview"
  ADD CONSTRAINT "SpaceReview_buyerId_fkey"
  FOREIGN KEY ("buyerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "SpaceReview"
  ADD CONSTRAINT "SpaceReview_bookingId_fkey"
  FOREIGN KEY ("bookingId") REFERENCES "Booking"("id") ON DELETE CASCADE ON UPDATE CASCADE;
