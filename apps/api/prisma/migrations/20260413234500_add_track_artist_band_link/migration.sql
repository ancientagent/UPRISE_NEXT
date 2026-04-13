-- Add explicit optional artist-band linkage for track ownership hardening.
-- New source-side releases can now attach directly to a managed Artist/Band entity
-- while older inferred tracks remain compatible.

ALTER TABLE "tracks"
ADD COLUMN "artistBandId" TEXT;

CREATE INDEX "tracks_artistBandId_idx"
ON "tracks"("artistBandId");

ALTER TABLE "tracks" ADD CONSTRAINT "tracks_artistBandId_fkey"
FOREIGN KEY ("artistBandId") REFERENCES "artist_bands"("id") ON DELETE SET NULL ON UPDATE CASCADE;
