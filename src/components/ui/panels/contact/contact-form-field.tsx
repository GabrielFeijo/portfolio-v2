import type { ReactNode } from 'react';
import { cn } from '../panel-primitives';

interface ContactFormFieldProps {
  errorId?: string;
  error?: string;
  helperText?: string;
  input: ReactNode;
  label: string;
}

export function ContactFormField({
  errorId,
  error,
  helperText,
  input,
  label,
}: ContactFormFieldProps) {
  return (
    <label className="flex flex-col gap-2">
      <span className="font-mono-space text-label uppercase tracking-caps-lg text-(--text-secondary)">
        {label}
      </span>
      {input}
      <div className="flex min-h-5 items-start justify-between gap-3">
        <span
          id={errorId}
          className={cn(
            'text-xs leading-5',
            error ? 'text-(--status-error)' : 'text-(--text-muted)'
          )}
        >
          {error ?? ''}
        </span>
        {helperText && (
          <span className="text-label leading-5 text-(--text-muted)">{helperText}</span>
        )}
      </div>
    </label>
  );
}

export function getContactFieldClassName(hasError: boolean, extraClassName?: string) {
  return cn(
    'px-4 py-3 panel-input text-sm transition-colors cursor-none',
    hasError && 'border-(--status-error) shadow-(--shadow-error-focus)',
    extraClassName
  );
}
