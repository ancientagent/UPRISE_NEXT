-- AlterTable
ALTER TABLE "users" ADD COLUMN "homeSceneId" TEXT;

-- CreateIndex
CREATE INDEX "users_homeSceneId_idx" ON "users"("homeSceneId");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_homeSceneId_fkey" FOREIGN KEY ("homeSceneId") REFERENCES "communities"("id") ON DELETE SET NULL ON UPDATE CASCADE;
