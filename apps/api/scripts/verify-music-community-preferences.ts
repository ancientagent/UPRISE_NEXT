import 'dotenv/config';
import { Prisma, PrismaClient } from '@prisma/client';

const LOCAL_DATABASE_HOSTS = new Set(['localhost', '127.0.0.1', '::1']);
const SAMPLE_LIMIT = 50;

interface DatabaseTarget {
  databaseName: string;
  host: string;
  isLocal: boolean;
}

interface CountRow {
  count: number | string | bigint;
}

interface IssueRow {
  userId: string;
  email: string | null;
  username: string | null;
  homeSceneCity?: string | null;
  homeSceneState?: string | null;
  homeSceneCommunity?: string | null;
  defaultMusicCommunity?: string | null;
  defaultCount?: number | string | bigint;
  musicCommunities?: string[] | null;
}

function resolveDatabaseTarget(rawDatabaseUrl: string | undefined): DatabaseTarget {
  if (!rawDatabaseUrl) {
    throw new Error('DATABASE_URL is required before running the music-community preference audit.');
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
    throw new Error('DATABASE_URL must include a database name before running the audit.');
  }

  return {
    databaseName,
    host: parsed.hostname,
    isLocal: LOCAL_DATABASE_HOSTS.has(parsed.hostname),
  };
}

function normalizeCount(value: number | string | bigint | undefined): number {
  if (typeof value === 'bigint') return Number(value);
  if (typeof value === 'string') return Number(value);
  return value ?? 0;
}

function normalizeIssueRows(rows: IssueRow[]) {
  return rows.map((row) => ({
    ...row,
    defaultCount: normalizeCount(row.defaultCount),
  }));
}

async function countFirst(prisma: PrismaClient, query: Prisma.Sql) {
  const rows = await prisma.$queryRaw<CountRow[]>(query);
  return normalizeCount(rows[0]?.count);
}

