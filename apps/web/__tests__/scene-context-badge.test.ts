import fs from 'node:fs';
import path from 'node:path';

const repoRoot = path.resolve(__dirname, '..');

function readRepoFile(relativePath: string): string {
  return fs.readFileSync(path.join(repoRoot, relativePath), 'utf8');
}

describe('SceneContextBadge source lock', () => {
  it('keeps unresolved contexts neutral instead of defaulting to Local', () => {
    const badgeSource = readRepoFile('src/components/plot/SceneContextBadge.tsx');

    expect(badgeSource).toContain("const hasResolvedContext = Boolean(homeScene || tunedScene);");
    expect(badgeSource).toContain("const presenceLabel = !hasResolvedContext ? 'Context unset' : isVisitor ? 'Visitor' : 'Local';");
    expect(badgeSource).toContain("? 'border-black/15 bg-white text-black/60'");
  });
});
