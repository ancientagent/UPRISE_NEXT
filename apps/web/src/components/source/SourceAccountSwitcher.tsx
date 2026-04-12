'use client';

import { Button } from '@uprise/ui';
import { formatArtistBandEntityType } from '@/lib/registrar/artistBandLabels';
import { useSourceAccountStore } from '@/store/source-account';

export type SourceAccountSummary = {
  id: string;
  name: string;
  slug: string;
  entityType: string;
  membershipRole: string | null;
};

type SourceAccountSwitcherProps = {
  sources: SourceAccountSummary[];
  onSelectSource?: (source: SourceAccountSummary) => void;
  onSelectListener?: () => void;
};

export function SourceAccountSwitcher({
  sources,
  onSelectSource,
  onSelectListener,
}: SourceAccountSwitcherProps) {
  const { activeSourceId, setActiveSourceId, clearActiveSourceId } = useSourceAccountStore();
  const activeSource = sources.find((source) => source.id === activeSourceId) ?? null;

  if (sources.length === 0) {
    return null;
  }

  return (
    <div className="plot-wire-panel">
      <p className="plot-wire-label">Source Accounts</p>
      <h3 className="mt-2 text-lg font-semibold text-black">Switch account context</h3>
      <p className="mt-1 text-sm text-black/65">
        Stay signed into one account and switch into the source accounts you manage.
      </p>

      <div className="mt-4 rounded-[1rem] border border-black bg-[#f7f1df] px-4 py-3 text-sm text-black shadow-[3px_3px_0_rgba(0,0,0,0.18)]">
        <p className="plot-wire-label">Current Context</p>
        <p className="mt-1 font-medium text-black">
          {activeSource ? activeSource.name : 'Listener Account'}
        </p>
        <p className="mt-1 text-xs text-black/65">
          {activeSource
            ? `${formatArtistBandEntityType(activeSource.entityType)} • ${activeSource.slug}${activeSource.membershipRole ? ` • ${activeSource.membershipRole}` : ''}`
            : 'Listener/community participation mode'}
        </p>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <Button
          size="sm"
          variant="outline"
          className={
            activeSource == null
              ? 'rounded-full border-black bg-[#b8d63b] text-xs font-semibold uppercase tracking-[0.12em] text-black'
              : 'rounded-full border-black bg-white text-xs font-semibold uppercase tracking-[0.12em] text-black'
          }
          onClick={() => {
            clearActiveSourceId();
            onSelectListener?.();
          }}
        >
          Listener Account
        </Button>
        {sources.map((source) => (
          <Button
            key={source.id}
            size="sm"
            variant="outline"
            className={
              activeSource?.id === source.id
                ? 'rounded-full border-black bg-[#b8d63b] text-xs font-semibold uppercase tracking-[0.12em] text-black'
                : 'rounded-full border-black bg-white text-xs font-semibold uppercase tracking-[0.12em] text-black'
            }
            onClick={() => {
              setActiveSourceId(source.id);
              onSelectSource?.(source);
            }}
          >
            {source.name}
          </Button>
        ))}
      </div>
    </div>
  );
}
