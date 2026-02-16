'use client';

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
}

export default function MetricCard({ title, value, subtitle, icon }: MetricCardProps) {
  return (
    <div className="p-4 rounded-xl bg-black/5">
      {icon && <div className="mb-2">{icon}</div>}
      <p className="text-2xl font-semibold text-black">{value}</p>
      <p className="text-xs text-black/60">{title}</p>
      {subtitle && <p className="text-xs text-black/50 mt-1">{subtitle}</p>}
    </div>
  );
}
