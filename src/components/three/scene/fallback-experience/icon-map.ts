import type { PanelId } from '@/types/portfolio';
import {
  BriefcaseBusiness,
  FolderKanban,
  GraduationCap,
  Layers3,
  RadioTower,
  UserRound,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export const PANEL_ICON_MAP: Record<PanelId, LucideIcon> = {
  about: UserRound,
  skills: Layers3,
  projects: FolderKanban,
  experience: BriefcaseBusiness,
  accomplishments: GraduationCap,
  contact: RadioTower,
};
