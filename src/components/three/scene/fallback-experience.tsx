import { DEVELOPER } from '@/data/portfolio';
import { ArrowUpRight, MapPin, Sparkles } from 'lucide-react';
import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

const FLOW_STEPS = ['product', 'interface', 'api', 'cloud'] as const;
const STACK = ['TypeScript', 'React', 'Node.js', 'Java', 'Cloud', 'DevOps', 'Three.js', 'Vite'];
const QUICK_LINKS = [
  { href: '#about', label: 'About' },
  { href: '#skills', label: 'Skills' },
  { href: '#projects', label: 'Projects' },
  { href: '#experience', label: 'Experience' },
  { href: '#accomplishments', label: 'Achievements' },
  { href: '#contact', label: 'Contact' },
] as const;

export function FallbackExperience() {
  const { t } = useTranslation();

  return (
    <section
      className="absolute inset-0 isolate overflow-hidden bg-[radial-gradient(circle_at_58%_45%,rgba(223,181,59,0.14),transparent_25%),radial-gradient(circle_at_78%_20%,rgba(245,158,11,0.08),transparent_20%),linear-gradient(145deg,#02050d_0%,#05070c_54%,#02050b_100%)]"
      data-testid="scene-2d-fallback"
      aria-label={t('fallback_2d.aria')}
    >
      <div
        className="absolute inset-0 bg-[linear-gradient(rgba(223,181,59,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(223,181,59,0.08)_1px,transparent_1px)] bg-size-[48px_48px] opacity-20 mask-[radial-gradient(circle_at_60%_46%,black,transparent_72%)]"
        aria-hidden="true"
      />

      <Orbit
        className="size-[min(62vw,760px)] animate-[spin_70s_linear_infinite] max-md:size-[120vw]"
        reverse={false}
      />
      <Orbit
        className="size-[min(44vw,520px)] animate-[spin_52s_linear_infinite_reverse] border-dashed max-md:size-[82vw]"
        reverse
      />

      <div className="absolute top-31 right-18 bottom-23.5 left-[clamp(248px,23vw,340px)] z-2 grid place-items-center max-[900px]:top-28 max-[900px]:right-6.5 max-[900px]:bottom-38.5 max-[900px]:left-55 max-md:inset-x-3 max-md:top-20.5 max-md:bottom-37.5">
        <main className="relative w-[min(640px,72%)] rounded-[18px] border border-[rgba(223,181,59,0.18)] bg-[linear-gradient(145deg,rgba(8,9,12,0.92),rgba(4,5,10,0.82))] p-7.5 shadow-[0_30px_100px_rgba(0,0,0,0.42),inset_0_1px_rgba(255,255,255,0.04)] backdrop-blur-lg max-[900px]:w-[90%] max-md:w-[min(100%,500px)] max-md:p-5.5 [@media(max-height:690px)]:p-4.5">
          <div className="flex items-center gap-2.5 font-mono-space text-[9px] font-semibold tracking-[0.22em] text-[rgba(223,181,59,0.84)] uppercase">
            <span
              className="size-1.5 animate-pulse rounded-full bg-emerald-300 shadow-[0_0_12px_rgba(94,224,160,0.8)]"
              aria-hidden="true"
            />
            {t('fallback_2d.eyebrow')}
          </div>

          <div className="mt-4 flex items-start justify-between gap-4 max-md:flex-col">
            <h1 className="mt-2 max-w-[14ch] font-display text-[clamp(28px,3.2vw,46px)] leading-[1.02] font-bold tracking-[-0.045em] text-slate-50 max-md:text-[clamp(25px,8vw,38px)]">
              {t('fallback_2d.title')}
            </h1>

            <div className="flex items-center gap-2 rounded-full border border-[rgba(223,181,59,0.18)] bg-[rgba(223,181,59,0.05)] px-2.5 py-1.5 font-mono-space text-[8px] font-semibold tracking-[0.18em] text-[rgba(255,241,208,0.86)] uppercase">
              <MapPin size={12} className="text-[rgba(223,181,59,0.86)]" />
              {DEVELOPER.location}
            </div>
          </div>

          <p className="mt-4 max-w-[58ch] text-[13px] leading-7 text-slate-300/75 [@media(max-height:690px)]:hidden">
            {DEVELOPER.bio}
          </p>

          <div
            className="relative mt-6 grid grid-cols-4 gap-2 [@media(max-height:690px)]:mt-4.5"
            aria-label={t('fallback_2d.flow_aria')}
          >
            <div className="absolute top-3.25 right-[10%] left-[10%] h-px bg-linear-to-r from-[rgba(223,181,59,0.6)] via-[rgba(223,181,59,0.18)] to-[rgba(245,158,11,0.3)]" />
            {FLOW_STEPS.map((step, index) => (
              <div className="relative grid justify-items-center gap-2.5 text-center" key={step}>
                <span className="z-1 grid size-7 place-items-center rounded-full border border-[rgba(223,181,59,0.28)] bg-[#0b0c10] font-mono-space text-[8px] font-medium text-[rgba(255,234,179,0.92)]">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <strong className="font-mono-space text-[9px] leading-4 font-semibold tracking-[0.08em] text-slate-300 uppercase max-md:text-[7px]">
                  {t(`fallback_2d.flow.${step}`)}
                </strong>
              </div>
            ))}
          </div>

          <div className="mt-6 grid gap-2 rounded-[14px] border border-[rgba(223,181,59,0.16)] bg-[rgba(223,181,59,0.04)] p-3 sm:grid-cols-3">
            {QUICK_LINKS.map((item) => (
              <a
                key={item.href}
                className="inline-flex items-center justify-between gap-2 rounded-[10px] border border-[rgba(223,181,59,0.16)] bg-[rgba(8,9,12,0.62)] px-3 py-2 font-mono-space text-[9px] font-semibold uppercase tracking-[0.16em] text-slate-200 transition-colors hover:border-[rgba(223,181,59,0.36)] hover:text-[rgba(255,245,213,0.98)]"
                href={item.href}
              >
                {item.label}
                <ArrowUpRight size={12} />
              </a>
            ))}
          </div>

          <div className="mt-6 flex items-center gap-3.5 border-t border-slate-400/10 pt-4.5 max-md:hidden [@media(max-height:690px)]:hidden">
            <span className="shrink-0 font-mono-space text-[8px] font-semibold tracking-[0.2em] text-slate-500">
              {t('fallback_2d.stack')}
            </span>
            <div className="flex flex-wrap gap-1.5">
              {STACK.map((technology) => (
                <strong
                  className="rounded-md bg-[rgba(223,181,59,0.08)] px-2 py-1.25 font-mono-space text-[8px] font-medium text-[rgba(240,244,255,0.72)]"
                  key={technology}
                >
                  {technology}
                </strong>
              ))}
            </div>
          </div>

          <div className="mt-5.5 flex gap-2.5 max-md:mt-4.5">
            <FallbackLink href="#projects">
              {t('fallback_2d.projects')}
              <ArrowUpRight size={14} />
            </FallbackLink>
            <FallbackLink href="#contact" secondary>
              {t('fallback_2d.contact')}
            </FallbackLink>
          </div>
        </main>

        <Metric className="top-[12%] left-[1%]" value={DEVELOPER.stats[0]?.value ?? '4+'}>
          {DEVELOPER.stats[0]?.label ?? t('fallback_2d.metrics.years')}
        </Metric>
        <Metric className="top-[20%] right-0" value={DEVELOPER.stats[1]?.value ?? '10+'}>
          {DEVELOPER.stats[1]?.label ?? t('fallback_2d.metrics.projects')}
        </Metric>
        <Metric className="right-[7%] bottom-[9%]" value={DEVELOPER.stats[2]?.value ?? '15+'}>
          {DEVELOPER.stats[2]?.label ?? t('fallback_2d.metrics.technologies')}
        </Metric>
      </div>

      <div className="absolute right-55 bottom-6.5 z-2 flex gap-4.5 font-mono-space text-[8px] font-medium tracking-[0.15em] text-slate-600 max-md:hidden">
        <span className="inline-flex items-center gap-2 text-emerald-300">
          <Sparkles size={10} />
          {t('fallback_2d.status')}
        </span>
        <span>REC · BR</span>
        <span>UTC−03:00</span>
      </div>
    </section>
  );
}

