import type { ReactNode } from 'react';
import { Button } from '@uprise/ui';

export type PlotTabSurfaceTab = 'Feed' | 'Events' | 'Archive';

interface PlotTabSurfaceProps {
  tabs: readonly PlotTabSurfaceTab[];
  activeTab: PlotTabSurfaceTab;
  heading: string;
  description: ReactNode;
  body: ReactNode;
  onTabChange: (tab: PlotTabSurfaceTab) => void;
}

export default function PlotTabSurface({
  tabs,
  activeTab,
  heading,
  description,
  body,
  onTabChange,
}: PlotTabSurfaceProps) {
  return (
    <>
      <section className="mt-4 flex flex-wrap items-end justify-start gap-2 overflow-x-auto px-2 pt-1">
        {tabs.map((tab) => (
          <Button
            key={tab}
            size="sm"
            variant={activeTab === tab ? 'default' : 'outline'}
            className={
              activeTab === tab
                ? 'plot-wire-tab plot-wire-tab-active h-auto'
                : 'plot-wire-tab h-auto hover:bg-[#e7e7d8]'
            }
            onClick={() => onTabChange(tab)}
          >
            {tab}
          </Button>
        ))}
      </section>

      <section className="border border-black bg-[#d8d8c8] p-3">
        <div className="plot-wire-panel">
          <div className="mb-4 rounded-[1rem] border border-black bg-[#efefe2] px-4 py-3">
            <p className="plot-wire-label">Active Surface</p>
            <h2 className="mt-1 text-lg font-semibold text-black">{heading}</h2>
            <p className="mt-1 text-sm text-black/65">{description}</p>
          </div>

          {body}
        </div>
      </section>
    </>
  );
}
