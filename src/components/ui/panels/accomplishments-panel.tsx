import { motion } from 'framer-motion'
import { ACCOMPLISHMENTS, CERTIFICATES } from '@/data/portfolio'
import { GraduationCap, Trophy } from 'lucide-react'
import { PanelIntroCard, PanelSection } from './panel-primitives'
import { AccomplishmentCard } from './accomplishments/accomplishment-card'
import { CertificateCard } from './accomplishments/certificate-card'

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
