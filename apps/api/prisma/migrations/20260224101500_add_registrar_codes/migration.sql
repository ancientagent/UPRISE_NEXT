-- Registrar capability-code persistence foundation (slice 89, additive-only)
-- Stores system-issued registrar capability codes tied to approved registrar entries.

CREATE TABLE "registrar_codes" (
    "id" TEXT NOT NULL,
    "registrarEntryId" TEXT NOT NULL,
    "capability" TEXT NOT NULL,
    "codeHash" TEXT NOT NULL,
    "issuerType" TEXT NOT NULL DEFAULT 'system',
    "status" TEXT NOT NULL DEFAULT 'issued',
    "expiresAt" TIMESTAMP(3),
    "redeemedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "registrar_codes_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "registrar_codes_codeHash_key"
ON "registrar_codes"("codeHash");

CREATE INDEX "registrar_codes_registrarEntryId_status_idx"
ON "registrar_codes"("registrarEntryId", "status");

CREATE INDEX "registrar_codes_capability_status_idx"
ON "registrar_codes"("capability", "status");

ALTER TABLE "registrar_codes" ADD CONSTRAINT "registrar_codes_registrarEntryId_fkey"
FOREIGN KEY ("registrarEntryId") REFERENCES "registrar_entries"("id") ON DELETE CASCADE ON UPDATE CASCADE;
