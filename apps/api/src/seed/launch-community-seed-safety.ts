export interface LaunchCommunitySeedTarget {
  databaseName: string;
  host: string;
  isLocal: boolean;
  expectedConfirmation: string;
}

const LOCAL_DATABASE_HOSTS = new Set(['localhost', '127.0.0.1', '::1']);

export function resolveLaunchCommunitySeedTarget(rawDatabaseUrl: string | undefined): LaunchCommunitySeedTarget {
  if (!rawDatabaseUrl) {
    throw new Error('DATABASE_URL is required before running the launch community seed.');
  }

  let parsed: URL;
  try {
    parsed = new URL(rawDatabaseUrl);
  } catch {
    throw new Error('DATABASE_URL must be a valid PostgreSQL connection URL.');
  }

  if (!['postgres:', 'postgresql:'].includes(parsed.protocol)) {
    throw new Error('DATABASE_URL must use the postgres:// or postgresql:// protocol.');
  }

  const databaseName = decodeURIComponent(parsed.pathname.replace(/^\//, '').split('?')[0]);
  if (!databaseName) {
    throw new Error('DATABASE_URL must include a database name before running the launch community seed.');
  }

  const host = parsed.hostname;
  const isLocal = LOCAL_DATABASE_HOSTS.has(host);

  return {
    databaseName,
    host,
    isLocal,
    expectedConfirmation: `seed-launch-communities:${databaseName}`,
  };
}

export function assertLaunchCommunitySeedTargetAllowed(
  env: Pick<NodeJS.ProcessEnv, 'DATABASE_URL' | 'UPRISE_CONFIRM_LAUNCH_COMMUNITY_SEED'>
): LaunchCommunitySeedTarget {
  const target = resolveLaunchCommunitySeedTarget(env.DATABASE_URL);

  if (target.isLocal) {
    return target;
  }

  if (env.UPRISE_CONFIRM_LAUNCH_COMMUNITY_SEED !== target.expectedConfirmation) {
    throw new Error(
      [
        `Refusing to run launch community seed against non-local database ${target.databaseName} on ${target.host}.`,
        `Set UPRISE_CONFIRM_LAUNCH_COMMUNITY_SEED=${target.expectedConfirmation} only after confirming this is the intended target.`,
        'Use pnpm --filter api run seed:launch-communities:dry-run first to inspect the planned matrix without database writes.',
      ].join(' ')
    );
  }

  return target;
}
