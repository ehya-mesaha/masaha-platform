ALTER TABLE "Space"
ADD COLUMN "ownerTermsAcceptedAt" TIMESTAMP(3),
ADD COLUMN "ownerTermsVersion" TEXT;

ALTER TABLE "Booking"
ADD COLUMN "termsAcceptedAt" TIMESTAMP(3),
ADD COLUMN "termsVersion" TEXT;
