import fs from 'node:fs';
import path from 'node:path';

const repoRoot = path.resolve(__dirname, '..');
const workspaceRoot = path.resolve(repoRoot, '..', '..');

function readRepoFile(relativePath: string): string {
  return fs.readFileSync(path.join(repoRoot, relativePath), 'utf8');
}

function readWorkspaceFile(relativePath: string): string {
  return fs.readFileSync(path.join(workspaceRoot, relativePath), 'utf8');
}

describe('/plot UX regression lock', () => {
  it('keeps historical mobile and screenshot docs out of the current UI lock list', () => {
    const uiBrief = readWorkspaceFile('docs/agent-briefs/UI_CURRENT.md');
    const referenceMarker = 'Reference / companion UI files:';

    expect(uiBrief).toContain(referenceMarker);

    const currentLocksSection = uiBrief.split('Current UI locks:')[1].split(referenceMarker)[0];
    const referenceSection = uiBrief
      .split(referenceMarker)[1]
      .split('Recent handoffs to use only after the locks above:')[0];

    expect(currentLocksSection).not.toContain('MVP_MOBILE_UX_SYSTEM_R1.md');
    expect(currentLocksSection).not.toContain('MVP_PLOT_PROFILE_SURFACE_SPEC_R1.md');
    expect(currentLocksSection).not.toContain('MVP_SCREENSHOT_ELEMENT_SPEC_R1.md');
    expect(referenceSection).toContain('MVP_MOBILE_UX_SYSTEM_R1.md');
    expect(referenceSection).toContain('MVP_PLOT_PROFILE_SURFACE_SPEC_R1.md');
    expect(referenceSection).toContain('MVP_SCREENSHOT_ELEMENT_SPEC_R1.md');
  });

  it('locks player mode labels to explicit RADIYO vs SPACE copy', () => {
    const playerSource = readRepoFile('src/components/plot/RadiyoPlayerPanel.tsx');

    expect(playerSource).toContain('RADIYO');
    expect(playerSource).toContain('SPACE');
  });

  it('locks panel-state ownership to the /plot route container', () => {
    const plotPageSource = readRepoFile('src/app/plot/page.tsx');
    const playerSource = readRepoFile('src/components/plot/RadiyoPlayerPanel.tsx');
    const topShellSource = readRepoFile('src/components/plot/PlotTopShell.tsx');

    expect(plotPageSource).toMatch(
      /useState<'collapsed' \| 'peek' \| 'expanded'>\(\s*'collapsed'\s*\)/
    );
    expect(plotPageSource).toContain("const isProfileExpanded = profilePanelState === 'expanded'");
    expect(plotPageSource).toContain('const seamLabel =');
    expect(plotPageSource).toContain("'Pull up or tap to collapse profile'");
    expect(plotPageSource).toContain("'Release to collapse or keep pulling to expand'");
    expect(plotPageSource).toContain("'Pull down profile'");
    expect(plotPageSource).toContain('onToggleProfilePanel={toggleProfilePanel}');
    expect(topShellSource).toContain('onClick={onToggleProfilePanel}');
    expect(topShellSource).toContain('aria-controls="plot-profile-panel"');
    expect(topShellSource).toContain('aria-expanded={isProfileExpanded}');
    expect(playerSource).not.toContain("useState<'collapsed' | 'peek' | 'expanded'>");
    expect(playerSource).not.toContain('setProfilePanelState');
  });

  it('locks compact player shell scaffolding for track row and tier stack', () => {
    const playerSource = readRepoFile('src/components/plot/RadiyoPlayerPanel.tsx');

    expect(playerSource).toContain("placement?: 'top' | 'profile-bottom';");
    expect(playerSource).toContain("placement = 'top',");
    expect(playerSource).toContain(
      "const isProfileBottomPlacement = placement === 'profile-bottom';"
    );
    expect(playerSource).toContain('data-slot="compact-player-shell"');
    expect(playerSource).toContain('data-placement={placement}');
    expect(playerSource).toContain('data-slot="bottom-player-marquee"');
    expect(playerSource).toContain('data-slot="player-track-row"');
    expect(playerSource).toContain('data-slot="player-tier-stack"');
    expect(playerSource).toContain('Current track art thumbnail');
    expect(playerSource).toContain('Space track art thumbnail');
    expect(playerSource).not.toContain("{isRadiyoMode ? 'RAD' : 'COL'}");
  });

  it('locks SPACE mode to selection entry and explicit return to RADIYO', () => {
    const playerSource = readRepoFile('src/components/plot/RadiyoPlayerPanel.tsx');
    const plotPageSource = readRepoFile('src/app/plot/page.tsx');
    const listenerProfileSource = readRepoFile('src/components/plot/PlotListenerProfile.tsx');

    expect(plotPageSource).toContain(
      "const [playerMode, setPlayerMode] = useState<PlayerMode>('RADIYO')"
    );
    expect(plotPageSource).toContain('() => playerTier ?? getMvpPlayerTier(tunedScene?.tier)');
    expect(plotPageSource).toMatch(
      /const \[activeBroadcastTier, setActiveBroadcastTier\] = useState<PlayerTier \| null>\(\s*initialPlayerTier\s*\)/
    );
    expect(playerSource).not.toContain('useState<PlayerMode>');
    expect(plotPageSource).toContain('onCollectionEject={handleCollectionEject}');
    expect(plotPageSource).toContain('activeBroadcastTier={activeBroadcastTier}');
    expect(plotPageSource).toMatch(
      /const collectionBroadcastLabel =\s*selectedCollectionItem\?\.label \?\?/
    );
    expect(listenerProfileSource).toMatch(
      /selectedCollectionItem\?\.id === collectionItem\.id &&\s*playerMode === 'SPACE'/
    );
    expect(plotPageSource).toContain('const handleCollectionEject = () => {');
    expect(playerSource).not.toContain('Switch to SPACE mode');
    expect(playerSource).toContain('Eject');
    expect(playerSource).toContain('aria-label="Return to RADIYO"');
    expect(playerSource).toContain('onCollectionEject');
    expect(playerSource).toContain('Selection-driven space queue');
    expect(playerSource).toContain('aria-label="Shuffle space"');
    expect(plotPageSource).toContain('selectedCollectionItem?.label');
    expect(playerSource).not.toContain('onModeChange');
    expect(plotPageSource).toContain('const handleCollectionSelection =');
    expect(plotPageSource).toContain('const handleCollectionEject =');
    expect(plotPageSource).toContain("setPlayerMode('SPACE')");
    expect(plotPageSource).toContain("setPlayerMode('RADIYO')");
    expect(plotPageSource).toContain(
      'setActiveBroadcastTier((current) => current ?? selectedTier);'
    );
    expect(plotPageSource).toContain('const handleTierChange = (tier: PlayerTier) => {');
    expect(plotPageSource).toContain("const nextTier = tier === 'national' ? 'state' : tier;");
    expect(plotPageSource).toMatch(
      /setActiveBroadcastTier\(\(current\) => \(current === nextTier \? null : nextTier\)\);/
    );
    expect(plotPageSource).toContain('setSelectedTier(initialPlayerTier);');
    expect(plotPageSource).toMatch(
      /setActiveBroadcastTier\(\(current\) => \(current === null \? null : initialPlayerTier\)\);/
    );
    expect(plotPageSource).toContain('setPlayerTier(nextTier);');
    expect(plotPageSource).toContain('mode={playerMode}');
    expect(playerSource).not.toContain('setPlayerMode');
    expect(plotPageSource).toContain('collectionTitle={selectedCollectionItem?.label ?? null}');
    expect(plotPageSource).toContain('broadcastLabel={playerMode ===');
    expect(listenerProfileSource).toMatch(
      /selectedCollectionItem\?\.id === collectionItem\.id &&\s*playerMode === 'SPACE'/
    );
    expect(plotPageSource).toContain('setSelectedCollectionItem(item)');
    expect(playerSource).not.toContain('Back to RADIYO');
  });

  it('keeps the collapsed profile strip to username plus notifications and options only', () => {
    const plotPageSource = readRepoFile('src/app/plot/page.tsx');
    const topShellSource = readRepoFile('src/components/plot/PlotTopShell.tsx');

    expect(plotPageSource).not.toContain("user?.displayName?.[0] || user?.username?.[0] || 'U'");
    expect(plotPageSource).not.toContain('<span>{profilePanelState}</span>');
    expect(topShellSource).not.toContain('<span>{profilePanelState}</span>');
    expect(plotPageSource).toContain("import PlotTopShell from '@/components/plot/PlotTopShell';");
    expect(plotPageSource).toContain('<PlotTopShell');
    expect(topShellSource).toContain('data-slot="plot-top-shell"');
    expect(topShellSource).toContain('data-slot="home-identity-layer"');
    expect(topShellSource).toContain('data-slot="listener-avatar-bust"');
    expect(topShellSource).toContain('data-slot="listener-recommendation-bubble"');
    expect(topShellSource).toContain('data-slot="home-identity-copy"');
    expect(topShellSource).toContain('data-slot="plot-top-shell-selector-player"');
    expect(topShellSource).toContain('flex-wrap');
    expect(topShellSource).toContain('sm:flex-nowrap');
    expect(topShellSource).toContain('basis-full');
    expect(topShellSource).toContain('sm:basis-auto');
    expect(topShellSource).toContain('Current recommendation');
    expect(topShellSource).toContain('UPRISE {homeCityLabel}');
    expect(topShellSource).toContain('aria-label="Notifications"');
    expect(topShellSource).toContain('aria-label="More menu"');
  });

  it('keeps the Plot top shell as identity plus Home Scene selector plus player, not transport', () => {
    const plotPageSource = readRepoFile('src/app/plot/page.tsx');
    const topShellSource = readRepoFile('src/components/plot/PlotTopShell.tsx');

    expect(plotPageSource).toContain('<PlotTopShell');
    expect(topShellSource).toContain('data-slot="plot-top-shell"');
    expect(topShellSource).toContain('data-slot="home-identity-layer"');
    expect(topShellSource).toContain('<HomeSceneSelector');
    expect(topShellSource).toContain('{isProfileExpanded ? null : playerPanel}');
    expect(topShellSource).toContain('data-slot="plot-top-shell-selector-player"');
    expect(plotPageSource).toContain("placement={isProfileExpanded ? 'profile-bottom' : 'top'}");
    expect(plotPageSource).not.toContain('data-slot="plot-transport"');
    expect(plotPageSource).not.toContain('Seek mode');
    expect(plotPageSource).not.toContain('Map view');
    expect(topShellSource).not.toContain('data-slot="plot-transport"');
    expect(topShellSource).not.toContain('Seek mode');
    expect(topShellSource).not.toContain('Map view');
  });

  it('keeps player controls tier-driven and wheel-driven instead of exposing forbidden transport buttons', () => {
    const playerSource = readRepoFile('src/components/plot/RadiyoPlayerPanel.tsx');
    const plotPageSource = readRepoFile('src/app/plot/page.tsx');

    expect(playerSource).toContain('radiyoFooter?: ReactNode;');
    expect(playerSource).toContain('isRadiyoMode && radiyoFooter ? (');
    expect(playerSource).toContain(
      'Tap City or State to start that broadcast. Tap the active tier again to stop.'
    );
    expect(playerSource).toContain(
      'SPACE stays selection-driven. Use return to go back to RADIYO.'
    );
    expect(playerSource).toContain("{activeBroadcastTier ? 'Live' : 'Stopped'}");
    expect(playerSource).toContain('aria-pressed={activeBroadcastTier === tier}');
    expect(playerSource).toContain('<audio');
    expect(playerSource).toContain('autoPlay');
    expect(playerSource).toContain('onEnded={handleTrackEnded}');
    expect(playerSource).toContain('trackQueue?: Track[];');
    expect(playerSource).not.toContain('aria-label="Play"');
    expect(playerSource).not.toContain('aria-label="Pause"');
    expect(playerSource).not.toContain('aria-label="Add to collection"');
    expect(playerSource).not.toContain('Back to RADIYO');
    expect(playerSource).toContain(
      "const MVP_PLAYER_TIER_OPTIONS: PlayerTier[] = ['state', 'city'];"
    );
    expect(plotPageSource).toContain("const nextTier = tier === 'national' ? 'state' : tier;");
    expect(plotPageSource).toMatch(
      /trackQueue=\{playerMode === 'RADIYO' \? currentRotationTracks : \[\]\}/
    );
    expect(plotPageSource).toContain(
      'const [selectedTier, setSelectedTier] = useState<PlayerTier>(initialPlayerTier);'
    );
  });

  it('locks engagement wheel actions to deterministic mode-specific sets', () => {
    const wheelSource = readRepoFile('src/components/plot/engagement-wheel.ts');
    const playerSource = readRepoFile('src/components/plot/RadiyoPlayerPanel.tsx');

    expect(wheelSource).toMatch(
      /export const RADIYO_WHEEL_ACTIONS: EngagementWheelAction\[] = \[\s*\{ label: 'Report' \},\s*\{ label: 'Skip' \},\s*\{ label: 'Play It Loud' \},\s*\{ label: 'Collect' \},\s*\{ label: 'Upvote' \},\s*\];/
    );
    expect(wheelSource).toMatch(
      /export const SPACE_WHEEL_ACTIONS: EngagementWheelAction\[] = \[\s*\{ label: 'Back', position: '9:00' \},\s*\{ label: 'Pause', position: '10:00' \},\s*\{ label: 'Blast', position: '12:00' \},\s*\{ label: 'Recommend', position: '1:00' \},\s*\{ label: 'Next', position: '3:00' \},\s*\];/
    );
    expect(wheelSource).toContain('export const RADIYO_WHEEL_ACTIONS');
    expect(wheelSource).toContain('export const SPACE_WHEEL_ACTIONS');
    expect(wheelSource).toContain("{ label: 'Report' }");
    expect(wheelSource).toContain("{ label: 'Skip' }");
    expect(wheelSource).toContain("{ label: 'Play It Loud' }");
    expect(wheelSource).toContain("{ label: 'Collect' }");
    expect(wheelSource).toContain("{ label: 'Upvote' }");
    expect(wheelSource).toContain("{ label: 'Back', position: '9:00' }");
    expect(wheelSource).toContain("{ label: 'Pause', position: '10:00' }");
    expect(wheelSource).toContain("{ label: 'Blast', position: '12:00' }");
    expect(wheelSource).toContain("{ label: 'Recommend', position: '1:00' }");
    expect(wheelSource).toContain("{ label: 'Next', position: '3:00' }");
    expect(playerSource).toContain('getEngagementWheelActions(mode)');
    expect(playerSource).toContain('Wheel: {wheelActions.map');
    expect(wheelSource).toContain(
      "return mode === 'RADIYO' ? RADIYO_WHEEL_ACTIONS : SPACE_WHEEL_ACTIONS;"
    );
    expect(wheelSource).toContain('label:');
    expect(wheelSource).toContain("'Play It Loud'");
    expect(wheelSource).toContain("'Blast'");
    expect(wheelSource).toContain("position?: '9:00' | '10:00' | '12:00' | '1:00' | '3:00';");
  });

  it('locks expanded-profile behavior to swap out Plot tabs/body', () => {
    const plotPageSource = readRepoFile('src/app/plot/page.tsx');
    const listenerProfileSource = readRepoFile('src/components/plot/PlotListenerProfile.tsx');
    const topShellSource = readRepoFile('src/components/plot/PlotTopShell.tsx');
    const expandedProfileBranch = plotPageSource
      .split('{isProfileExpanded ? (')[1]
      .split('\n        ) : (\n          <>')[0];

    expect(plotPageSource).toContain('const isProfileExpanded = profilePanelState ===');
    expect(plotPageSource).toContain('const playerPanel = (');
    expect(plotPageSource).toContain("placement={isProfileExpanded ? 'profile-bottom' : 'top'}");
    expect(topShellSource).toContain('{isProfileExpanded ? null : playerPanel}');
    expect(plotPageSource).toContain('{isProfileExpanded ? (');
    expect(plotPageSource).toContain('<PlotListenerProfile');
    expect(plotPageSource).toContain('playerPanel={playerPanel}');
    expect(plotPageSource).toContain('onReturnToPlotTabs={toggleProfilePanel}');
    expect(listenerProfileSource).toMatch(
      /<header[\s\S]*Profile Summary[\s\S]*Activity Score[\s\S]*Calendar[\s\S]*<\/header>[\s\S]*expandedProfileSections\.map[\s\S]*data-slot="expanded-profile-player-strip"[\s\S]*\{playerPanel\}[\s\S]*Return to Plot Tabs/
    );
    expect(plotPageSource).not.toContain('Player Context');
    expect(listenerProfileSource).toMatch(
      /export const expandedProfileSections = \[\s*'Singles\/Playlists',\s*'Events',\s*'Photos',\s*'Merch',\s*'Saved Uprises',\s*'Saved Promos\/Coupons',\s*\] as const;/
    );
    expect(listenerProfileSource).toContain('{expandedProfileSections.map((section) => (');
    expect(listenerProfileSource).toContain('Singles/Playlists');
    expect(listenerProfileSource).toContain('Events');
    expect(listenerProfileSource).toContain('Photos');
    expect(listenerProfileSource).toContain('Merch');
    expect(listenerProfileSource).toContain('Saved Uprises');
    expect(listenerProfileSource).toContain('Saved Promos/Coupons');
    expect(listenerProfileSource).toContain('Activity Score');
    expect(listenerProfileSource).toContain('Calendar');
    expect(plotPageSource).toMatch(
      /const \[activeProfileSection, setActiveProfileSection\] =\s*useState<ExpandedProfileSection>\('Singles\/Playlists'\)/
    );
    expect(listenerProfileSource).toContain('Return to Plot Tabs');
    expect(plotPageSource).not.toContain(
      "const collectionShelves = ['Tracks', 'Playlists', 'Saved']"
    );
    expect(plotPageSource).not.toContain('track-south-side-signal');
    expect(plotPageSource).not.toContain('track-lakefront-lights');
    expect(plotPageSource).toMatch(
      /const \[plotProfile, setPlotProfile\] = useState<PlotProfileRead \| null>\(null\);/
    );
    expect(plotPageSource).toContain(
      'api.get<PlotProfileRead>(`/users/${user.id}/profile`, { token })'
    );
    expect(listenerProfileSource).toContain(
      "const singlesShelf = collectionShelves.find((shelf) => shelf.shelf === 'singles') ?? null;"
    );
    expect(listenerProfileSource).toContain(
      "const uprisesShelf = collectionShelves.find((shelf) => shelf.shelf === 'uprises') ?? null;"
    );
    expect(listenerProfileSource).toContain(
      "const fliersShelf = collectionShelves.find((shelf) => shelf.shelf === 'fliers') ?? null;"
    );
    expect(listenerProfileSource).toMatch(
      /Saved playlist groupings appear here when they are available in your\s*collection\./
    );
    expect(listenerProfileSource).toContain('No saved event artifacts or fliers yet.');
    expect(listenerProfileSource).toContain('No saved Uprises or Away Scenes yet.');
    expect(listenerProfileSource).toMatch(
      /Saved promos and coupons appear here with status and expiration when\s*collection support is available\./
    );
    expect(plotPageSource).not.toContain("router.push(`/users");
    expect(plotPageSource).not.toContain('href={`/users');
    expect(plotPageSource).not.toContain('href="/users');
    expect(expandedProfileBranch).toContain('<PlotListenerProfile');
    expect(listenerProfileSource).toContain('Profile Summary');
    expect(listenerProfileSource).toContain('data-slot="expanded-profile-player-strip"');
    expect(listenerProfileSource).toContain('{playerPanel}');
    expect(listenerProfileSource).toContain('Return to Plot Tabs');
    expect(listenerProfileSource).toContain('SourceAccountSwitcher');
    expect(listenerProfileSource).toContain('data-slot="profile-source-identity-access"');
    expect(listenerProfileSource).toContain('managedArtistBands.length > 0');
    expect(listenerProfileSource).toContain('onSelectSource={onOpenSourceDashboard}');
    expect(listenerProfileSource).not.toContain('Source Dashboard');
    expect(listenerProfileSource).not.toContain('Release Deck');
    expect(listenerProfileSource).not.toContain('Print Shop');
    expect(listenerProfileSource).not.toContain('Registrar');
  });

  it('locks expanded profile header to conditional band and promoter status cards', () => {
    const plotPageSource = readRepoFile('src/app/plot/page.tsx');

    expect(plotPageSource).toMatch(
      /const \[promoterEntries, setPromoterEntries\] = useState<RegistrarPromoterEntry\[]>\(\[\]\)/
    );
    expect(plotPageSource).toContain('listPromoterRegistrations(token)');
    expect(plotPageSource).toContain("label: 'Band Status'");
    expect(plotPageSource).toContain("label: 'Promoter Status'");
    expect(plotPageSource).not.toContain('Tier Snapshot');
  });

  it('locks music-community preferences into the listener profile workspace', () => {
    const plotPageSource = readRepoFile('src/app/plot/page.tsx');
    const listenerProfileSource = readRepoFile('src/components/plot/PlotListenerProfile.tsx');

    expect(plotPageSource).toContain('getMusicCommunityPreferences(token)');
    expect(plotPageSource).toContain('addMusicCommunityPreference(musicCommunityPreferenceDraft, token)');
    expect(plotPageSource).toContain('setDefaultMusicCommunityPreference(musicCommunity, token)');
    expect(plotPageSource).toContain("const [musicCommunityPreferenceDraft, setMusicCommunityPreferenceDraft] = useState('');");
    expect(plotPageSource).toContain('MUSIC_COMMUNITIES.filter');
    expect(plotPageSource).toContain('resolvedSelectorMusicCommunities');
    expect(plotPageSource).toContain('homeSceneSelector.items.map((item) => item.musicCommunity.trim().toLowerCase())');
    expect(listenerProfileSource).toContain('resolvedSelectorMusicCommunities.has(');
    expect(listenerProfileSource).toContain('Music Communities');
    expect(listenerProfileSource).toContain('Add a music community');
    expect(listenerProfileSource).toContain('Make default');
    expect(listenerProfileSource).toContain('Default Home Scene');
    expect(listenerProfileSource).toContain('Shown in Home');
    expect(listenerProfileSource).toContain('Profile-only until active scene');
    expect(listenerProfileSource).toContain('Preferences stay in your profile and re-resolve when your current city changes.');
    expect(listenerProfileSource).not.toContain('Create community');
    expect(listenerProfileSource).not.toContain('Launch community');
    expect(listenerProfileSource).not.toContain('Source Dashboard');
    expect(listenerProfileSource).not.toContain('Release Deck');
    expect(listenerProfileSource).not.toContain('Print Shop');
    expect(listenerProfileSource).not.toContain('Registrar');
  });

  it('locks Home Scene selector into Plot as the active scene shortcut', () => {
    const plotPageSource = readRepoFile('src/app/plot/page.tsx');
    const selectorSource = readRepoFile('src/components/plot/HomeSceneSelector.tsx');
    const topShellSource = readRepoFile('src/components/plot/PlotTopShell.tsx');

    expect(plotPageSource).toContain(
      "import PlotTopShell from '@/components/plot/PlotTopShell';"
    );
    expect(plotPageSource).toContain('<PlotTopShell');
    expect(topShellSource).toContain("import HomeSceneSelector from '@/components/plot/HomeSceneSelector';");
    expect(topShellSource).toContain('<HomeSceneSelector');
    expect(topShellSource).toContain('selector={homeSceneSelector}');
    expect(topShellSource).toContain('selectedCommunityId={selectedCommunityId}');
    expect(topShellSource).toContain('onSelect={onHomeSceneSelect}');
    expect(plotPageSource).toContain('onHomeSceneSelect={handleHomeSceneSelectorSelect}');
    expect(plotPageSource).toContain('getHomeSceneSelector(token)');
    expect(plotPageSource).toContain('tuneDiscoverScene(item.sceneId, token)');
    expect(plotPageSource).toContain('getCommunityById(item.sceneId, token)');
    expect(plotPageSource).toContain('setSelectedCommunity(nextCommunity)');
    expect(plotPageSource).toContain('setDiscoveryContext(context)');
    expect(selectorSource).toContain('data-slot="home-scene-selector"');
    expect(selectorSource).not.toContain('Home Scene Roller');
    expect(selectorSource).not.toContain('Home Scene Selector</p>');
    expect(plotPageSource).not.toContain('homeSceneRoller');
    expect(selectorSource).toContain('const activeItem =');
    expect(selectorSource).toContain('const previousItem =');
    expect(selectorSource).toContain('const nextItem =');
    expect(selectorSource).toContain('Switch to previous Home Scene');
    expect(selectorSource).toContain('Switch to next Home Scene');
    expect(selectorSource).toContain('handlePointerDown');
    expect(selectorSource).toContain('handlePointerUp');
    expect(selectorSource).not.toContain('selector.items.map((item) =>');
    expect(selectorSource).toContain(
      "activeItem.resolution === 'proxy' ? 'Proxy Scene' : 'Home Scene'"
    );
    expect(selectorSource).not.toContain('Saved Away Scene Selector');
  });

  it('keeps activation context and saved Away Scenes in the listener profile, not the selector', () => {
    const plotPageSource = readRepoFile('src/app/plot/page.tsx');
    const selectorSource = readRepoFile('src/components/plot/HomeSceneSelector.tsx');
    const listenerProfileSource = readRepoFile('src/components/plot/PlotListenerProfile.tsx');

    expect(plotPageSource).toContain('savedAwayScenes: []');
    expect(plotPageSource).toContain('activationNotices: []');
    expect(listenerProfileSource).toContain('data-slot="profile-activation-notices"');
    expect(listenerProfileSource).toContain('data-slot="profile-saved-away-scenes"');
    expect(listenerProfileSource).toContain('Former proxy scene saved for listening context.');
    expect(listenerProfileSource).toContain('Voting follows your current verified Home Scene.');
    expect(selectorSource).not.toContain('savedAwayScenes');
    expect(selectorSource).not.toContain('profile-saved-away-scenes');
  });

  it('keeps Plot selector, profile, Archive, and Events out of general transport', () => {
    const plotPageSource = readRepoFile('src/app/plot/page.tsx');
    const selectorSource = readRepoFile('src/components/plot/HomeSceneSelector.tsx');
    const topShellSource = readRepoFile('src/components/plot/PlotTopShell.tsx');
    const listenerProfileSource = readRepoFile('src/components/plot/PlotListenerProfile.tsx');
    const tabBodySource = readRepoFile('src/components/plot/PlotPrimaryTabBody.tsx');
    const eventsSource = readRepoFile('src/components/plot/PlotEventsPanel.tsx');
    const plotSpec = readWorkspaceFile('docs/specs/communities/plot-and-scene-plot.md');
    const discoverySpec = readWorkspaceFile('docs/specs/communities/discovery-scene-switching.md');

    expect(plotSpec).toContain('Plot is not a transport surface.');
    expect(plotSpec).toContain(
      'Use the Home Scene selector to switch/select/tune among the listener'
    );
    expect(plotSpec).toContain(
      'Plot profile/collection UI must not present saved/custom Uprises as a Plot-launched playback mode.'
    );
    expect(discoverySpec).toContain(
      'General transport controls must not originate inside Plot.'
    );
    expect(discoverySpec).toContain(
      'Saved Uprises do not appear in the Home Scene selector'
    );
    expect(selectorSource).toContain(
      'Switch between registered music communities that resolve in your current city context.'
    );
    expect(selectorSource).toContain('Away Scenes stay in your profile collection.');
    expect(selectorSource).not.toContain('Saved Uprise');
    expect(selectorSource).not.toContain('Map view');
    expect(selectorSource).not.toContain('Seek mode');
    expect(topShellSource).not.toContain('Travel');
    expect(topShellSource).not.toContain('Map view');
    expect(topShellSource).not.toContain('Seek mode');
    expect(listenerProfileSource).toContain('Saved Uprises');
    expect(listenerProfileSource).toContain('data-slot="profile-saved-away-scenes"');
    expect(listenerProfileSource).not.toContain('onSavedUprisePlay');
    expect(listenerProfileSource).not.toContain('travelHref');
    expect(listenerProfileSource).not.toContain('Map view');
    expect(listenerProfileSource).not.toContain('Seek mode');
    expect(tabBodySource).not.toContain('travelHref');
    expect(tabBodySource).not.toContain('Map view');
    expect(tabBodySource).not.toContain('Seek mode');
    expect(eventsSource).not.toContain('travelHref');
    expect(eventsSource).not.toContain('Map view');
    expect(eventsSource).not.toContain('Seek mode');
    expect(plotPageSource).toContain('tuneDiscoverScene(item.sceneId, token)');
    expect(plotPageSource).not.toContain('data-slot="plot-transport"');
    expect(plotPageSource).not.toContain('onSavedUprisePlay');
  });

  it('locks Top Songs + Scene Activity to archive-only placement', () => {
    const plotPrimaryTabBodySource = readRepoFile('src/components/plot/PlotPrimaryTabBody.tsx');

    expect(plotPrimaryTabBodySource).toMatch(
      /activeTab === 'Archive'[\s\S]*TopSongsPanel[\s\S]*Scene Activity Snapshot/
    );
  });

  it('keeps selected Plot community identity structural when tuple fields exist', () => {
    const plotPageSource = readRepoFile('src/app/plot/page.tsx');

    expect(plotPageSource).toMatch(
      /const selectedCommunityLabel = useMemo\(\s*\(\) => formatPlotCommunityLabel\(selectedCommunity\),\s*\[selectedCommunity\]\s*\);/
    );
    expect(plotPageSource).toContain(
      'return `${community.city}, ${community.state} • ${community.musicCommunity}`;'
    );
    expect(plotPageSource).toContain('selectedCommunityLabel={selectedCommunityLabel}');
  });

  it('locks bottom nav and center UPRISE wheel trigger onto the /plot route', () => {
    const plotPageSource = readRepoFile('src/app/plot/page.tsx');
    const bottomNavSource = readRepoFile('src/components/plot/PlotBottomNav.tsx');

    expect(plotPageSource).toContain("import PlotBottomNav from '@/components/plot/PlotBottomNav';");
    expect(plotPageSource).toContain('<PlotBottomNav');
    expect(plotPageSource).toContain('isEngagementWheelOpen={isEngagementWheelOpen}');
    expect(plotPageSource).toContain('playerMode={playerMode}');
    expect(plotPageSource).toContain('wheelActions={wheelActions}');
    expect(plotPageSource).toContain(
      'onToggleEngagementWheel={() => setIsEngagementWheelOpen((value) => !value)}'
    );
    expect(plotPageSource).toContain(
      'onCloseEngagementWheel={() => setIsEngagementWheelOpen(false)}'
    );
    expect(plotPageSource).toContain('const bottomNav = (');
    expect(plotPageSource).toContain('{bottomNav}');
    expect(bottomNavSource).toContain('aria-label="Plot bottom navigation"');
    expect(bottomNavSource).toContain('data-slot="plot-bottom-nav"');
    expect(bottomNavSource).toContain('href="/plot"');
    expect(bottomNavSource).toContain('plot-wire-nav-button');
    expect(bottomNavSource).toContain('plot-wire-nav-center');
    expect(bottomNavSource).toContain('Open UPRISE engagement wheel');
    expect(bottomNavSource).toContain('UPRISE Wheel');
    expect(bottomNavSource).toContain('Discover');
    expect(bottomNavSource).toContain(
      'Discover is coming soon while MVP stays local-community-only.'
    );
    expect(bottomNavSource).toContain('Soon');
    expect(bottomNavSource).toContain('aria-disabled="true"');
    expect(plotPageSource).toContain('getEngagementWheelActions(playerMode)');
  });

  it('locks primary Plot tab ownership to explicit Feed/Events/Archive bodies', () => {
    const plotPageSource = readRepoFile('src/app/plot/page.tsx');
    const plotPrimaryTabBodySource = readRepoFile('src/components/plot/PlotPrimaryTabBody.tsx');

    expect(plotPageSource).toContain("const tabs = ['Feed', 'Events', 'Archive'] as const;");
    expect(plotPageSource).not.toContain('Social');
    expect(plotPrimaryTabBodySource).toContain("if (activeTab === 'Feed')");
    expect(plotPrimaryTabBodySource).toContain('SeedFeedPanel');
    expect(plotPrimaryTabBodySource).toContain("if (activeTab === 'Events')");
    expect(plotPrimaryTabBodySource).toContain('PlotEventsPanel');
    expect(plotPrimaryTabBodySource).toContain("if (activeTab === 'Archive')");
    expect(plotPageSource).not.toContain('StatisticsPanel');
    expect(plotPrimaryTabBodySource).toContain('TopSongsPanel');
    expect(plotPrimaryTabBodySource).toContain('Scene Activity Snapshot');
    expect(plotPageSource).not.toContain("if (activeTab === 'Promotions')");
    expect(plotPageSource).not.toContain('PlotPromotionsPanel');
    expect(plotPageSource).not.toContain("if (activeTab === 'Statistics')");
    expect(plotPageSource).toContain('renderPrimaryPlotTabBody()');
  });

  it('keeps Archive descriptive instead of reviving map or analytics exploration', () => {
    const plotPageSource = readRepoFile('src/app/plot/page.tsx');
    const plotPrimaryTabBodySource = readRepoFile('src/components/plot/PlotPrimaryTabBody.tsx');

    expect(plotPageSource).toContain("const plotTabHeading = activeTab === 'Archive' ? 'Scene Archive' : activeTab;");
    expect(plotPrimaryTabBodySource).toContain('Archive is read-only descriptive history for the current Plot context.');
    expect(plotPrimaryTabBodySource).toContain('This is not a ranking or authority');
    expect(plotPrimaryTabBodySource).not.toContain('Archive & Map');
    expect(plotPrimaryTabBodySource).not.toContain('SceneMap');
    expect(plotPageSource).not.toContain('nearby-community');
    expect(plotPageSource).not.toContain('leaderboard');
    expect(plotPageSource).not.toContain('predictive analytics');
    expect(plotPageSource).not.toContain('comparative artist scoring');
  });

  it('locks proxy scene notice discoverability to the existing notification icon on /plot', () => {
    const plotPageSource = readRepoFile('src/app/plot/page.tsx');
    const topShellSource = readRepoFile('src/components/plot/PlotTopShell.tsx');

    expect(plotPageSource).toContain('playerTier,');
    expect(plotPageSource).toContain(
      'const pioneerNotificationHomeScene = pioneerFollowUp?.homeScene ?? null;'
    );
    expect(plotPageSource).toContain(
      'const hasPioneerFollowUp = Boolean(pioneerNotificationHomeScene && hasHomeScene);'
    );
    expect(topShellSource).toContain('aria-label="Notifications"');
    expect(topShellSource).toContain(
      "aria-controls={hasPioneerFollowUp ? 'plot-pioneer-follow-up' : undefined}"
    );
    expect(topShellSource).toContain('onPointerDown={(event) => {');
    expect(topShellSource).toContain('event.stopPropagation();');
    expect(plotPageSource).toContain('setIsNotificationPanelOpen((open) => !open)');
    expect(topShellSource).toContain('Proxy Scene Notice');
    expect(topShellSource).toContain('Your submitted Home Scene is not active yet.');
    expect(topShellSource).toContain('nearest active city');
    expect(topShellSource).toContain('tell local bands and artists to register with UPRISE');
    expect(topShellSource).toContain('aria-label="More menu"');
  });

  it('keeps /plot reachable with an unresolved Home Scene guidance state instead of redirecting to onboarding', () => {
    const plotPageSource = readRepoFile('src/app/plot/page.tsx');

    expect(plotPageSource).toContain('Home Scene setup required');
    expect(plotPageSource).toContain('Complete Onboarding');
    expect(plotPageSource).not.toContain("router.replace('/onboarding')");
    expect(plotPageSource).not.toContain('if (!hasHomeScene) {\n    return null;');
  });

  it('keeps registrar and source tools out of the non-expanded Plot body', () => {
    const plotPageSource = readRepoFile('src/app/plot/page.tsx');
    const sourceDashboardSource = readRepoFile('src/app/source-dashboard/page.tsx');
    const artistSource = readRepoFile('src/app/artist-bands/[id]/page.tsx');

    expect(plotPageSource).toContain(
      'const [registrarSummary, setRegistrarSummary] = useState<RegistrarPlotSummary | null>(null)'
    );
    expect(plotPageSource).toContain('listArtistBandRegistrations(token)');
    expect(plotPageSource).toContain(
      'setRegistrarSummary(getRegistrarPlotSummary(response.entries ?? []))'
    );
    expect(plotPageSource).not.toContain('PlotCommunityContextPanel');
    expect(plotPageSource).not.toContain('SourceAccountSwitcher');
    expect(plotPageSource).not.toContain('Registrar Access');
    expect(plotPageSource).not.toContain('Open Registrar');
    expect(plotPageSource).not.toContain('Selected Community');
    expect(plotPageSource).not.toContain('Open Community');
    expect(plotPageSource).not.toContain("router.push('/print-shop')");
    expect(plotPageSource).not.toContain('Open Print Shop');
    expect(sourceDashboardSource).toContain('<Link href="/print-shop">Open Print Shop</Link>');
    expect(artistSource).toContain(
      '<Link href="/print-shop" onClick={() => setActiveSourceId(profile.id, user?.id ?? null)}>'
    );
  });

  it('avoids protected community resolution reads for unsigned /plot states', () => {
    const plotPageSource = readRepoFile('src/app/plot/page.tsx');

    expect(plotPageSource).toContain('if (!token) return;');
    expect(plotPageSource).toContain('shouldUseTunedSceneAsDefaultPlotAnchor(tunedScene)');
    expect(plotPageSource).toContain(
      'const tunedResponse = await getCommunityById(tunedSceneId, token);'
    );
    expect(plotPageSource).toContain('const homeResponse = await resolveHomeCommunity(');
    expect(plotPageSource).toContain('musicCommunity: homeScene.musicCommunity,');
    expect(plotPageSource).toContain('token,');
  });

  it('keeps Top 40 in explicit signed-in terminal state instead of protected-read failure for unsigned statistics', () => {
    const topSongsSource = readRepoFile('src/components/plot/TopSongsPanel.tsx');

    expect(topSongsSource).toContain('if (!token) {');
    expect(topSongsSource).toContain('setSongs([]);');
    expect(topSongsSource).toContain('setError(null);');
    expect(topSongsSource).toContain('setLoading(false);');
    expect(topSongsSource).toContain(
      'Sign in is required to load Top 40 songs for this scene context.'
    );
    expect(topSongsSource).toContain('{ token }');
    expect(topSongsSource).toContain('artistBandId: string | null;');
    expect(topSongsSource).toContain(
      'href={`/artist-bands/${track.artistBandId}?trackId=${track.trackId}`}'
    );
  });

  it('keeps track-release feed items wired into artist-page listening without adding inline card actions', () => {
    const seedFeedSource = readRepoFile('src/components/plot/SeedFeedPanel.tsx');

    expect(seedFeedSource).toContain("if (item.type !== 'track_release') return null;");
    expect(seedFeedSource).toContain(
      'return `/artist-bands/${source.id}?trackId=${item.entity.id}`;'
    );
    expect(seedFeedSource).toContain('{trackHref ? (');
    expect(seedFeedSource).not.toContain('Collect from this listening context');
  });

  it('keeps listener Blast cards as Feed rows whose blasted signal links to its source', () => {
    const seedFeedSource = readRepoFile('src/components/plot/SeedFeedPanel.tsx');
    const plotSpec = readWorkspaceFile('docs/specs/communities/plot-and-scene-plot.md');
    const discoverySpec = readWorkspaceFile('docs/specs/communities/discovery-scene-switching.md');

    expect(plotSpec).toContain(
      'a `Blast card` is a Feed card type for listener `Blast` activity'
    );
    expect(plotSpec).toContain(
      'every Blast card must expose a link from the blasted signal to that signal'
    );
    expect(discoverySpec).toContain(
      'Listener Blast activity cards are Feed cards, not discovery inserts.'
    );
    expect(seedFeedSource).toContain("case 'blast':");
    expect(seedFeedSource).toContain("return 'Blast';");
    expect(seedFeedSource).toContain(
      'function sourceFromMetadata(item: CommunityFeedItem): { id: string; name: string } | null'
    );
    expect(seedFeedSource).toContain('const source = sourceFromMetadata(item);');
    expect(seedFeedSource).toMatch(
      /trackHref && source \? \(\s*source\.name\s*\) : source \? \(\s*<Link className="underline underline-offset-2" href=\{`\/artist-bands\/\$\{source\.id\}`\}>/
    );
    expect(seedFeedSource).not.toContain('data-slot="plot-blast-panel"');
    expect(seedFeedSource).not.toContain('data-slot="blast-destination"');
  });

  it('keeps Feed-card Travel as future contract language without launch-runtime activation', () => {
    const seedFeedSource = readRepoFile('src/components/plot/SeedFeedPanel.tsx');
    const plotPageSource = readRepoFile('src/app/plot/page.tsx');
    const topShellSource = readRepoFile('src/components/plot/PlotTopShell.tsx');
    const bottomNavSource = readRepoFile('src/components/plot/PlotBottomNav.tsx');
    const discoverPageSource = readRepoFile('src/app/discover/page.tsx');
    const plotSpec = readWorkspaceFile('docs/specs/communities/plot-and-scene-plot.md');
    const discoverySpec = readWorkspaceFile('docs/specs/communities/discovery-scene-switching.md');

    expect(plotSpec).toContain(
      'Feed-card `Travel` is a future-safe card contract, not launch activation'
    );
    expect(plotSpec).toContain(
      'the source link opens the source object, while `Travel` opens the'
    );
    expect(discoverySpec).toContain(
      'Feed-card `Travel` is contract-ready for future outside-Uprise cards'
    );
    expect(discoverySpec).toContain(
      'The presence of this Feed-card `Travel` contract must not be read as making'
    );
    expect(seedFeedSource).not.toContain('>Travel<');
    expect(seedFeedSource).not.toContain('Travel</');
    expect(seedFeedSource).not.toContain('travelHref');
    expect(seedFeedSource).not.toContain('href="/discover"');
    expect(plotPageSource).not.toContain('data-slot="plot-transport"');
    expect(plotPageSource).not.toContain('travelHref');
    expect(topShellSource).not.toContain('Travel');
    expect(topShellSource).not.toContain('Seek mode');
    expect(bottomNavSource).toContain(
      'Discover is coming soon while MVP stays local-community-only.'
    );
    expect(discoverPageSource).toContain('Coming Soon');
    expect(discoverPageSource).toContain('MVP is local-community-only.');
  });

  it('keeps the first feed insert as a read-only Popular Singles carousel with artist-page signal handoff', () => {
    const seedFeedSource = readRepoFile('src/components/plot/SeedFeedPanel.tsx');

    expect(seedFeedSource).toContain('getCommunityDiscoverHighlights');
    expect(seedFeedSource).toContain('plot-feed-popular-singles-insert');
    expect(seedFeedSource).toContain('Popular Singles');
    expect(seedFeedSource).toContain('Most Added');
    expect(seedFeedSource).toContain('Recent Rises');
    expect(seedFeedSource).toContain('Read-only artist/song launch squares.');
    expect(seedFeedSource).toContain('aria-label={`Scroll ${title} left`}');
    expect(seedFeedSource).toContain('aria-label={`Scroll ${title} right`}');
    expect(seedFeedSource).toContain(
      'return `/artist-bands/${artistBandId}?signalId=${signal.signalId}`;'
    );
    expect(seedFeedSource).not.toContain('Collect from this listening context');
    expect(seedFeedSource).not.toContain('Blast this track');
    expect(seedFeedSource).not.toContain('Follow artist');
  });

  it('keeps buzz as a read-only recommendation insert with artist-page signal handoff', () => {
    const seedFeedSource = readRepoFile('src/components/plot/SeedFeedPanel.tsx');

    expect(seedFeedSource).toContain('plot-feed-buzz-insert');
    expect(seedFeedSource).toContain('Buzz');
    expect(seedFeedSource).toContain(
      'Listener recommendations from this community, surfaced without inline actions.'
    );
    expect(seedFeedSource).toContain('Community buzz');
    expect(seedFeedSource).toContain('Read-only listener recommendation squares.');
    expect(seedFeedSource).toContain('aria-label="Scroll Buzz left"');
    expect(seedFeedSource).toContain('aria-label="Scroll Buzz right"');
    expect(seedFeedSource).toContain(
      'Recommended by {recommendation.actor.displayName || recommendation.actor.username}'
    );
    expect(seedFeedSource).toContain('const href = discoverSignalHref(recommendation.signal);');
    expect(seedFeedSource).not.toContain('Collect from this listening context');
    expect(seedFeedSource).not.toContain('Blast this track');
    expect(seedFeedSource).not.toContain('Follow artist');
  });

  it('keeps upcoming-events as a read-only feed insert without inline calendar actions', () => {
    const seedFeedSource = readRepoFile('src/components/plot/SeedFeedPanel.tsx');

    expect(seedFeedSource).toContain('plot-feed-upcoming-events-insert');
    expect(seedFeedSource).toContain('Upcoming Events');
    expect(seedFeedSource).toContain('Read-only event snapshots from the current scene context.');
    expect(seedFeedSource).toContain('Upcoming this week');
    expect(seedFeedSource).toContain('Read-only event squares with no inline calendar actions.');
    expect(seedFeedSource).toContain('aria-label="Scroll Upcoming Events left"');
    expect(seedFeedSource).toContain('aria-label="Scroll Upcoming Events right"');
    expect(seedFeedSource).toContain('getCommunityEvents(');
    expect(seedFeedSource).toContain('getActiveCommunityEvents(');
    expect(seedFeedSource).not.toContain('Add to calendar');
    expect(seedFeedSource).not.toContain('Collect from this listening context');
    expect(seedFeedSource).not.toContain('Blast this track');
  });

  it('keeps Plot continuity visible through player context and does not point no-context users into locked Discover', () => {
    const plotPageSource = readRepoFile('src/app/plot/page.tsx');
    const listenerProfileSource = readRepoFile('src/components/plot/PlotListenerProfile.tsx');

    expect(plotPageSource).toContain('const discoveryContextFallback = useMemo(');
    expect(plotPageSource).toContain(
      'mergeDiscoveryContextPatch(response, discoveryContextFallback)'
    );
    expect(plotPageSource).not.toContain('SceneContextBadge');
    expect(listenerProfileSource).toContain('Scene Context');
    expect(plotPageSource).toContain(
      'Complete onboarding to anchor your Home Scene and unlock Plot context.'
    );
    expect(plotPageSource).not.toContain('Browse Discover');
  });

  it('locks feed copy to scene-scoped deterministic, non-personalized states', () => {
    const feedSource = readRepoFile('src/components/plot/SeedFeedPanel.tsx');

    expect(feedSource).toContain('Scene-scoped, reverse-chronological, and non-personalized.');
    expect(feedSource).toContain('No current scene activity for this context.');
    expect(feedSource).toContain('Retry Feed');
  });
});
