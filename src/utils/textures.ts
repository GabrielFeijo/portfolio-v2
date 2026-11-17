import * as THREE from 'three';

export function createRandom(seed: number) {
  let state = seed % 2147483647;
  if (state <= 0) state += 2147483646;

  return () => {
    state = (state * 16807) % 2147483647;
    return (state - 1) / 2147483646;
  };
}

export function hexToRgb(hex: string) {
  const value = Number.parseInt(hex.replace('#', '').slice(0, 6), 16);

  return {
    r: (value >> 16) & 255,
    g: (value >> 8) & 255,
    b: value & 255,
  };
}

export function toHexColor(red: number, green: number, blue: number, alpha = 1) {
  const channel = (value: number) =>
    Math.max(0, Math.min(255, Math.round(value)))
      .toString(16)
      .padStart(2, '0');
  const color = `#${channel(red)}${channel(green)}${channel(blue)}`;

  if (alpha >= 1) return color;

  return `${color}${channel(alpha * 255)}`;
}

const canvasCache = new Map<string, HTMLCanvasElement>();

export function clearTextureCanvasCache(): void {
  canvasCache.clear();
}

export function makeRingTexture(color: string): THREE.CanvasTexture {
  const cacheKey = `ring:${color}`;
  let canvas = canvasCache.get(cacheKey);

  if (!canvas) {
    const size = 256;
    const center = size / 2;
    const minRadius = Math.floor(center * 0.62);
    const maxRadius = center - 1;
    canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const context = canvas.getContext('2d');

    if (!context) {
      return new THREE.CanvasTexture(canvas);
    }

    const { r, g, b } = hexToRgb(color);
    context.clearRect(0, 0, size, size);
    context.lineWidth = 1.5;

    for (let radius = minRadius; radius <= maxRadius; radius += 1) {
      const t = (radius - minRadius) / (maxRadius - minRadius);
      const band1 = Math.sin(t * Math.PI * 12) * 0.5 + 0.5;
      const band2 = Math.sin(t * Math.PI * 5 + 1.2) * 0.5 + 0.5;
      const edgeFade = Math.sin(t * Math.PI);
      const alpha = (band1 * 0.55 + band2 * 0.35 + 0.1) * edgeFade * 0.85;

      context.strokeStyle = toHexColor(r + 30, g + 30, b + 30, Math.max(0, alpha));
      context.beginPath();
      context.arc(center, center, radius, 0, Math.PI * 2);
      context.stroke();
    }

    canvasCache.set(cacheKey, canvas);
  }

  return new THREE.CanvasTexture(canvas);
}

export function makeRockTexture(color: string): THREE.CanvasTexture {
  const cacheKey = `rock:${color}`;
  let canvas = canvasCache.get(cacheKey);

  if (!canvas) {
    const size = 64;
    canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const context = canvas.getContext('2d');

    if (!context) {
      return new THREE.CanvasTexture(canvas);
    }

    const { r, g, b } = hexToRgb(color);
    context.fillStyle = color;
    context.fillRect(0, 0, size, size);

    for (let i = 0; i < 40; i += 1) {
      const x = Math.random() * size;
      const y = Math.random() * size;
      const delta = Math.floor((Math.random() - 0.5) * 40);
      context.fillStyle = toHexColor(r + delta, g + delta, b + delta);
      context.beginPath();
      context.arc(x, y, 2 + Math.random() * 8, 0, Math.PI * 2);
      context.fill();
    }

    for (let i = 0; i < 15; i += 1) {
      context.beginPath();
      context.strokeStyle = toHexColor(0, 0, 0, 0.2 + Math.random() * 0.4);
      context.lineWidth = 0.5 + Math.random();
      context.moveTo(Math.random() * size, Math.random() * size);
      context.lineTo(Math.random() * size, Math.random() * size);
      context.stroke();
    }

    canvasCache.set(cacheKey, canvas);
  }

  return new THREE.CanvasTexture(canvas);
}

export function createCloudTexture(seed: number, color: string) {
  const cacheKey = `cloud:${seed}:${color}`;
  let canvas = canvasCache.get(cacheKey);

  if (!canvas) {
    const rand = createRandom(seed);
    const size = 256;
    canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const context = canvas.getContext('2d');

    if (!context) {
      const fallback = new THREE.CanvasTexture(canvas);
      fallback.needsUpdate = true;
      return fallback;
    }

    context.clearRect(0, 0, size, size);
    const { r, g, b } = hexToRgb(color);

    for (let i = 0; i < 26; i += 1) {
      const x = size * (0.18 + rand() * 0.64);
      const y = size * (0.18 + rand() * 0.64);
      const radius = 20 + rand() * 70;
      const alpha = 0.04 + rand() * 0.085;
      const stretchX = 0.8 + rand() * 0.8;
      const stretchY = 0.7 + rand() * 0.7;

      context.save();
      context.translate(x, y);
      context.rotate(rand() * Math.PI * 2);
      context.scale(stretchX, stretchY);

      const gradient = context.createRadialGradient(0, 0, 0, 0, 0, radius);
      gradient.addColorStop(0, toHexColor(r, g, b, alpha));
      gradient.addColorStop(0.45, toHexColor(r, g, b, alpha * 0.55));
      gradient.addColorStop(1, '#00000000');

      context.fillStyle = gradient;
      context.beginPath();
      context.arc(0, 0, radius, 0, Math.PI * 2);
      context.fill();
      context.restore();
    }

    for (let i = 0; i < 120; i += 1) {
      const x = rand() * size;
      const y = rand() * size;
      const radius = 0.3 + rand() * 1.0;
      context.fillStyle = toHexColor(255, 255, 255, 0.015 + rand() * 0.03);
      context.beginPath();
      context.arc(x, y, radius, 0, Math.PI * 2);
      context.fill();
    }

    canvasCache.set(cacheKey, canvas);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.ClampToEdgeWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.needsUpdate = true;
  return texture;
}

export function createGlowTexture(seed: number, color: string) {
  const cacheKey = `glow:${seed}:${color}`;
  let canvas = canvasCache.get(cacheKey);

  if (!canvas) {
    const rand = createRandom(seed);
    const size = 128;
    canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const context = canvas.getContext('2d');

    if (!context) {
      const fallback = new THREE.CanvasTexture(canvas);
      fallback.needsUpdate = true;
      return fallback;
    }

    const { r, g, b } = hexToRgb(color);
    const center = size / 2;
    context.clearRect(0, 0, size, size);

    const gradient = context.createRadialGradient(center, center, 0, center, center, center);
    gradient.addColorStop(0, toHexColor(255, 255, 255, 0.8 + rand() * 0.1));
    gradient.addColorStop(0.18, toHexColor(r, g, b, 0.6));
    gradient.addColorStop(0.5, toHexColor(r, g, b, 0.16));
    gradient.addColorStop(1, '#00000000');

    context.fillStyle = gradient;
    context.fillRect(0, 0, size, size);

    canvasCache.set(cacheKey, canvas);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.ClampToEdgeWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.needsUpdate = true;
  return texture;
}
