import { normalizeBroadcastRuntimeError } from '../src/lib/broadcast/runtime';

describe('broadcast runtime helpers', () => {
  it('treats missing state scene as an empty-state message instead of a hard player error', () => {
    expect(
      normalizeBroadcastRuntimeError(
        'State scene not found for the active community context',
        'state',
      ),
    ).toEqual({
      treatAsEmptyState: true,
      userMessage: 'No state scene is active for this community yet.',
    });
  });

  it('keeps unrelated broadcast failures as normal errors', () => {
    expect(
      normalizeBroadcastRuntimeError('Unable to load the active broadcast rotation.', 'city'),
    ).toEqual({
      treatAsEmptyState: false,
      userMessage: 'Unable to load the active broadcast rotation.',
    });
  });
});
