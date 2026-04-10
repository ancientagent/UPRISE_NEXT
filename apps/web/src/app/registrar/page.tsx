'use client';

import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@uprise/ui';
import { api } from '@/lib/api';
import { useAuthStore } from '@/store/auth';
import { useOnboardingStore } from '@/store/onboarding';
import {
  buildArtistBandRegistrationPayload,
  createEmptyRegistrarArtistMember,
  normalizeArtistBandSlug,
  type RegistrarArtistMemberDraft,
  type RegistrarEntityType,
} from '@/lib/registrar/artistRegistration';
import {
  formatRegistrarEntryStatus,
  getRegistrarInviteLinks,
  getRegistrarSyncEligibleCount,
} from '@/lib/registrar/entryStatus';
import {
  dispatchArtistBandInvites,
  getPromoterCapabilityAudit,
  getPromoterRegistration,
  listArtistBandRegistrations,
  listPromoterRegistrations,
  loadArtistBandInviteStatus,
  materializeArtistBandRegistration,
  submitPromoterRegistration,
  submitArtistBandRegistration,
  syncArtistBandMembers,
  type RegistrarArtistEntry,
  type RegistrarArtistInviteStatusResponse,
  type RegistrarArtistRegistrationResult,
  type RegistrarPromoterCapabilityAuditResponse,
  type RegistrarPromoterEntry,
  type RegistrarPromoterRegistrationResult,
} from '@/lib/registrar/client';

type HomeSceneResolution = {
  id: string;
  name: string;
  city: string;
  state: string;
  musicCommunity: string;
  tier: 'city' | 'state' | 'national';
};

