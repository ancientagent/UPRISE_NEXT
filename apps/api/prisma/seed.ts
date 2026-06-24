import { PrismaClient } from '@prisma/client';
import launchMatrix from '../../../docs/specs/seed/launch-community-city-matrix.json';
import {
  seedLaunchCommunities,
  seedLaunchCommunityGeofences,
  buildLaunchCommunityGeofenceSeedRecords,
  buildLaunchCommunitySeedRecords,
} from '../src/seed/launch-community-seed';
import { assertLaunchCommunitySeedTargetAllowed } from '../src/seed/launch-community-seed-safety';

async function main() {
  if (process.argv.includes('--dry-run')) {
    const communities = buildLaunchCommunitySeedRecords(launchMatrix);
    const geofences = buildLaunchCommunityGeofenceSeedRecords(launchMatrix);

    console.log(
      JSON.stringify(
        {
          seed: 'launch-communities',
          mode: 'dry-run',
          writesDatabase: false,
          communities: {
            total: communities.length,
            first: communities[0] ?? null,
            last: communities.at(-1) ?? null,
          },
          geofences: {
            total: geofences.length,
            first: geofences[0] ?? null,
            last: geofences.at(-1) ?? null,
          },
        },
        null,
        2
      )
    );
    return;
  }

  const target = assertLaunchCommunitySeedTargetAllowed(process.env);
  const prisma = new PrismaClient();
  try {
    const communities = await seedLaunchCommunities(prisma, { matrix: launchMatrix });
    const geofences = await seedLaunchCommunityGeofences(prisma, { matrix: launchMatrix });

    console.log(
      JSON.stringify(
        {
          seed: 'launch-communities',
          mode: 'write',
          target: {
            databaseName: target.databaseName,
            host: target.host,
            isLocal: target.isLocal,
          },
          communities,
          geofences,
        },
        null,
        2
      )
    );
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
