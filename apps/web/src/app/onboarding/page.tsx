'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@uprise/ui';
import { api } from '@/lib/api';
import { MUSIC_COMMUNITIES } from '@/data/music-communities';
import { US_STATES } from '@/data/us-states';
import {
  formatHomeSceneLabel,
  normalizeApprovedMusicCommunitySelection,
  resolveOnboardingReviewState,
  type OnboardingReviewResolutionMode,
} from '@/lib/onboarding/review-resolution';
import { useOnboardingStore } from '@/store/onboarding';
import { useAuthStore } from '@/store/auth';

const steps = ['Scene Details', 'Review'];

interface ReverseGeocodeResponse {
  city: string | null;
  state: string | null;
  formattedAddress: string | null;
}

interface ReverseGeocodeFallbackResponse {
  city?: string;
  locality?: string;
  principalSubdivision?: string;
  principalSubdivisionCode?: string;
}

export default function OnboardingPage() {
  const router = useRouter();
  const {
    homeScene,
    votingEligible,
    gpsReason,
    setHomeScene,
    setPioneerFollowUp,
    setGpsStatus,
    setVotingEligibility,
    setDiscoveryContext,
  } =
    useOnboardingStore();
  const { token } = useAuthStore();
  const [step, setStep] = useState(0);
  const [city, setCity] = useState(homeScene?.city ?? '');
  const [state, setState] = useState(homeScene?.state ?? '');
  const [musicCommunity, setMusicCommunity] = useState(
    normalizeApprovedMusicCommunitySelection(homeScene?.musicCommunity),
  );
  const [gpsError, setGpsError] = useState<string | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);
  const [showGpsPrompt, setShowGpsPrompt] = useState(true);
  const [manualLocationMode, setManualLocationMode] = useState(!(homeScene?.city && homeScene?.state));
  const [citySuggestions, setCitySuggestions] = useState<string[]>([]);
  const [cityLoading, setCityLoading] = useState(false);
  const [cityError, setCityError] = useState<string | null>(null);
  const [isPioneer, setIsPioneer] = useState(false);
  const [stateSceneOptions, setStateSceneOptions] = useState<string[]>([]);
  const [stateSceneError, setStateSceneError] = useState<string | null>(null);
  const [reviewSceneLabel, setReviewSceneLabel] = useState<string | null>(null);
  const [reviewResolutionMode, setReviewResolutionMode] =
    useState<OnboardingReviewResolutionMode | null>(null);

  const approvedMusicCommunity = useMemo(
    () => normalizeApprovedMusicCommunitySelection(musicCommunity),
    [musicCommunity],
  );
  const selectedHomeSceneLabel = useMemo(
    () =>
      formatHomeSceneLabel(
        city.trim() && state.trim() && approvedMusicCommunity
          ? { city: city.trim(), state: state.trim(), musicCommunity: approvedMusicCommunity }
          : homeScene,
      ),
    [approvedMusicCommunity, city, homeScene, state],
  );

  const canContinue = useMemo(
    () => city.trim() && state.trim() && approvedMusicCommunity,
    [approvedMusicCommunity, city, state],
  );

  const handleSceneContinue = async () => {
    if (!canContinue) return;

    const selection = {
      city: city.trim(),
      state: state.trim(),
      musicCommunity: approvedMusicCommunity,
    };

    setHomeScene(selection);
    setPioneerFollowUp(null);
    setIsPioneer(false);
    setStateSceneOptions([]);
    setStateSceneError(null);
    setReviewSceneLabel(null);
    setReviewResolutionMode(null);
    setDiscoveryContext({
      tunedSceneId: null,
      tunedScene: null,
      isVisitor: null,
    });

    let authenticatedPioneer: boolean | null = null;

    if (token) {
      try {
        const response = await api.post<{ pioneer?: boolean; sceneId?: string | null }>('/onboarding/home-scene', selection, { token });
        authenticatedPioneer = response.data?.pioneer === undefined ? null : Boolean(response.data.pioneer);
      } catch {
        // Keep local state if API request fails.
      }
    }

    try {
      const reviewResolution = await resolveOnboardingReviewState(selection, token || undefined);
      const pioneer = authenticatedPioneer ?? reviewResolution.pioneer;

      setIsPioneer(pioneer);
      setPioneerFollowUp(pioneer ? { homeScene: selection } : null);
      setReviewResolutionMode(pioneer ? reviewResolution.resolutionMode : 'exact');
      setReviewSceneLabel(
        pioneer
          ? reviewResolution.resolvedSceneLabel
          : reviewResolution.resolvedSceneLabel ?? formatHomeSceneLabel(selection),
      );
      setStateSceneOptions(reviewResolution.stateSceneOptions);

      if (reviewResolution.discoveryContext) {
        setDiscoveryContext(reviewResolution.discoveryContext);
      }

      if (pioneer && reviewResolution.resolutionMode === 'unresolved') {
        setStateSceneError('Could not resolve active fallback scene details right now.');
      }
    } catch {
      const pioneer = Boolean(authenticatedPioneer);
      setIsPioneer(pioneer);
      setPioneerFollowUp(pioneer ? { homeScene: selection } : null);
      setReviewResolutionMode(pioneer ? 'unresolved' : 'exact');
      setReviewSceneLabel(pioneer ? null : formatHomeSceneLabel(selection));

      if (pioneer) {
        setStateSceneError('Could not resolve active fallback scene details right now.');
      }
    }

    setStep(1);
  };

  const reverseGeocodeWithFallback = async (
    latitude: number,
    longitude: number,
  ): Promise<ReverseGeocodeResponse | null> => {
    try {
      const locationResponse = await api.get<ReverseGeocodeResponse>(
        `/places/reverse?latitude=${latitude}&longitude=${longitude}&country=US`,
      );
      if (locationResponse.data?.city && locationResponse.data?.state) {
        return locationResponse.data;
      }
    } catch {
      // Fall through to public fallback provider.
    }

    try {
      const fallbackResponse = await fetch(
        `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`,
      );
      if (!fallbackResponse.ok) return null;

      const fallbackData = (await fallbackResponse.json()) as ReverseGeocodeFallbackResponse;
      const city = fallbackData.city ?? fallbackData.locality ?? null;
      const state =
        fallbackData.principalSubdivisionCode?.split('-').pop() ??
        fallbackData.principalSubdivision ??
        null;

      if (!city || !state) return null;

      return {
        city,
        state,
        formattedAddress: null,
      };
    } catch {
      return null;
    }
  };

  const handleGpsRequest = async () => {
    setGpsError(null);
    setLocationError(null);

    if (!navigator.geolocation) {
      setGpsStatus('denied');
      setVotingEligibility(false, 'GPS is not available on this device.');
      setGpsError('GPS is not available on this device. You can still continue without voting access.');
      setManualLocationMode(true);
      return;
    }

    setIsDetectingLocation(true);

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        setGpsStatus('granted', { latitude: pos.coords.latitude, longitude: pos.coords.longitude });

        if (token) {
          try {
            const response = await api.post<{
              id: string;
              gpsVerified: boolean;
              votingEligible: boolean;
              reason?: string | null;
            }>(
              '/onboarding/gps-verify',
              { latitude: pos.coords.latitude, longitude: pos.coords.longitude },
              { token },
            );

            if (response.data?.votingEligible) {
              setVotingEligibility(true, null);
            } else {
              setVotingEligibility(false, response.data?.reason ?? 'GPS did not verify for voting.');
              setGpsError('GPS did not verify for voting. You can still continue without voting access.');
            }
          } catch {
            setVotingEligibility(false, 'GPS request failed.');
            setGpsError('GPS could not be completed. You can still continue without voting access.');
          }
        } else {
          setVotingEligibility(false, 'Sign in to verify voting access.');
        }

        const detected = await reverseGeocodeWithFallback(pos.coords.latitude, pos.coords.longitude);
        if (detected?.city && detected?.state) {
          setCity(detected.city);
          setState(detected.state);
          setManualLocationMode(false);
        } else {
          setManualLocationMode(true);
          setLocationError('Location detection failed. Enter your city/state manually to continue.');
        }
        setIsDetectingLocation(false);
      },
      () => {
        setGpsStatus('denied');
        setVotingEligibility(false, 'GPS permission denied.');
        setGpsError('GPS permission was denied. You can continue without voting access.');
        setLocationError('Enter your city/state manually to set your Home Scene.');
        setManualLocationMode(true);
        setIsDetectingLocation(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
      },
    );
  };

  const handleSkipGps = () => {
    setGpsStatus('denied');
    setVotingEligibility(false, 'Skipped GPS.');
    setLocationError('You can continue by entering your city/state manually.');
    setManualLocationMode(true);
  };

  const handleGpsPromptEnable = () => {
    setShowGpsPrompt(false);
    void handleGpsRequest();
  };

  const handleGpsPromptDeny = () => {
    setShowGpsPrompt(false);
    handleSkipGps();
  };

  const handleFinish = () => {
    router.push('/plot');
  };

  const fetchCitySuggestions = async (input: string, stateValue: string) => {
    if (!input.trim()) {
      setCitySuggestions([]);
      return;
    }

    try {
      setCityLoading(true);
      setCityError(null);
      const response = await api.get<{ description: string }[]>(
        `/places/cities?input=${encodeURIComponent(input)}&country=us`,
      );
      const suggestions = response.data?.map((item) => item.description) ?? [];
      const filtered = stateValue
        ? suggestions.filter((suggestion) => suggestion.toLowerCase().includes(stateValue.toLowerCase()))
        : suggestions;
      setCitySuggestions(filtered.slice(0, 8));
    } catch {
      setCityError('City suggestions are unavailable right now.');
    } finally {
      setCityLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_#f2efe8_0%,_#f6f6f6_45%,_#e6eef7_100%)] px-6 py-16">
      <div className="mx-auto max-w-3xl">
        <>
        <div className="mb-10 flex flex-wrap items-center gap-3">
          {steps.map((label, index) => (
            <div key={label} className="flex items-center gap-3">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold ${
                  index <= step ? 'bg-black text-white' : 'bg-black/10 text-black/50'
                }`}
              >
                {index + 1}
              </div>
              <span className={`text-sm ${index <= step ? 'text-black' : 'text-black/40'}`}>{label}</span>
              {index < steps.length - 1 && <span className="h-px w-8 bg-black/10" />}
            </div>
          ))}
        </div>

        {step === 0 && (
          <section className="rounded-3xl border border-black/10 bg-white/80 p-8 shadow-sm">
            <h1 className="text-2xl font-semibold leading-tight text-black sm:text-3xl">Join Your Home Scene</h1>
            <p className="mt-2 text-sm text-black/60">
              Your Home Scene is your local music scene of choice. If you don&apos;t have one, select a music community you are most interested in exploring.
            </p>

            {showGpsPrompt && (
              <div className="mt-5 rounded-2xl border border-black/10 bg-black/[0.03] p-4">
                <p className="text-sm font-medium text-black">Allow UPRISE to use GPS to verify location?</p>
                <p className="mt-1 text-xs text-black/60">
                  Verification is required in order to vote in your Home Scene.
                </p>
                <p className="mt-1 text-xs text-black/60">
                  Your GPS data will not be used by any third party.
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <Button size="sm" disabled={isDetectingLocation} onClick={handleGpsPromptEnable}>
                    {isDetectingLocation ? 'Detecting location...' : 'OK'}
                  </Button>
                  <Button size="sm" variant="outline" onClick={handleGpsPromptDeny}>
                    Deny
                  </Button>
                </div>
              </div>
            )}

            {locationError && (
              <div className="mt-4">
                <p className="text-sm text-black/70">{locationError}</p>
                <div className="mt-2 flex gap-2">
                  <Button size="sm" variant="outline" disabled={isDetectingLocation} onClick={handleGpsRequest}>
                    {isDetectingLocation ? 'Detecting location...' : 'Retry GPS'}
                  </Button>
                </div>
              </div>
            )}

            {!manualLocationMode && city.trim() && state.trim() ? (
              <div className="mt-6 rounded-2xl border border-black/10 bg-black/5 p-4 text-sm text-black/70">
                <p className="text-xs uppercase tracking-[0.2em] text-black/50">Detected location</p>
                <p className="mt-2 text-base text-black">
                  {city}, {state}
                </p>
                <Button size="sm" variant="outline" className="mt-3" onClick={() => setManualLocationMode(true)}>
                  Edit city/state
                </Button>
              </div>
            ) : (
              <div className="mt-8 grid gap-4 md:grid-cols-2">
                <div className="flex flex-col gap-2">
                  <label className="text-xs uppercase tracking-[0.2em] text-black/60">City</label>
                  <input
                    list="cities"
                    value={city}
                    onChange={(event) => {
                      const value = event.target.value;
                      setCity(value);
                      fetchCitySuggestions(value, state);
                    }}
                    className="rounded-xl border border-black/10 bg-white px-4 py-3 text-sm shadow-sm"
                    placeholder="Start typing your city"
                  />
                  <datalist id="cities">
                    {citySuggestions.map((suggestion) => (
                      <option key={suggestion} value={suggestion} />
                    ))}
                  </datalist>
                  {cityLoading && <p className="text-xs text-black/50">Loading city suggestions...</p>}
                  {cityError && <p className="text-xs text-red-600">{cityError}</p>}
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-xs uppercase tracking-[0.2em] text-black/60">State</label>
                  <input
                    list="states"
                    value={state}
                    onChange={(event) => setState(event.target.value)}
                    className="rounded-xl border border-black/10 bg-white px-4 py-3 text-sm shadow-sm"
                    placeholder="Select your state"
                  />
                  <datalist id="states">
                    {US_STATES.map((name) => (
                      <option key={name} value={name} />
                    ))}
                  </datalist>
                </div>
              </div>
            )}

            <div className="mt-6 flex flex-col gap-2">
              <label className="text-xs uppercase tracking-[0.2em] text-black/60">Music Community</label>
              <select
                value={musicCommunity}
                onChange={(event) => setMusicCommunity(event.target.value)}
                className="rounded-xl border border-black/10 bg-white px-4 py-3 text-sm shadow-sm"
              >
                <option value="">Select an approved parent music community</option>
                {MUSIC_COMMUNITIES.map((community) => (
                  <option key={community} value={community} />
                ))}
              </select>
              <p className="text-xs text-black/50">
                Selection only from the approved parent communities. If your city is not active yet, we will preserve your pioneer intent and show the active fallback scene review.
              </p>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Button size="lg" disabled={!canContinue} onClick={handleSceneContinue}>
                Continue
              </Button>
            </div>
          </section>
        )}

        {step === 1 && (
          <section className="rounded-3xl border border-black/10 bg-white/80 p-8 shadow-sm">
            <h1 className="text-2xl font-semibold leading-tight text-black sm:text-3xl">Review your setup</h1>
            <p className="mt-2 text-sm text-black/60">
              You can edit this later, but your Home Scene anchors your participation.
            </p>

            <div className="mt-6 space-y-4">
              <div className="rounded-2xl border border-black/10 bg-white p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-black/50">Home Scene</p>
                <p className="mt-2 text-base text-black">
                  {selectedHomeSceneLabel}
                </p>
              </div>

              <div className="rounded-2xl border border-black/10 bg-white p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-black/50">
                  {isPioneer ? 'Fallback listening scene' : 'Listening scene'}
                </p>
                <p className="mt-2 text-base text-black">
                  {reviewSceneLabel ?? 'Active scene review is unavailable right now.'}
                </p>
                <p className="mt-1 text-sm text-black/60">
                  {isPioneer
                    ? reviewSceneLabel
                      ? `${selectedHomeSceneLabel} stays saved as your Home Scene pioneer intent while this active city scene carries your initial listening context.`
                      : `${selectedHomeSceneLabel} stays saved as your Home Scene pioneer intent while active fallback details are unavailable.`
                    : 'Your selected Home Scene is active and will anchor your first session.'}
                </p>
              </div>

              <div className="rounded-2xl border border-black/10 bg-white p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-black/50">Voting Eligibility</p>
                <p className="mt-2 text-base text-black">{votingEligible ? 'Enabled (GPS verified)' : 'Not enabled'}</p>
                <p className="mt-1 text-sm text-black/60">Voting is the only action gated by GPS.</p>
                {!votingEligible && (gpsError || gpsReason) && <p className="mt-2 text-sm text-black/50">{gpsError ?? gpsReason}</p>}
              </div>

              {isPioneer && (
                <div className="rounded-2xl border border-black/10 bg-white p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-black/50">Pioneer status</p>
                  <p className="mt-2 text-base text-black">
                    Your selected city is not active yet. We will keep tracking your Home Scene intent while routing you through an active scene for this parent community.
                  </p>
                  {reviewResolutionMode === 'fallback_state' && (
                    <p className="mt-2 text-sm text-black/60">
                      Active fallback currently resolves inside {state.trim()}.
                    </p>
                  )}
                  {reviewResolutionMode === 'fallback_community' && (
                    <p className="mt-2 text-sm text-black/60">
                      No active city scene was found in {state.trim()}, so review falls back to the next active city scene for {approvedMusicCommunity}.
                    </p>
                  )}
                  {stateSceneOptions.length > 0 && (
                    <p className="mt-2 text-sm text-black/60">
                      Active scenes in {state.trim()}: {stateSceneOptions.join(' · ')}
                    </p>
                  )}
                  {stateSceneError && <p className="mt-2 text-sm text-black/50">{stateSceneError}</p>}
                </div>
              )}
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <Button size="lg" onClick={handleFinish}>
                Enter The Plot
              </Button>
              <Button size="lg" variant="outline" onClick={() => setStep(0)}>
                Edit Home Scene
              </Button>
            </div>
          </section>
        )}
        </>
      </div>
    </main>
  );
}
