-- CreateTable
CREATE TABLE "user_music_community_preferences" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "musicCommunity" TEXT NOT NULL,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_music_community_preferences_pkey" PRIMARY KEY ("id")
);

-- Backfill the current single Home Scene music community as each user's default preference.
INSERT INTO "user_music_community_preferences" ("id", "userId", "musicCommunity", "isDefault", "createdAt", "updatedAt")
SELECT md5(random()::text || clock_timestamp()::text), "id", TRIM("homeSceneCommunity"), true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
FROM "users"
WHERE "homeSceneCommunity" IS NOT NULL
  AND TRIM("homeSceneCommunity") <> '';

-- CreateIndex
CREATE UNIQUE INDEX "user_music_community_preferences_userId_musicCommunity_key" ON "user_music_community_preferences"("userId", "musicCommunity");

-- CreateIndex
CREATE INDEX "user_music_community_preferences_userId_isDefault_idx" ON "user_music_community_preferences"("userId", "isDefault");

-- Keep a single explicit default preference per user while allowing users with no preferences.
CREATE UNIQUE INDEX "user_music_community_preferences_one_default_per_user_idx"
ON "user_music_community_preferences"("userId")
WHERE "isDefault" = true;

-- AddForeignKey
ALTER TABLE "user_music_community_preferences" ADD CONSTRAINT "user_music_community_preferences_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
