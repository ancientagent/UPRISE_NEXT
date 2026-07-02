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

function extractFunctionBody(source: string, declaration: string): string {
  const start = source.indexOf(declaration);
  expect(start).toBeGreaterThanOrEqual(0);
  const arrowStart = source.indexOf('=>', start);
  expect(arrowStart).toBeGreaterThanOrEqual(0);
  const braceStart = source.indexOf('{', arrowStart);
  expect(braceStart).toBeGreaterThanOrEqual(0);

  let depth = 0;
  for (let index = braceStart; index < source.length; index += 1) {
    const char = source[index];
    if (char === '{') depth += 1;
    if (char === '}') {
      depth -= 1;
      if (depth === 0) {
        return source.slice(braceStart, index + 1);
      }
    }
  }

  throw new Error(`Unable to extract function body for ${declaration}`);
}

describe('Plot profile/player state contract', () => {
  it('keeps the current contract grounded in repo authority rather than prototype state-machine imports', () => {
    const inventory = readWorkspaceFile('docs/handoff/2026-07-02_ux-reference-extraction-inventory.md');
    const plotPageSource = readRepoFile('src/app/plot/page.tsx');
    const playerSource = readRepoFile('src/components/plot/RadiyoPlayerPanel.tsx');
    const profileSource = readRepoFile('src/components/plot/PlotListenerProfile.tsx');
    const topShellSource = readRepoFile('src/components/plot/PlotTopShell.tsx');

    expect(inventory).toContain('Do not merge route/runtime wholesale.');
    expect(inventory).toContain('Replace old `collection` wording with current `SPACE`');
    expect(inventory).toContain('Remove active `national` player tier assumptions');
    expect(plotPageSource).not.toContain('plot-ui-state-machine');
    expect(playerSource).not.toContain('plot-ui-state-machine');
    expect(profileSource).not.toContain('plot-ui-state-machine');
    expect(topShellSource).not.toContain('plot-ui-state-machine');
  });

  it('keeps profile expansion state owned by /plot while player/profile components stay controlled', () => {
    const plotPageSource = readRepoFile('src/app/plot/page.tsx');
    const playerSource = readRepoFile('src/components/plot/RadiyoPlayerPanel.tsx');
    const profileSource = readRepoFile('src/components/plot/PlotListenerProfile.tsx');
    const topShellSource = readRepoFile('src/components/plot/PlotTopShell.tsx');

    expect(plotPageSource).toMatch(
      /const \[profilePanelState, setProfilePanelState\] = useState<'collapsed' \| 'peek' \| 'expanded'>\(\s*'collapsed'\s*\)/
    );
    expect(plotPageSource).toContain("const isProfileExpanded = profilePanelState === 'expanded'");
    expect(plotPageSource).toContain('const toggleProfilePanel = () => {');
    expect(plotPageSource).toContain("setProfilePanelState('collapsed');");
    expect(plotPageSource).toContain("setProfilePanelState('expanded');");
    expect(plotPageSource).toContain('const playerPanel = (');
    expect(plotPageSource).toContain("placement={isProfileExpanded ? 'profile-bottom' : 'top'}");
    expect(plotPageSource).toContain('playerPanel={playerPanel}');
    expect(topShellSource).toContain('{isProfileExpanded ? null : playerPanel}');
    expect(profileSource).toContain('data-slot="expanded-profile-player-strip"');
    expect(profileSource).toContain('{playerPanel}');
    expect(playerSource).toContain("placement?: 'top' | 'profile-bottom';");
    expect(playerSource).toContain("const isProfileBottomPlacement = placement === 'profile-bottom';");

    expect(playerSource).not.toContain('setProfilePanelState');
    expect(profileSource).not.toContain('setProfilePanelState');
    expect(topShellSource).not.toContain('setProfilePanelState');
  });

  it('keeps SPACE as collection-selection state and ejects back to RADIYO without old collection-mode controls', () => {
    const plotPageSource = readRepoFile('src/app/plot/page.tsx');
    const playerSource = readRepoFile('src/components/plot/RadiyoPlayerPanel.tsx');
    const profileSource = readRepoFile('src/components/plot/PlotListenerProfile.tsx');
    const handleCollectionSelection = extractFunctionBody(
      plotPageSource,
      'const handleCollectionSelection = (item:'
    );
    const handleCollectionEject = extractFunctionBody(
      plotPageSource,
      'const handleCollectionEject = () =>'
    );
    const handleHomeSceneSelectorSelect = extractFunctionBody(
      plotPageSource,
      'const handleHomeSceneSelectorSelect = async (item: HomeSceneSelectorItem) =>'
    );

    expect(plotPageSource).toContain(
      "const [playerMode, setPlayerMode] = useState<PlayerMode>('RADIYO')"
    );
    expect(handleCollectionSelection).toContain('setSelectedCollectionItem(item);');
    expect(handleCollectionSelection).toContain("setPlayerMode('SPACE');");
    expect(handleCollectionEject).toContain("setPlayerMode('RADIYO');");
    expect(handleCollectionEject).toContain('setActiveBroadcastTier((current) => current ?? selectedTier);');
    expect(handleHomeSceneSelectorSelect).toContain('setSelectedCollectionItem(null);');
    expect(handleHomeSceneSelectorSelect).toContain("setPlayerMode('RADIYO');");
    expect(profileSource).toContain("playerMode === 'SPACE'");
    expect(profileSource).toContain('Select to enter your space');
    expect(playerSource).toContain('aria-label="Return to RADIYO"');
    expect(playerSource).toContain('Eject');
    expect(playerSource).toContain('SPACE stays selection-driven. Use return to go back to RADIYO.');

    expect(playerSource).not.toContain('onModeChange');
    expect(playerSource).not.toContain('Switch to SPACE mode');
    expect(playerSource).not.toContain('Back to RADIYO');
    expect(playerSource).not.toContain("'collection'");
    expect(plotPageSource).not.toContain("'collection'");
  });

  it('keeps MVP player tier state city/state-only at the UI while coercing national to state', () => {
    const plotPageSource = readRepoFile('src/app/plot/page.tsx');
    const playerSource = readRepoFile('src/components/plot/RadiyoPlayerPanel.tsx');
    const tierGuardSource = readRepoFile('src/components/plot/tier-guard.ts');
    const handleTierChange = extractFunctionBody(
      plotPageSource,
      'const handleTierChange = (tier: PlayerTier) =>'
    );

    expect(playerSource).toContain("const MVP_PLAYER_TIER_OPTIONS: PlayerTier[] = ['state', 'city'];");
    expect(playerSource).toContain('MVP_PLAYER_TIER_OPTIONS.map((tier) => (');
    expect(handleTierChange).toContain("const nextTier = tier === 'national' ? 'state' : tier;");
    expect(handleTierChange).toContain('setSelectedTier(nextTier);');
    expect(handleTierChange).toContain('setPlayerTier(nextTier);');
    expect(handleTierChange).toContain("setPlayerMode('RADIYO');");
    expect(tierGuardSource).toContain("return tunedTier === 'state' || tunedTier === 'national' ? 'state' : 'city';");
    expect(playerSource).not.toMatch(/MVP_PLAYER_TIER_OPTIONS[\s\S]*'national'/);
  });

  it('keeps Plot player/profile state separate from Discover transport and stale tab surfaces', () => {
    const plotPageSource = readRepoFile('src/app/plot/page.tsx');
    const playerSource = readRepoFile('src/components/plot/RadiyoPlayerPanel.tsx');
    const profileSource = readRepoFile('src/components/plot/PlotListenerProfile.tsx');
    const topShellSource = readRepoFile('src/components/plot/PlotTopShell.tsx');
    const combined = `${plotPageSource}\n${playerSource}\n${profileSource}\n${topShellSource}`;

    expect(plotPageSource).toContain("const tabs = ['Feed', 'Events', 'Archive'] as const;");
    expect(plotPageSource).toContain('onHomeSceneSelect={handleHomeSceneSelectorSelect}');
    expect(topShellSource).toContain('<HomeSceneSelector');
    expect(combined).not.toContain('data-slot="plot-transport"');
    expect(combined).not.toContain('Seek mode');
    expect(combined).not.toContain('Map view');
    expect(combined).not.toContain('Discovery Pass');
    expect(plotPageSource).not.toContain('StatisticsPanel');
    expect(plotPageSource).not.toContain('PlotPromotionsPanel');
    expect(plotPageSource).not.toContain("if (activeTab === 'Statistics')");
    expect(plotPageSource).not.toContain("if (activeTab === 'Promotions')");
  });
});
