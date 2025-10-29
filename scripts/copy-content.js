/* eslint-disable no-console */
// Copies content/ into public/ so static assets are available in build
import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const SRC = path.join(ROOT, 'content');
const DEST = path.join(ROOT, 'public', 'content');

try {
  if (!fs.existsSync(SRC)) {
    console.log('No content/ directory to copy. Skipping.');
    process.exit(0);
  }
  fs.mkdirSync(DEST, { recursive: true });
  for (const f of fs.readdirSync(SRC)) {
    const from = path.join(SRC, f);
    const to = path.join(DEST, f);
    if (fs.statSync(from).isFile()) fs.copyFileSync(from, to);
  }
  console.log('Copied content/ to public/content');
} catch (e) {
  console.error('Failed to copy content:', e);
  process.exit(1);
}