export default function RegistrarPage() {
  const router = useRouter();
  const { token, user } = useAuthStore();
  const { homeScene, isVisitor, tunedScene } = useOnboardingStore();

  const [selectedAction, setSelectedAction] = useState<'artist_band' | 'promoter' | null>(null);
  const [entityType, setEntityType] = useState<RegistrarEntityType>('band');
  const [name, setName] = useState('');
  const [slugInput, setSlugInput] = useState('');
  const [members, setMembers] = useState<RegistrarArtistMemberDraft[]>([createEmptyRegistrarArtistMember()]);
  const [productionName, setProductionName] = useState('');
  const [sceneId, setSceneId] = useState<string | null>(null);
  const [sceneLabel, setSceneLabel] = useState<string>('');
  const [sceneLookupError, setSceneLookupError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<RegistrarArtistRegistrationResult | null>(null);
  const [promoterSubmitSuccess, setPromoterSubmitSuccess] = useState<RegistrarPromoterRegistrationResult | null>(null);
  const [entries, setEntries] = useState<RegistrarArtistEntry[]>([]);
  const [entriesLoading, setEntriesLoading] = useState(false);
  const [entriesError, setEntriesError] = useState<string | null>(null);
  const [promoterEntries, setPromoterEntries] = useState<RegistrarPromoterEntry[]>([]);
  const [promoterEntriesLoading, setPromoterEntriesLoading] = useState(false);
  const [promoterEntriesError, setPromoterEntriesError] = useState<string | null>(null);
  const [busyEntryId, setBusyEntryId] = useState<string | null>(null);
  const [entryMessageById, setEntryMessageById] = useState<Record<string, string>>({});
  const [inviteStatusByEntryId, setInviteStatusByEntryId] = useState<Record<string, RegistrarArtistInviteStatusResponse>>(
    {},
  );
  const [promoterDetailByEntryId, setPromoterDetailByEntryId] = useState<Record<string, RegistrarPromoterEntry>>({});
  const [promoterAuditByEntryId, setPromoterAuditByEntryId] = useState<Record<string, RegistrarPromoterCapabilityAuditResponse>>(
    {},
  );

  const slugPreview = useMemo(() => normalizeArtistBandSlug(slugInput || name), [name, slugInput]);

  const gpsVerified = Boolean(user?.gpsVerified);
  const latestPromoterEntry = promoterEntries[0] ?? null;
  const eventEligibilitySummary = useMemo(() => {
    if (!token) {
      return {
        label: 'Sign in required',
        detail: 'Registrar and promoter event eligibility checks require an authenticated account.',
      };
    }

    if (!homeScene?.city || !homeScene?.state || !homeScene?.musicCommunity) {
      return {
        label: 'Home Scene required',
        detail: 'Registrar filings stay bound to your Home Scene civic identity before promoter capability can progress.',
      };
    }

    if (!gpsVerified) {
      return {
        label: 'GPS verification required',
        detail: 'Promoter registration remains blocked until your Home Scene civic verification is complete.',
      };
    }

    if (!latestPromoterEntry) {
      return {
        label: 'Promoter registration required',
        detail: 'Register a named production identity first. Event creation stays unavailable until that registrar path exists.',
      };
    }

    if (latestPromoterEntry.promoterCapability.granted) {
      return {
        label: 'Capability granted',
        detail:
          'Your promoter capability is active. Event creation remains routed through Print Shop once that write flow is published.',
      };
    }

    if (latestPromoterEntry.status === 'rejected') {
      return {
        label: 'Registration rejected',
        detail: 'Promoter capability is not active. Review the latest registrar status and resubmit when the production identity is ready.',
      };
    }

    return {
      label: 'Registrar review pending',
      detail:
        'Your promoter registration is recorded, but event creation remains locked until capability is approved and the Print Shop event write flow is live.',
    };
  }, [gpsVerified, homeScene?.city, homeScene?.musicCommunity, homeScene?.state, latestPromoterEntry, token]);
  const visitorRegistrarNotice =
    isVisitor && tunedScene?.name
      ? `You are currently visiting ${tunedScene.name}. Registrar actions still file against your Home Scene, not the scene you are visiting.`
      : null;

  const loadEntries = async () => {
    if (!token) {
      setEntries([]);
      setEntriesError(null);
      setEntriesLoading(false);
      return;
    }

    setEntriesLoading(true);
    setEntriesError(null);
    try {
      const response = await listArtistBandRegistrations(token);
      setEntries(response.entries ?? []);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unable to load registrar entries.';
      setEntriesError(message);
    } finally {
      setEntriesLoading(false);
    }
  };

  const loadPromoterEntries = async () => {
    if (!token) {
      setPromoterEntries([]);
      setPromoterEntriesError(null);
      setPromoterEntriesLoading(false);
      return;
    }

    setPromoterEntriesLoading(true);
    setPromoterEntriesError(null);
    try {
      const response = await listPromoterRegistrations(token);
      setPromoterEntries(response.entries ?? []);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unable to load promoter registrar entries.';
      setPromoterEntriesError(message);
    } finally {
      setPromoterEntriesLoading(false);
    }
  };

  useEffect(() => {
    async function resolveHomeScene() {
      if (!homeScene?.city || !homeScene?.state || !homeScene?.musicCommunity) {
        setSceneLookupError('Home Scene is required before using Registrar.');
        setSceneId(null);
        return;
      }

      try {
        const query = new URLSearchParams({
          city: homeScene.city,
          state: homeScene.state,
          musicCommunity: homeScene.musicCommunity,
        });
        const response = await api.get<HomeSceneResolution | null>(
          `/communities/resolve-home?${query.toString()}`,
          { token: token || undefined },
        );

        if (!response.data) {
          setSceneLookupError('Home Scene could not be resolved for Registrar submission.');
          setSceneId(null);
          return;
        }

        setSceneId(response.data.id);
        setSceneLabel(`${response.data.city}, ${response.data.state} • ${response.data.musicCommunity}`);
        setSceneLookupError(null);
      } catch {
        setSceneLookupError('Unable to resolve Home Scene right now. Please retry shortly.');
        setSceneId(null);
      }
    }

    resolveHomeScene();
  }, [homeScene, token]);

  useEffect(() => {
    loadEntries();
  }, [token]);

  useEffect(() => {
    loadPromoterEntries();
  }, [token]);

  const updateMember = (index: number, field: keyof RegistrarArtistMemberDraft, value: string) => {
    setMembers((current) =>
      current.map((member, memberIndex) =>
        memberIndex === index
          ? {
              ...member,
              [field]: value,
            }
          : member,
      ),
    );
  };

  const removeMember = (index: number) => {
    setMembers((current) => (current.length <= 1 ? current : current.filter((_, i) => i !== index)));
  };

  const addMember = () => {
    setMembers((current) => [...current, createEmptyRegistrarArtistMember()]);
  };

  const handleSelectAction = (action: 'artist_band' | 'promoter') => {
    setSelectedAction(action);
    setSubmitError(null);
    setSubmitSuccess(null);
    setPromoterSubmitSuccess(null);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitError(null);
    setSubmitSuccess(null);

    if (!token) {
      setSubmitError('Sign in is required to submit Registrar registration.');
      return;
    }

    if (!gpsVerified) {
      setSubmitError('GPS verification is required before Artist/Band Registrar submission.');
      return;
    }

    if (!sceneId) {
      setSubmitError(sceneLookupError || 'Home Scene resolution is required before submission.');
      return;
    }

    const payload = buildArtistBandRegistrationPayload({
      sceneId,
      name,
      slugInput,
      entityType,
      members,
    });

    if (!payload.name) {
      setSubmitError('Band or artist name is required.');
      return;
    }

    if (!payload.slug) {
      setSubmitError('Slug cannot be empty after normalization.');
      return;
    }

    if (payload.members.length === 0) {
      setSubmitError('At least one member row is required.');
      return;
    }

    const hasIncompleteMember = payload.members.some(
      (member) => !member.name || !member.email || !member.city || !member.instrument,
    );
    if (hasIncompleteMember) {
      setSubmitError('Each member row must include name, email, city, and instrument.');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await submitArtistBandRegistration(payload, token);
      setSubmitSuccess(response);
      setName('');
      setSlugInput('');
      setEntityType('band');
      setMembers([createEmptyRegistrarArtistMember()]);
      await loadEntries();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Registrar submission failed.';
      setSubmitError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePromoterSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitError(null);
    setSubmitSuccess(null);
    setPromoterSubmitSuccess(null);

    if (!token) {
      setSubmitError('Sign in is required to submit Registrar registration.');
      return;
    }

    if (!gpsVerified) {
      setSubmitError('GPS verification is required before Promoter Registrar submission.');
      return;
    }

    if (!sceneId) {
      setSubmitError(sceneLookupError || 'Home Scene resolution is required before submission.');
      return;
    }

    const trimmedProductionName = productionName.trim();
    if (!trimmedProductionName) {
      setSubmitError('Production identity is required.');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await submitPromoterRegistration(
        {
          sceneId,
          productionName: trimmedProductionName,
        },
        token,
      );
      setPromoterSubmitSuccess(response);
      setProductionName('');
      await loadPromoterEntries();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Promoter registrar submission failed.';
      setSubmitError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateEntryMessage = (entryId: string, message: string) => {
    setEntryMessageById((current) => ({
      ...current,
      [entryId]: message,
    }));
  };

  const handleMaterialize = async (entryId: string) => {
    if (!token) return;

    setBusyEntryId(entryId);
    updateEntryMessage(entryId, '');
    try {
      await materializeArtistBandRegistration(entryId, token);
      updateEntryMessage(entryId, 'Materialization complete.');
      await loadEntries();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Materialize action failed.';
      updateEntryMessage(entryId, message);
    } finally {
      setBusyEntryId(null);
    }
  };

  const handleDispatchInvites = async (entryId: string) => {
    if (!token) return;

    const links = getRegistrarInviteLinks({
      origin: typeof window !== 'undefined' ? window.location.origin : undefined,
      mobileAppUrl: process.env.NEXT_PUBLIC_MOBILE_APP_URL,
      webAppUrl: process.env.NEXT_PUBLIC_WEB_APP_URL,
    });

    setBusyEntryId(entryId);
    updateEntryMessage(entryId, '');
    try {
      const response = await dispatchArtistBandInvites(entryId, links, token);
      updateEntryMessage(entryId, `Queued invites: ${response.queuedCount ?? 0}.`);
      await loadEntries();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Invite dispatch failed.';
      updateEntryMessage(entryId, message);
    } finally {
      setBusyEntryId(null);
    }
  };

  const handleLoadInviteStatus = async (entryId: string) => {
    if (!token) return;

    setBusyEntryId(entryId);
    updateEntryMessage(entryId, '');
    try {
      const inviteStatus = await loadArtistBandInviteStatus(entryId, token);
      setInviteStatusByEntryId((current) => ({
        ...current,
        [entryId]: inviteStatus,
      }));
      updateEntryMessage(entryId, 'Invite status loaded.');
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Invite status load failed.';
      updateEntryMessage(entryId, message);
    } finally {
      setBusyEntryId(null);
    }
  };

  const handleSyncMembers = async (entryId: string) => {
    if (!token) return;

    setBusyEntryId(entryId);
    updateEntryMessage(entryId, '');
    try {
      const summary = await syncArtistBandMembers(entryId, token);
      updateEntryMessage(
        entryId,
        `Synced members: ${summary?.createdMemberCount ?? 0}/${summary?.eligibleMemberCount ?? 0} (skipped ${summary?.skippedMemberCount ?? 0}).`,
      );
      await loadEntries();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Member sync failed.';
      updateEntryMessage(entryId, message);
    } finally {
      setBusyEntryId(null);
    }
  };

  const handleLoadPromoterDetail = async (entryId: string) => {
    if (!token) return;

    setBusyEntryId(entryId);
    updateEntryMessage(entryId, '');
    try {
      const detail = await getPromoterRegistration(entryId, token);
      setPromoterDetailByEntryId((current) => ({
        ...current,
        [entryId]: detail,
      }));
      updateEntryMessage(entryId, 'Promoter detail loaded.');
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Promoter detail load failed.';
      updateEntryMessage(entryId, message);
    } finally {
      setBusyEntryId(null);
    }
  };

  const handleLoadPromoterAudit = async (entryId: string) => {
    if (!token) return;

    setBusyEntryId(entryId);
    updateEntryMessage(entryId, '');
    try {
      const audit = await getPromoterCapabilityAudit(entryId, token);
      setPromoterAuditByEntryId((current) => ({
        ...current,
        [entryId]: audit,
      }));
      updateEntryMessage(entryId, 'Capability audit loaded.');
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Capability audit load failed.';
      updateEntryMessage(entryId, message);
    } finally {
      setBusyEntryId(null);
    }
  };

  return (
    <main className="min-h-screen bg-[#f7f5ef] px-6 py-12">
      <div className="mx-auto max-w-4xl space-y-6">
        <header className="rounded-3xl border border-black/10 bg-white/80 p-8 shadow-sm">
          <p className="text-xs uppercase tracking-[0.25em] text-black/50">Registrar</p>
          <h1 className="mt-3 text-3xl font-semibold text-black">Scene Civic Activation</h1>
          <p className="mt-2 text-sm text-black/60">
            Registrar submissions are Home Scene bound and require explicit action intent.
          </p>
          <div className="mt-4">
            <Button size="sm" variant="outline" onClick={() => router.push('/plot')}>
              Back to Plot
            </Button>
          </div>
        </header>

        <section className="rounded-2xl border border-black/10 bg-white p-6">
          <h2 className="text-lg font-semibold text-black">Registration Actions</h2>
          <p className="mt-1 text-sm text-black/60">Choose a registrar action to begin.</p>
          <div className="mt-4 rounded-xl border border-black/10 bg-black/[0.02] p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-black/50">Eligibility Snapshot</p>
            <p className="mt-2 text-sm font-medium text-black">{eventEligibilitySummary.label}</p>
            <p className="mt-1 text-sm text-black/60">{eventEligibilitySummary.detail}</p>
            {visitorRegistrarNotice && (
              <p className="mt-2 text-xs text-black/50">{visitorRegistrarNotice}</p>
            )}
          </div>
          {!token && (
            <p className="mt-4 rounded-lg border border-amber-300 bg-amber-50 px-3 py-2 text-sm text-amber-900">
              Sign in is required before opening registrar submission actions.
            </p>
          )}
          <div className="mt-4">
            <Button
              variant={selectedAction === 'artist_band' ? 'default' : 'outline'}
              disabled={!token}
              onClick={() => handleSelectAction('artist_band')}
            >
              Band / Artist Registration
            </Button>
            <Button
              className="ml-2"
              variant={selectedAction === 'promoter' ? 'default' : 'outline'}
              disabled={!token}
              onClick={() => handleSelectAction('promoter')}
            >
              Promoter Registration
            </Button>
          </div>
        </section>

        {selectedAction === 'artist_band' && token && (
          <section className="rounded-2xl border border-black/10 bg-white p-6">
            <h2 className="text-lg font-semibold text-black">Artist/Band Registration Form</h2>
            <p className="mt-1 text-sm text-black/60">
              Home Scene: {sceneId ? sceneLabel : sceneLookupError || 'Resolving...'}
            </p>
            {!gpsVerified && (
              <p className="mt-2 rounded-lg border border-amber-300 bg-amber-50 px-3 py-2 text-sm text-amber-900">
                GPS verification is required before submitting Artist/Band registration.
              </p>
            )}

            <form className="mt-4 space-y-5" onSubmit={handleSubmit}>
              <div className="grid gap-4 md:grid-cols-2">
                <label className="text-sm text-black/80">
                  Band / Artist Name
                  <input
                    className="mt-1 w-full rounded-lg border border-black/20 px-3 py-2 text-sm"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    maxLength={140}
                    required
                  />
                </label>
                <label className="text-sm text-black/80">
                  Entity Type
                  <select
                    className="mt-1 w-full rounded-lg border border-black/20 px-3 py-2 text-sm"
                    value={entityType}
                    onChange={(event) => setEntityType(event.target.value as RegistrarEntityType)}
                  >
                    <option value="band">Band</option>
                    <option value="artist">Artist</option>
                  </select>
                </label>
              </div>

              <label className="block text-sm text-black/80">
                Slug (optional, auto-derived from name)
                <input
                  className="mt-1 w-full rounded-lg border border-black/20 px-3 py-2 text-sm"
                  value={slugInput}
                  onChange={(event) => setSlugInput(event.target.value)}
                  placeholder="my-band-name"
                  maxLength={140}
                />
                <span className="mt-1 block text-xs text-black/50">Normalized slug: {slugPreview || '(empty)'}</span>
              </label>

              <div>
                <h3 className="text-sm font-semibold text-black">Member Roster</h3>
                <p className="text-xs text-black/50">
                  Provide each member name, email, city, and instrument for registrar invite routing.
                </p>
                <div className="mt-3 space-y-3">
                  {members.map((member, index) => (
                    <div key={index} className="rounded-xl border border-black/15 p-3">
                      <div className="grid gap-3 md:grid-cols-2">
                        <label className="text-xs text-black/70">
                          Name
                          <input
                            className="mt-1 w-full rounded-md border border-black/20 px-2 py-1.5 text-sm"
                            value={member.name}
                            onChange={(event) => updateMember(index, 'name', event.target.value)}
                            maxLength={140}
                            required
                          />
                        </label>
                        <label className="text-xs text-black/70">
                          Email
                          <input
                            className="mt-1 w-full rounded-md border border-black/20 px-2 py-1.5 text-sm"
                            value={member.email}
                            onChange={(event) => updateMember(index, 'email', event.target.value)}
                            type="email"
                            required
                          />
                        </label>
                        <label className="text-xs text-black/70">
                          City of Residence
                          <input
                            className="mt-1 w-full rounded-md border border-black/20 px-2 py-1.5 text-sm"
                            value={member.city}
                            onChange={(event) => updateMember(index, 'city', event.target.value)}
                            maxLength={120}
                            required
                          />
                        </label>
                        <label className="text-xs text-black/70">
                          Instrument / Role
                          <input
                            className="mt-1 w-full rounded-md border border-black/20 px-2 py-1.5 text-sm"
                            value={member.instrument}
                            onChange={(event) => updateMember(index, 'instrument', event.target.value)}
                            maxLength={120}
                            required
                          />
                        </label>
                      </div>
                      <div className="mt-3 flex justify-end">
                        <Button type="button" size="sm" variant="outline" onClick={() => removeMember(index)}>
                          Remove Member
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-3">
                  <Button type="button" variant="outline" onClick={addMember}>
                    Add Member
                  </Button>
                </div>
              </div>

              {submitError && (
                <p className="rounded-lg border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700">{submitError}</p>
              )}
              {submitSuccess && (
                <p className="rounded-lg border border-emerald-300 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
                  Submission recorded (Entry {submitSuccess.id}). Members: {submitSuccess.memberCount}. Existing users:{' '}
                  {submitSuccess.existingMemberCount}. Pending invites: {submitSuccess.pendingInviteCount}.
                </p>
              )}

              <div>
                <Button type="submit" disabled={isSubmitting || !gpsVerified || !sceneId}>
                  {isSubmitting ? 'Submitting...' : 'Submit Artist/Band Registration'}
                </Button>
              </div>
            </form>
          </section>
        )}

        {selectedAction === 'promoter' && token && (
          <section className="rounded-2xl border border-black/10 bg-white p-6">
            <h2 className="text-lg font-semibold text-black">Promoter Registration Form</h2>
            <p className="mt-1 text-sm text-black/60">
              Home Scene: {sceneId ? sceneLabel : sceneLookupError || 'Resolving...'}
            </p>
            <p className="mt-1 text-sm text-black/60">
              Register the named production identity that will carry promoter capability once approved.
            </p>
            {!gpsVerified && (
              <p className="mt-2 rounded-lg border border-amber-300 bg-amber-50 px-3 py-2 text-sm text-amber-900">
                GPS verification is required before submitting Promoter registration.
              </p>
            )}

            <form className="mt-4 space-y-5" onSubmit={handlePromoterSubmit}>
              <label className="block text-sm text-black/80">
                Production Name
                <input
                  className="mt-1 w-full rounded-lg border border-black/20 px-3 py-2 text-sm"
                  value={productionName}
                  onChange={(event) => setProductionName(event.target.value)}
                  maxLength={140}
                  required
                />
                <span className="mt-1 block text-xs text-black/50">
                  This named production identity is tied to your Home Scene and does not grant promoter capability by itself.
                </span>
              </label>

              {submitError && (
                <p className="rounded-lg border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700">{submitError}</p>
              )}
              {promoterSubmitSuccess && (
                <p className="rounded-lg border border-emerald-300 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
                  Promoter submission recorded (Entry {promoterSubmitSuccess.id}) for{' '}
                  {promoterSubmitSuccess.payload.productionName ?? 'Unnamed production'}.
                </p>
              )}

              <div>
                <Button type="submit" disabled={isSubmitting || !gpsVerified || !sceneId}>
                  {isSubmitting ? 'Submitting...' : 'Submit Promoter Registration'}
                </Button>
              </div>
            </form>
          </section>
        )}

        <section className="rounded-2xl border border-black/10 bg-white p-6">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold text-black">My Artist/Band Registrations</h2>
              <p className="mt-1 text-sm text-black/60">Track registrar status and run next-step actions.</p>
            </div>
            <Button size="sm" variant="outline" onClick={loadEntries} disabled={entriesLoading}>
              {entriesLoading ? 'Refreshing...' : 'Refresh'}
            </Button>
          </div>

          {entriesError && (
            <p className="mt-4 rounded-lg border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700">{entriesError}</p>
          )}

          {!token && !entriesLoading && (
            <p className="mt-4 rounded-lg border border-amber-300 bg-amber-50 px-3 py-2 text-sm text-amber-900">
              Sign in is required to view registrar entry history and manage registrar actions.
            </p>
          )}

          {token && !entriesError && entries.length === 0 && !entriesLoading && (
            <p className="mt-4 text-sm text-black/60">No Artist/Band registrar entries yet.</p>
          )}

          <div className="mt-4 space-y-4">
            {entries.map((entry) => {
              const inviteStatus = inviteStatusByEntryId[entry.id];
              const isBusy = busyEntryId === entry.id;
              const syncEligibleCount = getRegistrarSyncEligibleCount({
                existingUserCount: entry.existingUserCount,
                claimedCount: entry.claimedCount,
              });

              return (
                <article key={entry.id} className="rounded-xl border border-black/15 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-black/50">{formatRegistrarEntryStatus(entry.status)}</p>
                  <h3 className="mt-2 text-base font-semibold text-black">{entry.payload.name ?? 'Unnamed registration'}</h3>
                  <p className="text-sm text-black/60">
                    {entry.scene.city}, {entry.scene.state} • {entry.scene.musicCommunity}
                  </p>
                  <p className="mt-1 text-xs text-black/50">
                    Entry {entry.id} • members {entry.memberCount} • pending {entry.pendingInviteCount} • queued{' '}
                    {entry.queuedInviteCount} • claimed {entry.claimedCount} • existing {entry.existingUserCount}
                  </p>
                  {entry.artistBand && (
                    <p className="mt-1 text-xs text-black/50">
                      Materialized: {entry.artistBand.name} ({entry.artistBand.slug})
                    </p>
                  )}

                  <div className="mt-3 flex flex-wrap gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleMaterialize(entry.id)}
                      disabled={isBusy || Boolean(entry.artistBandId)}
                    >
                      {entry.artistBandId ? 'Already Materialized' : 'Materialize Entity'}
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleDispatchInvites(entry.id)} disabled={isBusy}>
                      Queue Member Invites
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleSyncMembers(entry.id)}
                      disabled={isBusy || !entry.artistBandId || syncEligibleCount === 0}
                    >
                      Sync Eligible Members ({syncEligibleCount})
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleLoadInviteStatus(entry.id)} disabled={isBusy}>
                      Load Invite Status
                    </Button>
                  </div>

                  {entryMessageById[entry.id] && (
                    <p className="mt-3 rounded-lg border border-black/10 bg-black/[0.03] px-3 py-2 text-xs text-black/70">
                      {entryMessageById[entry.id]}
                    </p>
                  )}

                  {inviteStatus && (
                    <div className="mt-3 rounded-lg border border-black/10 bg-black/[0.02] p-3">
                      <p className="text-xs text-black/70">Invite Status Summary</p>
                      <p className="mt-1 text-xs text-black/60">
                        Total members: {inviteStatus.totalMembers} • queued: {inviteStatus.countsByStatus.queued ?? 0} •
                        claimed: {inviteStatus.countsByStatus.claimed ?? 0} • pending:{' '}
                        {inviteStatus.countsByStatus.pending_email ?? 0}
                      </p>
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        </section>

        <section className="rounded-2xl border border-black/10 bg-white p-6">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold text-black">My Promoter Registrations</h2>
              <p className="mt-1 text-sm text-black/60">Track production identity status and promoter capability progress.</p>
            </div>
            <Button size="sm" variant="outline" onClick={loadPromoterEntries} disabled={promoterEntriesLoading}>
              {promoterEntriesLoading ? 'Refreshing...' : 'Refresh'}
            </Button>
          </div>

          {promoterEntriesError && (
            <p className="mt-4 rounded-lg border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700">
              {promoterEntriesError}
            </p>
          )}

          {!token && !promoterEntriesLoading && (
            <p className="mt-4 rounded-lg border border-amber-300 bg-amber-50 px-3 py-2 text-sm text-amber-900">
              Sign in is required to view promoter registrar history and capability status.
            </p>
          )}

          {token && !promoterEntriesError && promoterEntries.length === 0 && !promoterEntriesLoading && (
            <p className="mt-4 text-sm text-black/60">No promoter registrar entries yet.</p>
          )}

          <div className="mt-4 space-y-4">
            {promoterEntries.map((entry) => {
              const isBusy = busyEntryId === entry.id;
              const detail = promoterDetailByEntryId[entry.id];
              const audit = promoterAuditByEntryId[entry.id];

              return (
                <article key={entry.id} className="rounded-xl border border-black/15 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-black/50">{formatRegistrarEntryStatus(entry.status)}</p>
                  <h3 className="mt-2 text-base font-semibold text-black">
                    {entry.payload.productionName ?? 'Unnamed production'}
                  </h3>
                  {entry.scene && (
                    <p className="text-sm text-black/60">
                      {entry.scene.city}, {entry.scene.state} • {entry.scene.musicCommunity}
                    </p>
                  )}
                  <p className="mt-1 text-xs text-black/50">
                    Entry {entry.id} • codes issued {entry.promoterCapability.codeIssuedCount} • latest code status{' '}
                    {entry.promoterCapability.latestCodeStatus ?? 'none'} • capability granted{' '}
                    {entry.promoterCapability.granted ? 'yes' : 'no'}
                  </p>

                  <div className="mt-3 flex flex-wrap gap-2">
                    <Button size="sm" variant="outline" onClick={() => handleLoadPromoterDetail(entry.id)} disabled={isBusy}>
                      Load Registration Detail
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleLoadPromoterAudit(entry.id)} disabled={isBusy}>
                      Load Capability Audit
                    </Button>
                  </div>

                  {entryMessageById[entry.id] && (
                    <p className="mt-3 rounded-lg border border-black/10 bg-black/[0.03] px-3 py-2 text-xs text-black/70">
                      {entryMessageById[entry.id]}
                    </p>
                  )}

                  {detail && (
                    <div className="mt-3 rounded-lg border border-black/10 bg-black/[0.02] p-3">
                      <p className="text-xs text-black/70">Registration Detail</p>
                      <p className="mt-1 text-xs text-black/60">
                        Production: {detail.payload.productionName ?? 'Unnamed'} • latest code issued:{' '}
                        {detail.promoterCapability.latestCodeIssuedAt ?? 'none'} • latest code redeemed:{' '}
                        {detail.promoterCapability.latestCodeRedeemedAt ?? 'none'}
                      </p>
                    </div>
                  )}

                  {audit && (
                    <div className="mt-3 rounded-lg border border-black/10 bg-black/[0.02] p-3">
                      <p className="text-xs text-black/70">Capability Audit</p>
                      <p className="mt-1 text-xs text-black/60">
                        Events: {audit.total} • latest action: {audit.events[0]?.action ?? 'none'}
                      </p>
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        </section>
      </div>
    </main>
  );
}
