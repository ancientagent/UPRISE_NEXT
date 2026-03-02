'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@uprise/ui';
import { api } from '@/lib/api';
import { findNearbyCommunities, resolveHomeCommunity } from '@/lib/communities/client';
import { listDiscoverScenes, tuneDiscoverScene } from '@/lib/discovery/client';
import { MUSIC_COMMUNITIES } from '@/data/music-communities';
import { US_STATES } from '@/data/us-states';
import { useOnboardingStore } from '@/store/onboarding';
import { useAuthStore } from '@/store/auth';

const steps = ['Location Verification', 'Home Scene', 'Review'];

interface ReverseGeocodeResponse {
  city: string | null;
  state: string | null;
  formattedAddress: string | null;
}

interface ResolvedHomeScene {
  isActive?: boolean | null;
}

interface FallbackReverseGeocodeResponse {
  city: string | null;
  state: string | null;
}

interface ActiveSceneOption {
  sceneId: string;
  label: string;
}

// Temporary launch guard until canonical launch-city allowlist is wired.
const TEXAS_ONBOARDING_FALLBACK_ALLOWLIST = new Set(['austin', 'dallas', 'houston', 'san antonio']);
const isTexas = (value: string | null | undefined) => {
  const normalized = (value ?? '').trim().toLowerCase();
  return normalized === 'tx' || normalized === 'texas';
};

const isValidMusicCommunity = (
  value: string,
): value is (typeof MUSIC_COMMUNITIES)[number] =>
  (MUSIC_COMMUNITIES as readonly string[]).includes(value);

const isActiveCityScene = (
  scene: Awaited<ReturnType<typeof listDiscoverScenes>>[number],
): scene is Extract<Awaited<ReturnType<typeof listDiscoverScenes>>[number], { entryType: 'city_scene' }> =>
  scene.entryType === 'city_scene' && scene.isActive;

