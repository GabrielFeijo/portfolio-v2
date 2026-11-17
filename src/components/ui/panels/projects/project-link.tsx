import type { CursorVariant } from '@/types/store';
import { m } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';
import { createCursorHandlers } from '../panel-primitives';

interface ProjectLinkProps {
  href: string;
  icon: LucideIcon;
  label: string;
  primary?: boolean;
  setCursorVariant: (variant: CursorVariant) => void;
}

export function ProjectLink({
  href,
  icon: Icon,
  label,
  primary = false,
  setCursorVariant,
}: ProjectLinkProps) {
  return (
    <m.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      whileHover={{ scale: 1.03 }}
      {...createCursorHandlers(setCursorVariant)}
      className={`flex flex-1 items-center justify-center gap-2 px-3.5 py-3 text-xs font-medium transition-colors cursor-none ${
        primary ? 'panel-cta' : 'panel-cta-secondary hover:bg-(--surface-interactive-hover)'
      }`}
    >
      <Icon size={14} />
      {label}
    </m.a>
  );
}
