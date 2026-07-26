-- Upgrade databases created before Prisma Migrate was introduced.
-- Every structural operation is idempotent so a fresh database can run this
-- after the full foundation migration without duplicating objects.

BEGIN;

DO $migration$
BEGIN
  CREATE TYPE "OccupancyStatus" AS ENUM ('PLANNED', 'CONFIRMED');
EXCEPTION WHEN duplicate_object THEN NULL;
END $migration$;

DO $migration$
BEGIN
  CREATE TYPE "ClosureStatus" AS ENUM ('ACTIVE', 'CANCELLED');
EXCEPTION WHEN duplicate_object THEN NULL;
END $migration$;

DO $migration$
BEGIN
  CREATE TYPE "ServicePricingType" AS ENUM ('PER_BOOKING', 'PER_PERSON', 'PER_HOUR', 'PER_ITEM', 'PER_TEN_PAGES', 'CUSTOM');
EXCEPTION WHEN duplicate_object THEN NULL;
END $migration$;

DO $migration$
BEGIN
  CREATE TYPE "PartnerServiceRequestStatus" AS ENUM ('DRAFT', 'UNDER_REVIEW', 'QUOTED', 'ACCEPTED', 'REJECTED', 'COMPLETED');
EXCEPTION WHEN duplicate_object THEN NULL;
END $migration$;

DO $migration$
BEGIN
  CREATE TYPE "SellerApplicationStatus" AS ENUM ('DATA_REVIEW', 'CONTRACT_SENT', 'APPROVED', 'EXPIRED', 'REJECTED', 'CHANGES_REQUESTED');
EXCEPTION WHEN duplicate_object THEN NULL;
END $migration$;

DO $migration$
BEGIN
  CREATE TYPE "ContactMessageType" AS ENUM ('INQUIRY', 'SUGGESTION', 'COMPLAINT');
EXCEPTION WHEN duplicate_object THEN NULL;
END $migration$;

DO $migration$
BEGIN
  CREATE TYPE "OrganizationRole" AS ENUM ('OWNER', 'MANAGER', 'STAFF');
EXCEPTION WHEN duplicate_object THEN NULL;
END $migration$;

ALTER TYPE "DocumentType" ADD VALUE IF NOT EXISTS 'TITLE_DEED';
ALTER TYPE "DocumentType" ADD VALUE IF NOT EXISTS 'POWER_OF_ATTORNEY';

ALTER TABLE "User"
  ADD COLUMN IF NOT EXISTS "emailVerifiedAt" TIMESTAMP(3),
  ADD COLUMN IF NOT EXISTS "phoneVerifiedAt" TIMESTAMP(3);

CREATE TABLE IF NOT EXISTS "AdminAuditLog" (
  "id" TEXT NOT NULL,
  "action" TEXT NOT NULL,
  "entityType" TEXT NOT NULL,
  "entityId" TEXT NOT NULL,
  "before" JSONB,
  "after" JSONB,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "actorId" TEXT NOT NULL,
  CONSTRAINT "AdminAuditLog_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "AdminAuditLog_actorId_fkey" FOREIGN KEY ("actorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE INDEX IF NOT EXISTS "AdminAuditLog_entityType_entityId_createdAt_idx"
  ON "AdminAuditLog"("entityType", "entityId", "createdAt");
CREATE INDEX IF NOT EXISTS "AdminAuditLog_actorId_createdAt_idx"
  ON "AdminAuditLog"("actorId", "createdAt");

CREATE TABLE IF NOT EXISTS "SchoolOrganization" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "branchName" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "SchoolOrganization_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "OrganizationMember" (
  "id" TEXT NOT NULL,
  "role" "OrganizationRole" NOT NULL DEFAULT 'STAFF',
  "userId" TEXT NOT NULL,
  "organizationId" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "OrganizationMember_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "OrganizationMember_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "OrganizationMember_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "SchoolOrganization"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX IF NOT EXISTS "OrganizationMember_organizationId_role_idx"
  ON "OrganizationMember"("organizationId", "role");
CREATE UNIQUE INDEX IF NOT EXISTS "OrganizationMember_userId_organizationId_key"
  ON "OrganizationMember"("userId", "organizationId");

ALTER TABLE "Space"
  ADD COLUMN IF NOT EXISTS "advertisingLicenseNumber" TEXT,
  ADD COLUMN IF NOT EXISTS "identicalUnitsCount" INTEGER NOT NULL DEFAULT 1,
  ADD COLUMN IF NOT EXISTS "organizationId" TEXT,
  ADD COLUMN IF NOT EXISTS "publicRef" TEXT;

UPDATE "Space" SET "cancellationPolicy" = 'FLEXIBLE' WHERE "cancellationPolicy" IS NULL;
ALTER TABLE "Space" ALTER COLUMN "cancellationPolicy" SET NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS "Space_publicRef_key" ON "Space"("publicRef");

DO $migration$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'Space_organizationId_fkey') THEN
    ALTER TABLE "Space"
      ADD CONSTRAINT "Space_organizationId_fkey"
      FOREIGN KEY ("organizationId") REFERENCES "SchoolOrganization"("id") ON DELETE SET NULL ON UPDATE CASCADE;
  END IF;
