-- CreateTable
CREATE TABLE "release_deck_schedules" (
    "id" TEXT NOT NULL,
    "trackId" TEXT NOT NULL,
    "communityId" TEXT NOT NULL,
    "artistBandId" TEXT NOT NULL,
    "scheduledFor" TIMESTAMP(3) NOT NULL,
    "assignmentMode" TEXT NOT NULL,
    "requestedFor" TIMESTAMP(3),
    "status" TEXT NOT NULL DEFAULT 'scheduled',
    "capacitySnapshot" JSONB,
    "createdById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "release_deck_schedules_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "release_deck_schedules_trackId_key" ON "release_deck_schedules"("trackId");

-- CreateIndex
CREATE INDEX "release_deck_schedules_communityId_scheduledFor_status_idx" ON "release_deck_schedules"("communityId", "scheduledFor", "status");

-- CreateIndex
CREATE INDEX "release_deck_schedules_artistBandId_communityId_status_idx" ON "release_deck_schedules"("artistBandId", "communityId", "status");

-- AddForeignKey
ALTER TABLE "release_deck_schedules" ADD CONSTRAINT "release_deck_schedules_trackId_fkey" FOREIGN KEY ("trackId") REFERENCES "tracks"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "release_deck_schedules" ADD CONSTRAINT "release_deck_schedules_communityId_fkey" FOREIGN KEY ("communityId") REFERENCES "communities"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "release_deck_schedules" ADD CONSTRAINT "release_deck_schedules_artistBandId_fkey" FOREIGN KEY ("artistBandId") REFERENCES "artist_bands"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "release_deck_schedules" ADD CONSTRAINT "release_deck_schedules_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
