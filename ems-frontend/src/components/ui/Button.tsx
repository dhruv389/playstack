import { type ButtonHTMLAttributes, type ReactNode } from 'react';
import { cn } from '../../utils/helpers';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  icon?: ReactNode;
  isLoading?: boolean;
  fullWidth?: boolean;
}

const variantClasses: Record<Variant, string> = {
  primary:
    'bg-accent-500 text-white hover:bg-accent-600 shadow-[0_1px_0_0_rgba(255,255,255,0.15)_inset] disabled:bg-accent-500/40',
  secondary: 'bg-surface-2 text-primary hover:bg-surface-3 border border-default',
  ghost: 'bg-transparent text-secondary hover:bg-surface-2 hover:text-primary',
  danger: 'bg-danger-500 text-white hover:bg-danger-600',
  outline: 'bg-transparent border border-default text-primary hover:bg-surface-2',
};

const sizeClasses: Record<Size, string> = {
  sm: 'text-xs px-3 py-1.5 gap-1.5 rounded-lg',
  md: 'text-sm px-4 py-2.5 gap-2 rounded-xl',
  lg: 'text-sm px-5 py-3 gap-2 rounded-xl',
};

export function Button({
  variant = 'primary',
  size = 'md',
  icon,
  isLoading,
  fullWidth,
  className,
  children,
  disabled,
  ...rest
}: ButtonProps) {
  return (
    <button
      disabled={disabled || isLoading}
      className={cn(
        'inline-flex items-center justify-center font-medium transition-all duration-150',
        'active:scale-[0.98] disabled:cursor-not-allowed disabled:active:scale-100 focus-ring',
        variantClasses[variant],
        sizeClasses[size],
        fullWidth && 'w-full',
        className
      )}
      {...rest}
    >
      {isLoading ? (
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      ) : (
        icon
      )}
      {children}
    </button>
  );
}
