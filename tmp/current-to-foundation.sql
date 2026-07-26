-- CreateEnum
CREATE TYPE "OccupancyStatus" AS ENUM ('PLANNED', 'CONFIRMED');

-- CreateEnum
CREATE TYPE "ClosureStatus" AS ENUM ('ACTIVE', 'CANCELLED');

-- CreateEnum
CREATE TYPE "ServicePricingType" AS ENUM ('PER_BOOKING', 'PER_PERSON', 'PER_HOUR', 'PER_ITEM', 'PER_TEN_PAGES', 'CUSTOM');

-- CreateEnum
CREATE TYPE "PartnerServiceRequestStatus" AS ENUM ('DRAFT', 'UNDER_REVIEW', 'QUOTED', 'ACCEPTED', 'REJECTED', 'COMPLETED');

-- CreateEnum
CREATE TYPE "SellerApplicationStatus" AS ENUM ('DATA_REVIEW', 'CONTRACT_SENT', 'APPROVED', 'EXPIRED', 'REJECTED', 'CHANGES_REQUESTED');

-- CreateEnum
CREATE TYPE "ContactMessageType" AS ENUM ('INQUIRY', 'SUGGESTION', 'COMPLAINT');

-- CreateEnum
CREATE TYPE "OrganizationRole" AS ENUM ('OWNER', 'MANAGER', 'STAFF');

-- AlterEnum
BEGIN;
CREATE TYPE "BookingStatus_new" AS ENUM ('CONFIRMED', 'CANCELLED_BY_BUYER', 'CANCELLED_BY_SELLER', 'COMPLETED');
ALTER TABLE "public"."Booking" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Booking" ALTER COLUMN "status" TYPE "BookingStatus_new" USING ("status"::text::"BookingStatus_new");
ALTER TYPE "BookingStatus" RENAME TO "BookingStatus_old";
ALTER TYPE "BookingStatus_new" RENAME TO "BookingStatus";
DROP TYPE "public"."BookingStatus_old";
ALTER TABLE "Booking" ALTER COLUMN "status" SET DEFAULT 'CONFIRMED';
COMMIT;

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "DocumentType" ADD VALUE 'TITLE_DEED';
ALTER TYPE "DocumentType" ADD VALUE 'POWER_OF_ATTORNEY';

-- DropForeignKey
ALTER TABLE "Booking" DROP CONSTRAINT "Booking_buyerId_fkey";

-- DropForeignKey
ALTER TABLE "Booking" DROP CONSTRAINT "Booking_spaceId_fkey";

-- DropForeignKey
ALTER TABLE "Space" DROP CONSTRAINT "Space_sellerId_fkey";

-- DropForeignKey
ALTER TABLE "Space" DROP CONSTRAINT "Space_typeId_fkey";

-- DropForeignKey
ALTER TABLE "SpaceAmenity" DROP CONSTRAINT "SpaceAmenity_amenityId_fkey";

-- DropForeignKey
ALTER TABLE "SpaceAmenity" DROP CONSTRAINT "SpaceAmenity_spaceId_fkey";

-- DropForeignKey
ALTER TABLE "SpaceImage" DROP CONSTRAINT "SpaceImage_spaceId_fkey";

-- DropForeignKey
ALTER TABLE "SpaceRule" DROP CONSTRAINT "SpaceRule_spaceId_fkey";

-- DropForeignKey
ALTER TABLE "SpaceService" DROP CONSTRAINT "SpaceService_spaceId_fkey";

-- DropForeignKey
ALTER TABLE "SpaceWorkingHours" DROP CONSTRAINT "SpaceWorkingHours_spaceId_fkey";

-- DropForeignKey
ALTER TABLE "UserDocument" DROP CONSTRAINT "UserDocument_userId_fkey";

-- AlterTable
ALTER TABLE "Booking" ADD COLUMN     "basePrice" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "cancelledAt" TIMESTAMP(3),
ADD COLUMN     "cancelledBy" TEXT,
ADD COLUMN     "discountAmount" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "grandTotal" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "programId" TEXT,
ADD COLUMN     "refundAmount" DOUBLE PRECISION,
ADD COLUMN     "servicesTotal" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "totalHours" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "unitId" TEXT NOT NULL,
DROP COLUMN "date",
ADD COLUMN     "date" TIMESTAMP(3) NOT NULL,
DROP COLUMN "startTime",
ADD COLUMN     "startTime" TIMESTAMP(3) NOT NULL,
DROP COLUMN "endTime",
ADD COLUMN     "endTime" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "status" SET DEFAULT 'CONFIRMED',
ALTER COLUMN "updatedAt" DROP DEFAULT;

