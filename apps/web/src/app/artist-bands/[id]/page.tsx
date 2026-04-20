'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@uprise/ui';
import type { ArtistBandProfile, ArtistBandTrackSummary } from '@uprise/types';
import { followArtistBand, getArtistBandProfile } from '@/lib/artist-bands/client';
import { formatArtistBandEntityType } from '@/lib/registrar/artistBandLabels';
import { collectSignal } from '@/lib/signals/client';
import { useAuthStore } from '@/store/auth';
import { useSourceAccountStore } from '@/store/source-account';

function formatCommunityIdentity(
  city: string | null,
  state: string | null,
  musicCommunity: string | null,
) {
  if (city && state && musicCommunity) return `${city}, ${state} • ${musicCommunity}`;
  return 'Community identity unavailable.';
}

function formatDuration(seconds: number) {
  if (!Number.isFinite(seconds) || seconds <= 0) return '0:00';
  const minutes = Math.floor(seconds / 60);
  const remainder = Math.floor(seconds % 60);
  return `${minutes}:${String(remainder).padStart(2, '0')}`;
}

function getOfficialLinks(profile: ArtistBandProfile) {
  return [
    {
      key: 'website',
      label: 'Official Site',
      href: profile.officialWebsiteUrl,
      helper: 'Artist-controlled home base',
    },
    {
      key: 'music',
      label: 'Buy Music',
      href: profile.musicUrl,
      helper: 'Albums, releases, and direct music support',
    },
    {
      key: 'merch',
      label: 'Merch',
      href: profile.merchUrl,
      helper: 'Shirts, patches, buttons, and more',
    },
    {
      key: 'donation',
      label: 'Donate',
      href: profile.donationUrl,
      helper: 'Direct support for the artist',
    },
  ].filter((link) => Boolean(link.href));
}

