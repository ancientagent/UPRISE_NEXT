-- Canonical Artist/Band identity model (slice 1, additive-only)
-- Transitional compatibility: retains users.isArtist for existing callers.

CREATE TABLE "artist_bands" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "entityType" TEXT NOT NULL DEFAULT 'artist',
    "registrarEntryRef" TEXT,
    "homeSceneId" TEXT,
    "createdById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "artist_bands_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "artist_band_members" (
    "id" TEXT NOT NULL,
    "artistBandId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'manager',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "artist_band_members_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "artist_bands_slug_key" ON "artist_bands"("slug");
CREATE INDEX "artist_bands_homeSceneId_idx" ON "artist_bands"("homeSceneId");
CREATE INDEX "artist_bands_createdById_idx" ON "artist_bands"("createdById");

CREATE UNIQUE INDEX "artist_band_members_artistBandId_userId_key" ON "artist_band_members"("artistBandId", "userId");
CREATE INDEX "artist_band_members_userId_idx" ON "artist_band_members"("userId");

ALTER TABLE "artist_bands" ADD CONSTRAINT "artist_bands_createdById_fkey"
FOREIGN KEY ("createdById") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "artist_bands" ADD CONSTRAINT "artist_bands_homeSceneId_fkey"
FOREIGN KEY ("homeSceneId") REFERENCES "communities"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "artist_band_members" ADD CONSTRAINT "artist_band_members_artistBandId_fkey"
FOREIGN KEY ("artistBandId") REFERENCES "artist_bands"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "artist_band_members" ADD CONSTRAINT "artist_band_members_userId_fkey"
FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
