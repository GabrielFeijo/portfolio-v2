import {
  classifyGpu,
  detectGpuTier,
  getGpuRendererName,
  resetGpuTierCache,
} from '@/utils/gpu-tier';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

describe('gpu-tier', () => {
  beforeEach(() => {
    resetGpuTierCache();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it('returns unknown without a renderer string', () => {
    expect(classifyGpu(null)).toBe('unknown');
  });

  it.each([
    'ANGLE (Google, Vulkan 1.3.0 (SwiftShader Device (Subzero)), SwiftShader driver)',
    'llvmpipe (LLVM 15.0.7, 256 bits)',
    'Microsoft Basic Render Driver',
  ])('classifies %s as software', (renderer) => {
    expect(classifyGpu(renderer)).toBe('software');
  });

  it.each([
    'ANGLE (Intel, Intel(R) UHD Graphics 620 Direct3D11 vs_5_0 ps_5_0)',
    'Mali-G52 MC2',
    'Adreno (TM) 506',
    'ANGLE (AMD, AMD Radeon Graphics (radeonsi renoir ACO), OpenGL 4.6)',
  ])('classifies %s as integrated', (renderer) => {
    expect(classifyGpu(renderer)).toBe('integrated');
  });

  it.each([
    'ANGLE (NVIDIA, NVIDIA GeForce RTX 3060 Direct3D11)',
    'ANGLE (AMD, AMD Radeon RX 6600 Direct3D11)',
    'ANGLE (Intel, Intel(R) Arc(TM) A770 Graphics Direct3D11)',
    'Adreno (TM) 740',
  ])('classifies %s as discrete', (renderer) => {
    expect(classifyGpu(renderer)).toBe('discrete');
  });

  it('detects GPU renderer from WebGL context, caches it, and handles fallbacks', () => {
    vi.stubGlobal('document', undefined);
    expect(getGpuRendererName()).toBeNull();
    expect(getGpuRendererName()).toBeNull();
    vi.unstubAllGlobals();

    resetGpuTierCache();
    const loseContext = vi.fn();
    const getParameter = vi.fn(() => 'ANGLE (NVIDIA, NVIDIA GeForce RTX 3060)');
    const getExtension = vi.fn((name: string) => {
      if (name === 'WEBGL_debug_renderer_info') return { UNMASKED_RENDERER_WEBGL: 37446 };
      if (name === 'WEBGL_lose_context') return { loseContext };
      return null;
    });
    const getContextSpy = vi
      .spyOn(HTMLCanvasElement.prototype, 'getContext')
      .mockImplementation(((kind: string) =>
        kind === 'experimental-webgl'
          ? { getExtension, getParameter, RENDERER: 7937 }
          : null) as never);

    expect(detectGpuTier()).toBe('discrete');
    expect(loseContext).toHaveBeenCalledOnce();

    resetGpuTierCache();
    getContextSpy.mockReturnValue({
      getExtension: () => null,
      getParameter: () => '',
      RENDERER: 7937,
    } as never);
    expect(getGpuRendererName()).toBeNull();

    resetGpuTierCache();
    getContextSpy.mockReturnValue(null);
    expect(getGpuRendererName()).toBeNull();

    resetGpuTierCache();
    getContextSpy.mockImplementation(() => {
      throw new Error('blocked');
    });
    expect(getGpuRendererName()).toBeNull();
  });
});
