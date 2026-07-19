import { type InputHTMLAttributes, type SelectHTMLAttributes, forwardRef } from 'react';
import { cn } from '../../utils/helpers';

interface FieldWrapperProps {
  label?: string;
  error?: string;
  hint?: string;
  required?: boolean;
  children: React.ReactNode;
}

export function FieldWrapper({ label, error, hint, required, children }: FieldWrapperProps) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-xs font-medium text-secondary">
          {label} {required && <span className="text-danger-500">*</span>}
        </label>
      )}
      {children}
      {error ? (
        <span className="text-xs text-danger-500">{error}</span>
      ) : hint ? (
        <span className="text-xs text-tertiary">{hint}</span>
      ) : null}
    </div>
  );
}

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  wrapperClassName?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, required, className, wrapperClassName, ...rest }, ref) => {
    return (
      <div className={wrapperClassName}>
        <FieldWrapper label={label} error={error} hint={hint} required={required}>
          <input
            ref={ref}
            className={cn(
              'w-full rounded-lg border bg-surface px-3.5 py-2.5 text-sm text-primary placeholder:text-tertiary',
              'transition-colors focus-ring outline-none',
              error ? 'border-danger-500' : 'border-default focus:border-accent-500',
              className
            )}
            {...rest}
          />
        </FieldWrapper>
      </div>
    );
  }
);
Input.displayName = 'Input';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  hint?: string;
  options: { value: string; label: string }[];
  placeholder?: string;
  wrapperClassName?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, hint, required, options, placeholder, className, wrapperClassName, ...rest }, ref) => {
    return (
      <div className={wrapperClassName}>
        <FieldWrapper label={label} error={error} hint={hint} required={required}>
          <div className="relative">
            <select
              ref={ref}
              className={cn(
                'w-full rounded-lg border bg-surface px-3.5 py-2.5 text-sm text-primary',
                'transition-colors focus-ring outline-none appearance-none cursor-pointer pr-9',
                error ? 'border-danger-500' : 'border-default focus:border-accent-500',
                className
              )}
              {...rest}
            >
              {placeholder && <option value="">{placeholder}</option>}
              {options.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <svg
              className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-tertiary"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M6 9l6 6 6-6" />
            </svg>
          </div>
        </FieldWrapper>
      </div>
    );
  }
);
Select.displayName = 'Select';
