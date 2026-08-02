import { ExternalLink } from 'lucide-react';
import type { LucideIcon, ReactNode } from './types';

export function InfoChip({ children, icon: Icon }: { children: ReactNode; icon: LucideIcon }) {
  return (
    <span className="inline-flex min-h-10 max-w-full items-center gap-2 rounded-full border border-[rgba(223,181,59,0.12)] bg-[rgba(255,255,255,0.03)] px-3 py-1.5 text-sm leading-5 text-[rgba(240,244,255,0.78)]">
      <Icon size={14} className="shrink-0 text-[#FFD67A]" />
      <span className="min-w-0 truncate">{children}</span>
    </span>
  );
}

export function ActionButton({
  ariaLabel,
  children,
  compact = false,
  onClick,
}: {
  ariaLabel?: string;
  children: ReactNode;
  compact?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
      className={`cursor-pointer inline-flex items-center justify-center gap-2 rounded-full border border-[rgba(223,181,59,0.22)] bg-[rgba(223,181,59,0.1)] font-semibold text-[#FFF1C7] transition hover:-translate-y-px hover:border-[rgba(223,181,59,0.38)] hover:bg-[rgba(223,181,59,0.16)] hover:shadow-[0_8px_24px_rgba(223,181,59,0.08)] focus-visible:-translate-y-px focus-visible:border-[rgba(223,181,59,0.42)] focus-visible:bg-[rgba(223,181,59,0.16)] focus-visible:shadow-[0_0_0_1px_rgba(223,181,59,0.18)] focus-visible:outline-none ${compact ? 'min-h-10 px-3 text-sm' : 'min-h-11 w-full px-4 text-sm sm:w-auto'}`}
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
      className="cursor-pointer inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full border border-[rgba(223,181,59,0.12)] bg-[rgba(255,255,255,0.03)] px-4 text-sm font-semibold text-[rgba(240,244,255,0.88)] transition hover:-translate-y-px hover:border-[rgba(223,181,59,0.24)] hover:bg-[rgba(223,181,59,0.05)] hover:text-[#FFF7E6] focus-visible:-translate-y-px focus-visible:border-[rgba(223,181,59,0.32)] focus-visible:bg-[rgba(223,181,59,0.05)] focus-visible:shadow-[0_0_0_1px_rgba(223,181,59,0.14)] focus-visible:outline-none sm:w-auto"
    >
      {children}
    </button>
  );
}

export function HeaderLink({
  ariaLabel,
  children,
  href,
}: {
  ariaLabel: string;
  children: ReactNode;
  href: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer noopener"
      aria-label={ariaLabel}
      className="cursor-pointer inline-flex min-h-10 items-center gap-2 rounded-full border border-[rgba(223,181,59,0.12)] bg-[rgba(255,255,255,0.03)] px-3 text-sm font-medium text-[rgba(240,244,255,0.82)] transition hover:-translate-y-px hover:border-[rgba(223,181,59,0.24)] hover:bg-[rgba(223,181,59,0.05)] hover:text-[#FFF7E6] focus-visible:-translate-y-px focus-visible:border-[rgba(223,181,59,0.32)] focus-visible:bg-[rgba(223,181,59,0.05)] focus-visible:shadow-[0_0_0_1px_rgba(223,181,59,0.14)] focus-visible:outline-none"
    >
      {children}
      <ExternalLink size={13} className="text-[rgba(255,214,122,0.68)]" />
    </a>
  );
}

export function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-[rgba(223,181,59,0.1)] bg-[rgba(255,255,255,0.03)] p-4 backdrop-blur-sm">
      <div className="font-display text-3xl font-black tracking-[-0.05em] text-[#FFF7E6]">{value}</div>
      <div className="mt-1 font-mono-space text-[10px] uppercase tracking-[0.18em] text-[rgba(255,214,122,0.48)]">
        {label}
      </div>
    </div>
  );
}
