'use client';

export type TierLevel = 'city' | 'state' | 'national';

interface TierToggleProps {
  value: TierLevel;
  onChange: (value: TierLevel) => void;
}

const tierLabels: Record<TierLevel, { label: string; description: string }> = {
  city: {
    label: 'City Wide',
    description: 'Your immediate music scene',
  },
  state: {
    label: 'State Wide',
    description: 'Regional activity across your state',
  },
  national: {
    label: 'Country Wide',
    description: 'Trending scenes across the country',
  },
};

export default function TierToggle({ value, onChange }: TierToggleProps) {
  return (
    <div className="flex flex-wrap items-center gap-5 rounded-2xl border border-black/10 bg-white/85 px-4 py-3 shadow-sm">
      {(Object.keys(tierLabels) as TierLevel[]).map((tier) => (
        <button
          key={tier}
          onClick={() => onChange(tier)}
          className="inline-flex items-center gap-2 text-sm font-medium text-black transition-opacity hover:opacity-80"
          aria-pressed={value === tier}
        >
          <span
            className={`h-3.5 w-3.5 rounded-full border ${
              value === tier ? 'border-[#b7d43f] bg-[#b7d43f]' : 'border-black/60 bg-transparent'
            }`}
            aria-hidden
          />
          <span>{tierLabels[tier].label}</span>
        </button>
      ))}
    </div>
  );
}
