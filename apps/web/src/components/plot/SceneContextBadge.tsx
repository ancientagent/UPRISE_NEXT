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
      ? 'border-amber-300 bg-amber-50 text-amber-700'
      : 'border-emerald-300 bg-emerald-50 text-emerald-700';

  return (
    <div className="mt-3 flex flex-wrap gap-2 text-xs">
      <span className="rounded-full border border-black/15 bg-white px-3 py-1 text-black/70">
        {formatHome(homeScene)}
      </span>
      <span className="rounded-full border border-black/15 bg-white px-3 py-1 text-black/70">
        {formatTuned(tunedScene)}
      </span>
      <span className={`rounded-full border px-3 py-1 ${presenceClassName}`}>{presenceLabel}</span>
    </div>
  );
}
