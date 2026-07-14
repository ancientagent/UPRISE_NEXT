-- CreateTable
CREATE TABLE "sects" (
    "id" TEXT NOT NULL,
    "parentCommunityId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sects_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "sects_parentCommunityId_slug_key" ON "sects"("parentCommunityId", "slug");

-- CreateIndex
CREATE INDEX "sects_parentCommunityId_idx" ON "sects"("parentCommunityId");

-- AddForeignKey
ALTER TABLE "sects" ADD CONSTRAINT "sects_parentCommunityId_fkey" FOREIGN KEY ("parentCommunityId") REFERENCES "communities"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
