-- Registrar artist registration member capture (slice 3, additive-only)
-- Stores requested band-member details and invite delivery status for non-platform users.

CREATE TABLE "registrar_artist_members" (
    "id" TEXT NOT NULL,
    "registrarEntryId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "instrument" TEXT NOT NULL,
    "existingUserId" TEXT,
    "inviteStatus" TEXT NOT NULL DEFAULT 'pending_email',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "registrar_artist_members_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "registrar_artist_members_registrarEntryId_email_key"
ON "registrar_artist_members"("registrarEntryId", "email");

CREATE INDEX "registrar_artist_members_email_idx"
ON "registrar_artist_members"("email");

CREATE INDEX "registrar_artist_members_existingUserId_idx"
ON "registrar_artist_members"("existingUserId");

ALTER TABLE "registrar_artist_members" ADD CONSTRAINT "registrar_artist_members_registrarEntryId_fkey"
FOREIGN KEY ("registrarEntryId") REFERENCES "registrar_entries"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "registrar_artist_members" ADD CONSTRAINT "registrar_artist_members_existingUserId_fkey"
FOREIGN KEY ("existingUserId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
