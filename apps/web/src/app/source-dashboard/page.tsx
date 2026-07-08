'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  BarChart3,
  CalendarDays,
  CheckCircle2,
  ExternalLink,
  FileText,
  LockKeyhole,
  Mic2,
  Music2,
  UserRound,
} from 'lucide-react';
import { Button } from '@uprise/ui';
import type { ArtistBandEventSummary, ArtistBandProfile, ArtistBandTrackSummary } from '@uprise/types';
import { api } from '@/lib/api';
import { getArtistBandProfile } from '@/lib/artist-bands/client';
import { formatArtistBandEntityType } from '@/lib/registrar/artistBandLabels';
import { listPromoterRegistrations, type RegistrarPromoterEntry } from '@/lib/registrar/client';
import { getReleaseDeckReadiness } from '@/lib/source/release-deck-validation';
import { SourceAccountSwitcher, formatSourceMembershipRole } from '@/components/source/SourceAccountSwitcher';
import { useAuthStore } from '@/store/auth';
import { useOnboardingStore } from '@/store/onboarding';
import { useSourceAccountStore } from '@/store/source-account';
import type { CurrentUserSourceProfile, ManagedSourceAccount } from '@/lib/source/types';

const reportButtonClass =
  'h-auto rounded-[0.3rem] border-2 border-black bg-[#fbfbf4] px-4 py-2 text-[11px] font-black uppercase tracking-[0.08em] text-black shadow-[2px_2px_0_rgba(0,0,0,0.16)] hover:bg-white';
const reportSectionClass = 'border-2 border-black bg-[#fbfbf4]';
const disabledReportButtonClass =
  'h-auto rounded-[0.3rem] border-2 border-black/20 bg-black/5 px-4 py-2 text-[11px] font-black uppercase tracking-[0.08em] text-black/30';

type SourceCommandLineProps = {
  currentUserId: string | null;
  onSelectListener: () => void;
  onSelectSource: (source: ManagedSourceAccount) => void;
  roleLabel: string;
  signedInLabel: string;
  sources: ManagedSourceAccount[];
};

type ReportMessageProps = {
  body: string;
  label: string;
  title: string;
  actionHref?: string;
  actionLabel?: string;
};

type SourceMastheadProps = {
  activeSource: ManagedSourceAccount;
  homeSceneLabel: string;
  roleLabel: string;
  sourceProfile: ArtistBandProfile | null;
  sourceProfileError: string | null;
  sourceProfileLoading: boolean;
};

type ReleaseDeckReportProps = {
  activeSource: ManagedSourceAccount;
  sourceProfile: ArtistBandProfile | null;
};

type CalendarPrintShopReportProps = {
  activeSource: ManagedSourceAccount;
  events: ArtistBandEventSummary[];
  promoterCapabilityGranted: boolean;
};

type SourceRecordFooterProps = {
  activeSource: ManagedSourceAccount;
};

function getInitials(value: string) {
  const parts = value.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return 'UP';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
}

