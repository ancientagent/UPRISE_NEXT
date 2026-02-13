'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@uprise/ui';
import { MUSIC_COMMUNITIES } from '@/data/music-communities';
import { US_STATES } from '@/data/us-states';
import { useOnboardingStore } from '@/store/onboarding';

const steps = ['Home Scene', 'GPS Verification', 'Review'];

export default function OnboardingPage() {
  const router = useRouter();
  const { homeScene, gpsStatus, setHomeScene, setGpsStatus, reset } = useOnboardingStore();
  const [step, setStep] = useState(0);
  const [city, setCity] = useState(homeScene?.city ?? '');
  const [state, setState] = useState(homeScene?.state ?? '');
  const [musicCommunity, setMusicCommunity] = useState(homeScene?.musicCommunity ?? '');
  const [tasteTag, setTasteTag] = useState(homeScene?.tasteTag ?? '');
  const [gpsError, setGpsError] = useState<string | null>(null);

  const canContinue = useMemo(
    () => city.trim() && state.trim() && musicCommunity.trim(),
    [city, state, musicCommunity]
  );

  const handleSceneContinue = () => {
    if (!canContinue) return;
    setHomeScene({
      city: city.trim(),
      state: state.trim(),
      musicCommunity: musicCommunity.trim(),
      tasteTag: tasteTag.trim() || undefined,
    });
    setStep(1);
  };

  const handleGpsRequest = () => {
    setGpsError(null);
    if (!navigator.geolocation) {
      setGpsStatus('denied');
      setGpsError('GPS is not available on this device. You can still continue without voting access.');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setGpsStatus('granted', { latitude: pos.coords.latitude, longitude: pos.coords.longitude });
        setStep(2);
      },
      () => {
        setGpsStatus('denied');
        setGpsError('GPS verification was denied. You can still continue without voting access.');
      }
    );
  };

  const handleSkipGps = () => {
    setGpsStatus('denied');
    setStep(2);
  };

  const handleFinish = () => {
    router.push('/plot');
  };

  const handleReset = () => {
    reset();
    setCity('');
    setState('');
    setMusicCommunity('');
    setTasteTag('');
    setGpsError(null);
    setStep(0);
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
            <h1 className="text-3xl font-semibold text-black">Choose your local music scene</h1>
            <p className="mt-2 text-sm text-black/60">
              Your Home Scene is your civic anchor. It determines where you vote and where your community life starts.
            </p>

            <div className="mt-8 grid gap-4 md:grid-cols-2">
              <div className="flex flex-col gap-2">
                <label className="text-xs uppercase tracking-[0.2em] text-black/60">City</label>
                <input
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="rounded-xl border border-black/10 bg-white px-4 py-3 text-sm shadow-sm"
                  placeholder="Start typing your city"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs uppercase tracking-[0.2em] text-black/60">State</label>
                <input
                  list="states"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="rounded-xl border border-black/10 bg-white px-4 py-3 text-sm shadow-sm"
                  placeholder="Select your state"
                />
                <datalist id="states">
                  {US_STATES.map((s) => (
                    <option key={s} value={s} />
                  ))}
                </datalist>
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-2">
              <label className="text-xs uppercase tracking-[0.2em] text-black/60">Music Community</label>
              <input
                list="communities"
                value={musicCommunity}
                onChange={(e) => setMusicCommunity(e.target.value)}
                className="rounded-xl border border-black/10 bg-white px-4 py-3 text-sm shadow-sm"
                placeholder="Choose the community that fits your local scene"
              />
              <datalist id="communities">
                {MUSIC_COMMUNITIES.map((community) => (
                  <option key={community} value={community} />
                ))}
              </datalist>
              <p className="text-xs text-black/50">
                This is not a genre taxonomy. It’s the local music community you want to live in.
              </p>
            </div>

            <div className="mt-6 flex flex-col gap-2">
              <label className="text-xs uppercase tracking-[0.2em] text-black/60">
                Other musical tastes (optional)
              </label>
              <input
                value={tasteTag}
                onChange={(e) => setTasteTag(e.target.value)}
                className="rounded-xl border border-black/10 bg-white px-4 py-3 text-sm shadow-sm"
                placeholder="Optional: other musical tastes (sub/microgenre)"
              />
              <p className="text-xs text-black/50">
                Tags help you find sub‑communities later, but they don’t define your Home Scene.
              </p>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Button size="lg" disabled={!canContinue} onClick={handleSceneContinue}>
                Continue
              </Button>
              <Button size="lg" variant="outline" onClick={handleReset}>
                Reset
              </Button>
            </div>
          </section>
        )}

        {step === 1 && (
          <section className="rounded-3xl border border-black/10 bg-white/80 p-8 shadow-sm">
            <h1 className="text-3xl font-semibold text-black">GPS verification for voting</h1>
            <p className="mt-2 text-sm text-black/60">
              GPS verification only unlocks voting in your Home Scene. Everything else works without it.
            </p>

            <div className="mt-6 rounded-2xl border border-black/10 bg-black/5 p-4 text-sm text-black/70">
              Home Scene: {homeScene?.city}, {homeScene?.state} — {homeScene?.musicCommunity}
            </div>

            {gpsError && <p className="mt-4 text-sm text-red-600">{gpsError}</p>}

            <div className="mt-8 flex flex-wrap gap-3">
              <Button size="lg" onClick={handleGpsRequest}>
                Enable GPS
              </Button>
              <Button size="lg" variant="outline" onClick={handleSkipGps}>
                Skip for now
              </Button>
              <Button size="lg" variant="ghost" onClick={() => setStep(0)}>
                Back
              </Button>
            </div>
          </section>
        )}

        {step === 2 && (
          <section className="rounded-3xl border border-black/10 bg-white/80 p-8 shadow-sm">
            <h1 className="text-3xl font-semibold text-black">Review your setup</h1>
            <p className="mt-2 text-sm text-black/60">
              You can edit this later, but your Home Scene anchors your participation.
            </p>

            <div className="mt-6 space-y-4">
              <div className="rounded-2xl border border-black/10 bg-white p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-black/50">Home Scene</p>
                <p className="mt-2 text-base text-black">
                  {homeScene?.city}, {homeScene?.state} — {homeScene?.musicCommunity}
                </p>
                {homeScene?.tasteTag && (
                  <p className="mt-1 text-sm text-black/60">Taste tag: {homeScene.tasteTag}</p>
                )}
              </div>
              <div className="rounded-2xl border border-black/10 bg-white p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-black/50">Voting Eligibility</p>
                <p className="mt-2 text-base text-black">
                  {gpsStatus === 'granted' ? 'Enabled (GPS verified)' : 'Not enabled yet'}
                </p>
                <p className="mt-1 text-sm text-black/60">
                  Voting is the only action gated by GPS verification.
                </p>
              </div>
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
      </div>
    </main>
  );
}
