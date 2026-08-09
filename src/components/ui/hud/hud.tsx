import { DEVELOPER, PLANETS } from '@/data/portfolio';
import { useSpaceStore } from '@/store/space-store';
import { ArrowUpRight, Code2, Mail, Settings2 } from 'lucide-react';
import { useCallback, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useShallow } from 'zustand/react/shallow';
import { cn, createCursorHandlers } from '../panels/panel-primitives';

export function HUD() {
  const { activePanel, navigateToPanel, openSettings, setCursorVariant, setLanguage } =
    useSpaceStore(
      useShallow((state) => ({
        activePanel: state.activePanel,
        navigateToPanel: state.navigateToPanel,
        openSettings: state.openSettings,
        setCursorVariant: state.setCursorVariant,
        setLanguage: state.setLanguage,
      }))
    );
  const { t, i18n } = useTranslation();
  const linkCursor = useMemo(() => createCursorHandlers(setCursorVariant), [setCursorVariant]);
  const currentLang = i18n.resolvedLanguage?.startsWith('en') ? 'en' : 'pt';

  useEffect(() => {
    setLanguage(currentLang);
    document.documentElement.lang = currentLang === 'pt' ? 'pt-BR' : 'en';
    document.title = t('app.document_title');
  }, [currentLang, setLanguage, t]);

  const changeLanguage = useCallback(
    (lang: 'pt' | 'en') => {
      void i18n.changeLanguage(lang);
      setLanguage(lang);
    },
    [i18n, setLanguage]
  );

  return (
    <>
      <header className="pointer-events-auto absolute z-100 inset-[20px_24px_auto] min-h-16 flex items-center justify-between gap-6 rounded-xl border border-(--border) bg-[rgba(13,14,18,0.76)] px-3 py-2.5 pl-2.5 shadow-[0_16px_40px_rgba(0,0,0,0.35)] backdrop-blur-[20px] max-md:inset-x-2.5 max-md:top-2.5 max-md:min-h-15">
        <button
          type="button"
          className="group cursor-none flex items-center gap-3 text-left transition-transform duration-200 hover:-translate-y-px"
          onClick={() => navigateToPanel('about')}
          {...linkCursor}
          aria-label={t('planets.about.name')}
        >
          <span
            className="grid h-10.5 w-10.5 place-items-center rounded-xl border border-[rgba(223,181,59,0.22)] bg-[rgba(223,181,59,0.05)] font-mono text-[11px] leading-none font-bold tracking-[0.08em] text-(--accent-blue) transition-all duration-200 group-hover:border-[rgba(223,181,59,0.45)] group-hover:bg-[rgba(223,181,59,0.1)] group-hover:shadow-[0_0_12px_rgba(223,181,59,0.15)]"
            aria-hidden="true"
          >
            GF
          </span>
          <span>
            <strong className="block font-display text-sm leading-[1.2] font-semibold tracking-[0.04em] text-(--text-primary)">
              {DEVELOPER.name}
            </strong>
            <small className="mt-0.5 block text-[11px] tracking-[0.02em] text-(--text-muted)">
              {t('developer.title')}
            </small>
          </span>
        </button>

        <div className="flex items-center gap-3">
          <span
            className="h-[7px] w-[7px] rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.45)] max-md:hidden"
            aria-hidden="true"
          />
          <span className="font-mono text-[11px] tracking-[0.02em] text-(--text-muted) max-md:hidden">
            {t('developer.location')}
          </span>
          <button
            type="button"
            onClick={() => navigateToPanel('contact')}
            {...linkCursor}
            aria-label={t('planets.contact.name')}
            className="cursor-none inline-flex min-h-10 items-center justify-center gap-2 rounded-[10px] border border-[rgba(223,181,59,0.2)] bg-[rgba(223,181,59,0.06)] px-[15px] font-mono text-[10px] leading-none font-semibold tracking-[0.12em] text-(--text-primary) uppercase transition-all duration-180 hover:-translate-y-px hover:border-[rgba(223,181,59,0.45)] hover:bg-[rgba(223,181,59,0.12)] hover:shadow-[0_4px_12px_rgba(223,181,59,0.08)] active:translate-y-0 max-md:w-10 max-md:px-0"
          >
            <Mail size={15} />
            <span className="max-md:hidden">{t('planets.contact.name')}</span>
          </button>
        </div>
      </header>

      <nav
        className="pointer-events-auto absolute top-1/2 left-6 z-210 hidden w-[188px] -translate-y-1/2 rounded-xl border border-(--border) bg-[rgba(13,14,18,0.74)] p-4 shadow-[0_20px_50px_rgba(0,0,0,0.4)] backdrop-blur-[20px] md:block"
        aria-label={t('nav.planets_aria')}
      >
        <div className="mx-2 mb-2.5 font-mono text-[9px] leading-none font-semibold tracking-[0.24em] text-(--text-muted) uppercase opacity-80">
          {t('nav.sections')}
        </div>
        <ul className="grid gap-1">
          {PLANETS.map((planet, index) => (
            <li key={planet.id}>
              <button
                type="button"
                onClick={() => navigateToPanel(planet.id)}
                {...linkCursor}
                aria-current={activePanel === planet.id ? 'page' : undefined}
                className={cn(
                  'group cursor-none flex min-h-[38px] w-full items-center gap-2.5 rounded-lg border border-transparent px-2.5 text-left font-display text-[11px] leading-none font-medium tracking-[0.05em] text-(--text-secondary) transition-all duration-180 hover:border-[rgba(223,181,59,0.12)] hover:bg-[rgba(223,181,59,0.06)] hover:text-(--text-primary) focus-visible:border-[rgba(223,181,59,0.3)] focus-visible:bg-[rgba(223,181,59,0.1)] focus-visible:text-(--text-primary) focus-visible:outline-none',
                  activePanel === planet.id &&
                    'is-active border-[rgba(223,181,59,0.24)] bg-[rgba(223,181,59,0.08)] text-(--text-primary) shadow-[inset_1px_0_0_rgba(223,181,59,0.3)]'
                )}
              >
                <span className="font-mono text-[9px] leading-none font-medium text-(--text-muted) opacity-70 transition-colors duration-180 group-hover:text-(--accent-blue) group-hover:opacity-100">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <span>{t(`planets.${planet.id}.name`)}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>

      <footer className="pointer-events-auto absolute right-6 bottom-5 z-100 flex items-center gap-2 rounded-xl border border-(--border) bg-(--surface-glass) p-1.5 shadow-(--shadow-hud-footer) backdrop-blur-glass max-md:fixed max-md:right-(--layout-safe-area-right) max-md:bottom-(--layout-safe-area-bottom)">
        <div className="flex gap-0.5 border-r border-r-(--border) pr-1.5" aria-label="Language">
          {(['pt', 'en'] as const).map((lang) => (
            <button
              key={lang}
              type="button"
              onClick={() => changeLanguage(lang)}
              {...linkCursor}
              aria-pressed={currentLang === lang}
              className={cn(
                'cursor-none h-8 w-8 rounded-md font-mono text-[9px] leading-none font-semibold uppercase text-(--text-muted) transition-all duration-180 hover:bg-[rgba(255,255,255,0.04)] hover:text-(--text-primary)',
                currentLang === lang &&
                  'is-active border border-[rgba(223,181,59,0.15)] bg-[rgba(223,181,59,0.08)] text-(--text-primary)'
              )}
            >
              {lang}
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={openSettings}
          {...linkCursor}
          aria-label={t('settings.title')}
          className="cursor-none inline-flex h-[34px] min-w-[34px] items-center justify-center gap-0.5 rounded-lg text-(--text-muted) transition-all duration-180 hover:border hover:border-[rgba(223,181,59,0.12)] hover:bg-[rgba(223,181,59,0.06)] hover:text-(--text-primary)"
        >
          <Settings2 size={16} />
        </button>
        <a
          href={DEVELOPER.github}
          target="_blank"
          rel="noopener noreferrer"
          {...linkCursor}
          className="cursor-none inline-flex h-[34px] min-w-[34px] items-center justify-center gap-0.5 rounded-lg text-(--text-muted) transition-all duration-180 hover:border hover:border-[rgba(223,181,59,0.12)] hover:bg-[rgba(223,181,59,0.06)] hover:text-(--text-primary)"
          aria-label="GitHub"
        >
          <Code2 size={16} />
          <ArrowUpRight size={12} />
        </a>
      </footer>
    </>
  );
}
