'use client';

export type TierLevel = 'city' | 'state' | 'national';

interface TierToggleProps {
  value: TierLevel;
  onChange: (value: TierLevel) => void;
}

const tierLabels: Record<TierLevel, { label: string; description: string }> = {
  city: {
    label: 'City',
    description: 'Your immediate music scene',
  },
  state: {
    label: 'State',
    description: 'Regional activity across your state',
  },
  national: {
    label: 'National',
    description: 'Trending scenes across the country',
  },
};

export default function TierToggle({ value, onChange }: TierToggleProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {(Object.keys(tierLabels) as TierLevel[]).map((tier) => (
        <button
          key={tier}
          onClick={() => onChange(tier)}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
            value === tier
              ? 'bg-black text-white shadow-sm'
              : 'bg-white text-black border border-black/10 hover:border-black/30 hover:bg-black/5'
          }`}
        >
          {tierLabels[tier].label}
        </button>
      ))}
    </div>
  );
}
