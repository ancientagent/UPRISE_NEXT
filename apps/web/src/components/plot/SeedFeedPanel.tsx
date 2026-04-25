'use client';

import { Fragment, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { Button } from '@uprise/ui';
import type {
  CommunityDiscoverHighlights,
  DiscoverRecommendationResult,
  DiscoverSignalResult,
} from '@uprise/types';
import {
  getActiveCommunityEvents,
  getActiveCommunityFeed,
  getCommunityEvents,
  getCommunityFeed,
  type CommunityFeedActor,
  type CommunityEventItem,
  type CommunityFeedItem,
} from '@/lib/communities/client';
import { getCommunityDiscoverHighlights } from '@/lib/discovery/client';
import { useAuthStore } from '@/store/auth';

type FeedItemType = CommunityFeedItem['type'];

interface SeedFeedPanelProps {
  communityId: string | null;
  communityLabel?: string | null;
  selectedTier: 'city' | 'state' | 'national';
}

function formatTypeLabel(type: FeedItemType): string {
  switch (type) {
    case 'blast':
      return 'Blast';
    case 'track_release':
      return 'Track Release';
    case 'event_created':
      return 'Event Created';
    case 'signal_created':
      return 'Signal Created';
    default:
      return type;
  }
}

function formatActor(actor: CommunityFeedActor | null): string {
  if (!actor) return 'Community';
  return actor.displayName || actor.username || 'Community';
}

function sourceFromMetadata(item: CommunityFeedItem): { id: string; name: string } | null {
  const artistBand = item.metadata?.artistBand;
  if (!artistBand || typeof artistBand !== 'object') return null;

  const id = 'id' in artistBand && typeof artistBand.id === 'string' ? artistBand.id : null;
  const name = 'name' in artistBand && typeof artistBand.name === 'string' ? artistBand.name : null;

  if (!id || !name) return null;
  return { id, name };
}

function artistTrackHref(item: CommunityFeedItem): string | null {
  if (item.type !== 'track_release') return null;

  const source = sourceFromMetadata(item);
  if (!source) return null;

  return `/artist-bands/${source.id}?trackId=${item.entity.id}`;
}

function discoverSignalArtistBandId(signal: DiscoverSignalResult): string | null {
  if (signal.artistBandId) return signal.artistBandId;
  const metadata = signal.metadata;
  if (!metadata || typeof metadata !== 'object') return null;
  const artistBandId = (metadata as Record<string, unknown>).artistBandId;
  return typeof artistBandId === 'string' && artistBandId.trim() ? artistBandId.trim() : null;
}

function discoverSignalTitle(signal: DiscoverSignalResult): string {
  const metadata = signal.metadata;
  if (metadata && typeof metadata === 'object') {
    const title = (metadata as Record<string, unknown>).title;
    if (typeof title === 'string' && title.trim()) return title.trim();
    const name = (metadata as Record<string, unknown>).name;
    if (typeof name === 'string' && name.trim()) return name.trim();
  }

  return 'Untitled song';
}

function discoverSignalArtist(signal: DiscoverSignalResult): string {
  const metadata = signal.metadata;
  if (metadata && typeof metadata === 'object') {
    const artist = (metadata as Record<string, unknown>).artist;
    if (typeof artist === 'string' && artist.trim()) return artist.trim();
    const artistName = (metadata as Record<string, unknown>).artistName;
    if (typeof artistName === 'string' && artistName.trim()) return artistName.trim();
  }

  return 'Unknown artist';
}

function discoverSignalHref(signal: DiscoverSignalResult): string | null {
  const artistBandId = discoverSignalArtistBandId(signal);
  if (!artistBandId) return null;
  return `/artist-bands/${artistBandId}?signalId=${signal.signalId}`;
}

function HorizontalSignalRail({
  title,
  signals,
}: {
  title: string;
  signals: DiscoverSignalResult[];
}) {
  const railRef = useRef<HTMLDivElement | null>(null);

  const scrollByDirection = (direction: 'left' | 'right') => {
    if (!railRef.current) return;
    railRef.current.scrollBy({
      left: direction === 'left' ? -260 : 260,
      behavior: 'smooth',
    });
  };

  if (signals.length === 0) return null;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-black">{title}</p>
          <p className="text-xs text-black/55">Read-only artist/song launch squares.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            size="sm"
            variant="outline"
            className="h-8 rounded-full border-black bg-white text-xs"
            aria-label={`Scroll ${title} left`}
            onClick={() => scrollByDirection('left')}
          >
            ←
          </Button>
          <Button
            type="button"
            size="sm"
            variant="outline"
            className="h-8 rounded-full border-black bg-white text-xs"
            aria-label={`Scroll ${title} right`}
            onClick={() => scrollByDirection('right')}
          >
            →
          </Button>
        </div>
      </div>

      <div ref={railRef} className="flex gap-3 overflow-x-auto pb-1">
        {signals.map((signal) => {
          const href = discoverSignalHref(signal);
          const body = (
            <div className="flex h-full flex-col rounded-[1rem] border border-black bg-white p-3">
              <div className="flex h-24 items-center justify-center rounded-[0.8rem] border border-black/10 bg-[linear-gradient(135deg,#e6e6d8_0%,#d2d2bd_100%)]">
                <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-black/50">
                  Art / Logo
                </span>
              </div>
              <div className="mt-3 min-w-0">
                <p className="truncate text-xs font-semibold uppercase tracking-[0.12em] text-black/55">
                  {discoverSignalArtist(signal)}
                </p>
                <p className="mt-1 line-clamp-2 text-sm font-medium leading-tight text-black">
                  {discoverSignalTitle(signal)}
                </p>
              </div>
            </div>
          );

          return (
            <div key={signal.signalId} className="w-[11rem] min-w-[11rem] shrink-0">
              {href ? (
                <Link href={href} className="block h-full">
                  {body}
                </Link>
              ) : (
                body
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function PopularSinglesInsert({ highlights }: { highlights: CommunityDiscoverHighlights }) {
  const hasMostAdded = highlights.popularSingles.mostAdded.length > 0;
  const hasRecentRises = highlights.popularSingles.recentRises.length > 0;

  if (!hasMostAdded && !hasRecentRises) {
    return null;
  }

  return (
    <section data-slot="plot-feed-popular-singles-insert" className="plot-wire-card-muted space-y-4 bg-[#efefe2] p-4">
      <div>
        <p className="plot-wire-label">Inserted Discovery Moment</p>
        <h3 className="mt-1 text-lg font-semibold text-black">Popular Singles</h3>
        <p className="mt-1 text-sm text-black/65">
          A read-only community snapshot pulled from current signal stats.
        </p>
      </div>

      <HorizontalSignalRail title="Most Added" signals={highlights.popularSingles.mostAdded} />
      {hasRecentRises ? (
        <HorizontalSignalRail title="Recent Rises" signals={highlights.popularSingles.recentRises} />
      ) : null}
    </section>
  );
}

function RecommendationsInsert({ highlights }: { highlights: CommunityDiscoverHighlights }) {
  if (highlights.recommendations.length === 0) {
    return null;
  }

  const railRef = useRef<HTMLDivElement | null>(null);
  const scrollByDirection = (direction: 'left' | 'right') => {
    if (!railRef.current) return;
    railRef.current.scrollBy({
      left: direction === 'left' ? -260 : 260,
      behavior: 'smooth',
    });
  };

  return (
    <section data-slot="plot-feed-buzz-insert" className="plot-wire-card-muted space-y-4 bg-[#efefe2] p-4">
      <div>
        <p className="plot-wire-label">Inserted Discovery Moment</p>
        <h3 className="mt-1 text-lg font-semibold text-black">Buzz</h3>
        <p className="mt-1 text-sm text-black/65">
          Listener recommendations from this community, surfaced without inline actions.
        </p>
      </div>

      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-black">Community buzz</p>
          <p className="text-xs text-black/55">Read-only listener recommendation squares.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            size="sm"
            variant="outline"
            className="h-8 rounded-full border-black bg-white text-xs"
            aria-label="Scroll Buzz left"
            onClick={() => scrollByDirection('left')}
          >
            ←
          </Button>
          <Button
            type="button"
            size="sm"
            variant="outline"
            className="h-8 rounded-full border-black bg-white text-xs"
            aria-label="Scroll Buzz right"
            onClick={() => scrollByDirection('right')}
          >
            →
          </Button>
        </div>
      </div>

      <div ref={railRef} className="flex gap-3 overflow-x-auto pb-1">
        {highlights.recommendations.map((recommendation: DiscoverRecommendationResult) => {
          const href = discoverSignalHref(recommendation.signal);
          const body = (
            <div className="flex h-full flex-col rounded-[1rem] border border-black bg-white p-3">
              <div className="flex items-start justify-between gap-2">
                <span className="plot-wire-chip bg-[#d8e79a] text-black">Recommended</span>
                <span className="text-[10px] uppercase tracking-[0.14em] text-black/45">
                  {new Date(recommendation.createdAt).toLocaleDateString()}
                </span>
              </div>
              <div className="mt-3 flex h-24 items-center justify-center rounded-[0.8rem] border border-black/10 bg-[linear-gradient(135deg,#e6e6d8_0%,#d2d2bd_100%)]">
                <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-black/50">
                  Art / Logo
                </span>
              </div>
              <div className="mt-3 min-w-0">
                <p className="truncate text-xs font-semibold uppercase tracking-[0.12em] text-black/55">
                  {discoverSignalArtist(recommendation.signal)}
                </p>
                <p className="mt-1 line-clamp-2 text-sm font-medium leading-tight text-black">
                  {discoverSignalTitle(recommendation.signal)}
                </p>
                <p className="mt-2 text-xs text-black/55">
                  Recommended by {recommendation.actor.displayName || recommendation.actor.username}
                </p>
              </div>
            </div>
          );

          return (
            <div key={recommendation.recommendationId} className="w-[11rem] min-w-[11rem] shrink-0">
              {href ? (
                <Link href={href} className="block h-full">
                  {body}
                </Link>
              ) : (
                body
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}

function FeedSkeletonRows() {
  return (
    <div className="mt-4 space-y-2" aria-hidden="true">
      {[0, 1, 2].map((index) => (
        <div key={index} className="plot-wire-list-item bg-[#efefe2] p-3">
          <div className="h-4 w-40 animate-pulse rounded bg-black/10" />
          <div className="mt-2 h-3 w-56 animate-pulse rounded bg-black/5" />
        </div>
      ))}
    </div>
  );
}

function UpcomingEventsInsert({ items }: { items: CommunityEventItem[] }) {
  const railRef = useRef<HTMLDivElement | null>(null);

  const scrollByDirection = (direction: 'left' | 'right') => {
    if (!railRef.current) return;
    railRef.current.scrollBy({
      left: direction === 'left' ? -260 : 260,
      behavior: 'smooth',
    });
  };

  if (items.length === 0) {
    return null;
  }

  return (
    <section data-slot="plot-feed-upcoming-events-insert" className="plot-wire-card-muted space-y-4 bg-[#efefe2] p-4">
      <div>
        <p className="plot-wire-label">Inserted Scene Moment</p>
        <h3 className="mt-1 text-lg font-semibold text-black">Upcoming Events</h3>
        <p className="mt-1 text-sm text-black/65">
          Read-only event snapshots from the current scene context.
        </p>
      </div>

      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-black">Upcoming this week</p>
          <p className="text-xs text-black/55">Read-only event squares with no inline calendar actions.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            size="sm"
            variant="outline"
            className="h-8 rounded-full border-black bg-white text-xs"
            aria-label="Scroll Upcoming Events left"
            onClick={() => scrollByDirection('left')}
          >
            ←
          </Button>
          <Button
            type="button"
            size="sm"
            variant="outline"
            className="h-8 rounded-full border-black bg-white text-xs"
            aria-label="Scroll Upcoming Events right"
            onClick={() => scrollByDirection('right')}
          >
            →
          </Button>
        </div>
      </div>

      <div ref={railRef} className="flex gap-3 overflow-x-auto pb-1">
        {items.map((item) => (
          <div key={item.id} className="w-[12rem] min-w-[12rem] shrink-0">
            <div className="flex h-full flex-col rounded-[1rem] border border-black bg-white p-3">
              <div className="flex items-start justify-between gap-2">
                <span className="plot-wire-chip bg-[#d8e79a] text-black">Event</span>
                <span className="text-[10px] uppercase tracking-[0.14em] text-black/45">
                  {new Date(item.startDate).toLocaleDateString()}
                </span>
              </div>
              <div className="mt-3 flex h-24 items-center justify-center rounded-[0.8rem] border border-black/10 bg-[linear-gradient(135deg,#e6e6d8_0%,#d2d2bd_100%)]">
                <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-black/50">
                  Flyer / Poster
                </span>
              </div>
              <div className="mt-3 min-w-0">
                <p className="line-clamp-2 text-sm font-medium leading-tight text-black">{item.title}</p>
                <p className="mt-1 truncate text-xs font-semibold uppercase tracking-[0.12em] text-black/55">
                  {item.locationName}
                </p>
                <p className="mt-2 text-xs text-black/55">
                  {item.artistBand?.name
                    ? `Published by ${item.artistBand.name}`
                    : item.createdBy?.displayName || item.createdBy?.username
                      ? `Published by ${item.createdBy?.displayName || item.createdBy?.username}`
                      : 'Scene organizer event'}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default function SeedFeedPanel({
  communityId,
  communityLabel,
  selectedTier,
}: SeedFeedPanelProps) {
  const { token } = useAuthStore();
  const [items, setItems] = useState<CommunityFeedItem[]>([]);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [resolvedSceneId, setResolvedSceneId] = useState<string | null>(communityId);
  const [highlights, setHighlights] = useState<CommunityDiscoverHighlights | null>(null);
  const [highlightsError, setHighlightsError] = useState<string | null>(null);
  const [upcomingEvents, setUpcomingEvents] = useState<CommunityEventItem[]>([]);
  const [upcomingEventsError, setUpcomingEventsError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const title = useMemo(() => {
    if (!communityLabel) return 'S.E.E.D Feed';
    return `S.E.E.D Feed • ${communityLabel}`;
  }, [communityLabel]);

  const contextLabel = useMemo(() => {
    const tierLabel = selectedTier.charAt(0).toUpperCase() + selectedTier.slice(1);
    if (communityLabel) {
      return `${tierLabel} scene anchor: ${communityLabel}`;
    }

    if (resolvedSceneId) {
      return `${tierLabel} active scene fallback loaded`;
    }

    return `${tierLabel} scene context is resolving`;
  }, [communityLabel, resolvedSceneId, selectedTier]);

  const fetchPage = useCallback(
    async (before?: string | null) => {
      if (!token) {
        setItems([]);
        setNextCursor(null);
        setResolvedSceneId(communityId);
        setError(null);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const response = communityId
          ? await getCommunityFeed(
              communityId,
              { limit: 20, before },
              token || undefined,
            )
          : await getActiveCommunityFeed({ limit: 20, before }, token || undefined);

        setItems((prev) => (before ? [...prev, ...response.items] : response.items));
        setNextCursor(response.nextCursor);
        setResolvedSceneId(response.sceneId);
      } catch (e) {
        const message =
          e instanceof Error ? e.message : 'Unable to load the scene feed right now.';
        setError(message);
      } finally {
        setLoading(false);
      }
    },
    [communityId, token],
  );

  useEffect(() => {
    setItems([]);
    setNextCursor(null);
    fetchPage(null);
  }, [communityId, fetchPage]);

  useEffect(() => {
    let cancelled = false;

    async function loadHighlights() {
      if (!token || !resolvedSceneId) {
        setHighlights(null);
        setHighlightsError(null);
        return;
      }

      try {
        const response = await getCommunityDiscoverHighlights(
          resolvedSceneId,
          token,
          6,
          selectedTier,
        );

        if (cancelled) return;
        setHighlights(response);
        setHighlightsError(null);
      } catch (e) {
        if (cancelled) return;
        const message =
          e instanceof Error ? e.message : 'Unable to load Popular Singles for this scene.';
        setHighlights(null);
        setHighlightsError(message);
      }
    }

    void loadHighlights();

    return () => {
      cancelled = true;
    };
  }, [resolvedSceneId, selectedTier, token]);

  useEffect(() => {
    let cancelled = false;

    async function loadUpcomingEvents() {
      if (!token) {
        setUpcomingEvents([]);
        setUpcomingEventsError(null);
        return;
      }

      try {
        const response = resolvedSceneId
          ? await getCommunityEvents(
              resolvedSceneId,
              { limit: 6, includePast: false },
              token,
            )
          : await getActiveCommunityEvents(
              { limit: 6, includePast: false },
              token,
            );

        if (cancelled) return;
        setUpcomingEvents(response.slice(0, 6));
        setUpcomingEventsError(null);
      } catch (e) {
        if (cancelled) return;
        const message =
          e instanceof Error ? e.message : 'Unable to load upcoming events for this scene.';
        setUpcomingEvents([]);
        setUpcomingEventsError(message);
      }
    }

    void loadUpcomingEvents();

    return () => {
      cancelled = true;
    };
  }, [resolvedSceneId, token]);

  return (
    <div className="space-y-4">
      <header className="plot-wire-card-muted bg-[#efefe2] px-4 py-3">
        <h2 className="text-lg font-semibold text-black">{title}</h2>
        <p className="mt-1 text-xs text-black/55">
          Support, Explore, Engage, Distribute. Scene-scoped, reverse-chronological, and non-personalized.
        </p>
        <p className="mt-2 text-[11px] text-black/62">{contextLabel}</p>
      </header>

      {!token ? (
        <div className="rounded-[1rem] border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          <p>Sign in is required to load the S.E.E.D feed for this scene context.</p>
        </div>
      ) : null}

      {token && error && (
        <div className="rounded-[1rem] border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700">
          <p>Feed read failed for this scene context. {error}</p>
          <Button
            className="mt-3 h-8 rounded-full border-black bg-white text-xs font-semibold uppercase tracking-[0.12em]"
            size="sm"
            variant="outline"
            onClick={() => fetchPage(null)}
          >
            Retry Feed
          </Button>
        </div>
      )}

      {token && !error && loading && items.length === 0 ? <FeedSkeletonRows /> : null}

      {token && !error && items.length === 0 && !loading ? (
        <div className="space-y-4">
          <div className="plot-wire-card-muted border-dashed p-4">
            <p className="text-sm font-medium text-black">No current scene activity for this context.</p>
            <p className="mt-1 text-xs text-black/55">
              When explicit community actions land here, every listener in the same scene sees the same feed.
            </p>
          </div>
          {highlights ? <PopularSinglesInsert highlights={highlights} /> : null}
          {highlights ? <RecommendationsInsert highlights={highlights} /> : null}
          <UpcomingEventsInsert items={upcomingEvents} />
        </div>
      ) : token ? (
        <ul className="space-y-2">
          {items.map((item, index) => {
            const source = sourceFromMetadata(item);
            const trackHref = artistTrackHref(item);
            const content = (
              <>
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-black">
                    <span className="font-medium">{formatTypeLabel(item.type)}</span>
                    <span className="text-black/60">
                      {' '}
                      by{' '}
                      {trackHref && source ? (
                        source.name
                      ) : source ? (
                        <Link className="underline underline-offset-2" href={`/artist-bands/${source.id}`}>
                          {source.name}
                        </Link>
                      ) : item.actor && !trackHref ? (
                        <Link className="underline underline-offset-2" href={`/users/${item.actor.id}`}>
                          {formatActor(item.actor)}
                        </Link>
                      ) : (
                        formatActor(item.actor)
                      )}
                    </span>
                  </p>
                  <p className="mt-1 text-xs text-black/50">
                    {new Date(item.occurredAt).toLocaleString()} • {item.entity.type}
                  </p>
                </div>
                <span className="plot-wire-chip shrink-0">{formatTypeLabel(item.type)}</span>
              </>
            );

            return (
              <Fragment key={item.id}>
                <li key={item.id} className="plot-wire-list-item">
                  {trackHref ? (
                    <Link href={trackHref} className="flex items-start justify-between gap-3">
                      {content}
                    </Link>
                  ) : (
                    <div className="flex items-start justify-between gap-3">{content}</div>
                  )}
                </li>
                {index === 1 && highlights ? (
                  <li className="list-none">
                    <PopularSinglesInsert highlights={highlights} />
                  </li>
                ) : null}
                {index === 4 && highlights ? (
                  <li className="list-none">
                    <RecommendationsInsert highlights={highlights} />
                  </li>
                ) : null}
                {index === 7 && upcomingEvents.length > 0 ? (
                  <li className="list-none">
                    <UpcomingEventsInsert items={upcomingEvents} />
                  </li>
                ) : null}
              </Fragment>
            );
          })}
        </ul>
      ) : null}

      {token && !error && items.length > 0 && items.length < 2 && highlights ? (
        <div className="space-y-4">
          <PopularSinglesInsert highlights={highlights} />
          <RecommendationsInsert highlights={highlights} />
          <UpcomingEventsInsert items={upcomingEvents} />
        </div>
      ) : null}

      {token && !error && items.length > 0 && !highlights && highlightsError ? (
        <div className="rounded-[1rem] border border-black/10 bg-white px-4 py-3 text-sm text-black/60">
          Popular Singles is unavailable right now. {highlightsError}
        </div>
      ) : null}

      {token && !error && items.length > 0 && upcomingEvents.length === 0 && upcomingEventsError ? (
        <div className="rounded-[1rem] border border-black/10 bg-white px-4 py-3 text-sm text-black/60">
          Upcoming Events is unavailable right now. {upcomingEventsError}
        </div>
      ) : null}

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          className="rounded-full border-black bg-white text-xs font-semibold uppercase tracking-[0.12em]"
          disabled={!token || loading || !nextCursor}
          onClick={() => fetchPage(nextCursor)}
        >
          {loading ? 'Loading...' : 'Load More'}
        </Button>
      </div>
    </div>
  );
}
