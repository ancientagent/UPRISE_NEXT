-- User capability-grant persistence (slice 96, additive-only)
-- Tracks additive capabilities granted via registrar code redemption.

CREATE TABLE "user_capability_grants" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "capability" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'active',
    "sourceRegistrarEntryId" TEXT,
    "sourceRegistrarCodeId" TEXT,
    "grantedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "revokedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_capability_grants_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "user_capability_grants_userId_capability_key"
ON "user_capability_grants"("userId", "capability");

CREATE INDEX "user_capability_grants_capability_status_idx"
ON "user_capability_grants"("capability", "status");

CREATE INDEX "user_capability_grants_sourceRegistrarEntryId_idx"
ON "user_capability_grants"("sourceRegistrarEntryId");

CREATE INDEX "user_capability_grants_sourceRegistrarCodeId_idx"
ON "user_capability_grants"("sourceRegistrarCodeId");

ALTER TABLE "user_capability_grants" ADD CONSTRAINT "user_capability_grants_userId_fkey"
FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "user_capability_grants" ADD CONSTRAINT "user_capability_grants_sourceRegistrarEntryId_fkey"
FOREIGN KEY ("sourceRegistrarEntryId") REFERENCES "registrar_entries"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "user_capability_grants" ADD CONSTRAINT "user_capability_grants_sourceRegistrarCodeId_fkey"
FOREIGN KEY ("sourceRegistrarCodeId") REFERENCES "registrar_codes"("id") ON DELETE SET NULL ON UPDATE CASCADE;
