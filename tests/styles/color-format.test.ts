import { readdirSync, readFileSync } from 'node:fs';
import { extname, join } from 'node:path';
import { describe, expect, it } from 'vitest';

const SOURCE_EXTENSIONS = new Set(['.css', '.ts', '.tsx']);
const FUNCTION_COLOR_PATTERN = /\b(?:rgb|rgba|hsl|hsla)\s*\(/i;
const HEX_COLOR_PATTERN = /#([\da-f]{3,8})\b/gi;
const NORMALIZED_HEX_PATTERN = /^[\da-f]{6}(?:[\da-f]{2})?$/;

function getSourceFiles(directory: string): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);

    if (entry.isDirectory()) return getSourceFiles(path);
    return SOURCE_EXTENSIONS.has(extname(entry.name)) ? [path] : [];
  });
}

describe('color format convention', () => {
  it('uses lowercase six or eight digit hexadecimal for static colors', () => {
    const violations: string[] = [];

    for (const file of getSourceFiles('src')) {
      const source = readFileSync(file, 'utf8');

      if (FUNCTION_COLOR_PATTERN.test(source)) violations.push(`${file}: color function`);

      for (const match of source.matchAll(HEX_COLOR_PATTERN)) {
        if (!NORMALIZED_HEX_PATTERN.test(match[1])) {
          violations.push(`${file}: #${match[1]}`);
        }
      }
    }

    expect(violations).toEqual([]);
  });
});
