-- Registrar write primitives (slice 2, additive-only)
-- Enables scene-bound Artist/Band registration submissions.

CREATE TABLE "registrar_entries" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'submitted',
    "sceneId" TEXT NOT NULL,
    "createdById" TEXT NOT NULL,
    "artistBandId" TEXT,
    "payload" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "registrar_entries_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "registrar_entries_sceneId_type_status_idx" ON "registrar_entries"("sceneId", "type", "status");
CREATE INDEX "registrar_entries_createdById_createdAt_idx" ON "registrar_entries"("createdById", "createdAt");
CREATE INDEX "registrar_entries_artistBandId_idx" ON "registrar_entries"("artistBandId");

ALTER TABLE "registrar_entries" ADD CONSTRAINT "registrar_entries_sceneId_fkey"
FOREIGN KEY ("sceneId") REFERENCES "communities"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "registrar_entries" ADD CONSTRAINT "registrar_entries_createdById_fkey"
FOREIGN KEY ("createdById") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "registrar_entries" ADD CONSTRAINT "registrar_entries_artistBandId_fkey"
FOREIGN KEY ("artistBandId") REFERENCES "artist_bands"("id") ON DELETE SET NULL ON UPDATE CASCADE;
