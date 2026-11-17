import { CURSOR_COLORS, CURSOR_VARIANTS } from '@/constants/cursor';
import { usePrefersReducedMotion } from '@/hooks/use-prefers-reduced-motion';
import { useSpaceStore } from '@/store/space-store';
import type { CursorVariant } from '@/types/store';
import { m, useMotionValue, useSpring } from 'framer-motion';
import { useEffect, useLayoutEffect, useState } from 'react';
import { useShallow } from 'zustand/react/shallow';

function CustomCursorLayer({ cursorVariant }: { cursorVariant: CursorVariant }) {
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const trailX = useMotionValue(-100);
  const trailY = useMotionValue(-100);

  const springX = useSpring(cursorX, { damping: 25, stiffness: 700, mass: 0.5 });
  const springY = useSpring(cursorY, { damping: 25, stiffness: 700, mass: 0.5 });
  const trailSpringX = useSpring(trailX, { damping: 35, stiffness: 200, mass: 1 });
  const trailSpringY = useSpring(trailY, { damping: 35, stiffness: 200, mass: 1 });

  useEffect(() => {
    const move = (e: MouseEvent) => {
      cursorX.set(e.clientX - 8);
      cursorY.set(e.clientY - 8);
      trailX.set(e.clientX - 20);
      trailY.set(e.clientY - 20);
    };
    window.addEventListener('mousemove', move);
    return () => window.removeEventListener('mousemove', move);
  }, [cursorX, cursorY, trailX, trailY]);

  const current = CURSOR_VARIANTS[cursorVariant];
  const color = CURSOR_COLORS[cursorVariant];

  return (
    <>
      <m.div
        style={{
          position: 'fixed',
          left: springX,
          top: springY,
          zIndex: 9999,
          pointerEvents: 'none',
          borderRadius: '50%',
          mixBlendMode: 'screen',
          width: current.width,
          height: current.height,
          border: `${current.borderWidth}px solid ${color}`,
          boxShadow: `0 0 10px ${color}, 0 0 22px ${color}40`,
        }}
        animate={{ width: current.width, height: current.height, borderColor: color }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      />

      <m.div
        style={{
          position: 'fixed',
          left: trailSpringX,
          top: trailSpringY,
          zIndex: 9998,
          pointerEvents: 'none',
          borderRadius: '50%',
          width: 40,
          height: 40,
          border: `1px solid ${color}`,
          opacity: 0.25,
          mixBlendMode: 'screen',
        }}
      />

      <m.div
        style={{
          position: 'fixed',
          left: springX,
          top: springY,
          zIndex: 9999,
          pointerEvents: 'none',
          width: 4,
          height: 4,
          borderRadius: '50%',
          backgroundColor: color,
          marginLeft: (current.width - 4) / 2,
          marginTop: (current.height - 4) / 2,
          boxShadow: `0 0 8px ${color}`,
          mixBlendMode: 'screen',
        }}
      />

      {cursorVariant === 'planet' && (
        <m.div
          style={{
            position: 'fixed',
            left: trailSpringX,
            top: trailSpringY,
            zIndex: 9997,
            pointerEvents: 'none',
            borderRadius: '50%',
            width: 64,
            height: 64,
          }}
          animate={{ rotate: 360 }}
          transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
        >
          <div className="w-full h-full rounded-full" style={{ border: `1px dashed ${color}40` }} />
        </m.div>
      )}
    </>
  );
}

export function CustomCursor() {
  const { cursorVariant, customCursorEnabled, graphicsMode } = useSpaceStore(
    useShallow((state) => ({
      cursorVariant: state.cursorVariant,
      customCursorEnabled: state.experienceSettings.customCursor,
      graphicsMode: state.graphicsMode,
    }))
  );
  const prefersReducedMotion = usePrefersReducedMotion();
  const [isCursorCapable, setIsCursorCapable] = useState(false);

  const shouldUseCustomCursor =
    graphicsMode === 'webgl' && isCursorCapable && customCursorEnabled && !prefersReducedMotion;

  useEffect(() => {
    const mediaQuery = window.matchMedia('(hover: hover) and (pointer: fine)');
    const updateCapability = () => {
      setIsCursorCapable(mediaQuery.matches);
    };

    updateCapability();
    mediaQuery.addEventListener('change', updateCapability);

    return () => {
      mediaQuery.removeEventListener('change', updateCapability);
    };
  }, []);

  useLayoutEffect(() => {
    document.body.classList.toggle('custom-cursor-active', shouldUseCustomCursor);
    document.body.classList.toggle('graphics-2d-mode', graphicsMode === '2d');
    return () => {
      document.body.classList.remove('custom-cursor-active');
      document.body.classList.remove('graphics-2d-mode');
    };
  }, [graphicsMode, shouldUseCustomCursor]);

  if (typeof window === 'undefined' || !shouldUseCustomCursor) return null;

  return <CustomCursorLayer cursorVariant={cursorVariant} />;
}
