ALTER TYPE "BookingStatus" ADD VALUE IF NOT EXISTS 'PENDING_PAYMENT';
ALTER TYPE "BookingStatus" ADD VALUE IF NOT EXISTS 'PAYMENT_FAILED';
ALTER TYPE "BookingStatus" ADD VALUE IF NOT EXISTS 'PAYMENT_EXPIRED';

CREATE TYPE "PaymentOrderStatus" AS ENUM (
  'PENDING',
  'CHECKOUT_CREATED',
  'PAID',
  'FAILED',
  'EXPIRED',
  'REFUND_PENDING',
  'PARTIALLY_REFUNDED',
  'REFUNDED'
);

CREATE TYPE "PaymentRefundStatus" AS ENUM (
  'PENDING',
  'PROCESSING',
  'COMPLETED',
  'FAILED',
  'CANCELLED'
);

CREATE TYPE "StreamWebhookStatus" AS ENUM ('RECEIVED', 'PROCESSED', 'FAILED');

CREATE TABLE "PaymentOrder" (
  "id" TEXT NOT NULL,
  "checkoutKey" TEXT NOT NULL,
  "checkoutToken" TEXT NOT NULL,
  "status" "PaymentOrderStatus" NOT NULL DEFAULT 'PENDING',
  "currency" TEXT NOT NULL DEFAULT 'SAR',
  "amountHalalas" INTEGER NOT NULL,
  "refundedHalalas" INTEGER NOT NULL DEFAULT 0,
  "expiresAt" TIMESTAMP(3) NOT NULL,
  "paidAt" TIMESTAMP(3),
  "failedAt" TIMESTAMP(3),
  "streamConsumerId" TEXT,
  "streamProductId" TEXT,
  "streamPaymentLinkId" TEXT,
  "streamInvoiceId" TEXT,
  "streamPaymentId" TEXT,
  "checkoutUrl" TEXT,
  "lastError" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  "buyerId" TEXT NOT NULL,

  CONSTRAINT "PaymentOrder_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "PaymentProviderCustomer" (
  "id" TEXT NOT NULL,
  "provider" TEXT NOT NULL DEFAULT 'STREAMPAY',
  "environment" TEXT NOT NULL,
  "providerCustomerId" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  "userId" TEXT NOT NULL,

  CONSTRAINT "PaymentProviderCustomer_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "PaymentRefund" (
  "id" TEXT NOT NULL,
  "amountHalalas" INTEGER NOT NULL,
  "status" "PaymentRefundStatus" NOT NULL DEFAULT 'PENDING',
  "reason" TEXT NOT NULL,
  "note" TEXT,
  "providerRefundId" TEXT,
  "lastError" TEXT,
  "requestedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "processedAt" TIMESTAMP(3),
  "updatedAt" TIMESTAMP(3) NOT NULL,
  "paymentOrderId" TEXT NOT NULL,
  "bookingId" TEXT,

  CONSTRAINT "PaymentRefund_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "StreamWebhookEvent" (
  "id" TEXT NOT NULL,
  "payloadHash" TEXT NOT NULL,
  "eventType" TEXT NOT NULL,
  "entityType" TEXT,
  "entityId" TEXT,
  "providerTime" TIMESTAMP(3),
  "status" "StreamWebhookStatus" NOT NULL DEFAULT 'RECEIVED',
  "lastError" TEXT,
  "receivedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "processedAt" TIMESTAMP(3),
  "paymentOrderId" TEXT,

  CONSTRAINT "StreamWebhookEvent_pkey" PRIMARY KEY ("id")
);

ALTER TABLE "Booking" ADD COLUMN "paymentOrderId" TEXT;

CREATE UNIQUE INDEX "PaymentOrder_checkoutKey_key" ON "PaymentOrder"("checkoutKey");
CREATE UNIQUE INDEX "PaymentOrder_checkoutToken_key" ON "PaymentOrder"("checkoutToken");
CREATE UNIQUE INDEX "PaymentOrder_streamPaymentLinkId_key" ON "PaymentOrder"("streamPaymentLinkId");
CREATE UNIQUE INDEX "PaymentOrder_streamInvoiceId_key" ON "PaymentOrder"("streamInvoiceId");
CREATE UNIQUE INDEX "PaymentOrder_streamPaymentId_key" ON "PaymentOrder"("streamPaymentId");
CREATE INDEX "PaymentOrder_buyerId_createdAt_idx" ON "PaymentOrder"("buyerId", "createdAt");
CREATE INDEX "PaymentOrder_status_expiresAt_idx" ON "PaymentOrder"("status", "expiresAt");

CREATE UNIQUE INDEX "PaymentProviderCustomer_provider_environment_userId_key"
  ON "PaymentProviderCustomer"("provider", "environment", "userId");
CREATE UNIQUE INDEX "PaymentProviderCustomer_provider_environment_providerCustomerId_key"
  ON "PaymentProviderCustomer"("provider", "environment", "providerCustomerId");

CREATE UNIQUE INDEX "PaymentRefund_providerRefundId_key" ON "PaymentRefund"("providerRefundId");
CREATE UNIQUE INDEX "PaymentRefund_bookingId_key" ON "PaymentRefund"("bookingId");
CREATE INDEX "PaymentRefund_paymentOrderId_requestedAt_idx" ON "PaymentRefund"("paymentOrderId", "requestedAt");
CREATE INDEX "PaymentRefund_status_requestedAt_idx" ON "PaymentRefund"("status", "requestedAt");

CREATE UNIQUE INDEX "StreamWebhookEvent_payloadHash_key" ON "StreamWebhookEvent"("payloadHash");
CREATE INDEX "StreamWebhookEvent_eventType_receivedAt_idx" ON "StreamWebhookEvent"("eventType", "receivedAt");
CREATE INDEX "StreamWebhookEvent_status_receivedAt_idx" ON "StreamWebhookEvent"("status", "receivedAt");
CREATE INDEX "StreamWebhookEvent_paymentOrderId_idx" ON "StreamWebhookEvent"("paymentOrderId");

CREATE INDEX "Booking_paymentOrderId_idx" ON "Booking"("paymentOrderId");

ALTER TABLE "PaymentOrder"
  ADD CONSTRAINT "PaymentOrder_buyerId_fkey"
  FOREIGN KEY ("buyerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "PaymentProviderCustomer"
  ADD CONSTRAINT "PaymentProviderCustomer_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "PaymentRefund"
  ADD CONSTRAINT "PaymentRefund_paymentOrderId_fkey"
  FOREIGN KEY ("paymentOrderId") REFERENCES "PaymentOrder"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "PaymentRefund"
  ADD CONSTRAINT "PaymentRefund_bookingId_fkey"
  FOREIGN KEY ("bookingId") REFERENCES "Booking"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "StreamWebhookEvent"
  ADD CONSTRAINT "StreamWebhookEvent_paymentOrderId_fkey"
  FOREIGN KEY ("paymentOrderId") REFERENCES "PaymentOrder"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "Booking"
  ADD CONSTRAINT "Booking_paymentOrderId_fkey"
  FOREIGN KEY ("paymentOrderId") REFERENCES "PaymentOrder"("id") ON DELETE SET NULL ON UPDATE CASCADE;
