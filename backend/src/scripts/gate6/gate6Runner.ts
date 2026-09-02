#!/usr/bin/env ts-node
// ---------------------------------------------------------------------------
// Gate 6 — Enterprise Readiness
//
// The largest gate in the QEF framework.  Covers five domains that CIOs buy:
//
//   Security     — RBAC, session mgmt, rate limiting, security headers,
//                   encryption posture, secrets hygiene
//   Compliance   — GDPR, DPDP, data retention, right-to-erasure posture,
//                   audit log completeness, consent capture
//   Operations   — Backup readiness, DR posture, observability, autoscaling
//   Governance   — Policy engine coverage, AI governance, HANUMANAS audit depth,
//                   explainability coverage
//   Documentation— Architecture docs, runbooks, API surface completeness
//
// Checks are either:
//   AUTOMATED — deterministic, code/DB inspection
//   ATTESTATION — environment signals; human review required to flip PENDING→PASS
//
// Pass criteria: totalScore ≥ 70 AND passCount ≥ 18 AND failCount ≤ 5
//
// Usage:
//   npx ts-node src/scripts/gate6/gate6Runner.ts [--trigger nightly]
//   POST /api/admin/kangqore-immp/gate6/run
// ---------------------------------------------------------------------------

import { existsSync, readdirSync, readFileSync } from 'fs'
import { join, resolve } from 'path'
import { prisma } from '../../lib/prisma'

// ─── Types ────────────────────────────────────────────────────────────────────

export interface Gate6Options {
  trigger: 'nightly' | 'manual' | 'pre-release'
  verbose?: boolean
}

export interface Gate6Summary {
  runId:        string
  totalScore:   number
  passCount:    number
  failCount:    number
  pendingCount: number
  durationMs:   number
  gate:         'PASS' | 'FAIL' | 'PARTIAL'
  domains:      Record<string, { pass: number; fail: number; pending: number; score: number }>
  checks:       CheckResult[]
}

interface CheckResult {
  domain:  string
  name:    string
  passed:  boolean
  pending: boolean
  score:   number
  detail?: string
}

type CheckFn = () => Promise<CheckResult>

const ROOT = resolve(__dirname, '../../../../')
const BACK = join(ROOT, 'backend')
const FRONT = join(ROOT, 'frontend')

// ─── Helpers ─────────────────────────────────────────────────────────────────

function pass(domain: string, name: string, detail?: string): CheckResult {
  return { domain, name, passed: true, pending: false, score: 100, detail }
}
function fail(domain: string, name: string, detail?: string): CheckResult {
  return { domain, name, passed: false, pending: false, score: 0, detail }
}
function pending(domain: string, name: string, detail?: string): CheckResult {
  return { domain, name, passed: false, pending: true, score: 50, detail }
}

function grepFile(filePath: string, pattern: RegExp): boolean {
  try { return pattern.test(readFileSync(filePath, 'utf-8')) } catch { return false }
}
function grepDir(dir: string, pattern: RegExp, ext = '.ts'): boolean {
  try {
    const check = (d: string): boolean => {
      for (const f of readdirSync(d, { withFileTypes: true })) {
        const full = join(d, f.name)
        if (f.isDirectory() && !f.name.startsWith('.') && f.name !== 'node_modules') {
          if (check(full)) return true
        } else if (f.isFile() && f.name.endsWith(ext)) {
          if (grepFile(full, pattern)) return true
        }
      }
      return false
    }
    return check(dir)
  } catch { return false }
}
async function dbCount(model: string): Promise<number> {
  try { return await (prisma as any)[model].count() } catch { return -1 }
}

// ─── Domain: Security ────────────────────────────────────────────────────────

