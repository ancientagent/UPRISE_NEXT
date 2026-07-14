import React from 'react';
import { act } from 'react-dom/test-utils';
import { createRoot, type Root } from 'react-dom/client';
import SourceDashboardPage from '../src/app/source-dashboard/page';
import ReleaseDeckPage from '../src/app/source-dashboard/release-deck/page';
import { api } from '../src/lib/api';
import { getArtistBandProfile } from '../src/lib/artist-bands/client';
import { createTrack } from '../src/lib/tracks/client';
import { listPromoterRegistrations } from '../src/lib/registrar/client';
import { useAuthStore } from '../src/store/auth';
import { useOnboardingStore } from '../src/store/onboarding';
import { useSourceAccountStore } from '../src/store/source-account';

jest.mock('next/link', () => ({
  __esModule: true,
  default: ({
    href,
    children,
    ...props
  }: React.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }) =>
    React.createElement('a', { href, ...props }, children),
}));

jest.mock('../src/lib/api', () => ({
  api: {
    get: jest.fn(),
    post: jest.fn(),
  },
}));

jest.mock('../src/lib/artist-bands/client', () => ({
  getArtistBandProfile: jest.fn(),
}));

jest.mock('../src/lib/tracks/client', () => ({
  createTrack: jest.fn(),
}));

jest.mock('../src/lib/registrar/client', () => ({
  listPromoterRegistrations: jest.fn(),
}));

const mockedApiGet = api.get as jest.Mock;
const mockedApiPost = api.post as jest.Mock;
const mockedGetArtistBandProfile = getArtistBandProfile as jest.Mock;
const mockedCreateTrack = createTrack as jest.Mock;
const mockedListPromoterRegistrations = listPromoterRegistrations as jest.Mock;

const user = {
  id: 'user-1',
  email: 'user@example.com',
  username: 'userone',
  displayName: 'User One',
  homeSceneCity: 'Austin',
  homeSceneState: 'TX',
  homeSceneCommunity: 'Punk',
  gpsVerified: true,
  isVerified: true,
  createdAt: new Date('2026-07-01T00:00:00.000Z'),
  updatedAt: new Date('2026-07-01T00:00:00.000Z'),
};

const managedSource = {
  id: '11111111-1111-4111-8111-111111111111',
  name: 'The North Line',
  slug: 'the-north-line',
  entityType: 'band',
  membershipRole: 'owner',
};

const memberManagedSource = {
  id: '22222222-2222-4222-8222-222222222222',
  name: 'East Line',
  slug: 'east-line',
  entityType: 'band',
  membershipRole: 'member',
};

const userSourceProfile = {
  user: { id: user.id },
  managedArtistBands: [managedSource],
};

const sourceProfile: Record<string, unknown> = {
  id: managedSource.id,
  name: managedSource.name,
  slug: managedSource.slug,
  entityType: managedSource.entityType,
  registrarEntryRef: null,
  officialWebsiteUrl: null,
  merchUrl: null,
  musicUrl: null,
  donationUrl: null,
  createdAt: '2026-07-01T00:00:00.000Z',
  updatedAt: '2026-07-01T00:00:00.000Z',
  bio: null,
  avatar: null,
  coverImage: null,
  createdBy: { id: user.id, username: user.username, displayName: user.displayName, avatar: null },
  homeScene: {
    id: 'community-1',
    name: 'Austin Punk',
    slug: 'austin-punk',
    city: 'Austin',
    state: 'TX',
    musicCommunity: 'Punk',
    tier: 'city',
  },
  members: [],
  memberCount: 1,
  followCount: 0,
  tracks: [],
  events: [],
};

function makeSourceProfile(overrides: Record<string, unknown> = {}) {
  return {
    ...sourceProfile,
    ...overrides,
  };
}

function render(ui: React.ReactElement) {
  const container = document.createElement('div');
  document.body.appendChild(container);
  const root = createRoot(container);

  act(() => {
    root.render(ui);
  });

  return {
    container,
    root,
  };
}

async function flushEffects() {
  await act(async () => {
    await Promise.resolve();
    await Promise.resolve();
  });
}

function cleanupRender(root: Root, container: Element) {
  act(() => {
    root.unmount();
  });
  container.remove();
}

