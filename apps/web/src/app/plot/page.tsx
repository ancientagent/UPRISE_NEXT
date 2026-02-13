'use client';

import { useState } from 'react';
import { Button } from '@uprise/ui';
import { useOnboardingStore } from '@/store/onboarding';

const tabs = ['Feed', 'Events', 'Promotions', 'Statistics', 'Social'];

export default function PlotPage() {
  const { homeScene } = useOnboardingStore();
  const [activeTab, setActiveTab] = useState('Feed');

  return (
    <main className="min-h-screen bg-[#f7f5ef] px-6 py-12">
      <div className="mx-auto max-w-6xl">
        <header className="rounded-3xl border border-black/10 bg-white/80 p-8 shadow-sm">
          <p className="text-xs uppercase tracking-[0.25em] text-black/50">The Plot</p>
          <h1 className="mt-3 text-3xl font-semibold text-black">
            {homeScene ? `${homeScene.city}, ${homeScene.state}` : 'Your Home Scene'}
          </h1>
          <p className="mt-2 text-sm text-black/60">
            {homeScene?.musicCommunity ?? 'Select a Home Scene to personalize this view.'}
          </p>
          {homeScene?.tasteTag && (
            <p className="mt-1 text-sm text-black/50">Taste tag: {homeScene.tasteTag}</p>
          )}
        </header>

        <section className="mt-8 flex flex-wrap gap-3">
          {tabs.map((tab) => (
            <Button
              key={tab}
              variant={activeTab === tab ? 'default' : 'outline'}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </Button>
          ))}
        </section>

        <section className="mt-8 grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-black/10 bg-white p-6">
            <h2 className="text-lg font-semibold text-black">{activeTab}</h2>
            <p className="mt-2 text-sm text-black/60">
              {activeTab === 'Feed' && 'Community actions appear here: Blasts, releases, and updates.'}
              {activeTab === 'Events' && 'Scene events and flyers live here.'}
              {activeTab === 'Promotions' && 'Local offers and promotions live here.'}
              {activeTab === 'Statistics' && 'Scene health metrics and activity scores live here.'}
              {activeTab === 'Social' && 'Message boards and listening rooms (V2) live here.'}
            </p>
          </div>
          <div className="rounded-2xl border border-black/10 bg-white p-6">
            <h2 className="text-lg font-semibold text-black">Scene Activity</h2>
            <p className="mt-2 text-sm text-black/60">
              This panel will show community activity summaries, registrar access, and scene map data.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
