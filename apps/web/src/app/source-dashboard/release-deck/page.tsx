'use client';

import { useEffect, useMemo, useState, type FormEvent } from 'react';
import Link from 'next/link';
import { Button } from '@uprise/ui';
import type { ArtistBandProfile, CreateTrackInput } from '@uprise/types';
import { getArtistBandProfile } from '@/lib/artist-bands/client';
import { api } from '@/lib/api';
import { createTrack } from '@/lib/tracks/client';
import { formatArtistBandEntityType } from '@/lib/registrar/artistBandLabels';
import type { CurrentUserSourceProfile } from '@/lib/source/types';
import { useAuthStore } from '@/store/auth';
import { useSourceAccountStore } from '@/store/source-account';

type ReleaseDeckFormState = {
  title: string;
  album: string;
  duration: string;
  fileUrl: string;
  coverArt: string;
};

const emptyForm: ReleaseDeckFormState = {
  title: '',
  album: '',
  duration: '',
  fileUrl: '',
  coverArt: '',
};

export default function ReleaseDeckPage() {
  const { token, user } = useAuthStore();
  const { activeSourceId, clearActiveSourceId } = useSourceAccountStore();

  const [currentUserProfile, setCurrentUserProfile] = useState<CurrentUserSourceProfile | null>(null);
  const [sourceProfile, setSourceProfile] = useState<ArtistBandProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitMessage, setSubmitMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState<ReleaseDeckFormState>(emptyForm);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      if (!token || !user?.id) {
        setCurrentUserProfile(null);
        setSourceProfile(null);
        setLoading(false);
        setError('Sign in is required before opening Release Deck.');
        return;
      }

      if (!activeSourceId) {
        setCurrentUserProfile(null);
        setSourceProfile(null);
        setLoading(false);
        setError('Select a source account before opening Release Deck.');
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const profileResponse = await api.get<CurrentUserSourceProfile>(`/users/${user.id}/profile`, { token });
        const currentProfile = profileResponse.data ?? { user: { id: user.id }, managedArtistBands: [] };
        const activeSource = currentProfile.managedArtistBands.find((source) => source.id === activeSourceId);

        if (!activeSource) {
          if (cancelled) return;
          clearActiveSourceId();
          setCurrentUserProfile(currentProfile);
          setSourceProfile(null);
          setError('The selected source account is no longer attached to this user.');
          return;
        }

        const artistProfile = await getArtistBandProfile(activeSource.id, token);
        if (cancelled) return;

        setCurrentUserProfile(currentProfile);
        setSourceProfile(artistProfile);
      } catch (loadError: unknown) {
        if (cancelled) return;
        setCurrentUserProfile(null);
        setSourceProfile(null);
        setError(loadError instanceof Error ? loadError.message : 'Unable to load Release Deck context.');
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void load();

    return () => {
      cancelled = true;
    };
  }, [activeSourceId, clearActiveSourceId, token, user?.id]);

  const activeSource = useMemo(
    () => currentUserProfile?.managedArtistBands.find((source) => source.id === activeSourceId) ?? null,
    [activeSourceId, currentUserProfile?.managedArtistBands],
  );

  const currentDeckTracks = useMemo(() => sourceProfile?.tracks.slice(0, 3) ?? [], [sourceProfile?.tracks]);
  const communityId = sourceProfile?.homeScene?.id ?? null;
  const homeSceneLabel = sourceProfile?.homeScene
    ? `${sourceProfile.homeScene.city}, ${sourceProfile.homeScene.state} • ${sourceProfile.homeScene.musicCommunity}`
    : 'Home Scene unavailable';

  async function reloadSourceProfile() {
    if (!token || !activeSourceId) return;
    const refreshed = await getArtistBandProfile(activeSourceId, token);
    setSourceProfile(refreshed);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!token || !activeSource || !communityId) {
      setSubmitError('An active source with a resolved Home Scene is required before releasing a single.');
      return;
    }

    const duration = Number(form.duration.trim());
    if (!Number.isFinite(duration) || duration <= 0) {
      setSubmitError('Duration must be a positive number of seconds.');
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitMessage(null);

    try {
      const payload: CreateTrackInput = {
        title: form.title.trim(),
        artist: activeSource.name,
        album: form.album.trim() || undefined,
        duration,
        fileUrl: form.fileUrl.trim(),
        coverArt: form.coverArt.trim() || undefined,
        communityId,
        status: 'ready',
      };

      await createTrack(payload, token);
      setSubmitMessage(`Released ${payload.title} from ${activeSource.name}.`);
      setForm(emptyForm);
      await reloadSourceProfile();
    } catch (createError: unknown) {
      setSubmitError(createError instanceof Error ? createError.message : 'Unable to create single.');
    } finally {
      setIsSubmitting(false);
    }
  }

  if (loading) {
    return (
      <main className="plot-wire-page pb-10">
        <div className="plot-wire-frame max-w-6xl">
          <div className="plot-wire-card p-6">
            <p className="plot-wire-label">Release Deck</p>
            <p className="mt-2 text-sm text-black/60">Loading source release context...</p>
          </div>
        </div>
      </main>
    );
  }

  if (error || !activeSource || !sourceProfile) {
    return (
      <main className="plot-wire-page pb-10">
        <div className="plot-wire-frame max-w-6xl space-y-4">
          <section className="plot-wire-card p-6">
            <p className="plot-wire-label">Release Deck</p>
            <p className="mt-2 text-sm text-red-700">{error ?? 'Release Deck is unavailable for this source.'}</p>
          </section>
          <div className="flex flex-wrap gap-2">
            <Button asChild size="sm" variant="outline" className="plot-wire-chip h-auto rounded-full bg-white px-4 py-2 text-[11px] text-black">
              <Link href="/source-dashboard">Back to Source Dashboard</Link>
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
              <p className="plot-wire-label">Release Deck</p>
              <div>
                <h1 className="text-3xl font-semibold text-black">{activeSource.name}</h1>
                <p className="mt-1 text-sm text-black/60">
                  {formatArtistBandEntityType(activeSource.entityType)} • @{activeSource.slug}
                  {activeSource.membershipRole ? ` • ${activeSource.membershipRole}` : ''}
                </p>
              </div>
              <p className="text-sm text-black/70">
                Release Deck is the source-side lane for singles entering the citywide Uprise. Music upload capacity remains capped at three songs, while the separate paid ad slot stays outside the current runtime.
              </p>
              <div className="flex flex-wrap gap-2 text-xs text-black/55">
                <span className="plot-wire-chip">Music slots: 3</span>
                <span className="plot-wire-chip">Paid ad slot: defined, not active here</span>
                <span className="plot-wire-chip">Home Scene: {homeSceneLabel}</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <Button asChild size="sm" variant="outline" className="plot-wire-chip h-auto rounded-full bg-white px-4 py-2 text-[11px] text-black">
                <Link href="/plot" onClick={() => clearActiveSourceId()}>
                  Return to Listener Account
                </Link>
              </Button>
              <Button asChild size="sm" variant="outline" className="plot-wire-chip h-auto rounded-full bg-white px-4 py-2 text-[11px] text-black">
                <Link href="/source-dashboard">Back to Source Dashboard</Link>
              </Button>
              <Button asChild size="sm" variant="outline" className="plot-wire-chip h-auto rounded-full bg-white px-4 py-2 text-[11px] text-black">
                <Link href={`/artist-bands/${activeSource.id}`}>View Source Profile</Link>
              </Button>
              <Button asChild size="sm" variant="outline" className="plot-wire-chip h-auto rounded-full bg-white px-4 py-2 text-[11px] text-black">
                <Link href="/registrar">Open Registrar</Link>
              </Button>
            </div>
          </div>
        </section>

        <section className="plot-wire-card p-6">
          <p className="plot-wire-label">Current Context</p>
          <div className="mt-2 rounded-[1rem] border border-black bg-[#f7f1df] px-4 py-4 text-sm text-black shadow-[3px_3px_0_rgba(0,0,0,0.18)]">
            <p className="font-medium text-black">{activeSource.name}</p>
            <p className="mt-1 text-xs text-black/65">
              {formatArtistBandEntityType(activeSource.entityType)} • @{activeSource.slug}
              {activeSource.membershipRole ? ` • ${activeSource.membershipRole}` : ''}
            </p>
            <div className="mt-3 flex flex-wrap gap-2 text-xs text-black/60">
              <span className="plot-wire-chip">Home Scene: {homeSceneLabel}</span>
              <span className="plot-wire-chip">Music slots: 3</span>
              <span className="plot-wire-chip">Paid ad slot: defined, not active here</span>
            </div>
            <p className="mt-3 text-sm text-black/70">
              Release Deck operates from this source context. Tracks are still created by the signed-in user and recognized
              through the active source context until explicit source-owned track linkage is hardened further.
            </p>
          </div>
        </section>

        <section className="grid gap-4 lg:grid-cols-[1.1fr,0.9fr]">
          <div className="plot-wire-card p-6">
            <p className="plot-wire-label">Current Music Slots</p>
            <p className="mt-2 text-sm text-black/65">
              Current runtime shows the latest ready singles attached to this source in the three music slots.
            </p>

            <div className="mt-4 grid gap-3 md:grid-cols-3">
              {Array.from({ length: 3 }).map((_, index) => {
                const track = currentDeckTracks[index] ?? null;
                return (
                  <div
                    key={`slot-${index + 1}`}
                    className="rounded-[1rem] border border-black bg-[#f7f1df] px-4 py-4 text-sm text-black shadow-[3px_3px_0_rgba(0,0,0,0.18)]"
                  >
                    <p className="plot-wire-label">Slot {index + 1}</p>
                    {track ? (
                      <>
                        <p className="mt-2 font-medium text-black">{track.title}</p>
                        <p className="mt-1 text-xs text-black/65">{track.album ?? 'Single release'}</p>
                        <p className="mt-3 text-xs text-black/65">
                          {Math.floor(track.duration / 60)}:{String(Math.floor(track.duration % 60)).padStart(2, '0')} • {track.status}
                        </p>
                      </>
                    ) : (
                      <p className="mt-2 text-sm text-black/60">Open music slot.</p>
                    )}
                  </div>
                );
              })}
            </div>

            {sourceProfile.tracks.length > 3 ? (
              <p className="mt-4 text-xs text-black/55">
                Source profile currently has {sourceProfile.tracks.length} ready tracks. Release Deck view is showing the latest three for this MVP slice.
              </p>
            ) : null}
          </div>

          <div className="plot-wire-card p-6">
            <p className="plot-wire-label">Release Single</p>
            <h2 className="mt-2 text-lg font-semibold text-black">Create a new single from this source context</h2>
            <p className="mt-2 text-sm text-black/65">
              This MVP slice uses a hosted audio file URL. The track is written under your signed-in user, tagged to the active source name, and attached to the source Home Scene.
            </p>

            <form className="mt-5 space-y-3" onSubmit={handleSubmit}>
              <label className="block text-sm text-black">
                <span className="plot-wire-label">Source</span>
                <input
                  name="source"
                  disabled
                  value={activeSource.name}
                  className="mt-2 w-full rounded-[1rem] border border-black bg-black/5 px-4 py-3 text-sm text-black/75"
                />
              </label>

              <label className="block text-sm text-black">
                <span className="plot-wire-label">Title</span>
                <input
                  name="title"
                  required
                  value={form.title}
                  onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))}
                  className="mt-2 w-full rounded-[1rem] border border-black bg-white px-4 py-3 text-sm text-black"
                  placeholder="Single title"
                />
              </label>

              <label className="block text-sm text-black">
                <span className="plot-wire-label">Album</span>
                <input
                  name="album"
                  value={form.album}
                  onChange={(event) => setForm((current) => ({ ...current, album: event.target.value }))}
                  className="mt-2 w-full rounded-[1rem] border border-black bg-white px-4 py-3 text-sm text-black"
                  placeholder="Optional album or release note"
                />
              </label>

              <label className="block text-sm text-black">
                <span className="plot-wire-label">Duration (seconds)</span>
                <input
                  name="duration"
                  required
                  inputMode="numeric"
                  value={form.duration}
                  onChange={(event) => setForm((current) => ({ ...current, duration: event.target.value }))}
                  className="mt-2 w-full rounded-[1rem] border border-black bg-white px-4 py-3 text-sm text-black"
                  placeholder="210"
                />
              </label>

              <label className="block text-sm text-black">
                <span className="plot-wire-label">Audio File URL</span>
                <input
                  name="fileUrl"
                  required
                  type="url"
                  value={form.fileUrl}
                  onChange={(event) => setForm((current) => ({ ...current, fileUrl: event.target.value }))}
                  className="mt-2 w-full rounded-[1rem] border border-black bg-white px-4 py-3 text-sm text-black"
                  placeholder="https://..."
                />
              </label>

              <label className="block text-sm text-black">
                <span className="plot-wire-label">Cover Art URL</span>
                <input
                  name="coverArt"
                  type="url"
                  value={form.coverArt}
                  onChange={(event) => setForm((current) => ({ ...current, coverArt: event.target.value }))}
                  className="mt-2 w-full rounded-[1rem] border border-black bg-white px-4 py-3 text-sm text-black"
                  placeholder="https://..."
                />
              </label>

              {submitError ? <p className="text-sm text-red-700">{submitError}</p> : null}
              {submitMessage ? <p className="text-sm text-[#195b2d]">{submitMessage}</p> : null}

              <Button
                type="submit"
                disabled={isSubmitting || !communityId}
                className="rounded-full border border-black bg-[#b8d63b] px-5 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-black hover:bg-[#d7f06a]"
              >
                {isSubmitting ? 'Releasing...' : 'Release Single'}
              </Button>
            </form>
          </div>
        </section>
      </div>
    </main>
  );
}
