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
    ? 'bg-white text-black/60'
    : isVisitor
      ? 'bg-[#f5e8bf] text-black'
      : 'bg-[#b8d63b] text-black';

  return (
    <div className="mt-3 flex flex-wrap gap-2 text-xs">
      <span className="plot-wire-chip normal-case tracking-[0.06em] text-[11px] font-medium">
        {formatHome(homeScene)}
      </span>
      <span className="plot-wire-chip normal-case tracking-[0.06em] text-[11px] font-medium">
        {formatTuned(tunedScene)}
      </span>
      <span className={`plot-wire-chip tracking-[0.12em] ${presenceClassName}`}>{presenceLabel}</span>
    </div>
  );
}
