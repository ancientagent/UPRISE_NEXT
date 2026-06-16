import fs from 'node:fs';
import path from 'node:path';
import { MUSIC_COMMUNITIES } from '../src/data/music-communities';

const repoRoot = path.resolve(__dirname, '../../..');

interface LaunchCity {
  city: string;
  state: string;
  launchOpen: boolean;
}

interface LaunchMatrix {
  architectureRule: string;
  cities: LaunchCity[];
  musicCommunities: string[];
  expectedCityTierSceneCount: number;
  missingCommunityRequests: {
    selectableDuringOnboarding: boolean;
    createsSceneImmediately: boolean;
    reviewEligibility: string;
  };
}

function readJson<T>(relativePath: string): T {
  return JSON.parse(fs.readFileSync(path.join(repoRoot, relativePath), 'utf8')) as T;
}

describe('launch community city matrix', () => {
  it('locks the MVP launch selector to eight approved music communities', () => {
    expect(MUSIC_COMMUNITIES).toEqual([
      'Punk',
      'Electronic',
      'Noise',
      'Spoken Word / Poetry',
      'Indie',
      'Folk',
      'Singer-Songwriter',
      'Hip-Hop',
    ]);

    expect(MUSIC_COMMUNITIES).not.toContain('Metal');
    expect(MUSIC_COMMUNITIES).not.toContain('Jazz');
    expect(MUSIC_COMMUNITIES).not.toContain('Folk / Roots / Country');
    expect(MUSIC_COMMUNITIES).not.toContain('Experimental / Noise / Industrial');
  });

  it('defines forty-eight active city-tier launch tuples without location/community architecture variants', () => {
    const matrix = readJson<LaunchMatrix>('docs/specs/seed/launch-community-city-matrix.json');
    const launchCities = matrix.cities.filter((city) => city.launchOpen);
    const tuples = launchCities.flatMap((city) =>
      matrix.musicCommunities.map(
        (musicCommunity) => `${city.city}|${city.state}|${musicCommunity}`
      )
    );

    expect(launchCities).toEqual([
      { city: 'Austin', state: 'Texas', launchOpen: true },
      { city: 'Houston', state: 'Texas', launchOpen: true },
      { city: 'Dallas', state: 'Texas', launchOpen: true },
      { city: 'Los Angeles', state: 'California', launchOpen: true },
      { city: 'San Francisco', state: 'California', launchOpen: true },
      { city: 'San Diego', state: 'California', launchOpen: true },
    ]);
    expect(matrix.musicCommunities).toEqual([...MUSIC_COMMUNITIES]);
    expect(tuples).toHaveLength(48);
    expect(new Set(tuples).size).toBe(48);
    expect(matrix.expectedCityTierSceneCount).toBe(48);
    expect(matrix.architectureRule).toContain('Home Scene architecture is invariant');
    expect(matrix.architectureRule).toContain(
      'they must not change Home/Plot/Events/Archive/player/action architecture'
    );
  });

  it('keeps missing music-community requests as intake, not immediate scene creation', () => {
    const matrix = readJson<LaunchMatrix>('docs/specs/seed/launch-community-city-matrix.json');

    expect(matrix.missingCommunityRequests.selectableDuringOnboarding).toBe(false);
    expect(matrix.missingCommunityRequests.createsSceneImmediately).toBe(false);
    expect(matrix.missingCommunityRequests.reviewEligibility).toContain(
      'distinct people in distinct cities'
    );
  });
});
