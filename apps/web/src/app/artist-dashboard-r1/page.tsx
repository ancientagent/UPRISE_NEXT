'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { Button } from '@uprise/ui';

type DashboardView =
  | 'overview'
  | 'catalog'
  | 'audience'
  | 'events'
  | 'promotions'
  | 'registrar'
  | 'team'
  | 'settings';

type DemoTrack = {
  id: string;
  title: string;
  status: 'ready' | 'processing' | 'archived';
  plays30d: number;
};

const tracks: DemoTrack[] = [
  { id: 'trk-001', title: 'Rail Yard Anthem', status: 'ready', plays30d: 1294 },
  { id: 'trk-002', title: 'Corner Exit Lights', status: 'ready', plays30d: 944 },
  { id: 'trk-003', title: 'Transit Wire', status: 'processing', plays30d: 0 },
];

const VIEWS: Array<{ id: DashboardView; label: string; description: string }> = [
  { id: 'overview', label: 'Overview', description: 'Entity status and quick actions.' },
  { id: 'catalog', label: 'Catalog', description: 'Tracks and release lifecycle.' },
  { id: 'audience', label: 'Audience', description: 'Descriptive analytics only.' },
  { id: 'events', label: 'Events', description: 'Scene-bound event workflow.' },
  { id: 'promotions', label: 'Promotions', description: 'Paid scope management surface.' },
  { id: 'registrar', label: 'Registrar', description: 'Registration and capability status.' },
  { id: 'team', label: 'Team & Access', description: 'Linked member permissions.' },
  { id: 'settings', label: 'Settings', description: 'Profile, visibility, entitlement status.' },
];

