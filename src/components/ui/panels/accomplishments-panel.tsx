import { motion } from 'framer-motion'
import { ACCOMPLISHMENTS, CERTIFICATES, type Accomplishment, type Certificate } from '@/data/portfolio'
import { GraduationCap, Award, Trophy } from 'lucide-react'
import { getLucideIcon, PanelIconBadge, PanelIntroCard, PanelSection } from './panel-primitives'
import { PanelTopGlow } from './panel-content-primitives'

export function AccomplishmentsPanel() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-8">
      <PanelIntroCard
        icon={Trophy}
        eyebrow="Marcos relevantes"
        title="Conquistas e reconhecimento"
        description="Competições, formações e sinais claros de crescimento profissional ao longo da jornada."
        ringClassName="-right-16 -top-12 h-44 w-44"
      />

      <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))' }}>
        {ACCOMPLISHMENTS.map((item, i) => (
          <AccomplishmentCard
            key={i}
            accomplishment={item}
            index={i}
            transition={{ delay: i * 0.06 }}
          />
        ))}
      </div>

      {CERTIFICATES.length > 0 && (
        <PanelSection
          icon={GraduationCap}
          eyebrow="Formação complementar"
          title="Certificados"
          glowClassName="right-6 top-4 h-20 w-20"
        >
          <div className="space-y-4">
            {CERTIFICATES.map((cert, i) => (
              <CertificateCard
                key={i}
                certificate={cert}
                transition={{ delay: i * 0.06 + 0.2 }}
              />
            ))}
          </div>
        </PanelSection>
      )}
    </motion.div>
  )
}

function AccomplishmentCard({
  accomplishment,
  index,
  transition,
}: {
  accomplishment: Accomplishment
  index: number
  transition: { delay: number }
}) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={transition}
      whileHover={{ y: -4 }}
      className="relative overflow-hidden rounded-3xl p-5 sm:p-6 cursor-none panel-card transition-all"
    >
      <PanelTopGlow color={accomplishment.color} className="h-20" />

      <div className="relative">
        <motion.div
          animate={{ y: [0, -3, 0] }}
          transition={{ duration: 2.5 + index * 0.2, repeat: Infinity, ease: 'easeInOut' }}
          className="mb-4 flex justify-start"
        >
          <PanelIconBadge
            icon={getLucideIcon(accomplishment.icon) ?? Award}
            className="h-11 w-11"
            style={{ background: `${accomplishment.color}18`, border: `1px solid ${accomplishment.color}40`, boxShadow: `0 0 24px ${accomplishment.color}15`, color: accomplishment.color }}
          />
        </motion.div>

        <div className="text-[11px] uppercase tracking-[0.18em] panel-eyebrow font-mono-space mb-2">{accomplishment.category}</div>
        <h3 className="text-base font-semibold text-(--text-primary) mb-2">{accomplishment.title}</h3>
        <p className="text-sm text-(--text-secondary) leading-7">{accomplishment.description}</p>
      </div>
    </motion.article>
  )
}

function CertificateCard({
  certificate,
  transition,
}: {
  certificate: Certificate
  transition: { delay: number }
}) {
  return (
    <motion.article
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={transition}
      whileHover={{ x: 4 }}
      className="flex items-start gap-4 p-4 rounded-[22px] cursor-none panel-card transition-all"
    >
      {certificate.image ? (
        <img src={certificate.image} alt={certificate.name} className="w-18 h-18 sm:w-20 sm:h-20 rounded-2xl object-cover shrink-0 border border-(--border)" />
      ) : (
        <div className="w-3 h-3 rounded-full shrink-0 mt-2" style={{ background: 'var(--panel-accent)' }} />
      )}

      <div className="flex-1 min-w-0">
        <div className="text-base font-semibold text-(--text-primary)">{certificate.name}</div>
        <div className="mt-1 text-[11px] uppercase tracking-[0.16em] panel-eyebrow font-mono-space">
          {certificate.issuer} • {certificate.year}
        </div>
        {certificate.description && (
          <p className="text-sm text-(--text-secondary) leading-7 mt-3">{certificate.description}</p>
        )}
      </div>
    </motion.article>
  )
}
