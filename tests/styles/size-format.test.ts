import { readdirSync, readFileSync } from 'node:fs';
import { extname, join } from 'node:path';
import { describe, expect, it } from 'vitest';

const COMPONENT_EXTENSIONS = new Set(['.ts', '.tsx']);
const CSS_EXTENSIONS = new Set(['.css']);
const PHYSICAL_UNIT_PATTERN = /-?\d*\.?\d+(?:px|rem|em|vh|vw|dvh|dvw|ch)\b/i;
const ARBITRARY_SIZE_CLASS_PATTERN =
  /(?:^|\s)(?:[\w-]+:)*(?:text|size|w|h|min-w|max-w|min-h|max-h|p[trblxy]?|m[trblxy]?|gap|space-[xy]|inset(?:-[xy])?|top|right|bottom|left|rounded|border(?:-[trblxy])?|tracking|leading|blur|backdrop-blur|translate-[xy])-\[[^\]]*\]/g;
const SIZED_CSS_DECLARATION_PATTERN =
  /^\s*(?!-{2})(?:width|height|min-width|max-width|min-height|max-height|padding(?:-(?:top|right|bottom|left))?|margin(?:-(?:top|right|bottom|left))?|gap|row-gap|column-gap|font-size|letter-spacing|border(?:-(?:top|right|bottom|left))?(?:-width)?|border-radius|outline(?:-offset)?|backdrop-filter|-webkit-backdrop-filter|inset|top|right|bottom|left|transform)\s*:\s*([^;]+);/;

function getFiles(directory: string, extensions: Set<string>): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);

    if (entry.isDirectory()) return getFiles(path, extensions);
    return extensions.has(extname(entry.name)) ? [path] : [];
  });
}

describe('size format convention', () => {
  it('uses Tailwind scale classes or design tokens for component measurements', () => {
    const violations: string[] = [];

    for (const file of getFiles('src/components', COMPONENT_EXTENSIONS)) {
      const source = readFileSync(file, 'utf8');

      for (const match of source.matchAll(ARBITRARY_SIZE_CLASS_PATTERN)) {
        if (PHYSICAL_UNIT_PATTERN.test(match[0])) violations.push(`${file}: ${match[0].trim()}`);
      }
    }

    expect(violations).toEqual([]);
  });

  it('uses variables for physical measurements in shared CSS declarations', () => {
    const violations: string[] = [];

    for (const file of getFiles('src/styles', CSS_EXTENSIONS)) {
      readFileSync(file, 'utf8')
        .split('\n')
        .forEach((line, index) => {
          const declaration = line.match(SIZED_CSS_DECLARATION_PATTERN);
          if (!declaration || !PHYSICAL_UNIT_PATTERN.test(declaration[1])) return;
          if (declaration[1].includes('var(')) return;

          violations.push(`${file}:${index + 1}: ${line.trim()}`);
        });
    }

    expect(violations).toEqual([]);
  });
});
