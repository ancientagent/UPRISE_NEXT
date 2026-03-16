import {
  resolveSceneMapRequest,
  resolveSceneMapAnchorId,
  resolveStatisticsEndpoint,
} from '@/components/plot/statistics-request';

describe('Plot Statistics Request Helpers', () => {
  it('uses community-anchored statistics endpoint when selected community exists', () => {
    const result = resolveStatisticsEndpoint('community-123', 'state');

    expect(result).toEqual({
      endpoint: '/communities/community-123/statistics?tier=state',
      source: 'anchored',
    });
  });

  it('falls back to active-scene statistics endpoint when no community is selected', () => {
    const result = resolveStatisticsEndpoint(null, 'national');

    expect(result).toEqual({
      endpoint: '/communities/active/statistics?tier=national',
      source: 'active',
    });
  });

  it('prefers selected community id for scene-map anchor resolution', () => {
    const result = resolveSceneMapAnchorId('community-123', 'scene-456');
    expect(result).toBe('community-123');
  });

  it('uses active scene id when community anchor is absent', () => {
    const result = resolveSceneMapAnchorId(null, 'scene-456');
    expect(result).toBe('scene-456');
  });

  it('returns null when no anchor id is available', () => {
    const result = resolveSceneMapAnchorId(null, null);
    expect(result).toBeNull();
  });

  it('builds scene-map request from selected community when present', () => {
    const result = resolveSceneMapRequest('community-123', 'scene-456', 'state');

    expect(result).toEqual({
      anchorId: 'community-123',
      endpoint: '/communities/community-123/scene-map?tier=state',
      source: 'selected_community',
    });
  });

  it('falls back to active-scene request when no community is selected', () => {
    const result = resolveSceneMapRequest(null, 'scene-456', 'national');

    expect(result).toEqual({
      anchorId: 'scene-456',
      endpoint: '/communities/scene-456/scene-map?tier=national',
      source: 'active_scene',
    });
  });

  it('returns unresolved scene-map state when no anchor exists', () => {
    const result = resolveSceneMapRequest(null, null, 'city');

    expect(result).toEqual({
      anchorId: null,
      endpoint: null,
      source: 'unresolved',
    });
  });
});
