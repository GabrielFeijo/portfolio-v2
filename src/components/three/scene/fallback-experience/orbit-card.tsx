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
      className="group cursor-pointer flex min-w-0 items-center gap-3 rounded-xl border border-[rgba(223,181,59,0.1)] bg-[linear-gradient(180deg,rgba(255,255,255,0.02)_0%,rgba(255,255,255,0.01)_100%)] px-3 py-3 text-left transition hover:-translate-y-px hover:border-[rgba(223,181,59,0.26)] hover:bg-[rgba(223,181,59,0.04)] hover:shadow-[0_12px_28px_rgba(0,0,0,0.18)] focus-visible:-translate-y-px focus-visible:border-[rgba(223,181,59,0.3)] focus-visible:bg-[rgba(223,181,59,0.04)] focus-visible:shadow-[0_0_0_1px_rgba(223,181,59,0.14)] focus-visible:outline-none"
    >
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[rgba(223,181,59,0.18)] bg-[rgba(223,181,59,0.08)] text-[#FFD67A] shadow-[0_0_24px_rgba(223,181,59,0.06)] transition group-hover:border-[rgba(223,181,59,0.3)] group-hover:text-[#FFE7A8]">
        <Icon size={18} />
      </span>
      <span className="min-w-0">
        <span className="block font-mono-space text-[10px] uppercase tracking-[0.18em] text-[rgba(255,214,122,0.38)]">
          {String(index + 1).padStart(2, '0')}
        </span>
        <strong className="mt-1 block truncate text-sm font-semibold text-[#FFF7E6] group-hover:text-[#FFF1C7]">
          {t(`planets.${planet.id}.name`)}
        </strong>
        <span className="mt-1 block text-xs leading-5 text-[rgba(240,244,255,0.54)]">
          {t(`planets.${planet.id}.subtitle`)}
        </span>
      </span>
    </button>
  );
}
