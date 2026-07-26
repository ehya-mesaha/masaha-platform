-- Remove legacy database defaults and normalize referential actions so the
-- upgraded production database exactly matches the Prisma schema.

BEGIN;

ALTER TABLE "User" ALTER COLUMN "updatedAt" DROP DEFAULT;
ALTER TABLE "Space" ALTER COLUMN "updatedAt" DROP DEFAULT;
ALTER TABLE "Booking" ALTER COLUMN "updatedAt" DROP DEFAULT;
ALTER TABLE "SpaceNeedRequest" ALTER COLUMN "updatedAt" DROP DEFAULT;

ALTER TABLE "UserDocument"
  ALTER COLUMN "id" DROP DEFAULT,
  ALTER COLUMN "uploadedAt" SET DATA TYPE TIMESTAMP(3);
ALTER TABLE "SpaceWorkingHours" ALTER COLUMN "id" DROP DEFAULT;
ALTER TABLE "SpaceService" ALTER COLUMN "id" DROP DEFAULT;
ALTER TABLE "SpaceRule" ALTER COLUMN "id" DROP DEFAULT;

ALTER TABLE "Booking" DROP CONSTRAINT "Booking_buyerId_fkey";
ALTER TABLE "Booking" DROP CONSTRAINT "Booking_spaceId_fkey";
ALTER TABLE "Space" DROP CONSTRAINT "Space_sellerId_fkey";
ALTER TABLE "Space" DROP CONSTRAINT "Space_typeId_fkey";
ALTER TABLE "SpaceAmenity" DROP CONSTRAINT "SpaceAmenity_amenityId_fkey";
ALTER TABLE "SpaceAmenity" DROP CONSTRAINT "SpaceAmenity_spaceId_fkey";
ALTER TABLE "SpaceImage" DROP CONSTRAINT "SpaceImage_spaceId_fkey";
ALTER TABLE "SpaceRule" DROP CONSTRAINT "SpaceRule_spaceId_fkey";
ALTER TABLE "SpaceService" DROP CONSTRAINT "SpaceService_spaceId_fkey";
ALTER TABLE "SpaceWorkingHours" DROP CONSTRAINT "SpaceWorkingHours_spaceId_fkey";
ALTER TABLE "UserDocument" DROP CONSTRAINT "UserDocument_userId_fkey";

ALTER TABLE "Booking"
  ADD CONSTRAINT "Booking_buyerId_fkey"
  FOREIGN KEY ("buyerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
  ADD CONSTRAINT "Booking_spaceId_fkey"
  FOREIGN KEY ("spaceId") REFERENCES "Space"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "Space"
  ADD CONSTRAINT "Space_sellerId_fkey"
  FOREIGN KEY ("sellerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
  ADD CONSTRAINT "Space_typeId_fkey"
  FOREIGN KEY ("typeId") REFERENCES "SpaceType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "SpaceAmenity"
  ADD CONSTRAINT "SpaceAmenity_amenityId_fkey"
  FOREIGN KEY ("amenityId") REFERENCES "Amenity"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
  ADD CONSTRAINT "SpaceAmenity_spaceId_fkey"
  FOREIGN KEY ("spaceId") REFERENCES "Space"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "SpaceImage"
  ADD CONSTRAINT "SpaceImage_spaceId_fkey"
  FOREIGN KEY ("spaceId") REFERENCES "Space"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "SpaceRule"
  ADD CONSTRAINT "SpaceRule_spaceId_fkey"
  FOREIGN KEY ("spaceId") REFERENCES "Space"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "SpaceService"
  ADD CONSTRAINT "SpaceService_spaceId_fkey"
  FOREIGN KEY ("spaceId") REFERENCES "Space"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "SpaceWorkingHours"
  ADD CONSTRAINT "SpaceWorkingHours_spaceId_fkey"
  FOREIGN KEY ("spaceId") REFERENCES "Space"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "UserDocument"
  ADD CONSTRAINT "UserDocument_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

COMMIT;
