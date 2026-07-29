-- Add PRINT_MATRIX pricing type for structured (bw/color x single/double) service pricing
ALTER TYPE "ServicePricingType" ADD VALUE IF NOT EXISTS 'PRINT_MATRIX';

-- Admin-configurable default matrix pricing for services using PRINT_MATRIX
ALTER TABLE "ServiceCatalog" ADD COLUMN IF NOT EXISTS "defaultConfig" JSONB;

-- National ID / commercial register number captured at booking time
ALTER TABLE "Booking" ADD COLUMN IF NOT EXISTS "requesterIdNumber" TEXT;
