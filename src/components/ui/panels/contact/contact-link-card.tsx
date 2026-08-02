import type { CursorVariant } from '@/types/store';
import { motion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';
import { PanelIconBadge, createCursorHandlers } from '../panel-primitives';

interface ContactLinkCardProps {
  desc: string;
  href: string;
  icon: LucideIcon;
  label: string;
  setCursorVariant: (variant: CursorVariant) => void;
}

export function ContactLinkCard({
  desc,
  href,
  icon,
  label,
  setCursorVariant,
}: ContactLinkCardProps) {
  return (
    <motion.a
      href={href}
      target={href.startsWith('mailto:') ? undefined : '_blank'}
      rel={!href.startsWith('mailto:') ? 'noopener noreferrer' : undefined}
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      {...createCursorHandlers(setCursorVariant)}
      className="flex items-start gap-4 p-5 no-underline transition-all panel-card cursor-none hover:-translate-y-0.5"
    >
      <PanelIconBadge icon={icon} className="h-11 w-11 shrink-0" />

      <div className="min-w-0">
        <div className="text-sm font-semibold text-(--text-primary)">{label}</div>
        <div className="mt-1 text-xs leading-6 text-(--text-muted)">{desc}</div>
      </div>
    </motion.a>
  );
}
