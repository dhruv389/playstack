import type { ReactNode } from 'react';

export function EmptyState({
  icon,
  title,
  description,
  action,
}: {
  icon: ReactNode;
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 px-6 py-16 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-surface-2 text-tertiary">
        {icon}
      </div>
      <div>
        <h3 className="font-display text-sm font-semibold text-primary">{title}</h3>
        <p className="mt-1 max-w-sm text-sm text-secondary">{description}</p>
      </div>
      {action}
    </div>
  );
}
