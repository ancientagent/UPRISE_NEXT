import {
  assertLaunchCommunitySeedTargetAllowed,
  resolveLaunchCommunitySeedTarget,
} from '../src/seed/launch-community-seed-safety';

describe('launch community seed target safety', () => {
  it('allows local PostgreSQL targets without explicit confirmation', () => {
    const target = assertLaunchCommunitySeedTargetAllowed({
      DATABASE_URL: 'postgresql://uprise:uprise_dev_password@localhost:5432/uprise_dev',
    });

    expect(target).toEqual({
      databaseName: 'uprise_dev',
      host: 'localhost',
      isLocal: true,
      expectedConfirmation: 'seed-launch-communities:uprise_dev',
    });
  });

  it('requires explicit database-name confirmation for remote targets', () => {
    expect(() =>
      assertLaunchCommunitySeedTargetAllowed({
        DATABASE_URL: 'postgresql://user:pass@ep-example.us-east-1.aws.neon.tech/uprise_staging',
      })
    ).toThrow(
      'Set UPRISE_CONFIRM_LAUNCH_COMMUNITY_SEED=seed-launch-communities:uprise_staging'
    );
  });

  it('allows remote targets only when confirmation matches the database name', () => {
    const target = assertLaunchCommunitySeedTargetAllowed({
      DATABASE_URL: 'postgresql://user:pass@ep-example.us-east-1.aws.neon.tech/uprise_staging',
      UPRISE_CONFIRM_LAUNCH_COMMUNITY_SEED: 'seed-launch-communities:uprise_staging',
    });

    expect(target.isLocal).toBe(false);
    expect(target.databaseName).toBe('uprise_staging');
    expect(target.expectedConfirmation).toBe('seed-launch-communities:uprise_staging');
  });

  it('rejects missing or invalid database URLs before Prisma connects', () => {
    expect(() => resolveLaunchCommunitySeedTarget(undefined)).toThrow('DATABASE_URL is required');
    expect(() => resolveLaunchCommunitySeedTarget('not-a-url')).toThrow('valid PostgreSQL connection URL');
    expect(() => resolveLaunchCommunitySeedTarget('mysql://user:pass@example.com/db')).toThrow(
      'postgres:// or postgresql://'
    );
    expect(() => resolveLaunchCommunitySeedTarget('postgresql://user:pass@example.com')).toThrow(
      'database name'
    );
  });
});
