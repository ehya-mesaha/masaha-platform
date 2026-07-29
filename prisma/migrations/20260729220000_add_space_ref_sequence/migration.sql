-- Every space gets a small, permanent, sequential reference number (refSeq),
-- displayed everywhere as a short human-friendly "space number" (see formatSpaceNumber()).
-- SERIAL auto-backfills existing rows in insertion order and assigns new ones on insert,
-- so no manual backfill script is needed.
ALTER TABLE "Space" ADD COLUMN IF NOT EXISTS "refSeq" SERIAL;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'Space_refSeq_key'
  ) THEN
    ALTER TABLE "Space" ADD CONSTRAINT "Space_refSeq_key" UNIQUE ("refSeq");
  END IF;
END $$;
