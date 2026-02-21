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

type HomeSceneResolution = {
  id: string;
  name: string;
  city: string;
  state: string;
  musicCommunity: string;
  tier: 'city' | 'state' | 'national';
};

type RegistrationSubmitResult = {
  id: string;
  memberCount: number;
  pendingInviteCount: number;
  existingMemberCount: number;
};

export default function RegistrarPage() {
  const router = useRouter();
  const { token, user } = useAuthStore();
  const { homeScene } = useOnboardingStore();

  const [selectedAction, setSelectedAction] = useState<'artist_band' | null>(null);
  const [entityType, setEntityType] = useState<RegistrarEntityType>('band');
  const [name, setName] = useState('');
  const [slugInput, setSlugInput] = useState('');
  const [members, setMembers] = useState<RegistrarArtistMemberDraft[]>([createEmptyRegistrarArtistMember()]);
  const [sceneId, setSceneId] = useState<string | null>(null);
  const [sceneLabel, setSceneLabel] = useState<string>('');
  const [sceneLookupError, setSceneLookupError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<RegistrationSubmitResult | null>(null);

  const slugPreview = useMemo(() => normalizeArtistBandSlug(slugInput || name), [name, slugInput]);

  const gpsVerified = Boolean(user?.gpsVerified);

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
      const response = await api.post<RegistrationSubmitResult>('/registrar/artist', payload, { token });
      if (!response.data) {
        throw new Error('Registrar submission returned no data.');
      }
      setSubmitSuccess(response.data);
      setName('');
      setSlugInput('');
      setEntityType('band');
      setMembers([createEmptyRegistrarArtistMember()]);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Registrar submission failed.';
      setSubmitError(message);
    } finally {
      setIsSubmitting(false);
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
          <div className="mt-4">
            <Button
              variant={selectedAction === 'artist_band' ? 'default' : 'outline'}
              onClick={() => setSelectedAction('artist_band')}
            >
              Band / Artist Registration
            </Button>
          </div>
        </section>

        {selectedAction === 'artist_band' && (
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
      </div>
    </main>
  );
}
