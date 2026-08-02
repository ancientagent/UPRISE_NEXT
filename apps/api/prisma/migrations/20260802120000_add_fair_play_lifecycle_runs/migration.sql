-- CreateTable
CREATE TABLE "fair_play_lifecycle_runs" (
    "id" TEXT NOT NULL,
    "jobType" TEXT NOT NULL,
    "communityId" TEXT NOT NULL,
    "cadenceBucket" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'leased',
    "attemptCount" INTEGER NOT NULL DEFAULT 1,
    "workerId" TEXT NOT NULL,
    "leaseToken" TEXT NOT NULL,
    "claimedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "leaseExpiresAt" TIMESTAMP(3) NOT NULL,
    "completedAt" TIMESTAMP(3),
    "failedAt" TIMESTAMP(3),
    "resultSummary" JSONB,
    "errorSummary" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "fair_play_lifecycle_runs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "fair_play_lifecycle_runs_jobType_communityId_cadenceBucket_key" ON "fair_play_lifecycle_runs"("jobType", "communityId", "cadenceBucket");
CREATE INDEX "fair_play_lifecycle_runs_status_leaseExpiresAt_idx" ON "fair_play_lifecycle_runs"("status", "leaseExpiresAt");
CREATE INDEX "fair_play_lifecycle_runs_communityId_jobType_status_completedAt_idx" ON "fair_play_lifecycle_runs"("communityId", "jobType", "status", "completedAt");

-- AddForeignKey
ALTER TABLE "fair_play_lifecycle_runs" ADD CONSTRAINT "fair_play_lifecycle_runs_communityId_fkey" FOREIGN KEY ("communityId") REFERENCES "communities"("id") ON DELETE CASCADE ON UPDATE CASCADE;
