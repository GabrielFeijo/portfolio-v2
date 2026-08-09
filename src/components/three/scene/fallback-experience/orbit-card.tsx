import { PANEL_ICON_MAP } from './icon-map';
import type { Planet } from '@/types/portfolio';
import { useTranslation } from 'react-i18next';

export function OrbitCard({
  index,
  onOpen,
  planet,
}: {
  index: number;
  onOpen: (panel: Planet['id']) => void;
  planet: Planet;
}) {
  const { t } = useTranslation();
  const Icon = PANEL_ICON_MAP[planet.id];

  return (
    <button
      type="button"
      onClick={() => onOpen(planet.id)}
      className="group cursor-pointer flex min-w-0 items-center gap-3 rounded-xl border border-(--accent-border-subtle) bg-[linear-gradient(180deg,var(--surface-interactive-faint)_0%,transparent_100%)] px-3 py-3 text-left transition hover:-translate-y-px hover:border-(--accent-border-strong) hover:bg-(--accent-surface-faint) hover:shadow-(--shadow-card) focus-visible:-translate-y-px focus-visible:border-(--accent-border-hover) focus-visible:bg-(--accent-surface-faint) focus-visible:shadow-(--shadow-focus-panel) focus-visible:outline-none"
    >
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-(--accent-border) bg-(--accent-surface) text-(--fallback-accent) shadow-(--shadow-fallback-icon-subtle) transition group-hover:border-(--accent-border-hover) group-hover:text-(--fallback-accent-hover)">
        <Icon size={18} />
      </span>
      <span className="min-w-0">
        <span className="block font-mono-space text-caption uppercase tracking-caps-lg text-(--fallback-accent-muted)">
          {String(index + 1).padStart(2, '0')}
        </span>
        <strong className="mt-1 block truncate text-sm font-semibold text-(--fallback-text-strong) group-hover:text-(--fallback-text-bright)">
          {t(`planets.${planet.id}.name`)}
        </strong>
        <span className="mt-1 block text-xs leading-5 text-(--fallback-text-subtle)">
          {t(`planets.${planet.id}.subtitle`)}
        </span>
      </span>
    </button>
  );
}
