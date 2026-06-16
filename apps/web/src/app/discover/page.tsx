'use client';

import Link from 'next/link';
import { Button } from '@uprise/ui';

export default function DiscoverPage() {
  return (
    <main className="plot-wire-page pb-10">
      <div className="plot-wire-frame max-w-4xl space-y-4">
        <section className="plot-wire-card p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="max-w-3xl space-y-3">
              <p className="plot-wire-label">Discover</p>
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-3xl font-semibold text-black">Discover</h1>
                <span className="plot-wire-chip bg-[#d9d9d1] text-black/70">Coming Soon</span>
              </div>
              <p className="max-w-3xl text-sm text-black/70">
                MVP is local-community-only. Listeners stay inside their own community while scenes settle.
                Borders open later.
              </p>
              <p className="max-w-3xl text-sm text-black/60">
                In the meantime, useful discovery material like what is popular, what is rising, what people are
                saying, and later paid placements will show up every so often as inserted feed moments instead of
                living on a separate Discover route.
              </p>
            </div>
            <div className="plot-wire-toolbar min-w-[220px]">
              <p className="plot-wire-label">MVP Rule</p>
              <p className="mt-1 text-sm text-black/70">Own community only</p>
              <p className="mt-2 text-sm text-black/60">Open borders after communities stabilize.</p>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            <Button asChild variant="outline" size="sm" className="plot-wire-chip h-auto rounded-full bg-white px-4 py-2 text-[11px] text-black">
              <Link href="/plot">Back to Plot</Link>
            </Button>
            <Button asChild variant="outline" size="sm" className="plot-wire-chip h-auto rounded-full bg-white px-4 py-2 text-[11px] text-black">
              <Link href="/onboarding">Home Scene Setup</Link>
            </Button>
          </div>
        </section>
      </div>
    </main>
  );
}
