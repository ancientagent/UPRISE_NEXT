import fs from 'node:fs';
import path from 'node:path';

const repoRoot = path.resolve(__dirname, '..');

function readRepoFile(relativePath: string): string {
  return fs.readFileSync(path.join(repoRoot, relativePath), 'utf8');
}

describe('community and artist wireframe page locks', () => {
  it('keeps the community page on the shared wireframe shell and preserves the Plot handoff CTA', () => {
    const communitySource = readRepoFile('src/app/community/[id]/page.tsx');

    expect(communitySource).toContain('plot-wire-page');
    expect(communitySource).toContain('plot-wire-frame');
    expect(communitySource).toContain('plot-wire-card');
    expect(communitySource).toContain('plot-wire-panel');
    expect(communitySource).toContain('Visit Scene in Plot');
  });

  it('keeps the artist page on the shared wireframe shell while preserving familiar profile sections', () => {
    const artistSource = readRepoFile('src/app/artist-bands/[id]/page.tsx');

    expect(artistSource).toContain('plot-wire-page');
    expect(artistSource).toContain('plot-wire-frame');
    expect(artistSource).toContain('plot-wire-card');
    expect(artistSource).toContain('const viewerCanOpenPrintShop = useMemo(() => {');
    expect(artistSource).toContain('profile.members.some((member) => member.userId === user.id)');
    expect(artistSource).toContain(
      'const sourceContextMatchesProfile = activeSourceId === profile?.id && activeSourceUserId === user?.id;'
    );
    expect(artistSource).toContain('getArtistBandProfile(artistBandId, token ?? undefined)');
    expect(artistSource).not.toContain('You must be signed in to view artist pages.');
    expect(artistSource).toContain("const selectedSignalId = searchParams.get('signalId');");
    expect(artistSource).toContain(
      'profile.tracks.find((track) => track.signalId === selectedSignalId)'
    );
    expect(artistSource).toContain('[profile, selectedSignalId, selectedTrackId]');
    expect(artistSource).toContain('Source Dashboard');
    expect(artistSource).toContain('Open Release Deck');
    expect(artistSource).toContain('Open Print Shop');
    expect(artistSource).toContain('Open Registrar');
    expect(artistSource).toContain('Share Artist Page');
    expect(artistSource).toContain("busyAction === 'follow' ? 'Following...' : 'Follow'");
    expect(artistSource).toContain(
      'Opening source tools here will switch into this source account.'
    );
    expect(artistSource).toContain('Source-owned release');
    expect(artistSource).toContain('Source-owned event');
    expect(artistSource).not.toContain('getEngagementWheelActions');
    expect(artistSource).not.toContain('engagement-wheel');
    expect(artistSource).not.toContain('blastArtistBandSignal');
    expect(artistSource).not.toContain("'Blast'");
    expect(artistSource).not.toContain("{busyAction === 'blast' ? 'Blasting...' : 'Blast'}");
    expect(artistSource).toContain('Songs / Releases');
    expect(artistSource).toContain('Listen Here');
    expect(artistSource).toContain('const baseTracks = profile.tracks.slice(0, 3);');
    expect(artistSource).toContain('return [selectedTrack, ...baseTracks.slice(0, 2)];');
    expect(artistSource).toContain('demoTracks.map((track) => {');
    expect(artistSource).not.toContain('profile.tracks.map((track) => {');
    expect(artistSource).toContain("{isPlaying ? 'Pause' : 'Play'}");
    expect(artistSource).toContain('Collect');
    expect(artistSource).toContain('Recommend');
    expect(artistSource).toContain('track.viewerHasCollected');
    expect(artistSource).toContain('track.viewerHasRecommended');
    expect(artistSource).toMatch(/disabled=\{[\s\S]*!isCollected[\s\S]*isRecommended/);
    expect(artistSource).toContain('onClick={() => void handleCollectTrack(track)}');
    expect(artistSource).toContain('onClick={() => void handleRecommendTrack(track)}');
    expect(artistSource).toContain('Playback timeline for');
    expect(artistSource).not.toContain('Play Single');
    expect(artistSource).toContain('Identity');
    expect(artistSource).toContain('Official Links');
    expect(artistSource).toContain('Go Deeper');
    expect(artistSource).toContain('Official Site');
    expect(artistSource).toContain('Buy Music');
    expect(artistSource).toContain('Merch');
    expect(artistSource).toContain('Donate');
    expect(artistSource).toContain('Lineup');
    expect(artistSource).toContain('Upcoming and recent');
    expect(artistSource).not.toContain('Leaderboard');
    expect(artistSource).not.toContain('Ranking');
    expect(artistSource).not.toContain('Editorial Pick');
    expect(artistSource).not.toContain('Quality Score');
  });
});
