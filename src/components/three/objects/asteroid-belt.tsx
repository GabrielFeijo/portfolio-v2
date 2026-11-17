import { makeRockTexture } from '@/utils/textures';
import { useFrame } from '@react-three/fiber';
import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';

interface AsteroidBeltProps {
  innerRadius: number;
  outerRadius: number;
  count: number;
  color: string;
  animate?: boolean;
  lite?: boolean;
  updateInterval?: number;
}

interface Asteroid {
  angle: number;
  radius: number;
  height: number;
  size: number;
  speed: number;
  rotX: number;
  rotY: number;
  rotSpeed: number;
}

const MATRIX_UPDATE_INTERVAL = 1 / 30;

function writeAsteroidMatrix(
  mesh: THREE.InstancedMesh,
  index: number,
  asteroid: Asteroid,
  yOffset: number,
  dummy: THREE.Object3D
) {
  dummy.position.set(
    Math.cos(asteroid.angle) * asteroid.radius,
    asteroid.height + yOffset,
    Math.sin(asteroid.angle) * asteroid.radius
  );
  dummy.scale.setScalar(asteroid.size);
  dummy.rotation.set(asteroid.rotX, asteroid.rotY, 0);
  dummy.updateMatrix();
  mesh.setMatrixAt(index, dummy.matrix);
}

export function AsteroidBelt({
  innerRadius,
  outerRadius,
  count,
  color,
  animate = true,
  lite = false,
  updateInterval = MATRIX_UPDATE_INTERVAL,
}: AsteroidBeltProps) {
  const meshRef = useRef<THREE.InstancedMesh | null>(null);
  const frameDeltaRef = useMemo(() => ({ current: 0 }), []);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const geometry = useMemo(() => new THREE.DodecahedronGeometry(1, 0), []);

  const asteroids = useMemo(() => {
    return Array.from({ length: count }, (_, i) => ({
      angle: (i / count) * Math.PI * 2 + (Math.random() - 0.5) * 0.8,
      radius: innerRadius + Math.random() * (outerRadius - innerRadius),
      height: (Math.random() - 0.5) * 3.5,
      size: 0.06 + Math.random() * 0.28,
      speed: 0.004 + Math.random() * 0.012,
      rotX: Math.random() * Math.PI * 2,
      rotY: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 0.8,
    }));
  }, [count, innerRadius, outerRadius]);

  const rockTexture = useMemo(() => makeRockTexture(color), [color]);

  useEffect(() => {
    return () => {
      rockTexture.dispose();
      geometry.dispose();
    };
  }, [geometry, rockTexture]);

  useEffect(() => {
    const mesh = meshRef.current;
    if (!mesh || typeof mesh.setMatrixAt !== 'function') return;

    for (let i = 0; i < asteroids.length; i += 1) {
      writeAsteroidMatrix(mesh, i, asteroids[i], 0, dummy);
    }

    Object.assign(mesh.instanceMatrix ?? {}, { needsUpdate: true });
  }, [asteroids, dummy]);

  useFrame((_, delta) => {
    const mesh = meshRef.current;
    if (!animate || !mesh || typeof mesh.setMatrixAt !== 'function') return;

    frameDeltaRef.current += delta;
    if (frameDeltaRef.current < updateInterval) return;

    const elapsedDelta = frameDeltaRef.current;
    frameDeltaRef.current = 0;

    for (let i = 0; i < asteroids.length; i += 1) {
      const a = asteroids[i];
      a.angle += elapsedDelta * a.speed;
      a.rotX += elapsedDelta * a.rotSpeed * 0.7;
      a.rotY += elapsedDelta * a.rotSpeed;
      writeAsteroidMatrix(mesh, i, a, Math.sin(a.angle * 3) * 0.15, dummy);
    }

    Object.assign(mesh.instanceMatrix ?? {}, { needsUpdate: true });
  });

  return (
    <instancedMesh ref={meshRef} args={[geometry, undefined, count]}>
      {lite ? (
        <meshLambertMaterial map={rockTexture} color={color} />
      ) : (
        <meshStandardMaterial map={rockTexture} roughness={0.95} metalness={0.05} color={color} />
      )}
    </instancedMesh>
  );
}
