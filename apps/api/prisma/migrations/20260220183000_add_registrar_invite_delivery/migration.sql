-- Registrar invite dispatch primitives (slice 5, additive-only)

ALTER TABLE "registrar_artist_members"
ADD COLUMN "claimedUserId" TEXT,
ADD COLUMN "inviteToken" TEXT,
ADD COLUMN "inviteTokenExpiresAt" TIMESTAMP(3);

CREATE UNIQUE INDEX "registrar_artist_members_inviteToken_key"
ON "registrar_artist_members"("inviteToken");

CREATE INDEX "registrar_artist_members_claimedUserId_idx"
ON "registrar_artist_members"("claimedUserId");

CREATE TABLE "registrar_invite_deliveries" (
    "id" TEXT NOT NULL,
    "registrarArtistMemberId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'queued',
    "payload" JSONB NOT NULL,
    "dispatchedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "registrar_invite_deliveries_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "registrar_invite_deliveries_registrarArtistMemberId_key"
ON "registrar_invite_deliveries"("registrarArtistMemberId");

CREATE INDEX "registrar_invite_deliveries_status_createdAt_idx"
ON "registrar_invite_deliveries"("status", "createdAt");

ALTER TABLE "registrar_artist_members" ADD CONSTRAINT "registrar_artist_members_claimedUserId_fkey"
FOREIGN KEY ("claimedUserId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "registrar_invite_deliveries" ADD CONSTRAINT "registrar_invite_deliveries_registrarArtistMemberId_fkey"
FOREIGN KEY ("registrarArtistMemberId") REFERENCES "registrar_artist_members"("id") ON DELETE CASCADE ON UPDATE CASCADE;
