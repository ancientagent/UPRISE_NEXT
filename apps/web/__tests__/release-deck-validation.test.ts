import {
  buildReleaseDeckTrackPayload,
  getReleaseDeckReadiness,
  getReleaseDeckSubmitBlockReason,
  hostedAudioUrlMessage,
  hostedCoverUrlMessage,
  releaseDeckMaxSourceDurationMessage,
  releaseDeckMaxSourceSeconds,
  releaseDeckMaxTrackDurationMessage,
  releaseDeckMusicSlotCapMessage,
} from '../src/lib/source/release-deck-validation';

const activeSource = {
  id: '11111111-1111-4111-8111-111111111111',
  name: 'Youngblood QA Source',
  slug: 'youngblood-qa-source',
  entityType: 'band',
  membershipRole: 'owner',
};

const baseForm = {
  title: '  QA Single  ',
  album: '  Demo Tape  ',
  duration: '181',
  fileUrl: 'https://cdn.example.com/audio.mp3',
  coverArt: 'https://cdn.example.com/cover.png',
};

describe('Release Deck validation', () => {
  it('builds a source-owned ready track payload for the hosted-file MVP seam', () => {
    expect(buildReleaseDeckTrackPayload(baseForm, activeSource, 'community-1')).toEqual({
      title: 'QA Single',
      artist: 'Youngblood QA Source',
      artistBandId: '11111111-1111-4111-8111-111111111111',
      album: 'Demo Tape',
      duration: 181,
      fileUrl: 'https://cdn.example.com/audio.mp3',
      coverArt: 'https://cdn.example.com/cover.png',
      communityId: 'community-1',
      status: 'ready',
    });
  });

  it('requires a nonblank title and positive duration', () => {
    expect(() => buildReleaseDeckTrackPayload({ ...baseForm, title: '   ' }, activeSource, 'community-1')).toThrow(
      'Title is required before releasing a single.',
    );
    expect(() => buildReleaseDeckTrackPayload({ ...baseForm, duration: '0' }, activeSource, 'community-1')).toThrow(
      'Duration must be a positive number of seconds.',
    );
    expect(() => buildReleaseDeckTrackPayload({ ...baseForm, duration: 'nope' }, activeSource, 'community-1')).toThrow(
      'Duration must be a positive number of seconds.',
    );
  });

  it('rejects single tracks longer than the 6-minute Release Deck cap', () => {
    expect(() => buildReleaseDeckTrackPayload({ ...baseForm, duration: '361' }, activeSource, 'community-1')).toThrow(
      releaseDeckMaxTrackDurationMessage,
    );
  });

  it('requires http(s) hosted media URLs and keeps cover art optional', () => {
    expect(() => buildReleaseDeckTrackPayload({ ...baseForm, fileUrl: 'ipfs://audio' }, activeSource, 'community-1')).toThrow(
      hostedAudioUrlMessage,
    );
    expect(() => buildReleaseDeckTrackPayload({ ...baseForm, fileUrl: 'not-a-url' }, activeSource, 'community-1')).toThrow(
      hostedAudioUrlMessage,
    );
    expect(() => buildReleaseDeckTrackPayload({ ...baseForm, coverArt: 'ftp://cover.png' }, activeSource, 'community-1')).toThrow(
      hostedCoverUrlMessage,
    );

    expect(buildReleaseDeckTrackPayload({ ...baseForm, coverArt: '   ' }, activeSource, 'community-1')).toEqual(
      expect.objectContaining({ coverArt: undefined }),
    );
  });

  it('summarizes only source-owned ready tracks for readiness and active-source caps', () => {
    const readiness = getReleaseDeckReadiness({
      activeSourceId: activeSource.id,
      communityId: 'community-1',
      tracks: [
        { artistBandId: activeSource.id, duration: 180, status: 'ready' },
        { artistBandId: activeSource.id, duration: 210, status: 'processing' },
        { artistBandId: 'legacy-source', duration: 240, status: 'ready' },
      ],
    });

    expect(readiness).toEqual({
      activeDurationSeconds: 180,
      capReached: false,
      hasSourceOwnedReadyTrack: true,
      isAtActiveSourceCap: false,
      isAtMusicSlotCap: false,
      missingHomeScene: false,
      openMusicSlots: 2,
      readyForTesting: true,
      sourceOwnedReadyTrackCount: 1,
    });
  });

  it('blocks submit when Home Scene is missing, three music slots are full, or fifteen active minutes would be exceeded', () => {
    expect(
      getReleaseDeckSubmitBlockReason(
        getReleaseDeckReadiness({
          activeSourceId: activeSource.id,
          communityId: null,
          tracks: [{ artistBandId: activeSource.id, duration: 180, status: 'ready' }],
        }),
        180,
      ),
    ).toBe('An active source with a resolved Home Scene is required before releasing a single.');

    expect(
      getReleaseDeckSubmitBlockReason(
        getReleaseDeckReadiness({
          activeSourceId: activeSource.id,
          communityId: 'community-1',
          tracks: [
            { artistBandId: activeSource.id, duration: 180, status: 'ready' },
            { artistBandId: activeSource.id, duration: 180, status: 'ready' },
            { artistBandId: activeSource.id, duration: 180, status: 'ready' },
          ],
        }),
        120,
      ),
    ).toBe(releaseDeckMusicSlotCapMessage);

    expect(
      getReleaseDeckSubmitBlockReason(
        getReleaseDeckReadiness({
          activeSourceId: activeSource.id,
          communityId: 'community-1',
          tracks: [
            { artistBandId: activeSource.id, duration: 300, status: 'ready' },
            { artistBandId: activeSource.id, duration: 300, status: 'ready' },
          ],
        }),
        releaseDeckMaxSourceSeconds - 599,
      ),
    ).toBe(releaseDeckMaxSourceDurationMessage);
  });
});
