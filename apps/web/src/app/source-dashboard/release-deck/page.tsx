'use client';

import { useEffect, useMemo, useRef, useState, type FormEvent } from 'react';
import Link from 'next/link';
import {
  CheckCircle2,
  ExternalLink,
  FileText,
  LockKeyhole,
  Mic2,
  Music2,
  UserRound,
} from 'lucide-react';
import { Button } from '@uprise/ui';
import type { ArtistBandProfile, ArtistBandTrackSummary, CreateTrackInput } from '@uprise/types';
import { getArtistBandProfile } from '@/lib/artist-bands/client';
import { api } from '@/lib/api';
import { createTrack } from '@/lib/tracks/client';
import { formatArtistBandEntityType } from '@/lib/registrar/artistBandLabels';
import {
  buildReleaseDeckTrackPayload,
  getReleaseDeckReadiness,
  getReleaseDeckSubmitBlockReason,
  releaseDeckMissingHomeSceneMessage,
} from '@/lib/source/release-deck-validation';
import {
  createReleaseDeckSchedule,
  getReleaseDeckScheduleAvailability,
  type ReleaseDeckScheduleAvailabilityResponse,
  type ReleaseDeckScheduleMode,
} from '@/lib/source/release-deck-scheduling';
import { SourceAccountSwitcher, formatSourceMembershipRole } from '@/components/source/SourceAccountSwitcher';
import type { CurrentUserSourceProfile, ManagedSourceAccount } from '@/lib/source/types';
import { useAuthStore } from '@/store/auth';
import { useSourceAccountStore } from '@/store/source-account';

type ReleaseDeckFormState = {
  title: string;
  album: string;
  duration: string;
  fileUrl: string;
  coverArt: string;
};

type CommandLineProps = {
  activeSource: ManagedSourceAccount;
  currentUserId: string | null;
  onSelectListener: () => void;
  onSelectSource: (source: ManagedSourceAccount) => void;
  signedInLabel: string;
  sources: ManagedSourceAccount[];
};

type ReleaseDeckRowsProps = {
  activeSource: ManagedSourceAccount;
  currentDeckTracks: ArtistBandTrackSummary[];
  loadedTrackId: string | null;
  onLoadTrack: (trackId: string) => void;
  scheduleSummaries: Record<string, ReleaseDeckScheduleSummary>;
};

type ReleaseDeckFormProps = {
  activeSource: ManagedSourceAccount;
  communityId: string | null;
  form: ReleaseDeckFormState;
  isSubmitting: boolean;
  onFormChange: (nextForm: ReleaseDeckFormState) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  submitError: string | null;
  submitMessage: string | null;
};

type ReleaseDeckScheduleSummary = {
  state: 'checking' | 'unscheduled' | 'scheduled' | 'unavailable';
  scheduledFor?: string;
};

