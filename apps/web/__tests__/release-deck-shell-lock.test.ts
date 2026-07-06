import fs from 'node:fs';
import path from 'node:path';

const repoRoot = path.resolve(__dirname, '..');

function readRepoFile(relativePath: string): string {
  return fs.readFileSync(path.join(repoRoot, relativePath), 'utf8');
}

describe('release deck shell lock', () => {
  it('keeps release deck inside the source dashboard system', () => {
    const releaseDeckSource = readRepoFile('src/app/source-dashboard/release-deck/page.tsx');
    const releaseDeckValidationSource = readRepoFile('src/lib/source/release-deck-validation.ts');

    expect(releaseDeckSource).toContain('Back to Source Dashboard');
    expect(releaseDeckSource).toContain('Return to Listener Account');
    expect(releaseDeckSource).toContain('View Source Profile');
    expect(releaseDeckSource).toContain('Open Registrar');
    expect(releaseDeckSource).toContain('Current Context');
    expect(releaseDeckSource).toContain('Music slots: 3');
    expect(releaseDeckSource).toContain('Paid ad slot: defined, not active here');
    expect(releaseDeckSource).toContain('attach directly to the active source account');
    expect(releaseDeckSource).toContain('Release Single');
    expect(releaseDeckSource).toContain('Audio File URL');
    expect(releaseDeckSource).toContain('buildReleaseDeckTrackPayload(form, activeSource, communityId)');
    expect(releaseDeckSource).toContain('createTrack(payload, token)');
    expect(releaseDeckSource).toContain('Source-owned release');
    expect(releaseDeckSource).toContain('Legacy carry-forward');
    expect(releaseDeckSource).toContain('getReleaseDeckReadiness');
    expect(releaseDeckSource).toContain('getReleaseDeckSubmitBlockReason');
    expect(releaseDeckValidationSource).toContain('An active source with a resolved Home Scene is required before releasing a single.');
    expect(releaseDeckSource).toContain('Ready for Fair Play/player testing');
    expect(releaseDeckSource).toContain('Testing visibility needs a source-owned ready track.');
    expect(releaseDeckSource).toContain('Cap reached');
    expect(releaseDeckSource).toContain('this screen will not silently replace existing tracks or create an extra active music slot');
    expect(releaseDeckSource).toContain('Release date');
    expect(releaseDeckSource).toContain('Load');
    expect(releaseDeckSource).not.toContain('Date added');
    expect(releaseDeckSource).not.toContain('Open Metrics');
    expect(releaseDeckSource).not.toContain('Upgrade');
    expect(releaseDeckSource).not.toContain('fourth music slot');
    expect(releaseDeckValidationSource).toContain('artistBandId: activeSource.id');
    expect(releaseDeckValidationSource).toContain('Audio File URL must be an http(s) URL for the current hosted-file MVP.');
    expect(releaseDeckValidationSource).toContain('Cover Art URL must be an http(s) URL for the current hosted-file MVP.');
    expect(releaseDeckValidationSource).toContain('releaseDeckMaxSourceSeconds = 15 * 60');
    expect(releaseDeckValidationSource).toContain('releaseDeckMusicSlotCount = 3');
  });
});
