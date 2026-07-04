-- Run this in Supabase SQL Editor to create all tables

-- Enums
CREATE TYPE "Role" AS ENUM ('ADMIN', 'SELLER', 'BUYER');
CREATE TYPE "UserStatus" AS ENUM ('ACTIVE', 'SUSPENDED');
CREATE TYPE "SpaceStatus" AS ENUM ('DRAFT', 'PENDING_REVIEW', 'APPROVED', 'REJECTED', 'INACTIVE');
CREATE TYPE "BookingStatus" AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED', 'CANCELLED', 'COMPLETED');

-- Users
CREATE TABLE IF NOT EXISTS "User" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "name" TEXT NOT NULL,
  "email" TEXT NOT NULL UNIQUE,
  "phone" TEXT,
  "password" TEXT NOT NULL,
  "role" "Role" NOT NULL DEFAULT 'BUYER',
  "status" "UserStatus" NOT NULL DEFAULT 'ACTIVE',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- SpaceType
CREATE TABLE IF NOT EXISTS "SpaceType" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "name" TEXT NOT NULL UNIQUE
);

-- Amenity
CREATE TABLE IF NOT EXISTS "Amenity" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "name" TEXT NOT NULL UNIQUE,
  "icon" TEXT
);

-- Space
CREATE TABLE IF NOT EXISTS "Space" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "name" TEXT NOT NULL,
  "description" TEXT,
  "city" TEXT NOT NULL,
  "district" TEXT,
  "address" TEXT,
  "capacity" INTEGER,
  "price" DOUBLE PRECISION NOT NULL,
  "pricePeriod" TEXT NOT NULL DEFAULT 'hour',
  "status" "SpaceStatus" NOT NULL DEFAULT 'DRAFT',
  "adminNotes" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "typeId" TEXT NOT NULL REFERENCES "SpaceType"("id"),
  "sellerId" TEXT NOT NULL REFERENCES "User"("id")
);

-- SpaceImage
CREATE TABLE IF NOT EXISTS "SpaceImage" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "url" TEXT NOT NULL,
  "order" INTEGER NOT NULL DEFAULT 0,
  "spaceId" TEXT NOT NULL REFERENCES "Space"("id") ON DELETE CASCADE
);

-- SpaceAmenity
CREATE TABLE IF NOT EXISTS "SpaceAmenity" (
  "spaceId" TEXT NOT NULL REFERENCES "Space"("id") ON DELETE CASCADE,
  "amenityId" TEXT NOT NULL REFERENCES "Amenity"("id"),
  PRIMARY KEY ("spaceId", "amenityId")
);

-- Booking
CREATE TABLE IF NOT EXISTS "Booking" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "date" TEXT NOT NULL,
  "startTime" TEXT NOT NULL,
  "endTime" TEXT NOT NULL,
  "persons" INTEGER,
  "notes" TEXT,
  "status" "BookingStatus" NOT NULL DEFAULT 'PENDING',
  "sellerNote" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "spaceId" TEXT NOT NULL REFERENCES "Space"("id"),
  "buyerId" TEXT NOT NULL REFERENCES "User"("id")
);

-- Seed: Admin user (password: admin123)
INSERT INTO "User" ("id", "name", "email", "password", "role", "status", "updatedAt")
VALUES (
  'admin001',
  'مدير المنصة',
  'admin@masaha.sa',
  '$2a$10$LH5Pp.Lte5HUv88OlZ1jNuZUqJSYL1SsVknMmTrK8K27/FrHUe6FW',
  'ADMIN',
  'ACTIVE',
  CURRENT_TIMESTAMP
) ON CONFLICT (email) DO NOTHING;

-- Seed: Space Types
INSERT INTO "SpaceType" ("id", "name") VALUES
  (gen_random_uuid()::text, 'مكتب'),
  (gen_random_uuid()::text, 'قاعة تدريب'),
  (gen_random_uuid()::text, 'قاعة اجتماعات'),
  (gen_random_uuid()::text, 'استوديو تصوير'),
  (gen_random_uuid()::text, 'مساحة عمل مشتركة'),
  (gen_random_uuid()::text, 'قاعة فعاليات'),
  (gen_random_uuid()::text, 'مساحة تجارية')
ON CONFLICT (name) DO NOTHING;

-- Seed: Amenities
INSERT INTO "Amenity" ("id", "name", "icon") VALUES
  (gen_random_uuid()::text, 'إنترنت', 'wifi'),
  (gen_random_uuid()::text, 'شاشة', 'monitor'),
  (gen_random_uuid()::text, 'بروجكتور', 'projector'),
  (gen_random_uuid()::text, 'طاولات', 'table'),
  (gen_random_uuid()::text, 'كراسي', 'chair'),
  (gen_random_uuid()::text, 'ضيافة', 'coffee'),
  (gen_random_uuid()::text, 'مواقف', 'parking'),
  (gen_random_uuid()::text, 'تكييف', 'ac'),
  (gen_random_uuid()::text, 'عزل صوتي', 'sound')
ON CONFLICT (name) DO NOTHING;
