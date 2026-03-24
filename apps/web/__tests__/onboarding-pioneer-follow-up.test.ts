import fs from 'node:fs';
import path from 'node:path';

const repoRoot = path.resolve(__dirname, '..');

function readRepoFile(relativePath: string): string {
  return fs.readFileSync(path.join(repoRoot, relativePath), 'utf8');
}

describe('Onboarding pioneer follow-up contract', () => {
  it('persists pioneer follow-up context in the onboarding store', () => {
    const storeSource = readRepoFile('src/store/onboarding.ts');

    expect(storeSource).toContain('export interface PioneerFollowUp');
    expect(storeSource).toContain('pioneerFollowUp: PioneerFollowUp | null;');
    expect(storeSource).toContain('setPioneerFollowUp: (followUp: PioneerFollowUp | null) => void;');
    expect(storeSource).toContain('pioneerFollowUp: null,');
    expect(storeSource).toContain('setPioneerFollowUp: (pioneerFollowUp) => set({ pioneerFollowUp })');
    expect(storeSource).toContain('setHomeScene: (homeScene) => set({ homeScene, pioneerFollowUp: null })');
  });

  it('records pioneer follow-up state from onboarding home-scene resolution', () => {
    const onboardingSource = readRepoFile('src/app/onboarding/page.tsx');

    expect(onboardingSource).toContain('setPioneerFollowUp');
    expect(onboardingSource).toContain('setPioneerFollowUp(null);');
    expect(onboardingSource).toContain('let authenticatedPioneer: boolean | null = null;');
    expect(onboardingSource).toContain('authenticatedPioneer = response.data?.pioneer === undefined ? null : Boolean(response.data.pioneer);');
    expect(onboardingSource).toContain('const pioneer = authenticatedPioneer ?? reviewResolution.pioneer;');
    expect(onboardingSource).toContain('setPioneerFollowUp(pioneer ? { homeScene: selection } : null);');
    expect(onboardingSource).toContain("router.push('/plot');");
  });
});
