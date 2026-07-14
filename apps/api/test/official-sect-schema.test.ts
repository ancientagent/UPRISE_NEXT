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

function normalizePrismaContract(value: string): string {
  return value
    .trim()
    .split(/\r?\n/)
    .map((line) => line.trim().replace(/\s+/g, ' '))
    .join('\n');
}

function normalizeExactText(value: string): string {
  return value.replace(/\r\n/g, '\n').trim();
}

const expectedSectModel = `
model Sect {
  id                String   @id @default(uuid())
  parentCommunityId String
  name              String
  slug              String
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt

  parentCommunity Community @relation(fields: [parentCommunityId], references: [id], onDelete: Restrict)

  @@unique([parentCommunityId, slug])
  @@map("sects")
}
`;

const expectedMigration = `
-- CreateTable
CREATE TABLE "sects" (
    "id" TEXT NOT NULL,
    "parentCommunityId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sects_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "sects_parentCommunityId_slug_key" ON "sects"("parentCommunityId", "slug");

-- AddForeignKey
ALTER TABLE "sects" ADD CONSTRAINT "sects_parentCommunityId_fkey" FOREIGN KEY ("parentCommunityId") REFERENCES "communities"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
`;

describe('Official Sect identity schema contract', () => {
  const schema = readApiFile('prisma/schema.prisma');

  it('defines only the accepted authority-neutral Sect identity model', () => {
    const sect = readPrismaModel(schema, 'Sect');
    const community = readPrismaModel(schema, 'Community');

    expect(normalizePrismaContract(sect)).toBe(
      normalizePrismaContract(expectedSectModel),
    );
    expect(community).toMatch(/^\s+sects\s+Sect\[\]$/m);
    expect(schema).not.toContain('model TrackSectBacking');
  });

  it('keeps the hand-written migration exactly equivalent to the accepted DDL', () => {
    const migration = fs.readFileSync(migrationPath, 'utf8');

    expect(normalizeExactText(migration)).toBe(
      normalizeExactText(expectedMigration),
    );
  });
});