END $migration$;

CREATE TABLE IF NOT EXISTS "SpaceUnit" (
  "id" TEXT NOT NULL,
  "label" TEXT NOT NULL,
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "spaceId" TEXT NOT NULL,
  CONSTRAINT "SpaceUnit_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "SpaceUnit_spaceId_fkey" FOREIGN KEY ("spaceId") REFERENCES "Space"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX IF NOT EXISTS "SpaceUnit_spaceId_isActive_idx" ON "SpaceUnit"("spaceId", "isActive");
CREATE UNIQUE INDEX IF NOT EXISTS "SpaceUnit_spaceId_label_key" ON "SpaceUnit"("spaceId", "label");

INSERT INTO "SpaceUnit" ("id", "label", "isActive", "spaceId")
SELECT 'legacy-unit-' || "id", 'الوحدة 1', true, "id"
FROM "Space"
ON CONFLICT ("spaceId", "label") DO NOTHING;

CREATE TABLE IF NOT EXISTS "PricingTier" (
  "id" TEXT NOT NULL,
  "minHours" INTEGER NOT NULL,
  "discountPercent" DOUBLE PRECISION NOT NULL,
  "spaceId" TEXT NOT NULL,
  CONSTRAINT "PricingTier_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "PricingTier_spaceId_fkey" FOREIGN KEY ("spaceId") REFERENCES "Space"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE UNIQUE INDEX IF NOT EXISTS "PricingTier_spaceId_minHours_key" ON "PricingTier"("spaceId", "minHours");

CREATE TABLE IF NOT EXISTS "PrivateOccupancy" (
  "id" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "startTime" TIMESTAMP(3) NOT NULL,
  "endTime" TIMESTAMP(3) NOT NULL,
  "status" "OccupancyStatus" NOT NULL DEFAULT 'CONFIRMED',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  "spaceId" TEXT NOT NULL,
  "unitId" TEXT,
  CONSTRAINT "PrivateOccupancy_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "PrivateOccupancy_spaceId_fkey" FOREIGN KEY ("spaceId") REFERENCES "Space"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "PrivateOccupancy_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "SpaceUnit"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX IF NOT EXISTS "PrivateOccupancy_spaceId_startTime_endTime_idx"
  ON "PrivateOccupancy"("spaceId", "startTime", "endTime");
CREATE INDEX IF NOT EXISTS "PrivateOccupancy_unitId_startTime_endTime_idx"
  ON "PrivateOccupancy"("unitId", "startTime", "endTime");

CREATE TABLE IF NOT EXISTS "TemporaryClosure" (
  "id" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "startTime" TIMESTAMP(3) NOT NULL,
  "endTime" TIMESTAMP(3) NOT NULL,
  "status" "ClosureStatus" NOT NULL DEFAULT 'ACTIVE',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  "spaceId" TEXT NOT NULL,
  "unitId" TEXT,
  CONSTRAINT "TemporaryClosure_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "TemporaryClosure_spaceId_fkey" FOREIGN KEY ("spaceId") REFERENCES "Space"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "TemporaryClosure_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "SpaceUnit"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX IF NOT EXISTS "TemporaryClosure_spaceId_startTime_endTime_idx"
  ON "TemporaryClosure"("spaceId", "startTime", "endTime");
CREATE INDEX IF NOT EXISTS "TemporaryClosure_unitId_startTime_endTime_idx"
  ON "TemporaryClosure"("unitId", "startTime", "endTime");

CREATE TABLE IF NOT EXISTS "ServiceCatalog" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "category" TEXT NOT NULL,
  "pricingType" "ServicePricingType" NOT NULL,
  "defaultPrice" DOUBLE PRECISION,
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "sortOrder" INTEGER NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "ServiceCatalog_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "ServiceCatalog_name_key" ON "ServiceCatalog"("name");

CREATE TABLE IF NOT EXISTS "SpaceServiceConfig" (
  "id" TEXT NOT NULL,
  "isEnabled" BOOLEAN NOT NULL DEFAULT false,
  "price" DOUBLE PRECISION,
  "details" TEXT,
  "config" JSONB,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  "spaceId" TEXT NOT NULL,
  "catalogId" TEXT NOT NULL,
  CONSTRAINT "SpaceServiceConfig_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "SpaceServiceConfig_spaceId_fkey" FOREIGN KEY ("spaceId") REFERENCES "Space"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "SpaceServiceConfig_catalogId_fkey" FOREIGN KEY ("catalogId") REFERENCES "ServiceCatalog"("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE INDEX IF NOT EXISTS "SpaceServiceConfig_spaceId_isEnabled_idx"
  ON "SpaceServiceConfig"("spaceId", "isEnabled");
CREATE UNIQUE INDEX IF NOT EXISTS "SpaceServiceConfig_spaceId_catalogId_key"
  ON "SpaceServiceConfig"("spaceId", "catalogId");

CREATE TABLE IF NOT EXISTS "BookingProgram" (
  "id" TEXT NOT NULL,
  "startDate" TIMESTAMP(3) NOT NULL,
  "endDate" TIMESTAMP(3) NOT NULL,
  "weekdays" INTEGER[],
  "sessionStart" TEXT NOT NULL,
  "sessionEnd" TEXT NOT NULL,
  "sessionCount" INTEGER NOT NULL,
  "totalHours" DOUBLE PRECISION NOT NULL,
  "discountPercent" DOUBLE PRECISION NOT NULL DEFAULT 5,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "BookingProgram_pkey" PRIMARY KEY ("id")
);

ALTER TABLE "Booking"
  ADD COLUMN IF NOT EXISTS "basePrice" DOUBLE PRECISION NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS "cancelledAt" TIMESTAMP(3),
  ADD COLUMN IF NOT EXISTS "cancelledBy" TEXT,
  ADD COLUMN IF NOT EXISTS "discountAmount" DOUBLE PRECISION NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS "grandTotal" DOUBLE PRECISION NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS "programId" TEXT,
  ADD COLUMN IF NOT EXISTS "refundAmount" DOUBLE PRECISION,
  ADD COLUMN IF NOT EXISTS "servicesTotal" DOUBLE PRECISION NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS "totalHours" DOUBLE PRECISION NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS "unitId" TEXT;

DO $migration$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'Booking'
      AND column_name = 'date' AND data_type = 'text'
  ) THEN
    ALTER TABLE "Booking"
      ADD COLUMN IF NOT EXISTS "date_migrated" TIMESTAMP(3),
      ADD COLUMN IF NOT EXISTS "startTime_migrated" TIMESTAMP(3),
      ADD COLUMN IF NOT EXISTS "endTime_migrated" TIMESTAMP(3);

    UPDATE "Booking"
    SET
      "date_migrated" = "date"::date::timestamp,
      "startTime_migrated" = ("date"::date + "startTime"::time)::timestamp,
      "endTime_migrated" = ("date"::date + "endTime"::time)::timestamp;

    ALTER TABLE "Booking"
      ALTER COLUMN "date_migrated" SET NOT NULL,
      ALTER COLUMN "startTime_migrated" SET NOT NULL,
      ALTER COLUMN "endTime_migrated" SET NOT NULL;

    ALTER TABLE "Booking"
      DROP COLUMN "date",
      DROP COLUMN "startTime",
      DROP COLUMN "endTime";

    ALTER TABLE "Booking" RENAME COLUMN "date_migrated" TO "date";
    ALTER TABLE "Booking" RENAME COLUMN "startTime_migrated" TO "startTime";
    ALTER TABLE "Booking" RENAME COLUMN "endTime_migrated" TO "endTime";
  END IF;
END $migration$;

UPDATE "Booking" AS booking
SET "unitId" = (
  SELECT unit."id"
  FROM "SpaceUnit" AS unit
  WHERE unit."spaceId" = booking."spaceId"
  ORDER BY unit."createdAt", unit."id"
  LIMIT 1
)
WHERE booking."unitId" IS NULL;

ALTER TABLE "Booking" ALTER COLUMN "unitId" SET NOT NULL;

DO $migration$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM pg_type type
    JOIN pg_enum value ON value.enumtypid = type.oid
    WHERE type.typname = 'BookingStatus' AND value.enumlabel = 'PENDING'
  ) THEN
    EXECUTE 'ALTER TABLE "Booking" ALTER COLUMN "status" DROP DEFAULT';
    EXECUTE 'CREATE TYPE "BookingStatus_next" AS ENUM (''CONFIRMED'', ''CANCELLED_BY_BUYER'', ''CANCELLED_BY_SELLER'', ''COMPLETED'')';
    EXECUTE 'ALTER TABLE "Booking" ALTER COLUMN "status" TYPE "BookingStatus_next" USING ((CASE "status"::text WHEN ''PENDING'' THEN ''CONFIRMED'' WHEN ''ACCEPTED'' THEN ''CONFIRMED'' WHEN ''REJECTED'' THEN ''CANCELLED_BY_SELLER'' WHEN ''CANCELLED'' THEN ''CANCELLED_BY_BUYER'' ELSE "status"::text END)::"BookingStatus_next")';
    EXECUTE 'ALTER TYPE "BookingStatus" RENAME TO "BookingStatus_legacy"';
    EXECUTE 'ALTER TYPE "BookingStatus_next" RENAME TO "BookingStatus"';
    EXECUTE 'DROP TYPE "BookingStatus_legacy"';
  END IF;
END $migration$;

ALTER TABLE "Booking" ALTER COLUMN "status" SET DEFAULT 'CONFIRMED';

UPDATE "Booking" AS booking
SET
  "totalHours" = GREATEST(EXTRACT(EPOCH FROM (booking."endTime" - booking."startTime")) / 3600, 0),
  "basePrice" = GREATEST(EXTRACT(EPOCH FROM (booking."endTime" - booking."startTime")) / 3600, 0) * space."price",
  "grandTotal" = GREATEST(EXTRACT(EPOCH FROM (booking."endTime" - booking."startTime")) / 3600, 0) * space."price"
FROM "Space" AS space
WHERE space."id" = booking."spaceId" AND booking."grandTotal" = 0;

DO $migration$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'Booking_unitId_fkey') THEN
    ALTER TABLE "Booking"
      ADD CONSTRAINT "Booking_unitId_fkey"
      FOREIGN KEY ("unitId") REFERENCES "SpaceUnit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'Booking_programId_fkey') THEN
    ALTER TABLE "Booking"
      ADD CONSTRAINT "Booking_programId_fkey"
      FOREIGN KEY ("programId") REFERENCES "BookingProgram"("id") ON DELETE SET NULL ON UPDATE CASCADE;
  END IF;
END $migration$;

CREATE INDEX IF NOT EXISTS "Booking_unitId_startTime_endTime_status_idx"
  ON "Booking"("unitId", "startTime", "endTime", "status");
CREATE INDEX IF NOT EXISTS "Booking_buyerId_createdAt_idx" ON "Booking"("buyerId", "createdAt");
CREATE INDEX IF NOT EXISTS "Booking_programId_idx" ON "Booking"("programId");

CREATE EXTENSION IF NOT EXISTS btree_gist;

DO $migration$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'Booking_unit_confirmed_time_excl') THEN
    ALTER TABLE "Booking"
      ADD CONSTRAINT "Booking_unit_confirmed_time_excl"
      EXCLUDE USING gist (
        "unitId" WITH =,
        tsrange("startTime", "endTime", '[)') WITH &&
      )
      WHERE ("status" = 'CONFIRMED');
  END IF;
END $migration$;

CREATE TABLE IF NOT EXISTS "BookingService" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "quantity" INTEGER NOT NULL DEFAULT 1,
  "unitPrice" DOUBLE PRECISION NOT NULL,
  "lineTotal" DOUBLE PRECISION NOT NULL,
  "bookingId" TEXT NOT NULL,
  "configId" TEXT,
  CONSTRAINT "BookingService_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "BookingService_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "Booking"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "BookingService_configId_fkey" FOREIGN KEY ("configId") REFERENCES "SpaceServiceConfig"("id") ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE INDEX IF NOT EXISTS "BookingService_bookingId_idx" ON "BookingService"("bookingId");

CREATE TABLE IF NOT EXISTS "Favorite" (
  "userId" TEXT NOT NULL,
  "spaceId" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Favorite_pkey" PRIMARY KEY ("userId", "spaceId"),
  CONSTRAINT "Favorite_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "Favorite_spaceId_fkey" FOREIGN KEY ("spaceId") REFERENCES "Space"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX IF NOT EXISTS "Favorite_spaceId_idx" ON "Favorite"("spaceId");

CREATE TABLE IF NOT EXISTS "Notification" (
  "id" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "message" TEXT NOT NULL,
  "href" TEXT,
  "isRead" BOOLEAN NOT NULL DEFAULT false,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "userId" TEXT NOT NULL,
  CONSTRAINT "Notification_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX IF NOT EXISTS "Notification_userId_isRead_createdAt_idx"
  ON "Notification"("userId", "isRead", "createdAt");

CREATE TABLE IF NOT EXISTS "SavedSearch" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "criteria" JSONB NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  "userId" TEXT NOT NULL,
  CONSTRAINT "SavedSearch_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "SavedSearch_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX IF NOT EXISTS "SavedSearch_userId_updatedAt_idx" ON "SavedSearch"("userId", "updatedAt");

CREATE TABLE IF NOT EXISTS "PartnerService" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "pricingType" "ServicePricingType" NOT NULL,
  "indicativePrice" DOUBLE PRECISION,
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "sortOrder" INTEGER NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "PartnerService_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "PartnerService_name_key" ON "PartnerService"("name");

CREATE TABLE IF NOT EXISTS "PartnerServiceRequest" (
  "id" TEXT NOT NULL,
  "publicRef" TEXT NOT NULL,
  "status" "PartnerServiceRequestStatus" NOT NULL DEFAULT 'DRAFT',
  "notes" TEXT,
  "adminNotes" TEXT,
  "estimatedTotal" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "quotedTotal" DOUBLE PRECISION,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  "buyerId" TEXT NOT NULL,
  "bookingId" TEXT,
  CONSTRAINT "PartnerServiceRequest_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "PartnerServiceRequest_buyerId_fkey" FOREIGN KEY ("buyerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE UNIQUE INDEX IF NOT EXISTS "PartnerServiceRequest_publicRef_key" ON "PartnerServiceRequest"("publicRef");
CREATE INDEX IF NOT EXISTS "PartnerServiceRequest_buyerId_createdAt_idx"
  ON "PartnerServiceRequest"("buyerId", "createdAt");
CREATE INDEX IF NOT EXISTS "PartnerServiceRequest_status_createdAt_idx"
  ON "PartnerServiceRequest"("status", "createdAt");

CREATE TABLE IF NOT EXISTS "PartnerServiceRequestItem" (
  "id" TEXT NOT NULL,
  "quantity" INTEGER NOT NULL DEFAULT 1,
  "details" TEXT,
  "estimatedPrice" DOUBLE PRECISION,
  "quotedPrice" DOUBLE PRECISION,
  "requestId" TEXT NOT NULL,
  "serviceId" TEXT NOT NULL,
  CONSTRAINT "PartnerServiceRequestItem_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "PartnerServiceRequestItem_requestId_fkey" FOREIGN KEY ("requestId") REFERENCES "PartnerServiceRequest"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "PartnerServiceRequestItem_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "PartnerService"("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE INDEX IF NOT EXISTS "PartnerServiceRequestItem_requestId_idx"
  ON "PartnerServiceRequestItem"("requestId");

CREATE TABLE IF NOT EXISTS "SellerApplication" (
  "id" TEXT NOT NULL,
  "schoolName" TEXT NOT NULL,
  "branchName" TEXT,
  "commercialRegisterNo" TEXT NOT NULL,
  "multipleOwners" BOOLEAN NOT NULL DEFAULT false,
  "powerOfAttorneyNumber" TEXT,
  "brokerageContractNo" TEXT,
  "contractSentAt" TIMESTAMP(3),
  "approvalDeadline" TIMESTAMP(3),
  "status" "SellerApplicationStatus" NOT NULL DEFAULT 'DATA_REVIEW',
  "adminNotes" TEXT,
  "consentAcceptedAt" TIMESTAMP(3) NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  "userId" TEXT NOT NULL,
  CONSTRAINT "SellerApplication_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "SellerApplication_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE UNIQUE INDEX IF NOT EXISTS "SellerApplication_userId_key" ON "SellerApplication"("userId");
CREATE INDEX IF NOT EXISTS "SellerApplication_status_createdAt_idx" ON "SellerApplication"("status", "createdAt");
CREATE INDEX IF NOT EXISTS "SellerApplication_commercialRegisterNo_idx"
  ON "SellerApplication"("commercialRegisterNo");

CREATE TABLE IF NOT EXISTS "ContactMessage" (
  "id" TEXT NOT NULL,
  "type" "ContactMessageType" NOT NULL,
  "name" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "phone" TEXT,
  "subject" TEXT,
  "message" TEXT NOT NULL,
  "isRead" BOOLEAN NOT NULL DEFAULT false,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "userId" TEXT,
  CONSTRAINT "ContactMessage_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "ContactMessage_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE INDEX IF NOT EXISTS "ContactMessage_type_isRead_createdAt_idx"
  ON "ContactMessage"("type", "isRead", "createdAt");

COMMIT;
