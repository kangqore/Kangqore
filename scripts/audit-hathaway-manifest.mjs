#!/usr/bin/env node
/**
 * HATHAWAY (KEOS) manifest audit.
 *
 * backend/src/kangqore-view/hathaway/keos.ts describes the OS shell: nine
 * workspace portals and the `cap.*` capability registry. A manifest that can
 * silently drift from what it describes is worse than no manifest — it reads
 * as authoritative while being wrong.
 *
 * This checks the manifest against reality:
 *   1. every declared workspace component file exists
 *   2. every portal file on disk is declared
 *   3. the capability mirror matches ROLE_POLICIES in OSBootstrap.tsx, which is
 *      where capabilities are actually enforced
 *
 *   node scripts/audit-hathaway-manifest.mjs
 */

import { readFileSync, readdirSync, existsSync } from 'node:fs'
import { join } from 'node:path'

const ROOT = new URL('..', import.meta.url).pathname
const MANIFEST = join(ROOT, 'backend/src/kangqore-view/hathaway/keos.ts')
const PORTALS = join(ROOT, 'frontend/src/os/runtime/portals')
const BOOTSTRAP = join(ROOT, 'frontend/src/os/OSBootstrap.tsx')

const problems = []

if (!existsSync(MANIFEST)) {
  console.error(`HATHAWAY manifest missing at ${MANIFEST}`)
  process.exit(1)
}
const manifest = readFileSync(MANIFEST, 'utf8')

// ── 1 & 2. Workspace components ──────────────────────────────────────────────
const declared = [...manifest.matchAll(/component:\s*'([^']+)'/g)].map(m => m[1])

for (const file of declared) {
  if (!existsSync(join(PORTALS, file))) {
    problems.push(`declares workspace component "${file}", which does not exist in frontend/src/os/runtime/portals/`)
  }
}

const onDisk = existsSync(PORTALS)
  ? readdirSync(PORTALS).filter(f => f.endsWith('Workspace.tsx'))
  : []

for (const file of onDisk) {
  if (!declared.includes(file)) {
    problems.push(`workspace "${file}" exists on disk but is not declared in the manifest`)
  }
}

// ── 3. Capability registry mirror ────────────────────────────────────────────
const manifestCaps = new Set(
  [...manifest.matchAll(/'(cap\.[a-z.]+)'/g)].map(m => m[1]),
)

let bootstrapCaps = new Set()
if (existsSync(BOOTSTRAP)) {
  bootstrapCaps = new Set(
    [...readFileSync(BOOTSTRAP, 'utf8').matchAll(/'(cap\.[a-z.]+)'/g)].map(m => m[1]),
  )
} else {
  problems.push('OSBootstrap.tsx not found — cannot verify the capability mirror')
}

for (const cap of bootstrapCaps) {
  if (!manifestCaps.has(cap)) {
    problems.push(`capability "${cap}" is enforced in OSBootstrap.tsx but missing from the manifest`)
  }
}
for (const cap of manifestCaps) {
  if (bootstrapCaps.size && !bootstrapCaps.has(cap)) {
    problems.push(`capability "${cap}" is declared in the manifest but not present in OSBootstrap.tsx`)
  }
}

// ── Report ───────────────────────────────────────────────────────────────────
if (problems.length) {
  console.error('\nHATHAWAY (KEOS) manifest is out of sync:\n')
  for (const p of problems) console.error(`  • ${p}`)
  console.error(`
  Update backend/src/kangqore-view/hathaway/keos.ts so it matches what the OS
  shell actually contains. The manifest is meant to be the name for what exists,
  not a wish list.
`)
  process.exit(1)
}

console.log(
  `✓ HATHAWAY manifest: ${declared.length} workspaces and ${manifestCaps.size} capabilities match the shell`,
)
