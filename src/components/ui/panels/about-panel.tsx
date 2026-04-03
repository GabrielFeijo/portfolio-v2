import { motion } from 'framer-motion'
import { DEVELOPER } from '@/data/portfolio'
import { useSpaceStore } from '@/store/space-store'
import { Code, Briefcase, Mail, GraduationCap, Sparkles, MapPin, Radar } from 'lucide-react'

const container = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
}

const item = { hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0 } }

export function AboutPanel() {
  const { setCursorVariant } = useSpaceStore()

  return (
    <motion.div variants={container} initial="hidden" animate="visible" className="flex flex-col gap-8 sm:gap-10">
      <motion.section variants={item} className="glass-strong relative overflow-hidden p-6 sm:p-7">
        <div className="absolute inset-0 opacity-60 pointer-events-none bg-[radial-gradient(circle_at_top_left,rgba(125,211,252,0.18),transparent_40%),radial-gradient(circle_at_bottom_right,rgba(247,185,85,0.10),transparent_32%)]" />

        <div className="relative flex gap-6 items-start flex-col sm:flex-row">
          <div className="relative shrink-0">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
              className="absolute -inset-3 rounded-full border border-[rgba(125,211,252,0.22)]"
              style={{ borderStyle: 'dashed' }}
            />
            <img
              src={DEVELOPER.profileImage}
              alt={DEVELOPER.name}
              className="w-32 h-32 sm:w-36 sm:h-36 rounded-[28px] object-cover border border-[rgba(125,211,252,0.24)] shadow-[0_20px_60px_rgba(0,0,0,0.35)]"
            />
          </div>

          <div className="flex-1 min-w-0">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[rgba(125,211,252,0.18)] bg-[rgba(125,211,252,0.08)] text-[11px] tracking-[0.2em] uppercase text-(--accent-blue-bright) font-mono-space">
              <Radar size={12} />
              Perfil em foco
            </div>

            <motion.h1 variants={item} className="mt-4 text-3xl sm:text-4xl font-bold tracking-[-0.03em] text-(--text-primary)">
              {DEVELOPER.name}
            </motion.h1>

            <div className="mt-3 flex flex-wrap gap-2 text-xs">
              <InfoPill icon={Sparkles} label={DEVELOPER.title} />
              <InfoPill icon={MapPin} label={`${DEVELOPER.location} • ${DEVELOPER.age} anos`} />
            </div>

            <p className="mt-5 text-sm sm:text-[15px] text-(--text-secondary) leading-7 max-w-2xl">
              {DEVELOPER.tagline}
            </p>
          </div>
        </div>
      </motion.section>

      <motion.div variants={item} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {DEVELOPER.stats.map((stat, index) => (
          <div
            key={stat.label}
            className="glass relative overflow-hidden p-4 sm:p-5 border border-(--border)"
            style={{
              background: `linear-gradient(180deg, rgba(18,28,52,0.86), rgba(8,13,25,0.72)), radial-gradient(circle at top right, ${
                index === 0 ? 'rgba(125,211,252,0.18)' : index === 1 ? 'rgba(43,111,255,0.18)' : 'rgba(247,185,85,0.12)'
              }, transparent 45%)`,
            }}
          >
            <div className="text-2xl sm:text-3xl font-bold text-(--text-primary)">{stat.value}</div>
            <div className="mt-2 text-xs uppercase tracking-[0.16em] text-(--text-muted)">{stat.label}</div>
          </div>
        ))}
      </motion.div>

      <motion.div variants={item} className="flex gap-3 flex-wrap">
        <ContactButton href={DEVELOPER.github} label="GitHub" icon={Code} setCursorVariant={setCursorVariant} />
        <ContactButton href={DEVELOPER.linkedin} label="LinkedIn" icon={Briefcase} setCursorVariant={setCursorVariant} />
        <ContactButton href={`mailto:${DEVELOPER.email}`} label="Email" icon={Mail} setCursorVariant={setCursorVariant} />
      </motion.div>

      <PanelBlock icon={Sparkles} eyebrow="Identidade" title="Sobre mim">
        {DEVELOPER.summary.map((paragraph) => (
          <p key={paragraph} className="text-sm text-(--text-secondary) leading-7 mb-4 last:mb-0">
            {paragraph}
          </p>
        ))}
      </PanelBlock>

      <PanelBlock icon={GraduationCap} eyebrow="Base acadêmica" title="Formação">
        {DEVELOPER.education.map((entry) => (
          <div key={entry.title} className="rounded-[20px] bg-[rgba(11,16,32,0.68)] border border-(--border) p-5">
            <div className="text-base font-semibold text-(--text-primary)">{entry.title}</div>
            <div className="mt-1 text-xs uppercase tracking-[0.16em] text-(--accent-blue-bright)">
              {entry.institution} • {entry.period}
            </div>
            <p className="text-sm text-(--text-secondary) leading-7 mt-4">{entry.description}</p>
          </div>
        ))}
      </PanelBlock>

      <PanelBlock icon={Code} eyebrow="Abordagem" title="Visão de trabalho">
        <p className="text-sm text-(--text-secondary) leading-7 mb-4">{DEVELOPER.bio}</p>
        <div className="rounded-[18px] border border-[rgba(125,211,252,0.16)] bg-[rgba(125,211,252,0.06)] px-4 py-3 text-sm text-(--text-primary)">
          {DEVELOPER.availability}
        </div>
      </PanelBlock>
    </motion.div>
  )
}

function PanelBlock({
  icon: Icon,
  eyebrow,
  title,
  children,
}: {
  icon: typeof Sparkles
  eyebrow: string
  title: string
  children: React.ReactNode
}) {
  return (
    <motion.section variants={item} className="glass p-6 sm:p-7">
      <div className="flex items-start gap-4 mb-5">
        <div className="w-10 h-10 rounded-2xl flex items-center justify-center bg-[rgba(125,211,252,0.1)] border border-[rgba(125,211,252,0.18)] text-(--accent-blue-bright)">
          <Icon size={18} />
        </div>
        <div>
          <div className="text-[11px] uppercase tracking-[0.2em] text-(--text-muted) font-mono-space">{eyebrow}</div>
          <h2 className="mt-1 text-xl font-semibold text-(--text-primary)">{title}</h2>
        </div>
      </div>
      {children}
    </motion.section>
  )
}

function ContactButton({
  href,
  label,
  icon: Icon,
  setCursorVariant,
}: {
  href: string
  label: string
  icon: typeof Code
  setCursorVariant: (variant: 'default' | 'planet' | 'link' | 'drag') => void
}) {
  return (
    <motion.a
      href={href}
      target={href.startsWith('mailto:') ? undefined : '_blank'}
      rel={href.startsWith('mailto:') ? undefined : 'noopener noreferrer'}
      whileHover={{ y: -2, scale: 1.02 }}
      onMouseEnter={() => setCursorVariant('link')}
      onMouseLeave={() => setCursorVariant('default')}
      className="inline-flex items-center gap-2 px-4 py-3 rounded-2xl glass text-sm font-medium text-(--text-primary)
                 border border-(--border) hover:border-(--accent-blue-bright) transition-colors cursor-none"
    >
      <Icon size={16} />
      {label}
    </motion.a>
  )
}

function InfoPill({ icon: Icon, label }: { icon: typeof Sparkles; label: string }) {
  return (
    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[rgba(255,255,255,0.04)] border border-(--border) text-(--text-secondary)">
      <Icon size={13} className="text-(--accent-blue-bright)" />
      <span>{label}</span>
    </div>
  )
}
