CREATE TYPE "SpaceNeedStatus" AS ENUM ('NEW', 'IN_REVIEW', 'MATCHED', 'CLOSED');

CREATE TABLE "SpaceNeedRequest" (
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

CREATE INDEX "SpaceNeedRequest_buyerId_createdAt_idx" ON "SpaceNeedRequest"("buyerId", "createdAt");
CREATE INDEX "SpaceNeedRequest_status_createdAt_idx" ON "SpaceNeedRequest"("status", "createdAt");
CREATE INDEX "SpaceNeedRequest_typeId_idx" ON "SpaceNeedRequest"("typeId");
CREATE INDEX "SpaceNeedRequest_city_idx" ON "SpaceNeedRequest"("city");

ALTER TABLE "SpaceNeedRequest"
  ADD CONSTRAINT "SpaceNeedRequest_buyerId_fkey"
  FOREIGN KEY ("buyerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "SpaceNeedRequest"
  ADD CONSTRAINT "SpaceNeedRequest_typeId_fkey"
  FOREIGN KEY ("typeId") REFERENCES "SpaceType"("id") ON DELETE SET NULL ON UPDATE CASCADE;
