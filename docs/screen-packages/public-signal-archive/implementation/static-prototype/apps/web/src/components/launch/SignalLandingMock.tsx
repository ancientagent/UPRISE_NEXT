'use client';

import Image from 'next/image';
import { ArrowUpRight, FileText, LockKeyhole, Radio, Send, X } from 'lucide-react';
import { useState, type FormEvent } from 'react';
import EntryAccountPanel from '@/components/auth/EntryAccountPanel';

const dispatches = [
  ['01', 'Trace the local signal.', 'Artists are already making the music. The missing piece is a path between them and the people living nearby.'],
  ['02', 'Build the receiver.', 'Start with the city, its music communities, and a player that can carry what is happening locally.'],
  ['03', 'Raise the tower.', 'The equipment is unfinished. The purpose is not: local music needs infrastructure the scene can use.'],
];

export default function SignalLandingMock() {
  const [folderOpen, setFolderOpen] = useState(false);
  const [entryOpen, setEntryOpen] = useState(false);
  const [address, setAddress] = useState('');

  const openFolder = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!address.trim()) return;
    setFolderOpen(true);
  };

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#111] text-[#111]">
      <section className="mx-auto min-h-screen max-w-[1500px] bg-[#f4efe4]">
        <header className="relative z-20 flex items-center justify-between border-b-2 border-black bg-black px-5 py-4 text-[#f4efe4] sm:px-8">
          <a href="/signal" className="text-3xl font-black leading-none">UPRISE</a>
          <div className="flex items-center gap-3 font-mono text-[11px] font-bold uppercase tracking-[0.14em] sm:text-xs">
            <Radio size={16} className="text-[#cbed19]" aria-hidden="true" />
            <span>Signal archive</span>
          </div>
        </header>

        <section className="relative isolate min-h-[710px] overflow-hidden border-b-2 border-black bg-black sm:min-h-[780px]">
          <Image
            src="/signal/signal-hideout-industrial.png"
            alt="Xerox-style underground transmitter workshop beneath a city"
            fill
            priority
            className="object-cover object-[56%_center] sm:object-center"
            sizes="100vw"
          />
          <div className="relative z-10 flex min-h-[710px] max-w-3xl flex-col justify-between px-5 py-8 text-[#f4efe4] sm:min-h-[780px] sm:px-10 sm:py-12">
            <div className="max-w-lg">
              <p className="inline-flex items-center gap-2 border-2 border-black bg-[#cbed19] px-3 py-1.5 font-mono text-[11px] font-bold uppercase tracking-[0.12em]">
                <span className="h-2 w-2 rounded-full bg-black" /> Transmission 01
              </p>
              <h1 className="mt-7 text-5xl font-black leading-[.9] [text-shadow:3px_3px_0_#111] sm:text-7xl">
                Local music did not disappear.
                <span className="mt-2 block font-mono text-[.54em] font-medium uppercase tracking-[0.03em] text-[#cbed19]">It got buried.</span>
              </h1>
              <p className="mt-6 max-w-md border-l-4 border-[#cbed19] bg-black/75 px-4 py-3 text-base leading-relaxed sm:text-lg">
                A transmitter is being assembled beneath the city. When it goes live, local music gets a direct route back into the streets.
              </p>
            </div>

            <div className="grid max-w-xl gap-3 border-t-2 border-[#cbed19] bg-black/80 p-4 sm:grid-cols-[1fr_auto] sm:items-end">
              <p className="font-mono text-[11px] font-bold uppercase tracking-[0.12em] text-[#cbed19]">Austin relay / Assembly in progress</p>
              <button
                type="button"
                onClick={() => setEntryOpen(true)}
                className="inline-flex min-h-12 items-center justify-center gap-2 border-2 border-[#f4efe4] bg-black px-4 text-sm font-bold uppercase tracking-[0.08em] text-[#f4efe4] transition hover:border-[#cbed19] hover:bg-[#cbed19] hover:text-black focus:outline-none focus:ring-4 focus:ring-[#cbed19]"
              >
                Find the door <ArrowUpRight size={18} aria-hidden="true" />
              </button>
            </div>
          </div>
        </section>

        <section className="border-b-2 border-black bg-[#111] px-5 py-10 text-[#f4efe4] sm:px-10 sm:py-14">
          <div className="flex flex-col justify-between gap-4 border-b-2 border-[#f4efe4] pb-5 sm:flex-row sm:items-end">
            <div>
              <p className="font-mono text-xs font-bold uppercase tracking-[0.14em] text-[#cbed19]">Signal log / Below street level</p>
              <h2 className="mt-2 text-3xl font-black sm:text-5xl">Notes from the room where it is being built.</h2>
            </div>
            <p className="max-w-xs text-sm leading-relaxed text-[#f4efe4]/70">Not a social feed. A public record of the work leading up to first transmission.</p>
          </div>
          <div className="mt-0 grid border-l-2 border-[#f4efe4] md:grid-cols-3">
            {dispatches.map(([number, title, body]) => (
              <article key={number} className="min-h-56 border-b-2 border-r-2 border-[#f4efe4] p-5 last:border-b-0 md:last:border-b-2">
                <p className="font-mono text-xs font-bold text-[#cbed19]">WORK ORDER / {number}</p>
                <h3 className="mt-8 text-2xl font-black leading-tight">{title}</h3>
                <p className="mt-4 text-sm leading-relaxed text-[#f4efe4]/70">{body}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="grid border-b-2 border-black bg-[#b8b1a3] lg:grid-cols-[1.15fr_.85fr]">
          <div className="p-5 sm:p-10">
            <div className="max-w-xl border-2 border-black bg-[#d8c99d] p-5 shadow-[8px_8px_0_#111] sm:p-8">
              <div className="flex items-start justify-between border-b-2 border-black pb-4">
                <div>
                  <p className="font-mono text-xs font-bold uppercase tracking-[0.14em]">First paperwork</p>
                  <h2 className="mt-2 text-3xl font-black">Field intake folder</h2>
                </div>
                <FileText size={28} strokeWidth={2.2} aria-hidden="true" />
              </div>
              <p className="mt-5 text-sm leading-relaxed">Leave an address for the next build note. The first folder contains a city map fragment and the phrase used at the door.</p>
              <form onSubmit={openFolder} className="mt-6 flex flex-col gap-3 sm:flex-row">
                <label className="sr-only" htmlFor="dispatch-address">Email address</label>
                <input
                  id="dispatch-address"
                  type="email"
                  required
                  value={address}
                  onChange={(event) => setAddress(event.target.value)}
                  placeholder="your@email.com"
                  className="min-h-12 flex-1 border-2 border-black bg-[#f7f3e9] px-3 text-base outline-none placeholder:text-black/45 focus:ring-4 focus:ring-[#cbed19]"
                />
                <button type="submit" className="inline-flex min-h-12 items-center justify-center gap-2 border-2 border-black bg-[#cbed19] px-4 text-sm font-bold uppercase tracking-[0.08em] hover:bg-black hover:text-[#f4efe4] focus:outline-none focus:ring-4 focus:ring-black">
                  Open folder <Send size={17} aria-hidden="true" />
                </button>
              </form>
            </div>
          </div>
          <div className="border-t-2 border-black bg-[#111] p-5 text-[#f4efe4] lg:border-l-2 lg:border-t-0 sm:p-10">
            <p className="font-mono text-xs font-bold uppercase tracking-[0.14em] text-[#cbed19]">Relay status</p>
            <p className="mt-8 max-w-md text-4xl font-black leading-none sm:text-5xl">Steel first. Signal second. The city comes online after that.</p>
            <div className="mt-10 border-t border-[#f4efe4]/50 pt-4 font-mono text-xs uppercase tracking-[0.12em]">
              City / State / Music community
            </div>
          </div>
        </section>
      </section>

      {folderOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4" role="dialog" aria-modal="true" aria-labelledby="folder-title">
          <section className="w-full max-w-lg border-2 border-black bg-[#e7d8ae] p-5 shadow-[10px_10px_0_#cbed19] sm:p-8">
            <div className="flex items-start justify-between">
              <div>
                <p className="font-mono text-xs font-bold uppercase tracking-[0.14em]">Packet opened</p>
                <h2 id="folder-title" className="mt-2 text-3xl font-black">Keep this phrase.</h2>
              </div>
              <button type="button" aria-label="Close intake folder" onClick={() => setFolderOpen(false)} className="p-1 hover:bg-black hover:text-white focus:outline-none focus:ring-4 focus:ring-[#cbed19]">
                <X size={24} aria-hidden="true" />
              </button>
            </div>
            <div className="mt-7 border-2 border-dashed border-black bg-[#f7f3e9] p-5">
              <p className="font-mono text-xs font-bold uppercase tracking-[0.14em]">Access phrase</p>
              <p className="mt-3 text-3xl font-black uppercase tracking-[0.08em]">KEEP IT LOCAL</p>
              <p className="mt-5 text-sm leading-relaxed">The next dispatch carries the rest of the map.</p>
            </div>
          </section>
        </div>
      ) : null}

      {entryOpen ? (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 p-4 sm:p-8" role="dialog" aria-modal="true" aria-labelledby="entry-title">
          <div className="mx-auto flex min-h-full max-w-md items-center">
            <section className="relative w-full border-2 border-black bg-[#d7f52a] p-4 shadow-[10px_10px_0_#f4efe4] sm:p-6">
              <button type="button" aria-label="Close entry door" onClick={() => setEntryOpen(false)} className="absolute right-3 top-3 p-1 hover:bg-black hover:text-white focus:outline-none focus:ring-4 focus:ring-black">
                <X size={24} aria-hidden="true" />
              </button>
              <div className="mb-5 pr-10">
                <p className="inline-flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-[0.14em]"><LockKeyhole size={15} aria-hidden="true" /> Door found</p>
                <h2 id="entry-title" className="mt-2 text-3xl font-black">Enter the network.</h2>
              </div>
              <EntryAccountPanel />
            </section>
          </div>
        </div>
      ) : null}
    </main>
  );
}
