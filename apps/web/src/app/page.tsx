
import EntryAccountPanel from '@/components/auth/EntryAccountPanel';

export default function Home() {
  return (
    <main className="min-h-screen bg-[#171717] px-4 py-5 text-black sm:px-8 sm:py-8">
      <div className="mx-auto grid min-h-[calc(100vh-2.5rem)] max-w-6xl overflow-hidden border-2 border-black bg-[#f7f3e9] md:grid-cols-[1.15fr_0.85fr]">
        <section className="relative flex min-h-[48vh] flex-col justify-between overflow-hidden border-b-2 border-black bg-[#e6e0d3] p-6 sm:p-10 md:min-h-0 md:border-b-0 md:border-r-2">
          <div className="absolute inset-0 opacity-20 [background-image:radial-gradient(#111_1px,transparent_1px)] [background-size:8px_8px]" />
          <div className="relative">
            <p className="text-4xl font-black tracking-tight sm:text-5xl">UPRISE</p>
            <p className="mt-2 border-l-4 border-[#cbed19] pl-3 font-mono text-sm uppercase tracking-[0.12em]">
              Local music. Local power.
            </p>
          </div>
          <div className="relative max-w-xl py-16 md:py-0">
            <p className="font-mono text-xs font-bold uppercase tracking-[0.16em]">Open a listener account</p>
            <h1 className="mt-3 text-4xl font-black leading-none sm:text-6xl">
              Find the music already moving around you.
            </h1>
            <p className="mt-5 max-w-lg text-base leading-relaxed sm:text-lg">
              Start with your Home Scene. Enter the local broadcast when your
              account is ready.
            </p>
          </div>
          <div className="relative flex items-end justify-between border-t-2 border-black pt-4 font-mono text-xs font-bold uppercase tracking-[0.1em]">
            <span>Home Scene / Plot / RADIYO</span>
            <span aria-hidden="true">[U]</span>
          </div>
        </section>
        <section className="flex items-center justify-center bg-[#d7f52a] p-5 sm:p-10">
          <EntryAccountPanel />
        </section>
      </div>
    </main>
  );
}
