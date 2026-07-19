import { cn } from '../../utils/helpers';

export function Avatar({
  src,
  name,
  size = 'md',
  status,
  className,
}: {
  src?: string;
  name: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  status?: 'Active' | 'Inactive';
  className?: string;
}) {
  const sizeMap = {
    xs: 'h-6 w-6 text-[10px]',
    sm: 'h-8 w-8 text-xs',
    md: 'h-10 w-10 text-sm',
    lg: 'h-14 w-14 text-base',
    xl: 'h-20 w-20 text-xl',
  };
  const ringMap = {
    xs: 'h-1.5 w-1.5',
    sm: 'h-2 w-2',
    md: 'h-2.5 w-2.5',
    lg: 'h-3 w-3',
    xl: 'h-4 w-4',
  };

  const initials = name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <div className={cn('relative inline-block shrink-0', className)}>
      {src ? (
        <img
          src={src}
          alt={name}
          className={cn('rounded-full object-cover ring-2 ring-surface', sizeMap[size])}
        />
      ) : (
        <div
          className={cn(
            'flex items-center justify-center rounded-full bg-accent-500/15 font-semibold text-accent-500 ring-2 ring-surface',
            sizeMap[size]
          )}
        >
          {initials}
        </div>
      )}
      {status && (
        <span
          className={cn(
            'absolute bottom-0 right-0 rounded-full ring-2 ring-surface',
            ringMap[size],
            status === 'Active' ? 'bg-success-500' : 'bg-danger-500'
          )}
        />
      )}
    </div>
  );
}
