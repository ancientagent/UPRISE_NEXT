-- Store missing music-community requests as intake only.
-- These rows do not create selectable onboarding options or live Community records.
CREATE TABLE "music_community_requests" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "requestedName" TEXT NOT NULL,
    "requestedNameNormalized" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "cityNormalized" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "stateNormalized" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'submitted',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "music_community_requests_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "music_community_requests_userId_requestedNameNormalized_cityNormalized_stateNormalized_key"
    ON "music_community_requests"("userId", "requestedNameNormalized", "cityNormalized", "stateNormalized");

CREATE INDEX "music_community_requests_requestedNameNormalized_idx"
    ON "music_community_requests"("requestedNameNormalized");

CREATE INDEX "music_community_requests_requestedNameNormalized_cityNormalized_stateNormalized_idx"
    ON "music_community_requests"("requestedNameNormalized", "cityNormalized", "stateNormalized");

ALTER TABLE "music_community_requests"
    ADD CONSTRAINT "music_community_requests_userId_fkey"
    FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
