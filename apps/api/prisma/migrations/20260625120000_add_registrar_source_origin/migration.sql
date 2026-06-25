-- Preserve submitted natural source-origin tuples separately from active/proxy operating scenes.
ALTER TABLE "registrar_entries"
  ADD COLUMN "sourceOriginCity" TEXT,
  ADD COLUMN "sourceOriginState" TEXT,
  ADD COLUMN "sourceOriginMusicCommunity" TEXT;

ALTER TABLE "artist_bands"
  ADD COLUMN "sourceOriginCity" TEXT,
  ADD COLUMN "sourceOriginState" TEXT,
  ADD COLUMN "sourceOriginMusicCommunity" TEXT;

-- Existing records were authored before proxy/source-origin split, so seed their origin from the linked scene.
UPDATE "registrar_entries" AS re
SET
  "sourceOriginCity" = c."city",
  "sourceOriginState" = c."state",
  "sourceOriginMusicCommunity" = c."musicCommunity"
FROM "communities" AS c
WHERE re."sceneId" = c."id"
  AND re."type" = 'artist_band_registration'
  AND re."sourceOriginCity" IS NULL
  AND re."sourceOriginState" IS NULL
  AND re."sourceOriginMusicCommunity" IS NULL;

UPDATE "artist_bands" AS ab
SET
  "sourceOriginCity" = c."city",
  "sourceOriginState" = c."state",
  "sourceOriginMusicCommunity" = c."musicCommunity"
FROM "communities" AS c
WHERE ab."homeSceneId" = c."id"
  AND ab."sourceOriginCity" IS NULL
  AND ab."sourceOriginState" IS NULL
  AND ab."sourceOriginMusicCommunity" IS NULL;

CREATE INDEX "registrar_entries_sourceOriginCity_sourceOriginState_sourceOriginMusicCommunity_idx"
  ON "registrar_entries"("sourceOriginCity", "sourceOriginState", "sourceOriginMusicCommunity");

CREATE INDEX "artist_bands_sourceOriginCity_sourceOriginState_sourceOriginMusicCommunity_idx"
  ON "artist_bands"("sourceOriginCity", "sourceOriginState", "sourceOriginMusicCommunity");
