-- AlterTable
ALTER TABLE "sects" ADD COLUMN "requestRegistrarEntryId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "sects_requestRegistrarEntryId_key" ON "sects"("requestRegistrarEntryId");

-- AddForeignKey
ALTER TABLE "sects" ADD CONSTRAINT "sects_requestRegistrarEntryId_fkey" FOREIGN KEY ("requestRegistrarEntryId") REFERENCES "registrar_entries"("id") ON DELETE SET NULL ON UPDATE CASCADE;
