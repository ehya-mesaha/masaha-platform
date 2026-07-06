-- ============================================
-- Masaha UX Overhaul Migration v2
-- Run this in Supabase SQL Editor
-- ============================================

-- 1. Add new enum values
ALTER TYPE "UserStatus" ADD VALUE IF NOT EXISTS 'PENDING_APPROVAL';

DO $$ BEGIN CREATE TYPE "CancellationPolicy" AS ENUM ('FLEXIBLE','MODERATE','STRICT'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE "DocumentType" AS ENUM ('NATIONAL_ID','COMMERCIAL_REGISTER'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- 2. Add new columns to Space
ALTER TABLE "Space" ADD COLUMN IF NOT EXISTS "latitude" DOUBLE PRECISION;
ALTER TABLE "Space" ADD COLUMN IF NOT EXISTS "longitude" DOUBLE PRECISION;
ALTER TABLE "Space" ADD COLUMN IF NOT EXISTS "streetName" TEXT;
ALTER TABLE "Space" ADD COLUMN IF NOT EXISTS "buildingNumber" TEXT;
ALTER TABLE "Space" ADD COLUMN IF NOT EXISTS "postalCode" TEXT;
ALTER TABLE "Space" ADD COLUMN IF NOT EXISTS "landmarks" TEXT;
ALTER TABLE "Space" ADD COLUMN IF NOT EXISTS "minBookingHours" INT;
ALTER TABLE "Space" ADD COLUMN IF NOT EXISTS "maxAdvanceBookingDays" INT;
ALTER TABLE "Space" ADD COLUMN IF NOT EXISTS "cancellationPolicy" "CancellationPolicy" NOT NULL DEFAULT 'FLEXIBLE';

-- 3. Add category column to Amenity
ALTER TABLE "Amenity" ADD COLUMN IF NOT EXISTS "category" TEXT;

-- 4. Create UserDocument table
CREATE TABLE IF NOT EXISTS "UserDocument" (
  "id" TEXT PRIMARY KEY,
  "type" "DocumentType" NOT NULL,
  "fileUrl" TEXT NOT NULL,
  "uploadedAt" TIMESTAMP(3) NOT NULL DEFAULT NOW(),
  "userId" TEXT NOT NULL REFERENCES "User"("id") ON DELETE CASCADE
);

-- 5. Create SpaceWorkingHours table
CREATE TABLE IF NOT EXISTS "SpaceWorkingHours" (
  "id" TEXT PRIMARY KEY,
  "dayOfWeek" INT NOT NULL,
  "isOpen" BOOLEAN NOT NULL DEFAULT true,
  "openTime" TEXT NOT NULL DEFAULT '08:00',
  "closeTime" TEXT NOT NULL DEFAULT '22:00',
  "spaceId" TEXT NOT NULL REFERENCES "Space"("id") ON DELETE CASCADE,
  UNIQUE("spaceId", "dayOfWeek")
);

-- 6. Create SpaceService table
CREATE TABLE IF NOT EXISTS "SpaceService" (
  "id" TEXT PRIMARY KEY,
  "name" TEXT NOT NULL,
  "description" TEXT,
  "price" DOUBLE PRECISION NOT NULL,
  "pricingType" TEXT NOT NULL DEFAULT 'PER_BOOKING',
  "spaceId" TEXT NOT NULL REFERENCES "Space"("id") ON DELETE CASCADE
);

-- 7. Create SpaceRule table
CREATE TABLE IF NOT EXISTS "SpaceRule" (
  "id" TEXT PRIMARY KEY,
  "rule" TEXT NOT NULL,
  "isDefault" BOOLEAN NOT NULL DEFAULT false,
  "spaceId" TEXT NOT NULL REFERENCES "Space"("id") ON DELETE CASCADE
);

-- 8. Update existing amenities with categories
UPDATE "Amenity" SET "category" = 'tech' WHERE "name" IN ('واي فاي','بروجكتر','سبورة','شاشة عرض','نظام صوتي','طابعة');
UPDATE "Amenity" SET "category" = 'comfort' WHERE "name" IN ('مكيف','مواقف سيارات','مطبخ');

-- 9. Add more amenities matching the PDF design
INSERT INTO "Amenity" ("id", "name", "icon", "category") VALUES
  ('am10','إنترنت عالي السرعة','wifi','tech'),
  ('am11','جهاز عرض (بروجكتور)','projector','tech'),
  ('am12','شاشة ذكية','screen','tech'),
  ('am13','نظام صوتي متكامل','audio','tech'),
  ('am14','طابعة وماسح ضوئي','printer','tech'),
  ('am15','تكييف مركزي','ac','comfort'),
  ('am16','ركن قهوة وضيافة','coffee','comfort'),
  ('am17','مواقف سيارات مجانية','parking','comfort'),
  ('am18','سبورة بيضاء','whiteboard','comfort'),
  ('am19','مهيأ لذوي الهمم','accessibility','comfort'),
  ('am20','مصلى','prayer','comfort')
ON CONFLICT ("name") DO UPDATE SET "category" = EXCLUDED."category", "icon" = EXCLUDED."icon";

-- 10. Create documents storage bucket (run separately if this fails)
-- INSERT INTO storage.buckets (id, name, public) VALUES ('documents', 'documents', false) ON CONFLICT (id) DO NOTHING;
