import { m } from 'framer-motion';
import type { ReactNode } from 'react';
import { getTimelineDotStyle } from './experience-timeline-styles';

interface ExperienceTimelineNodeProps {
  isActive: boolean;
  transition: { delay: number };
  children: ReactNode;
}

export function ExperienceTimelineNode({
  isActive,
  transition,
  children,
}: ExperienceTimelineNodeProps) {
  return (
    <m.div
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={transition}
      className="relative pl-10 sm:pl-16"
    >
      <div
        className="absolute left-2.25 top-7 z-10 h-3.5 w-3.5 rounded-full border-2 transition-all duration-300 sm:left-4.25"
        style={getTimelineDotStyle(isActive)}
      />
      {children}
    </m.div>
  );
}
