-- Preserve the founder-locked fixed new-release window on each ingested rotation entry.
ALTER TABLE "rotation_entries"
  ADD COLUMN "newWindowDays" INTEGER NOT NULL DEFAULT 10;
