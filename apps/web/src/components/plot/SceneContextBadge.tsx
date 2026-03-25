'use client';

import type { HomeSceneSelection, TunedSceneContext } from '@/store/onboarding';

type SceneContextBadgeProps = {
  homeScene: HomeSceneSelection | null;
  tunedScene: TunedSceneContext | null;
  isVisitor: boolean | null;
};

function formatHome(homeScene: HomeSceneSelection | null): string {
  if (!homeScene) return 'Home Scene: Not set';
  return `Home Scene: ${homeScene.city}, ${homeScene.state} — ${homeScene.musicCommunity}`;
}

function formatTuned(tunedScene: TunedSceneContext | null): string {
  if (!tunedScene) return 'Tuned Scene: Not set';
  const location = tunedScene.city && tunedScene.state ? `${tunedScene.city}, ${tunedScene.state}` : tunedScene.name;
  const community = tunedScene.musicCommunity ? ` — ${tunedScene.musicCommunity}` : '';
  return `Tuned Scene: ${location}${community}`;
}

export default function SceneContextBadge({ homeScene, tunedScene, isVisitor }: SceneContextBadgeProps) {
  const hasResolvedContext = Boolean(homeScene || tunedScene);
  const presenceLabel = !hasResolvedContext ? 'Context unset' : isVisitor ? 'Visitor' : 'Local';
  const presenceClassName = !hasResolvedContext
    ? 'border-black/15 bg-white text-black/60'
    : isVisitor
      ? 'border-[rgba(160,116,33,0.25)] bg-[rgba(244,220,133,0.35)] text-[var(--ink-main)]'
      : 'border-[rgba(142,45,37,0.22)] bg-[rgba(255,255,255,0.72)] text-[var(--ink-main)]';

  return (
    <div className="mt-3 flex flex-wrap gap-2 text-xs">
      <span className="plot-embossed-label px-3 py-1 text-[10px] font-semibold normal-case tracking-[0.08em] text-[var(--ink-main)]">
        {formatHome(homeScene)}
      </span>
      <span className="plot-embossed-label px-3 py-1 text-[10px] font-semibold normal-case tracking-[0.08em] text-[var(--ink-main)]">
        {formatTuned(tunedScene)}
      </span>
      <span
        className={`rounded-full border px-3 py-1 font-medium uppercase tracking-[0.18em] ${presenceClassName}`}
      >
        {presenceLabel}
      </span>
    </div>
  );
}
