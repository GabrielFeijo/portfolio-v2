import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { gzipSync } from 'node:zlib';

const assetsDirectory = new URL('../dist/assets/', import.meta.url);
const files = readdirSync(assetsDirectory).filter((file) => /\.(js|css)$/.test(file));
const measurements = files.map((file) => ({
  file,
  gzipKb: gzipSync(readFileSync(join(assetsDirectory.pathname, file))).byteLength / 1024,
}));

const violations = measurements.filter(({ file, gzipKb }) => {
  if (file.startsWith('vendor-3d-')) return gzipKb > 260;
  if (file.endsWith('.css')) return gzipKb > 15;
  return gzipKb > 100;
});

if (violations.length > 0) {
  console.error('Bundle budget exceeded:');
  for (const item of violations) console.error(`- ${item.file}: ${item.gzipKb.toFixed(1)} kB gzip`);
  process.exit(1);
}

console.log(`Bundle budgets passed for ${measurements.length} CSS/JS assets.`);
