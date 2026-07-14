import { api } from '../src/lib/api';
import {
  createReleaseDeckSchedule,
  getReleaseDeckScheduleAvailability,
  toUtcDateOnly,
} from '../src/lib/source/release-deck-scheduling';

jest.mock('../src/lib/api', () => ({
  api: {
    get: jest.fn(),
    post: jest.fn(),
  },
}));

const mockedApiGet = api.get as jest.Mock;
const mockedApiPost = api.post as jest.Mock;

describe('Release Deck scheduling client', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('requests server-owned availability with the bounded lookahead', async () => {
    const response = {
      success: true as const,
      data: {
        soonestValidDate: '2026-07-20',
        alternatives: ['2026-07-20'],
      },
    };
    mockedApiGet.mockResolvedValue(response);

    await expect(
      getReleaseDeckScheduleAvailability(
        {
          communityId: 'community-1',
          trackId: 'track-1',
          from: '2026-07-14',
        },
        'token-1'
      )
    ).resolves.toBe(response);

    expect(mockedApiGet).toHaveBeenCalledWith(
      '/release-deck/schedule/availability?communityId=community-1&trackId=track-1&from=2026-07-14&days=30',
      { token: 'token-1' }
    );
  });

  it('posts a chosen schedule assignment', async () => {
    const scheduled = {
      id: 'schedule-1',
      trackId: 'track-1',
      communityId: 'community-1',
      artistBandId: 'source-1',
      scheduledFor: '2026-07-20T00:00:00.000Z',
      assignmentMode: 'chosen' as const,
      requestedFor: '2026-07-20T00:00:00.000Z',
      status: 'scheduled',
      createdById: 'user-1',
    };
    mockedApiPost.mockResolvedValue({ success: true, data: scheduled });

    await expect(
      createReleaseDeckSchedule(
        {
          communityId: 'community-1',
          trackId: 'track-1',
          mode: 'chosen',
          requestedDate: '2026-07-20',
        },
        'token-1'
      )
    ).resolves.toEqual(scheduled);

    expect(mockedApiPost).toHaveBeenCalledWith(
      '/release-deck/schedule',
      {
        communityId: 'community-1',
        trackId: 'track-1',
        mode: 'chosen',
        requestedDate: '2026-07-20',
      },
      { token: 'token-1' }
    );
  });

  it('derives date-only values in UTC', () => {
    expect(toUtcDateOnly(new Date('2026-07-14T23:59:59.000-05:00'))).toBe('2026-07-15');
  });
});
