/// <reference types="node" />
// Constitutional Certification Suite — Generation III Runtime
// Run: npx tsx src/os/runtime/__tests__/Architecture.test.ts
//
// These are architectural law enforcement tests, not feature tests.
// Each test verifies one constitutional rule. Failures indicate a structural
// violation that must be resolved before the next architecture gate.

import assert from 'node:assert/strict'
import path   from 'node:path'
import fs     from 'node:fs'

// ─── Helpers ─────────────────────────────────────────────────────────────────

const ROOT = path.resolve(import.meta.dirname, '../../../../')

function readDir(dir: string): string[] {
  if (!fs.existsSync(dir)) return []
  return fs.readdirSync(dir, { recursive: true, withFileTypes: true })
    .filter(e => e.isFile())
    .map(e => path.join((e as any).path ?? dir, e.name))
}

function readFile(p: string): string {
  return fs.existsSync(p) ? fs.readFileSync(p, 'utf8') : ''
}

let passed = 0
let failed = 0

async function cert(name: string, fn: () => void | Promise<void>) {
  try {
    await fn()
    console.log(`  ✓  ${name}`)
    passed++
  } catch (err: any) {
    console.error(`  ✗  ${name}`)
    console.error(`     ${err.message}`)
    failed++
  }
}

// ─── Suite ───────────────────────────────────────────────────────────────────

console.log('\n══════════════════════════════════════════════════════')
console.log('  Kangqore OS — Constitutional Certification Suite')
console.log('══════════════════════════════════════════════════════\n')

// ── Law I — WEE type contracts ────────────────────────────────────────────────
console.log('Law I · WEE Type Contracts')

await cert('ExperienceModel shape is complete', async () => {
  const { EMPTY_WAANDA_STATE, DEFAULT_PROJECTION_POLICY } = await import('../wee/types.js')
  assert(typeof EMPTY_WAANDA_STATE.phase === 'string',      'phase missing')
  assert(typeof EMPTY_WAANDA_STATE.bootStatus === 'string', 'bootStatus missing')
  assert(Array.isArray(EMPTY_WAANDA_STATE.phases),          'phases missing')
  assert(typeof EMPTY_WAANDA_STATE.confidence === 'number', 'confidence missing')
  assert(typeof DEFAULT_PROJECTION_POLICY.levelOfDetail === 'string', 'policy.levelOfDetail missing')
  assert(typeof DEFAULT_PROJECTION_POLICY.device === 'string',        'policy.device missing')
})

await cert('WaandaExperienceEngine exports project() and registerAdapter()', async () => {
  const { WaandaExperienceEngine } = await import('../wee/WaandaExperienceEngine.js')
  assert(typeof WaandaExperienceEngine.project === 'function',         'project() missing')
  assert(typeof WaandaExperienceEngine.registerAdapter === 'function', 'registerAdapter() missing')
})

// ── Law II — WEE adapters registered after bootWEE ───────────────────────────
console.log('\nLaw II · Adapter Registration')

await cert('bootWEE() registers all three scope adapters', async () => {
  const { bootWEE, WaandaExperienceEngine, EMPTY_WAANDA_STATE, DEFAULT_PROJECTION_POLICY } = await import('../wee/index.js')
  bootWEE()

  const scopes: Array<'PERSONAL' | 'EXECUTIVE' | 'REVENUE'> = ['PERSONAL', 'EXECUTIVE', 'REVENUE']
  for (const scope of scopes) {
    const model = await WaandaExperienceEngine.project(
      { id: `cert.${scope}`, projectionScope: scope, persona: 'OPERATOR', requiredCapabilities: [], context: {} },
      DEFAULT_PROJECTION_POLICY,
      EMPTY_WAANDA_STATE,
    )
    assert(model.projectionScope === scope, `${scope} adapter not registered`)
    assert(typeof model.cognitivePhase === 'string', `${scope} model missing cognitivePhase`)
    assert(typeof model.confidence === 'number',     `${scope} model missing confidence`)
    assert(model.projectedAt instanceof Date,        `${scope} model missing projectedAt`)
  }
})

