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
  default: ({ href, children, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }) => (
    React.createElement('a', { href, ...props }, children)
  ),
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

describe('source dashboard runtime behavior', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    document.body.innerHTML = '';
    window.localStorage.clear();
    useAuthStore.getState().setAuth(user, 'token-1');
    useOnboardingStore.getState().setHomeScene({ city: 'Austin', state: 'TX', musicCommunity: 'Punk' });
    useSourceAccountStore.getState().clearActiveSourceId();
    mockedListPromoterRegistrations.mockResolvedValue({ entries: [] });
  });

  it('keeps source dashboard in listener/no-source state until a valid source context is selected', async () => {
    mockedApiGet.mockResolvedValue({ data: userSourceProfile });

    const { root, container } = render(React.createElement(SourceDashboardPage));
    await flushEffects();

    expect(container.textContent).toContain('Select a source account');
    expect(container.textContent).toContain('Listener Account is active. Select one managed source account above before source tools operate.');
    expect(container.textContent).not.toContain('Open Release Deck');

    cleanupRender(root, container);
  });

  it('clears stale source dashboard context before source tools render', async () => {
    useSourceAccountStore.getState().setActiveSourceId(managedSource.id, 'other-user');
    mockedApiGet.mockResolvedValue({ data: userSourceProfile });

    const { root, container } = render(React.createElement(SourceDashboardPage));
    await flushEffects();

    expect(container.textContent).toContain('Stale source context was cleared because it no longer belongs to this signed-in user.');
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
      }),
    );

    const { root, container } = render(React.createElement(ReleaseDeckPage));
    await flushEffects();

    expect(container.textContent).toContain('1 / 3 source-owned ready');
    expect(container.textContent).toContain('3:00 / 15:00');
    expect(container.textContent).toContain('Ready for Fair Play/player testing');
    expect(container.textContent).toContain('Source-owned release');
    expect(container.textContent).toContain('Legacy carry-forward');

    cleanupRender(root, container);
  });

  it('shows missing Home Scene state and disables Release Deck submit', async () => {
    useSourceAccountStore.getState().setActiveSourceId(managedSource.id, user.id);
    mockedApiGet.mockResolvedValue({ data: userSourceProfile });
    mockedGetArtistBandProfile.mockResolvedValue(makeSourceProfile({ homeScene: null }));

    const { root, container } = render(React.createElement(ReleaseDeckPage));
    await flushEffects();

    const submitButton = container.querySelector('button[type="submit"]') as HTMLButtonElement | null;
    expect(container.textContent).toContain('Home Scene unavailable');
    expect(container.textContent).toContain('An active source with a resolved Home Scene is required before releasing a single.');
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
      }),
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

    expect(container.textContent).toContain('Cap reached: 3 active music slots are already filled.');
    expect(container.textContent).toContain('Release Deck already has 3 active music slots.');
    expect(mockedCreateTrack).not.toHaveBeenCalled();

    cleanupRender(root, container);
  });
});
