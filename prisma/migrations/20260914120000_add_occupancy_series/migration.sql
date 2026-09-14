-- A private occupancy or a temporary closure can now be created as a repeating programme
-- ("every Sunday and Tuesday for three months"). Each occurrence stays its own row, so
-- conflict checks and availability keep working unchanged, and `seriesId` is what ties the
-- rows together for listing and for deleting the whole programme in one action.
ALTER TABLE "PrivateOccupancy" ADD COLUMN "seriesId" TEXT;
ALTER TABLE "TemporaryClosure" ADD COLUMN "seriesId" TEXT;

CREATE INDEX "PrivateOccupancy_seriesId_idx" ON "PrivateOccupancy"("seriesId");
CREATE INDEX "TemporaryClosure_seriesId_idx" ON "TemporaryClosure"("seriesId");