function SectionCard({ title, lines }: { title: string; lines: string[] }) {
  return (
    <div className="rounded-2xl border border-black/10 bg-white p-4">
      <h3 className="text-sm font-semibold text-black">{title}</h3>
      <ul className="mt-2 space-y-1">
        {lines.map((line) => (
          <li key={line} className="text-xs text-black/65">
            {line}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function ArtistDashboardR1Page() {
  const [view, setView] = useState<DashboardView>('overview');
  const [selectedTrackId, setSelectedTrackId] = useState<string>('trk-001');
  const [message, setMessage] = useState<string>('Ready. This is an interactive low-fi sandbox.');

  const current = useMemo(() => VIEWS.find((item) => item.id === view) ?? VIEWS[0], [view]);
  const selectedTrack = useMemo(() => tracks.find((track) => track.id === selectedTrackId) ?? tracks[0], [selectedTrackId]);

  return (
    <main className="min-h-screen bg-[#f7f5ef] px-5 py-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <header className="rounded-3xl border border-black/10 bg-white/85 p-6 shadow-sm">
          <p className="text-xs uppercase tracking-[0.22em] text-black/55">Artist Dashboard R1 Prototype</p>
          <h1 className="mt-2 text-3xl font-semibold text-black">Artist Management (Separate Site Preview)</h1>
          <p className="mt-2 text-sm text-black/65">
            Interactive low-fi sandbox for menu/content validation. Actions are demo-safe and do not mutate production data.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Button asChild size="sm" variant="outline">
              <Link href="/plot">Back to Plot</Link>
            </Button>
            <span className="rounded-full border border-black/15 bg-black/[0.03] px-3 py-1 text-xs text-black/65">
              Entity: Austin Punk Unit (demo)
            </span>
            <span className="rounded-full border border-black/15 bg-black/[0.03] px-3 py-1 text-xs text-black/65">
              Entitlement: Standard
            </span>
          </div>
          <p className="mt-4 rounded-xl border border-black/10 bg-black/[0.03] px-3 py-2 text-xs text-black/70">{message}</p>
        </header>

        <section className="grid gap-6 lg:grid-cols-[260px_1fr]">
          <aside className="rounded-2xl border border-black/10 bg-white p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-black/55">Menu</p>
            <div className="mt-3 grid gap-2">
              {VIEWS.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setView(item.id);
                    setMessage(`Switched to ${item.label}.`);
                  }}
                  className={`rounded-xl px-3 py-2 text-left text-sm transition ${
                    view === item.id
                      ? 'bg-black text-white'
                      : 'border border-black/10 bg-white text-black hover:bg-black/[0.03]'
                  }`}
                >
                  <p className="font-medium">{item.label}</p>
                  <p className={`text-xs ${view === item.id ? 'text-white/75' : 'text-black/55'}`}>{item.description}</p>
                </button>
              ))}
            </div>
          </aside>

          <section className="space-y-4">
            <div className="rounded-2xl border border-black/10 bg-white p-5">
              <p className="text-xs uppercase tracking-[0.2em] text-black/50">{current.label}</p>
              <h2 className="mt-1 text-2xl font-semibold text-black">{current.label} Workspace</h2>
              <p className="mt-2 text-sm text-black/65">{current.description}</p>
            </div>

            {view === 'overview' && (
              <>
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                  <SectionCard title="Entity Status" lines={['Artist/Band: Active', 'Home Scene: Austin, TX', 'Registrar: clear']} />
                  <SectionCard title="Slots" lines={['Plan: Standard', 'Active Slots: 1/1', 'Upgrade path: Premium (deferred billing)']} />
                  <SectionCard title="Events Snapshot" lines={['Upcoming: 2', 'Past 30d: 3', 'Proof submissions: 12']} />
                  <SectionCard title="Registrar Notices" lines={['No pending member sync', 'No code expiry warnings', 'No motion conflicts']} />
                </div>
                <div className="rounded-2xl border border-black/10 bg-white p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-black/55">Quick Actions</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <Button size="sm" onClick={() => { setView('catalog'); setMessage('Jumped to Catalog.'); }}>Go to Catalog</Button>
                    <Button size="sm" variant="outline" onClick={() => { setView('events'); setMessage('Jumped to Events.'); }}>Go to Events</Button>
                    <Button size="sm" variant="outline" onClick={() => { setView('registrar'); setMessage('Jumped to Registrar.'); }}>Go to Registrar</Button>
                  </div>
                </div>
              </>
            )}

            {view === 'catalog' && (
              <div className="grid gap-4 md:grid-cols-[1fr_1fr]">
                <div className="rounded-2xl border border-black/10 bg-white p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-black/55">Track List</p>
                  <div className="mt-3 space-y-2">
                    {tracks.map((track) => (
                      <button
                        key={track.id}
                        onClick={() => {
                          setSelectedTrackId(track.id);
                          setMessage(`Selected track: ${track.title}`);
                        }}
                        className={`w-full rounded-xl border px-3 py-2 text-left text-sm ${
                          selectedTrackId === track.id ? 'border-black bg-black text-white' : 'border-black/10 bg-white'
                        }`}
                      >
                        <p className="font-medium">{track.title}</p>
                        <p className={`text-xs ${selectedTrackId === track.id ? 'text-white/70' : 'text-black/60'}`}>
                          {track.status} · {track.plays30d.toLocaleString()} plays (30d)
                        </p>
                      </button>
                    ))}
                  </div>
                </div>
                <div className="rounded-2xl border border-black/10 bg-white p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-black/55">Track Detail Panel</p>
                  <h3 className="mt-2 text-lg font-semibold text-black">{selectedTrack.title}</h3>
                  <p className="mt-1 text-sm text-black/65">Status: {selectedTrack.status}</p>
                  <p className="mt-1 text-sm text-black/65">30d plays: {selectedTrack.plays30d.toLocaleString()}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <Button size="sm" variant="outline" onClick={() => setMessage(`Opened analytics for ${selectedTrack.title} (demo).`)}>
                      Open Analytics
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => setMessage(`Opened registrar linkage for ${selectedTrack.title} (demo).`)}>
                      Registrar Link
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {view === 'audience' && (
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                <SectionCard title="KPI Row" lines={['Active listeners', 'ADD/BLAST/SUPPORT counts', 'Descriptive only']} />
                <SectionCard title="Geo Insights" lines={['City/state/national cuts', 'No recommendation output', 'No ranking']} />
                <SectionCard title="Premium Panel" lines={['Context badges', 'Advanced city breakdown', 'Gated by entitlement']} />
              </div>
            )}

            {view === 'events' && (
              <div className="grid gap-4 md:grid-cols-2">
                <SectionCard title="Events Pipeline" lines={['Upcoming vs Past', 'Open detail drawer', 'Scene-bound constraints']} />
                <div className="rounded-2xl border border-black/10 bg-white p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-black/55">Actions</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <Button size="sm" variant="outline" onClick={() => setMessage('Create Event requested (planned write flow).')}>Create Event</Button>
                    <Button size="sm" variant="outline" onClick={() => setMessage('Attendance proof queue opened (demo).')}>Proof Queue</Button>
                  </div>
                </div>
              </div>
            )}

            {view === 'promotions' && (
              <div className="grid gap-4 md:grid-cols-2">
                <SectionCard title="Campaigns" lines={['Scope targeting', 'Spend/status summary', 'Paid surface only']} />
                <SectionCard title="Boundary" lines={['No Fair Play influence', 'No governance impact', 'No algorithmic placement']} />
              </div>
            )}

            {view === 'registrar' && (
              <div className="grid gap-4 md:grid-cols-2">
                <SectionCard title="Status Timeline" lines={['Submission', 'Materialize', 'Invite dispatch/sync', 'Audit trail']} />
                <div className="rounded-2xl border border-black/10 bg-white p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-black/55">Member Ops</p>
                  <div className="mt-3 space-y-2 text-sm text-black/70">
                    <p>Invite status loaded: 8 queued / 3 sent / 1 failed</p>
                    <p>Sync eligible count: 4</p>
                  </div>
                  <div className="mt-3 flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => setMessage('Invite status refresh completed (demo).')}>Refresh</Button>
                    <Button size="sm" variant="outline" onClick={() => setMessage('Member sync started (demo).')}>Run Sync</Button>
                  </div>
                </div>
              </div>
            )}

            {view === 'team' && (
              <div className="grid gap-4 md:grid-cols-2">
                <SectionCard title="Linked Members" lines={['Member identity list', 'Role labels', 'Read-first until full contract lock']} />
                <SectionCard title="Access Requests" lines={['Invite queue (planned)', 'Permission edits (planned)', 'Audit notes']} />
              </div>
            )}

            {view === 'settings' && (
              <div className="grid gap-4 md:grid-cols-2">
                <SectionCard title="Profile" lines={['Display fields', 'Visibility toggles', 'Entity metadata']} />
                <SectionCard title="Entitlement" lines={['Standard/Premium status', 'Billing deferred marker', 'Capability notes']} />
              </div>
            )}
          </section>
        </section>
      </div>
    </main>
  );
}
