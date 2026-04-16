import fs from 'node:fs';
import path from 'node:path';

const repoRoot = path.resolve(__dirname, '..');

function readRepoFile(relativePath: string): string {
  return fs.readFileSync(path.join(repoRoot, relativePath), 'utf8');
}

describe('/discover MVP placeholder lock', () => {
  it('keeps Discover as a coming-soon placeholder while MVP stays local-community-only', () => {
    const discoverSource = readRepoFile('src/app/discover/page.tsx');

    expect(discoverSource).toContain('Coming Soon');
    expect(discoverSource).toContain('MVP is local-community-only.');
    expect(discoverSource).toContain('Borders open later.');
    expect(discoverSource).toContain('inserted feed moments');
    expect(discoverSource).toContain('Back to Plot');
    expect(discoverSource).toContain('Home Scene Setup');
  });

  it('does not keep live Discover machinery active in the route component', () => {
    const discoverSource = readRepoFile('src/app/discover/page.tsx');

    expect(discoverSource).not.toContain('RadiyoPlayerPanel');
    expect(discoverSource).not.toContain('getCommunityDiscoverHighlights(');
    expect(discoverSource).not.toContain('listDiscoverScenes(');
    expect(discoverSource).not.toContain('tuneDiscoverScene(');
    expect(discoverSource).not.toContain('searchCommunityDiscover(');
    expect(discoverSource).not.toContain('Travel');
    expect(discoverSource).not.toContain('Popular Singles');
    expect(discoverSource).not.toContain('Recommendations');
  });
});
