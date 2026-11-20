import type { CSSProperties } from 'react';

export const TIMELINE_TRACK_STYLE: CSSProperties = {
  background:
    'linear-gradient(180deg, var(--panel-border-strong), var(--surface-interactive-hover))',
};

export function getTimelineDotStyle(isActive: boolean, glowRadiusPx = 20): CSSProperties {
  return {
    background: isActive ? 'var(--panel-accent)' : 'var(--deep-space)',
    borderColor: 'var(--panel-accent)',
    boxShadow: isActive
      ? `0 0 ${glowRadiusPx}px color-mix(in srgb, var(--panel-glow) 40%, transparent)`
      : 'none',
  };
}

export function getExperienceCardClassName(isActive: boolean): string {
  return isActive ? 'panel-card-strong' : 'panel-card';
}

export function getExperienceCardStyle(isActive: boolean): CSSProperties | undefined {
  if (!isActive) return undefined;

  return {
    boxShadow:
      '0 18px 40px color-mix(in srgb, var(--color-black) 24%, transparent), 0 0 34px color-mix(in srgb, var(--panel-glow) 12%, transparent)',
  };
}