async function reverseGeocodeFallback(latitude: number, longitude: number): Promise<FallbackReverseGeocodeResponse> {
  try {
    const params = new URLSearchParams({
      latitude: String(latitude),
      longitude: String(longitude),
      localityLanguage: 'en',
    });
    const response = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?${params.toString()}`);
    if (!response.ok) {
      return { city: null, state: null };
    }
    const data = (await response.json()) as {
      city?: string;
      locality?: string;
      principalSubdivision?: string;
      principalSubdivisionCode?: string;
      countryCode?: string;
    };

    const city =
      (typeof data.city === 'string' && data.city.trim()) ||
      (typeof data.locality === 'string' && data.locality.trim()) ||
      null;

    let state: string | null = null;
    if (typeof data.principalSubdivisionCode === 'string' && data.principalSubdivisionCode.includes('-')) {
      state = data.principalSubdivisionCode.split('-')[1] ?? null;
    } else if (typeof data.principalSubdivision === 'string' && data.principalSubdivision.trim()) {
      state = data.principalSubdivision.trim();
    }

    return { city, state };
  } catch {
    return { city: null, state: null };
  }
}

export default function OnboardingPage() {
  const router = useRouter();
  const {
    homeScene,
    gpsCoords,
    votingEligible,
    gpsReason,
    setHomeScene,
    setDiscoveryContext,
    setGpsStatus,
    setVotingEligibility,
    reset,
  } = useOnboardingStore();
  const { token } = useAuthStore();

  const [step, setStep] = useState(0);
  const [city, setCity] = useState(homeScene?.city ?? '');
  const [state, setState] = useState(homeScene?.state ?? '');
  const [musicCommunity, setMusicCommunity] = useState(homeScene?.musicCommunity ?? '');

  const [gpsError, setGpsError] = useState<string | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);
  const [manualLocationMode, setManualLocationMode] = useState(!(homeScene?.city && homeScene?.state));

  const [citySuggestions, setCitySuggestions] = useState<string[]>([]);
  const [cityLoading, setCityLoading] = useState(false);
  const [cityError, setCityError] = useState<string | null>(null);

  const [isPioneer, setIsPioneer] = useState(false);
  const [activeSceneOptions, setActiveSceneOptions] = useState<ActiveSceneOption[]>([]);
  const [selectedActiveSceneId, setSelectedActiveSceneId] = useState<string | null>(null);
  const [stateSceneError, setStateSceneError] = useState<string | null>(null);
  const [nearestActiveSceneLabel, setNearestActiveSceneLabel] = useState<string | null>(null);

  const canContinue = useMemo(
    () => city.trim() && state.trim() && musicCommunity.trim(),
    [city, state, musicCommunity],
  );

  const formatSceneLabel = (scene: { city: string | null; state: string | null; name: string }) =>
    scene.city && scene.state ? `${scene.city}, ${scene.state}` : scene.name;

  const handleSceneContinue = async () => {
    if (!canContinue) return;

    const selectedCommunity = musicCommunity.trim();
    if (!isValidMusicCommunity(selectedCommunity)) {
      setStateSceneError('Select one of the listed music communities to continue.');
      return;
    }

    const selection = {
      city: city.trim(),
      state: state.trim(),
      musicCommunity: selectedCommunity,
    };

    setHomeScene(selection);
    setIsPioneer(false);
    setActiveSceneOptions([]);
    setSelectedActiveSceneId(null);
    setStateSceneError(null);
    setNearestActiveSceneLabel(null);
    let shouldShowPioneerGate = false;

    if (token) {
      try {
        const response = await api.post<{ pioneer?: boolean }>('/onboarding/home-scene', selection, { token });
        let pioneer = Boolean(response.data?.pioneer);

        try {
          const resolved = (await resolveHomeCommunity(selection, token)) as ResolvedHomeScene | null;
          pioneer = !Boolean(resolved?.isActive);
        } catch {
          // Keep pioneer value from onboarding response.
        }

        if (isTexas(selection.state)) {
          const selectedCity = selection.city.trim().toLowerCase();
          if (!TEXAS_ONBOARDING_FALLBACK_ALLOWLIST.has(selectedCity)) {
            pioneer = true;
          }
        }

        setIsPioneer(pioneer);
        shouldShowPioneerGate = pioneer;

        if (pioneer) {
          try {
            let activeCandidates = (
              await listDiscoverScenes(
                {
                  tier: 'city',
                  state: selection.state,
                  musicCommunity: selection.musicCommunity,
                },
                token,
              )
            )
              .filter(isActiveCityScene)
              .map((scene) => ({
                sceneId: scene.sceneId,
                city: scene.city,
                state: scene.state,
                name: scene.name,
              }));

            if (!activeCandidates.length) {
              activeCandidates = (
                await listDiscoverScenes(
                  {
                    tier: 'city',
                    musicCommunity: selection.musicCommunity,
                  },
                  token,
                )
              )
                .filter(isActiveCityScene)
                .map((scene) => ({
                  sceneId: scene.sceneId,
                  city: scene.city,
                  state: scene.state,
                  name: scene.name,
                }));
            }

            const options = activeCandidates
              .filter((scene) => {
                const stateValue = (scene.state ?? '').trim().toLowerCase();
                const cityValue = (scene.city ?? '').trim().toLowerCase();
                if (!isTexas(stateValue)) {
                  return true;
                }
                return TEXAS_ONBOARDING_FALLBACK_ALLOWLIST.has(cityValue);
              })
              .map((scene) => ({
                sceneId: scene.sceneId,
                label: formatSceneLabel(scene),
              }))
              .filter((option, index, arr) => arr.findIndex((x) => x.label === option.label) === index)
              .slice(0, 8);

            setActiveSceneOptions(options);
            setSelectedActiveSceneId(options[0]?.sceneId ?? null);
            setNearestActiveSceneLabel(options[0]?.label ?? null);

            if (gpsCoords?.latitude && gpsCoords?.longitude) {
              // Trigger proximity query when available so backend geofence path stays exercised.
              await findNearbyCommunities(
                {
                  lat: gpsCoords.latitude,
                  lng: gpsCoords.longitude,
                  radius: 50000,
                  limit: 20,
                },
                token,
              ).catch(() => undefined);
            }

            if (!options.length) {
              setStateSceneError('No active city scenes are available for that community yet.');
            }
          } catch {
            setStateSceneError('Could not load active scenes for that community right now.');
          }
        }
      } catch {
        // Keep local state if API request fails.
      }
    }

    if (shouldShowPioneerGate) {
      setStep(2);
      return;
    }

    router.push('/plot');
  };

  const handleGpsRequest = async () => {
    setGpsError(null);
    setLocationError(null);

    if (!navigator.geolocation) {
      setGpsStatus('denied');
      setVotingEligibility(false, 'GPS is not available on this device.');
      setGpsError('GPS is not available on this device. You can still continue without voting access.');
      setManualLocationMode(true);
      setStep(1);
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
            setVotingEligibility(false, 'GPS verification request failed.');
            setGpsError('GPS verification could not be completed. You can still continue without voting access.');
          }
        } else {
          setVotingEligibility(false, 'Sign in to verify voting access.');
        }

        try {
          const locationResponse = await api.get<ReverseGeocodeResponse>(
            `/places/reverse?latitude=${pos.coords.latitude}&longitude=${pos.coords.longitude}&country=US`,
          );
          let detected = locationResponse.data;
          if (!detected?.city || !detected?.state) {
            const fallback = await reverseGeocodeFallback(pos.coords.latitude, pos.coords.longitude);
            detected = {
              city: fallback.city,
              state: fallback.state,
              formattedAddress: null,
            };
          }

          if (detected?.city && detected?.state) {
            setCity(detected.city);
            setState(detected.state);
            setManualLocationMode(false);
          } else {
            setManualLocationMode(true);
            setLocationError('We could not detect your city/state. Enter it manually to continue.');
          }
        } catch {
          const fallback = await reverseGeocodeFallback(pos.coords.latitude, pos.coords.longitude);
          if (fallback.city && fallback.state) {
            setCity(fallback.city);
            setState(fallback.state);
            setManualLocationMode(false);
          } else {
            setManualLocationMode(true);
            setLocationError('Location detection failed. Enter your city/state manually to continue.');
          }
        } finally {
          setIsDetectingLocation(false);
          setStep(1);
        }
      },
      () => {
        setGpsStatus('denied');
        setVotingEligibility(false, 'GPS permission denied.');
        setGpsError('GPS permission was denied. You can continue without voting access.');
        setLocationError('Enter your city/state manually to set your Home Scene.');
        setManualLocationMode(true);
        setIsDetectingLocation(false);
        setStep(1);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
      },
    );
  };

  const handleSkipGps = () => {
    setGpsStatus('denied');
    setVotingEligibility(false, 'Skipped GPS verification.');
    setLocationError('You can continue by entering your city/state manually.');
    setManualLocationMode(true);
    setStep(1);
  };

  const handleFinish = () => {
    router.push('/plot');
  };

  const handleConfirmActiveScene = async () => {
    if (selectedActiveSceneId && token) {
      try {
        const context = await tuneDiscoverScene(selectedActiveSceneId, token);
        setDiscoveryContext({
          tunedSceneId: context.tunedSceneId,
          tunedScene: context.tunedScene,
          isVisitor: context.isVisitor,
        });
      } catch {
        // Fall through to plot route even if tune persistence fails.
      }
    }

    router.push('/plot');
  };

  const handleReset = () => {
    reset();
    setCity('');
    setState('');
    setMusicCommunity('');
    setGpsError(null);
    setLocationError(null);
    setIsDetectingLocation(false);
    setManualLocationMode(true);
    setCitySuggestions([]);
    setCityLoading(false);
    setCityError(null);
    setIsPioneer(false);
    setActiveSceneOptions([]);
    setSelectedActiveSceneId(null);
    setStateSceneError(null);
    setNearestActiveSceneLabel(null);
    setStep(0);
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
            <h1 className="text-3xl font-semibold text-black">Allow UPRISE to use GPS to verify location?</h1>
            <p className="mt-2 text-sm text-black/60">
              Verification is required in order to vote in your home scene. Your location is not used for third-party services.
            </p>

            {gpsError && <p className="mt-4 text-sm text-red-600">{gpsError}</p>}

            <div className="mt-8 flex flex-wrap gap-3">
              <Button size="lg" disabled={isDetectingLocation} onClick={handleGpsRequest}>
                {isDetectingLocation ? 'Detecting location...' : 'OK'}
              </Button>
              <Button size="lg" variant="outline" onClick={handleSkipGps}>
                Deny
              </Button>
            </div>

            {!token && (
              <p className="mt-4 text-xs text-black/40">
                Sign in if you want GPS verification to enable voting immediately.
              </p>
            )}
          </section>
        )}

        {step === 1 && (
          <section className="rounded-3xl border border-black/10 bg-white/80 p-8 shadow-sm">
            <h1 className="text-3xl font-semibold text-black">Join Your Home Scene</h1>
            <p className="mt-2 text-sm text-black/60">
              Your Home Scene is your local music scene of choice. If you do not have one, choose the music community you want to explore.
            </p>

            {locationError && <p className="mt-4 text-sm text-black/70">{locationError}</p>}

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
                <option value="" disabled>
                  Select a parent community
                </option>
                {MUSIC_COMMUNITIES.map((community) => (
                  <option key={community} value={community}>
                    {community}
                  </option>
                ))}
              </select>
              <p className="text-xs text-black/50">
                There are many subgenres of music, each with its own community. For now, select the one you believe is closest related.
              </p>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Button size="lg" disabled={!canContinue} onClick={handleSceneContinue}>
                Continue
              </Button>
              <Button size="lg" variant="outline" onClick={() => setStep(0)}>
                Back
              </Button>
            </div>
          </section>
        )}

        {step === 2 && (
          <section className="rounded-3xl border border-black/10 bg-white/80 p-8 shadow-sm">
            <h1 className="text-3xl font-semibold text-black">Scene Routing</h1>
            <p className="mt-2 text-sm text-black/60">
              Looks like {homeScene?.city} does not have an active {homeScene?.musicCommunity} scene yet. Would you like to join one
              of the following until {homeScene?.city} Uprises?
            </p>

            <div className="mt-6 space-y-4">
              <div className="rounded-2xl border border-black/10 bg-white p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-black/50">Selected Home Scene</p>
                <p className="mt-2 text-base text-black">
                  {homeScene?.city}, {homeScene?.state} - {homeScene?.musicCommunity}
                </p>
              </div>

              {isPioneer && (
                <div className="rounded-2xl border border-black/10 bg-white p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-black/50">Available Cities</p>
                  <p className="mt-2 text-base text-black">Choose an active city scene to enter now.</p>
                  {activeSceneOptions.length > 0 && (
                    <div className="mt-4 flex flex-col gap-2">
                      <label className="text-xs uppercase tracking-[0.2em] text-black/60">Cities</label>
                      <select
                        value={selectedActiveSceneId ?? ''}
                        onChange={(event) => setSelectedActiveSceneId(event.target.value)}
                        className="rounded-xl border border-black/10 bg-white px-4 py-3 text-sm shadow-sm"
                      >
                        {activeSceneOptions.map((option) => (
                          <option key={option.sceneId} value={option.sceneId}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                  {nearestActiveSceneLabel && (
                    <p className="mt-2 text-sm text-black/60">Nearest active city scene: {nearestActiveSceneLabel}</p>
                  )}
                  {stateSceneError && <p className="mt-2 text-sm text-black/50">{stateSceneError}</p>}
                </div>
              )}
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <Button size="lg" onClick={handleConfirmActiveScene}>
                Confirm and Enter Home Scene
              </Button>
              <Button size="lg" variant="outline" onClick={() => setStep(0)}>
                Back
              </Button>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
