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

  it('locks panel-state ownership to the /plot route container', () => {
    const plotPageSource = readRepoFile('src/app/plot/page.tsx');
    const playerSource = readRepoFile('src/components/plot/RadiyoPlayerPanel.tsx');

    expect(plotPageSource).toContain("useState<'collapsed' | 'peek' | 'expanded'>('collapsed')");
    expect(plotPageSource).toContain("const isProfileExpanded = profilePanelState === 'expanded'");
    expect(plotPageSource).toContain('aria-expanded={isProfileExpanded}');
    expect(playerSource).not.toContain("useState<'collapsed' | 'peek' | 'expanded'>");
  });

  it('locks compact player shell scaffolding for track row and tier stack', () => {
    const playerSource = readRepoFile('src/components/plot/RadiyoPlayerPanel.tsx');

    expect(playerSource).toContain('data-slot="compact-player-shell"');
    expect(playerSource).toContain('data-slot="player-track-row"');
    expect(playerSource).toContain('data-slot="player-tier-stack"');
  });

  it('locks collection mode to selection entry and explicit eject return', () => {
    const playerSource = readRepoFile('src/components/plot/RadiyoPlayerPanel.tsx');
    const plotPageSource = readRepoFile('src/app/plot/page.tsx');

    expect(plotPageSource).toContain("const [playerMode, setPlayerMode] = useState<PlayerMode>('RADIYO')");
    expect(playerSource).not.toContain('Switch to Collection mode');
    expect(playerSource).toContain('Back to RADIYO');
    expect(playerSource).toContain('aria-label="Back to RADIYO"');
    expect(playerSource).toContain('onCollectionEject');
    expect(playerSource).not.toContain('onModeChange');
    expect(plotPageSource).toContain('const handleCollectionSelection =');
    expect(plotPageSource).toContain('const handleCollectionEject =');
    expect(plotPageSource).toContain("setPlayerMode('Collection')");
    expect(plotPageSource).toContain("setPlayerMode('RADIYO')");
  });

  it('locks engagement wheel actions to deterministic mode-specific sets', () => {
    const wheelSource = readRepoFile('src/components/plot/engagement-wheel.ts');
    const playerSource = readRepoFile('src/components/plot/RadiyoPlayerPanel.tsx');

    expect(wheelSource).toContain('export const RADIYO_WHEEL_ACTIONS');
    expect(wheelSource).toContain('export const COLLECTION_WHEEL_ACTIONS');
    expect(wheelSource).toContain("{ label: 'Report' }");
    expect(wheelSource).toContain("{ label: 'Skip' }");
    expect(wheelSource).toContain("{ label: 'Add' }");
    expect(wheelSource).toContain("{ label: 'Back', position: '9:00' }");
    expect(wheelSource).toContain("{ label: 'Recommend', position: '1:00' }");
    expect(wheelSource).toContain("{ label: 'Next', position: '3:00' }");
    expect(playerSource).toContain('getEngagementWheelActions(mode)');
  });

  it('locks expanded-profile behavior to swap out Plot tabs/body', () => {
    const plotPageSource = readRepoFile('src/app/plot/page.tsx');

    expect(plotPageSource).toContain('const isProfileExpanded = profilePanelState ===');
    expect(plotPageSource).toContain('{isProfileExpanded ? (');
    expect(plotPageSource).toContain('{expandedProfileSections.map((section) => (');
    expect(plotPageSource).toContain('Singles/Playlists');
    expect(plotPageSource).toContain('Events');
    expect(plotPageSource).toContain('Photos');
    expect(plotPageSource).toContain('Merch');
    expect(plotPageSource).toContain('Saved Uprises');
    expect(plotPageSource).toContain('Saved Promos/Coupons');
    expect(plotPageSource).toContain('Activity Score');
    expect(plotPageSource).toContain('Calendar');
    expect(plotPageSource).toContain('Return to Plot Tabs');
    expect(plotPageSource).not.toContain("const collectionShelves = ['Tracks', 'Playlists', 'Saved']");
  });

  it('locks Top Songs + Scene Activity to statistics-only placement', () => {
    const plotPageSource = readRepoFile('src/app/plot/page.tsx');

    expect(plotPageSource).toMatch(
      /activeTab === 'Statistics'[\s\S]*TopSongsPanel[\s\S]*Scene Activity Snapshot/
    );
  });

  it('locks primary Plot tab ownership to explicit Feed/Events/Promotions/Statistics bodies', () => {
    const plotPageSource = readRepoFile('src/app/plot/page.tsx');

    expect(plotPageSource).toContain("const tabs = ['Feed', 'Events', 'Promotions', 'Statistics'] as const;");
    expect(plotPageSource).not.toContain('Social');
    expect(plotPageSource).toContain("if (activeTab === 'Feed')");
    expect(plotPageSource).toContain('SeedFeedPanel');
    expect(plotPageSource).toContain("if (activeTab === 'Events')");
    expect(plotPageSource).toContain('PlotEventsPanel');
    expect(plotPageSource).toContain("if (activeTab === 'Promotions')");
    expect(plotPageSource).toContain('PlotPromotionsPanel');
    expect(plotPageSource).toContain("if (activeTab === 'Statistics')");
    expect(plotPageSource).toContain('renderPrimaryPlotTabBody()');
  });

  it('locks feed copy to scene-scoped deterministic, non-personalized states', () => {
    const feedSource = readRepoFile('src/components/plot/SeedFeedPanel.tsx');

    expect(feedSource).toContain('Scene-scoped, reverse-chronological, and non-personalized.');
    expect(feedSource).toContain('No current scene activity for this context.');
    expect(feedSource).toContain('Retry Feed');
  });
});