function formatDuration(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${String(remainingSeconds).padStart(2, '0')}`;
}

function formatDateLabel(value: string | null | undefined) {
  if (!value) return 'Runtime date pending';
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return 'Runtime date pending';
  return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(parsed);
}

function formatHomeSceneFromUser(
  user: ReturnType<typeof useAuthStore.getState>['user'],
  homeScene: ReturnType<typeof useOnboardingStore.getState>['homeScene'],
) {
  if (user?.homeSceneCity && user?.homeSceneState && user?.homeSceneCommunity) {
    return `${user.homeSceneCity}, ${user.homeSceneState} • ${user.homeSceneCommunity}`;
  }

  if (homeScene?.city && homeScene?.state && homeScene?.musicCommunity) {
    return `${homeScene.city}, ${homeScene.state} • ${homeScene.musicCommunity}`;
  }

  return 'Home Scene unresolved';
}

function formatHomeSceneFromProfile(profile: ArtistBandProfile | null, fallbackLabel: string) {
  const homeScene = profile?.homeScene;
  if (homeScene?.city && homeScene.state && homeScene.musicCommunity) {
    return `${homeScene.city}, ${homeScene.state} • ${homeScene.musicCommunity}`;
  }
  return fallbackLabel;
}

function getLinkCount(profile: ArtistBandProfile | null) {
  if (!profile) return 0;
  return [profile.officialWebsiteUrl, profile.merchUrl, profile.musicUrl, profile.donationUrl].filter(Boolean).length;
}

function getDisplayMembers(profile: ArtistBandProfile | null) {
  if (!profile) return [];
  const members = profile.members.slice(0, 4).map((member) => ({
    id: member.userId,
    name: member.user.displayName || member.user.username,
    role: formatSourceMembershipRole(member.role),
    avatar: member.user.avatar ?? null,
  }));

  if (members.length > 0) return members;

  return [
    {
      id: profile.createdBy.id,
      name: profile.createdBy.displayName || profile.createdBy.username,
      role: 'Manager',
      avatar: profile.createdBy.avatar ?? null,
    },
  ];
}

function getReportRows(profile: ArtistBandProfile | null): Array<ArtistBandTrackSummary | null> {
  const tracks = profile?.tracks.slice(0, 3) ?? [];
  return Array.from({ length: 3 }, (_, index) => tracks[index] ?? null);
}

function SourceFileCommandLine({
  currentUserId,
  onSelectListener,
  onSelectSource,
  roleLabel,
  signedInLabel,
  sources,
}: SourceCommandLineProps) {
  return (
    <header className="grid gap-0 border-b-4 border-black bg-[#fbfbf4] text-black lg:grid-cols-[12rem_1fr_auto_auto_auto]">
      <div className="flex min-h-[4rem] items-center border-b-2 border-black px-4 lg:border-b-0 lg:border-r-4">
        <span className="border-2 border-black px-2 py-0.5 text-3xl font-black leading-none tracking-[-0.08em] shadow-[2px_2px_0_rgba(0,0,0,0.14)]">
          UPRISE
        </span>
      </div>
      <div className="flex min-h-[4rem] items-center border-b-2 border-black px-4 lg:border-b-0">
        <h1 className="text-xl font-black uppercase tracking-[0.04em] sm:text-2xl">SOURCE DASHBOARD</h1>
      </div>
      <div className="flex min-h-[4rem] items-center gap-2 border-b-2 border-black px-4 text-sm font-semibold lg:border-b-0 lg:border-l-2">
        <UserRound aria-hidden className="h-5 w-5" />
        <span data-testid="source-command-role">{signedInLabel} · {roleLabel}</span>
      </div>
      <div className="flex min-h-[4rem] items-center border-b-2 border-black px-4 lg:border-b-0 lg:border-l-2">
        {sources.length > 0 ? (
          <SourceAccountSwitcher
            sources={sources}
            currentUserId={currentUserId}
            onSelectSource={onSelectSource}
            onSelectListener={onSelectListener}
            variant="command"
          />
        ) : (
          <span className="rounded-[0.3rem] border-2 border-black bg-[#fbfbf4] px-3 py-2 text-sm font-semibold">
            No source attached
          </span>
        )}
      </div>
      <div className="flex min-h-[4rem] items-center px-4 lg:border-l-2">
        <Button asChild size="sm" variant="outline" className={reportButtonClass}>
          <Link href="/plot" onClick={onSelectListener}>
            Exit to Listener Account <ExternalLink aria-hidden className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>
    </header>
  );
}

function SourceFileMessage({ actionHref, actionLabel, body, label, title }: ReportMessageProps) {
  return (
    <main className="min-h-screen bg-[#e9e7dc] px-3 py-4 text-black sm:px-6 sm:py-6">
      <div className="mx-auto box-border w-full max-w-[92rem] overflow-hidden border-4 border-black bg-[#fbfbf4] shadow-[8px_8px_0_rgba(0,0,0,0.18)]">
        <section className="min-w-0 p-5 sm:p-8">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-black/55">{label}</p>
          <h1 className="mt-2 break-words text-2xl font-black text-black sm:text-3xl">{title}</h1>
          <p className="mt-3 max-w-full break-words text-sm font-medium text-black/70 sm:max-w-2xl">{body}</p>
          {actionHref && actionLabel ? (
            <Button asChild size="sm" variant="outline" className={`${reportButtonClass} mt-5`}>
              <Link href={actionHref}>{actionLabel}</Link>
            </Button>
          ) : null}
        </section>
      </div>
    </main>
  );
}

function SourceMasthead({
  activeSource,
  homeSceneLabel,
  roleLabel,
  sourceProfile,
  sourceProfileError,
  sourceProfileLoading,
}: SourceMastheadProps) {
  const linkCount = getLinkCount(sourceProfile);
  const displayMembers = getDisplayMembers(sourceProfile);

  return (
    <section className="grid gap-5 border-b-4 border-black p-4 sm:p-6 xl:grid-cols-[26rem_1fr_28rem]">
      <div className="flex gap-4">
        <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-[0.3rem] border-4 border-black bg-black text-center text-xl font-black leading-none text-white shadow-[3px_3px_0_rgba(0,0,0,0.16)]">
          {sourceProfile?.avatar ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={sourceProfile.avatar} alt={`${activeSource.name} source avatar`} className="h-full w-full object-cover" />
          ) : (
            <span>{getInitials(activeSource.name)}</span>
          )}
        </div>
        <div className="min-w-0 pt-2">
          <p className="text-[11px] font-black uppercase tracking-[0.16em] text-black/55">Profile</p>
          <h2 className="truncate text-3xl font-black text-black">{activeSource.name}</h2>
          <p className="mt-2 text-base font-black text-black">Home Scene</p>
          <p className="text-sm font-semibold text-black/75">{homeSceneLabel}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 border-2 border-black sm:grid-cols-4">
        <div className="border-b-2 border-r-2 border-black p-3 sm:border-b-0">
          <p className="text-[11px] font-black uppercase tracking-[0.12em] text-black/55">Followers</p>
          <p className="mt-2 text-lg font-black">{sourceProfile?.followCount ?? '—'}</p>
        </div>
        <div className="border-b-2 border-black p-3 sm:border-b-0 sm:border-r-2">
          <p className="text-[11px] font-black uppercase tracking-[0.12em] text-black/55">Sects</p>
          <p className="mt-2 text-lg font-black">Unset</p>
        </div>
        <div className="border-r-2 border-black p-3">
          <p className="text-[11px] font-black uppercase tracking-[0.12em] text-black/55">Bio</p>
          <p className="mt-2 text-lg font-black">{sourceProfile?.bio ? 'Live' : 'Needs copy'}</p>
        </div>
        <div className="p-3">
          <p className="text-[11px] font-black uppercase tracking-[0.12em] text-black/55">Links</p>
          <p className="mt-2 text-lg font-black">{linkCount} live</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 xl:grid-cols-4">
        {displayMembers.map((member) => (
          <div key={member.id} className="min-w-0 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center overflow-hidden rounded-full border-2 border-black bg-[#f0eee5] text-sm font-black text-black">
              {member.avatar ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={member.avatar} alt={`${member.name} avatar`} className="h-full w-full object-cover" />
              ) : (
                <span>{getInitials(member.name)}</span>
              )}
            </div>
            <p className="mt-2 truncate text-sm font-black text-black">{member.name}</p>
            <p className="truncate text-xs font-semibold text-black/65">{member.role}</p>
          </div>
        ))}
      </div>

      {sourceProfileError ? (
        <p className="xl:col-span-3 text-sm font-semibold text-[#7a1f1f]">{sourceProfileError}</p>
      ) : sourceProfileLoading ? (
        <p className="xl:col-span-3 text-sm font-semibold text-black/60">Loading source profile snapshot...</p>
      ) : null}
      <p className="xl:col-span-3 text-xs font-semibold uppercase tracking-[0.12em] text-black/50">
        Selected source position: {roleLabel}. Role display is derived from this selected source membership record.
      </p>
    </section>
  );
}

function ReleaseDeckReport({ activeSource, sourceProfile }: ReleaseDeckReportProps) {
  const rows = getReportRows(sourceProfile);
  const communityId = sourceProfile?.homeScene?.id ?? null;
  const readiness = getReleaseDeckReadiness({
    activeSourceId: activeSource.id,
    communityId,
    tracks: sourceProfile?.tracks ?? [],
  });
  const selectedMetricsTrack = rows.find((track): track is ArtistBandTrackSummary => Boolean(track)) ?? null;

  return (
    <section className={reportSectionClass}>
      <div className="flex flex-col gap-3 border-b-2 border-black px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Music2 aria-hidden className="h-7 w-7" />
          <h3 className="text-2xl font-black uppercase tracking-[0.02em]">Release Deck</h3>
        </div>
        <div className="flex flex-wrap gap-2 text-[11px] font-black uppercase tracking-[0.08em]">
          <span className="rounded-[0.25rem] border-2 border-black px-3 py-1">3 music slots</span>
          <span className="rounded-[0.25rem] border-2 border-black px-3 py-1">6 min / song</span>
          <span className="rounded-[0.25rem] border-2 border-black px-3 py-1">15 min source cap</span>
          <span className="rounded-[0.25rem] border-2 border-black px-3 py-1">URL-only MVP</span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-[58rem] w-full border-collapse text-left text-sm">
          <thead>
            <tr className="border-b-2 border-black text-[11px] font-black uppercase tracking-[0.08em] text-black/75">
              <th className="w-16 border-r-2 border-black px-3 py-2 text-center">#</th>
              <th className="w-28 border-r-2 border-black px-3 py-2">Art</th>
              <th className="border-r-2 border-black px-3 py-2">Song</th>
              <th className="w-28 border-r-2 border-black px-3 py-2 text-center">Duration</th>
              <th className="w-40 border-r-2 border-black px-3 py-2">Release date</th>
              <th className="w-36 border-r-2 border-black px-3 py-2">Status</th>
              <th className="border-r-2 border-black px-3 py-2">URL</th>
              <th className="w-36 px-3 py-2 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((track, index) => {
              const sourceOwned = track?.artistBandId === activeSource.id;
              const validSourceOwnedTrack = Boolean(sourceOwned && track?.status === 'ready');

              return (
                <tr key={`release-row-${index + 1}`} className="border-b-2 border-black last:border-b-0">
                  <td className="border-r-2 border-black px-3 py-3 text-center text-xl font-black">{index + 1}</td>
                  <td className="border-r-2 border-black px-3 py-3">
                    {track?.coverArt ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={track.coverArt} alt={`${track.title} cover art`} className="h-16 w-20 rounded-[0.2rem] border-2 border-black object-cover" />
                    ) : (
                      <div className="flex h-16 w-20 items-center justify-center rounded-[0.2rem] border-2 border-black bg-[#111] px-2 text-center text-[10px] font-black uppercase leading-tight text-white">
                        {track ? track.title : '+'}
                      </div>
                    )}
                  </td>
                  <td className="border-r-2 border-black px-3 py-3">
                    {track ? (
                      <>
                        <p className="text-lg font-black text-black">{track.title}</p>
                        <p className="mt-1 inline-flex rounded-[0.2rem] border border-[#2d6a3a] px-2 py-0.5 text-[11px] font-black uppercase tracking-[0.08em] text-[#195b2d]">
                          {sourceOwned ? 'Source-owned release' : 'Legacy carry-forward'}
                        </p>
                      </>
                    ) : (
                      <>
                        <p className="text-lg font-black text-black">Open Slot</p>
                        <p className="text-sm font-semibold text-black/65">Add a source-owned track through URL-only Release Deck.</p>
                      </>
                    )}
                  </td>
                  <td className="border-r-2 border-black px-3 py-3 text-center font-black">
                    {track ? formatDuration(track.duration) : '—'}
                  </td>
                  <td className="border-r-2 border-black px-3 py-3 font-semibold">
                    {track ? formatDateLabel(track.createdAt) : '—'}
                  </td>
                  <td className="border-r-2 border-black px-3 py-3">
                    {track ? (
                      <span className="inline-flex items-center gap-2 font-black text-black">
                        {validSourceOwnedTrack ? <CheckCircle2 aria-hidden className="h-5 w-5 text-[#17672a]" /> : null}
                        {validSourceOwnedTrack ? 'Valid' : track.status}
                      </span>
                    ) : (
                      '—'
                    )}
                  </td>
                  <td className="border-r-2 border-black px-3 py-3">
                    {track ? (
                      <a href={track.fileUrl} className="break-all text-sm font-semibold underline underline-offset-2">
                        {track.fileUrl}
                      </a>
                    ) : (
                      '—'
                    )}
                  </td>
                  <td className="px-3 py-3 text-center">
                    {track ? (
                      <Button asChild size="sm" variant="outline" className={reportButtonClass}>
                        <Link href="/source-dashboard/release-deck">Load</Link>
                      </Button>
                    ) : (
                      <button type="button" disabled className={disabledReportButtonClass}>
                        Load
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="grid gap-3 border-t-2 border-black px-4 py-3 lg:grid-cols-[1fr_auto]">
        <div className="flex flex-wrap items-center gap-3 text-sm font-semibold">
          <Mic2 aria-hidden className="h-7 w-7" />
          <div>
            <p className="text-lg font-black">Paid ad clip</p>
            <p className="text-black/65">10 sec max · inactive attachment concept · not a fourth music slot</p>
          </div>
          <label className="flex items-center gap-2">
            <span className="text-xs font-black uppercase tracking-[0.08em]">Attach to track</span>
            <select disabled className="rounded-[0.25rem] border-2 border-black bg-white px-3 py-1 font-black text-black disabled:opacity-70">
              <option>1</option>
              <option>2</option>
              <option>3</option>
            </select>
          </label>
          <label className="flex items-center gap-2">
            <span className="text-xs font-black uppercase tracking-[0.08em]">Ad type</span>
            <select disabled className="rounded-[0.25rem] border-2 border-black bg-white px-3 py-1 font-black text-black disabled:opacity-70">
              <option>General</option>
              <option>Release date</option>
              <option>Event</option>
              <option>Sponsor</option>
            </select>
          </label>
        </div>
        <div className="text-left lg:text-right">
          <button type="button" disabled className={disabledReportButtonClass}>
            <LockKeyhole aria-hidden className="mr-2 h-4 w-4" /> Record clip
          </button>
          <p className="mt-1 text-xs font-semibold text-black/65">Payment account required before recording.</p>
        </div>
      </div>

      <div className="grid gap-3 border-t-2 border-black px-4 py-3 lg:grid-cols-[1fr_auto]">
        <div className="flex flex-wrap items-center gap-4">
          <BarChart3 aria-hidden className="h-7 w-7" />
          <p className="text-lg font-black">Release Metrics</p>
          <label className="flex items-center gap-2 text-sm font-semibold">
            <span>Song</span>
            <select disabled className="rounded-[0.25rem] border-2 border-black bg-white px-3 py-1 font-black text-black disabled:opacity-70">
              <option>{selectedMetricsTrack?.title ?? 'No source-owned track yet'}</option>
            </select>
          </label>
        </div>
        <div className="grid grid-cols-4 gap-4 text-sm font-black">
          <span>Listens {selectedMetricsTrack?.playCount ?? '—'}</span>
          <span>Upvotes {selectedMetricsTrack?.likeCount ?? '—'}</span>
          <span>Collects —</span>
          <span>Recommends —</span>
        </div>
      </div>

      {readiness.capReached ? (
        <p className="border-t-2 border-black px-4 py-3 text-sm font-black text-[#7a1f1f]">
          Cap reached: this report will not silently replace tracks or create an extra active music slot.
        </p>
      ) : null}
    </section>
  );
}

function CalendarPrintShopReport({ activeSource, events, promoterCapabilityGranted }: CalendarPrintShopReportProps) {
  const visibleEvents = events.slice(0, 2);

  return (
    <section className={reportSectionClass}>
      <div className="flex flex-col gap-3 border-b-2 border-black px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <CalendarDays aria-hidden className="h-7 w-7" />
          <h3 className="text-2xl font-black uppercase tracking-[0.02em]">Calendar / Print Shop</h3>
        </div>
        <Button asChild size="sm" variant="outline" className={reportButtonClass}>
          <Link href="/print-shop">Open Print Shop <ExternalLink aria-hidden className="ml-2 h-4 w-4" /></Link>
        </Button>
      </div>
      <div className="grid gap-0 lg:grid-cols-[22rem_1fr]">
        <div className="border-b-2 border-black p-4 lg:border-b-0 lg:border-r-2">
          <p className="text-sm font-black uppercase tracking-[0.12em]">July 2026</p>
          <div className="mt-3 grid grid-cols-7 gap-1 text-center text-xs font-black">
            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day) => (
              <span key={day} className="text-black/60">{day}</span>
            ))}
            {Array.from({ length: 35 }, (_, index) => {
              const day = index - 2;
              const isMarked = day === 14 || day === 22;
              return (
                <span key={`calendar-day-${index}`} className={isMarked ? 'rounded-full bg-[#17672a] py-1 text-white' : 'py-1 text-black'}>
                  {day > 0 && day <= 31 ? day : '·'}
                </span>
              );
            })}
          </div>
        </div>
        <div>
          {visibleEvents.length > 0 ? (
            visibleEvents.map((event) => (
              <div key={event.id} className="grid gap-3 border-b-2 border-black px-4 py-3 last:border-b-0 sm:grid-cols-[12rem_1fr_12rem]">
                <div>
                  <p className="font-black">{formatDateLabel(event.startDate)}</p>
                  <p className="text-xs font-semibold text-black/65">Source event record</p>
                </div>
                <div>
                  <p className="font-black">{event.title}</p>
                  <p className="text-sm font-semibold text-black/65">{event.locationName}</p>
                </div>
                <p className="text-sm font-black">Visibility governed by Print Shop</p>
              </div>
            ))
          ) : (
            <div className="grid gap-3 px-4 py-4 sm:grid-cols-[12rem_1fr_12rem]">
              <div>
                <p className="font-black">Private planning</p>
                <p className="text-xs font-semibold text-black/65">Draft source calendar</p>
              </div>
              <div>
                <p className="font-black">{activeSource.name} event lane</p>
                <p className="text-sm font-semibold text-black/65">
                  Calendar work stays source-facing. Public event publishing, follower delivery, flyer issuance, and paid runs remain outside this shell.
                </p>
              </div>
              <p className="text-sm font-black">Promoter capability: {promoterCapabilityGranted ? 'active' : 'inactive'}</p>
            </div>
          )}
          <div className="border-t-2 border-black px-4 py-3">
            <p className="font-black">Flyer printing</p>
            <p className="text-sm font-semibold text-black/65">Design and print flyers through the existing source-facing Print Shop route.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function SourceRecordFooter({ activeSource }: SourceRecordFooterProps) {
  return (
    <section className="relative overflow-hidden border-2 border-black bg-[#fbfbf4] px-4 py-4">
      <div className="grid gap-4 lg:grid-cols-[1fr_1fr_1fr_auto]">
        <div className="flex gap-3">
          <FileText aria-hidden className="h-8 w-8 shrink-0" />
          <div>
            <p className="text-xl font-black uppercase">Source Record</p>
            <p className="text-sm font-semibold text-black/65">Source management snapshot for {activeSource.name}.</p>
          </div>
        </div>
        <div className="border-t-2 border-black pt-3 lg:border-l-2 lg:border-t-0 lg:pl-4 lg:pt-0">
          <p className="text-xs font-black uppercase tracking-[0.12em] text-black/55">Registrar</p>
          <Link href="/registrar" className="mt-1 inline-flex items-center text-sm font-black underline underline-offset-2">
            UPRISE Registrar <ExternalLink aria-hidden className="ml-2 h-4 w-4" />
          </Link>
        </div>
        <div className="border-t-2 border-black pt-3 lg:border-l-2 lg:border-t-0 lg:pl-4 lg:pt-0">
          <p className="text-xs font-black uppercase tracking-[0.12em] text-black/55">Public Profile</p>
          <Link href={`/artist-bands/${activeSource.id}`} className="mt-1 inline-flex items-center text-sm font-black underline underline-offset-2">
            /source/{activeSource.slug} <ExternalLink aria-hidden className="ml-2 h-4 w-4" />
          </Link>
        </div>
        <div className="rotate-[-6deg] border-4 border-black px-5 py-2 text-center text-xl font-black uppercase tracking-[0.08em] opacity-70">
          <p>Source File</p>
          <p className="text-xs tracking-[0.2em]">UPRISE Source Record</p>
        </div>
      </div>
    </section>
  );
}

export default function SourceDashboardPage() {
  const router = useRouter();
  const { token, user } = useAuthStore();
  const { homeScene } = useOnboardingStore();
  const { activeSourceId, activeSourceUserId, clearActiveSourceId } = useSourceAccountStore();

  const [profile, setProfile] = useState<CurrentUserSourceProfile | null>(null);
  const [sourceProfile, setSourceProfile] = useState<ArtistBandProfile | null>(null);
  const [sourceProfileLoading, setSourceProfileLoading] = useState(false);
  const [sourceProfileError, setSourceProfileError] = useState<string | null>(null);
  const [promoterEntries, setPromoterEntries] = useState<RegistrarPromoterEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [staleContextNotice, setStaleContextNotice] = useState<string | null>(null);

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
  const sourceContextBelongsToCurrentUser = Boolean(activeSourceId && user?.id && activeSourceUserId === user.id);
  const activeSource = useMemo(
    () =>
      sourceContextBelongsToCurrentUser
        ? managedSources.find((source) => source.id === activeSourceId) ?? null
        : null,
    [activeSourceId, managedSources, sourceContextBelongsToCurrentUser],
  );
  const selectedRoleLabel = activeSource ? formatSourceMembershipRole(activeSource.membershipRole) : 'Listener';
  const signedInLabel = user?.displayName || user?.username || user?.email || 'Signed-in user';
  const latestPromoterEntry = promoterEntries[0] ?? null;
  const promoterCapabilityGranted = Boolean(latestPromoterEntry?.promoterCapability.granted);
  const fallbackHomeSceneLabel = useMemo(
    () => formatHomeSceneFromUser(user, homeScene),
    [homeScene, user],
  );
  const homeSceneLabel = formatHomeSceneFromProfile(sourceProfile, fallbackHomeSceneLabel);

  useEffect(() => {
    if (activeSourceId && (!user?.id || activeSourceUserId !== user.id)) {
      clearActiveSourceId();
      setStaleContextNotice('Stale source context was cleared because it no longer belongs to this signed-in user.');
      return;
    }
    if (!activeSourceId) return;
    if (!profile) return;
    if (activeSource) {
      setStaleContextNotice(null);
      return;
    }
    clearActiveSourceId();
    setStaleContextNotice('Stale source context was cleared because the selected source is no longer attached to this user.');
  }, [activeSource, activeSourceId, activeSourceUserId, clearActiveSourceId, profile, user?.id]);

  useEffect(() => {
    let cancelled = false;

    async function loadSourceProfile() {
      if (!token || !activeSource?.id) {
        setSourceProfile(null);
        setSourceProfileError(null);
        setSourceProfileLoading(false);
        return;
      }

      setSourceProfile(null);
      setSourceProfileLoading(true);
      setSourceProfileError(null);

      try {
        const artistProfile = await getArtistBandProfile(activeSource.id, token);
        if (cancelled) return;
        setSourceProfile(artistProfile);
      } catch (loadError: unknown) {
        if (cancelled) return;
        setSourceProfile(null);
        setSourceProfileError(loadError instanceof Error ? loadError.message : 'Unable to load source profile snapshot.');
      } finally {
        if (!cancelled) {
          setSourceProfileLoading(false);
        }
      }
    }

    void loadSourceProfile();

    return () => {
      cancelled = true;
    };
  }, [activeSource?.id, token]);

  useEffect(() => {
    let cancelled = false;

    async function loadPromoterEntries() {
      if (!token) {
        setPromoterEntries([]);
        return;
      }

      try {
        const response = await listPromoterRegistrations(token);
        if (cancelled) return;
        setPromoterEntries(response.entries ?? []);
      } catch {
        if (cancelled) return;
        setPromoterEntries([]);
      }
    }

    void loadPromoterEntries();
    return () => {
      cancelled = true;
    };
  }, [token]);

  if (loading) {
    return (
      <SourceFileMessage
        label="Source Dashboard"
        title="Loading source dashboard..."
        body="The source file shell is waiting for signed-in user and source membership context."
      />
    );
  }

  if (error) {
    return (
      <SourceFileMessage
        label="Source Dashboard"
        title="Source tools unavailable"
        body={error}
        actionHref="/plot"
        actionLabel="Back to Plot"
      />
    );
  }

  return (
    <main className="min-h-screen bg-[#e9e7dc] px-3 py-4 text-black sm:px-6 sm:py-6">
      <div className="mx-auto box-border w-full max-w-[92rem] border-4 border-black bg-[#fbfbf4] shadow-[8px_8px_0_rgba(0,0,0,0.18)]">
        <SourceFileCommandLine
          sources={managedSources}
          currentUserId={user?.id ?? null}
          roleLabel={selectedRoleLabel}
          signedInLabel={signedInLabel}
          onSelectSource={() => router.push('/source-dashboard')}
          onSelectListener={() => {
            clearActiveSourceId();
            router.push('/plot');
          }}
        />

        {staleContextNotice ? (
          <section className="border-b-4 border-black bg-[#fff8d8] px-4 py-3 text-sm font-black text-black">
            Source Context Reset: {staleContextNotice}
          </section>
        ) : null}

        {!activeSource ? (
          <section className="p-4 sm:p-6">
            <div className={reportSectionClass}>
              <div className="border-b-2 border-black px-4 py-3">
                <p className="text-xs font-black uppercase tracking-[0.16em] text-black/55">Current Source Summary</p>
                <h2 className="mt-2 text-3xl font-black">Select a source account</h2>
              </div>
              <div className="px-4 py-4 text-sm font-semibold text-black/75">
                {managedSources.length > 0
                  ? 'Listener Account is active. Select one managed source account in the top command line before source tools operate. Source Dashboard stays separate from the listener/community shell even though it uses the same signed-in account.'
                  : 'No managed source accounts are attached to this signed-in user. Registrar is the path for a listener to become a managed source; Source Dashboard does not show fake source tools without an attached source account.'}
              </div>
            </div>
          </section>
        ) : (
          <>
            <SourceMasthead
              activeSource={activeSource}
              homeSceneLabel={homeSceneLabel}
              roleLabel={selectedRoleLabel}
              sourceProfile={sourceProfile}
              sourceProfileError={sourceProfileError}
              sourceProfileLoading={sourceProfileLoading}
            />
            <div className="space-y-3 p-3 sm:p-4">
              <ReleaseDeckReport activeSource={activeSource} sourceProfile={sourceProfile} />
              <CalendarPrintShopReport
                activeSource={activeSource}
                events={sourceProfile?.events ?? []}
                promoterCapabilityGranted={promoterCapabilityGranted}
              />
              <SourceRecordFooter activeSource={activeSource} />
            </div>
          </>
        )}
      </div>
    </main>
  );
}
