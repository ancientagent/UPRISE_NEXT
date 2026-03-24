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
    expect(plotPageSource).toContain('const seamLabel =');
    expect(plotPageSource).toContain("'Pull up or tap to collapse profile'");
    expect(plotPageSource).toContain("'Release to collapse or keep pulling to expand'");
    expect(plotPageSource).toContain("'Pull down profile'");
    expect(plotPageSource).toContain('onClick={toggleProfilePanel}');
    expect(plotPageSource).toContain('aria-controls="plot-profile-panel"');
    expect(plotPageSource).toContain('aria-expanded={isProfileExpanded}');
    expect(playerSource).not.toContain("useState<'collapsed' | 'peek' | 'expanded'>");
    expect(playerSource).not.toContain('setProfilePanelState');
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
    expect(playerSource).not.toContain("useState<PlayerMode>");
    expect(plotPageSource).toContain('onCollectionEject={handleCollectionEject}');
    expect(plotPageSource).toContain("const collectionBroadcastLabel = selectedCollectionItem?.label ??");
    expect(plotPageSource).toContain('selectedCollectionItem?.id === item.id && playerMode === \'Collection\'');
    expect(plotPageSource).toContain("const handleCollectionEject = () => {");
    expect(playerSource).not.toContain('Switch to Collection mode');
    expect(playerSource).toContain('Back to RADIYO');
    expect(playerSource).toContain('aria-label="Back to RADIYO"');
    expect(playerSource).toContain('onCollectionEject');
    expect(playerSource).toContain('Selection-driven collection queue');
    expect(playerSource).toContain('Selection-driven queue');
    expect(playerSource).toContain('aria-label="Shuffle collection"');
    expect(plotPageSource).toContain('selectedCollectionItem?.label');
    expect(playerSource).not.toContain('onModeChange');
    expect(plotPageSource).toContain('const handleCollectionSelection =');
    expect(plotPageSource).toContain('const handleCollectionEject =');
    expect(plotPageSource).toContain("setPlayerMode('Collection')");
    expect(plotPageSource).toContain("setPlayerMode('RADIYO')");
    expect(plotPageSource).toContain('mode={playerMode}');
    expect(playerSource).not.toContain('setPlayerMode');
    expect(plotPageSource).toContain('collectionTitle={selectedCollectionItem?.label ?? null}');
    expect(plotPageSource).toContain('broadcastLabel={playerMode ===');
    expect(plotPageSource).toContain("selectedCollectionItem?.id === item.id && playerMode === 'Collection'");
    expect(plotPageSource).toContain("setSelectedCollectionItem(item)");
  });

  it('locks engagement wheel actions to deterministic mode-specific sets', () => {
    const wheelSource = readRepoFile('src/components/plot/engagement-wheel.ts');
    const playerSource = readRepoFile('src/components/plot/RadiyoPlayerPanel.tsx');

    expect(wheelSource).toMatch(
      /export const RADIYO_WHEEL_ACTIONS: EngagementWheelAction\[] = \[\s*\{ label: 'Report' \},\s*\{ label: 'Skip' \},\s*\{ label: 'Blast' \},\s*\{ label: 'Add' \},\s*\{ label: 'Upvote' \},\s*\];/
    );
    expect(wheelSource).toMatch(
      /export const COLLECTION_WHEEL_ACTIONS: EngagementWheelAction\[] = \[\s*\{ label: 'Back', position: '9:00' \},\s*\{ label: 'Pause', position: '10:00' \},\s*\{ label: 'Blast', position: '12:00' \},\s*\{ label: 'Recommend', position: '1:00' \},\s*\{ label: 'Next', position: '3:00' \},\s*\];/
    );
    expect(wheelSource).toContain('export const RADIYO_WHEEL_ACTIONS');
    expect(wheelSource).toContain('export const COLLECTION_WHEEL_ACTIONS');
    expect(wheelSource).toContain("{ label: 'Report' }");
    expect(wheelSource).toContain("{ label: 'Skip' }");
    expect(wheelSource).toContain("{ label: 'Blast' }");
    expect(wheelSource).toContain("{ label: 'Add' }");
    expect(wheelSource).toContain("{ label: 'Upvote' }");
    expect(wheelSource).toContain("{ label: 'Back', position: '9:00' }");
    expect(wheelSource).toContain("{ label: 'Pause', position: '10:00' }");
    expect(wheelSource).toContain("{ label: 'Blast', position: '12:00' }");
    expect(wheelSource).toContain("{ label: 'Recommend', position: '1:00' }");
    expect(wheelSource).toContain("{ label: 'Next', position: '3:00' }");
    expect(playerSource).toContain('getEngagementWheelActions(mode)');
    expect(playerSource).toContain('Wheel: {wheelActions.map');
    expect(wheelSource).toContain("return mode === 'RADIYO' ? RADIYO_WHEEL_ACTIONS : COLLECTION_WHEEL_ACTIONS;");
    expect(wheelSource).toContain("label: 'Report' | 'Skip' | 'Blast' | 'Add' | 'Upvote' | 'Back' | 'Pause' | 'Recommend' | 'Next'");
    expect(wheelSource).toContain("position?: '9:00' | '10:00' | '12:00' | '1:00' | '3:00';");
  });

  it('locks expanded-profile behavior to swap out Plot tabs/body', () => {
    const plotPageSource = readRepoFile('src/app/plot/page.tsx');

    expect(plotPageSource).toContain('const isProfileExpanded = profilePanelState ===');
    expect(plotPageSource).toContain('{isProfileExpanded ? (');
    expect(plotPageSource).toMatch(
      /<header[\s\S]*Profile Summary[\s\S]*Activity Score[\s\S]*Calendar[\s\S]*<\/header>[\s\S]*Player Context[\s\S]*expandedProfileSections\.map[\s\S]*Return to Plot Tabs/
    );
    expect(plotPageSource).toMatch(
      /const expandedProfileSections = \[\s*'Singles\/Playlists',\s*'Events',\s*'Photos',\s*'Merch',\s*'Saved Uprises',\s*'Saved Promos\/Coupons',\s*\] as const;/
    );
    expect(plotPageSource).toContain('{expandedProfileSections.map((section) => (');
    expect(plotPageSource).toContain('Singles/Playlists');
    expect(plotPageSource).toContain('Events');
    expect(plotPageSource).toContain('Photos');
    expect(plotPageSource).toContain('Merch');
    expect(plotPageSource).toContain('Saved Uprises');
    expect(plotPageSource).toContain('Saved Promos/Coupons');
    expect(plotPageSource).toContain('Activity Score');
    expect(plotPageSource).toContain('Calendar');
    expect(plotPageSource).toContain('Calendar stays in the header.');
    expect(plotPageSource).toContain("const [activeProfileSection, setActiveProfileSection] = useState<ExpandedProfileSection>('Singles/Playlists')");
    expect(plotPageSource).toContain('eventsThisWeek');
    expect(plotPageSource).toContain("['Posters', 'Shirts', 'Patches', 'Buttons', 'Special Items']");
    expect(plotPageSource).toContain('Saved promos and coupons appear here with status and expiration');
    expect(plotPageSource).toContain('Return to Plot Tabs');
    expect(plotPageSource).not.toContain("const collectionShelves = ['Tracks', 'Playlists', 'Saved']");
  });

  it('locks Top Songs + Scene Activity to statistics-only placement', () => {
    const plotPageSource = readRepoFile('src/app/plot/page.tsx');

    expect(plotPageSource).toMatch(
      /activeTab === 'Statistics'[\s\S]*TopSongsPanel[\s\S]*Scene Activity Snapshot/
    );
  });

  it('locks bottom nav and center UPRISE wheel trigger onto the /plot route', () => {
    const plotPageSource = readRepoFile('src/app/plot/page.tsx');

    expect(plotPageSource).toContain('aria-label="Plot bottom navigation"');
    expect(plotPageSource).toContain('data-slot="plot-bottom-nav"');
    expect(plotPageSource).toContain('<Link href="/plot">Home</Link>');
    expect(plotPageSource).toContain('<Link href="/discover">Discover</Link>');
    expect(plotPageSource).toContain('Open UPRISE engagement wheel');
    expect(plotPageSource).toContain('UPRISE Wheel');
    expect(plotPageSource).toContain('getEngagementWheelActions(playerMode)');
    expect(plotPageSource).toContain('renderBottomNav()');
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

  it('keeps /plot reachable with an unresolved Home Scene guidance state instead of redirecting to onboarding', () => {
    const plotPageSource = readRepoFile('src/app/plot/page.tsx');

    expect(plotPageSource).toContain('Home Scene setup required');
    expect(plotPageSource).toContain('Complete Onboarding');
    expect(plotPageSource).not.toContain("router.replace('/onboarding')");
    expect(plotPageSource).not.toContain('if (!hasHomeScene) {\n    return null;');
  });

  it('locks feed copy to scene-scoped deterministic, non-personalized states', () => {
    const feedSource = readRepoFile('src/components/plot/SeedFeedPanel.tsx');

    expect(feedSource).toContain('Scene-scoped, reverse-chronological, and non-personalized.');
    expect(feedSource).toContain('No current scene activity for this context.');
    expect(feedSource).toContain('Retry Feed');
  });
});
