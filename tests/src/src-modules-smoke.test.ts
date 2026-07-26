import { readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { pathToFileURL } from 'node:url';
import { describe, expect, it } from 'vitest';

const projectRoot = process.cwd();
const srcRoot = join(projectRoot, 'src');

function walk(dir: string): string[] {
  return readdirSync(dir).flatMap((entry) => {
    const fullPath = join(dir, entry);
    const stats = statSync(fullPath);

    if (stats.isDirectory()) {
      return walk(fullPath);
    }

    return [fullPath];
  });
}

const moduleFiles = walk(srcRoot)
  .filter((file) => file.endsWith('.ts') || file.endsWith('.tsx'))
  .filter((file) => !file.endsWith('.d.ts'))
  .filter((file) => !file.includes('/types/'))
  .filter((file) => !file.endsWith('/main.tsx'));

for (const file of moduleFiles) {
  const label = relative(projectRoot, file);

  it(`imports ${label}`, async () => {
    const mod = await import(pathToFileURL(file).href);
    expect(mod).toBeDefined();
  });
}

describe('src smoke modules', () => {
  it('collects source files', () => {
    expect(moduleFiles.length).toBeGreaterThan(0);
  });
});
