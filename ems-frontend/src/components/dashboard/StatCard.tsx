import type { ReactNode } from 'react';
import { cn } from '../../utils/helpers';

export function StatCard({
  label,
  value,
  icon,
  tone = 'accent',
  trend,
}: {
  label: string;
  value: string | number;
  icon: ReactNode;
  tone?: 'accent' | 'success' | 'danger' | 'info';
  trend?: string;
}) {
  const toneClasses = {
    accent: 'bg-accent-500/10 text-accent-500',
    success: 'bg-success-500/10 text-success-500',
    danger: 'bg-danger-500/10 text-danger-500',
    info: 'bg-info-500/10 text-info-500',
  };

  return (
    <div className="rounded-2xl border border-default bg-surface p-5 transition-shadow hover:shadow-md">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-secondary">{label}</p>
          <p className="mt-2 font-display text-3xl font-semibold text-primary font-mono-num">{value}</p>
          {trend && <p className="mt-1.5 text-xs text-success-500">{trend}</p>}
        </div>
        <div className={cn('flex h-11 w-11 items-center justify-center rounded-xl', toneClasses[tone])}>
          {icon}
        </div>
      </div>
    </div>
  );
}
