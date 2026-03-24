import fs from 'node:fs';
import path from 'node:path';

const repoRoot = path.resolve(__dirname, '..');

function readRepoFile(relativePath: string): string {
  return fs.readFileSync(path.join(repoRoot, relativePath), 'utf8');
}

describe('/discover current-community lock', () => {
  it('resolves Home Scene tuple into current-community context before leaving local discover locked', () => {
    const discoverSource = readRepoFile('src/app/discover/page.tsx');

    expect(discoverSource).toContain('listDiscoverScenes(');
    expect(discoverSource).toContain("tier: 'city'");
    expect(discoverSource).toContain('const exactMatch = response.find(');
    expect(discoverSource).toContain('if (activeSceneId) return;');
    expect(discoverSource).toContain('tunedSceneId: exactMatch.sceneId');
    expect(discoverSource).toContain('isVisitor: false');
  });

  it('does not hard-gate current-community reads on auth when active scene context exists', () => {
    const discoverSource = readRepoFile('src/app/discover/page.tsx');

    expect(discoverSource).toContain('if (!activeSceneId) {');
    expect(discoverSource).toContain('getCommunityDiscoverHighlights(activeSceneId, token || undefined, 8)');
    expect(discoverSource).toContain('searchCommunityDiscover(activeSceneId, query, token || undefined, 8)');
    expect(discoverSource).toContain('disabled={!activeSceneId}');
    expect(discoverSource).not.toContain('Sign in is required to search this community and open its full Discover sections.');
  });
});