-- AlterTable
ALTER TABLE "Space" ADD COLUMN     "advertisingLicenseNumber" TEXT,
ADD COLUMN     "identicalUnitsCount" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "organizationId" TEXT,
ADD COLUMN     "publicRef" TEXT,
ALTER COLUMN "updatedAt" DROP DEFAULT,
ALTER COLUMN "cancellationPolicy" SET NOT NULL;

-- AlterTable
ALTER TABLE "SpaceNeedRequest" ALTER COLUMN "updatedAt" DROP DEFAULT;

-- AlterTable
ALTER TABLE "SpaceRule" ALTER COLUMN "id" DROP DEFAULT;

-- AlterTable
ALTER TABLE "SpaceService" ALTER COLUMN "id" DROP DEFAULT;

-- AlterTable
ALTER TABLE "SpaceWorkingHours" ALTER COLUMN "id" DROP DEFAULT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "emailVerifiedAt" TIMESTAMP(3),
ADD COLUMN     "phoneVerifiedAt" TIMESTAMP(3),
ALTER COLUMN "updatedAt" DROP DEFAULT;

-- AlterTable
ALTER TABLE "UserDocument" ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "uploadedAt" SET DATA TYPE TIMESTAMP(3);

-- CreateTable
CREATE TABLE "AdminAuditLog" (
    "id" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "entityType" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "before" JSONB,
    "after" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actorId" TEXT NOT NULL,

    CONSTRAINT "AdminAuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SchoolOrganization" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "branchName" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SchoolOrganization_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrganizationMember" (
    "id" TEXT NOT NULL,
    "role" "OrganizationRole" NOT NULL DEFAULT 'STAFF',
    "userId" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "OrganizationMember_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SpaceUnit" (
    "id" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "spaceId" TEXT NOT NULL,

    CONSTRAINT "SpaceUnit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PricingTier" (
    "id" TEXT NOT NULL,
    "minHours" INTEGER NOT NULL,
    "discountPercent" DOUBLE PRECISION NOT NULL,
    "spaceId" TEXT NOT NULL,

    CONSTRAINT "PricingTier_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PrivateOccupancy" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3) NOT NULL,
    "status" "OccupancyStatus" NOT NULL DEFAULT 'CONFIRMED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "spaceId" TEXT NOT NULL,
    "unitId" TEXT,

    CONSTRAINT "PrivateOccupancy_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TemporaryClosure" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3) NOT NULL,
    "status" "ClosureStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "spaceId" TEXT NOT NULL,
    "unitId" TEXT,

    CONSTRAINT "TemporaryClosure_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ServiceCatalog" (
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

-- CreateTable
CREATE TABLE "SpaceServiceConfig" (
    "id" TEXT NOT NULL,
    "isEnabled" BOOLEAN NOT NULL DEFAULT false,
    "price" DOUBLE PRECISION,
    "details" TEXT,
    "config" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "spaceId" TEXT NOT NULL,
    "catalogId" TEXT NOT NULL,

    CONSTRAINT "SpaceServiceConfig_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BookingService" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "unitPrice" DOUBLE PRECISION NOT NULL,
    "lineTotal" DOUBLE PRECISION NOT NULL,
    "bookingId" TEXT NOT NULL,
    "configId" TEXT,

    CONSTRAINT "BookingService_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BookingProgram" (
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

-- CreateTable
CREATE TABLE "Favorite" (
    "userId" TEXT NOT NULL,
    "spaceId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Favorite_pkey" PRIMARY KEY ("userId","spaceId")
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "href" TEXT,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SavedSearch" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "criteria" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "SavedSearch_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PartnerService" (
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

-- CreateTable
CREATE TABLE "PartnerServiceRequest" (
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

    CONSTRAINT "PartnerServiceRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PartnerServiceRequestItem" (
    "id" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "details" TEXT,
    "estimatedPrice" DOUBLE PRECISION,
    "quotedPrice" DOUBLE PRECISION,
    "requestId" TEXT NOT NULL,
    "serviceId" TEXT NOT NULL,

    CONSTRAINT "PartnerServiceRequestItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SellerApplication" (
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

    CONSTRAINT "SellerApplication_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContactMessage" (
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

    CONSTRAINT "ContactMessage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "AdminAuditLog_entityType_entityId_createdAt_idx" ON "AdminAuditLog"("entityType", "entityId", "createdAt");

-- CreateIndex
CREATE INDEX "AdminAuditLog_actorId_createdAt_idx" ON "AdminAuditLog"("actorId", "createdAt");

-- CreateIndex
CREATE INDEX "OrganizationMember_organizationId_role_idx" ON "OrganizationMember"("organizationId", "role");

-- CreateIndex
CREATE UNIQUE INDEX "OrganizationMember_userId_organizationId_key" ON "OrganizationMember"("userId", "organizationId");

-- CreateIndex
CREATE INDEX "SpaceUnit_spaceId_isActive_idx" ON "SpaceUnit"("spaceId", "isActive");

-- CreateIndex
CREATE UNIQUE INDEX "SpaceUnit_spaceId_label_key" ON "SpaceUnit"("spaceId", "label");

-- CreateIndex
CREATE UNIQUE INDEX "PricingTier_spaceId_minHours_key" ON "PricingTier"("spaceId", "minHours");

-- CreateIndex
CREATE INDEX "PrivateOccupancy_spaceId_startTime_endTime_idx" ON "PrivateOccupancy"("spaceId", "startTime", "endTime");

-- CreateIndex
CREATE INDEX "PrivateOccupancy_unitId_startTime_endTime_idx" ON "PrivateOccupancy"("unitId", "startTime", "endTime");

-- CreateIndex
CREATE INDEX "TemporaryClosure_spaceId_startTime_endTime_idx" ON "TemporaryClosure"("spaceId", "startTime", "endTime");

-- CreateIndex
CREATE INDEX "TemporaryClosure_unitId_startTime_endTime_idx" ON "TemporaryClosure"("unitId", "startTime", "endTime");

-- CreateIndex
CREATE UNIQUE INDEX "ServiceCatalog_name_key" ON "ServiceCatalog"("name");

-- CreateIndex
CREATE INDEX "SpaceServiceConfig_spaceId_isEnabled_idx" ON "SpaceServiceConfig"("spaceId", "isEnabled");

-- CreateIndex
CREATE UNIQUE INDEX "SpaceServiceConfig_spaceId_catalogId_key" ON "SpaceServiceConfig"("spaceId", "catalogId");

-- CreateIndex
CREATE INDEX "BookingService_bookingId_idx" ON "BookingService"("bookingId");

-- CreateIndex
CREATE INDEX "Favorite_spaceId_idx" ON "Favorite"("spaceId");

-- CreateIndex
CREATE INDEX "Notification_userId_isRead_createdAt_idx" ON "Notification"("userId", "isRead", "createdAt");

-- CreateIndex
CREATE INDEX "SavedSearch_userId_updatedAt_idx" ON "SavedSearch"("userId", "updatedAt");

-- CreateIndex
CREATE UNIQUE INDEX "PartnerService_name_key" ON "PartnerService"("name");

-- CreateIndex
CREATE UNIQUE INDEX "PartnerServiceRequest_publicRef_key" ON "PartnerServiceRequest"("publicRef");

-- CreateIndex
CREATE INDEX "PartnerServiceRequest_buyerId_createdAt_idx" ON "PartnerServiceRequest"("buyerId", "createdAt");

-- CreateIndex
CREATE INDEX "PartnerServiceRequest_status_createdAt_idx" ON "PartnerServiceRequest"("status", "createdAt");

-- CreateIndex
CREATE INDEX "PartnerServiceRequestItem_requestId_idx" ON "PartnerServiceRequestItem"("requestId");

-- CreateIndex
CREATE UNIQUE INDEX "SellerApplication_userId_key" ON "SellerApplication"("userId");

-- CreateIndex
CREATE INDEX "SellerApplication_status_createdAt_idx" ON "SellerApplication"("status", "createdAt");

-- CreateIndex
CREATE INDEX "SellerApplication_commercialRegisterNo_idx" ON "SellerApplication"("commercialRegisterNo");

-- CreateIndex
CREATE INDEX "ContactMessage_type_isRead_createdAt_idx" ON "ContactMessage"("type", "isRead", "createdAt");

-- CreateIndex
CREATE INDEX "Booking_unitId_startTime_endTime_status_idx" ON "Booking"("unitId", "startTime", "endTime", "status");

-- CreateIndex
CREATE INDEX "Booking_buyerId_createdAt_idx" ON "Booking"("buyerId", "createdAt");

-- CreateIndex
CREATE INDEX "Booking_programId_idx" ON "Booking"("programId");

-- CreateIndex
CREATE UNIQUE INDEX "Space_publicRef_key" ON "Space"("publicRef");

-- AddForeignKey
ALTER TABLE "AdminAuditLog" ADD CONSTRAINT "AdminAuditLog_actorId_fkey" FOREIGN KEY ("actorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserDocument" ADD CONSTRAINT "UserDocument_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Space" ADD CONSTRAINT "Space_typeId_fkey" FOREIGN KEY ("typeId") REFERENCES "SpaceType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Space" ADD CONSTRAINT "Space_sellerId_fkey" FOREIGN KEY ("sellerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Space" ADD CONSTRAINT "Space_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "SchoolOrganization"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrganizationMember" ADD CONSTRAINT "OrganizationMember_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrganizationMember" ADD CONSTRAINT "OrganizationMember_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "SchoolOrganization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SpaceImage" ADD CONSTRAINT "SpaceImage_spaceId_fkey" FOREIGN KEY ("spaceId") REFERENCES "Space"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SpaceAmenity" ADD CONSTRAINT "SpaceAmenity_spaceId_fkey" FOREIGN KEY ("spaceId") REFERENCES "Space"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SpaceAmenity" ADD CONSTRAINT "SpaceAmenity_amenityId_fkey" FOREIGN KEY ("amenityId") REFERENCES "Amenity"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SpaceWorkingHours" ADD CONSTRAINT "SpaceWorkingHours_spaceId_fkey" FOREIGN KEY ("spaceId") REFERENCES "Space"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SpaceUnit" ADD CONSTRAINT "SpaceUnit_spaceId_fkey" FOREIGN KEY ("spaceId") REFERENCES "Space"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PricingTier" ADD CONSTRAINT "PricingTier_spaceId_fkey" FOREIGN KEY ("spaceId") REFERENCES "Space"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PrivateOccupancy" ADD CONSTRAINT "PrivateOccupancy_spaceId_fkey" FOREIGN KEY ("spaceId") REFERENCES "Space"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PrivateOccupancy" ADD CONSTRAINT "PrivateOccupancy_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "SpaceUnit"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TemporaryClosure" ADD CONSTRAINT "TemporaryClosure_spaceId_fkey" FOREIGN KEY ("spaceId") REFERENCES "Space"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TemporaryClosure" ADD CONSTRAINT "TemporaryClosure_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "SpaceUnit"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SpaceService" ADD CONSTRAINT "SpaceService_spaceId_fkey" FOREIGN KEY ("spaceId") REFERENCES "Space"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SpaceServiceConfig" ADD CONSTRAINT "SpaceServiceConfig_spaceId_fkey" FOREIGN KEY ("spaceId") REFERENCES "Space"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SpaceServiceConfig" ADD CONSTRAINT "SpaceServiceConfig_catalogId_fkey" FOREIGN KEY ("catalogId") REFERENCES "ServiceCatalog"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SpaceRule" ADD CONSTRAINT "SpaceRule_spaceId_fkey" FOREIGN KEY ("spaceId") REFERENCES "Space"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_spaceId_fkey" FOREIGN KEY ("spaceId") REFERENCES "Space"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_buyerId_fkey" FOREIGN KEY ("buyerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "SpaceUnit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_programId_fkey" FOREIGN KEY ("programId") REFERENCES "BookingProgram"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookingService" ADD CONSTRAINT "BookingService_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "Booking"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookingService" ADD CONSTRAINT "BookingService_configId_fkey" FOREIGN KEY ("configId") REFERENCES "SpaceServiceConfig"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Favorite" ADD CONSTRAINT "Favorite_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Favorite" ADD CONSTRAINT "Favorite_spaceId_fkey" FOREIGN KEY ("spaceId") REFERENCES "Space"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SavedSearch" ADD CONSTRAINT "SavedSearch_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PartnerServiceRequest" ADD CONSTRAINT "PartnerServiceRequest_buyerId_fkey" FOREIGN KEY ("buyerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PartnerServiceRequestItem" ADD CONSTRAINT "PartnerServiceRequestItem_requestId_fkey" FOREIGN KEY ("requestId") REFERENCES "PartnerServiceRequest"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PartnerServiceRequestItem" ADD CONSTRAINT "PartnerServiceRequestItem_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "PartnerService"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SellerApplication" ADD CONSTRAINT "SellerApplication_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContactMessage" ADD CONSTRAINT "ContactMessage_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