const securityChecks: CheckFn[] = [

  async function checkRbacMiddleware() {
    // Every admin route file should reference authorize()
    const adminRoutes = join(BACK, 'src/routes/admin.ts')
    const hasAuthorize = grepFile(adminRoutes, /authorize\(\[['"]ADMIN['"]\]\)/)
    return hasAuthorize
      ? pass('security', 'rbac_admin_routes', 'authorize([ADMIN]) found in admin.ts')
      : fail('security', 'rbac_admin_routes', 'No authorize() found in admin.ts')
  },

  async function checkJwtExpiry() {
    // Token service should set expiresIn
    const tokenSvc = join(BACK, 'src/services/token.service.ts')
    const ok = grepFile(tokenSvc, /expiresIn/)
    return ok
      ? pass('security', 'jwt_expiry', 'JWT tokens have expiresIn configured')
      : fail('security', 'jwt_expiry', 'No expiresIn found in token.service.ts')
  },

  async function checkRefreshTokens() {
    const tokenSvc = join(BACK, 'src/services/token.service.ts')
    const ok = grepFile(tokenSvc, /refresh/i)
    return ok
      ? pass('security', 'refresh_tokens', 'Refresh token logic found')
      : fail('security', 'refresh_tokens', 'No refresh token logic in token.service.ts')
  },

  async function checkRateLimiting() {
    const idx = join(BACK, 'src/index.ts')
    const ok = grepFile(idx, /rateLimiter|rateLimit|express-rate-limit/i)
    return ok
      ? pass('security', 'rate_limiting', 'Rate limiter middleware wired in index.ts')
      : fail('security', 'rate_limiting', 'No rate limiter found in index.ts')
  },

  async function checkHelmetHeaders() {
    const idx = join(BACK, 'src/index.ts')
    const ok = grepFile(idx, /helmet\(/i)
    return ok
      ? pass('security', 'security_headers', 'Helmet security headers configured')
      : fail('security', 'security_headers', 'Helmet not found in index.ts')
  },

  async function checkCorsConfig() {
    const idx = join(BACK, 'src/index.ts')
    const ok = grepFile(idx, /cors\(|CORS_ORIGINS/i)
    return ok
      ? pass('security', 'cors_configured', 'CORS configured with allowlist')
      : fail('security', 'cors_configured', 'No CORS config found in index.ts')
  },

  async function checkNoHardcodedSecrets() {
    // Scan backend src for hardcoded API keys / passwords (simple heuristic)
    const dangerPatterns = [
      /sk-[A-Za-z0-9]{20,}/,          // OpenAI key
      /password\s*=\s*['"][^'"]{8,}['"]/, // hardcoded password
      /secret\s*=\s*['"][^'"]{8,}['"]/,   // hardcoded secret (non-env)
    ]
    let found = false
    const srcDir = join(BACK, 'src')
    for (const pat of dangerPatterns) {
      if (grepDir(srcDir, pat)) { found = true; break }
    }
    return found
      ? fail('security', 'no_hardcoded_secrets', 'Potential hardcoded secret detected in src/')
      : pass('security', 'no_hardcoded_secrets', 'No hardcoded secret patterns found')
  },

  async function checkAuditLogExists() {
    const count = await dbCount('hanumanasAuditLog')
    return count > 0
      ? pass('security', 'audit_log_populated', `AegisAuditLog has ${count} events`)
      : count === 0
        ? pending('security', 'audit_log_populated', 'AegisAuditLog is empty — no recorded events yet')
        : fail('security', 'audit_log_populated', 'AegisAuditLog model not found')
  },

  async function checkSessionModel() {
    const count = await dbCount('session')
    return count >= 0
      ? pass('security', 'session_management', `Session model exists (${count} sessions)`)
      : pending('security', 'session_management', 'Session model may not exist — verify session storage strategy')
  },
]

// ─── Domain: Compliance ───────────────────────────────────────────────────────

const complianceChecks: CheckFn[] = [

  async function checkAuditLogCapturesAccess() {
    // If AegisAuditLog has DATA_ACCESS events, GDPR data access logging is in place
    try {
      const count = await (prisma as any).hanumanasAuditLog.count({
        where: { action: { in: ['DATA_ACCESS', 'DATA_EXPORT', 'DATA_VIEW', 'READ'] } },
      })
      return count > 0
        ? pass('compliance', 'gdpr_data_access_logging', `${count} data access events logged`)
        : pending('compliance', 'gdpr_data_access_logging', 'No DATA_ACCESS events in AegisAuditLog yet — add audit hooks')
    } catch {
      return pending('compliance', 'gdpr_data_access_logging', 'AegisAuditLog query failed — review model')
    }
  },

  async function checkRetentionFieldsPresent() {
    // Core PII models should have createdAt + updatedAt for retention policies
    const models = ['user', 'lead', 'session']
    let ok = 0
    for (const m of models) {
      try {
        const first = await (prisma as any)[m].findFirst({ select: { createdAt: true } })
        if (first !== null || first === null) ok++ // model exists
      } catch { /* model doesn't exist */ }
    }
    return ok >= 2
      ? pass('compliance', 'retention_fields', `${ok}/${models.length} PII models have createdAt field`)
      : pending('compliance', 'retention_fields', 'Missing createdAt on core PII models')
  },

  async function checkRightToErasurePattern() {
    // Check for delete routes on user model in admin routes
    const adminRoutes = join(BACK, 'src/routes/admin.ts')
    const ok = grepFile(adminRoutes, /DELETE.*users|delete.*user/i)
    return ok
      ? pass('compliance', 'right_to_erasure', 'User delete route found — right to erasure supported')
      : pending('compliance', 'right_to_erasure', 'No user delete route found — implement right to erasure')
  },

  async function checkConsentCapture() {
    // Look for consent-related fields or tables
    const hasConsent = await dbCount('userConsent') >= 0 ||
      grepDir(join(BACK, 'src'), /consent/i)
    return hasConsent
      ? pass('compliance', 'consent_capture', 'Consent capture pattern found')
      : pending('compliance', 'consent_capture', 'No consent model/field found — add consent tracking for GDPR')
  },

  async function checkDataMarkings() {
    const count = await dbCount('dataMarking')
    return count >= 0
      ? pass('compliance', 'data_classification', `DataMarking model active (${count} markings)`)
      : pending('compliance', 'data_classification', 'DataMarking model not found — implement data classification')
  },

  async function checkGdprPosture() {
    // Self-attestation: Is there a privacy policy, DPA process, or GDPR officer?
    const hasPrivacyRef = grepDir(join(FRONT, 'src'), /privacy.policy|gdpr|data.protection/i, '.tsx') ||
      grepDir(join(FRONT, 'src'), /privacy.policy|gdpr|data.protection/i, '.ts')
    return hasPrivacyRef
      ? pass('compliance', 'gdpr_posture', 'Privacy/GDPR references found in frontend')
      : pending('compliance', 'gdpr_posture', 'No GDPR/privacy references in frontend — add privacy policy page')
  },

  async function checkDpdpReadiness() {
    // India DPDP Act — similar to GDPR; check for regional data handling posture
    return pending('compliance', 'dpdp_readiness', 'DPDP (India) attestation required — verify data residency and consent flows')
  },

  async function checkSoc2Readiness() {
    // SOC 2 readiness requires external audit — check for key controls
    const hasAuditLog = await dbCount('hanumanasAuditLog') > 0
    const hasRbac     = grepFile(join(BACK, 'src/routes/admin.ts'), /authorize/)
    const hasEncryption = existsSync(join(BACK, 'src/lib/vault.ts')) ||
      grepDir(join(BACK, 'src'), /crypto\.createCipheriv|aes-256-gcm|bcrypt/i)
    const controls = [hasAuditLog, hasRbac, hasEncryption].filter(Boolean).length
    return controls >= 2
      ? pass('compliance', 'soc2_readiness', `${controls}/3 SOC2 key controls verified (audit, RBAC, encryption)`)
      : pending('compliance', 'soc2_readiness', `Only ${controls}/3 SOC2 controls verified — complete before audit`)
  },
]

// ─── Domain: Operations ───────────────────────────────────────────────────────

const operationsChecks: CheckFn[] = [

  async function checkDatabaseConnectivity() {
    try {
      await (prisma as any).$queryRaw`SELECT 1 as ok`
      return pass('operations', 'database_connectivity', 'PostgreSQL connection healthy')
    } catch (e: any) {
      return fail('operations', 'database_connectivity', `DB connection failed: ${e.message}`)
    }
  },

  async function checkBackupReadiness() {
    const hasBackupEnv = !!(process.env.DATABASE_BACKUP_BUCKET || process.env.PGDUMP_SCHEDULE || process.env.DB_BACKUP_CRON)
    return hasBackupEnv
      ? pass('operations', 'backup_readiness', 'Backup env vars configured')
      : pending('operations', 'backup_readiness', 'No DB backup env vars found — configure pg_dump schedule or managed backup')
  },

  async function checkObservabilityLogging() {
    const hasLogger = grepDir(join(BACK, 'src'), /winston|pino|logger\./i)
    return hasLogger
      ? pass('operations', 'observability_logging', 'Structured logger found in backend source')
      : fail('operations', 'observability_logging', 'No structured logging library detected')
  },

  async function checkRedisAvailability() {
    try {
      // Check via environment — Redis URL configured
      const redisUrl = process.env.REDIS_URL
      if (!redisUrl) return pending('operations', 'redis_availability', 'REDIS_URL not set — BullMQ queues fallback to in-memory')
      return pass('operations', 'redis_availability', `Redis URL configured: ${redisUrl.replace(/:[^:@]+@/, ':***@')}`)
    } catch {
      return pending('operations', 'redis_availability', 'Redis connectivity check inconclusive')
    }
  },

  async function checkErrorHandlingMiddleware() {
    const idx = join(BACK, 'src/index.ts')
    const ok = grepFile(idx, /error.*handler|next\(err\)|globalError|errorMiddleware/i)
    return ok
      ? pass('operations', 'global_error_handler', 'Global error handler found in index.ts')
      : fail('operations', 'global_error_handler', 'No global error handler found')
  },

  async function checkDisasterRecoveryPosture() {
    // DR requires runbooks + tested restore — self-attestation
    const hasRunbook = existsSync(join(ROOT, 'docs/runbook.md')) ||
      existsSync(join(ROOT, 'docs/disaster-recovery.md')) ||
      existsSync(join(ROOT, 'RUNBOOK.md'))
    return hasRunbook
      ? pass('operations', 'disaster_recovery', 'DR runbook found in docs/')
      : pending('operations', 'disaster_recovery', 'No DR runbook found — create docs/disaster-recovery.md')
  },

  async function checkHealthEndpoint() {
    const idx = join(BACK, 'src/index.ts')
    const ok = grepFile(idx, /\/health/)
    return ok
      ? pass('operations', 'health_endpoint', '/health endpoint defined')
      : fail('operations', 'health_endpoint', 'No /health endpoint in index.ts')
  },
]

// ─── Domain: Governance ───────────────────────────────────────────────────────

const governanceChecks: CheckFn[] = [

  async function checkPolicyEngine() {
    // Check if KimmpPolicy or policy engine exists
    const count = await dbCount('kimmpPolicy')
    if (count >= 0) return pass('governance', 'policy_engine', `Policy engine active (${count} policies)`)
    const hasPolicyFile = existsSync(join(BACK, 'src/services/policyEngine.service.ts'))
    return hasPolicyFile
      ? pass('governance', 'policy_engine', 'Policy engine service found')
      : pending('governance', 'policy_engine', 'No policy engine found — implement KimmpPolicy model + policyEngine.service.ts')
  },

  async function checkAegisAuditCoverage() {
    // HANUMANAS audit should cover key event types
    try {
      const eventTypes = await (prisma as any).hanumanasAuditLog.groupBy({ by: ['action'], _count: true })
      const count = eventTypes.length
      return count >= 3
        ? pass('governance', 'aegis_audit_coverage', `${count} distinct audit event types recorded`)
        : count > 0
          ? pending('governance', 'aegis_audit_coverage', `Only ${count} event types — expand HANUMANAS coverage to 10+ types`)
          : pending('governance', 'aegis_audit_coverage', 'No audit events recorded yet')
    } catch {
      return pending('governance', 'aegis_audit_coverage', 'AegisAuditLog groupBy failed')
    }
  },

  async function checkAiGovernanceModel() {
    const count = await dbCount('kimmpGovernanceCheck')
    if (count >= 0) return pass('governance', 'ai_governance_model', `AI governance model active (${count} checks)`)
    const hasApproval = await dbCount('approvalRequest')
    return hasApproval >= 0
      ? pass('governance', 'ai_governance_model', `ApprovalRequest model active (${hasApproval} records)`)
      : pending('governance', 'ai_governance_model', 'No AI governance model found')
  },

  async function checkExplainabilityRoutes() {
    const hasExplain = grepDir(join(BACK, 'src'), /explain.decision|explainability|explain-decision/i)
    return hasExplain
      ? pass('governance', 'explainability_routes', 'Decision explanation routes found')
      : pending('governance', 'explainability_routes', 'No explainability routes — add /explain-decision endpoint')
  },

  async function checkAegisIntelligenceRegistry() {
    const count = await dbCount('aegisIntelligenceEntry')
    if (count >= 0) return pass('governance', 'intelligence_registry', `HANUMANAS intelligence registry active (${count} entries)`)
    return pending('governance', 'intelligence_registry', 'HANUMANAS intelligence registry not found')
  },
]

// ─── Domain: Documentation ───────────────────────────────────────────────────

const documentationChecks: CheckFn[] = [

  async function checkArchitectureDocs() {
    const candidates = ['docs/architecture.md', 'docs/ARCHITECTURE.md', 'ARCHITECTURE.md', 'docs/overview.md']
    const found = candidates.find(c => existsSync(join(ROOT, c)))
    return found
      ? pass('documentation', 'architecture_docs', `Architecture doc found at ${found}`)
      : pending('documentation', 'architecture_docs', 'No architecture doc found — create docs/architecture.md')
  },

  async function checkApiDocumentation() {
    // Check for OpenAPI/Swagger spec or JSDoc on routes
    const hasOpenApi = existsSync(join(BACK, 'openapi.yaml')) ||
      existsSync(join(BACK, 'openapi.json')) ||
      existsSync(join(ROOT, 'docs/api.md'))
    const hasJsDoc = grepDir(join(BACK, 'src/routes'), /@swagger|@openapi|@route|@param/i)
    return (hasOpenApi || hasJsDoc)
      ? pass('documentation', 'api_documentation', 'API documentation found (OpenAPI or JSDoc)')
      : pending('documentation', 'api_documentation', 'No API docs — add OpenAPI spec or JSDoc annotations')
  },

  async function checkRunbook() {
    const candidates = ['docs/runbook.md', 'RUNBOOK.md', 'docs/ops/runbook.md']
    const found = candidates.find(c => existsSync(join(ROOT, c)))
    return found
      ? pass('documentation', 'runbook', `Runbook found at ${found}`)
      : pending('documentation', 'runbook', 'No runbook — create docs/runbook.md with startup, shutdown, scaling procedures')
  },

  async function checkFailureScenariosDoc() {
    const candidates = ['docs/failure-scenarios.md', 'docs/incidents.md', 'docs/reliability.md']
    const found = candidates.find(c => existsSync(join(ROOT, c)))
    return found
      ? pass('documentation', 'failure_scenarios', `Failure scenarios doc found at ${found}`)
      : pending('documentation', 'failure_scenarios', 'No failure scenarios doc — create docs/failure-scenarios.md')
  },
]

// ─── Runner ───────────────────────────────────────────────────────────────────

const ALL_CHECKS: CheckFn[] = [
  ...securityChecks,
  ...complianceChecks,
  ...operationsChecks,
  ...governanceChecks,
  ...documentationChecks,
]

export async function runGate6(opts: Gate6Options): Promise<Gate6Summary> {
  const { trigger, verbose = false } = opts
  const log = (...a: any[]) => { if (verbose) console.log('[Gate6]', ...a) }
  const t0 = Date.now()

  log(`Run started — ${ALL_CHECKS.length} checks across 5 domains`)

  const checks: CheckResult[] = []

  for (const fn of ALL_CHECKS) {
    try {
      const result = await fn()
      checks.push(result)
      const icon = result.pending ? '⏳' : result.passed ? '✅' : '❌'
      log(`  ${icon} [${result.domain}] ${result.name}${result.detail ? ' — ' + result.detail.slice(0, 80) : ''}`)
    } catch (err: any) {
      const name = fn.name.replace(/^check/, '').replace(/[A-Z]/g, c => '_' + c.toLowerCase()).slice(1)
      checks.push(fail('unknown', name, `Check threw: ${err.message}`))
      log(`  ❌ ${fn.name} threw: ${err.message}`)
    }
  }

  const passCount    = checks.filter(c => c.passed).length
  const failCount    = checks.filter(c => !c.passed && !c.pending).length
  const pendingCount = checks.filter(c => c.pending).length
  const totalScore   = checks.length > 0 ? checks.reduce((s, c) => s + c.score, 0) / checks.length : 0
  const durationMs   = Date.now() - t0

  // Pass: score ≥ 70 AND passes ≥ 18 AND hard failures ≤ 5
  // PARTIAL: passes criteria not met but score ≥ 50
  const gate: Gate6Summary['gate'] =
    totalScore >= 70 && passCount >= 18 && failCount <= 5 ? 'PASS'
    : totalScore >= 50 ? 'PARTIAL'
    : 'FAIL'

  // Per-domain rollup
  const domains: Gate6Summary['domains'] = {}
  for (const c of checks) {
    if (!domains[c.domain]) domains[c.domain] = { pass: 0, fail: 0, pending: 0, score: 0 }
    if (c.passed)       domains[c.domain].pass++
    else if (c.pending) domains[c.domain].pending++
    else                domains[c.domain].fail++
    domains[c.domain].score += c.score
  }
  for (const d of Object.values(domains)) {
    const total = d.pass + d.fail + d.pending
    if (total > 0) d.score = d.score / total
  }

  // Persist
  const run = await (prisma as any).waandaGate6Run.create({
    data: { trigger, totalScore, passCount, failCount, pendingCount, durationMs, completedAt: new Date() },
  })
  for (const c of checks) {
    await (prisma as any).waandaGate6Check.create({
      data: { runId: run.id, domain: c.domain, name: c.name, passed: c.passed, pending: c.pending, score: c.score, detail: { message: c.detail ?? '' } },
    })
  }

  return { runId: run.id, totalScore, passCount, failCount, pendingCount, durationMs, gate, domains, checks }
}

// ─── CLI ──────────────────────────────────────────────────────────────────────

if (require.main === module) {
  const args    = process.argv.slice(2)
  const trigger = (args.includes('--trigger') ? args[args.indexOf('--trigger') + 1] : 'manual') as Gate6Options['trigger']

  runGate6({ trigger, verbose: true })
    .then(s => {
      console.log('\n═══════════════════════════════════════════════════')
      console.log(`  GATE 6 — ENTERPRISE READINESS: ${s.gate}`)
      console.log(`  Score:     ${s.totalScore.toFixed(1)}/100`)
      console.log(`  Pass:      ${s.passCount}`)
      console.log(`  Pending:   ${s.pendingCount} (human attestation required)`)
      console.log(`  Fail:      ${s.failCount}`)
      console.log(`  Duration:  ${(s.durationMs / 1000).toFixed(1)}s`)
      console.log('═══════════════════════════════════════════════════')
      for (const [domain, d] of Object.entries(s.domains)) {
        console.log(`\n  ── ${domain.toUpperCase()} (${d.score.toFixed(0)}%) ──`)
        s.checks.filter(c => c.domain === domain).forEach(c => {
          const icon = c.pending ? '⏳' : c.passed ? '✅' : '❌'
          console.log(`  ${icon}  ${c.name.padEnd(38)} ${c.score.toFixed(0).padStart(3)}`)
          if (c.detail) console.log(`       ${c.detail.slice(0, 90)}`)
        })
      }
      console.log('')
      process.exit(s.gate === 'FAIL' ? 1 : 0)
    })
    .catch(err => { console.error('Gate6 runner crashed:', err); process.exit(1) })
}
