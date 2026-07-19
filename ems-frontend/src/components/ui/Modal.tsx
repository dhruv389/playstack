import { type ReactNode, useEffect } from 'react';
import { X } from 'lucide-react';
import { cn } from '../../utils/helpers';

export function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  size = 'md',
  footer,
}: {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  footer?: ReactNode;
}) {
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-xl',
    lg: 'max-w-3xl',
    xl: 'max-w-5xl',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
      <div
        className="absolute inset-0"
        style={{ backgroundColor: 'var(--bg-overlay)' }}
        onClick={onClose}
      />
      <div
        className={cn(
          'relative w-full rounded-2xl border border-default bg-surface shadow-2xl animate-scale-in max-h-[90vh] flex flex-col',
          sizeClasses[size]
        )}
      >
        <div className="flex items-start justify-between border-b border-subtle px-6 py-4 shrink-0">
          <div>
            <h2 className="font-display text-lg font-semibold text-primary">{title}</h2>
            {description && <p className="mt-0.5 text-sm text-secondary">{description}</p>}
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-tertiary hover:bg-surface-2 hover:text-primary focus-ring"
            aria-label="Close dialog"
          >
            <X size={18} />
          </button>
        </div>
        <div className="overflow-y-auto px-6 py-5 grow">{children}</div>
        {footer && <div className="flex items-center justify-end gap-2 border-t border-subtle px-6 py-4 shrink-0">{footer}</div>}
      </div>
    </div>
  );
}
