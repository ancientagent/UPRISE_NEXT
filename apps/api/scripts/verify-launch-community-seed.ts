import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import launchMatrix from '../../../docs/specs/seed/launch-community-city-matrix.json';
import {
  buildLaunchCommunityGeofenceSeedRecords,
  buildLaunchCommunitySeedRecords,
} from '../src/seed/launch-community-seed';
import { resolveLaunchCommunitySeedTarget } from '../src/seed/launch-community-seed-safety';

interface LaunchCommunityRow {
  id: string;
  city: string;
  state: string;
  musicCommunity: string;
  tier: string;
  isActive: boolean;
  radius: number | null;
  hasGeofence: boolean;
  latitude: number | null;
  longitude: number | null;
}

function closeEnough(actual: number | null, expected: number): boolean {
  return typeof actual === 'number' && Math.abs(actual - expected) < 0.0001;
}

function normalizeNumber(value: unknown): number | null {
  if (typeof value === 'number') return value;
  if (typeof value === 'bigint') return Number(value);
  if (typeof value === 'string') return Number(value);
  return null;
}

async function main() {
  const target = resolveLaunchCommunitySeedTarget(process.env.DATABASE_URL);
  const expectedCommunities = buildLaunchCommunitySeedRecords(launchMatrix);
  const expectedGeofences = buildLaunchCommunityGeofenceSeedRecords(launchMatrix);
  const geofenceByKey = new Map(
    expectedGeofences.map((record) => [
      `${record.city}||${record.state}||${record.musicCommunity}`,
      record,
    ])
  );

  const prisma = new PrismaClient();
  const checks: Array<{
    city: string;
    state: string;
    musicCommunity: string;
    status: 'ok' | 'missing' | 'duplicate' | 'geofence_mismatch';
    details?: Record<string, unknown>;
  }> = [];

  try {
    for (const expected of expectedCommunities) {
      const rows = await prisma.$queryRaw<Array<{
        id: string;
        city: string;
        state: string;
        musicCommunity: string;
        tier: string;
        isActive: boolean;
        radius: number | string | bigint | null;
        hasGeofence: boolean;
        latitude: number | string | null;
        longitude: number | string | null;
      }>>`
        SELECT
          id::text,
          city,
          state,
          "musicCommunity",
          tier,
          "isActive",
          radius,
          (geofence IS NOT NULL) as "hasGeofence",
          CASE WHEN geofence IS NULL THEN NULL ELSE ST_Y(geofence::geometry) END as latitude,
          CASE WHEN geofence IS NULL THEN NULL ELSE ST_X(geofence::geometry) END as longitude
        FROM communities
        WHERE city = ${expected.city}
          AND state = ${expected.state}
          AND "musicCommunity" = ${expected.musicCommunity}
          AND tier = 'city'
          AND "isActive" = true
      `;

      if (rows.length === 0) {
        checks.push({
          city: expected.city,
          state: expected.state,
          musicCommunity: expected.musicCommunity,
          status: 'missing',
        });
        continue;
      }

      if (rows.length > 1) {
        checks.push({
          city: expected.city,
          state: expected.state,
          musicCommunity: expected.musicCommunity,
          status: 'duplicate',
          details: { count: rows.length, ids: rows.map((row) => row.id) },
        });
        continue;
      }

      const row: LaunchCommunityRow = {
        ...rows[0],
        radius: normalizeNumber(rows[0].radius),
        latitude: normalizeNumber(rows[0].latitude),
        longitude: normalizeNumber(rows[0].longitude),
      };
      const geofence = geofenceByKey.get(`${expected.city}||${expected.state}||${expected.musicCommunity}`);
      const radiusMatches = row.radius === geofence?.radiusMeters;
      const latitudeMatches = geofence ? closeEnough(row.latitude, geofence.latitude) : false;
      const longitudeMatches = geofence ? closeEnough(row.longitude, geofence.longitude) : false;

      if (!row.hasGeofence || !radiusMatches || !latitudeMatches || !longitudeMatches) {
        checks.push({
          city: expected.city,
          state: expected.state,
          musicCommunity: expected.musicCommunity,
          status: 'geofence_mismatch',
          details: {
            hasGeofence: row.hasGeofence,
            radius: row.radius,
            expectedRadius: geofence?.radiusMeters,
            latitude: row.latitude,
            expectedLatitude: geofence?.latitude,
            longitude: row.longitude,
            expectedLongitude: geofence?.longitude,
          },
        });
        continue;
      }

      checks.push({
        city: expected.city,
        state: expected.state,
        musicCommunity: expected.musicCommunity,
        status: 'ok',
      });
    }

    const failures = checks.filter((check) => check.status !== 'ok');
    const byStatus = checks.reduce<Record<string, number>>((acc, check) => {
      acc[check.status] = (acc[check.status] ?? 0) + 1;
      return acc;
    }, {});

    const result = {
      verification: 'launch-community-seed',
      mode: 'read-only',
      writesDatabase: false,
      target: {
        databaseName: target.databaseName,
        host: target.host,
        isLocal: target.isLocal,
      },
      expected: {
        communities: expectedCommunities.length,
        geofences: expectedGeofences.length,
      },
      observed: {
        totalChecked: checks.length,
        byStatus,
      },
      failures,
    };

    console.log(JSON.stringify(result, null, 2));

    if (failures.length > 0) {
      process.exitCode = 1;
    }
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error) => {
  console.error(JSON.stringify({ verification: 'launch-community-seed', error: error instanceof Error ? error.message : String(error) }, null, 2));
  process.exitCode = 1;
});
