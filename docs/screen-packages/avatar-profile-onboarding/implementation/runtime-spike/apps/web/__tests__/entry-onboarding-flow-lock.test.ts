import fs from 'node:fs';
import path from 'node:path';

const repoRoot = path.resolve(__dirname, '..');

function readRepoFile(relativePath: string): string {
  return fs.readFileSync(path.join(repoRoot, relativePath), 'utf8');
}

describe('entry and profile tutorial handoff', () => {
  it('starts with credentials, resolves a Home Scene, and then enters the Registrar profile tutorial', () => {
    const entrySource = readRepoFile('src/components/auth/EntryAccountPanel.tsx');
    const onboardingSource = readRepoFile('src/app/onboarding/page.tsx');
    const registrarSource = readRepoFile('src/app/registrar/page.tsx');

    expect(entrySource).toContain("router.push('/onboarding')");
    expect(onboardingSource).toContain("router.push('/registrar?onboarding=profile')");
    expect(onboardingSource).toContain('Continue to Registrar');
    expect(registrarSource).toContain("searchParams.get('onboarding') === 'profile'");
    expect(registrarSource).toContain('ListenerProfileTutorial');
  });

  it('keeps camera capture as the only avatar likeness input', () => {
    const tutorialSource = readRepoFile('src/components/registrar/ListenerProfileTutorial.tsx');

    expect(tutorialSource).toContain('navigator.mediaDevices.getUserMedia');
    expect(tutorialSource).toContain('Take photo');
    expect(tutorialSource).not.toContain('type="file"');
  });
});
