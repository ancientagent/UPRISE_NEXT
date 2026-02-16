'use client';

import { useMemo } from 'react';
import type { CommunityWithDistance } from '@/lib/types/community';

interface SceneMapProps {
  communities: CommunityWithDistance[];
  selectedCommunity: CommunityWithDistance | null;
  onCommunitySelect?: (community: CommunityWithDistance) => void;
}

export default function SceneMap({
  communities,
  selectedCommunity,
  onCommunitySelect,
}: SceneMapProps) {
  // Calculate marker positions in a circular pattern around center
  const markerPositions = useMemo(() => {
    return communities.map((community, index) => {
      // Distribute markers in a circular pattern
      const count = Math.min(communities.length, 12);
      const angle = (index / count) * 2 * Math.PI;
      // Vary distance based on index to create more organic spread
      const baseDistance = 25;
      const distanceVariance = (index % 3) * 8;
      const distance = baseDistance + distanceVariance;
      const x = 50 + Math.cos(angle) * distance;
      const y = 50 + Math.sin(angle) * distance;

      return {
        community,
        x,
        y,
        isSelected: selectedCommunity?.id === community.id,
      };
    });
  }, [communities, selectedCommunity]);

  // Empty state
  if (communities.length === 0) {
    return (
      <div className="h-full w-full rounded-2xl bg-gradient-to-br from-black/5 to-black/10 border border-black/10 flex items-center justify-center">
        <div className="text-center">
          <p className="text-4xl mb-2">🗺️</p>
          <p className="text-sm text-black/60">No communities to display</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full w-full rounded-2xl bg-gradient-to-br from-black/5 to-black/10 border border-black/10 flex items-center justify-center relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-30">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="black" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* Center label */}
      <div className="absolute top-4 left-4 bg-white/80 backdrop-blur-sm px-2 py-1 rounded text-xs text-black/60">
        You are here
      </div>

      {/* User location indicator (center) */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
        <div className="relative">
          <div className="w-4 h-4 rounded-full bg-blue-500 border-2 border-white shadow-lg" />
          <div className="w-10 h-10 rounded-full bg-blue-500/20 absolute -top-3 -left-3 animate-ping" />
        </div>
      </div>

      {/* Community markers */}
      {markerPositions.map(({ community, x, y, isSelected }) => (
        <button
          key={community.id}
          onClick={() => onCommunitySelect?.(community)}
          className={`absolute transform -translate-x-1/2 -translate-y-1/2 transition-all ${
            isSelected ? 'z-20' : 'z-10'
          }`}
          style={{ left: `${x}%`, top: `${y}%` }}
          title={community.name}
        >
          <div
            className={`relative flex items-center justify-center ${
              isSelected ? 'scale-125' : 'scale-100'
            }`}
          >
            {/* Outer ring for selected */}
            {isSelected && (
              <div className="absolute inset-0 rounded-full bg-black/20 animate-pulse" />
            )}
            {/* Marker dot */}
            <div
              className={`w-3 h-3 rounded-full border-2 border-white shadow-sm ${
                isSelected ? 'bg-black' : 'bg-black/60 hover:bg-black/80'
              }`}
            />
            {/* Tooltip on hover */}
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 px-2 py-1 bg-black text-white text-xs rounded whitespace-nowrap opacity-0 hover:opacity-100 transition-opacity pointer-events-none">
              {community.name}
              {community.distance && (
                <span className="text-white/60 ml-1">
                  ({community.distance < 1000
                    ? `${Math.round(community.distance)}m`
                    : `${(community.distance / 1000).toFixed(1)}km`})
                </span>
              )}
            </div>
          </div>
        </button>
      ))}

      {/* Legend */}
      <div className="absolute bottom-4 right-4 bg-white/80 backdrop-blur-sm px-3 py-2 rounded-lg text-xs">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-blue-500" />
          <span className="text-black/60">You</span>
        </div>
        <div className="flex items-center gap-2 mt-1">
          <div className="w-3 h-3 rounded-full bg-black" />
          <span className="text-black/60">Community</span>
        </div>
      </div>
    </div>
  );
}
