import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { Cpu, ExternalLink, Orbit, SlidersHorizontal } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useSpaceStore } from '@/store/space-store'
import { DEVELOPER } from '@/data/portfolio'
import { UIBadge, UIIconTile } from '../design-system'
import { createCursorHandlers, cn } from '../panels/panel-primitives'

export function HUD() {
  const { openSettings, setCursorVariant, setLanguage } = useSpaceStore()
  const [time, setTime] = useState(new Date())
  const { t, i18n } = useTranslation()
  const linkCursor = createCursorHandlers(setCursorVariant)

  const currentLang = i18n.resolvedLanguage?.startsWith('en') ? 'en' : 'pt'

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(t)
  }, [])

  useEffect(() => {
    setLanguage(currentLang)
  }, [currentLang, setLanguage])

  const changeLanguage = (lang: 'pt' | 'en') => {
    i18n.changeLanguage(lang)
    setLanguage(lang)
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
      className="fixed inset-0 pointer-events-none z-100"
    >
      <div className="ds-topbar absolute top-3 left-3 right-3 min-h-20 rounded-[26px] flex items-start sm:items-center justify-between px-4 sm:px-6 py-4 z-100 pointer-events-auto">
        <div className="flex items-center gap-4">
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}>
            <UIIconTile icon={Orbit} className="h-11 w-11" />
          </motion.div>
          <div>
            <div className="font-display text-sm sm:text-base font-semibold tracking-[0.08em] text-(--text-primary)">
              {DEVELOPER.name}
            </div>
            <div className="text-xs text-(--text-muted)">
              {t('developer.title')}
            </div>
          </div>
        </div>

        <div className="flex flex-col items-end gap-2 text-right">
          <div className="font-mono-space text-[11px] sm:text-xs text-(--text-secondary) uppercase tracking-[0.18em]">
            {time.toLocaleTimeString(currentLang === 'pt' ? 'pt-BR' : 'en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
          </div>
          <div className="text-[11px] sm:text-xs text-(--text-muted)">
            {t('developer.location')}
          </div>
        </div>
      </div>

      <div className="ds-topbar absolute bottom-3 left-3 right-3 min-h-16 rounded-3xl flex items-center justify-between gap-4 px-4 sm:px-6 py-4 z-100 pointer-events-auto">
        <div className="hidden sm:flex flex-wrap items-center gap-2 text-[11px] sm:text-xs text-(--text-muted)">
          <UIBadge className="font-mono-space text-[11px] tracking-[0.18em] uppercase">
            <Cpu size={14} />
            {t('common.orbital_portfolio')}
          </UIBadge>
          <UIBadge className="font-mono-space text-[11px] tracking-[0.18em] uppercase">
            <Orbit size={14} />
            {t('common.click_planet')}
          </UIBadge>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="flex items-center gap-1.5 ds-inset p-1 rounded-xl mr-1">
            {(['pt', 'en'] as const).map((lang) => (
              <button
                key={lang}
                onClick={() => changeLanguage(lang)}
                {...linkCursor}
                className={cn(
                  'px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-lg transition-all cursor-none',
                  currentLang === lang 
                    ? 'bg-white/10 text-white shadow-[0_0_12px_rgba(255,255,255,0.1)]' 
                    : 'text-white/40 hover:text-white/70'
                )}
              >
                {lang}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-3 flex-1 sm:flex-initial sm:flex">
            <motion.button
              type="button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              onClick={openSettings}
              {...linkCursor}
              aria-label={t('settings.title')}
              className="ds-button-secondary cursor-none w-full"
            >
              <SlidersHorizontal size={12} />
              {t('common.config')}
            </motion.button>

            <motion.div whileHover={{ scale: 1.05 }} {...linkCursor} className="w-full">
              <a href={DEVELOPER.github} target="_blank" rel="noopener noreferrer"
                className="ds-button-secondary cursor-none w-full">
                <ExternalLink size={12} />
                {t('common.code')}
              </a>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
