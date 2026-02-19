-- Persist active tuned scene context for discovery transport state
ALTER TABLE "users"
ADD COLUMN "tunedSceneId" TEXT,
ADD COLUMN "tunedSceneUpdatedAt" TIMESTAMP(3);
