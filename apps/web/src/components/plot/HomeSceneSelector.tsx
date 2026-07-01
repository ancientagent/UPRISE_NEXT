import { useMemo, useRef, type PointerEvent } from 'react';
import { Button } from '@uprise/ui';
import type {
  HomeSceneSelector as HomeSceneSelectorModel,
  HomeSceneSelectorItem,
} from '@/lib/users/client';

interface HomeSceneSelectorProps {
  selector: HomeSceneSelectorModel;
  selectedCommunityId: string | null;
  selectedCommunityLabel: string | null;
  loading: boolean;
  error: string | null;
  selectingSceneId: string | null;
  onSelect: (item: HomeSceneSelectorItem) => void;
}

const formatPrimaryLabel = (item: HomeSceneSelectorItem): string => {
  if (item.city && item.musicCommunity) {
    return `${item.city} ${item.musicCommunity}`;
  }

  return item.sceneName;
};

const formatSecondaryLabel = (item: HomeSceneSelectorItem): string => {
  if (item.city && item.state) {
    return `${item.city}, ${item.state}`;
  }

  return item.sceneName;
};

export default function HomeSceneSelector({
  selector,
  selectedCommunityId,
  selectedCommunityLabel,
  loading,
  error,
  selectingSceneId,
  onSelect,
}: HomeSceneSelectorProps) {
  const dragStartX = useRef<number | null>(null);
  const activeIndex = useMemo(() => {
    if (selector.items.length === 0) return -1;

    const selectedIndex = selector.items.findIndex((item) => item.sceneId === selectedCommunityId);
    if (selectedIndex >= 0) return selectedIndex;

    const currentIndex = selector.items.findIndex((item) => item.isCurrent);
    return currentIndex >= 0 ? currentIndex : 0;
  }, [selector.items, selectedCommunityId]);

  const activeItem = activeIndex >= 0 ? selector.items[activeIndex] : null;
  const previousItem =
    selector.items.length > 1 && activeIndex >= 0
      ? selector.items[(activeIndex - 1 + selector.items.length) % selector.items.length]
      : null;
  const nextItem =
    selector.items.length > 1 && activeIndex >= 0
      ? selector.items[(activeIndex + 1) % selector.items.length]
      : null;

  const handleAdjacentSelect = (item: HomeSceneSelectorItem | null) => {
    if (!item) return;
    onSelect(item);
  };

  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (selector.items.length < 2) return;
    dragStartX.current = event.clientX;
  };

  const handlePointerUp = (event: PointerEvent<HTMLDivElement>) => {
    if (selector.items.length < 2) return;

    const startX = dragStartX.current;
    dragStartX.current = null;
    if (startX === null) return;

    const deltaX = event.clientX - startX;
    if (Math.abs(deltaX) < 48) return;

    handleAdjacentSelect(deltaX > 0 ? previousItem : nextItem);
  };

  return (
    <section
      data-slot="home-scene-selector"
      className="mt-3 rounded-[1.15rem] border border-black bg-[#efefe2] p-3 shadow-[2px_2px_0_rgba(0,0,0,0.2)]"
    >
      <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-black">
            {selector.currentLocation
              ? `${selector.currentLocation.city}, ${selector.currentLocation.state}`
              : selectedCommunityLabel ?? 'Current city context'}
          </p>
        </div>
        <p className="max-w-xl text-xs text-black/60">
          Switch between registered music communities that resolve in your current city context. Saved
          Away Scenes stay in your profile collection.
        </p>
      </div>

      {loading ? (
        <p className="mt-3 text-sm text-black/60">Loading Home Scene options...</p>
      ) : error ? (
        <p className="mt-3 rounded-xl border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      ) : activeItem ? (
        <div className="mt-3 grid grid-cols-[minmax(0,1fr)_minmax(11rem,1.2fr)_minmax(0,1fr)] items-stretch gap-2">
          <Button
            type="button"
            size="sm"
            variant="outline"
            aria-label="Switch to previous Home Scene"
            className="min-h-[5rem] justify-start rounded-[1rem] border-black bg-white px-3 py-2 text-left text-black hover:bg-black/5 disabled:opacity-45"
            disabled={!previousItem || Boolean(selectingSceneId)}
            onClick={() => handleAdjacentSelect(previousItem)}
          >
            <span className="block w-full">
              <span className="block text-xs font-semibold uppercase tracking-[0.14em] text-black/45">
                &larr; Previous
              </span>
              <span className="mt-1 block truncate text-sm font-semibold">
                {previousItem ? formatPrimaryLabel(previousItem) : 'Previous Home Scene'}
              </span>
            </span>
          </Button>

          <div
            role="group"
            aria-label="Current Home Scene"
            onPointerDown={handlePointerDown}
            onPointerUp={handlePointerUp}
            onPointerCancel={() => {
              dragStartX.current = null;
            }}
            className="select-none rounded-[1.15rem] border border-black bg-[#b8d63b] px-4 py-3 text-center text-black shadow-[2px_2px_0_rgba(0,0,0,0.22)]"
          >
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-black/55">
              Current Home Scene
            </p>
            <p className="mt-1 text-lg font-black leading-tight">{formatPrimaryLabel(activeItem)}</p>
            <p className="mt-0.5 text-xs text-black/65">{formatSecondaryLabel(activeItem)}</p>
            <span className="mt-2 inline-flex flex-wrap justify-center gap-1">
              <span className="rounded-full border border-black/20 bg-white/70 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.1em] text-black/70">
                {activeItem.resolution === 'proxy' ? 'Proxy Scene' : 'Home Scene'}
              </span>
              {activeItem.isDefault ? (
                <span className="rounded-full border border-black/20 bg-white/70 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.1em] text-black/70">
                  Default
                </span>
              ) : null}
              {selectingSceneId === activeItem.sceneId ? (
                <span className="rounded-full border border-black/20 bg-white/70 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.1em] text-black/70">
                  Switching
                </span>
              ) : null}
            </span>
            {selector.items.length > 1 ? (
              <p className="mt-2 text-[11px] font-medium text-black/55">
                Swipe or use arrows to switch scenes.
              </p>
            ) : null}
          </div>

          <Button
            type="button"
            size="sm"
            variant="outline"
            aria-label="Switch to next Home Scene"
            className="min-h-[5rem] justify-start rounded-[1rem] border-black bg-white px-3 py-2 text-left text-black hover:bg-black/5 disabled:opacity-45"
            disabled={!nextItem || Boolean(selectingSceneId)}
            onClick={() => handleAdjacentSelect(nextItem)}
          >
            <span className="block w-full">
              <span className="block text-xs font-semibold uppercase tracking-[0.14em] text-black/45">
                Next &rarr;
              </span>
              <span className="mt-1 block truncate text-sm font-semibold">
                {nextItem ? formatPrimaryLabel(nextItem) : 'Next Home Scene'}
              </span>
            </span>
          </Button>
        </div>
      ) : (
        <p className="mt-3 text-sm text-black/60">
          No additional registered music-community Home Scenes are available in this city context yet.
        </p>
      )}
    </section>
  );
}
