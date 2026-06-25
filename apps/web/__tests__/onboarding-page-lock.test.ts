import fs from 'node:fs';
import path from 'node:path';

const repoRoot = path.resolve(__dirname, '..');

function readRepoFile(relativePath: string): string {
  return fs.readFileSync(path.join(repoRoot, relativePath), 'utf8');
}

describe('/onboarding UX lock', () => {
  it('locks Music Community to approved selections and routes review through deterministic fallback resolution', () => {
    const onboardingSource = readRepoFile('src/app/onboarding/page.tsx');

    expect(onboardingSource).toContain('normalizeApprovedMusicCommunitySelection');
    expect(onboardingSource).toContain('resolveOnboardingReviewState(');
    expect(onboardingSource).toContain('Select an approved parent music community');
    expect(onboardingSource).toContain('Selection only from the approved parent communities.');
    expect(onboardingSource).toContain("{isPioneer ? 'Proxy listening scene' : 'Listening scene'}");
    expect(onboardingSource).toContain('stays saved as your submitted Home Scene');
    expect(onboardingSource).toContain('formatGpsReasonForDisplay');
    expect(onboardingSource).toContain('Your GPS location does not match your submitted Home Scene.');
    expect(onboardingSource).toContain('ZIP Code (optional)');
    expect(onboardingSource).toContain('Submitted location: {submittedLocationLabel}');
    expect(onboardingSource).not.toContain('list="communities"');
  });

  it('rechecks stored GPS coordinates after Home Scene submit so GPS can decide location before voting', () => {
    const onboardingSource = readRepoFile('src/app/onboarding/page.tsx');

    expect(onboardingSource).toContain('gpsCoords');
    expect(onboardingSource).toContain('refreshGpsVotingEligibility');
    expect(onboardingSource).toContain('await refreshGpsVotingEligibility(gpsCoords)');
    expect(onboardingSource).toContain('NO_HOME_SCENE');
    expect(onboardingSource).toContain('if (detected.postalCode) setPostalCode(detected.postalCode);');
  });
});