function Orbit({ className, reverse }: { className: string; reverse: boolean }) {
  return (
    <div
      className="absolute top-[47%] left-[60%] -translate-x-1/2 -translate-y-1/2 max-md:top-[43%] max-md:left-1/2"
      aria-hidden="true"
    >
      <div className={`relative rounded-full border border-[rgba(223,181,59,0.16)] ${className}`}>
        <span className="absolute top-[12%] left-[14%] size-1.5 animate-pulse rounded-full bg-[rgba(223,181,59,0.9)] shadow-[0_0_18px_rgba(223,181,59,0.7)]" />
        <span
          className={`absolute right-[10%] bottom-[16%] size-1.5 animate-pulse rounded-full bg-[rgba(245,158,11,0.9)] shadow-[0_0_18px_rgba(245,158,11,0.7)] ${reverse ? 'delay-500' : ''}`}
        />
      </div>
    </div>
  );
}

function Metric({
  children,
  className,
  value,
}: {
  children: ReactNode;
  className: string;
  value: string;
}) {
  return (
    <div
      className={`absolute grid min-w-29.5 gap-1 border-l border-[rgba(223,181,59,0.26)] bg-linear-to-r from-[rgba(8,9,12,0.86)] to-transparent px-3.5 py-3 max-[900px]:hidden ${className}`}
    >
      <strong className="font-display text-xl leading-none font-bold text-slate-100">
        {value}
      </strong>
      <span className="font-mono-space text-[8px] leading-3 font-medium tracking-[0.12em] text-slate-500 uppercase">
        {children}
      </span>
    </div>
  );
}

function FallbackLink({
  children,
  href,
  secondary = false,
}: {
  children: ReactNode;
  href: string;
  secondary?: boolean;
}) {
  return (
    <a
      className={`inline-flex min-h-9 items-center gap-2 rounded-xl border border-[rgba(223,181,59,0.22)] px-3.5 font-mono-space text-[9px] font-semibold tracking-[0.08em] uppercase transition-colors hover:border-[rgba(223,181,59,0.36)] hover:text-[rgba(255,245,213,0.98)] ${secondary ? 'bg-transparent text-[rgba(240,244,255,0.62)]' : 'bg-[rgba(223,181,59,0.08)] text-[rgba(255,241,208,0.96)]'}`}
      href={href}
    >
      {children}
    </a>
  );
}
