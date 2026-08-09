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

export function makeRingTexture(color: string): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 64;
  const context = canvas.getContext('2d');

  if (!context) {
    return new THREE.CanvasTexture(canvas);
  }

  const { r, g, b } = hexToRgb(color);
  context.clearRect(0, 0, 512, 64);

  for (let x = 0; x < 512; x += 1) {
    const t = x / 512;
    const band1 = Math.sin(t * Math.PI * 18) * 0.5 + 0.5;
    const band2 = Math.sin(t * Math.PI * 7 + 1.2) * 0.5 + 0.5;
    const alpha = (band1 * 0.6 + band2 * 0.3) * (1 - Math.abs(t - 0.5) * 1.5);

    context.fillStyle = toHexColor(r + 30, g + 30, b + 30, Math.max(0, alpha));
    context.fillRect(x, 0, 1, 64);
  }

  return new THREE.CanvasTexture(canvas);
}

export function makeRockTexture(color: string): THREE.CanvasTexture {
  const size = 64;
  const canvas = document.createElement('canvas');
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

  return new THREE.CanvasTexture(canvas);
}

export function createCloudTexture(seed: number, color: string) {
  const rand = createRandom(seed);
  const size = 512;
  const canvas = document.createElement('canvas');
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
    const radius = 40 + rand() * 140;
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

  for (let i = 0; i < 180; i += 1) {
    const x = rand() * size;
    const y = rand() * size;
    const radius = 0.4 + rand() * 1.8;
    context.fillStyle = toHexColor(255, 255, 255, 0.015 + rand() * 0.03);
    context.beginPath();
    context.arc(x, y, radius, 0, Math.PI * 2);
    context.fill();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.ClampToEdgeWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.needsUpdate = true;
  return texture;
}

export function createGlowTexture(seed: number, color: string) {
  const rand = createRandom(seed);
  const size = 256;
  const canvas = document.createElement('canvas');
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

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.ClampToEdgeWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.needsUpdate = true;
  return texture;
}
