import fs from 'node:fs';
import path from 'node:path';

const apiRoot = path.resolve(__dirname, '..');
const migrationPath = path.join(
  apiRoot,
  'prisma/migrations/20260715030000_add_sect_request_provenance/migration.sql',
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
  id                      String   @id @default(uuid())
  parentCommunityId       String
  requestRegistrarEntryId String?  @unique
  name                    String
  slug                    String
  createdAt               DateTime @default(now())
  updatedAt               DateTime @updatedAt

  parentCommunity      Community       @relation(fields: [parentCommunityId], references: [id], onDelete: Restrict)
  requestRegistrarEntry RegistrarEntry? @relation(fields: [requestRegistrarEntryId], references: [id], onDelete: SetNull)

  @@unique([parentCommunityId, slug])
  @@map("sects")
}
`;

const expectedMigration = `
-- AlterTable
ALTER TABLE "sects" ADD COLUMN "requestRegistrarEntryId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "sects_requestRegistrarEntryId_key" ON "sects"("requestRegistrarEntryId");

-- AddForeignKey
ALTER TABLE "sects" ADD CONSTRAINT "sects_requestRegistrarEntryId_fkey" FOREIGN KEY ("requestRegistrarEntryId") REFERENCES "registrar_entries"("id") ON DELETE SET NULL ON UPDATE CASCADE;
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
    expect(readPrismaModel(schema, 'Track')).not.toMatch(/sect/i);
    expect(sect).not.toContain('status');
    expect(schema).not.toContain('ArtistBandSectMembership');
    expect(readPrismaModel(schema, 'RegistrarEntry')).toMatch(/^\s+requestedSect\s+Sect\?$/m);
  });

  it('keeps the hand-written migration exactly equivalent to the accepted DDL', () => {
    const migration = fs.readFileSync(migrationPath, 'utf8');

    expect(normalizeExactText(migration)).toBe(
      normalizeExactText(expectedMigration),
    );
  });
});
