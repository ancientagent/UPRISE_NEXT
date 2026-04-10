-- CreateEnum
CREATE TYPE "RotationPool" AS ENUM ('NEW_RELEASES', 'MAIN_ROTATION');

-- CreateTable
CREATE TABLE "rotation_entries" (
    "id" TEXT NOT NULL,
    "trackId" TEXT NOT NULL,
    "sceneId" TEXT NOT NULL,
    "pool" "RotationPool" NOT NULL,
    "enteredPoolAt" TIMESTAMP(3) NOT NULL,
    "lastPlayedAt" TIMESTAMP(3),
    "recurrenceScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "graduatedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "rotation_entries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "track_votes" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "trackId" TEXT NOT NULL,
    "sceneId" TEXT NOT NULL,
    "tier" TEXT NOT NULL,
    "playbackSessionId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "track_votes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "fair_play_config" (
    "id" TEXT NOT NULL,
    "scope" TEXT NOT NULL DEFAULT 'global',
    "recurrenceReorderHours" INTEGER,
    "recurrenceRollingWindowDays" INTEGER,
    "bandPersistDays" INTEGER,
    "newWindowBandLowMaxActive" INTEGER,
    "newWindowBandLowDays" INTEGER,
    "newWindowBandMidMinActive" INTEGER,
    "newWindowBandMidMaxActive" INTEGER,
    "newWindowBandMidDays" INTEGER,
    "newWindowBandHighMinActive" INTEGER,
    "newWindowBandHighDays" INTEGER,
    "graduationMinAgeDays" INTEGER,
    "graduationExecutionCadenceDays" INTEGER,
    "graduationCapPerRun" INTEGER,
    "propagationMinUniqueListeners" INTEGER,
    "propagationRateThreshold" DOUBLE PRECISION,
    "propagationConfidenceGate" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "fair_play_config_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "rotation_entries_sceneId_pool_recurrenceScore_idx" ON "rotation_entries"("sceneId", "pool", "recurrenceScore");
CREATE INDEX "rotation_entries_pool_enteredPoolAt_idx" ON "rotation_entries"("pool", "enteredPoolAt");
CREATE UNIQUE INDEX "rotation_entries_trackId_sceneId_key" ON "rotation_entries"("trackId", "sceneId");
CREATE INDEX "track_votes_sceneId_tier_createdAt_idx" ON "track_votes"("sceneId", "tier", "createdAt");
CREATE UNIQUE INDEX "track_votes_userId_trackId_sceneId_tier_key" ON "track_votes"("userId", "trackId", "sceneId", "tier");
CREATE UNIQUE INDEX "fair_play_config_scope_key" ON "fair_play_config"("scope");

-- AddForeignKey
ALTER TABLE "rotation_entries" ADD CONSTRAINT "rotation_entries_trackId_fkey" FOREIGN KEY ("trackId") REFERENCES "tracks"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "rotation_entries" ADD CONSTRAINT "rotation_entries_sceneId_fkey" FOREIGN KEY ("sceneId") REFERENCES "communities"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "track_votes" ADD CONSTRAINT "track_votes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "track_votes" ADD CONSTRAINT "track_votes_trackId_fkey" FOREIGN KEY ("trackId") REFERENCES "tracks"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "track_votes" ADD CONSTRAINT "track_votes_sceneId_fkey" FOREIGN KEY ("sceneId") REFERENCES "communities"("id") ON DELETE CASCADE ON UPDATE CASCADE;
