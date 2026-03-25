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
    expect(discoverSource).toContain('const exactMatch = exactResponse.find(');
    expect(discoverSource).toContain('if (activeSceneId) return;');
    expect(discoverSource).toContain('const sameStateActiveMatch = stateResponse.find(');
    expect(discoverSource).toContain('const anyActiveMatch = communityResponse.find(');
    expect(discoverSource).toContain('const resolvedMatch = exactMatch ?? sameStateActiveMatch ?? anyActiveMatch;');
    expect(discoverSource).toContain('tunedSceneId: resolvedMatch.sceneId');
    expect(discoverSource).toContain('isVisitor: Boolean(');
  });

  it('does not hard-gate current-community reads on auth when active scene context exists', () => {
    const discoverSource = readRepoFile('src/app/discover/page.tsx');

    expect(discoverSource).toContain('const localContextReady = Boolean(activeSceneId || hasOriginContext);');
    expect(discoverSource).toContain('if (!localContextReady) {');
    expect(discoverSource).toContain('getCommunityDiscoverHighlights(activeSceneId, token || undefined, 8)');
    expect(discoverSource).toContain('searchCommunityDiscover(activeSceneId, query, token || undefined, 8)');
    expect(discoverSource).toContain('disabled={!localContextReady}');
    expect(discoverSource).toContain('setHighlights(emptyHighlights);');
    expect(discoverSource).not.toContain('Sign in is required to search this community and open its full Discover sections.');
  });

  it('keeps signed-out discover destinations explicit instead of linking directly into auth-dead-end artist pages', () => {
    const discoverSource = readRepoFile('src/app/discover/page.tsx');

    expect(discoverSource).toContain('Sign in is required to open artist pages and change Home Scene from Discover.');
    expect(discoverSource).toContain("{song.artistBandId && token ? (");
    expect(discoverSource).toContain("{savingHomeSceneId === item.sceneId ? 'Saving...' : item.isHomeScene ? 'Home Scene' : 'Set as Home Scene'}");
  });

  it('uses the plot zine visual system for the founder-locked discover shell and shelves', () => {
    const discoverSource = readRepoFile('src/app/discover/page.tsx');

    expect(discoverSource).toContain('plot-zine-page');
    expect(discoverSource).toContain('plot-zine-card plot-paper-clip plot-record-sleeve');
    expect(discoverSource).toContain('plot-embossed-label');
    expect(discoverSource).toContain('plot-divider-tab');
    expect(discoverSource).toContain('plot-handwritten');
    expect(discoverSource).toContain('Record Shelf View');
  });
});
