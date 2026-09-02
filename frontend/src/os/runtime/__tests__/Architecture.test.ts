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

const ROOT = path.resolve(import.meta.dirname, '../../../../../')

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

// ── Constitutional Laws 1 & 2 — Sovereignty and Non-Enrichment ───────────────
console.log('\nConstitutional Law 1 · WAANDA Sole Authority')

await cert('CONSTITUTIONAL_LAW_1 is declared and exported from wee/types', async () => {
  const { CONSTITUTIONAL_LAW_1 } = await import('../wee/types.js')
  assert(typeof CONSTITUTIONAL_LAW_1 === 'string' && CONSTITUTIONAL_LAW_1.length > 0,
    'CONSTITUTIONAL_LAW_1 is missing or empty — Law 1 is memory-only, not in code')
  assert(CONSTITUTIONAL_LAW_1.toLowerCase().includes('sole authority') || CONSTITUTIONAL_LAW_1.toLowerCase().includes('waanda'),
    'CONSTITUTIONAL_LAW_1 content does not reference WAANDA authority')
})

await cert('WaandaExperienceEngine.project() does not mutate WaandaCognitiveState', async () => {
  const { WaandaExperienceEngine, EMPTY_WAANDA_STATE, DEFAULT_PROJECTION_POLICY } = await import('../wee/index.js')
  const sentinelState = { ...EMPTY_WAANDA_STATE, phase: 'OBSERVE' as const }
  await WaandaExperienceEngine.project(
    { id: 'cert.law1', projectionScope: 'PERSONAL', persona: 'OPERATOR', requiredCapabilities: [], context: {} },
    DEFAULT_PROJECTION_POLICY,
    sentinelState,
  )
  assert(sentinelState.phase === 'OBSERVE',
    `Law 1 violation: WaandaExperienceEngine.project() mutated state.phase (expected 'OBSERVE', got '${sentinelState.phase}')`)
})

console.log('\nConstitutional Law 2 · Non-Enrichment')

await cert('CONSTITUTIONAL_LAW_2 is declared and exported from wee/types', async () => {
  const { CONSTITUTIONAL_LAW_2 } = await import('../wee/types.js')
  assert(typeof CONSTITUTIONAL_LAW_2 === 'string' && CONSTITUTIONAL_LAW_2.length > 0,
    'CONSTITUTIONAL_LAW_2 is missing or empty — Law 2 is memory-only, not in code')
  assert(CONSTITUTIONAL_LAW_2.toLowerCase().includes('infer') || CONSTITUTIONAL_LAW_2.toLowerCase().includes('enrich'),
    'CONSTITUTIONAL_LAW_2 content does not reference enrichment prohibition')
})

await cert('No WEE adapter imports business intelligence services', () => {
  const adapterDir = path.join(ROOT, 'frontend/src/os/runtime/wee/adapters')
  const files = readDir(adapterDir)
  const forbidden = ['MissionDispatcher', 'HanumanasShield', 'KIMMP', 'IMMP', 'kangqore-immp', 'KeosKernel']
  const violations: string[] = []
  for (const f of files) {
    const src = readFile(f)
    for (const service of forbidden) {
      if (src.includes(service)) {
        violations.push(`${path.relative(ROOT, f)} references '${service}'`)
      }
    }
  }
  assert(violations.length === 0,
    `Law 2 violation — adapters importing intelligence services:\n  ${violations.join('\n  ')}`)
})