async function main() {
  const target = resolveDatabaseTarget(process.env.DATABASE_URL);
  const reportOnly = process.env.UPRISE_PREFERENCE_AUDIT_REPORT_ONLY === '1';
  const prisma = new PrismaClient();

  try {
    const [
      totalUsers,
      usersWithHomeTuple,
      usersWithDefaultPreference,
      usersWithMultipleDefaults,
      usersMissingDefaultPreference,
      usersWithCompatibilityMismatch,
    ] = await Promise.all([
      countFirst(prisma, Prisma.sql`SELECT COUNT(*) AS count FROM users`),
      countFirst(
        prisma,
        Prisma.sql`
          SELECT COUNT(*) AS count
          FROM users
          WHERE "homeSceneCity" IS NOT NULL
            AND "homeSceneState" IS NOT NULL
            AND "homeSceneCommunity" IS NOT NULL
        `,
      ),
      countFirst(
        prisma,
        Prisma.sql`
          SELECT COUNT(DISTINCT "userId") AS count
          FROM user_music_community_preferences
          WHERE "isDefault" = true
        `,
      ),
      countFirst(
        prisma,
        Prisma.sql`
          SELECT COUNT(*) AS count
          FROM (
            SELECT "userId"
            FROM user_music_community_preferences
            WHERE "isDefault" = true
            GROUP BY "userId"
            HAVING COUNT(*) > 1
          ) defaults
        `,
      ),
      countFirst(
        prisma,
        Prisma.sql`
          SELECT COUNT(*) AS count
          FROM users u
          WHERE u."homeSceneCity" IS NOT NULL
            AND u."homeSceneState" IS NOT NULL
            AND u."homeSceneCommunity" IS NOT NULL
            AND NOT EXISTS (
              SELECT 1
              FROM user_music_community_preferences p
              WHERE p."userId" = u.id
                AND p."isDefault" = true
            )
        `,
      ),
      countFirst(
        prisma,
        Prisma.sql`
          SELECT COUNT(*) AS count
          FROM users u
          JOIN user_music_community_preferences p
            ON p."userId" = u.id
           AND p."isDefault" = true
          WHERE u."homeSceneCommunity" IS NOT NULL
            AND p."musicCommunity" IS DISTINCT FROM u."homeSceneCommunity"
        `,
      ),
    ]);

    const [multipleDefaultSamples, missingDefaultSamples, compatibilityMismatchSamples] = await Promise.all([
      prisma.$queryRaw<IssueRow[]>`
        SELECT
          p."userId" AS "userId",
          u.email,
          u.username,
          COUNT(*) AS "defaultCount",
          ARRAY_AGG(p."musicCommunity" ORDER BY p."musicCommunity") AS "musicCommunities"
        FROM user_music_community_preferences p
        JOIN users u ON u.id = p."userId"
        WHERE p."isDefault" = true
        GROUP BY p."userId", u.email, u.username
        HAVING COUNT(*) > 1
        ORDER BY u.email ASC, p."userId" ASC
        LIMIT ${SAMPLE_LIMIT}
      `,
      prisma.$queryRaw<IssueRow[]>`
        SELECT
          u.id AS "userId",
          u.email,
          u.username,
          u."homeSceneCity" AS "homeSceneCity",
          u."homeSceneState" AS "homeSceneState",
          u."homeSceneCommunity" AS "homeSceneCommunity"
        FROM users u
        WHERE u."homeSceneCity" IS NOT NULL
          AND u."homeSceneState" IS NOT NULL
          AND u."homeSceneCommunity" IS NOT NULL
          AND NOT EXISTS (
            SELECT 1
            FROM user_music_community_preferences p
            WHERE p."userId" = u.id
              AND p."isDefault" = true
          )
        ORDER BY u.email ASC, u.id ASC
        LIMIT ${SAMPLE_LIMIT}
      `,
      prisma.$queryRaw<IssueRow[]>`
        SELECT
          u.id AS "userId",
          u.email,
          u.username,
          u."homeSceneCity" AS "homeSceneCity",
          u."homeSceneState" AS "homeSceneState",
          u."homeSceneCommunity" AS "homeSceneCommunity",
          p."musicCommunity" AS "defaultMusicCommunity"
        FROM users u
        JOIN user_music_community_preferences p
          ON p."userId" = u.id
         AND p."isDefault" = true
        WHERE u."homeSceneCommunity" IS NOT NULL
          AND p."musicCommunity" IS DISTINCT FROM u."homeSceneCommunity"
        ORDER BY u.email ASC, u.id ASC
        LIMIT ${SAMPLE_LIMIT}
      `,
    ]);

    const failures = {
      usersWithMultipleDefaults,
      usersMissingDefaultPreference,
      usersWithCompatibilityMismatch,
    };
    const failureCount = Object.values(failures).reduce((total, count) => total + count, 0);

    console.log(
      JSON.stringify(
        {
          verification: 'music-community-preferences',
          mode: 'read-only',
          writesDatabase: false,
          reportOnly,
          target: {
            databaseName: target.databaseName,
            host: target.host,
            isLocal: target.isLocal,
          },
          observed: {
            totalUsers,
            usersWithHomeTuple,
            usersWithDefaultPreference,
          },
          failures,
          samples: {
            multipleDefaults: normalizeIssueRows(multipleDefaultSamples),
            missingDefaultPreference: normalizeIssueRows(missingDefaultSamples),
            compatibilityMismatch: normalizeIssueRows(compatibilityMismatchSamples),
          },
        },
        null,
        2,
      ),
    );

    if (failureCount > 0 && !reportOnly) {
      process.exitCode = 1;
    }
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error) => {
  console.error(
    JSON.stringify(
      {
        verification: 'music-community-preferences',
        error: error instanceof Error ? error.message : String(error),
      },
      null,
      2,
    ),
  );
  process.exitCode = 1;
});
