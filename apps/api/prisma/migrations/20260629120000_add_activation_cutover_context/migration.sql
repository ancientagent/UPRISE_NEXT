-- Persist proxy-to-natural activation cutover context without overloading signal collections.
CREATE TABLE "user_saved_scenes" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "communityId" TEXT NOT NULL,
    "reason" TEXT NOT NULL DEFAULT 'former_proxy_cutover',
    "context" JSONB,
    "savedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_saved_scenes_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "user_activation_notices" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "fromSceneId" TEXT,
    "toSceneId" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "musicCommunity" TEXT NOT NULL,
    "reason" TEXT NOT NULL DEFAULT 'natural_home_scene_activated',
    "status" TEXT NOT NULL DEFAULT 'unread',
    "message" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "readAt" TIMESTAMP(3),

    CONSTRAINT "user_activation_notices_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "community_activation_audits" (
    "id" TEXT NOT NULL,
    "sceneId" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "musicCommunity" TEXT NOT NULL,
    "createdScene" BOOLEAN NOT NULL,
    "reanchoredSourceIds" JSONB NOT NULL,
    "cutoverListenerIds" JSONB NOT NULL,
    "savedAwaySceneCount" INTEGER NOT NULL DEFAULT 0,
    "activationNoticeCount" INTEGER NOT NULL DEFAULT 0,
    "thresholds" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "community_activation_audits_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "user_saved_scenes_userId_communityId_reason_key"
    ON "user_saved_scenes"("userId", "communityId", "reason");

CREATE INDEX "user_saved_scenes_userId_savedAt_idx"
    ON "user_saved_scenes"("userId", "savedAt");

CREATE INDEX "user_saved_scenes_communityId_idx"
    ON "user_saved_scenes"("communityId");

CREATE UNIQUE INDEX "user_activation_notices_userId_toSceneId_reason_key"
    ON "user_activation_notices"("userId", "toSceneId", "reason");

CREATE INDEX "user_activation_notices_userId_status_createdAt_idx"
    ON "user_activation_notices"("userId", "status", "createdAt");

CREATE INDEX "user_activation_notices_toSceneId_idx"
    ON "user_activation_notices"("toSceneId");

CREATE INDEX "user_activation_notices_fromSceneId_idx"
    ON "user_activation_notices"("fromSceneId");

CREATE INDEX "community_activation_audits_sceneId_createdAt_idx"
    ON "community_activation_audits"("sceneId", "createdAt");

CREATE INDEX "community_activation_audits_city_state_musicCommunity_idx"
    ON "community_activation_audits"("city", "state", "musicCommunity");

ALTER TABLE "user_saved_scenes"
    ADD CONSTRAINT "user_saved_scenes_userId_fkey"
    FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "user_saved_scenes"
    ADD CONSTRAINT "user_saved_scenes_communityId_fkey"
    FOREIGN KEY ("communityId") REFERENCES "communities"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "user_activation_notices"
    ADD CONSTRAINT "user_activation_notices_userId_fkey"
    FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "user_activation_notices"
    ADD CONSTRAINT "user_activation_notices_fromSceneId_fkey"
    FOREIGN KEY ("fromSceneId") REFERENCES "communities"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "user_activation_notices"
    ADD CONSTRAINT "user_activation_notices_toSceneId_fkey"
    FOREIGN KEY ("toSceneId") REFERENCES "communities"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "community_activation_audits"
    ADD CONSTRAINT "community_activation_audits_sceneId_fkey"
    FOREIGN KEY ("sceneId") REFERENCES "communities"("id") ON DELETE CASCADE ON UPDATE CASCADE;
