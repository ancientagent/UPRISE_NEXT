-- Durable ownership and factual history for the internal, manually invoked Fair Play lifecycle seam.
CREATE TABLE "fair_play_lifecycle_leases" (
    "operationKey" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "currentRunId" TEXT NOT NULL,
    "leaseExpiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "fair_play_lifecycle_leases_pkey" PRIMARY KEY ("operationKey")
);

CREATE TABLE "fair_play_lifecycle_runs" (
    "id" TEXT NOT NULL,
    "operationKey" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "attemptId" TEXT NOT NULL,
    "mode" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "startedAt" TIMESTAMP(3) NOT NULL,
    "finishedAt" TIMESTAMP(3),
    "activeCityCommunityCount" INTEGER NOT NULL DEFAULT 0,
    "failedStepCount" INTEGER NOT NULL DEFAULT 0,
    "resultSummary" JSONB,
    "errorSummary" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "fair_play_lifecycle_runs_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "fair_play_lifecycle_leases_leaseExpiresAt_idx"
  ON "fair_play_lifecycle_leases"("leaseExpiresAt");

CREATE INDEX "fair_play_lifecycle_runs_operationKey_startedAt_idx"
  ON "fair_play_lifecycle_runs"("operationKey", "startedAt");

CREATE INDEX "fair_play_lifecycle_runs_status_startedAt_idx"
  ON "fair_play_lifecycle_runs"("status", "startedAt");
