import fs from 'node:fs';
import path from 'node:path';

const repoRoot = path.resolve(__dirname, '..');

function readRepoFile(relativePath: string): string {
  return fs.readFileSync(path.join(repoRoot, relativePath), 'utf8');
}

describe('/onboarding regression lock', () => {
  it('locks music community input to the seeded selection list and avoids genre framing', () => {
    const onboardingSource = readRepoFile('src/app/onboarding/page.tsx');

    expect(onboardingSource).toContain("import { MUSIC_COMMUNITIES } from '@/data/music-communities';");
    expect(onboardingSource).toContain('<select');
    expect(onboardingSource).toContain('Select an approved parent music community');
    expect(onboardingSource).toContain('{MUSIC_COMMUNITIES.map((community) => (');
    expect(onboardingSource).toContain('Selection only from the approved parent communities.');
    expect(onboardingSource).not.toContain('list="communities"');
    expect(onboardingSource).not.toContain('<datalist id="communities">');
    expect(onboardingSource).not.toContain('genre selection');
    expect(onboardingSource).not.toContain('Create a new music community');
  });

  it('keeps unsigned review and pioneer fallback guidance available before auth-backed resolution exists', () => {
    const onboardingSource = readRepoFile('src/app/onboarding/page.tsx');

    expect(onboardingSource).toContain('setHomeScene(selection);');
    expect(onboardingSource).toContain('resolveOnboardingReviewState(selection, token || undefined)');
    expect(onboardingSource).toContain('setStep(1);');
    expect(onboardingSource).toContain("const [isPioneer, setIsPioneer] = useState(false);");
    expect(onboardingSource).toContain("const [stateSceneOptions, setStateSceneOptions] = useState<string[]>([]);");
    expect(onboardingSource).toContain("{isPioneer ? 'Fallback listening scene' : 'Listening scene'}");
    expect(onboardingSource).toContain('stays saved as your Home Scene pioneer intent');
    expect(onboardingSource).toContain('Your selected city is not active yet.');
    expect(onboardingSource).toContain('Active scenes in {state.trim()}: {stateSceneOptions.join(\' · \')}');
    expect(onboardingSource).toContain('Enter The Plot');
    expect(onboardingSource).toContain('Edit Home Scene');
  });
});
