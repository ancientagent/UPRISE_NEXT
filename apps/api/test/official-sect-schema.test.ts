import fs from 'node:fs';
import path from 'node:path';

const apiRoot = path.resolve(__dirname, '..');
const migrationPath = path.join(
  apiRoot,
  'prisma/migrations/20260714223000_add_official_sects/migration.sql',
);

function readApiFile(relativePath: string): string {
  return fs.readFileSync(path.join(apiRoot, relativePath), 'utf8');
}

function readPrismaModel(schema: string, modelName: string): string {
  const match = schema.match(new RegExp(`model ${modelName} \\{[\\s\\S]*?\\n\\}`));
  if (!match) {
    throw new Error(`Prisma model ${modelName} was not found`);
  }
  return match[0];
}

describe('Official Sect identity schema contract', () => {
  const schema = readApiFile('prisma/schema.prisma');

  it('defines an authority-neutral Sect identity scoped to its parent community', () => {
    const sect = readPrismaModel(schema, 'Sect');
    const community = readPrismaModel(schema, 'Community');

    expect(sect).toMatch(/^\s+id\s+String\s+@id @default\(uuid\(\)\)$/m);
    expect(sect).toMatch(/^\s+parentCommunityId\s+String$/m);
    expect(sect).toMatch(/^\s+name\s+String$/m);
    expect(sect).toMatch(/^\s+slug\s+String$/m);
    expect(sect).toMatch(/^\s+createdAt\s+DateTime @default\(now\(\)\)$/m);
    expect(sect).toMatch(/^\s+updatedAt\s+DateTime @updatedAt$/m);
    expect(sect).toMatch(
      /^\s+parentCommunity\s+Community\s+@relation\(fields: \[parentCommunityId\], references: \[id\], onDelete: Restrict\)$/m,
    );
    expect(sect).toContain('@@unique([parentCommunityId, slug])');
    expect(sect).toContain('@@index([parentCommunityId])');
    expect(sect).toContain('@@map("sects")');
    expect(community).toMatch(/^\s+sects\s+Sect\[\]$/m);
    expect(sect).not.toMatch(/^\s+status\s+/m);
    expect(schema).not.toContain('model TrackSectBacking');
  });

  it('keeps the hand-written migration equivalent to the Prisma contract', () => {
    const migration = fs.readFileSync(migrationPath, 'utf8');

    expect(migration).toContain('CREATE TABLE "sects" (');
    expect(migration).toContain('"id" TEXT NOT NULL');
    expect(migration).toContain('"parentCommunityId" TEXT NOT NULL');
    expect(migration).toContain('"name" TEXT NOT NULL');
    expect(migration).toContain('"slug" TEXT NOT NULL');
    expect(migration).toContain(
      '"createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP',
    );
    expect(migration).toContain('"updatedAt" TIMESTAMP(3) NOT NULL');
    expect(migration).toContain(
      'CONSTRAINT "sects_pkey" PRIMARY KEY ("id")',
    );
    expect(migration).toContain(
      'CREATE UNIQUE INDEX "sects_parentCommunityId_slug_key" ON "sects"("parentCommunityId", "slug");',
    );
    expect(migration).toContain(
      'CREATE INDEX "sects_parentCommunityId_idx" ON "sects"("parentCommunityId");',
    );
    expect(migration).toContain(
      'ALTER TABLE "sects" ADD CONSTRAINT "sects_parentCommunityId_fkey" FOREIGN KEY ("parentCommunityId") REFERENCES "communities"("id") ON DELETE RESTRICT ON UPDATE CASCADE;',
    );
    expect(migration).not.toContain('track_sect_backings');
    expect(migration).not.toContain('CREATE TYPE');
    expect(migration).not.toContain('"status"');
    expect(migration).not.toMatch(/^\s*(?:INSERT INTO|UPDATE\s+|DELETE FROM)\b/im);
  });
});
