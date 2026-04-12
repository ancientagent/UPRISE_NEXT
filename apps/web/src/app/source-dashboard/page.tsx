'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@uprise/ui';
import { api } from '@/lib/api';
import { formatArtistBandEntityType } from '@/lib/registrar/artistBandLabels';
import { useAuthStore } from '@/store/auth';
import { SourceAccountSwitcher } from '@/components/source/SourceAccountSwitcher';
import { useSourceAccountStore } from '@/store/source-account';
import type { CurrentUserSourceProfile } from '@/lib/source/types';

export default function SourceDashboardPage() {
  const router = useRouter();
  const { token, user } = useAuthStore();
  const { activeSourceId, clearActiveSourceId } = useSourceAccountStore();

  const [profile, setProfile] = useState<CurrentUserSourceProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadProfile() {
      if (!token || !user?.id) {
        setProfile(null);
        setLoading(false);
        setError('Sign in is required before opening source dashboard tools.');
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const response = await api.get<CurrentUserSourceProfile>(`/users/${user.id}/profile`, { token });
        if (cancelled) return;
        setProfile(response.data ?? { user: { id: user.id }, managedArtistBands: [] });
      } catch (loadError: unknown) {
        if (cancelled) return;
        setProfile(null);
        setError(loadError instanceof Error ? loadError.message : 'Unable to load source dashboard context.');
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void loadProfile();

    return () => {
      cancelled = true;
    };
  }, [token, user?.id]);

  const managedSources = profile?.managedArtistBands ?? [];
  const activeSource = useMemo(
    () => managedSources.find((source) => source.id === activeSourceId) ?? null,
    [activeSourceId, managedSources],
  );

  useEffect(() => {
    if (!activeSourceId) return;
    if (managedSources.length === 0) return;
    if (activeSource) return;
    clearActiveSourceId();
  }, [activeSource, activeSourceId, clearActiveSourceId, managedSources.length]);

  if (loading) {
    return (
      <main className="plot-wire-page pb-10">
        <div className="plot-wire-frame max-w-5xl">
          <div className="plot-wire-card p-6">
            <p className="plot-wire-label">Source Dashboard</p>
            <p className="mt-2 text-sm text-black/60">Loading source dashboard...</p>
          </div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="plot-wire-page pb-10">
        <div className="plot-wire-frame max-w-5xl space-y-4">
          <section className="plot-wire-card p-6">
            <p className="plot-wire-label">Source Dashboard</p>
            <p className="mt-2 text-sm text-red-700">{error}</p>
          </section>
          <div className="flex flex-wrap gap-2">
            <Button asChild size="sm" variant="outline" className="plot-wire-chip h-auto rounded-full bg-white px-4 py-2 text-[11px] text-black">
              <Link href="/plot">Back to Plot</Link>
            </Button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="plot-wire-page pb-10">
      <div className="plot-wire-frame max-w-5xl space-y-4">
        <section className="plot-wire-card p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="max-w-3xl space-y-3">
              <p className="plot-wire-label">Source Dashboard</p>
              <div>
                <h1 className="text-3xl font-semibold text-black">
                  {activeSource ? activeSource.name : 'Select a source account'}
                </h1>
                <p className="mt-1 text-sm text-black/60">
                  {activeSource
                    ? `${formatArtistBandEntityType(activeSource.entityType)} • ${activeSource.slug}${activeSource.membershipRole ? ` • ${activeSource.membershipRole}` : ''}`
                    : 'Stay signed into one account and switch into the source you want to operate.'}
                </p>
              </div>
              <p className="text-sm text-black/70">
                Source-facing tools live here. Use this dashboard to manage the source account you are currently operating.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <Button asChild size="sm" variant="outline" className="plot-wire-chip h-auto rounded-full bg-white px-4 py-2 text-[11px] text-black">
                <Link href="/plot">Back to Plot</Link>
              </Button>
              {activeSource ? (
                <Button
                  size="sm"
                  variant="outline"
                  className="plot-wire-chip h-auto rounded-full bg-white px-4 py-2 text-[11px] text-black"
                  onClick={() => {
                    clearActiveSourceId();
                    router.push('/plot');
                  }}
                >
                  Return to Listener Account
                </Button>
              ) : null}
            </div>
          </div>
        </section>

        <SourceAccountSwitcher
          sources={managedSources}
          onSelectSource={() => router.push('/source-dashboard')}
          onSelectListener={() => router.push('/plot')}
        />

        {!activeSource ? (
          <section className="plot-wire-card p-6">
            <p className="plot-wire-label">Current Context</p>
            <p className="mt-2 text-sm text-black/70">
              {managedSources.length > 0
                ? 'Choose one of your managed source accounts above to load its tools. Source Dashboard stays separate from the listener/community shell even though it uses the same signed-in account.'
                : 'No managed source accounts are attached to this user yet. Promoter capability can still open creator lanes like Print Shop, but Source Dashboard itself remains source-account driven.'}
            </p>
          </section>
        ) : (
          <>
            <section className="plot-wire-card p-6">
              <p className="plot-wire-label">Current Context</p>
              <div className="mt-2 rounded-[1rem] border border-black bg-[#f7f1df] px-4 py-4 text-sm text-black shadow-[3px_3px_0_rgba(0,0,0,0.18)]">
                <p className="font-medium text-black">{activeSource.name}</p>
                <p className="mt-1 text-xs text-black/65">
                  {formatArtistBandEntityType(activeSource.entityType)}
                  {activeSource.membershipRole ? ` • ${activeSource.membershipRole}` : ''}
                </p>
                <p className="mt-3 text-sm text-black/70">
                  Tools below operate from this source context. Event writes are still validated by creator
                  eligibility today, so this dashboard is an operator context rather than a persisted event-owner field.
                </p>
              </div>
            </section>

            <section className="grid gap-4 md:grid-cols-3">
              <div className="plot-wire-card p-6">
                <p className="plot-wire-label">Source Profile</p>
                <h2 className="mt-2 text-lg font-semibold text-black">View public source page</h2>
                <p className="mt-2 text-sm text-black/65">
                  Open the live source profile followers see, including signal actions and source identity.
                </p>
                <Button asChild size="sm" variant="outline" className="mt-4 plot-wire-chip h-auto rounded-full bg-white px-4 py-2 text-[11px] text-black">
                  <Link href={`/artist-bands/${activeSource.id}`}>View Source Profile</Link>
                </Button>
              </div>

              <div className="plot-wire-card p-6">
                <p className="plot-wire-label">Print Shop</p>
                <h2 className="mt-2 text-lg font-semibold text-black">Create scene-bound events</h2>
                <p className="mt-2 text-sm text-black/65">
                  Open the source-facing Print Shop lane for creator event work tied to your current community.
                </p>
                <Button asChild size="sm" variant="outline" className="mt-4 plot-wire-chip h-auto rounded-full bg-white px-4 py-2 text-[11px] text-black">
                  <Link href="/print-shop">Open Print Shop</Link>
                </Button>
              </div>

              <div className="plot-wire-card p-6">
                <p className="plot-wire-label">Registrar</p>
                <h2 className="mt-2 text-lg font-semibold text-black">Review filings and capability state</h2>
                <p className="mt-2 text-sm text-black/65">
                  Registrar stays separate from source tools, but it remains reachable from the same operating side.
                </p>
                <Button asChild size="sm" variant="outline" className="mt-4 plot-wire-chip h-auto rounded-full bg-white px-4 py-2 text-[11px] text-black">
                  <Link href="/registrar">Open Registrar</Link>
                </Button>
              </div>
            </section>
          </>
        )}
      </div>
    </main>
  );
}