function changeInput(container: Element, name: string, value: string) {
  const input = container.querySelector(`input[name="${name}"]`) as HTMLInputElement | null;
  expect(input).not.toBeNull();

  act(() => {
    const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')?.set;
    setter?.call(input, value);
    input?.dispatchEvent(new Event('input', { bubbles: true }));
    input?.dispatchEvent(new Event('change', { bubbles: true }));
  });
}

function changeSourceSelect(container: Element, value: string) {
  const select = container.querySelector(
    'select[aria-label="Current source account"]'
  ) as HTMLSelectElement | null;
  expect(select).not.toBeNull();

  act(() => {
    const setter = Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype, 'value')?.set;
    setter?.call(select, value);
    select?.dispatchEvent(new Event('change', { bubbles: true }));
  });
}

function changeNamedSelect(container: Element, name: string, value: string) {
  const select = container.querySelector(`select[name="${name}"]`) as HTMLSelectElement | null;
  expect(select).not.toBeNull();

  act(() => {
    const setter = Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype, 'value')?.set;
    setter?.call(select, value);
    select?.dispatchEvent(new Event('change', { bubbles: true }));
  });
}

function clickButton(container: Element, label: string) {
  const button = Array.from(container.querySelectorAll('button')).find(
    (candidate) => candidate.textContent?.trim() === label
  );
  expect(button).not.toBeUndefined();

  act(() => {
    button?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
  });
}

function clickButtonAt(container: Element, label: string, index: number) {
  const buttons = Array.from(container.querySelectorAll('button')).filter(
    (candidate) => candidate.textContent?.trim() === label
  );
  expect(buttons[index]).toBeDefined();

  act(() => {
    buttons[index]?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
  });
}

function makeReadyTrack(id: string, title: string) {
  return {
    id,
    artistBandId: managedSource.id,
    title,
    artist: managedSource.name,
    album: null,
    duration: 180,
    fileUrl: `https://cdn.example.com/${id}.mp3`,
    coverArt: null,
    playCount: 0,
    likeCount: 0,
    status: 'ready',
    createdAt: '2026-07-01T00:00:00.000Z',
  };
}

