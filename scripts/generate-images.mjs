#!/usr/bin/env node
// ─── Responsive Image Pipeline ─────────────────────────────────────────────────
// The site shipped 41 MB of full-size PNGs with no modern formats and no
// responsive variants — a single 2.1 MB PNG was being served into a ~400 px
// bento card. This emits AVIF + WebP at three widths beside every source image,
// so <picture> can hand the browser the smallest adequate file.
//
// Originals are never modified or deleted; variants sit next to them and the
// PNG/JPG remains the final <img src> fallback.
//
// Usage:
//   node scripts/generate-images.mjs           # generate missing variants
//   node scripts/generate-images.mjs --force   # rebuild everything
//   node scripts/generate-images.mjs --check   # CI: fail if variants missing
// ────────────────────────────────────────────────────────────────────────────────

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, '..');
const IMAGE_ROOT = path.join(repoRoot, 'frontend', 'public', 'images');

const WIDTHS = [480, 960, 1600];
const AVIF = { quality: 50, effort: 4 };
const WEBP = { quality: 74 };

const force = process.argv.includes('--force');
const check = process.argv.includes('--check');

function walk(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, out);
    else if (/\.(png|jpe?g)$/i.test(entry.name) && !/-\d+w\.(png|jpe?g)$/i.test(entry.name)) out.push(full);
  }
  return out;
}

const sources = fs.existsSync(IMAGE_ROOT) ? walk(IMAGE_ROOT) : [];
let made = 0, skipped = 0, savedBytes = 0;
const missing = [];

// Which widths actually exist per source. Without this the component would
// advertise a 1600w variant for a 900px source; that URL 404s to the SPA's HTML
// catch-all, the <source> fails, and the browser silently falls back to the
// original PNG — i.e. the whole pipeline would be a no-op.
const manifest = {};

for (const src of sources) {
  const dir = path.dirname(src);
  const base = path.basename(src).replace(/\.(png|jpe?g)$/i, '');
  let meta;
  try {
    meta = await sharp(src).metadata();
  } catch {
    continue; // unreadable/corrupt source — leave the original in place
  }
  const srcBytes = fs.statSync(src).size;

  const publicPath = '/' + path.relative(path.join(repoRoot, 'frontend', 'public'), src).split(path.sep).join('/');

  for (const w of WIDTHS) {
    // Never upscale: a 600px source has no business emitting a 1600px variant.
    if (meta.width && meta.width < w && w !== WIDTHS[0]) continue;
    if (!manifest[publicPath]) manifest[publicPath] = [];
    manifest[publicPath].push(w);

    for (const [ext, opts] of [['avif', AVIF], ['webp', WEBP]]) {
      const out = path.join(dir, `${base}-${w}w.${ext}`);
      if (fs.existsSync(out) && !force) {
        if (check) continue;
        skipped++;
        continue;
      }
      if (check) { missing.push(path.relative(repoRoot, out)); continue; }

      const pipeline = sharp(src).resize({ width: w, withoutEnlargement: true });
      await (ext === 'avif' ? pipeline.avif(opts) : pipeline.webp(opts)).toFile(out);
      made++;
      savedBytes += Math.max(0, srcBytes - fs.statSync(out).size);
    }
  }
}

if (check) {
  if (missing.length) {
    console.error(`DRIFT: ${missing.length} image variant(s) missing. Run \`node scripts/generate-images.mjs\`.`);
    console.error(missing.slice(0, 5).map((m) => `  ${m}`).join('\n'));
    process.exit(1);
  }
  console.log(`no drift — variants present for ${sources.length} source images`);
} else {
  const manifestPath = path.join(repoRoot, 'frontend', 'src', 'data', 'imageVariants.json');
  fs.mkdirSync(path.dirname(manifestPath), { recursive: true });
  fs.writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 0)}\n`);
  console.log(
    `${sources.length} sources · generated ${made} variants · skipped ${skipped} existing\n` +
      `wrote ${path.relative(repoRoot, manifestPath)} (${Object.keys(manifest).length} entries)`,
  );
}
