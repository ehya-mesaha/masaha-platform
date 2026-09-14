CREATE TYPE "CouponDiscountType" AS ENUM ('PERCENTAGE', 'FIXED');

CREATE TYPE "CouponRedemptionStatus" AS ENUM ('RESERVED', 'CONFIRMED', 'RELEASED');

CREATE TABLE "Coupon" (
  "id" TEXT NOT NULL,
  "code" TEXT NOT NULL,
  "description" TEXT,
  "discountType" "CouponDiscountType" NOT NULL,
  "discountValue" DOUBLE PRECISION NOT NULL,
  "maxDiscountAmount" DOUBLE PRECISION,
  "minBookingAmount" DOUBLE PRECISION,
  "startsAt" TIMESTAMP(3) NOT NULL,
  "endsAt" TIMESTAMP(3) NOT NULL,
  "maxRedemptions" INTEGER,
  "maxPerUser" INTEGER,
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  "createdById" TEXT,

  CONSTRAINT "Coupon_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "CouponRedemption" (
  "id" TEXT NOT NULL,
  "status" "CouponRedemptionStatus" NOT NULL DEFAULT 'RESERVED',
  "discountHalalas" INTEGER NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  "confirmedAt" TIMESTAMP(3),
  "releasedAt" TIMESTAMP(3),
  "couponId" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "paymentOrderId" TEXT NOT NULL,

  CONSTRAINT "CouponRedemption_pkey" PRIMARY KEY ("id")
);

ALTER TABLE "Booking" ADD COLUMN IF NOT EXISTS "couponCode" TEXT;
ALTER TABLE "Booking" ADD COLUMN IF NOT EXISTS "couponDiscount" DOUBLE PRECISION NOT NULL DEFAULT 0;

CREATE UNIQUE INDEX "Coupon_code_key" ON "Coupon"("code");
CREATE INDEX "Coupon_isActive_startsAt_endsAt_idx" ON "Coupon"("isActive", "startsAt", "endsAt");

CREATE UNIQUE INDEX "CouponRedemption_paymentOrderId_key" ON "CouponRedemption"("paymentOrderId");
CREATE INDEX "CouponRedemption_couponId_status_idx" ON "CouponRedemption"("couponId", "status");
CREATE INDEX "CouponRedemption_couponId_userId_status_idx" ON "CouponRedemption"("couponId", "userId", "status");

ALTER TABLE "Coupon" ADD CONSTRAINT "Coupon_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "CouponRedemption" ADD CONSTRAINT "CouponRedemption_couponId_fkey" FOREIGN KEY ("couponId") REFERENCES "Coupon"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "CouponRedemption" ADD CONSTRAINT "CouponRedemption_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "CouponRedemption" ADD CONSTRAINT "CouponRedemption_paymentOrderId_fkey" FOREIGN KEY ("paymentOrderId") REFERENCES "PaymentOrder"("id") ON DELETE CASCADE ON UPDATE CASCADE;
