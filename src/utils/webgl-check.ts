export function isWebGLAvailable(): boolean {
  try {
    const canvas = document.createElement('canvas');
    if (!window.WebGLRenderingContext) return false;

    const context =
      canvas.getContext('webgl', { failIfMajorPerformanceCaveat: false }) ||
      canvas.getContext('experimental-webgl');
    if (!context) return false;

    return !('isContextLost' in context && context.isContextLost());
  } catch {
    return false;
  }
}

export function isWebGL2Available(): boolean {
  try {
    const canvas = document.createElement('canvas');
    return !!(window.WebGL2RenderingContext && canvas.getContext('webgl2'));
  } catch {
    return false;
  }
}
