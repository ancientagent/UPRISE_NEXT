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
    expect(discoverSource).toContain('getCommunityDiscoverHighlights(');
    expect(discoverSource).toContain('searchCommunityDiscover(');
    expect(discoverSource).toContain('tier,');
    expect(discoverSource).toContain('disabled={!localContextReady}');
    expect(discoverSource).toContain('setHighlights(emptyHighlights);');
    expect(discoverSource).not.toContain('Sign in is required to search this community and open its full Discover sections.');
  });

  it('locks Discover to one search bar, Popular Singles, Recommendations, and player-attached Travel', () => {
    const discoverSource = readRepoFile('src/app/discover/page.tsx');

    expect(discoverSource).toContain('Artist and song search');
    expect(discoverSource).toContain('Popular Singles');
    expect(discoverSource).toContain('Recommendations');
    expect(discoverSource).toContain('Travel stays attached to the player.');
    expect(discoverSource).toContain("{travelOpen ? 'Hide Travel' : 'Open Travel'}");
    expect(discoverSource).toContain('Travel active. You are tuned to {activeSceneName} and can visit the community now.');
    expect(discoverSource).not.toContain('Trending');
    expect(discoverSource).not.toContain('Top Artists');
  });

  it('keeps signed-out discover destinations explicit instead of linking directly into auth-dead-end artist pages', () => {
    const discoverSource = readRepoFile('src/app/discover/page.tsx');

    expect(discoverSource).toContain('Sign in is required to open artist pages and change Home Scene from Discover.');
    expect(discoverSource).toContain("{song.artistBandId && token ? (");
    expect(discoverSource).toContain("{savingHomeSceneId === item.sceneId ? 'Saving...' : item.isHomeScene ? 'Home Scene' : 'Set as Home Scene'}");
  });
});