await cert('project() with empty WAANDA state does not throw', async () => {
  const { WaandaExperienceEngine, EMPTY_WAANDA_STATE, DEFAULT_PROJECTION_POLICY } = await import('../wee/index.js')
  const model = await WaandaExperienceEngine.project(
    { id: 'cert.empty', projectionScope: 'PERSONAL', persona: 'OPERATOR', requiredCapabilities: [], context: {} },
    DEFAULT_PROJECTION_POLICY,
    EMPTY_WAANDA_STATE,
  )
  assert(model !== null,                   'project() returned null')
  assert(model.payload !== null,           'payload is null')
  assert(typeof model.payload === 'object', 'payload is not object')
})

await cert('Projection policy redaction removes declared fields', async () => {
  const { WaandaExperienceEngine, EMPTY_WAANDA_STATE, DEFAULT_PROJECTION_POLICY } = await import('../wee/index.js')
  const policy = { ...DEFAULT_PROJECTION_POLICY, redactedFields: ['confidence'] }
  const model  = await WaandaExperienceEngine.project(
    { id: 'cert.redact', projectionScope: 'PERSONAL', persona: 'OPERATOR', requiredCapabilities: [], context: {} },
    policy,
    EMPTY_WAANDA_STATE,
  )
  assert(!('confidence' in model.payload), 'redacted field "confidence" still present in payload')
})

// ── Law III — Workspace manifests declare cognitiveStateType ─────────────────
console.log('\nLaw III · Workspace Manifest Compliance')

await cert('PersonalWorkspaceManifest declares cognitiveStateType = PERSONAL', async () => {
  const { PersonalWorkspaceManifest } = await import('../portals/PersonalWorkspace.js')
  assert(PersonalWorkspaceManifest.workspace.cognitiveStateType === 'PERSONAL',
    `Expected PERSONAL, got ${PersonalWorkspaceManifest.workspace.cognitiveStateType}`)
})

await cert('ExecutiveWorkspaceManifest declares cognitiveStateType = EXECUTIVE', async () => {
  const { ExecutiveWorkspaceManifest } = await import('../portals/ExecutiveWorkspace.js')
  assert(ExecutiveWorkspaceManifest.workspace.cognitiveStateType === 'EXECUTIVE',
    `Expected EXECUTIVE, got ${ExecutiveWorkspaceManifest.workspace.cognitiveStateType}`)
})

await cert('RevenueWorkspaceManifest declares cognitiveStateType = REVENUE', async () => {
  const { RevenueWorkspaceManifest } = await import('../portals/RevenueWorkspace.js')
  assert(RevenueWorkspaceManifest.workspace.cognitiveStateType === 'REVENUE',
    `Expected REVENUE, got ${RevenueWorkspaceManifest.workspace.cognitiveStateType}`)
})

await cert('All three manifests include FORECASTING mode', async () => {
  const { PersonalWorkspaceManifest }  = await import('../portals/PersonalWorkspace.js')
  const { ExecutiveWorkspaceManifest } = await import('../portals/ExecutiveWorkspace.js')
  const { RevenueWorkspaceManifest }   = await import('../portals/RevenueWorkspace.js')
  assert('FORECASTING' in PersonalWorkspaceManifest.workspace.modes,  'Personal missing FORECASTING mode')
  assert('FORECASTING' in ExecutiveWorkspaceManifest.workspace.modes, 'Executive missing FORECASTING mode')
  assert('FORECASTING' in RevenueWorkspaceManifest.workspace.modes,   'Revenue missing FORECASTING mode')
})

// ── Law IV — Article XII: no UI component bypasses WEE ───────────────────────
console.log('\nLaw IV · Article XII Enforcement (Static Analysis)')

