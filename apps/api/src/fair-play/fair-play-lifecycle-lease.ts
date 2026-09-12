export const FAIR_PLAY_LIFECYCLE_OPERATION_KEY = 'fair-play-city-tier-lifecycle';

export type FairPlayLifecycleLeaseContext = {
  ownerId: string;
  runId: string;
};

type LeaseRow = { operationKey: string };

type LeaseQueryClient = {
  $queryRaw: <T>(query: TemplateStringsArray, ...values: unknown[]) => Promise<T>;
};

export class FairPlayLifecycleLeaseLostError extends Error {
  constructor() {
    super('Fair Play lifecycle lease was absent, expired, or reclaimed before mutation.');
    this.name = 'FairPlayLifecycleLeaseLostError';
  }
}

/**
 * Refreshes only the exact current owner/run within the caller's transaction.
 * The update locks the lease row until that transaction closes, preventing a
 * concurrent expired-lease claimant from running alongside its mutations.
 */
export async function assertFairPlayLifecycleLease(
  client: LeaseQueryClient,
  context?: FairPlayLifecycleLeaseContext,
) {
  if (!context) return;

  const rows = await client.$queryRaw<LeaseRow[]>`
    UPDATE "fair_play_lifecycle_leases"
    SET
      "leaseExpiresAt" = CURRENT_TIMESTAMP + INTERVAL '5 minutes',
      "updatedAt" = CURRENT_TIMESTAMP
    WHERE
      "operationKey" = ${FAIR_PLAY_LIFECYCLE_OPERATION_KEY}
      AND "ownerId" = ${context.ownerId}
      AND "currentRunId" = ${context.runId}
      AND "leaseExpiresAt" > CURRENT_TIMESTAMP
    RETURNING "operationKey";
  `;

  if (rows.length !== 1) {
    throw new FairPlayLifecycleLeaseLostError();
  }
}
