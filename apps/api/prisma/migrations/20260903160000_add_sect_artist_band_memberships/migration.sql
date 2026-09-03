-- CreateTable
CREATE TABLE "sect_artist_band_memberships" (
    "id" TEXT NOT NULL,
    "sectId" TEXT NOT NULL,
    "artistBandId" TEXT NOT NULL,
    "createdById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sect_artist_band_memberships_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "sect_artist_band_memberships_sectId_artistBandId_key" ON "sect_artist_band_memberships"("sectId", "artistBandId");

-- CreateIndex
CREATE INDEX "sect_artist_band_memberships_artistBandId_idx" ON "sect_artist_band_memberships"("artistBandId");

-- CreateIndex
CREATE INDEX "sect_artist_band_memberships_createdById_idx" ON "sect_artist_band_memberships"("createdById");

-- AddForeignKey
ALTER TABLE "sect_artist_band_memberships" ADD CONSTRAINT "sect_artist_band_memberships_sectId_fkey" FOREIGN KEY ("sectId") REFERENCES "sects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sect_artist_band_memberships" ADD CONSTRAINT "sect_artist_band_memberships_artistBandId_fkey" FOREIGN KEY ("artistBandId") REFERENCES "artist_bands"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sect_artist_band_memberships" ADD CONSTRAINT "sect_artist_band_memberships_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
