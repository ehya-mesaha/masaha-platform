CREATE INDEX "Space_status_createdAt_idx" ON "Space"("status", "createdAt");
CREATE INDEX "Space_status_city_idx" ON "Space"("status", "city");
CREATE INDEX "Space_status_typeId_idx" ON "Space"("status", "typeId");
CREATE INDEX "Space_status_price_idx" ON "Space"("status", "price");
CREATE INDEX "SpaceImage_spaceId_order_idx" ON "SpaceImage"("spaceId", "order");
