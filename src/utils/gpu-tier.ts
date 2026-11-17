export type GpuTier = 'software' | 'integrated' | 'unknown' | 'discrete';

const SOFTWARE_PATTERN =
  /swiftshader|llvmpipe|softpipe|software|basic render|microsoft basic|mesa offscreen/i;
const INTEGRATED_PATTERN =
  /intel(?!.*\barc\b)|mali|adreno(?:\s*\(tm\))?\s*[1-5]\d\d\b|powervr|videocore|vivante|llvm|sgx|tegra|apple\s*software|radeon(?:\(tm\))?\s+(?:vega|graphics)|renoir|cezanne|lucienne|barcelo|rembrandt|phoenix|mendocino|raphael/i;

let cachedRenderer: string | null | undefined;

export function resetGpuTierCache(): void {
  cachedRenderer = undefined;
}

export function getGpuRendererName(): string | null {
  if (cachedRenderer !== undefined) return cachedRenderer;
  cachedRenderer = null;

  if (typeof document === 'undefined') return cachedRenderer;

  try {
    const canvas = document.createElement('canvas');
    const gl = (canvas.getContext('webgl') ||
      canvas.getContext('experimental-webgl')) as WebGLRenderingContext | null;
    if (!gl) return cachedRenderer;

    const info = gl.getExtension('WEBGL_debug_renderer_info');
    const renderer = info
      ? String(gl.getParameter(info.UNMASKED_RENDERER_WEBGL))
      : String(gl.getParameter(gl.RENDERER));
    cachedRenderer = renderer || null;
    gl.getExtension('WEBGL_lose_context')?.loseContext();
  } catch {
    cachedRenderer = null;
  }

  return cachedRenderer;
}

export function classifyGpu(renderer: string | null): GpuTier {
  if (!renderer) return 'unknown';
  if (SOFTWARE_PATTERN.test(renderer)) return 'software';
  if (INTEGRATED_PATTERN.test(renderer)) return 'integrated';
  return 'discrete';
}

export function detectGpuTier(): GpuTier {
  return classifyGpu(getGpuRendererName());
}
