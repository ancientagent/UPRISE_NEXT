import fs from 'node:fs';
import path from 'node:path';

const repoRoot = path.resolve(__dirname, '..');

function readRepoFile(relativePath: string): string {
  return fs.readFileSync(path.join(repoRoot, relativePath), 'utf8');
}

describe('/plot UX regression lock', () => {
  it('locks player mode labels to explicit RADIYO vs Collection copy', () => {
    const playerSource = readRepoFile('src/components/plot/RadiyoPlayerPanel.tsx');

    expect(playerSource).toContain('RADIYO');
    expect(playerSource).toContain('Collection');
  });

  it('locks expanded-profile behavior to swap out Plot tabs/body', () => {
    const plotPageSource = readRepoFile('src/app/plot/page.tsx');

    expect(plotPageSource).toContain('const isProfileExpanded = profilePanelState ===');
    expect(plotPageSource).toContain('{isProfileExpanded ? (');
    expect(plotPageSource).toContain('{tabs.map((tab) => (');
    expect(plotPageSource).toContain('Return to Plot Tabs');
  });

  it('locks Top Songs + Scene Activity to statistics-only placement', () => {
    const plotPageSource = readRepoFile('src/app/plot/page.tsx');

    expect(plotPageSource).toMatch(
      /activeTab === 'Statistics'[\s\S]*TopSongsPanel[\s\S]*Scene Activity Snapshot/
    );
  });
});
