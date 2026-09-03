#!/usr/bin/env node
// ─── Local Redirect Harness (no Docker required) ───────────────────────────────
// Boots a minimal Express server with ONLY the compiled redirect middleware,
// then runs the smoke test against itself, then shuts down.
//
// Requires: `cd backend && npm run build` (produces dist/middleware/legacyRedirects.js)
//
// Usage:
//   node scripts/test-redirects-local.mjs
//
// CI uses scripts/test-redirects.mjs against a real Docker container instead.
// This script is for local pre-PR verification without Docker.
// ────────────────────────────────────────────────────────────────────────────────

import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { setTimeout as wait } from 'node:timers/promises';
import { spawn } from 'node:child_process';
import fs from 'node:fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, '..');

const COMPILED_MIDDLEWARE = path.join(
  repoRoot, 'backend', 'dist', 'src', 'middleware', 'legacyRedirects.js',
);
const SOURCE_REDIRECTS = path.join(repoRoot, 'shared', 'legacyRedirects.json');

if (!fs.existsSync(COMPILED_MIDDLEWARE)) {
  console.error(`ERROR: compiled middleware not found at ${COMPILED_MIDDLEWARE}`);
  console.error('       Run `cd backend && npm run build` first.');
  process.exit(2);
}

const require = createRequire(import.meta.url);
const backendNodeModules = path.join(repoRoot, 'backend');
const express = require(path.join(backendNodeModules, 'node_modules', 'express'));
const middlewareModule = require(COMPILED_MIDDLEWARE);
const legacyRedirectsMiddleware =
  middlewareModule.legacyRedirectsMiddleware || middlewareModule.default;

// Build minimal Express app: API guard + redirect middleware + catch-all
const app = express();

// Mock /api endpoint to verify middleware does NOT intercept API paths
app.get('/api/health', (req, res) => res.status(200).json({ ok: true }));

// The middleware under test
app.use(legacyRedirectsMiddleware);

// Catch-all: anything not redirected returns 200 (simulates SPA fallback)
app.use((req, res) => res.status(200).send('SPA-fallback'));

const PORT = 5051;  // avoid clash with real backend on 5050
const server = app.listen(PORT, '127.0.0.1');

async function shutdown() {
  return new Promise((resolve) => server.close(() => resolve()));
}

try {
  await wait(150);  // give server a tick to bind

  // Run smoke test directly against the harness
  const smokeTest = spawn(
    process.execPath,
    [path.join(repoRoot, 'scripts', 'test-redirects.mjs')],
    {
      cwd: repoRoot,
      env: { ...process.env, TEST_BASE_URL: `http://127.0.0.1:${PORT}` },
      stdio: 'inherit',
    },
  );

  const smokeExitCode = await new Promise((resolve, reject) => {
    smokeTest.on('exit', resolve);
    smokeTest.on('error', reject);
  });

  // Additional manual sanity checks
  console.log('\n--- Additional sanity checks ---');

  const apiRes = await fetch(`http://127.0.0.1:${PORT}/api/health`, { redirect: 'manual' });
  if (apiRes.status === 200) {
    console.log('✓ /api/health returns 200 (middleware does NOT intercept API paths)');
  } else {
    console.error(`✗ /api/health returned ${apiRes.status} — middleware leaked into /api/*!`);
    await shutdown();
    process.exit(1);
  }

  const queryRes = await fetch(
    `http://127.0.0.1:${PORT}/department/ai-cognitive?utm_source=test&foo=bar`,
    { redirect: 'manual' },
  );
  const queryLocation = queryRes.headers.get('location');
  if (queryRes.status === 301 && queryLocation === '/departments/cognition?utm_source=test&foo=bar') {
    console.log('✓ Query string preserved on 301 (utm_source=test&foo=bar)');
  } else {
    console.error(`✗ Query-string preservation failed: got ${queryRes.status} ${queryLocation}`);
    await shutdown();
    process.exit(1);
  }

  const sample = JSON.parse(fs.readFileSync(SOURCE_REDIRECTS, 'utf8'));
  const crossCuts = [
    '/services/ai-cognitive/ai-governance',
    '/services/product-engineering/quality-engineering-assurance',
    '/services/infrastructure-networks-operations/operation-technology',
  ];
  for (const path of crossCuts) {
    const r = await fetch(`http://127.0.0.1:${PORT}${path}`, { redirect: 'manual' });
    const got = r.headers.get('location');
    const expected = sample[path];
    if (r.status === 301 && got === expected) {
      console.log(`✓ Cross-cut redirect: ${path} → ${got}`);
    } else {
      console.error(`✗ Cross-cut redirect failed: ${path} → got ${r.status} ${got} (expected ${expected})`);
      await shutdown();
      process.exit(1);
    }
  }

  console.log('\nAll local smoke checks pass.');
  await shutdown();
  process.exit(smokeExitCode);
} catch (err) {
  console.error('ERROR:', err);
  await shutdown();
  process.exit(2);
}
