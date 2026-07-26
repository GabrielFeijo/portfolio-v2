import type { LucideIcon } from 'lucide-react';
import { PanelMetaChip } from '../panel-primitives';

interface AboutInfoPillProps {
  icon: LucideIcon;
  label: string;
}

export function AboutInfoPill({ icon, label }: AboutInfoPillProps) {
  return <PanelMetaChip icon={icon}>{label}</PanelMetaChip>;
}