await cert('No WEE adapter calls fetch() or external async I/O', () => {
  const adapterDir = path.join(ROOT, 'frontend/src/os/runtime/wee/adapters')
  const files = readDir(adapterDir)
  const violations: string[] = []
  for (const f of files) {
    const src = readFile(f)
    if (src.match(/\bfetch\s*\(/) || src.match(/\baxios\s*\(/) || src.includes('XMLHttpRequest')) {
      violations.push(path.relative(ROOT, f))
    }
  }
  assert(violations.length === 0,
    `Law 2 violation — adapters performing direct I/O (must only read Readonly<WaandaCognitiveState>):\n  ${violations.join('\n  ')}`)
})

// ── Law II — WEE adapters registered after bootWEE ───────────────────────────
console.log('\nLaw II · Adapter Registration')

await cert('bootWEE() registers all nine scope adapters', async () => {
  const { bootWEE, WaandaExperienceEngine, EMPTY_WAANDA_STATE, DEFAULT_PROJECTION_POLICY } = await import('../wee/index.js')
  bootWEE()

  const scopes = [
    'PERSONAL', 'EXECUTIVE', 'REVENUE',
    'OPERATIONS', 'INTELLIGENCE', 'PLATFORM',
    'COLLABORATION', 'GOVERNANCE', 'ECOSYSTEM',
  ] as const
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

await cert('OperationsWorkspaceManifest declares cognitiveStateType = OPERATIONS', async () => {
  const { OperationsWorkspaceManifest } = await import('../portals/OperationsWorkspace.js')
  assert(OperationsWorkspaceManifest.workspace.cognitiveStateType === 'OPERATIONS',
    `Expected OPERATIONS, got ${OperationsWorkspaceManifest.workspace.cognitiveStateType}`)
})

await cert('EnterpriseIntelligenceWorkspaceManifest declares cognitiveStateType = INTELLIGENCE', async () => {
  const { EnterpriseIntelligenceWorkspaceManifest } = await import('../portals/EnterpriseIntelligenceWorkspace.js')
  assert(EnterpriseIntelligenceWorkspaceManifest.workspace.cognitiveStateType === 'INTELLIGENCE',
    `Expected INTELLIGENCE, got ${EnterpriseIntelligenceWorkspaceManifest.workspace.cognitiveStateType}`)
})

await cert('PlatformWorkspaceManifest declares cognitiveStateType = PLATFORM', async () => {
  const { PlatformWorkspaceManifest } = await import('../portals/PlatformWorkspace.js')
  assert(PlatformWorkspaceManifest.workspace.cognitiveStateType === 'PLATFORM',
    `Expected PLATFORM, got ${PlatformWorkspaceManifest.workspace.cognitiveStateType}`)
})

await cert('CollaborationWorkspaceManifest declares cognitiveStateType = COLLABORATION', async () => {
  const { CollaborationWorkspaceManifest } = await import('../portals/CollaborationWorkspace.js')
  assert(CollaborationWorkspaceManifest.workspace.cognitiveStateType === 'COLLABORATION',
    `Expected COLLABORATION, got ${CollaborationWorkspaceManifest.workspace.cognitiveStateType}`)
})

await cert('GovernanceWorkspaceManifest declares cognitiveStateType = GOVERNANCE', async () => {
  const { GovernanceWorkspaceManifest } = await import('../portals/GovernanceWorkspace.js')
  assert(GovernanceWorkspaceManifest.workspace.cognitiveStateType === 'GOVERNANCE',
    `Expected GOVERNANCE, got ${GovernanceWorkspaceManifest.workspace.cognitiveStateType}`)
})

await cert('EcosystemWorkspaceManifest declares cognitiveStateType = ECOSYSTEM', async () => {
  const { EcosystemWorkspaceManifest } = await import('../portals/EcosystemWorkspace.js')
  assert(EcosystemWorkspaceManifest.workspace.cognitiveStateType === 'ECOSYSTEM',
    `Expected ECOSYSTEM, got ${EcosystemWorkspaceManifest.workspace.cognitiveStateType}`)
})

await cert('All nine manifests include FORECASTING mode', async () => {
  const { PersonalWorkspaceManifest }                   = await import('../portals/PersonalWorkspace.js')
  const { ExecutiveWorkspaceManifest }                  = await import('../portals/ExecutiveWorkspace.js')
  const { RevenueWorkspaceManifest }                    = await import('../portals/RevenueWorkspace.js')
  const { OperationsWorkspaceManifest }                 = await import('../portals/OperationsWorkspace.js')
  const { EnterpriseIntelligenceWorkspaceManifest }     = await import('../portals/EnterpriseIntelligenceWorkspace.js')
  const { PlatformWorkspaceManifest }                   = await import('../portals/PlatformWorkspace.js')
  const { CollaborationWorkspaceManifest }              = await import('../portals/CollaborationWorkspace.js')
  const { GovernanceWorkspaceManifest }                 = await import('../portals/GovernanceWorkspace.js')
  const { EcosystemWorkspaceManifest }                  = await import('../portals/EcosystemWorkspace.js')
  assert('FORECASTING' in PersonalWorkspaceManifest.workspace.modes,                   'Personal missing FORECASTING mode')
  assert('FORECASTING' in ExecutiveWorkspaceManifest.workspace.modes,                  'Executive missing FORECASTING mode')
  assert('FORECASTING' in RevenueWorkspaceManifest.workspace.modes,                    'Revenue missing FORECASTING mode')
  assert('FORECASTING' in OperationsWorkspaceManifest.workspace.modes,                 'Operations missing FORECASTING mode')
  assert('FORECASTING' in EnterpriseIntelligenceWorkspaceManifest.workspace.modes,     'EnterpriseIntelligence missing FORECASTING mode')
  assert('FORECASTING' in PlatformWorkspaceManifest.workspace.modes,                   'Platform missing FORECASTING mode')
  assert('FORECASTING' in CollaborationWorkspaceManifest.workspace.modes,              'Collaboration missing FORECASTING mode')
  assert('FORECASTING' in GovernanceWorkspaceManifest.workspace.modes,                 'Governance missing FORECASTING mode')
  assert('FORECASTING' in EcosystemWorkspaceManifest.workspace.modes,                  'Ecosystem missing FORECASTING mode')
})

// Enterprise Platform consumption — WEE Law 3 functional compliance
await cert('WaandaCognitiveState.enterprisePredictions is declared in EMPTY_WAANDA_STATE', async () => {
  const { EMPTY_WAANDA_STATE } = await import('../wee/types.js')
  assert(Array.isArray(EMPTY_WAANDA_STATE.enterprisePredictions),
    'enterprisePredictions missing from EMPTY_WAANDA_STATE — WEE Law 3 violation')
})

await cert('WaandaCognitiveMirror fetches both EDF and EPF endpoints', () => {
  const src = readFile(path.join(ROOT, 'frontend/src/os/runtime/wee/WaandaCognitiveMirror.ts'))
  assert(src.includes('/api/os/edf/domains'),   'WaandaCognitiveMirror missing EDF domains fetch — WEE Law 3 violation')
  assert(src.includes('/api/os/epf/predictions'), 'WaandaCognitiveMirror missing EPF predictions fetch — WEE Law 3 violation')
})

// ── Constitution 3 — Enterprise Workspace Architecture Laws ──────────────────
console.log('\nConstitution 3 · Enterprise Workspace Architecture')

await cert('C3_LAW_1 is declared and exported from types/manifest', async () => {
  const { C3_LAW_1 } = await import('../types/manifest.js')
  assert(typeof C3_LAW_1 === 'string' && C3_LAW_1.length > 0,
    'C3_LAW_1 is missing or empty')
  assert(C3_LAW_1.toLowerCase().includes('capability'),
    'C3_LAW_1 content does not reference capability composition')
})

await cert('C3_LAW_2 is declared and exported from types/manifest', async () => {
  const { C3_LAW_2 } = await import('../types/manifest.js')
  assert(typeof C3_LAW_2 === 'string' && C3_LAW_2.length > 0,
    'C3_LAW_2 is missing or empty')
  assert(C3_LAW_2.toLowerCase().includes('enterprise objects') || C3_LAW_2.toLowerCase().includes('universal'),
    'C3_LAW_2 content does not reference Enterprise Objects')
})

await cert('C3_LAW_3 is declared and exported from types/manifest', async () => {
  const { C3_LAW_3 } = await import('../types/manifest.js')
  assert(typeof C3_LAW_3 === 'string' && C3_LAW_3.length > 0,
    'C3_LAW_3 is missing or empty')
  assert(C3_LAW_3.toLowerCase().includes('waanda'),
    'C3_LAW_3 content does not reference WAANDA as operating interface')
})

await cert('C3_LAW_4 is declared and exported from types/manifest', async () => {
  const { C3_LAW_4 } = await import('../types/manifest.js')
  assert(typeof C3_LAW_4 === 'string' && C3_LAW_4.length > 0,
    'C3_LAW_4 is missing or empty')
  assert(C3_LAW_4.toLowerCase().includes('mission'),
    'C3_LAW_4 content does not reference Mission')
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
  const forbidden = ["hanumanas:      'OPERATIONAL'", "kore:       'OPERATIONAL'", "keos:       'OPERATIONAL'", "cognitive:  'OPERATIONAL'"]
  for (const pattern of forbidden) {
    assert(!src.includes(pattern),
      `Hardcoded "${pattern}" still present in WaandaBootstrap.status()`)
  }
})

await cert('All 7 boot phases call reportSubsystem()', () => {
  const src = readFile(path.join(ROOT, 'backend/src/waanda/WaandaBootstrap.ts'))
  const expectedSubsystems = ['hanumanas', 'kore', 'keos', 'domains', 'cognitive', 'kimmp', 'infrastructure']
  const missing = expectedSubsystems.filter(s => !src.includes(`reportSubsystem('${s}'`))
  assert(missing.length === 0, `Boot phases missing reportSubsystem(): ${missing.join(', ')}`)
})

// ── Summary ───────────────────────────────────────────────────────────────────

console.log('\n══════════════════════════════════════════════════════')
console.log(`  ${passed} passed  ·  ${failed} failed`)
console.log('══════════════════════════════════════════════════════\n')

process.exit(failed > 0 ? 1 : 0)
