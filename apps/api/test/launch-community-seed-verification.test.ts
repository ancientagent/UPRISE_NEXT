import fs from 'node:fs';
import path from 'node:path';

const apiRoot = path.resolve(__dirname, '..');

function readApiFile(relativePath: string): string {
  return fs.readFileSync(path.join(apiRoot, relativePath), 'utf8');
}

describe('launch community seed verification script', () => {
  it('is read-only and requires an explicit DATABASE_URL target', () => {
    const script = readApiFile('scripts/verify-launch-community-seed.ts');

    expect(script).toContain('resolveLaunchCommunitySeedTarget(process.env.DATABASE_URL)');
    expect(script).toContain("mode: 'read-only'");
    expect(script).toContain('writesDatabase: false');
    expect(script).toContain('prisma.$queryRaw');
    expect(script).not.toContain('prisma.community.create');
    expect(script).not.toContain('prisma.community.update');
    expect(script).not.toContain('prisma.$executeRaw');
  });

  it('verifies every expected launch tuple has matching geofence, radius, and coordinates', () => {
    const script = readApiFile('scripts/verify-launch-community-seed.ts');

    expect(script).toContain('buildLaunchCommunitySeedRecords');
    expect(script).toContain('buildLaunchCommunityGeofenceSeedRecords');
    expect(script).toContain('geofence_mismatch');
    expect(script).toContain('ST_Y(geofence::geometry)');
    expect(script).toContain('ST_X(geofence::geometry)');
    expect(script).toContain('expectedRadius');
    expect(script).toContain('expectedLatitude');
    expect(script).toContain('expectedLongitude');
  });
});
