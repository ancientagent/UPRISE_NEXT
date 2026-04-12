'use client';

import { useEffect, useMemo, useState, type FormEvent } from 'react';
import Link from 'next/link';
import { Button } from '@uprise/ui';
import type { CreatePrintShopEvent, PrintShopEventRecord } from '@uprise/types';
import { api } from '@/lib/api';
import { resolveHomeCommunity } from '@/lib/communities/client';
import { listPromoterRegistrations } from '@/lib/registrar/client';
import { createPrintShopEvent } from '@/lib/print-shop/client';
import type { CurrentUserSourceProfile } from '@/lib/source/types';
import { useAuthStore } from '@/store/auth';
import { useOnboardingStore } from '@/store/onboarding';
import { formatArtistBandEntityType } from '@/lib/registrar/artistBandLabels';
import { useSourceAccountStore } from '@/store/source-account';

type HomeSceneResolution = {
  id: string;
  city: string;
  state: string;
  musicCommunity: string;
};

const emptyForm: Omit<CreatePrintShopEvent, 'communityId'> = {
  title: '',
  description: '',
  coverImage: undefined,
  startDate: '',
  endDate: '',
  locationName: '',
  address: '',
  latitude: 30.2672,
  longitude: -97.7431,
  maxAttendees: undefined,
};

