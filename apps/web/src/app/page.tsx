
import Link from 'next/link';
import { Button } from '@uprise/ui';

export default function Home() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_#f6f1e7_0%,_#f5f5f5_40%,_#e9eef5_100%)]">
      <div className="mx-auto flex min-h-screen max-w-6xl flex-col justify-center px-6 py-20">
        <div className="inline-flex w-fit items-center gap-2 rounded-full border border-black/10 bg-white/70 px-4 py-1 text-xs uppercase tracking-[0.2em] text-black/70">
          UPRISE
          <span className="h-1 w-1 rounded-full bg-black/40" />
          Local Broadcast Infrastructure
        </div>
        <h1 className="mt-6 text-5xl font-semibold leading-tight text-black md:text-6xl">
          Build your local music community.
          <span className="block text-black/70">Broadcast it without algorithms.</span>
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-black/70">
          UPRISE is a scene‑centered broadcast platform where listeners and artists work together to move
          music from local scenes to wider awareness—without personalization, rankings, or pay‑to‑play.
        </p>
        <div className="mt-10 flex flex-wrap gap-4">
          <Button asChild size="lg">
            <Link href="/onboarding">Start onboarding</Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="/plot">Open The Plot</Link>
          </Button>
        </div>
        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {[
            { title: 'Scene First', desc: 'Your Home Scene is your civic anchor. Voting stays local.' },
            { title: 'Fair Play', desc: 'Equal exposure at entry. Community actions guide rotation.' },
            { title: 'No Recommendation Engine', desc: 'Discovery is user‑initiated, not algorithmic.' },
          ].map((item) => (
            <div key={item.title} className="rounded-2xl border border-black/10 bg-white/80 p-5">
              <h3 className="text-base font-semibold text-black">{item.title}</h3>
              <p className="mt-2 text-sm text-black/70">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
