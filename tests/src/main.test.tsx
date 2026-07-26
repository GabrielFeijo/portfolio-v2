import { describe, expect, it, vi } from 'vitest';

const renderMock = vi.fn();
const createRootMock = vi.fn(() => ({ render: renderMock }));

vi.mock('react-dom/client', () => ({
  default: {
    createRoot: createRootMock,
  },
}));

vi.mock('@vercel/analytics/react', () => ({
  Analytics: () => null,
}));

vi.mock('@/app', () => ({
  default: () => null,
}));

describe('main entry', () => {
  it('mounts react root', async () => {
    document.body.innerHTML = '<div id="root"></div>';
    await import('@/main');

    expect(createRootMock).toHaveBeenCalledTimes(1);
    expect(renderMock).toHaveBeenCalledTimes(1);
  });
});
