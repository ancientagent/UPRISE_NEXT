-- AlterTable
ALTER TABLE "users"
ADD COLUMN     "homeSceneCity" TEXT,
ADD COLUMN     "homeSceneState" TEXT,
ADD COLUMN     "homeSceneCommunity" TEXT,
ADD COLUMN     "homeSceneTag" TEXT,
ADD COLUMN     "gpsVerified" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "track_engagements" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "trackId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "score" INTEGER NOT NULL,
    "sessionId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "track_engagements_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "track_engagements_userId_trackId_sessionId_key" ON "track_engagements"("userId", "trackId", "sessionId");
CREATE INDEX "track_engagements_trackId_createdAt_idx" ON "track_engagements"("trackId", "createdAt");

-- AddForeignKey
ALTER TABLE "track_engagements" ADD CONSTRAINT "track_engagements_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "track_engagements" ADD CONSTRAINT "track_engagements_trackId_fkey" FOREIGN KEY ("trackId") REFERENCES "tracks"("id") ON DELETE CASCADE ON UPDATE CASCADE;

