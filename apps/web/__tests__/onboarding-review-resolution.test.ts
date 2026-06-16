import {
  formatHomeSceneLabel,
  normalizeApprovedMusicCommunitySelection,
  resolveOnboardingReviewState,
} from '../src/lib/onboarding/review-resolution';
import type { DiscoverItem } from '../src/lib/discovery/client';

describe('onboarding review resolution', () => {
  it('accepts only approved music-community selections', () => {
    expect(normalizeApprovedMusicCommunitySelection(' Punk ')).toBe('Punk');
    expect(normalizeApprovedMusicCommunitySelection('Bedroom Pop')).toBe('');
  });

  it('keeps the exact active home-scene tuple when a matching scene is available', async () => {
    const readScenes = jest.fn<Promise<DiscoverItem[]>, [any, string | undefined]>().mockResolvedValueOnce([
      {
        entryType: 'city_scene',
        sceneId: 'scene-austin-punk',
        name: 'Austin Punk',
        city: 'Austin',
        state: 'Texas',
        musicCommunity: 'Punk',
        memberCount: 12,
        isActive: true,
        isHomeScene: false,
      },
    ]);

    const result = await resolveOnboardingReviewState(
      {
        city: 'Austin',
        state: 'Texas',
        musicCommunity: 'Punk',
      },
      undefined,
      readScenes,
    );

    expect(readScenes).toHaveBeenCalledTimes(1);
    expect(result).toEqual({
      pioneer: false,
      resolutionMode: 'exact',
      resolvedSceneLabel: 'Austin, Texas • Punk',
      stateSceneOptions: [],
      discoveryContext: {
        tunedSceneId: 'scene-austin-punk',
        tunedScene: {
          id: 'scene-austin-punk',
          name: 'Austin Punk',
          city: 'Austin',
          state: 'Texas',
          musicCommunity: 'Punk',
          tier: 'city',
          isActive: true,
        },
        isVisitor: false,
      },
    });
  });

  it('falls back to the first active scene in-state and preserves pioneer intent', async () => {
    const readScenes = jest
      .fn<Promise<DiscoverItem[]>, [any, string | undefined]>()
      .mockResolvedValueOnce([
        {
          entryType: 'city_scene',
          sceneId: 'scene-houston-punk-inactive',
          name: 'Houston Punk',
          city: 'Houston',
          state: 'Texas',
          musicCommunity: 'Punk',
          memberCount: 0,
          isActive: false,
          isHomeScene: false,
        },
      ])
      .mockResolvedValueOnce([
        {
          entryType: 'city_scene',
          sceneId: 'scene-austin-punk',
          name: 'Austin Punk',
          city: 'Austin',
          state: 'Texas',
          musicCommunity: 'Punk',
          memberCount: 25,
          isActive: true,
          isHomeScene: false,
        },
        {
          entryType: 'city_scene',
          sceneId: 'scene-dallas-punk',
          name: 'Dallas Punk',
          city: 'Dallas',
          state: 'Texas',
          musicCommunity: 'Punk',
          memberCount: 20,
          isActive: true,
          isHomeScene: false,
        },
      ]);

    const result = await resolveOnboardingReviewState(
      {
        city: 'Houston',
        state: 'Texas',
        musicCommunity: 'Punk',
      },
      undefined,
      readScenes,
    );

    expect(readScenes).toHaveBeenCalledTimes(2);
    expect(result.pioneer).toBe(true);
    expect(result.resolutionMode).toBe('fallback_state');
    expect(result.resolvedSceneLabel).toBe('Austin, Texas • Punk');
    expect(result.stateSceneOptions).toEqual(['Austin, Texas • Punk', 'Dallas, Texas • Punk']);
    expect(result.discoveryContext?.tunedSceneId).toBe('scene-austin-punk');
    expect(result.discoveryContext?.isVisitor).toBe(true);
  });

  it('falls back to the next active community scene when no active scene exists in-state', async () => {
    const readScenes = jest
      .fn<Promise<DiscoverItem[]>, [any, string | undefined]>()
      .mockResolvedValueOnce([])
      .mockResolvedValueOnce([])
      .mockResolvedValueOnce([
        {
          entryType: 'city_scene',
          sceneId: 'scene-la-punk',
          name: 'Los Angeles Punk',
          city: 'Los Angeles',
          state: 'California',
          musicCommunity: 'Punk',
          memberCount: 40,
          isActive: true,
          isHomeScene: false,
        },
      ]);

    const result = await resolveOnboardingReviewState(
      {
        city: 'Houston',
        state: 'Texas',
        musicCommunity: 'Punk',
      },
      undefined,
      readScenes,
    );

    expect(readScenes).toHaveBeenCalledTimes(3);
    expect(result.pioneer).toBe(true);
    expect(result.resolutionMode).toBe('fallback_community');
    expect(result.resolvedSceneLabel).toBe('Los Angeles, California • Punk');
    expect(result.discoveryContext?.tunedSceneId).toBe('scene-la-punk');
    expect(result.discoveryContext?.isVisitor).toBe(true);
  });

  it('formats the structural home-scene identity label deterministically', () => {
    expect(
      formatHomeSceneLabel({
        city: 'Austin',
        state: 'Texas',
        musicCommunity: 'Punk',
      }),
    ).toBe('Austin, Texas • Punk');
  });
});
