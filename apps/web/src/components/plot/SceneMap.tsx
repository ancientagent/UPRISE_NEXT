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
      <div className="plot-wire-grid-bg flex h-full w-full items-center justify-center rounded-[1.15rem] border border-black bg-[#efefe2]">
        <div className="text-center">
          <p className="text-4xl mb-2">🗺️</p>
          <p className="text-sm text-black/60">No map data in this scope</p>
        </div>
      </div>
    );
  }

  return (
    <div className="plot-wire-grid-bg relative flex h-full w-full items-center justify-center overflow-hidden rounded-[1.15rem] border border-black bg-[#efefe2]">
      {markerPositions.map(({ point, x, y, isSelected }) => (
        <button
          key={point.id}
          onClick={() => onSelectPoint?.(point)}
          className={`absolute -translate-x-1/2 -translate-y-1/2 transition-all ${
            isSelected ? 'z-20 scale-110' : 'z-10'
          }`}
          style={{ left: `${x}%`, top: `${y}%` }}
          title={point.label}
        >
          <div className="relative">
            <div
              className={`h-3 w-3 rounded-full border-2 border-black shadow-sm ${
                isSelected ? 'bg-[#b8d63b]' : 'bg-black/70 hover:bg-black'
              }`}
            />
            {isSelected && <div className="absolute inset-[-6px] rounded-full border border-black/40" />}
          </div>
        </button>
      ))}

      <div className="absolute bottom-3 right-3 rounded-full border border-black bg-white px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-black/70">
        {points.length} point{points.length !== 1 ? 's' : ''}
      </div>
    </div>
  );
}
