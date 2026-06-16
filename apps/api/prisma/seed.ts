import { PrismaClient } from '@prisma/client';
import launchMatrix from '../../../docs/specs/seed/launch-community-city-matrix.json';
import {
  seedLaunchCommunities,
  seedLaunchCommunityGeofences,
} from '../src/seed/launch-community-seed';

const prisma = new PrismaClient();

async function main() {
  const communities = await seedLaunchCommunities(prisma, { matrix: launchMatrix });
  const geofences = await seedLaunchCommunityGeofences(prisma, { matrix: launchMatrix });

  console.log(JSON.stringify({ seed: 'launch-communities', communities, geofences }, null, 2));
}

main()
  .catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
