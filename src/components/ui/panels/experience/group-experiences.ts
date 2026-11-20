import type { Experience, ExperienceType } from '@/data/portfolio';

export interface ExperienceGroup {
  id: string;
  company: string;
  type: ExperienceType;
  color: string;
  items: Experience[];
}

const PERIOD_SEPARATOR = ' — ';

export function groupExperiencesByCompany(experiences: Experience[]): ExperienceGroup[] {
  const groups: ExperienceGroup[] = [];

  for (const experience of experiences) {
    const previousGroup = groups[groups.length - 1];
    if (previousGroup && previousGroup.company === experience.company) {
      previousGroup.items.push(experience);
      continue;
    }

    groups.push({
      id: experience.id,
      company: experience.company,
      type: experience.type,
      color: experience.color,
      items: [experience],
    });
  }

  return groups;
}

export function formatCompanyPeriod(periods: string[]): string {
  if (periods.length === 0) return '';
  if (periods.length === 1) return periods[0];

  const latestParts = periods[0].split(PERIOD_SEPARATOR);
  const earliestParts = periods[periods.length - 1].split(PERIOD_SEPARATOR);
  if (latestParts.length < 2 || earliestParts.length < 2) {
    return periods[0];
  }

  return `${earliestParts[0]}${PERIOD_SEPARATOR}${latestParts[latestParts.length - 1]}`;
}
