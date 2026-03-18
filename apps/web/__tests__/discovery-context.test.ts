import {
  mergeDiscoveryContextPatch,
  toDiscoveryContextPatch,
} from '../src/lib/discovery/context';

describe('discovery context helpers', () => {
  it('normalizes nullable discovery context for store patch usage', () => {
    expect(toDiscoveryContextPatch(null)).toEqual({
      tunedSceneId: null,
      tunedScene: null,
      isVisitor: null,
    });
  });

  it('maps discovery context values to store patch shape', () => {
    expect(
      toDiscoveryContextPatch({
        tunedSceneId: 'scene-1',
        tunedScene: {
          id: 'scene-1',
          name: 'Austin Punk',
          city: 'Austin',
          state: 'TX',
          musicCommunity: 'Punk',
          tier: 'city',
          isActive: true,
        },
        homeSceneId: 'scene-home',
        isVisitor: false,
      }),
    ).toEqual({
      tunedSceneId: 'scene-1',
      tunedScene: expect.objectContaining({ id: 'scene-1' }),
      isVisitor: false,
    });
  });

  it('prefers primary discovery context when available', () => {
    const result = mergeDiscoveryContextPatch(
      {
        tunedSceneId: 'scene-primary',
        tunedScene: {
          id: 'scene-primary',
          name: 'Primary',
          city: 'Austin',
          state: 'TX',
          musicCommunity: 'Punk',
          tier: 'city',
          isActive: true,
        },
        homeSceneId: 'scene-home',
        isVisitor: true,
      },
      {
        tunedSceneId: 'scene-fallback',
        tunedScene: null,
        isVisitor: false,
      },
    );

    expect(result).toEqual({
      tunedSceneId: 'scene-primary',
      tunedScene: expect.objectContaining({ id: 'scene-primary' }),
      isVisitor: true,
    });
  });

  it('uses fallback values when primary context is unavailable', () => {
    const result = mergeDiscoveryContextPatch(null, {
      tunedSceneId: 'scene-fallback',
      tunedScene: null,
      isVisitor: false,
    });

    expect(result).toEqual({
      tunedSceneId: 'scene-fallback',
      tunedScene: null,
      isVisitor: false,
    });
  });

  it('preserves explicit local status when primary context is not visitor', () => {
    const result = mergeDiscoveryContextPatch(
      {
        tunedSceneId: 'scene-home',
        tunedScene: {
          id: 'scene-home',
          name: 'Austin Punk',
          city: 'Austin',
          state: 'TX',
          musicCommunity: 'Punk',
          tier: 'city',
          isActive: true,
        },
        homeSceneId: 'scene-home',
        isVisitor: false,
      },
      {
        tunedSceneId: 'scene-fallback',
        tunedScene: null,
        isVisitor: true,
      },
    );

    expect(result).toEqual({
      tunedSceneId: 'scene-home',
      tunedScene: expect.objectContaining({ id: 'scene-home' }),
      isVisitor: false,
    });
  });

  it('uses primary tuned-scene id and visitor status when hydrated scene details are missing', () => {
    const result = mergeDiscoveryContextPatch(
      {
        tunedSceneId: 'scene-primary',
        tunedScene: null,
        homeSceneId: 'scene-home',
        isVisitor: true,
      },
      {
        tunedSceneId: 'scene-fallback',
        tunedScene: {
          id: 'scene-fallback',
          name: 'Fallback',
          city: 'Austin',
          state: 'TX',
          musicCommunity: 'Punk',
          tier: 'city',
          isActive: true,
        },
        isVisitor: false,
      },
    );

    expect(result).toEqual({
      tunedSceneId: 'scene-primary',
      tunedScene: expect.objectContaining({ id: 'scene-fallback' }),
      isVisitor: true,
    });
  });
});
