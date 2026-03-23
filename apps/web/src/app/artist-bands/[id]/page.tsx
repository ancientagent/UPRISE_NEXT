'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@uprise/ui';
import type { ArtistBandProfile } from '@uprise/types';
import {
  addArtistBandSignal,
  blastArtistBandSignal,
  followArtistBand,
  getArtistBandProfile,
  supportArtistBandSignal,
} from '@/lib/artist-bands/client';
import { formatArtistBandEntityType } from '@/lib/registrar/artistBandLabels';
import { useAuthStore } from '@/store/auth';

function formatLocation(city: string | null, state: string | null) {
  if (city && state) return `${city}, ${state}`;
  return city || state || 'Unlisted';
}

function formatDuration(seconds: number) {
  if (!Number.isFinite(seconds) || seconds <= 0) return '0:00';
  const minutes = Math.floor(seconds / 60);
  const remainder = Math.floor(seconds % 60);
  return `${minutes}:${String(remainder).padStart(2, '0')}`;
}

export default function ArtistBandProfilePage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { token } = useAuthStore();

  const [profile, setProfile] = useState<ArtistBandProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionMessage, setActionMessage] = useState<string | null>(null);
  const [busyAction, setBusyAction] = useState<'follow' | 'add' | 'blast' | 'support' | null>(null);

  const artistBandId = useMemo(() => (typeof params?.id === 'string' ? params.id : ''), [params]);
  const selectedTrackId = searchParams.get('trackId');

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

  const selectedTrack = useMemo(() => {
    if (!profile || !selectedTrackId) return null;
    return profile.tracks.find((track) => track.id === selectedTrackId) ?? null;
  }, [profile, selectedTrackId]);

  async function runAction(
    action: 'follow' | 'add' | 'blast' | 'support',
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

  if (loading) {
    return (
      <main className="min-h-screen bg-[#f7f5ef] px-6 py-12">
        <div className="mx-auto max-w-6xl rounded-3xl border border-black/10 bg-white p-6">
          <p className="text-sm text-black/60">Loading artist profile...</p>
        </div>
      </main>
    );
  }

  if (error || !profile) {
    return (
      <main className="min-h-screen bg-[#f7f5ef] px-6 py-12">
        <div className="mx-auto max-w-6xl rounded-3xl border border-black/10 bg-white p-6">
          <p className="text-sm text-red-700">{error ?? 'Artist profile not found.'}</p>
          <div className="mt-4 flex gap-3">
            <Button variant="outline" onClick={() => router.push('/discover')}>
              Back to Discover
            </Button>
            <Button variant="outline" onClick={() => router.push('/plot')}>
              Back to Plot
            </Button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f7f5ef] px-6 py-12">
      <div className="mx-auto max-w-6xl space-y-6">
        <section className="rounded-3xl border border-black/10 bg-white p-6 shadow-sm">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="space-y-3">
              <p className="text-xs uppercase tracking-[0.24em] text-black/50">Artist Page</p>
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
                <span className="rounded-full border border-black/10 bg-[#f7f5ef] px-3 py-1">
                  {profile.followCount} followers
                </span>
                <span className="rounded-full border border-black/10 bg-[#f7f5ef] px-3 py-1">
                  {profile.memberCount} members
                </span>
                {profile.homeScene ? (
                  <span className="rounded-full border border-black/10 bg-[#f7f5ef] px-3 py-1">
                    {profile.homeScene.name} • {formatLocation(profile.homeScene.city, profile.homeScene.state)}
                  </span>
                ) : null}
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <Button
                size="sm"
                variant="outline"
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
              <Button
                size="sm"
                variant="outline"
                disabled={!token || busyAction === 'add'}
                onClick={() =>
                  void runAction(
                    'add',
                    () => addArtistBandSignal(profile.id, token as string),
                    `${profile.name} added.`,
                  )
                }
              >
                {busyAction === 'add' ? 'Adding...' : 'Add'}
              </Button>
              <Button
                size="sm"
                variant="outline"
                disabled={!token || busyAction === 'blast'}
                onClick={() =>
                  void runAction(
                    'blast',
                    () => blastArtistBandSignal(profile.id, token as string),
                    `${profile.name} blasted.`,
                  )
                }
              >
                {busyAction === 'blast' ? 'Blasting...' : 'Blast'}
              </Button>
              <Button
                size="sm"
                variant="outline"
                disabled={!token || busyAction === 'support'}
                onClick={() =>
                  void runAction(
                    'support',
                    () => supportArtistBandSignal(profile.id, token as string),
                    `${profile.name} supported.`,
                  )
                }
              >
                {busyAction === 'support' ? 'Supporting...' : 'Support'}
              </Button>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-3 text-sm text-black/60">
            <Button asChild variant="outline" size="sm">
              <Link href="/discover">Back to Discover</Link>
            </Button>
            {profile.homeScene ? (
              <Button asChild variant="outline" size="sm">
                <Link href={`/community/${profile.homeScene.id}`}>Visit {profile.homeScene.name}</Link>
              </Button>
            ) : null}
          </div>

          {actionMessage ? (
            <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
              {actionMessage}
            </div>
          ) : null}
        </section>

        {selectedTrack ? (
          <section className="rounded-2xl border border-black/10 bg-white p-6">
            <p className="text-xs uppercase tracking-[0.2em] text-black/50">Now Streaming</p>
            <h2 className="mt-2 text-xl font-semibold text-black">{selectedTrack.title}</h2>
            <p className="mt-1 text-sm text-black/60">
              Selected single playback stops RaDIYo and streams from the artist page.
            </p>
            <audio className="mt-4 w-full" controls autoPlay src={selectedTrack.fileUrl}>
              Your browser does not support audio playback.
            </audio>
          </section>
        ) : null}

        <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(320px,1fr)]">
          <section className="rounded-2xl border border-black/10 bg-white p-6">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-black/50">Songs / Releases</p>
                <h2 className="mt-2 text-lg font-semibold text-black">Released songs</h2>
              </div>
              <p className="text-sm text-black/50">{profile.tracks.length} tracks</p>
            </div>

            {profile.tracks.length === 0 ? (
              <p className="mt-4 text-sm text-black/60">No released songs are available yet.</p>
            ) : (
              <ul className="mt-4 space-y-3">
                {profile.tracks.map((track) => {
                  const isSelected = selectedTrack?.id === track.id;
                  return (
                    <li key={track.id} className="rounded-2xl border border-black/10 bg-[#f7f5ef] p-4">
                      <div className="flex flex-wrap items-start justify-between gap-4">
                        <div>
                          <p className="text-base font-medium text-black">{track.title}</p>
                          <p className="mt-1 text-sm text-black/60">
                            {track.artist} • {formatDuration(track.duration)} • {track.playCount} plays • {track.likeCount} likes
                          </p>
                          {track.album ? <p className="mt-1 text-xs text-black/50">{track.album}</p> : null}
                        </div>
                        <Button asChild size="sm" variant={isSelected ? 'default' : 'outline'}>
                          <Link href={`/artist-bands/${profile.id}?trackId=${track.id}`}>
                            {isSelected ? 'Streaming' : 'Play Single'}
                          </Link>
                        </Button>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </section>

          <div className="space-y-6">
            <section className="rounded-2xl border border-black/10 bg-white p-6">
              <p className="text-xs uppercase tracking-[0.2em] text-black/50">Artist Info</p>
              <h2 className="mt-2 text-lg font-semibold text-black">Identity</h2>
              <dl className="mt-4 space-y-3 text-sm text-black/65">
                <div>
                  <dt className="font-medium text-black">Created by</dt>
                  <dd>{profile.createdBy.displayName} @{profile.createdBy.username}</dd>
                </div>
                <div>
                  <dt className="font-medium text-black">Home Scene</dt>
                  <dd>{profile.homeScene ? `${profile.homeScene.name} • ${formatLocation(profile.homeScene.city, profile.homeScene.state)}` : 'Not set'}</dd>
                </div>
                <div>
                  <dt className="font-medium text-black">Action counts</dt>
                  <dd>
                    Add {profile.actionCounts.add} • Blast {profile.actionCounts.blast} • Support {profile.actionCounts.support}
                  </dd>
                </div>
              </dl>
            </section>

            <section className="rounded-2xl border border-black/10 bg-white p-6">
              <p className="text-xs uppercase tracking-[0.2em] text-black/50">Members</p>
              <h2 className="mt-2 text-lg font-semibold text-black">Lineup</h2>
              {profile.members.length === 0 ? (
                <p className="mt-4 text-sm text-black/60">No members have been linked yet.</p>
              ) : (
                <ul className="mt-4 space-y-2">
                  {profile.members.map((member) => (
                    <li key={`${member.userId}-${member.role}`} className="rounded-xl border border-black/10 bg-[#f7f5ef] px-3 py-2">
                      <p className="text-sm font-medium text-black">{member.user.displayName}</p>
                      <p className="text-xs text-black/60">@{member.user.username} • {member.role}</p>
                    </li>
                  ))}
                </ul>
              )}
            </section>

            <section className="rounded-2xl border border-black/10 bg-white p-6">
              <p className="text-xs uppercase tracking-[0.2em] text-black/50">Events</p>
              <h2 className="mt-2 text-lg font-semibold text-black">Upcoming and recent</h2>
              {profile.events.length === 0 ? (
                <p className="mt-4 text-sm text-black/60">No events are published yet.</p>
              ) : (
                <ul className="mt-4 space-y-3">
                  {profile.events.map((event) => (
                    <li key={event.id} className="rounded-xl border border-black/10 bg-[#f7f5ef] p-3">
                      <p className="text-sm font-medium text-black">{event.title}</p>
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
