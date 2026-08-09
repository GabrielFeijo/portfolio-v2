import type { LucideIcon, ReactNode } from './types';

export function InfoChip({ children, icon: Icon }: { children: ReactNode; icon: LucideIcon }) {
  return (
    <span className="inline-flex min-h-10 max-w-full items-center gap-2 rounded-full border border-(--accent-border-subtle) bg-(--surface-interactive) px-3 py-1.5 text-sm leading-5 text-(--fallback-text-readable)">
      <Icon size={14} className="shrink-0 text-(--fallback-accent)" />
      <span className="min-w-0 truncate">{children}</span>
    </span>
  );
}

export function ActionButton({
  ariaLabel,
  children,
  onClick,
}: {
  ariaLabel?: string;
  children: ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
      className="cursor-pointer inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full border border-(--accent-border) bg-(--accent-surface-hover) px-4 text-sm font-semibold text-(--fallback-text-bright) transition hover:-translate-y-px hover:border-(--accent-border-hover) hover:bg-(--accent-surface-strong) hover:shadow-(--shadow-action-lg) focus-visible:-translate-y-px focus-visible:border-(--accent-focus) focus-visible:bg-(--accent-surface-strong) focus-visible:shadow-(--shadow-focus-accent) focus-visible:outline-none sm:w-auto"
    >
      {children}
    </button>
  );
}

export function SecondaryActionButton({
  children,
  onClick,
}: {
  children: ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="cursor-pointer inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full border border-(--accent-border-subtle) bg-(--surface-interactive) px-4 text-sm font-semibold text-(--fallback-text-readable) transition hover:-translate-y-px hover:border-(--accent-border-strong) hover:bg-(--accent-surface-faint) hover:text-(--fallback-text-strong) focus-visible:-translate-y-px focus-visible:border-(--accent-border-hover) focus-visible:bg-(--accent-surface-faint) focus-visible:shadow-(--shadow-focus-panel) focus-visible:outline-none sm:w-auto"
    >
      {children}
    </button>
  );
}

export function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-(--accent-border-subtle) bg-(--surface-interactive) p-4 backdrop-blur-sm">
      <div className="font-display text-3xl font-black tracking-display-tight text-(--fallback-text-strong)">
        {value}
      </div>
      <div className="mt-1 font-mono-space text-caption uppercase tracking-caps-lg text-(--fallback-accent-muted)">
        {label}
      </div>
    </div>
  );
}
