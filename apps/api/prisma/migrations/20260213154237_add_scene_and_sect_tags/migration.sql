-- AlterTable
ALTER TABLE "communities" ADD COLUMN     "city" TEXT,
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "musicCommunity" TEXT,
ADD COLUMN     "state" TEXT,
ADD COLUMN     "tier" TEXT NOT NULL DEFAULT 'city';

-- CreateTable
CREATE TABLE "sect_tags" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'active',
    "parentCommunityId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sect_tags_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_tags" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "sectTagId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_tags_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "sect_tags_name_parentCommunityId_key" ON "sect_tags"("name", "parentCommunityId");

-- CreateIndex
CREATE UNIQUE INDEX "user_tags_userId_sectTagId_key" ON "user_tags"("userId", "sectTagId");

-- AddForeignKey
ALTER TABLE "sect_tags" ADD CONSTRAINT "sect_tags_parentCommunityId_fkey" FOREIGN KEY ("parentCommunityId") REFERENCES "communities"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_tags" ADD CONSTRAINT "user_tags_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_tags" ADD CONSTRAINT "user_tags_sectTagId_fkey" FOREIGN KEY ("sectTagId") REFERENCES "sect_tags"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