describe('source dashboard runtime behavior', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    document.body.innerHTML = '';
    window.localStorage.clear();
    useAuthStore.getState().setAuth(user, 'token-1');
    useOnboardingStore
      .getState()
      .setHomeScene({ city: 'Austin', state: 'TX', musicCommunity: 'Punk' });
    useSourceAccountStore.getState().clearActiveSourceId();
    mockedListPromoterRegistrations.mockResolvedValue({ entries: [] });
  });

  it('keeps source dashboard in listener/no-source state until a valid source context is selected', async () => {
    mockedApiGet.mockResolvedValue({ data: userSourceProfile });

    const { root, container } = render(React.createElement(SourceDashboardPage));
    await flushEffects();

    expect(container.textContent).toContain('Select a source account');
    expect(container.textContent).toContain(
      'Listener Account is active. Select one managed source account in the top command line before source tools operate.'
    );
    expect(container.textContent).not.toContain('Open Release Deck');

    cleanupRender(root, container);
  });

  it('updates the command-line role from the newly selected source membership data', async () => {
    useSourceAccountStore.getState().setActiveSourceId(managedSource.id, user.id);
    mockedApiGet.mockResolvedValue({
      data: {
        user: { id: user.id },
        managedArtistBands: [managedSource, memberManagedSource],
      },
    });
    mockedGetArtistBandProfile.mockImplementation((sourceId: string) =>
      Promise.resolve(
        makeSourceProfile({
          id: sourceId,
          name: sourceId === memberManagedSource.id ? memberManagedSource.name : managedSource.name,
          slug: sourceId === memberManagedSource.id ? memberManagedSource.slug : managedSource.slug,
        })
      )
    );

    const { root, container } = render(React.createElement(SourceDashboardPage));
    await flushEffects();

    expect(container.querySelector('[data-testid="source-command-role"]')?.textContent).toBe(
      'User One · Manager'
    );

    changeSourceSelect(container, memberManagedSource.id);
    await flushEffects();

    expect(useSourceAccountStore.getState().activeSourceId).toBe(memberManagedSource.id);
    expect(container.querySelector('[data-testid="source-command-role"]')?.textContent).toBe(
      'User One · Member'
    );

    cleanupRender(root, container);
  });

  it('clears stale source dashboard context before source tools render', async () => {
    useSourceAccountStore.getState().setActiveSourceId(managedSource.id, 'other-user');
    mockedApiGet.mockResolvedValue({ data: userSourceProfile });

    const { root, container } = render(React.createElement(SourceDashboardPage));
    await flushEffects();

    expect(container.textContent).toContain(
      'Stale source context was cleared because it no longer belongs to this signed-in user.'
    );
    expect(container.textContent).not.toContain('Open Release Deck');
    expect(useSourceAccountStore.getState().activeSourceId).toBeNull();

    cleanupRender(root, container);
  });

  it('blocks Release Deck submit if the active source context becomes stale after load', async () => {
    useSourceAccountStore.getState().setActiveSourceId(managedSource.id, user.id);
    mockedApiGet.mockResolvedValue({ data: userSourceProfile });
    mockedGetArtistBandProfile.mockResolvedValue(makeSourceProfile());

    const { root, container } = render(React.createElement(ReleaseDeckPage));
    await flushEffects();

    expect(container.textContent).toContain('Release Single');
    changeInput(container, 'title', 'QA Single');
    changeInput(container, 'duration', '180');
    changeInput(container, 'fileUrl', 'https://cdn.example.com/audio.mp3');

    await act(async () => {
      await Promise.resolve();
    });

    const form = container.querySelector('form');
    expect(form).not.toBeNull();

    await act(async () => {
      useSourceAccountStore.getState().setActiveSourceId(managedSource.id, 'other-user');
      form?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    });

    expect(container.textContent).toContain('Select a source account before opening Release Deck.');
    expect(mockedCreateTrack).not.toHaveBeenCalled();

    cleanupRender(root, container);
  });

  it('renders Release Deck readiness from source-owned ready tracks only', async () => {
    useSourceAccountStore.getState().setActiveSourceId(managedSource.id, user.id);
    mockedApiGet.mockResolvedValue({ data: userSourceProfile });
    mockedGetArtistBandProfile.mockResolvedValue(
      makeSourceProfile({
        tracks: [
          {
            id: 'track-1',
            artistBandId: managedSource.id,
            title: 'Source Ready',
            artist: managedSource.name,
            album: null,
            duration: 180,
            fileUrl: 'https://cdn.example.com/source-ready.mp3',
            coverArt: null,
            playCount: 0,
            likeCount: 0,
            status: 'ready',
            createdAt: '2026-07-01T00:00:00.000Z',
          },
          {
            id: 'track-2',
            artistBandId: managedSource.id,
            title: 'Source Processing',
            artist: managedSource.name,
            album: null,
            duration: 210,
            fileUrl: 'https://cdn.example.com/source-processing.mp3',
            coverArt: null,
            playCount: 0,
            likeCount: 0,
            status: 'processing',
            createdAt: '2026-07-01T00:00:00.000Z',
          },
          {
            id: 'track-3',
            artistBandId: 'legacy-source',
            title: 'Legacy Ready',
            artist: managedSource.name,
            album: null,
            duration: 240,
            fileUrl: 'https://cdn.example.com/legacy-ready.mp3',
            coverArt: null,
            playCount: 0,
            likeCount: 0,
            status: 'ready',
            createdAt: '2026-07-01T00:00:00.000Z',
          },
        ],
      })
    );

    const { root, container } = render(React.createElement(ReleaseDeckPage));
    await flushEffects();

    expect(container.textContent).toContain('1 / 3');
    expect(container.textContent).toContain('3:00 / 15:00');
    expect(container.textContent).toContain('Ready for Fair Play/player testing');
    expect(container.textContent).toContain('Source-owned release');
    expect(container.textContent).toContain('Legacy carry-forward');

    cleanupRender(root, container);
  });

  it('checks schedule availability and assigns the soonest server-owned release date', async () => {
    useSourceAccountStore.getState().setActiveSourceId(managedSource.id, user.id);
    mockedApiGet.mockImplementation((endpoint: string) => {
      if (endpoint.startsWith('/release-deck/schedule/availability')) {
        return Promise.resolve({
          success: true,
          data: {
            community: sourceProfile.homeScene,
            track: {
              id: 'track-1',
              title: 'Source Ready',
              sourceId: managedSource.id,
              sourceName: managedSource.name,
              playableSeconds: 180,
            },
            from: '2026-07-14',
            days: 30,
            soonestValidDate: '2026-07-20',
            alternatives: ['2026-07-20', '2026-07-21'],
            diagnostics: [],
          },
        });
      }
      return Promise.resolve({ data: userSourceProfile });
    });
    mockedGetArtistBandProfile.mockResolvedValue(
      makeSourceProfile({
        tracks: [
          {
            id: 'track-1',
            artistBandId: managedSource.id,
            title: 'Source Ready',
            artist: managedSource.name,
            album: null,
            duration: 180,
            fileUrl: 'https://cdn.example.com/source-ready.mp3',
            coverArt: null,
            playCount: 0,
            likeCount: 0,
            status: 'ready',
            createdAt: '2026-07-01T00:00:00.000Z',
          },
        ],
      })
    );
    mockedApiPost.mockResolvedValue({
      success: true,
      data: {
        id: 'schedule-1',
        trackId: 'track-1',
        communityId: 'community-1',
        artistBandId: managedSource.id,
        scheduledFor: '2026-07-20T00:00:00.000Z',
        assignmentMode: 'soonest',
        requestedFor: null,
        status: 'scheduled',
        createdById: user.id,
      },
    });

    const { root, container } = render(React.createElement(ReleaseDeckPage));
    await flushEffects();

    clickButton(container, 'Load');
    await flushEffects();

    expect(container.textContent).toContain('Soonest available: Jul 20, 2026');
    expect(container.querySelector('[role="status"]')?.textContent).toContain(
      'Soonest available: Jul 20, 2026'
    );
    const schedulingControlText = Array.from(container.querySelectorAll('button, select'))
      .map((control) => control.textContent ?? '')
      .join(' ');
    expect(schedulingControlText).not.toMatch(
      /Main Rotation|New Releases ordering|recurrence|propagation/i
    );
    expect(mockedApiGet).toHaveBeenCalledWith(
      expect.stringContaining(
        '/release-deck/schedule/availability?communityId=community-1&trackId=track-1'
      ),
      { token: 'token-1' }
    );

    const scheduleForm = container.querySelector('[data-testid="release-deck-schedule-form"]');
    expect(scheduleForm).not.toBeNull();
    await act(async () => {
      scheduleForm?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    });

    expect(mockedApiPost).toHaveBeenCalledWith(
      '/release-deck/schedule',
      {
        communityId: 'community-1',
        trackId: 'track-1',
        mode: 'soonest',
      },
      { token: 'token-1' }
    );
    expect(container.textContent).toContain(
      'Source Ready is scheduled for Jul 20, 2026 using the soonest valid date.'
    );
    expect(container.textContent).toContain('Jul 20, 2026');

    cleanupRender(root, container);
  });

  it('announces unavailable schedule completion and its server reason', async () => {
    useSourceAccountStore.getState().setActiveSourceId(managedSource.id, user.id);
    mockedApiGet.mockImplementation((endpoint: string) => {
      if (endpoint.startsWith('/release-deck/schedule/availability')) {
        return Promise.resolve({
          success: false,
          error: {
            code: 'NO_VALID_DATE_IN_LOOKAHEAD',
            message: 'No valid Release Deck schedule date is available in the requested lookahead',
            trackId: 'track-1',
            soonestValidDate: null,
            alternatives: [],
            diagnostics: [],
          },
        });
      }
      return Promise.resolve({ data: userSourceProfile });
    });
    mockedGetArtistBandProfile.mockResolvedValue(
      makeSourceProfile({ tracks: [makeReadyTrack('track-1', 'Source Ready')] })
    );

    const { root, container } = render(React.createElement(ReleaseDeckPage));
    await flushEffects();
    clickButton(container, 'Load');
    await flushEffects();

    expect(container.querySelector('[role="status"]')?.textContent).toContain(
      'No schedulable date is currently available in the 30-day server lookahead.'
    );
    expect(container.querySelector('[role="alert"]')?.textContent).toContain(
      'No valid Release Deck schedule date is available in the requested lookahead'
    );

    cleanupRender(root, container);
  });

  it('submits a chosen date only from the server-provided alternatives', async () => {
    useSourceAccountStore.getState().setActiveSourceId(managedSource.id, user.id);
    mockedApiGet.mockImplementation((endpoint: string) => {
      if (endpoint.startsWith('/release-deck/schedule/availability')) {
        return Promise.resolve({
          success: true,
          data: {
            community: sourceProfile.homeScene,
            track: {
              id: 'track-1',
              title: 'Source Ready',
              sourceId: managedSource.id,
              sourceName: managedSource.name,
              playableSeconds: 180,
            },
            from: '2026-07-14',
            days: 30,
            soonestValidDate: '2026-07-20',
            alternatives: ['2026-07-20', '2026-07-21'],
            diagnostics: [],
          },
        });
      }
      return Promise.resolve({ data: userSourceProfile });
    });
    mockedGetArtistBandProfile.mockResolvedValue(
      makeSourceProfile({
        tracks: [
          {
            id: 'track-1',
            artistBandId: managedSource.id,
            title: 'Source Ready',
            artist: managedSource.name,
            album: null,
            duration: 180,
            fileUrl: 'https://cdn.example.com/source-ready.mp3',
            coverArt: null,
            playCount: 0,
            likeCount: 0,
            status: 'ready',
            createdAt: '2026-07-01T00:00:00.000Z',
          },
        ],
      })
    );
    mockedApiPost.mockResolvedValue({
      success: true,
      data: {
        id: 'schedule-2',
        trackId: 'track-1',
        communityId: 'community-1',
        artistBandId: managedSource.id,
        scheduledFor: '2026-07-21T00:00:00.000Z',
        assignmentMode: 'chosen',
        requestedFor: '2026-07-21T00:00:00.000Z',
        status: 'scheduled',
        createdById: user.id,
      },
    });

    const { root, container } = render(React.createElement(ReleaseDeckPage));
    await flushEffects();
    clickButton(container, 'Load');
    await flushEffects();

    changeNamedSelect(container, 'scheduleMode', 'chosen');
    changeNamedSelect(container, 'scheduleDate', '2026-07-21');
    const scheduleForm = container.querySelector('[data-testid="release-deck-schedule-form"]');
    await act(async () => {
      scheduleForm?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    });

    expect(mockedApiPost).toHaveBeenCalledWith(
      '/release-deck/schedule',
      {
        communityId: 'community-1',
        trackId: 'track-1',
        mode: 'chosen',
        requestedDate: '2026-07-21',
      },
      { token: 'token-1' }
    );
    expect(container.textContent).toContain('The source selected this available date.');

    cleanupRender(root, container);
  });

  it('does not let an in-flight schedule response overwrite a newly loaded row', async () => {
    useSourceAccountStore.getState().setActiveSourceId(managedSource.id, user.id);
    mockedApiGet.mockImplementation((endpoint: string) => {
      if (endpoint.startsWith('/release-deck/schedule/availability')) {
        const secondTrack = endpoint.includes('trackId=track-2');
        const date = secondTrack ? '2026-07-21' : '2026-07-20';
        return Promise.resolve({
          success: true,
          data: {
            community: sourceProfile.homeScene,
            track: {
              id: secondTrack ? 'track-2' : 'track-1',
              title: secondTrack ? 'Second Ready' : 'First Ready',
              sourceId: managedSource.id,
              sourceName: managedSource.name,
              playableSeconds: 180,
            },
            from: '2026-07-14',
            days: 30,
            soonestValidDate: date,
            alternatives: [date],
            diagnostics: [],
          },
        });
      }
      return Promise.resolve({ data: userSourceProfile });
    });
    mockedGetArtistBandProfile.mockResolvedValue(
      makeSourceProfile({
        tracks: [
          makeReadyTrack('track-1', 'First Ready'),
          makeReadyTrack('track-2', 'Second Ready'),
        ],
      })
    );

    let resolveSchedule!: (value: unknown) => void;
    mockedApiPost.mockReturnValue(
      new Promise((resolve) => {
        resolveSchedule = resolve;
      })
    );

    const { root, container } = render(React.createElement(ReleaseDeckPage));
    await flushEffects();
    clickButtonAt(container, 'Load', 0);
    await flushEffects();

    const firstScheduleForm = container.querySelector('[data-testid="release-deck-schedule-form"]');
    await act(async () => {
      firstScheduleForm?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
      await Promise.resolve();
    });

    clickButtonAt(container, 'Load', 1);
    await flushEffects();
    expect(container.textContent).toContain('Soonest available: Jul 21, 2026');

    await act(async () => {
      resolveSchedule({
        success: true,
        data: {
          id: 'schedule-stale',
          trackId: 'track-1',
          communityId: 'community-1',
          artistBandId: managedSource.id,
          scheduledFor: '2026-07-20T00:00:00.000Z',
          assignmentMode: 'soonest',
          requestedFor: null,
          status: 'scheduled',
          createdById: user.id,
        },
      });
      await Promise.resolve();
    });

    expect(container.textContent).toContain('Soonest available: Jul 21, 2026');
    expect(container.textContent).not.toContain('First Ready is scheduled for Jul 20, 2026');

    cleanupRender(root, container);
  });

  it('does not apply an in-flight schedule response after authentication changes', async () => {
    useSourceAccountStore.getState().setActiveSourceId(managedSource.id, user.id);
    mockedApiGet.mockImplementation((endpoint: string) => {
      if (endpoint.startsWith('/release-deck/schedule/availability')) {
        return Promise.resolve({
          success: true,
          data: {
            community: sourceProfile.homeScene,
            track: {
              id: 'track-1',
              title: 'Source Ready',
              sourceId: managedSource.id,
              sourceName: managedSource.name,
              playableSeconds: 180,
            },
            from: '2026-07-14',
            days: 30,
            soonestValidDate: '2026-07-20',
            alternatives: ['2026-07-20'],
            diagnostics: [],
          },
        });
      }
      return Promise.resolve({ data: userSourceProfile });
    });
    mockedGetArtistBandProfile.mockResolvedValue(
      makeSourceProfile({ tracks: [makeReadyTrack('track-1', 'Source Ready')] })
    );

    let resolveSchedule!: (value: unknown) => void;
    mockedApiPost.mockReturnValue(
      new Promise((resolve) => {
        resolveSchedule = resolve;
      })
    );

    const { root, container } = render(React.createElement(ReleaseDeckPage));
    await flushEffects();
    clickButton(container, 'Load');
    await flushEffects();

    const scheduleForm = container.querySelector('[data-testid="release-deck-schedule-form"]');
    await act(async () => {
      scheduleForm?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
      await Promise.resolve();
      useAuthStore.getState().clearAuth();
    });
    await flushEffects();

    await act(async () => {
      resolveSchedule({
        success: true,
        data: {
          id: 'schedule-stale-auth',
          trackId: 'track-1',
          communityId: 'community-1',
          artistBandId: managedSource.id,
          scheduledFor: '2026-07-20T00:00:00.000Z',
          assignmentMode: 'soonest',
          requestedFor: null,
          status: 'scheduled',
          createdById: user.id,
        },
      });
      await Promise.resolve();
    });

    expect(container.textContent).toContain('Sign in is required before opening Release Deck.');
    expect(container.textContent).not.toContain(
      'Source Ready is scheduled for Jul 20, 2026 using the soonest valid date.'
    );

    cleanupRender(root, container);
  });

  it('refreshes availability after a schedule write conflict', async () => {
    useSourceAccountStore.getState().setActiveSourceId(managedSource.id, user.id);
    let availabilityReads = 0;
    mockedApiGet.mockImplementation((endpoint: string) => {
      if (endpoint.startsWith('/release-deck/schedule/availability')) {
        availabilityReads += 1;
        const date = availabilityReads === 1 ? '2026-07-20' : '2026-07-22';
        return Promise.resolve({
          success: true,
          data: {
            community: sourceProfile.homeScene,
            track: {
              id: 'track-1',
              title: 'Source Ready',
              sourceId: managedSource.id,
              sourceName: managedSource.name,
              playableSeconds: 180,
            },
            from: '2026-07-14',
            days: 30,
            soonestValidDate: date,
            alternatives: [date],
            diagnostics: [],
          },
        });
      }
      return Promise.resolve({ data: userSourceProfile });
    });
    mockedGetArtistBandProfile.mockResolvedValue(
      makeSourceProfile({ tracks: [makeReadyTrack('track-1', 'Source Ready')] })
    );
    mockedApiPost.mockRejectedValue(
      new Error('Scheduling capacity changed. Refresh availability and try again.')
    );

    const { root, container } = render(React.createElement(ReleaseDeckPage));
    await flushEffects();
    clickButton(container, 'Load');
    await flushEffects();

    const scheduleForm = container.querySelector('[data-testid="release-deck-schedule-form"]');
    await act(async () => {
      scheduleForm?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
      await Promise.resolve();
      await Promise.resolve();
    });
    await flushEffects();

    expect(availabilityReads).toBe(2);
    expect(container.textContent).toContain('Soonest available: Jul 22, 2026');
    expect(container.querySelector('[role="alert"]')?.textContent).toContain(
      'Scheduling capacity changed. Refresh availability and try again. Availability was refreshed.'
    );

    cleanupRender(root, container);
  });

  it('restores an existing scheduled date and assignment mode after Load', async () => {
    useSourceAccountStore.getState().setActiveSourceId(managedSource.id, user.id);
    mockedApiGet.mockImplementation((endpoint: string) => {
      if (endpoint.startsWith('/release-deck/schedule/availability')) {
        return Promise.resolve({
          success: false,
          error: {
            code: 'ALREADY_SCHEDULED_OR_ACTIVE',
            message: 'Track is already scheduled or active in RADIYO',
            trackId: 'track-1',
            schedule: {
              id: 'schedule-existing',
              status: 'scheduled',
              scheduledFor: '2026-07-22',
              assignmentMode: 'chosen',
              requestedFor: '2026-07-22',
            },
          },
        });
      }
      return Promise.resolve({ data: userSourceProfile });
    });
    mockedGetArtistBandProfile.mockResolvedValue(
      makeSourceProfile({
        tracks: [
          {
            id: 'track-1',
            artistBandId: managedSource.id,
            title: 'Source Ready',
            artist: managedSource.name,
            album: null,
            duration: 180,
            fileUrl: 'https://cdn.example.com/source-ready.mp3',
            coverArt: null,
            playCount: 0,
            likeCount: 0,
            status: 'ready',
            createdAt: '2026-07-01T00:00:00.000Z',
          },
        ],
      })
    );

    const { root, container } = render(React.createElement(ReleaseDeckPage));
    await flushEffects();
    clickButton(container, 'Load');
    await flushEffects();

    expect(container.textContent).toContain('Release date scheduled');
    expect(container.textContent).toContain('Jul 22, 2026 · scheduled');
    expect(container.textContent).toContain('The source selected this available date.');
    expect(container.querySelector('[data-testid="release-deck-schedule-form"]')).toBeNull();
    expect(container.querySelector('[role="status"]')?.textContent).toContain(
      'Release date scheduled'
    );

    cleanupRender(root, container);
  });

  it('shows missing Home Scene state and disables Release Deck submit', async () => {
    useSourceAccountStore.getState().setActiveSourceId(managedSource.id, user.id);
    mockedApiGet.mockResolvedValue({ data: userSourceProfile });
    mockedGetArtistBandProfile.mockResolvedValue(makeSourceProfile({ homeScene: null }));

    const { root, container } = render(React.createElement(ReleaseDeckPage));
    await flushEffects();

    const submitButton = container.querySelector(
      'button[type="submit"]'
    ) as HTMLButtonElement | null;
    expect(container.textContent).toContain('Home Scene unavailable');
    expect(container.textContent).toContain(
      'An active source with a resolved Home Scene is required before releasing a single.'
    );
    expect(submitButton?.disabled).toBe(true);

    cleanupRender(root, container);
  });

  it('blocks Release Deck submit when the source music-slot cap is reached', async () => {
    useSourceAccountStore.getState().setActiveSourceId(managedSource.id, user.id);
    mockedApiGet.mockResolvedValue({ data: userSourceProfile });
    mockedGetArtistBandProfile.mockResolvedValue(
      makeSourceProfile({
        tracks: [1, 2, 3].map((slot) => ({
          id: `track-${slot}`,
          artistBandId: managedSource.id,
          title: `Ready ${slot}`,
          artist: managedSource.name,
          album: null,
          duration: 180,
          fileUrl: `https://cdn.example.com/ready-${slot}.mp3`,
          coverArt: null,
          playCount: 0,
          likeCount: 0,
          status: 'ready',
          createdAt: '2026-07-01T00:00:00.000Z',
        })),
      })
    );

    const { root, container } = render(React.createElement(ReleaseDeckPage));
    await flushEffects();

    changeInput(container, 'title', 'Blocked Single');
    changeInput(container, 'duration', '120');
    changeInput(container, 'fileUrl', 'https://cdn.example.com/blocked.mp3');

    const form = container.querySelector('form');
    expect(form).not.toBeNull();

    await act(async () => {
      form?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    });

    expect(container.textContent).toContain(
      'Cap reached: this screen will not silently replace existing tracks or create an extra active music slot.'
    );
    expect(container.textContent).toContain('Release Deck already has 3 active music slots.');
    expect(mockedCreateTrack).not.toHaveBeenCalled();

    cleanupRender(root, container);
  });
});
