-- =============================================
-- Masaha: Complete Migration + Seed
-- Run in Supabase SQL Editor (one shot)
-- =============================================

-- ============ ENUMS ============
DO $$ BEGIN
  ALTER TYPE "UserStatus" ADD VALUE IF NOT EXISTS 'PENDING_APPROVAL';
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE "CancellationPolicy" AS ENUM ('FLEXIBLE', 'MODERATE', 'STRICT');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE "DocumentType" AS ENUM ('NATIONAL_ID', 'COMMERCIAL_REGISTER');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- ============ ALTER Amenity: add category column ============
ALTER TABLE "Amenity" ADD COLUMN IF NOT EXISTS "category" TEXT;

-- ============ ALTER Space: add new columns ============
ALTER TABLE "Space" ADD COLUMN IF NOT EXISTS "latitude" DOUBLE PRECISION;
ALTER TABLE "Space" ADD COLUMN IF NOT EXISTS "longitude" DOUBLE PRECISION;
ALTER TABLE "Space" ADD COLUMN IF NOT EXISTS "streetName" TEXT;
ALTER TABLE "Space" ADD COLUMN IF NOT EXISTS "buildingNumber" TEXT;
ALTER TABLE "Space" ADD COLUMN IF NOT EXISTS "postalCode" TEXT;
ALTER TABLE "Space" ADD COLUMN IF NOT EXISTS "landmarks" TEXT;
ALTER TABLE "Space" ADD COLUMN IF NOT EXISTS "minBookingHours" INTEGER;
ALTER TABLE "Space" ADD COLUMN IF NOT EXISTS "maxAdvanceBookingDays" INTEGER;
ALTER TABLE "Space" ADD COLUMN IF NOT EXISTS "cancellationPolicy" "CancellationPolicy" DEFAULT 'FLEXIBLE';

-- ============ CREATE UserDocument table ============
CREATE TABLE IF NOT EXISTS "UserDocument" (
  "id" TEXT NOT NULL DEFAULT gen_random_uuid()::text,
  "type" "DocumentType" NOT NULL,
  "fileUrl" TEXT NOT NULL,
  "uploadedAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
  "userId" TEXT NOT NULL,
  CONSTRAINT "UserDocument_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "UserDocument_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE
);

-- ============ CREATE SpaceWorkingHours table ============
CREATE TABLE IF NOT EXISTS "SpaceWorkingHours" (
  "id" TEXT NOT NULL DEFAULT gen_random_uuid()::text,
  "dayOfWeek" INTEGER NOT NULL,
  "isOpen" BOOLEAN NOT NULL DEFAULT true,
  "openTime" TEXT NOT NULL DEFAULT '08:00',
  "closeTime" TEXT NOT NULL DEFAULT '22:00',
  "spaceId" TEXT NOT NULL,
  CONSTRAINT "SpaceWorkingHours_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "SpaceWorkingHours_spaceId_fkey" FOREIGN KEY ("spaceId") REFERENCES "Space"("id") ON DELETE CASCADE
);
CREATE UNIQUE INDEX IF NOT EXISTS "SpaceWorkingHours_spaceId_dayOfWeek_key" ON "SpaceWorkingHours"("spaceId", "dayOfWeek");

-- ============ CREATE SpaceService table ============
CREATE TABLE IF NOT EXISTS "SpaceService" (
  "id" TEXT NOT NULL DEFAULT gen_random_uuid()::text,
  "name" TEXT NOT NULL,
  "description" TEXT,
  "price" DOUBLE PRECISION NOT NULL,
  "pricingType" TEXT NOT NULL DEFAULT 'PER_BOOKING',
  "spaceId" TEXT NOT NULL,
  CONSTRAINT "SpaceService_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "SpaceService_spaceId_fkey" FOREIGN KEY ("spaceId") REFERENCES "Space"("id") ON DELETE CASCADE
);

-- ============ CREATE SpaceRule table ============
CREATE TABLE IF NOT EXISTS "SpaceRule" (
  "id" TEXT NOT NULL DEFAULT gen_random_uuid()::text,
  "rule" TEXT NOT NULL,
  "isDefault" BOOLEAN NOT NULL DEFAULT false,
  "spaceId" TEXT NOT NULL,
  CONSTRAINT "SpaceRule_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "SpaceRule_spaceId_fkey" FOREIGN KEY ("spaceId") REFERENCES "Space"("id") ON DELETE CASCADE
);

-- ============ STORAGE: documents bucket ============
INSERT INTO storage.buckets (id, name, public)
VALUES ('documents', 'documents', true)
ON CONFLICT (id) DO NOTHING;

-- ============ SEED: Space Types ============
INSERT INTO "SpaceType" (id, name) VALUES
  (gen_random_uuid()::text, 'قاعة اجتماعات'),
  (gen_random_uuid()::text, 'مساحة عمل مشتركة'),
  (gen_random_uuid()::text, 'قاعة تدريب'),
  (gen_random_uuid()::text, 'استوديو تصوير'),
  (gen_random_uuid()::text, 'قاعة مناسبات'),
  (gen_random_uuid()::text, 'مكتب خاص'),
  (gen_random_uuid()::text, 'صالة عرض'),
  (gen_random_uuid()::text, 'مساحة فعاليات'),
  (gen_random_uuid()::text, 'أخرى')
ON CONFLICT (name) DO NOTHING;

-- ============ SEED: Amenities ============
-- Tech
INSERT INTO "Amenity" (id, name, icon, category) VALUES
  (gen_random_uuid()::text, 'شاشة عرض', NULL, 'tech'),
  (gen_random_uuid()::text, 'بروجكتور', NULL, 'tech'),
  (gen_random_uuid()::text, 'سبورة ذكية', NULL, 'tech'),
  (gen_random_uuid()::text, 'واي فاي عالي السرعة', NULL, 'tech'),
  (gen_random_uuid()::text, 'نظام صوتي', NULL, 'tech'),
  (gen_random_uuid()::text, 'كاميرا مؤتمرات', NULL, 'tech'),
  (gen_random_uuid()::text, 'شاشات متعددة', NULL, 'tech'),
  (gen_random_uuid()::text, 'مايكروفون لاسلكي', NULL, 'tech')
ON CONFLICT (name) DO NOTHING;

-- Comfort
INSERT INTO "Amenity" (id, name, icon, category) VALUES
  (gen_random_uuid()::text, 'تكييف مركزي', NULL, 'comfort'),
  (gen_random_uuid()::text, 'مطبخ مجهز', NULL, 'comfort'),
  (gen_random_uuid()::text, 'مواقف سيارات', NULL, 'comfort'),
  (gen_random_uuid()::text, 'استقبال', NULL, 'comfort'),
  (gen_random_uuid()::text, 'غرفة صلاة', NULL, 'comfort'),
  (gen_random_uuid()::text, 'دورات مياه خاصة', NULL, 'comfort'),
  (gen_random_uuid()::text, 'مصعد', NULL, 'comfort'),
  (gen_random_uuid()::text, 'كراسي مريحة', NULL, 'comfort')
ON CONFLICT (name) DO NOTHING;

-- Other
INSERT INTO "Amenity" (id, name, icon, category) VALUES
  (gen_random_uuid()::text, 'طابعة', NULL, 'other'),
  (gen_random_uuid()::text, 'ماسح ضوئي', NULL, 'other'),
  (gen_random_uuid()::text, 'خزائن شخصية', NULL, 'other'),
  (gen_random_uuid()::text, 'إضاءة طبيعية', NULL, 'other')
ON CONFLICT (name) DO NOTHING;