export default function PrintShopPage() {
  const { token, user } = useAuthStore();
  const { homeScene } = useOnboardingStore();
  const { activeSourceId, clearActiveSourceId } = useSourceAccountStore();

  const [form, setForm] = useState(emptyForm);
  const [maxAttendeesInput, setMaxAttendeesInput] = useState('');
  const [homeSceneResolution, setHomeSceneResolution] = useState<HomeSceneResolution | null>(null);
  const [homeSceneError, setHomeSceneError] = useState<string | null>(null);
  const [profile, setProfile] = useState<CurrentUserSourceProfile | null>(null);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [promoterGranted, setPromoterGranted] = useState(false);
  const [promoterError, setPromoterError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [createdEvent, setCreatedEvent] = useState<PrintShopEventRecord | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadHomeScene() {
      if (!token || !homeScene?.city || !homeScene?.state || !homeScene?.musicCommunity) {
        setHomeSceneResolution(null);
        setHomeSceneError('Home Scene is required before using Print Shop.');
        return;
      }

      try {
        const resolved = await resolveHomeCommunity(
          {
            city: homeScene.city,
            state: homeScene.state,
            musicCommunity: homeScene.musicCommunity,
          },
          token,
        );

        if (cancelled) return;

        if (!resolved?.id) {
          setHomeSceneResolution(null);
          setHomeSceneError('Home Scene could not be resolved for Print Shop.');
          return;
        }

        setHomeSceneResolution({
          id: resolved.id,
          city: resolved.city ?? homeScene.city,
          state: resolved.state ?? homeScene.state,
          musicCommunity: resolved.musicCommunity ?? homeScene.musicCommunity,
        });
        setHomeSceneError(null);
      } catch (error: unknown) {
        if (cancelled) return;
        setHomeSceneResolution(null);
        setHomeSceneError(error instanceof Error ? error.message : 'Unable to resolve Home Scene for Print Shop.');
      }
    }

    void loadHomeScene();
    return () => {
      cancelled = true;
    };
  }, [homeScene?.city, homeScene?.musicCommunity, homeScene?.state, token]);

  useEffect(() => {
    let cancelled = false;

    async function loadCurrentProfile() {
      if (!token || !user?.id) {
        setProfile(null);
        setProfileError(null);
        return;
      }

      try {
        const response = await api.get<CurrentUserSourceProfile>(`/users/${user.id}/profile`, { token });
        if (cancelled) return;
        setProfile(response.data ?? { user: { id: user.id }, managedArtistBands: [] });
        setProfileError(null);
      } catch (error: unknown) {
        if (cancelled) return;
        setProfile(null);
        setProfileError(error instanceof Error ? error.message : 'Unable to load source profile context.');
      }
    }

    void loadCurrentProfile();
    return () => {
      cancelled = true;
    };
  }, [token, user?.id]);

  useEffect(() => {
    let cancelled = false;

    async function loadPromoterStatus() {
      if (!token) {
        setPromoterGranted(false);
        setPromoterError(null);
        return;
      }

      try {
        const response = await listPromoterRegistrations(token);
        if (cancelled) return;
        setPromoterGranted(Boolean(response.entries?.[0]?.promoterCapability.granted));
        setPromoterError(null);
      } catch (error: unknown) {
        if (cancelled) return;
        setPromoterGranted(false);
        setPromoterError(error instanceof Error ? error.message : 'Unable to load promoter capability status.');
      }
    }

    void loadPromoterStatus();
    return () => {
      cancelled = true;
    };
  }, [token]);

  const managedArtistBands = profile?.managedArtistBands ?? [];
  const activeSource = managedArtistBands.find((entity) => entity.id === activeSourceId) ?? null;
  const canCreateEvent = promoterGranted || managedArtistBands.length > 0;

  const eligibilityMessage = useMemo(() => {
    if (!token) return 'Sign in is required before opening Print Shop creator tools.';
    if (homeSceneError) return homeSceneError;
    if (profileError) return profileError;
    if (promoterError) return promoterError;
    if (!canCreateEvent) {
      return 'Print Shop event creation requires active promoter capability or a linked Artist/Band source.';
    }
    return null;
  }, [canCreateEvent, homeSceneError, profileError, promoterError, token]);

  const homeSceneLabel = homeSceneResolution
    ? `${homeSceneResolution.city}, ${homeSceneResolution.state} • ${homeSceneResolution.musicCommunity}`
    : 'Unavailable';

  useEffect(() => {
    if (!activeSourceId) return;
    if (managedArtistBands.length === 0) return;
    if (activeSource) return;
    clearActiveSourceId();
  }, [activeSource, activeSourceId, clearActiveSourceId, managedArtistBands.length]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!token || !homeSceneResolution?.id || !canCreateEvent) return;

    setIsSubmitting(true);
    setSubmitError(null);
    setCreatedEvent(null);

    try {
      const payload: CreatePrintShopEvent = {
        ...form,
        coverImage: form.coverImage?.trim() ? form.coverImage.trim() : undefined,
        title: form.title.trim(),
        description: form.description.trim(),
        locationName: form.locationName.trim(),
        address: form.address.trim(),
        communityId: homeSceneResolution.id,
        maxAttendees: maxAttendeesInput.trim() ? Number(maxAttendeesInput.trim()) : undefined,
      };

      const created = await createPrintShopEvent(payload, token);
      setCreatedEvent(created);
      setForm(emptyForm);
      setMaxAttendeesInput('');
    } catch (error: unknown) {
      setSubmitError(error instanceof Error ? error.message : 'Unable to create event.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="plot-wire-page pb-10">
      <div className="plot-wire-frame max-w-5xl space-y-4">
        <section className="plot-wire-card p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="space-y-3 max-w-3xl">
              <p className="plot-wire-label">Print Shop</p>
              <div>
                <h1 className="text-3xl font-semibold text-black">Source-Facing Event Creation</h1>
                <p className="mt-1 text-sm text-black/60">
                  Create scene-bound events from the source-facing Print Shop lane.
                </p>
              </div>
              <div className="flex flex-wrap gap-2 text-xs text-black/55">
                <span className="plot-wire-chip">Home Scene: {homeSceneLabel}</span>
                <span className="plot-wire-chip">Promoter capability: {promoterGranted ? 'active' : 'inactive'}</span>
                <span className="plot-wire-chip">
                  Linked Artist/Bands: {managedArtistBands.length}
                </span>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Link href="/source-dashboard">
                <Button
                  size="sm"
                  variant="outline"
                  className="plot-wire-chip h-auto rounded-full bg-white px-4 py-2 text-[11px] text-black"
                >
                  Source Dashboard
                </Button>
              </Link>
              <Link href="/registrar">
                <Button
                  size="sm"
                  variant="outline"
                  className="plot-wire-chip h-auto rounded-full bg-white px-4 py-2 text-[11px] text-black"
                >
                  Back to Registrar
                </Button>
              </Link>
              <Link href="/plot">
                <Button
                  size="sm"
                  variant="outline"
                  className="plot-wire-chip h-auto rounded-full bg-white px-4 py-2 text-[11px] text-black"
                >
                  Back to Plot
                </Button>
              </Link>
            </div>
          </div>
        </section>

        <section className="plot-wire-card p-6">
          <p className="plot-wire-label">Source Context</p>
          {activeSource ? (
            <div className="mt-2 rounded-[1rem] border border-black bg-[#f7f1df] px-4 py-4 text-sm text-black shadow-[3px_3px_0_rgba(0,0,0,0.18)]">
              <p className="font-medium text-black">{activeSource.name}</p>
              <p className="mt-1 text-xs text-black/65">
                {formatArtistBandEntityType(activeSource.entityType)}
                {activeSource.membershipRole ? ` • ${activeSource.membershipRole}` : ''}
              </p>
              <p className="mt-3 text-sm text-black/70">
                Print Shop is being operated from your active source dashboard context. Event writes are still
                checked by creator eligibility today, so this identifies the operating source rather than a stored
                event-owner field.
              </p>
            </div>
          ) : managedArtistBands.length > 0 ? (
            <div className="mt-2 rounded-[1rem] border border-black/10 bg-white px-4 py-4 text-sm text-black">
              <p className="font-medium text-black">No active source account selected</p>
              <p className="mt-2 text-sm text-black/65">
                You can still create from a valid creator lane, but source-facing tools are meant to be entered from
                the source dashboard when you want to operate as a specific managed source.
              </p>
            </div>
          ) : (
            <div className="mt-2 rounded-[1rem] border border-black/10 bg-white px-4 py-4 text-sm text-black">
              <p className="font-medium text-black">Promoter capability lane</p>
              <p className="mt-2 text-sm text-black/65">
                This creator lane is currently available through promoter capability rather than an active managed
                source account.
              </p>
            </div>
          )}
        </section>

        <section className="plot-wire-card p-6">
          <p className="plot-wire-label">Creator Eligibility</p>
          <p className="mt-2 text-sm text-black/70">
            Print Shop stays source-facing. Listener event surfaces remain read, follow, and attendance oriented.
          </p>
          {eligibilityMessage ? (
            <p className="mt-3 text-sm text-red-700">{eligibilityMessage}</p>
          ) : (
            <p className="mt-3 text-sm text-green-700">
              Event creation is available because your account has a valid source-facing creator lane.
            </p>
          )}
          {managedArtistBands.length > 0 ? (
            <div className="mt-3 flex flex-wrap gap-2 text-xs text-black/55">
              {managedArtistBands.map((entity) => (
                <span key={entity.id} className="plot-wire-chip">
                  {entity.name} • {entity.membershipRole ?? 'member'}
                </span>
              ))}
            </div>
          ) : null}
        </section>

        <section className="plot-wire-card p-6">
          <div className="mb-4">
            <p className="plot-wire-label">Create Event</p>
            <p className="mt-1 text-sm text-black/60">
              Current MVP uses your resolved Home Scene as the event community anchor.
            </p>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="grid gap-4 md:grid-cols-2">
              <label className="text-sm text-black/70">
                <span className="block text-xs uppercase tracking-[0.2em] text-black/50">Title</span>
                <input
                  className="mt-1 w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm text-black outline-none"
                  value={form.title}
                  onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))}
                  placeholder="Warehouse Show"
                  disabled={!canCreateEvent || !token || isSubmitting}
                />
              </label>
              <label className="text-sm text-black/70">
                <span className="block text-xs uppercase tracking-[0.2em] text-black/50">Cover Image URL</span>
                <input
                  className="mt-1 w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm text-black outline-none"
                  value={form.coverImage ?? ''}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, coverImage: event.target.value || undefined }))
                  }
                  placeholder="https://..."
                  disabled={!canCreateEvent || !token || isSubmitting}
                />
              </label>
            </div>

            <label className="block text-sm text-black/70">
              <span className="block text-xs uppercase tracking-[0.2em] text-black/50">Description</span>
              <textarea
                className="mt-1 min-h-28 w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm text-black outline-none"
                value={form.description}
                onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))}
                placeholder="All-ages punk night."
                disabled={!canCreateEvent || !token || isSubmitting}
              />
            </label>

            <div className="grid gap-4 md:grid-cols-2">
              <label className="text-sm text-black/70">
                <span className="block text-xs uppercase tracking-[0.2em] text-black/50">Start</span>
                <input
                  type="datetime-local"
                  className="mt-1 w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm text-black outline-none"
                  value={form.startDate}
                  onChange={(event) => setForm((current) => ({ ...current, startDate: event.target.value }))}
                  disabled={!canCreateEvent || !token || isSubmitting}
                />
              </label>
              <label className="text-sm text-black/70">
                <span className="block text-xs uppercase tracking-[0.2em] text-black/50">End</span>
                <input
                  type="datetime-local"
                  className="mt-1 w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm text-black outline-none"
                  value={form.endDate}
                  onChange={(event) => setForm((current) => ({ ...current, endDate: event.target.value }))}
                  disabled={!canCreateEvent || !token || isSubmitting}
                />
              </label>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <label className="text-sm text-black/70">
                <span className="block text-xs uppercase tracking-[0.2em] text-black/50">Venue / Location Name</span>
                <input
                  className="mt-1 w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm text-black outline-none"
                  value={form.locationName}
                  onChange={(event) => setForm((current) => ({ ...current, locationName: event.target.value }))}
                  placeholder="Southside Warehouse"
                  disabled={!canCreateEvent || !token || isSubmitting}
                />
              </label>
              <label className="text-sm text-black/70">
                <span className="block text-xs uppercase tracking-[0.2em] text-black/50">Address</span>
                <input
                  className="mt-1 w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm text-black outline-none"
                  value={form.address}
                  onChange={(event) => setForm((current) => ({ ...current, address: event.target.value }))}
                  placeholder="123 Main St, Austin, TX"
                  disabled={!canCreateEvent || !token || isSubmitting}
                />
              </label>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <label className="text-sm text-black/70">
                <span className="block text-xs uppercase tracking-[0.2em] text-black/50">Latitude</span>
                <input
                  type="number"
                  step="any"
                  className="mt-1 w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm text-black outline-none"
                  value={form.latitude}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, latitude: Number(event.target.value || 0) }))
                  }
                  disabled={!canCreateEvent || !token || isSubmitting}
                />
              </label>
              <label className="text-sm text-black/70">
                <span className="block text-xs uppercase tracking-[0.2em] text-black/50">Longitude</span>
                <input
                  type="number"
                  step="any"
                  className="mt-1 w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm text-black outline-none"
                  value={form.longitude}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, longitude: Number(event.target.value || 0) }))
                  }
                  disabled={!canCreateEvent || !token || isSubmitting}
                />
              </label>
              <label className="text-sm text-black/70">
                <span className="block text-xs uppercase tracking-[0.2em] text-black/50">Max Attendees</span>
                <input
                  type="number"
                  min="1"
                  className="mt-1 w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm text-black outline-none"
                  value={maxAttendeesInput}
                  onChange={(event) => setMaxAttendeesInput(event.target.value)}
                  placeholder="Optional"
                  disabled={!canCreateEvent || !token || isSubmitting}
                />
              </label>
            </div>

            {submitError ? <p className="text-sm text-red-700">{submitError}</p> : null}
            {createdEvent ? (
              <p className="text-sm text-green-700">
                Event created: {createdEvent.title} for community {homeSceneLabel}.
              </p>
            ) : null}

            <Button
              type="submit"
              disabled={!canCreateEvent || !token || !homeSceneResolution?.id || isSubmitting}
              className="plot-wire-chip h-auto rounded-full px-4 py-2 text-[11px]"
            >
              {isSubmitting ? 'Creating Event...' : 'Create Event'}
            </Button>
          </form>
        </section>
      </div>
    </main>
  );
}
