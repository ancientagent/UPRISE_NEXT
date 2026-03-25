'use client';

import { useMemo } from 'react';

export interface SceneMapPoint {
  id: string;
  label: string;
  lat: number | null;
  lng: number | null;
  memberCount: number;
  activeTracks: number;
  activeSects: number;
  eventsThisWeek: number;
  kind: 'community' | 'city' | 'state';
}

interface SceneMapProps {
  points: SceneMapPoint[];
  selectedPointId?: string | null;
  onSelectPoint?: (point: SceneMapPoint) => void;
}

export default function SceneMap({ points, selectedPointId, onSelectPoint }: SceneMapProps) {
  const markerPositions = useMemo(() => {
    const withCoords = points.filter((p) => p.lat !== null && p.lng !== null);

    if (withCoords.length >= 2) {
      const lats = withCoords.map((p) => p.lat as number);
      const lngs = withCoords.map((p) => p.lng as number);
      const minLat = Math.min(...lats);
      const maxLat = Math.max(...lats);
      const minLng = Math.min(...lngs);
      const maxLng = Math.max(...lngs);
      const latRange = Math.max(maxLat - minLat, 0.0001);
      const lngRange = Math.max(maxLng - minLng, 0.0001);

      return points.map((point, index) => {
        if (point.lat !== null && point.lng !== null) {
          const x = 10 + ((point.lng - minLng) / lngRange) * 80;
          const y = 12 + (1 - (point.lat - minLat) / latRange) * 76;
          return {
            point,
            x,
            y,
            isSelected: selectedPointId === point.id,
          };
        }

        const angle = (index / Math.max(points.length, 1)) * 2 * Math.PI;
        const radius = 28 + (index % 3) * 6;
        return {
          point,
          x: 50 + Math.cos(angle) * radius,
          y: 50 + Math.sin(angle) * radius,
          isSelected: selectedPointId === point.id,
        };
      });
    }

    return points.map((point, index) => {
      const count = Math.min(points.length, 12);
      const angle = (index / Math.max(count, 1)) * 2 * Math.PI;
      const distance = 24 + (index % 4) * 7;
      return {
        point,
        x: 50 + Math.cos(angle) * distance,
        y: 50 + Math.sin(angle) * distance,
        isSelected: selectedPointId === point.id,
      };
    });
  }, [points, selectedPointId]);

  if (points.length === 0) {
    return (
      <div className="plot-zine-card h-full w-full rounded-2xl flex items-center justify-center">
        <div className="text-center">
          <p className="text-4xl mb-2">🗺️</p>
          <p className="text-sm plot-ink-muted">No map data in this scope</p>
        </div>
      </div>
    );
  }

  return (
    <div className="plot-ledger-card h-full w-full rounded-[1.4rem] flex items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 opacity-35">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="36" height="36" patternUnits="userSpaceOnUse">
              <path d="M 36 0 L 0 0 0 36" fill="none" stroke="rgba(96,73,48,0.45)" strokeWidth="0.7" strokeDasharray="2 2" />
            </pattern>
            <pattern id="crosshatch" width="12" height="12" patternUnits="userSpaceOnUse" patternTransform="rotate(32)">
              <line x1="0" y1="0" x2="0" y2="12" stroke="rgba(142,45,37,0.12)" strokeWidth="2" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#crosshatch)" />
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      <div className="pointer-events-none absolute inset-[10px] rounded-[1.1rem] border border-dashed border-[rgba(96,73,48,0.26)]" />

      {markerPositions.map(({ point, x, y, isSelected }) => (
        <button
          key={point.id}
          onClick={() => onSelectPoint?.(point)}
          className={`absolute transform -translate-x-1/2 -translate-y-1/2 transition-all ${
            isSelected ? 'z-20 scale-110' : 'z-10'
          }`}
          style={{ left: `${x}%`, top: `${y}%` }}
          title={point.label}
        >
          <div className="relative">
            <div
              className={`h-4 w-4 rounded-full border-2 shadow-sm transition-colors ${
                isSelected
                  ? 'border-[var(--red-pen)] bg-[var(--highlighter)]'
                  : 'border-[rgba(43,31,20,0.3)] bg-[rgba(35,24,15,0.72)] hover:bg-[rgba(35,24,15,0.92)]'
              }`}
            />
            {isSelected ? (
              <>
                <div className="absolute -inset-1 rounded-full border-2 border-[var(--red-pen)] opacity-80" />
                <div className="absolute -inset-2 rounded-full border border-[rgba(142,45,37,0.45)]" />
              </>
            ) : null}
          </div>
        </button>
      ))}

      <div className="plot-embossed-label absolute bottom-3 right-3 px-3 py-2 text-[10px]">
        {points.length} point{points.length !== 1 ? 's' : ''}
      </div>

      <div className="absolute left-3 top-3 rounded-full bg-[rgba(243,224,96,0.82)] px-3 py-1 text-[11px] text-[var(--red-pen)] shadow-[0_0_0_2px_rgba(142,45,37,0.14)]">
        map notes
      </div>
    </div>
  );
}