await cert('No widget file imports ExperienceAPI directly', () => {
  const widgetDir = path.join(ROOT, 'frontend/src/os/widgets')
  const files     = readDir(widgetDir)
  const violations: string[] = []
  for (const f of files) {
    const src = readFile(f)
    if (src.includes('ExperienceAPI') || src.includes('experience/ExperienceAPI')) {
      violations.push(path.relative(ROOT, f))
    }
  }
  assert(violations.length === 0,
    `Widgets importing ExperienceAPI directly (violates Article XII):\n  ${violations.join('\n  ')}`)
})

await cert('No widget file calls fetch() or axios() directly', () => {
  const widgetDir = path.join(ROOT, 'frontend/src/os/widgets')
  const files     = readDir(widgetDir)
  const violations: string[] = []
  for (const f of files) {
    const src = readFile(f)
    // Allow fetch in test files; flag direct fetch/axios in production widget components
    if (src.match(/\bfetch\s*\(/) || src.match(/\baxios\s*\(/)) {
      violations.push(path.relative(ROOT, f))
    }
  }
  assert(violations.length === 0,
    `Widgets calling fetch/axios directly (violates Article XII):\n  ${violations.join('\n  ')}`)
})

await cert('No UI runtime file imports from backend src/', () => {
  const runtimeDir = path.join(ROOT, 'frontend/src/os/runtime')
  const files      = readDir(runtimeDir).filter(f => !f.includes('__tests__'))
  const violations: string[] = []
  for (const f of files) {
    const src = readFile(f)
    if (src.match(/from ['"].*\/backend\//)) {
      violations.push(path.relative(ROOT, f))
    }
  }
  assert(violations.length === 0,
    `Runtime files importing from backend directly:\n  ${violations.join('\n  ')}`)
})

await cert('WaandaCognitiveMirror is the only fetch boundary in wee/', () => {
  const weeDir = path.join(ROOT, 'frontend/src/os/runtime/wee')
  const files  = readDir(weeDir).filter(f => !f.includes('WaandaCognitiveMirror'))
  const violations: string[] = []
  for (const f of files) {
    const src = readFile(f)
    if (src.match(/\bfetch\s*\(/) || src.includes('XMLHttpRequest')) {
      violations.push(path.relative(ROOT, f))
    }
  }
  assert(violations.length === 0,
    `WEE files other than WaandaCognitiveMirror calling fetch (constitution violation):\n  ${violations.join('\n  ')}`)
})

// ── Law V — WAANDA boot lifecycle completeness ────────────────────────────────
console.log('\nLaw V · Boot Lifecycle Completeness')

await cert('WaandaBootstrap status() returns only live-reported subsystems', () => {
  const src = readFile(path.join(ROOT, 'backend/src/waanda/WaandaBootstrap.ts'))
  // The hardcoded strings were removed — verify they are gone
  const forbidden = ["aegis:      'OPERATIONAL'", "kore:       'OPERATIONAL'", "keos:       'OPERATIONAL'", "cognitive:  'OPERATIONAL'"]
  for (const pattern of forbidden) {
    assert(!src.includes(pattern),
      `Hardcoded "${pattern}" still present in WaandaBootstrap.status()`)
  }
})

await cert('All 7 boot phases call reportSubsystem()', () => {
  const src = readFile(path.join(ROOT, 'backend/src/waanda/WaandaBootstrap.ts'))
  const expectedSubsystems = ['aegis', 'kore', 'keos', 'domains', 'cognitive', 'kimmp', 'infrastructure']
  const missing = expectedSubsystems.filter(s => !src.includes(`reportSubsystem('${s}'`))
  assert(missing.length === 0, `Boot phases missing reportSubsystem(): ${missing.join(', ')}`)
})

// ── Summary ───────────────────────────────────────────────────────────────────

console.log('\n══════════════════════════════════════════════════════')
console.log(`  ${passed} passed  ·  ${failed} failed`)
console.log('══════════════════════════════════════════════════════\n')

process.exit(failed > 0 ? 1 : 0)
