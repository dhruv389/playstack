import type { ReactNode } from 'react';
import { cn } from '../../utils/helpers';

type Tone = 'success' | 'danger' | 'warning' | 'info' | 'accent' | 'neutral';

const toneClasses: Record<Tone, string> = {
  success: 'bg-success-500/10 text-success-500 ring-1 ring-inset ring-success-500/20',
  danger: 'bg-danger-500/10 text-danger-500 ring-1 ring-inset ring-danger-500/20',
  warning: 'bg-warning-500/10 text-warning-600 ring-1 ring-inset ring-warning-500/20',
  info: 'bg-info-500/10 text-info-500 ring-1 ring-inset ring-info-500/20',
  accent: 'bg-accent-500/10 text-accent-500 ring-1 ring-inset ring-accent-500/25',
  neutral: 'bg-surface-3 text-secondary ring-1 ring-inset ring-default',
};

export function Badge({
  tone = 'neutral',
  children,
  dot,
  className,
}: {
  tone?: Tone;
  children: ReactNode;
  dot?: boolean;
  className?: string;
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium whitespace-nowrap',
        toneClasses[tone],
        className
      )}
    >
      {dot && <span className={cn('h-1.5 w-1.5 rounded-full', `bg-current`)} />}
      {children}
    </span>
  );
}

export function statusTone(status: string): Tone {
  return status === 'Active' ? 'success' : 'danger';
}

export function roleTone(role: string): Tone {
  if (role === 'Super Admin') return 'accent';
  if (role === 'HR Manager') return 'info';
  return 'neutral';
}