export default function ArtistBandProfilePage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { token, user } = useAuthStore();
  const { activeSourceId, setActiveSourceId } = useSourceAccountStore();

  const [profile, setProfile] = useState<ArtistBandProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionMessage, setActionMessage] = useState<string | null>(null);
  const [busyAction, setBusyAction] = useState<'follow' | null>(null);
  const [activeTrackId, setActiveTrackId] = useState<string | null>(null);
  const [playingTrackId, setPlayingTrackId] = useState<string | null>(null);
  const [collectingTrackId, setCollectingTrackId] = useState<string | null>(null);
  const [collectedSignalIds, setCollectedSignalIds] = useState<Record<string, true>>({});
  const [trackTimes, setTrackTimes] = useState<Record<string, number>>({});
  const [trackDurations, setTrackDurations] = useState<Record<string, number>>({});
  const audioRefs = useRef<Record<string, HTMLAudioElement | null>>({});

  const artistBandId = useMemo(() => (typeof params?.id === 'string' ? params.id : ''), [params]);
  const selectedTrackId = searchParams.get('trackId');
  const officialLinks = useMemo(() => (profile ? getOfficialLinks(profile) : []), [profile]);

  async function loadProfile() {
    if (!artistBandId) {
      setProfile(null);
      setError('Invalid artist page id.');
      setLoading(false);
      return;
    }

    if (!token) {
      setProfile(null);
      setError('You must be signed in to view artist pages.');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await getArtistBandProfile(artistBandId, token);
      setProfile(response);
    } catch (e) {
      setProfile(null);
      setError(e instanceof Error ? e.message : 'Failed to load artist profile.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadProfile();
  }, [artistBandId, token]);

  const demoTracks = useMemo(() => {
    if (!profile) return [];

    const selectedTrack = selectedTrackId
      ? profile.tracks.find((track) => track.id === selectedTrackId) ?? null
      : null;
    const baseTracks = profile.tracks.slice(0, 3);

    if (selectedTrack && !baseTracks.some((track) => track.id === selectedTrack.id)) {
      return [selectedTrack, ...baseTracks.slice(0, 2)];
    }

    return baseTracks;
  }, [profile, selectedTrackId]);

  const viewerCanOpenPrintShop = useMemo(() => {
    if (!profile || !user?.id) return false;
    return profile.members.some((member) => member.userId === user.id);
  }, [profile, user?.id]);
  const sourceContextMatchesProfile = activeSourceId === profile?.id;

  useEffect(() => {
    if (!demoTracks.length) {
      setActiveTrackId(null);
      setPlayingTrackId(null);
      return;
    }

    const nextTrackId =
      selectedTrackId && demoTracks.some((track) => track.id === selectedTrackId)
        ? selectedTrackId
        : activeTrackId && demoTracks.some((track) => track.id === activeTrackId)
          ? activeTrackId
          : demoTracks[0]?.id ?? null;

    setActiveTrackId(nextTrackId);
  }, [activeTrackId, demoTracks, selectedTrackId]);

  useEffect(() => {
    if (!selectedTrackId) {
      return;
    }

    const targetAudio = audioRefs.current[selectedTrackId];
    if (!targetAudio) {
      return;
    }

    Object.entries(audioRefs.current).forEach(([trackId, audio]) => {
      if (trackId !== selectedTrackId && audio && !audio.paused) {
        audio.pause();
      }
    });

    void targetAudio.play().catch(() => {
      setError('Unable to start playback.');
    });
  }, [selectedTrackId, demoTracks]);

  async function runAction(
    action: 'follow',
    runner: () => Promise<unknown>,
    successMessage: string,
  ) {
    if (!token || !artistBandId) return;
    setBusyAction(action);
    setActionMessage(null);
    setError(null);

    try {
      await runner();
      setActionMessage(successMessage);
      await loadProfile();
    } catch (e) {
      setError(e instanceof Error ? e.message : `Unable to ${action} artist.`);
    } finally {
      setBusyAction(null);
    }
  }

  function setAudioRef(trackId: string, element: HTMLAudioElement | null) {
    if (element) {
      audioRefs.current[trackId] = element;
      return;
    }

    delete audioRefs.current[trackId];
  }

  async function handleToggleTrack(track: ArtistBandTrackSummary) {
    const audio = audioRefs.current[track.id];
    if (!audio) {
      return;
    }

    setError(null);
    setActionMessage(null);
    setActiveTrackId(track.id);

    if (playingTrackId === track.id && !audio.paused) {
      audio.pause();
      return;
    }

    Object.entries(audioRefs.current).forEach(([trackId, candidate]) => {
      if (trackId !== track.id && candidate && !candidate.paused) {
        candidate.pause();
      }
    });

    try {
      await audio.play();
    } catch {
      setError('Unable to start playback.');
    }
  }

  function handleSeekTrack(trackId: string, nextTime: number) {
    const audio = audioRefs.current[trackId];
    if (!audio) {
      return;
    }

    audio.currentTime = nextTime;
    setTrackTimes((current) => ({ ...current, [trackId]: nextTime }));
  }

  async function handleCollectTrack(track: ArtistBandTrackSummary) {
    if (!token || !track.signalId) {
      return;
    }

    setCollectingTrackId(track.id);
    setActionMessage(null);
    setError(null);

    try {
      await collectSignal(track.signalId, token);
      setCollectedSignalIds((current) => ({ ...current, [track.signalId as string]: true }));
      setActionMessage(`${track.title} collected.`);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Unable to collect this song.');
    } finally {
      setCollectingTrackId(null);
    }
  }

  if (loading) {
    return (
      <main className="plot-wire-page pb-10">
        <div className="plot-wire-frame max-w-6xl">
          <div className="plot-wire-card p-6">
            <p className="plot-wire-label">Artist Page</p>
            <p className="mt-2 text-sm text-black/60">Loading artist profile...</p>
          </div>
        </div>
      </main>
    );
  }

  if (error || !profile) {
    return (
      <main className="plot-wire-page pb-10">
        <div className="plot-wire-frame max-w-6xl">
          <div className="plot-wire-card p-6">
            <p className="plot-wire-label">Artist Page</p>
            <p className="mt-2 text-sm text-red-700">{error ?? 'Artist profile not found.'}</p>
          </div>
          <div className="mt-4 flex gap-3">
            <Button
              variant="outline"
              className="plot-wire-chip h-auto rounded-full bg-white px-4 py-2 text-[11px] text-black"
              onClick={() => router.push('/plot')}
            >
              Back to Plot
            </Button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="plot-wire-page pb-10">
      <div className="plot-wire-frame max-w-6xl space-y-4">
        <section className="plot-wire-card p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="max-w-3xl space-y-3">
              <p className="plot-wire-label">Artist Page</p>
              <div>
                <h1 className="text-3xl font-semibold text-black">{profile.name}</h1>
                <p className="mt-1 text-sm text-black/60">
                  {formatArtistBandEntityType(profile.entityType)} • @{profile.slug}
                </p>
              </div>
              <p className="max-w-3xl text-sm text-black/70">
                {profile.bio ?? 'No artist bio has been published yet.'}
              </p>
              <div className="flex flex-wrap gap-2 text-xs text-black/55">
                <span className="plot-wire-chip">{profile.followCount} followers</span>
                <span className="plot-wire-chip">{profile.memberCount} members</span>
                {profile.homeScene ? (
                  <span className="plot-wire-chip">
                    {formatCommunityIdentity(
                      profile.homeScene.city,
                      profile.homeScene.state,
                      profile.homeScene.musicCommunity,
                    )}
                  </span>
                ) : null}
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {viewerCanOpenPrintShop ? (
                <>
                  <Button
                    asChild
                    size="sm"
                    variant="outline"
                    className="plot-wire-chip h-auto rounded-full bg-white px-4 py-2 text-[11px] text-black"
                  >
                    <Link href="/source-dashboard" onClick={() => setActiveSourceId(profile.id)}>
                      Source Dashboard
                    </Link>
                  </Button>
                  <Button
                    asChild
                    size="sm"
                    variant="outline"
                    className="plot-wire-chip h-auto rounded-full bg-white px-4 py-2 text-[11px] text-black"
                  >
                    <Link href="/source-dashboard/release-deck" onClick={() => setActiveSourceId(profile.id)}>
                      Open Release Deck
                    </Link>
                  </Button>
                  <Button
                    asChild
                    size="sm"
                    variant="outline"
                    className="plot-wire-chip h-auto rounded-full bg-white px-4 py-2 text-[11px] text-black"
                  >
                    <Link href="/print-shop" onClick={() => setActiveSourceId(profile.id)}>
                      Open Print Shop
                    </Link>
                  </Button>
                  <Button
                    asChild
                    size="sm"
                    variant="outline"
                    className="plot-wire-chip h-auto rounded-full bg-white px-4 py-2 text-[11px] text-black"
                  >
                    <Link href="/registrar" onClick={() => setActiveSourceId(profile.id)}>
                      Open Registrar
                    </Link>
                  </Button>
                </>
              ) : null}
              <Button
                size="sm"
                variant="outline"
                className="plot-wire-chip h-auto rounded-full bg-white px-4 py-2 text-[11px] text-black"
                disabled={!token || busyAction === 'follow'}
                onClick={() =>
                  void runAction(
                    'follow',
                    () => followArtistBand(profile.id, token as string),
                    `${profile.name} followed.`,
                  )
                }
              >
                {busyAction === 'follow' ? 'Following...' : 'Follow'}
              </Button>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-2 text-sm text-black/60">
            {viewerCanOpenPrintShop ? (
              <span className="plot-wire-chip">
                {sourceContextMatchesProfile
                  ? 'Source tools are aligned to this source account.'
                  : 'Opening source tools here will switch into this source account.'}
              </span>
            ) : null}
            <Button
              asChild
              variant="outline"
              size="sm"
              className="plot-wire-chip h-auto rounded-full bg-white px-4 py-2 text-[11px] text-black"
            >
              <Link href="/plot">Back to Plot</Link>
            </Button>
            {profile.homeScene ? (
              <Button
                asChild
                variant="outline"
                size="sm"
                className="plot-wire-chip h-auto rounded-full bg-white px-4 py-2 text-[11px] text-black"
              >
                <Link href={`/community/${profile.homeScene.id}`}>Visit {profile.homeScene.name}</Link>
              </Button>
            ) : null}
          </div>

          {actionMessage ? (
            <div className="mt-4 rounded-[1rem] border border-black bg-[#b8d63b] px-4 py-3 text-sm text-black shadow-[3px_3px_0_rgba(0,0,0,0.2)]">
              {actionMessage}
            </div>
          ) : null}
        </section>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(320px,1fr)]">
          <section className="plot-wire-panel">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="plot-wire-label">Songs / Releases</p>
                <h2 className="mt-2 text-lg font-semibold text-black">Listen Here</h2>
                <p className="mt-1 text-sm text-black/60">
                  Pick a song to pause RADIYO and listen here. Collect it from this artist page if you want to keep it.
                </p>
              </div>
              <p className="plot-wire-chip">{demoTracks.length} of {profile.tracks.length} tracks</p>
            </div>

            {demoTracks.length === 0 ? (
              <p className="mt-4 text-sm text-black/60">No released songs are available yet.</p>
            ) : (
              <ul className="mt-4 space-y-3">
                {demoTracks.map((track) => {
                  const isSelected = activeTrackId === track.id;
                  const isPlaying = playingTrackId === track.id;
                  const isSourceOwnedTrack = track.artistBandId === profile.id;
                  const duration = trackDurations[track.id] ?? track.duration;
                  const currentTime = trackTimes[track.id] ?? 0;
                  const isCollected = track.signalId ? Boolean(collectedSignalIds[track.signalId]) : false;

                  return (
                    <li key={track.id} className="plot-wire-list-item">
                      <div className="flex flex-col gap-4">
                        <div className="flex flex-wrap items-start justify-between gap-4">
                          <div>
                            <div className="flex flex-wrap items-center gap-2">
                              <p className="text-base font-medium text-black">{track.title}</p>
                              {isSourceOwnedTrack ? (
                                <span className="plot-wire-chip text-[10px] uppercase tracking-[0.2em] text-black/65">
                                  Source-owned release
                                </span>
                              ) : null}
                              {isSelected ? (
                                <span className="plot-wire-chip text-[10px] uppercase tracking-[0.2em] text-black/65">
                                  Selected
                                </span>
                              ) : null}
                            </div>
                            <p className="mt-1 text-sm text-black/60">
                              {track.artist} • {formatDuration(track.duration)} • {track.playCount} plays • {track.likeCount} likes
                            </p>
                            {track.album ? <p className="mt-1 text-xs text-black/50">{track.album}</p> : null}
                          </div>

                          <div className="flex flex-wrap gap-2">
                            <Button
                              type="button"
                              size="sm"
                              variant="outline"
                              className={
                                isSelected
                                  ? 'plot-wire-chip h-auto rounded-full bg-[#b8d63b] px-4 py-2 text-[11px] text-black'
                                  : 'plot-wire-chip h-auto rounded-full bg-white px-4 py-2 text-[11px] text-black'
                              }
                              onClick={() => void handleToggleTrack(track)}
                            >
                              {isPlaying ? 'Pause' : 'Play'}
                            </Button>
                            <Button
                              type="button"
                              size="sm"
                              variant="outline"
                              className="plot-wire-chip h-auto rounded-full bg-white px-4 py-2 text-[11px] text-black"
                              disabled={!track.signalId || !token || isCollected || collectingTrackId === track.id}
                              onClick={() => void handleCollectTrack(track)}
                            >
                              {isCollected
                                ? 'Collected'
                                : collectingTrackId === track.id
                                  ? 'Collecting...'
                                  : 'Collect'}
                            </Button>
                          </div>
                        </div>

                        <div className="rounded-[1rem] border border-black/10 bg-white/70 px-4 py-3">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-xs font-medium uppercase tracking-[0.16em] text-black/55">
                              {isPlaying ? 'Playing here' : isSelected ? 'Ready to play' : 'Song row'}
                            </span>
                            <span className="text-xs text-black/45">
                              {formatDuration(currentTime)} / {formatDuration(duration)}
                            </span>
                          </div>
                          <input
                            type="range"
                            min={0}
                            max={Math.max(duration, 1)}
                            step={1}
                            value={Math.min(currentTime, Math.max(duration, 1))}
                            onChange={(event) => handleSeekTrack(track.id, Number(event.target.value))}
                            className="mt-3 h-2 w-full accent-black"
                            aria-label={`Playback timeline for ${track.title}`}
                          />
                          <audio
                            ref={(element) => setAudioRef(track.id, element)}
                            className="hidden"
                            preload="metadata"
                            src={track.fileUrl}
                            onLoadedMetadata={(event) =>
                              setTrackDurations((current) => ({
                                ...current,
                                [track.id]: Number.isFinite(event.currentTarget.duration)
                                  ? event.currentTarget.duration
                                  : track.duration,
                              }))
                            }
                            onTimeUpdate={(event) =>
                              setTrackTimes((current) => ({
                                ...current,
                                [track.id]: event.currentTarget.currentTime,
                              }))
                            }
                            onPlay={() => {
                              setPlayingTrackId(track.id);
                              setActiveTrackId(track.id);
                            }}
                            onPause={() =>
                              setPlayingTrackId((current) => (current === track.id ? null : current))
                            }
                            onEnded={() => {
                              setPlayingTrackId((current) => (current === track.id ? null : current));
                              setTrackTimes((current) => ({ ...current, [track.id]: 0 }));
                            }}
                          >
                            Your browser does not support audio playback.
                          </audio>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </section>

          <div className="space-y-6">
            <section className="plot-wire-panel">
              <p className="plot-wire-label">Artist Info</p>
              <h2 className="mt-2 text-lg font-semibold text-black">Identity</h2>
              <dl className="mt-4 space-y-3 text-sm text-black/65">
                <div>
                  <dt className="font-medium text-black">Created by</dt>
                  <dd>{profile.createdBy.displayName} @{profile.createdBy.username}</dd>
                </div>
                <div>
                  <dt className="font-medium text-black">Home Scene</dt>
                  <dd>
                    {profile.homeScene
                      ? formatCommunityIdentity(
                          profile.homeScene.city,
                          profile.homeScene.state,
                          profile.homeScene.musicCommunity,
                        )
                      : 'Not set'}
                  </dd>
                </div>
              </dl>
            </section>

            <section className="plot-wire-panel">
              <p className="plot-wire-label">Official Links</p>
              <h2 className="mt-2 text-lg font-semibold text-black">Go Deeper</h2>
              {officialLinks.length === 0 ? (
                <p className="mt-4 text-sm text-black/60">
                  No official artist links have been shared here yet.
                </p>
              ) : (
                <ul className="mt-4 space-y-3">
                  {officialLinks.map((link) => (
                    <li key={link.key} className="plot-wire-list-item">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <p className="text-sm font-medium text-black">{link.label}</p>
                          <p className="mt-1 text-xs text-black/60">{link.helper}</p>
                        </div>
                        <Link
                          href={link.href as string}
                          target="_blank"
                          rel="noreferrer"
                          className="plot-wire-chip inline-flex h-auto rounded-full bg-white px-4 py-2 text-[11px] text-black"
                        >
                          Visit
                        </Link>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </section>

            <section className="plot-wire-panel">
              <p className="plot-wire-label">Members</p>
              <h2 className="mt-2 text-lg font-semibold text-black">Lineup</h2>
              {profile.members.length === 0 ? (
                <p className="mt-4 text-sm text-black/60">No members have been linked yet.</p>
              ) : (
                <ul className="mt-4 space-y-2">
                  {profile.members.map((member) => (
                    <li key={`${member.userId}-${member.role}`} className="plot-wire-list-item">
                      <p className="text-sm font-medium text-black">{member.user.displayName}</p>
                      <p className="text-xs text-black/60">@{member.user.username} • {member.role}</p>
                    </li>
                  ))}
                </ul>
              )}
            </section>

            <section className="plot-wire-panel">
              <p className="plot-wire-label">Events</p>
              <h2 className="mt-2 text-lg font-semibold text-black">Upcoming and recent</h2>
              {profile.events.length === 0 ? (
                <p className="mt-4 text-sm text-black/60">No events are published yet.</p>
              ) : (
                <ul className="mt-4 space-y-3">
                  {profile.events.map((event) => (
                    <li key={event.id} className="plot-wire-list-item">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-sm font-medium text-black">{event.title}</p>
                        {event.artistBandId === profile.id ? (
                          <span className="plot-wire-chip text-[10px] uppercase tracking-[0.2em] text-black/65">
                            Source-owned event
                          </span>
                        ) : null}
                      </div>
                      <p className="mt-1 text-xs text-black/60">
                        {new Date(event.startDate).toLocaleString()} • {event.locationName}
                      </p>
                      <p className="mt-1 text-xs text-black/50">{event.attendeeCount} attendees • {event.address}</p>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}
