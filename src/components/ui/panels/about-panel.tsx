import { DEVELOPER, type DeveloperEducation } from '@/data/portfolio'
import { useSpaceStore } from '@/store/space-store'
import { motion } from 'framer-motion'
import { Briefcase, Code, GraduationCap, Mail, MapPin, Radar, Sparkles } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { AboutContactButton } from './about/about-contact-button'
import { AboutInfoPill } from './about/about-info-pill'
import { PanelNotice } from './panel-content-primitives'
import { PanelBadge, PanelSection, panelFadeUp, panelStagger } from './panel-primitives'

const STAT_TONES = [
  'var(--panel-accent-soft)',
  'color-mix(in srgb, var(--panel-glow) 18%, transparent)',
  'color-mix(in srgb, var(--panel-accent) 12%, transparent)',
]

export function AboutPanel() {
  const setCursorVariant = useSpaceStore((state) => state.setCursorVariant)
  const { t } = useTranslation()

  const stats = [
    { label: t('developer.stats.years'), value: DEVELOPER.stats[0].value },
    { label: t('developer.stats.projects'), value: DEVELOPER.stats[1].value },
    { label: t('developer.stats.stacks'), value: DEVELOPER.stats[2].value },
  ]

  const summary = (t('developer.summary', { returnObjects: true }) as string[]) || DEVELOPER.summary
  const education =
    (t('developer.education', { returnObjects: true }) as DeveloperEducation[]) ||
    DEVELOPER.education

  return (
    <motion.div
      variants={panelStagger}
      initial="hidden"
      animate="visible"
      className="flex flex-col gap-8 sm:gap-10"
    >
      <motion.section variants={panelFadeUp} className="panel-card-strong p-6 sm:p-7">
        <div className="panel-orbit-grid" />
        <div className="panel-surface-dust" />
        <div className="panel-orbit-ring -right-14 -top-16 h-44 w-44" />
        <div className="panel-core-glow right-8 top-8 h-24 w-24" />

        <div className="relative flex gap-6 items-start flex-col sm:flex-row">
          <div className="relative shrink-0">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
              className="absolute -inset-3 rounded-full border"
              style={{ borderColor: 'var(--panel-border)', borderStyle: 'dashed' }}
            />
            <img
              src={DEVELOPER.profileImage}
              alt={DEVELOPER.name}
              className="w-32 h-32 sm:w-36 sm:h-36 rounded-[28px] object-cover border shadow-[0_20px_60px_rgba(0,0,0,0.35)]"
              style={{ borderColor: 'var(--panel-border-strong)' }}
            />
          </div>

          <div className="flex-1 min-w-0">
            <PanelBadge className="text-[11px] tracking-[0.2em] uppercase font-mono-space">
              <Radar size={12} />
              {t('planets.about.subtitle')}
            </PanelBadge>

            <motion.h1
              variants={panelFadeUp}
              className="mt-4 text-3xl sm:text-4xl font-bold tracking-[-0.03em] text-(--text-primary)"
            >
              {DEVELOPER.name}
            </motion.h1>

            <div className="mt-3 flex flex-wrap gap-2 text-xs">
              <AboutInfoPill icon={Sparkles} label={t('developer.title')} />
              <AboutInfoPill
                icon={MapPin}
                label={`${t('developer.location')} • ${DEVELOPER.age} ${t('developer.age_suffix')}`}
              />
            </div>

            <p className="mt-5 text-sm sm:text-[15px] text-(--text-secondary) leading-7 max-w-2xl">
              {t('developer.tagline')}
            </p>
          </div>
        </div>
      </motion.section>

      <motion.div variants={panelFadeUp} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {stats.map((stat, index) => (
          <div
            key={stat.label}
            className="panel-card relative overflow-hidden p-4 sm:p-5"
            style={{
              background: `linear-gradient(180deg, rgba(18,28,52,0.86), rgba(8,13,25,0.72)), radial-gradient(circle at top right, ${STAT_TONES[index]}, transparent 45%)`,
            }}
          >
            <div className="text-2xl sm:text-3xl font-bold text-(--text-primary)">{stat.value}</div>
            <div className="mt-2 text-xs uppercase tracking-[0.16em] text-(--text-muted)">
              {stat.label}
            </div>
          </div>
        ))}
      </motion.div>

      <motion.div variants={panelFadeUp} className="flex gap-3 flex-wrap">
        <AboutContactButton
          href={DEVELOPER.github}
          label={t('contact.links.github')}
          icon={Code}
          setCursorVariant={setCursorVariant}
        />
        <AboutContactButton
          href={DEVELOPER.linkedin}
          label={t('contact.links.linkedin')}
          icon={Briefcase}
          setCursorVariant={setCursorVariant}
        />
        <AboutContactButton
          href={`mailto:${DEVELOPER.email}`}
          label={t('contact.links.email')}
          icon={Mail}
          setCursorVariant={setCursorVariant}
        />
      </motion.div>

      <PanelSection
        icon={Sparkles}
        eyebrow={t('about.sections.identity.eyebrow')}
        title={t('planets.about.name')}
      >
        {summary.map((paragraph, index) => (
          <p key={index} className="text-sm text-(--text-secondary) leading-7 mb-4 last:mb-0">
            {paragraph}
          </p>
        ))}
      </PanelSection>

      <PanelSection
        icon={GraduationCap}
        eyebrow={t('about.sections.education.eyebrow')}
        title={t('about.sections.education.title')}
      >
        {education.map((entry, index) => (
          <div key={index} className="panel-card rounded-[20px] p-5">
            <div className="text-base font-semibold text-(--text-primary)">{entry.title}</div>
            <div className="mt-1 text-xs uppercase tracking-[0.16em] panel-eyebrow">
              {entry.institution} • {entry.period}
            </div>
            <p className="text-sm text-(--text-secondary) leading-7 mt-4">{entry.description}</p>
          </div>
        ))}
      </PanelSection>

      <PanelSection
        icon={Code}
        eyebrow={t('about.sections.approach.eyebrow')}
        title={t('about.sections.approach.title')}
      >
        <p className="text-sm text-(--text-secondary) leading-7 mb-4">{t('developer.bio')}</p>
        <PanelNotice>{t('developer.availability')}</PanelNotice>
      </PanelSection>
    </motion.div>
  )
}
