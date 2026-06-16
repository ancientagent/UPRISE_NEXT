import fs from 'node:fs';
import path from 'node:path';

const repoRoot = path.resolve(__dirname, '..');

function readRepoFile(relativePath: string): string {
  return fs.readFileSync(path.join(repoRoot, relativePath), 'utf8');
}

describe('tracks client', () => {
  it('posts new source-side releases through the tracks api seam', () => {
    const clientSource = readRepoFile('src/lib/tracks/client.ts');

    expect(clientSource).toContain("api.post<Track>('/tracks', input, { token })");
    expect(clientSource).toContain('Track create response was empty.');
  });
});