type ReleaseDeckSchedulePanelProps = {
  activeSource: ManagedSourceAccount;
  availability: ReleaseDeckScheduleAvailabilityResponse | null;
  communityId: string | null;
  isCheckingAvailability: boolean;
  isScheduling: boolean;
  loadedTrack: ArtistBandTrackSummary | null;
  mode: ReleaseDeckScheduleMode;
  onModeChange: (mode: ReleaseDeckScheduleMode) => void;
  onRequestedDateChange: (date: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  requestedDate: string;
  scheduleError: string | null;
  scheduleMessage: string | null;
};

const emptyForm: ReleaseDeckFormState = {
  title: '',
  album: '',
  duration: '',
  fileUrl: '',
  coverArt: '',
};

const reportButtonClass =
  'h-auto rounded-[0.3rem] border-2 border-black bg-[#fbfbf4] px-4 py-2 text-[11px] font-black uppercase tracking-[0.08em] text-black shadow-[2px_2px_0_rgba(0,0,0,0.16)] hover:bg-white';
const disabledReportButtonClass =
  'inline-flex h-auto items-center rounded-[0.3rem] border-2 border-black/20 bg-black/5 px-4 py-2 text-[11px] font-black uppercase tracking-[0.08em] text-black/30';
const inputClass = 'mt-2 w-full rounded-[0.25rem] border-2 border-black bg-white px-3 py-2 text-sm font-semibold text-black';

function formatDuration(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${String(remainingSeconds).padStart(2, '0')}`;
}

function formatDateLabel(value: string | null | undefined) {
  if (!value) return 'Runtime date pending';
  const parsed = /^\d{4}-\d{2}-\d{2}$/.test(value) ? new Date(`${value}T00:00:00.000Z`) : new Date(value);
  if (Number.isNaN(parsed.getTime())) return 'Runtime date pending';
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(parsed);
}

function getInitials(value: string) {
  const parts = value.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return 'UP';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
}

function ReleaseDeckCommandLine({
  activeSource,
  currentUserId,
  onSelectListener,
  onSelectSource,
  signedInLabel,
  sources,
}: CommandLineProps) {
  const roleLabel = formatSourceMembershipRole(activeSource.membershipRole);

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
        <SourceAccountSwitcher
          sources={sources}
          currentUserId={currentUserId}
          onSelectSource={onSelectSource}
          onSelectListener={onSelectListener}
          variant="command"
        />
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

function ReleaseDeckRows({
  activeSource,
  currentDeckTracks,
  loadedTrackId,
  onLoadTrack,
  scheduleSummaries,
}: ReleaseDeckRowsProps) {
  const rows = Array.from({ length: 3 }, (_, index) => currentDeckTracks[index] ?? null);

  return (
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
            const selected = loadedTrackId === track?.id;
            const scheduleSummary = track ? scheduleSummaries[track.id] : undefined;

            return (
              <tr key={`release-row-${index + 1}`} className={selected ? 'border-b-2 border-black bg-[#eef6dc]' : 'border-b-2 border-black last:border-b-0'}>
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
                      <p className="text-sm font-semibold text-black/65">Load a source-owned hosted URL track.</p>
                    </>
                  )}
                </td>
                <td className="border-r-2 border-black px-3 py-3 text-center font-black">
                  {track ? formatDuration(track.duration) : '—'}
                </td>
                <td className="border-r-2 border-black px-3 py-3 font-semibold">
                  {track
                    ? scheduleSummary?.state === 'scheduled'
                      ? formatDateLabel(scheduleSummary.scheduledFor)
                      : scheduleSummary?.state === 'checking'
                        ? 'Checking...'
                        : scheduleSummary?.state === 'unscheduled'
                          ? 'Not scheduled'
                          : scheduleSummary?.state === 'unavailable'
                            ? 'Unavailable'
                            : 'Load to check'
                    : '—'}
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
                    <Button type="button" size="sm" variant="outline" className={reportButtonClass} onClick={() => onLoadTrack(track.id)}>
                      Load
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
  );
}

function ReleaseDeckSchedulePanel({
  activeSource,
  availability,
  communityId,
  isCheckingAvailability,
  isScheduling,
  loadedTrack,
  mode,
  onModeChange,
  onRequestedDateChange,
  onSubmit,
  requestedDate,
  scheduleError,
  scheduleMessage,
}: ReleaseDeckSchedulePanelProps) {
  if (!loadedTrack) {
    return (
      <div className="mt-4 border-2 border-dashed border-black/35 px-3 py-3 text-sm font-semibold text-black/60">
        Load a source-owned ready row to check its Release Deck scheduling capacity.
      </div>
    );
  }

  const sourceOwnedReady = loadedTrack.artistBandId === activeSource.id && loadedTrack.status === 'ready';
  if (!sourceOwnedReady) {
    return (
      <div className="mt-4 border-2 border-black px-3 py-3 text-sm font-black text-[#7a1f1f]">
        Scheduling is available only for valid source-owned ready tracks. Legacy carry-forward and processing rows remain read-only here.
      </div>
    );
  }

  if (isCheckingAvailability) {
    return (
      <div className="mt-4 border-2 border-black px-3 py-3 text-sm font-semibold text-black/65">
        Checking server-calculated release-date capacity...
      </div>
    );
  }

  const existingSchedule = availability && !availability.success ? availability.error.schedule : undefined;
  if (existingSchedule) {
    return (
      <div className="mt-4 border-2 border-black bg-[#eef6dc] px-3 py-3">
        <p className="text-[11px] font-black uppercase tracking-[0.12em] text-black/55">Release date scheduled</p>
        <p className="mt-2 text-lg font-black text-black">
          {formatDateLabel(existingSchedule.scheduledFor)} · {existingSchedule.status}
        </p>
        <p className="mt-1 text-sm font-semibold text-black/65">
          {existingSchedule.assignmentMode === 'soonest'
            ? 'The system assigned the soonest valid date.'
            : 'The source selected this available date.'}
        </p>
        {scheduleMessage ? <p className="mt-2 text-sm font-black text-[#195b2d]">{scheduleMessage}</p> : null}
      </div>
    );
  }

  const alternatives = availability
    ? availability.success
      ? availability.data.alternatives
      : availability.error.alternatives ?? []
    : [];
  const soonestValidDate = availability
    ? availability.success
      ? availability.data.soonestValidDate
      : availability.error.soonestValidDate ?? null
    : null;
  const availabilityError = availability && !availability.success ? availability.error : null;
  const canSchedule = Boolean(communityId && soonestValidDate && alternatives.length > 0);

  return (
    <div className="mt-4 border-2 border-black px-3 py-3">
      <p className="text-[11px] font-black uppercase tracking-[0.12em] text-black/55">Release-date scheduling</p>
      {soonestValidDate ? (
        <p className="mt-2 text-lg font-black text-black">Soonest available: {formatDateLabel(soonestValidDate)}</p>
      ) : null}
      {availabilityError ? <p className="mt-2 text-sm font-black text-[#7a1f1f]">{availabilityError.message}</p> : null}
      {scheduleError ? <p className="mt-2 text-sm font-black text-[#7a1f1f]">{scheduleError}</p> : null}
      {!canSchedule && !scheduleError ? (
        <p className="mt-2 text-sm font-semibold text-black/65">No schedulable date is currently available in the 30-day server lookahead.</p>
      ) : null}

      {canSchedule ? (
        <form data-testid="release-deck-schedule-form" className="mt-3 grid gap-3 sm:grid-cols-[1fr_1fr_auto] sm:items-end" onSubmit={onSubmit}>
          <label className="block text-sm text-black">
            <span className="text-[11px] font-black uppercase tracking-[0.12em] text-black/55">Assignment</span>
            <select
              name="scheduleMode"
              value={mode}
              onChange={(event) => onModeChange(event.target.value as ReleaseDeckScheduleMode)}
              className={inputClass}
            >
              <option value="soonest">Soonest available</option>
              <option value="chosen">Choose available date</option>
            </select>
          </label>

          <label className="block text-sm text-black">
            <span className="text-[11px] font-black uppercase tracking-[0.12em] text-black/55">Available release date</span>
            <select
              name="scheduleDate"
              disabled={mode !== 'chosen'}
              value={requestedDate}
              onChange={(event) => onRequestedDateChange(event.target.value)}
              className={`${inputClass} disabled:bg-black/5 disabled:text-black/50`}
            >
              {alternatives.map((date) => (
                <option key={date} value={date}>{formatDateLabel(date)}</option>
              ))}
            </select>
          </label>

          <Button
            type="submit"
            disabled={isScheduling || (mode === 'chosen' && !requestedDate)}
            className="rounded-[0.3rem] border-2 border-black bg-[#b8d63b] px-5 py-2 text-xs font-black uppercase tracking-[0.14em] text-black shadow-[2px_2px_0_rgba(0,0,0,0.16)] hover:bg-[#d7f06a]"
          >
            {isScheduling ? 'Scheduling...' : 'Schedule song'}
          </Button>
        </form>
      ) : null}

      <p className="mt-3 text-xs font-semibold text-black/55">
        Capacity is calculated by the API. Scheduling cannot buy priority, reorder Fair Play, or shorten another song's protected New Releases run.
      </p>
    </div>
  );
}

function ReleaseSingleForm({
  activeSource,
  communityId,
  form,
  isSubmitting,
  onFormChange,
  onSubmit,
  submitError,
  submitMessage,
}: ReleaseDeckFormProps) {
  return (
    <section className="border-2 border-black bg-[#fbfbf4]">
      <div className="border-b-2 border-black px-4 py-3">
        <p className="text-xs font-black uppercase tracking-[0.16em] text-black/55">Release Single</p>
        <h2 className="mt-2 text-xl font-black">Create a URL-only single from this source context</h2>
        <p className="mt-2 text-sm font-semibold text-black/65">
          This MVP path writes a source-owned ready track from an explicit hosted audio URL. After creation, load the row to check release-date capacity. Upload storage, metadata editing, and replacement controls remain outside this slice.
        </p>
      </div>

      <form className="space-y-3 px-4 py-4" onSubmit={onSubmit}>
        <label className="block text-sm text-black">
          <span className="text-[11px] font-black uppercase tracking-[0.12em] text-black/55">Source</span>
          <input name="source" disabled value={activeSource.name} className={`${inputClass} bg-black/5 text-black/75`} />
        </label>

        <label className="block text-sm text-black">
          <span className="text-[11px] font-black uppercase tracking-[0.12em] text-black/55">Title</span>
          <input
            name="title"
            required
            value={form.title}
            onChange={(event) => onFormChange({ ...form, title: event.target.value })}
            className={inputClass}
            placeholder="Single title"
          />
        </label>

        <label className="block text-sm text-black">
          <span className="text-[11px] font-black uppercase tracking-[0.12em] text-black/55">Album</span>
          <input
            name="album"
            value={form.album}
            onChange={(event) => onFormChange({ ...form, album: event.target.value })}
            className={inputClass}
            placeholder="Optional album or release note"
          />
        </label>

        <label className="block text-sm text-black">
          <span className="text-[11px] font-black uppercase tracking-[0.12em] text-black/55">Duration (seconds)</span>
          <input
            name="duration"
            required
            inputMode="numeric"
            value={form.duration}
            onChange={(event) => onFormChange({ ...form, duration: event.target.value })}
            className={inputClass}
            placeholder="210"
          />
          <span className="mt-1 block text-xs font-semibold text-black/55">Maximum 360 seconds for one Release Deck song.</span>
        </label>

        <label className="block text-sm text-black">
          <span className="text-[11px] font-black uppercase tracking-[0.12em] text-black/55">Audio File URL</span>
          <input
            name="fileUrl"
            required
            type="url"
            value={form.fileUrl}
            onChange={(event) => onFormChange({ ...form, fileUrl: event.target.value })}
            className={inputClass}
            placeholder="https://..."
          />
        </label>

        <label className="block text-sm text-black">
          <span className="text-[11px] font-black uppercase tracking-[0.12em] text-black/55">Cover Art URL</span>
          <input
            name="coverArt"
            type="url"
            value={form.coverArt}
            onChange={(event) => onFormChange({ ...form, coverArt: event.target.value })}
            className={inputClass}
            placeholder="https://..."
          />
        </label>

        {submitError ? <p className="text-sm font-black text-[#7a1f1f]">{submitError}</p> : null}
        {submitMessage ? <p className="text-sm font-black text-[#195b2d]">{submitMessage}</p> : null}
        {!communityId ? <p className="text-sm font-black text-[#7a1f1f]">{releaseDeckMissingHomeSceneMessage}</p> : null}

        <Button
          type="submit"
          disabled={isSubmitting || !communityId}
          className="rounded-[0.3rem] border-2 border-black bg-[#b8d63b] px-5 py-2 text-xs font-black uppercase tracking-[0.14em] text-black shadow-[2px_2px_0_rgba(0,0,0,0.16)] hover:bg-[#d7f06a]"
        >
          {isSubmitting ? 'Releasing...' : 'Release Single'}
        </Button>
      </form>
    </section>
  );
}

export default function ReleaseDeckPage() {
  const { token, user } = useAuthStore();
  const { activeSourceId, activeSourceUserId, clearActiveSourceId } = useSourceAccountStore();

  const [currentUserProfile, setCurrentUserProfile] = useState<CurrentUserSourceProfile | null>(null);
  const [sourceProfile, setSourceProfile] = useState<ArtistBandProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitMessage, setSubmitMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState<ReleaseDeckFormState>(emptyForm);
  const [loadedTrackId, setLoadedTrackId] = useState<string | null>(null);
  const [scheduleAvailability, setScheduleAvailability] = useState<ReleaseDeckScheduleAvailabilityResponse | null>(null);
  const [scheduleError, setScheduleError] = useState<string | null>(null);
  const [scheduleMessage, setScheduleMessage] = useState<string | null>(null);
  const [scheduleMode, setScheduleMode] = useState<ReleaseDeckScheduleMode>('soonest');
  const [requestedScheduleDate, setRequestedScheduleDate] = useState('');
  const [isCheckingSchedule, setIsCheckingSchedule] = useState(false);
  const [isScheduling, setIsScheduling] = useState(false);
  const [scheduleSummaries, setScheduleSummaries] = useState<Record<string, ReleaseDeckScheduleSummary>>({});
  const scheduleRequestId = useRef(0);

  useEffect(() => {
    scheduleRequestId.current += 1;
    setLoadedTrackId(null);
    setScheduleAvailability(null);
    setScheduleError(null);
    setScheduleMessage(null);
    setScheduleMode('soonest');
    setRequestedScheduleDate('');
    setIsCheckingSchedule(false);
    setIsScheduling(false);
    setScheduleSummaries({});
  }, [activeSourceId]);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      if (!token || !user?.id) {
        if (activeSourceId) {
          clearActiveSourceId();
        }
        setCurrentUserProfile(null);
        setSourceProfile(null);
        setLoading(false);
        setError('Sign in is required before opening Release Deck.');
        return;
      }

      if (activeSourceId && activeSourceUserId !== user.id) {
        clearActiveSourceId();
        setCurrentUserProfile(null);
        setSourceProfile(null);
        setLoading(false);
        setError('Select a source account before opening Release Deck.');
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
  }, [activeSourceId, activeSourceUserId, clearActiveSourceId, token, user?.id]);

  const sourceContextBelongsToCurrentUser = Boolean(activeSourceId && user?.id && activeSourceUserId === user.id);
  const activeSource = useMemo(
    () =>
      sourceContextBelongsToCurrentUser
        ? currentUserProfile?.managedArtistBands.find((source) => source.id === activeSourceId) ?? null
        : null,
    [activeSourceId, currentUserProfile?.managedArtistBands, sourceContextBelongsToCurrentUser],
  );

  const currentDeckTracks = useMemo(() => sourceProfile?.tracks.slice(0, 3) ?? [], [sourceProfile?.tracks]);
  const communityId = sourceProfile?.homeScene?.id ?? null;
  const readiness = useMemo(
    () =>
      getReleaseDeckReadiness({
        activeSourceId: activeSourceId ?? '',
        communityId,
        tracks: sourceProfile?.tracks ?? [],
      }),
    [activeSourceId, communityId, sourceProfile?.tracks],
  );
  const loadedTrack = useMemo(
    () => sourceProfile?.tracks.find((track) => track.id === loadedTrackId) ?? null,
    [loadedTrackId, sourceProfile?.tracks],
  );
  const homeSceneLabel = sourceProfile?.homeScene
    ? `${sourceProfile.homeScene.city}, ${sourceProfile.homeScene.state} • ${sourceProfile.homeScene.musicCommunity}`
    : 'Home Scene unavailable';
  const signedInLabel = user?.displayName || user?.username || user?.email || 'Signed-in user';

  async function reloadSourceProfile() {
    if (!token || !activeSourceId || !sourceContextBelongsToCurrentUser) return;
    const refreshed = await getArtistBandProfile(activeSourceId, token);
    setSourceProfile(refreshed);
  }

  async function handleLoadTrack(trackId: string) {
    const track = sourceProfile?.tracks.find((candidate) => candidate.id === trackId) ?? null;
    const requestId = scheduleRequestId.current + 1;
    scheduleRequestId.current = requestId;

    setLoadedTrackId(trackId);
    setScheduleAvailability(null);
    setScheduleError(null);
    setScheduleMessage(null);
    setScheduleMode('soonest');
    setRequestedScheduleDate('');
    setIsCheckingSchedule(false);
    setIsScheduling(false);

    if (!track || track.artistBandId !== activeSource?.id || track.status !== 'ready') {
      setScheduleSummaries((current) => ({
        ...current,
        [trackId]: { state: 'unavailable' },
      }));
      return;
    }

    if (!token || !communityId || !sourceContextBelongsToCurrentUser) {
      setScheduleError(!communityId ? releaseDeckMissingHomeSceneMessage : 'Select a source account before scheduling a release date.');
      setScheduleSummaries((current) => ({
        ...current,
        [trackId]: { state: 'unavailable' },
      }));
      return;
    }

    setIsCheckingSchedule(true);
    setScheduleSummaries((current) => ({
      ...current,
      [trackId]: { state: 'checking' },
    }));

    try {
      const availability = await getReleaseDeckScheduleAvailability(
        { communityId, trackId },
        token,
      );
      if (scheduleRequestId.current !== requestId) return;

      const existingSchedule = !availability.success ? availability.error.schedule : undefined;
      const soonestValidDate = availability.success
        ? availability.data.soonestValidDate
        : availability.error.soonestValidDate ?? null;

      setScheduleAvailability(availability);
      setRequestedScheduleDate(soonestValidDate ?? '');
      setScheduleSummaries((current) => ({
        ...current,
        [trackId]: existingSchedule
          ? { state: 'scheduled', scheduledFor: existingSchedule.scheduledFor }
          : soonestValidDate
            ? { state: 'unscheduled' }
            : { state: 'unavailable' },
      }));
    } catch (availabilityError: unknown) {
      if (scheduleRequestId.current !== requestId) return;
      setScheduleError(availabilityError instanceof Error ? availabilityError.message : 'Unable to check release-date capacity.');
      setScheduleSummaries((current) => ({
        ...current,
        [trackId]: { state: 'unavailable' },
      }));
    } finally {
      if (scheduleRequestId.current === requestId) {
        setIsCheckingSchedule(false);
      }
    }
  }

  async function handleScheduleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const currentSourceContext = useSourceAccountStore.getState();
    const sourceStillBelongsToCurrentUser = Boolean(
      activeSource &&
        user?.id &&
        currentSourceContext.activeSourceId === activeSource.id &&
        currentSourceContext.activeSourceUserId === user.id,
    );

    if (!token || !activeSource || !communityId || !loadedTrack || !sourceStillBelongsToCurrentUser) {
      setScheduleError('Select a source account with a resolved Home Scene before scheduling a release date.');
      return;
    }

    if (loadedTrack.artistBandId !== activeSource.id || loadedTrack.status !== 'ready') {
      setScheduleError('Scheduling is available only for valid source-owned ready tracks.');
      return;
    }

    const alternatives = scheduleAvailability
      ? scheduleAvailability.success
        ? scheduleAvailability.data.alternatives
        : scheduleAvailability.error.alternatives ?? []
      : [];
    if (scheduleMode === 'chosen' && (!requestedScheduleDate || !alternatives.includes(requestedScheduleDate))) {
      setScheduleError('Choose one of the available release dates returned by the server.');
      return;
    }

    setIsScheduling(true);
    setScheduleError(null);
    setScheduleMessage(null);

    try {
      const schedule = await createReleaseDeckSchedule(
        {
          communityId,
          trackId: loadedTrack.id,
          mode: scheduleMode,
          ...(scheduleMode === 'chosen' ? { requestedDate: requestedScheduleDate } : {}),
        },
        token,
      );
      const scheduledFor = schedule.scheduledFor.slice(0, 10);
      const requestedFor = schedule.requestedFor ? schedule.requestedFor.slice(0, 10) : null;
      const existingSchedule = {
        id: schedule.id,
        status: schedule.status,
        scheduledFor,
        assignmentMode: schedule.assignmentMode,
        requestedFor,
      };

      setScheduleAvailability({
        success: false,
        error: {
          code: 'ALREADY_SCHEDULED_OR_ACTIVE',
          message: 'Track is already scheduled or active in RADIYO',
          trackId: loadedTrack.id,
          schedule: existingSchedule,
        },
      });
      setScheduleSummaries((current) => ({
        ...current,
        [loadedTrack.id]: { state: 'scheduled', scheduledFor },
      }));
      setScheduleMessage(
        `${loadedTrack.title} is scheduled for ${formatDateLabel(scheduledFor)} using ${schedule.assignmentMode === 'soonest' ? 'the soonest valid date' : 'the selected available date'}.`,
      );
    } catch (createError: unknown) {
      setScheduleError(createError instanceof Error ? createError.message : 'Unable to schedule this release date.');
    } finally {
      setIsScheduling(false);
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const currentSourceContext = useSourceAccountStore.getState();
    const sourceStillBelongsToCurrentUser = Boolean(
      activeSource &&
        user?.id &&
        currentSourceContext.activeSourceId === activeSource.id &&
        currentSourceContext.activeSourceUserId === user.id,
    );

    if (!token || !activeSource || !sourceStillBelongsToCurrentUser) {
      setSubmitError('Select a source account before opening Release Deck.');
      return;
    }

    let payload: CreateTrackInput;
    try {
      if (!communityId) {
        throw new Error(releaseDeckMissingHomeSceneMessage);
      }
      payload = buildReleaseDeckTrackPayload(form, activeSource, communityId);
      const submitBlockReason = getReleaseDeckSubmitBlockReason(readiness, payload.duration);
      if (submitBlockReason) {
        throw new Error(submitBlockReason);
      }
    } catch (validationError: unknown) {
      setSubmitError(validationError instanceof Error ? validationError.message : 'Release Deck validation failed.');
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitMessage(null);

    try {
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
      <main className="min-h-screen bg-[#e9e7dc] px-3 py-4 text-black sm:px-6 sm:py-6">
        <div className="mx-auto box-border w-full max-w-[92rem] overflow-hidden border-4 border-black bg-[#fbfbf4] p-5 shadow-[8px_8px_0_rgba(0,0,0,0.18)] sm:p-8">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-black/55">Release Deck</p>
          <p className="mt-2 text-sm font-semibold text-black/60">Loading source release context...</p>
        </div>
      </main>
    );
  }

  if (error || !activeSource || !sourceProfile) {
    return (
      <main className="min-h-screen bg-[#e9e7dc] px-3 py-4 text-black sm:px-6 sm:py-6">
        <div className="mx-auto box-border w-full max-w-[92rem] overflow-hidden border-4 border-black bg-[#fbfbf4] p-5 shadow-[8px_8px_0_rgba(0,0,0,0.18)] sm:p-8">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-black/55">Release Deck</p>
          <p className="mt-2 text-sm font-black text-[#7a1f1f]">{error ?? 'Release Deck is unavailable for this source.'}</p>
          <Button asChild size="sm" variant="outline" className={`${reportButtonClass} mt-5`}>
            <Link href="/source-dashboard">Back to Source Dashboard</Link>
          </Button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#e9e7dc] px-3 py-4 text-black sm:px-6 sm:py-6">
      <div className="mx-auto box-border w-full max-w-[92rem] border-4 border-black bg-[#fbfbf4] shadow-[8px_8px_0_rgba(0,0,0,0.18)]">
        <ReleaseDeckCommandLine
          activeSource={activeSource}
          sources={currentUserProfile?.managedArtistBands ?? []}
          currentUserId={user?.id ?? null}
          signedInLabel={signedInLabel}
          onSelectSource={() => undefined}
          onSelectListener={() => clearActiveSourceId()}
        />

        <section className="grid gap-5 border-b-4 border-black p-4 sm:p-6 lg:grid-cols-[24rem_1fr]">
          <div className="flex gap-4">
            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-[0.3rem] border-4 border-black bg-black text-center text-lg font-black leading-none text-white shadow-[3px_3px_0_rgba(0,0,0,0.16)]">
              {sourceProfile.avatar ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={sourceProfile.avatar} alt={`${activeSource.name} source avatar`} className="h-full w-full object-cover" />
              ) : (
                getInitials(activeSource.name)
              )}
            </div>
            <div className="min-w-0 pt-1">
              <p className="text-[11px] font-black uppercase tracking-[0.16em] text-black/55">Release Deck</p>
              <h2 className="truncate text-3xl font-black text-black">{activeSource.name}</h2>
              <p className="mt-1 text-sm font-semibold text-black/70">
                {formatArtistBandEntityType(activeSource.entityType)} · @{activeSource.slug} · {formatSourceMembershipRole(activeSource.membershipRole)}
              </p>
              <p className="mt-2 text-sm font-black text-black">Home Scene: {homeSceneLabel}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 border-2 border-black sm:grid-cols-4">
            <div className="border-b-2 border-r-2 border-black p-3 sm:border-b-0">
              <p className="text-[11px] font-black uppercase tracking-[0.12em] text-black/55">Music slots</p>
              <p className="mt-2 text-lg font-black">{readiness.sourceOwnedReadyTrackCount} / 3</p>
            </div>
            <div className="border-b-2 border-black p-3 sm:border-b-0 sm:border-r-2">
              <p className="text-[11px] font-black uppercase tracking-[0.12em] text-black/55">Song cap</p>
              <p className="mt-2 text-lg font-black">6 min</p>
            </div>
            <div className="border-r-2 border-black p-3">
              <p className="text-[11px] font-black uppercase tracking-[0.12em] text-black/55">Source cap</p>
              <p className="mt-2 text-lg font-black">{formatDuration(readiness.activeDurationSeconds)} / 15:00</p>
            </div>
            <div className="p-3">
              <p className="text-[11px] font-black uppercase tracking-[0.12em] text-black/55">Status</p>
              <p className="mt-2 text-lg font-black">{readiness.readyForTesting ? 'Testing ready' : 'Needs track'}</p>
            </div>
          </div>
        </section>

        <div className="space-y-3 p-3 sm:p-4">
          <section className="border-2 border-black bg-[#fbfbf4]">
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
            <ReleaseDeckRows
              activeSource={activeSource}
              currentDeckTracks={currentDeckTracks}
              loadedTrackId={loadedTrackId}
              onLoadTrack={(trackId) => void handleLoadTrack(trackId)}
              scheduleSummaries={scheduleSummaries}
            />
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
            {readiness.capReached ? (
              <p className="border-t-2 border-black px-4 py-3 text-sm font-black text-[#7a1f1f]">
                Cap reached: this screen will not silently replace existing tracks or create an extra active music slot. Choose a different active song combination when replacement tooling is specified.
              </p>
            ) : null}
            {readiness.missingHomeScene ? (
              <p className="border-t-2 border-black px-4 py-3 text-sm font-black text-[#7a1f1f]">{releaseDeckMissingHomeSceneMessage}</p>
            ) : null}
          </section>

          <section className="grid gap-3 lg:grid-cols-[1fr_26rem]">
            <div className="border-2 border-black bg-[#fbfbf4] px-4 py-4">
              <p className="text-xs font-black uppercase tracking-[0.16em] text-black/55">Loaded Row</p>
              {loadedTrack ? (
                <>
                  <p className="mt-2 text-xl font-black text-black">{loadedTrack.title}</p>
                  <p className="mt-1 text-sm font-semibold text-black/65">
                    Check server-owned release-date capacity and schedule this source-owned ready song. Metadata editing and replacement controls still need separate media contracts.
                  </p>
                </>
              ) : (
                <p className="mt-2 text-sm font-semibold text-black/65">Use Load on a source-owned row to focus the row context. Empty slots use the URL-only Release Single form.</p>
              )}
              <ReleaseDeckSchedulePanel
                activeSource={activeSource}
                availability={scheduleAvailability}
                communityId={communityId}
                isCheckingAvailability={isCheckingSchedule}
                isScheduling={isScheduling}
                loadedTrack={loadedTrack}
                mode={scheduleMode}
                onModeChange={(mode) => {
                  setScheduleMode(mode);
                  setScheduleError(null);
                }}
                onRequestedDateChange={(date) => {
                  setRequestedScheduleDate(date);
                  setScheduleError(null);
                }}
                onSubmit={handleScheduleSubmit}
                requestedDate={requestedScheduleDate}
                scheduleError={scheduleError}
                scheduleMessage={scheduleMessage}
              />
              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                <div className="border-2 border-black px-3 py-3">
                  <p className="text-[11px] font-black uppercase tracking-[0.12em] text-black/55">Testing visibility</p>
                  <p className="mt-2 font-black">{readiness.readyForTesting ? 'Ready for Fair Play/player testing' : 'Testing visibility needs a source-owned ready track.'}</p>
                </div>
                <div className="border-2 border-black px-3 py-3">
                  <p className="text-[11px] font-black uppercase tracking-[0.12em] text-black/55">Open slots</p>
                  <p className="mt-2 font-black">{readiness.openMusicSlots}</p>
                </div>
                <div className="border-2 border-black px-3 py-3">
                  <p className="text-[11px] font-black uppercase tracking-[0.12em] text-black/55">Source record</p>
                  <p className="mt-2 font-black">URL-only source-owned rows</p>
                </div>
              </div>
            </div>

            <ReleaseSingleForm
              activeSource={activeSource}
              communityId={communityId}
              form={form}
              isSubmitting={isSubmitting}
              onFormChange={setForm}
              onSubmit={handleSubmit}
              submitError={submitError}
              submitMessage={submitMessage}
            />
          </section>

          <section className="relative overflow-hidden border-2 border-black bg-[#fbfbf4] px-4 py-4">
            <div className="grid gap-4 lg:grid-cols-[1fr_1fr_auto]">
              <div className="flex gap-3">
                <FileText aria-hidden className="h-8 w-8 shrink-0" />
                <div>
                  <p className="text-xl font-black uppercase">Source Record</p>
                  <p className="text-sm font-semibold text-black/65">Release Deck stays inside the selected source file and does not mutate listener player state.</p>
                </div>
              </div>
              <div className="border-t-2 border-black pt-3 lg:border-l-2 lg:border-t-0 lg:pl-4 lg:pt-0">
                <p className="text-xs font-black uppercase tracking-[0.12em] text-black/55">Return Paths</p>
                <div className="mt-1 flex flex-wrap gap-3 text-sm font-black">
                  <Link href="/source-dashboard" className="underline underline-offset-2">Back to Source Dashboard</Link>
                  <Link href={`/artist-bands/${activeSource.id}`} className="underline underline-offset-2">View Source Profile</Link>
                  <Link href="/registrar" className="underline underline-offset-2">Open Registrar</Link>
                </div>
              </div>
              <div className="rotate-[-6deg] border-4 border-black px-5 py-2 text-center text-xl font-black uppercase tracking-[0.08em] opacity-70">
                <p>Source File</p>
                <p className="text-xs tracking-[0.2em]">UPRISE Source Record</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
