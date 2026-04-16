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

  it('does not hard-gate passive current-community reads on auth when active scene context exists', () => {
    const discoverSource = readRepoFile('src/app/discover/page.tsx');

    expect(discoverSource).toContain('const localContextReady = Boolean(activeSceneId || hasOriginContext);');
    expect(discoverSource).toContain('if (!localContextReady) {');
    expect(discoverSource).toContain('getCommunityDiscoverHighlights(');
    expect(discoverSource).toContain('tier,');
    expect(discoverSource).toContain('Community-native lookup belongs on the community page instead of this surface.');
    expect(discoverSource).toContain('setHighlights(emptyHighlights);');
    expect(discoverSource).not.toContain('searchCommunityDiscover(');
    expect(discoverSource).not.toContain('Sign in is required to search this community and open its full Discover sections.');
  });

  it('locks Discover to a top player marquee with player-attached Travel and passive snippets below', () => {
    const discoverSource = readRepoFile('src/app/discover/page.tsx');
    const playerIndex = discoverSource.indexOf('<RadiyoPlayerPanel');
    const snippetsIndex = discoverSource.indexOf('Community snippets under the current player scope');

    expect(playerIndex).toBeGreaterThan(-1);
    expect(snippetsIndex).toBeGreaterThan(-1);
    expect(playerIndex).toBeLessThan(snippetsIndex);
    expect(discoverSource).toContain('radiyoFooter={discoverTravelFooter}');
    expect(discoverSource).toContain('Open travel to drop the map and retune controls directly under the current city/state marquee.');
    expect(discoverSource).toContain('Discover stays passive here');
    expect(discoverSource).toContain('Community-native lookup belongs on the community page instead of this surface.');
    expect(discoverSource).toContain('Popular Singles');
    expect(discoverSource).toContain('Recommendations');
    expect(discoverSource).toContain('The visual map drops from the player marquee and follows the same player scope.');
    expect(discoverSource).toContain("{travelOpen ? 'Hide Travel' : 'Open Travel'}");
    expect(discoverSource).toContain('Travel active. You are tuned to {activeSceneName} and can visit the community now.');
    expect(discoverSource).toContain('Open community page');
    expect(discoverSource).not.toContain('Artist and song search');
    expect(discoverSource).not.toContain('Search Bar');
    expect(discoverSource).not.toContain('Trending');
    expect(discoverSource).not.toContain('Top Artists');
  });

  it('keeps MVP Discover tier controls at city/state and defers national scope', () => {
    const discoverSource = readRepoFile('src/app/discover/page.tsx');

    expect(discoverSource).toContain("const DISCOVER_TIER_OPTIONS: TierScope[] = ['city', 'state'];");
    expect(discoverSource).toContain('National is deferred until population justifies it.');
    expect(discoverSource).toContain("() => playerTier ?? getMvpPlayerTier(tunedScene?.tier)");
    expect(discoverSource).toContain('setPlayerTier(persistedTier);');
  });

  it('keeps signed-out discover destinations explicit without routing people into missing lookup flows', () => {
    const discoverSource = readRepoFile('src/app/discover/page.tsx');

    expect(discoverSource).toContain('Sign in is required to open artist pages and change Home Scene from community-native surfaces.');
    expect(discoverSource).toContain('Open community page');
    expect(discoverSource).toContain("{savingHomeSceneId === item.sceneId ? 'Saving...' : item.isHomeScene ? 'Home Scene' : 'Set as Home Scene'}");
  });
});
