-- Add explicit optional artist-band linkage for source-owned event writes.
-- Print Shop events created from a managed source can now attach directly
-- to that source while older creator-owned events remain compatible.

ALTER TABLE "events"
ADD COLUMN "artistBandId" TEXT;

CREATE INDEX "events_artistBandId_idx"
ON "events"("artistBandId");

ALTER TABLE "events" ADD CONSTRAINT "events_artistBandId_fkey"
FOREIGN KEY ("artistBandId") REFERENCES "artist_bands"("id") ON DELETE SET NULL ON UPDATE CASCADE;
