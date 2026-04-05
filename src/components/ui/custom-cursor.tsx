import { useEffect, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'
import { useSpaceStore } from '@/store/space-store'

const VARIANTS = {
  default: { width: 16, height: 16, borderWidth: 1.5, opacity: 0.9 },
  planet:  { width: 32, height: 32, borderWidth: 2,   opacity: 1   },
  link:    { width: 24, height: 24, borderWidth: 1.5, opacity: 0.8 },
  drag:    { width: 40, height: 40, borderWidth: 1,   opacity: 0.7 },
}
const COLORS = {
  default: '#00D4FF',
  planet:  '#FFB800',
  link:    '#00FF88',
  drag:    '#FF1493',
}

export function CustomCursor() {
  const { cursorVariant } = useSpaceStore()
  const [isCursorCapable, setIsCursorCapable] = useState(false)
  const cursorX = useMotionValue(-100)
  const cursorY = useMotionValue(-100)
  const trailX  = useMotionValue(-100)
  const trailY  = useMotionValue(-100)

  const springX     = useSpring(cursorX, { damping: 25, stiffness: 700, mass: 0.5 })
  const springY     = useSpring(cursorY, { damping: 25, stiffness: 700, mass: 0.5 })
  const trailSpringX = useSpring(trailX, { damping: 35, stiffness: 200, mass: 1 })
  const trailSpringY = useSpring(trailY, { damping: 35, stiffness: 200, mass: 1 })

  useEffect(() => {
    const mediaQuery = window.matchMedia('(hover: hover) and (pointer: fine)')
    const updateCapability = () => {
      const enabled = mediaQuery.matches
      setIsCursorCapable(enabled)
      document.body.classList.toggle('cursor-fallback-mode', !enabled)
    }

    updateCapability()
    mediaQuery.addEventListener('change', updateCapability)

    return () => {
      mediaQuery.removeEventListener('change', updateCapability)
      document.body.classList.remove('cursor-fallback-mode')
    }
  }, [])

  useEffect(() => {
    if (!isCursorCapable) return

    const move = (e: MouseEvent) => {
      cursorX.set(e.clientX - 8)
      cursorY.set(e.clientY - 8)
      trailX.set(e.clientX - 20)
      trailY.set(e.clientY - 20)
    }
    window.addEventListener('mousemove', move)
    return () => window.removeEventListener('mousemove', move)
  }, [cursorX, cursorY, isCursorCapable, trailX, trailY])

  const current = VARIANTS[cursorVariant as keyof typeof VARIANTS] || VARIANTS.default
  const color   = COLORS[cursorVariant as keyof typeof COLORS]    || COLORS.default

  if (!isCursorCapable) return null

  return (
    <>
      <motion.div
        style={{
          position: 'fixed',
          left: springX, top: springY,
          zIndex: 9999, pointerEvents: 'none',
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

      <motion.div
        style={{
          position: 'fixed',
          left: trailSpringX, top: trailSpringY,
          zIndex: 9998, pointerEvents: 'none',
          borderRadius: '50%',
          width: 40, height: 40,
          border: `1px solid ${color}`,
          opacity: 0.25,
          mixBlendMode: 'screen',
        }}
      />

      <motion.div
        style={{
          position: 'fixed',
          left: springX, top: springY,
          zIndex: 9999, pointerEvents: 'none',
          width: 4, height: 4,
          borderRadius: '50%',
          backgroundColor: color,
          marginLeft: (current.width - 4) / 2,
          marginTop: (current.height - 4) / 2,
          boxShadow: `0 0 8px ${color}`,
          mixBlendMode: 'screen',
        }}
      />

      {cursorVariant === 'planet' && (
        <motion.div
          style={{
            position: 'fixed',
            left: trailSpringX, top: trailSpringY,
            zIndex: 9997, pointerEvents: 'none',
            borderRadius: '50%',
            width: 64, height: 64,
          }}
          animate={{ rotate: 360 }}
          transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
        >
          <div
            className="w-full h-full rounded-full"
            style={{ border: `1px dashed ${color}40` }}
          />
        </motion.div>
      )}
    </>
  )
}
