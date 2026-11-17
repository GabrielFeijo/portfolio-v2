import { SCENE_COLORS } from '@/constants/scene';
import { useSpaceStore } from '@/store/space-store';
import { AnimatePresence, m } from 'framer-motion';
import { useEffect, useRef } from 'react';
import { useShallow } from 'zustand/react/shallow';

interface WarpStar {
  x: number;
  y: number;
  z: number;
  pz: number;
  color: string;
}

function createWarpStars(width: number, height: number, count: number): WarpStar[] {
  const cx = width / 2;
  const cy = height / 2;
  const starColors = SCENE_COLORS.warp.stars;
  const stars: WarpStar[] = [];

  for (let i = 0; i < count; i++) {
    stars.push({
      x: Math.random() * width - cx,
      y: Math.random() * height - cy,
      z: Math.random() * width,
      pz: 0,
      color: starColors[Math.floor(Math.random() * starColors.length)],
    });
  }

  return stars;
}

function drawWarpFrame(
  ctx: CanvasRenderingContext2D,
  stars: WarpStar[],
  width: number,
  height: number
) {
  const cx = width / 2;
  const cy = height / 2;
  ctx.globalAlpha = 1;
  ctx.fillStyle = SCENE_COLORS.warp.fade;
  ctx.fillRect(0, 0, width, height);

  for (let i = 0; i < stars.length; i++) {
    const star = stars[i];
    star.pz = star.z;
    star.z -= 18;

    if (star.z <= 0) {
      star.x = Math.random() * width - cx;
      star.y = Math.random() * height - cy;
      star.z = width;
      star.pz = star.z;
    }

    const sx = (star.x / star.z) * width + cx;
    const sy = (star.y / star.z) * width + cy;
    const px = (star.x / star.pz) * width + cx;
    const py = (star.y / star.pz) * width + cy;
    const brightness = 1 - star.z / width;

    ctx.beginPath();
    ctx.strokeStyle = star.color;
    ctx.globalAlpha = brightness * 0.8;
    ctx.lineWidth = Math.max(0.1, brightness * 3.5);
    ctx.moveTo(px, py);
    ctx.lineTo(sx, sy);
    ctx.stroke();
  }

  ctx.globalAlpha = 1;
}

export function WarpEffect() {
  const { graphicsMode, liteEffects, warpActive, warpEffects } = useSpaceStore(
    useShallow((state) => ({
      graphicsMode: state.graphicsMode,
      liteEffects: Boolean(state.experienceSettings.liteEffects),
      warpActive: state.warpActive,
      warpEffects: state.experienceSettings.warpEffects,
    }))
  );
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animRef = useRef<number>(0);

  useEffect(() => {
    if (graphicsMode !== 'webgl' || !warpActive || !warpEffects) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const starCount = liteEffects || canvas.width < 768 ? 220 : 420;
    const stars = createWarpStars(canvas.width, canvas.height, starCount);

    const animate = () => {
      drawWarpFrame(ctx, stars, canvas.width, canvas.height);
      animRef.current = requestAnimationFrame(animate);
    };

    animate();
    return () => cancelAnimationFrame(animRef.current);
  }, [graphicsMode, liteEffects, warpActive, warpEffects]);

  return (
    <AnimatePresence>
      {graphicsMode === 'webgl' && warpActive && warpEffects && (
        <m.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-800 pointer-events-none"
        >
          <canvas ref={canvasRef} className="w-full h-full" />
        </m.div>
      )}
    </AnimatePresence>
  );
}
