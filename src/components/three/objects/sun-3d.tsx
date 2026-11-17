import { SCENE_COLORS } from '@/constants/scene';
import { useSpaceStore } from '@/store/space-store';
import { Html, Sparkles, Sphere } from '@react-three/drei';
import type { ThreeEvent } from '@react-three/fiber';
import { useFrame } from '@react-three/fiber';
import type { CSSProperties } from 'react';
import { memo, useCallback, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import * as THREE from 'three';
import { useShallow } from 'zustand/react/shallow';

interface HelpLabelStyle extends CSSProperties {
  '--planet-accent': string;
}

export const Sun3D = memo(function Sun3D() {
  const { t } = useTranslation();
  const {
    activePanel,
    asteroidDensity,
    helpOpen,
    liteEffects,
    openHelp,
    setCursorVariant,
    settingsOpen,
  } = useSpaceStore(
    useShallow((state) => ({
      activePanel: state.activePanel,
      asteroidDensity: state.experienceSettings.asteroidDensity,
      helpOpen: state.helpOpen,
      liteEffects: Boolean(state.experienceSettings.liteEffects),
      openHelp: state.openHelp,
      setCursorVariant: state.setCursorVariant,
      settingsOpen: state.settingsOpen,
    }))
  );
  const sunRef = useRef<THREE.Mesh | null>(null);
  const sunMatRef = useRef<THREE.ShaderMaterial | null>(null);
  const [hovered, setHovered] = useState(false);
  const colPrimary = useMemo(() => new THREE.Color(SCENE_COLORS.sun.primary), []);
  const colSecondary = useMemo(() => new THREE.Color(SCENE_COLORS.sun.secondary), []);
  const haloColor = useMemo(() => new THREE.Color(SCENE_COLORS.sun.halo), []);
  const labelStyle = useMemo<HelpLabelStyle>(
    () => ({ '--planet-accent': SCENE_COLORS.sun.label }),
    []
  );
  const flareConfigs = useMemo(
    () =>
      Array.from({ length: 6 }, (_, i) => {
        const angle = (i / 6) * Math.PI * 2;
        const r = 4.8 + (i % 3) * 0.4;
        return {
          basePos: [Math.cos(angle) * r, Math.sin(angle) * r, Math.sin(angle * 0.4) * r * 0.6] as [
            number,
            number,
            number,
          ],
          delay: i * 0.3,
          size: 0.15 + (i % 4) * 0.08,
        };
      }),
    []
  );
  const handleClick = useCallback(
    (event: ThreeEvent<MouseEvent>) => {
      event.stopPropagation();
      openHelp();
    },
    [openHelp]
  );
  const handlePointerEnter = useCallback(() => {
    setHovered(true);
    setCursorVariant('planet');
  }, [setCursorVariant]);
  const handlePointerLeave = useCallback(() => {
    setHovered(false);
    setCursorVariant('default');
  }, [setCursorVariant]);

  const sceneObscured = Boolean(activePanel || helpOpen || settingsOpen);

  useFrame((state) => {
    if (sceneObscured) return;

    const sun = sunRef.current;
    const material = sunMatRef.current;
    const time = state.clock.getElapsedTime();

    if (sun) {
      sun.rotation.y += 0.002;
      sun.rotation.z += 0.001;
    }

    if (material) {
      material.uniforms.uTime.value = time;
    }
  });

  const hasAsteroids = asteroidDensity > 0;

  return (
    <group>
      <Sphere args={[6.4, liteEffects ? 20 : 32, liteEffects ? 20 : 32]}>
        <advancedAtmosphereMaterial
          uColor={haloColor}
          uIntensity={0.85}
          side={THREE.BackSide}
          transparent
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </Sphere>

      <mesh
        ref={sunRef}
        onClick={handleClick}
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
      >
        <sphereGeometry args={[4.5, liteEffects ? 32 : 56, liteEffects ? 32 : 56]} />
        <sunMaterial
          ref={sunMatRef}
          uColorPrimary={colPrimary}
          uColorSecondary={colSecondary}
          uIntensity={4.5}
          uLite={liteEffects ? 1 : 0}
        />
      </mesh>

      {!liteEffects &&
        flareConfigs.map((flare, i) => (
          <SolarFlare
            key={i}
            active={!sceneObscured}
            basePos={flare.basePos}
            delay={flare.delay}
            size={flare.size}
          />
        ))}

      {!sceneObscured && (
        <>
          <Sparkles
            count={liteEffects ? 30 : 100}
            scale={[14, 14, 14]}
            size={3.8}
            speed={0.9}
            color={SCENE_COLORS.sun.sparkleWarm}
            opacity={0.65}
          />
          {!liteEffects && (
            <Sparkles
              count={48}
              scale={[9, 9, 9]}
              size={5.4}
              speed={0.55}
              color={SCENE_COLORS.sun.halo}
              opacity={0.85}
            />
          )}
        </>
      )}

      {!sceneObscured && (
        <Html
          position={[0, 11, 0]}
          transform
          sprite
          center
          distanceFactor={14}
          zIndexRange={[20, 0]}
          pointerEvents="none"
        >
          <div
            className={`planet-label planet-label-help ${hovered ? 'planet-label-hovered' : ''}`}
            style={labelStyle}
          >
            <div className="planet-label-kicker">{t('sun.help.kicker')}</div>
            <div className="planet-label-name">{t('sun.help.name')}</div>
            <div className="planet-label-subtitle">{t('sun.help.subtitle')}</div>
          </div>
        </Html>
      )}

      {hasAsteroids && (
        <>
          <pointLight
            position={[0, 0, 0]}
            intensity={22}
            color={SCENE_COLORS.sun.lightWarm}
            distance={520}
            decay={1.45}
          />
          {!liteEffects && (
            <pointLight
              position={[0, 0, 0]}
              intensity={8}
              color={SCENE_COLORS.sun.lightHot}
              distance={110}
              decay={2.4}
            />
          )}
        </>
      )}
    </group>
  );
});

interface SolarFlareProps {
  active: boolean;
  basePos: [number, number, number];
  delay: number;
  size: number;
}

function SolarFlare({ active, basePos, delay, size }: SolarFlareProps) {
  const ref = useRef<THREE.Mesh | null>(null);

  useFrame((state) => {
    if (!active) return;
    const flare = ref.current;
    if (!flare) return;

    const time = state.clock.getElapsedTime() + delay;
    const pulse = 0.6 + Math.abs(Math.sin(time * 1.5)) * 0.8;
    flare.scale.setScalar(pulse);
    flare.position.set(
      basePos[0] + Math.sin(time * 1.2) * 0.8,
      basePos[1] + Math.cos(time * 0.9) * 0.8,
      basePos[2] + Math.sin(time * 1.4) * 0.6
    );
  });

  return (
    <mesh ref={ref} position={basePos}>
      <sphereGeometry args={[size, 10, 10]} />
      <meshBasicMaterial
        color={SCENE_COLORS.sun.flare}
        transparent
        opacity={0.9}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </mesh>
  );
}

export function ShootingStar() {
  const ref = useRef<THREE.Group | null>(null);
  const trailRef = useRef<THREE.Mesh | null>(null);

  const { start, dir, delay } = useMemo(
    () => ({
      start: new THREE.Vector3(
        (Math.random() - 0.5) * 400,
        60 + Math.random() * 100,
        (Math.random() - 0.5) * 300 - 100
      ),
      dir: new THREE.Vector3(
        -0.8 + Math.random() * 0.6,
        -0.3 - Math.random() * 0.5,
        -0.2 + Math.random() * 0.5
      ).normalize(),
      delay: Math.random() * 15,
    }),
    []
  );

  useFrame((state) => {
    const t = (state.clock.getElapsedTime() + delay) % 18;
    const group = ref.current;
    if (!group) return;

    if (t >= 2.5) {
      if (group.visible) group.visible = false;
      return;
    }

    const progress = t / 2.5;
    group.position.copy(start).addScaledVector(dir, progress * 240);
    group.visible = progress > 0.05;
    const trail = trailRef.current;
    if (trail) trail.scale.set(1, 1, 1 + progress * 35);
  });

  return (
    <group ref={ref} visible={false}>
      <mesh>
        <sphereGeometry args={[0.2, 8, 8]} />
        <meshBasicMaterial
          color={SCENE_COLORS.shootingStar.core}
          transparent
          opacity={1.0}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
      <mesh ref={trailRef} position={[0, 0, 1.0]}>
        <cylinderGeometry args={[0.08, 0.0, 2, 8]} />
        <meshBasicMaterial
          color={SCENE_COLORS.shootingStar.trail}
          transparent
          opacity={0.6}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}
