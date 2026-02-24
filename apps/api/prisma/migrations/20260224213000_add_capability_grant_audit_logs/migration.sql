-- Capability grant audit persistence (slice 97, additive-only)
-- Stores traceable capability issuance/redemption/grant events for registrar-linked flows.

CREATE TABLE "capability_grant_audit_logs" (
    "id" TEXT NOT NULL,
    "capability" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "actorType" TEXT NOT NULL DEFAULT 'system',
    "targetUserId" TEXT,
    "actorUserId" TEXT,
    "registrarEntryId" TEXT,
    "registrarCodeId" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "capability_grant_audit_logs_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "capability_grant_audit_logs_capability_action_createdAt_idx"
ON "capability_grant_audit_logs"("capability", "action", "createdAt");

CREATE INDEX "capability_grant_audit_logs_registrarEntryId_createdAt_idx"
ON "capability_grant_audit_logs"("registrarEntryId", "createdAt");

CREATE INDEX "capability_grant_audit_logs_targetUserId_createdAt_idx"
ON "capability_grant_audit_logs"("targetUserId", "createdAt");

ALTER TABLE "capability_grant_audit_logs" ADD CONSTRAINT "capability_grant_audit_logs_targetUserId_fkey"
FOREIGN KEY ("targetUserId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "capability_grant_audit_logs" ADD CONSTRAINT "capability_grant_audit_logs_actorUserId_fkey"
FOREIGN KEY ("actorUserId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "capability_grant_audit_logs" ADD CONSTRAINT "capability_grant_audit_logs_registrarEntryId_fkey"
FOREIGN KEY ("registrarEntryId") REFERENCES "registrar_entries"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "capability_grant_audit_logs" ADD CONSTRAINT "capability_grant_audit_logs_registrarCodeId_fkey"
FOREIGN KEY ("registrarCodeId") REFERENCES "registrar_codes"("id") ON DELETE SET NULL ON UPDATE CASCADE;
