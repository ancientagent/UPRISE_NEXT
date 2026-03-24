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
    expect(onboardingSource).toContain("{isPioneer ? 'Fallback listening scene' : 'Listening scene'}");
    expect(onboardingSource).toContain('stays saved as your Home Scene pioneer intent');
    expect(onboardingSource).not.toContain('list="communities"');
  });
});
