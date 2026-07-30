#!/usr/bin/env node
// ─── Brotli precompression ─────────────────────────────────────────────────────
// The Express layer uses `compression()`, which only speaks gzip/deflate. On a
// JS-heavy SPA the difference matters: first paint is gated on the bundle
// arriving, and Brotli is materially smaller than gzip on JS and CSS.
//
// Compressing at build time (quality 11) rather than per-request also removes
// the CPU cost from the server — the file is compressed once, not per visitor.
//
// Emits <asset>.br alongside each asset; BotPrerender/static middleware serves
// it when the client advertises `Accept-Encoding: br`.
//
// Usage: node scripts/compress-build.mjs
// ────────────────────────────────────────────────────────────────────────────────

import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const BUILD = path.resolve(__dirname, '..', 'frontend', 'build');
const EXT = /\.(js|css|html|json|svg|txt|xml)$/i;
const MIN_BYTES = 1024; // below this, the header overhead outweighs the saving

if (!fs.existsSync(BUILD)) {
  console.error(`build directory not found: ${BUILD} — run \`npm run build\` first`);
  process.exit(1);
}

function walk(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) walk(full, out);
    else if (EXT.test(e.name) && !e.name.endsWith('.br')) out.push(full);
  }
  return out;
}

const files = walk(BUILD);
let raw = 0, br = 0, written = 0;

for (const file of files) {
  const buf = fs.readFileSync(file);
  if (buf.length < MIN_BYTES) continue;
  const out = zlib.brotliCompressSync(buf, {
    params: {
      [zlib.constants.BROTLI_PARAM_QUALITY]: 11,
      [zlib.constants.BROTLI_PARAM_SIZE_HINT]: buf.length,
    },
  });
  // Never ship a "compressed" file that is larger than the original.
  if (out.length >= buf.length) continue;
  fs.writeFileSync(`${file}.br`, out);
  raw += buf.length;
  br += out.length;
  written++;
}

const mb = (n) => (n / 1024 / 1024).toFixed(2);
console.log(
  `brotli: ${written} file(s) — ${mb(raw)} MB raw → ${mb(br)} MB ` +
    `(${raw ? (100 - (br / raw) * 100).toFixed(1) : 0}% smaller)`,
);
