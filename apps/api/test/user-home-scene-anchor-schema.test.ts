import fs from 'node:fs';
import path from 'node:path';

const apiRoot = path.resolve(__dirname, '..');
const schema = fs.readFileSync(path.join(apiRoot, 'prisma/schema.prisma'), 'utf8');
const migrationPath = path.join(
  apiRoot,
  'prisma/migrations/20260715033000_add_user_home_scene_anchor/migration.sql',
);

function readPrismaModel(modelName: string): string {
  const match = schema.match(new RegExp(`model ${modelName} \\{[\\s\\S]*?\\n\\}`));
  if (!match) throw new Error(`Prisma model ${modelName} was not found`);
  return match[0];
}

describe('User Home Scene anchor schema contract', () => {
  it('stores a nullable durable civic anchor separately from tuned scene context', () => {
    const user = readPrismaModel('User');
    const community = readPrismaModel('Community');

    expect(user).toMatch(/^\s+homeSceneId\s+String\?$/m);
    expect(user).toMatch(
      /^\s+homeScene\s+Community\?\s+@relation\("ListenerHomeScene", fields: \[homeSceneId\], references: \[id\], onDelete: SetNull\)$/m,
    );
    expect(user).toMatch(/^\s+@@index\(\[homeSceneId\]\)$/m);
    expect(community).toMatch(/^\s+homeSceneListeners\s+User\[\]\s+@relation\("ListenerHomeScene"\)$/m);
  });

  it('adds the nullable anchor without guessing a backfill', () => {
    const migration = fs.readFileSync(migrationPath, 'utf8');

    expect(migration).toContain('ALTER TABLE "users" ADD COLUMN "homeSceneId" TEXT;');
    expect(migration).toContain('CREATE INDEX "users_homeSceneId_idx" ON "users"("homeSceneId");');
    expect(migration).toContain('REFERENCES "communities"("id") ON DELETE SET NULL ON UPDATE CASCADE;');
    expect(migration).not.toMatch(/UPDATE\s+"users"/i);
  });
});
