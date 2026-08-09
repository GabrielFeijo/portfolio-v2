import type { Certificate } from '@/data/portfolio';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

interface CertificateCardProps {
  certificate: Certificate;
  transition: { delay: number };
}

export function CertificateCard({ certificate, transition }: CertificateCardProps) {
  const { t } = useTranslation();
  const certificateName = t(`certificates_items.${certificate.id}.name`);
  const certificateDescription = t(`certificates_items.${certificate.id}.description`);

  return (
    <motion.article
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={transition}
      whileHover={{ x: 4 }}
      className="flex items-start gap-4 p-4 transition-all panel-card cursor-none"
    >
      {certificate.image ? (
        <div className="h-18 w-18 shrink-0 overflow-hidden flex items-center justify-center sm:h-20 sm:w-20 ">
          <img
            src={certificate.image}
            alt={certificateName}
            className="max-h-full max-w-full object-contain"
          />
        </div>
      ) : (
        <div
          className="mt-2 h-3 w-3 shrink-0 rounded-full"
          style={{ background: 'var(--panel-accent)' }}
        />
      )}

      <div className="min-w-0 flex-1">
        <div className="text-base font-semibold text-(--text-primary)">{certificateName}</div>
        <div className="mt-1 font-mono-space text-[11px] uppercase tracking-[0.16em] panel-eyebrow">
          {certificate.issuer} • {certificate.year}
        </div>
        <p className="mt-3 text-sm leading-7 text-(--text-secondary)">{certificateDescription}</p>
      </div>
    </motion.article>
  );
}
