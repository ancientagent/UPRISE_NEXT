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
    expect(playerSource).toContain('Current track art thumbnail');
    expect(playerSource).toContain('Collection track art thumbnail');
    expect(playerSource).not.toContain("{isRadiyoMode ? 'RAD' : 'COL'}");
  });

  it('locks collection mode to selection entry and explicit eject return', () => {
    const playerSource = readRepoFile('src/components/plot/RadiyoPlayerPanel.tsx');
    const plotPageSource = readRepoFile('src/app/plot/page.tsx');

    expect(plotPageSource).toContain("const [playerMode, setPlayerMode] = useState<PlayerMode>('RADIYO')");
    expect(plotPageSource).toContain("const [activeBroadcastTier, setActiveBroadcastTier] = useState<PlayerTier | null>('city')");
    expect(playerSource).not.toContain("useState<PlayerMode>");
    expect(plotPageSource).toContain('onCollectionEject={handleCollectionEject}');
    expect(plotPageSource).toContain('activeBroadcastTier={activeBroadcastTier}');
    expect(plotPageSource).toContain("const collectionBroadcastLabel = selectedCollectionItem?.label ??");
    expect(plotPageSource).toContain("selectedCollectionItem?.id === collectionItem.id && playerMode === 'Collection'");
    expect(plotPageSource).toContain("const handleCollectionEject = () => {");
    expect(playerSource).not.toContain('Switch to Collection mode');
    expect(playerSource).toContain('Eject');
    expect(playerSource).toContain('aria-label="Eject to RADIYO"');
    expect(playerSource).toContain('onCollectionEject');
    expect(playerSource).toContain('Selection-driven collection queue');
    expect(playerSource).toContain('aria-label="Shuffle collection"');
    expect(plotPageSource).toContain('selectedCollectionItem?.label');
    expect(playerSource).not.toContain('onModeChange');
    expect(plotPageSource).toContain('const handleCollectionSelection =');
    expect(plotPageSource).toContain('const handleCollectionEject =');
    expect(plotPageSource).toContain("setPlayerMode('Collection')");
    expect(plotPageSource).toContain("setPlayerMode('RADIYO')");
    expect(plotPageSource).toContain('setActiveBroadcastTier((current) => current ?? selectedTier);');
    expect(plotPageSource).toContain('const handleTierChange = (tier: PlayerTier) => {');
    expect(plotPageSource).toContain('setActiveBroadcastTier((current) => (current === tier ? null : tier));');
    expect(plotPageSource).toContain('mode={playerMode}');
    expect(playerSource).not.toContain('setPlayerMode');
    expect(plotPageSource).toContain('collectionTitle={selectedCollectionItem?.label ?? null}');
    expect(plotPageSource).toContain('broadcastLabel={playerMode ===');
    expect(plotPageSource).toContain("selectedCollectionItem?.id === collectionItem.id && playerMode === 'Collection'");
    expect(plotPageSource).toContain("setSelectedCollectionItem(item)");
    expect(playerSource).not.toContain('Back to RADIYO');
  });

  it('keeps the collapsed profile strip to username plus notifications and options only', () => {
    const plotPageSource = readRepoFile('src/app/plot/page.tsx');

    expect(plotPageSource).not.toContain("user?.displayName?.[0] || user?.username?.[0] || 'U'");
    expect(plotPageSource).not.toContain('{profilePanelState}');
    expect(plotPageSource).toContain('aria-label="Notifications"');
    expect(plotPageSource).toContain('aria-label="More menu"');
  });

  it('keeps player controls tier-driven and wheel-driven instead of exposing forbidden transport buttons', () => {
    const playerSource = readRepoFile('src/components/plot/RadiyoPlayerPanel.tsx');

    expect(playerSource).toContain('Tap City, State, or National to start that broadcast. Tap the active tier again to stop.');
    expect(playerSource).toContain('Collection mode stays selection-driven. Use eject to return to RADIYO.');
    expect(playerSource).toContain("{activeBroadcastTier ? 'Live' : 'Stopped'}");
    expect(playerSource).toContain('aria-pressed={activeBroadcastTier === tier}');
    expect(playerSource).not.toContain('aria-label="Play"');
    expect(playerSource).not.toContain('aria-label="Pause"');
    expect(playerSource).not.toContain('aria-label="Add to collection"');
    expect(playerSource).not.toContain('Back to RADIYO');
    expect(playerSource).toContain("const tierOptions: PlayerTier[] = ['national', 'state', 'city'];");
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
    expect(plotPageSource).toContain("const [activeProfileSection, setActiveProfileSection] = useState<ExpandedProfileSection>('Singles/Playlists')");
    expect(plotPageSource).toContain('Return to Plot Tabs');
    expect(plotPageSource).not.toContain("const collectionShelves = ['Tracks', 'Playlists', 'Saved']");
    expect(plotPageSource).not.toContain('track-south-side-signal');
    expect(plotPageSource).not.toContain('track-lakefront-lights');
    expect(plotPageSource).toContain('const [plotProfile, setPlotProfile] = useState<PlotProfileRead | null>(null)');
    expect(plotPageSource).toContain("api.get<PlotProfileRead>(`/users/${user.id}/profile`, { token })");
    expect(plotPageSource).toContain('const singlesShelf = collectionShelves.find((shelf) => shelf.shelf === \'singles\') ?? null;');
    expect(plotPageSource).toContain('const uprisesShelf = collectionShelves.find((shelf) => shelf.shelf === \'uprises\') ?? null;');
    expect(plotPageSource).toContain('const fliersShelf = collectionShelves.find((shelf) => shelf.shelf === \'fliers\') ?? null;');
    expect(plotPageSource).toContain('Saved playlist groupings appear here when they are available in your collection.');
    expect(plotPageSource).toContain('No saved event artifacts or fliers yet.');
    expect(plotPageSource).toContain('No saved Uprises yet.');
    expect(plotPageSource).toContain('Saved promos and coupons appear here with status and expiration when collection support is available.');
  });

  it('locks expanded profile header to conditional band and promoter status cards', () => {
    const plotPageSource = readRepoFile('src/app/plot/page.tsx');

    expect(plotPageSource).toContain('const [promoterEntries, setPromoterEntries] = useState<RegistrarPromoterEntry[]>([])');
    expect(plotPageSource).toContain('listPromoterRegistrations(token)');
    expect(plotPageSource).toContain("label: 'Band Status'");
    expect(plotPageSource).toContain("label: 'Promoter Status'");
    expect(plotPageSource).not.toContain('Tier Snapshot');
  });

  it('locks Top Songs + Scene Activity to statistics-only placement', () => {
    const plotPageSource = readRepoFile('src/app/plot/page.tsx');

    expect(plotPageSource).toMatch(
      /activeTab === 'Statistics'[\s\S]*TopSongsPanel[\s\S]*Scene Activity Snapshot/
    );
  });

  it('keeps selected Plot community identity structural when tuple fields exist', () => {
    const plotPageSource = readRepoFile('src/app/plot/page.tsx');

    expect(plotPageSource).toContain("const selectedCommunityLabel = useMemo(() => formatPlotCommunityLabel(selectedCommunity), [selectedCommunity]);");
    expect(plotPageSource).toContain("return `${community.city}, ${community.state} • ${community.musicCommunity}`;");
    expect(plotPageSource).toContain('{selectedCommunityLabel ??');
    expect(plotPageSource).toContain('{selectedCommunityLabel ?? selectedCommunity.name}');
  });

  it('locks bottom nav and center UPRISE wheel trigger onto the /plot route', () => {
    const plotPageSource = readRepoFile('src/app/plot/page.tsx');

    expect(plotPageSource).toContain('aria-label="Plot bottom navigation"');
    expect(plotPageSource).toContain('data-slot="plot-bottom-nav"');
    expect(plotPageSource).toContain('href="/plot"');
    expect(plotPageSource).toContain('href="/discover"');
    expect(plotPageSource).toContain('plot-wire-nav-button');
    expect(plotPageSource).toContain('plot-wire-nav-center');
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

  it('locks pioneer follow-up discoverability to the existing notification icon on /plot', () => {
    const plotPageSource = readRepoFile('src/app/plot/page.tsx');

    expect(plotPageSource).toContain(
      'const { homeScene, pioneerFollowUp, tunedSceneId, tunedScene, isVisitor, setDiscoveryContext } = useOnboardingStore();',
    );
    expect(plotPageSource).toContain("const pioneerNotificationHomeScene = pioneerFollowUp?.homeScene ?? null;");
    expect(plotPageSource).toContain("const hasPioneerFollowUp = Boolean(pioneerNotificationHomeScene && hasHomeScene);");
    expect(plotPageSource).toContain('aria-label="Notifications"');
    expect(plotPageSource).toContain("aria-controls={hasPioneerFollowUp ? 'plot-pioneer-follow-up' : undefined}");
    expect(plotPageSource).toContain('onPointerDown={(event) => {');
    expect(plotPageSource).toContain('event.stopPropagation();');
    expect(plotPageSource).toContain('setIsNotificationPanelOpen((open) => !open)');
    expect(plotPageSource).toContain('Pioneer Follow-up');
    expect(plotPageSource).toContain('Your Home Scene is still pioneering.');
    expect(plotPageSource).toContain('nearest active city');
    expect(plotPageSource).toContain('establish or uprise your own city scene');
    expect(plotPageSource).toContain('aria-label="More menu"');
  });

  it('keeps /plot reachable with an unresolved Home Scene guidance state instead of redirecting to onboarding', () => {
    const plotPageSource = readRepoFile('src/app/plot/page.tsx');

    expect(plotPageSource).toContain('Home Scene setup required');
    expect(plotPageSource).toContain('Complete Onboarding');
    expect(plotPageSource).not.toContain("router.replace('/onboarding')");
    expect(plotPageSource).not.toContain('if (!hasHomeScene) {\n    return null;');
  });

  it('locks registrar access/status context onto the resolved plot route', () => {
    const plotPageSource = readRepoFile('src/app/plot/page.tsx');

    expect(plotPageSource).toContain("const [registrarSummary, setRegistrarSummary] = useState<RegistrarPlotSummary | null>(null)");
    expect(plotPageSource).toContain('listArtistBandRegistrations(token)');
    expect(plotPageSource).toContain('setRegistrarSummary(getRegistrarPlotSummary(response.entries ?? []))');
    expect(plotPageSource).toContain('Registrar Access');
    expect(plotPageSource).toContain('Sign in to view registrar status and continue registration work.');
    expect(plotPageSource).toContain('No Artist/Band registrar entries yet.');
    expect(plotPageSource).toContain('Open Registrar');
  });

  it('avoids protected community resolution reads for unsigned /plot states', () => {
    const plotPageSource = readRepoFile('src/app/plot/page.tsx');

    expect(plotPageSource).toContain('if (!token) return;');
    expect(plotPageSource).toContain('const tunedResponse = await getCommunityById(tunedSceneId, token);');
    expect(plotPageSource).toContain('const homeResponse = await resolveHomeCommunity(');
    expect(plotPageSource).toContain('musicCommunity: homeScene.musicCommunity,');
    expect(plotPageSource).toContain('token,');
  });

  it('keeps Top 40 in explicit signed-in terminal state instead of protected-read failure for unsigned statistics', () => {
    const topSongsSource = readRepoFile('src/components/plot/TopSongsPanel.tsx');

    expect(topSongsSource).toContain('if (!token) {');
    expect(topSongsSource).toContain("setSongs([]);");
    expect(topSongsSource).toContain("setError(null);");
    expect(topSongsSource).toContain("setLoading(false);");
    expect(topSongsSource).toContain("Sign in is required to load Top 40 songs for this scene context.");
    expect(topSongsSource).toContain('{ token }');
  });

  it('keeps Plot continuity visible through player context and does not point no-context users into locked Discover', () => {
    const plotPageSource = readRepoFile('src/app/plot/page.tsx');

    expect(plotPageSource).toContain('const discoveryContextFallback = useMemo(');
    expect(plotPageSource).toContain('mergeDiscoveryContextPatch(response, discoveryContextFallback)');
    expect(plotPageSource).not.toContain('SceneContextBadge');
    expect(plotPageSource).toContain('Scene Context');
    expect(plotPageSource).toContain('Selected Community');
    expect(plotPageSource).toContain('Open Community');
    expect(plotPageSource).toContain('Complete onboarding to anchor your Home Scene and unlock Plot context.');
    expect(plotPageSource).not.toContain('Browse Discover');
  });

  it('locks feed copy to scene-scoped deterministic, non-personalized states', () => {
    const feedSource = readRepoFile('src/components/plot/SeedFeedPanel.tsx');

    expect(feedSource).toContain('Scene-scoped, reverse-chronological, and non-personalized.');
    expect(feedSource).toContain('No current scene activity for this context.');
    expect(feedSource).toContain('Retry Feed');
  });
});
