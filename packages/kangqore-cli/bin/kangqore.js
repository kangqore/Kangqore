#!/usr/bin/env node
/**
 * kangqore — Kangqore View developer CLI
 *
 * init → dev → validate → test → deploy → publish
 *
 * Credentials come from the environment, never from flags, so they don't land
 * in shell history or CI logs:
 *   KANGQORE_URL, KANGQORE_CLIENT_ID, KANGQORE_CLIENT_SECRET, KANGQORE_TENANT
 */

'use strict'

const fs = require('fs')
const path = require('path')

const MANIFEST = 'kangqore.manifest.json'
const BASE = (process.env.KANGQORE_URL || 'https://app.kangqoreview.com').replace(/\/$/, '')

const c = {
  dim: s => `\x1b[2m${s}\x1b[0m`,
  bold: s => `\x1b[1m${s}\x1b[0m`,
  green: s => `\x1b[32m${s}\x1b[0m`,
  red: s => `\x1b[31m${s}\x1b[0m`,
  yellow: s => `\x1b[33m${s}\x1b[0m`,
}

function die(msg) {
  console.error(`${c.red('✗')} ${msg}`)
  process.exit(1)
}

function readManifest() {
  const file = path.resolve(process.cwd(), MANIFEST)
  if (!fs.existsSync(file)) die(`No ${MANIFEST} in this directory. Run \`kangqore init <name>\` first.`)
  try {
    return { file, manifest: JSON.parse(fs.readFileSync(file, 'utf8')) }
  } catch (err) {
    die(`${MANIFEST} is not valid JSON: ${err.message}`)
  }
}

async function token() {
  const clientId = process.env.KANGQORE_CLIENT_ID
  const clientSecret = process.env.KANGQORE_CLIENT_SECRET
  if (!clientId || !clientSecret) {
    die('Set KANGQORE_CLIENT_ID and KANGQORE_CLIENT_SECRET in your environment.')
  }
  const res = await fetch(`${BASE}/api/developer/oauth/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      grant_type: 'client_credentials',
      client_id: clientId,
      client_secret: clientSecret,
      tenant_id: process.env.KANGQORE_TENANT || 'default',
    }),
  })
  if (!res.ok) die(`OAuth failed (${res.status}): ${await res.text()}`)
  return (await res.json()).access_token
}

async function api(method, endpoint, body) {
  const res = await fetch(`${BASE}${endpoint}`, {
    method,
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${await token()}` },
    body: body === undefined ? undefined : JSON.stringify(body),
  })
  const text = await res.text()
  let parsed
  try {
    parsed = text ? JSON.parse(text) : null
  } catch {
    parsed = text
  }
  if (!res.ok) die(`${method} ${endpoint} → ${res.status}: ${parsed?.error ?? text}`)
  return parsed
}

// ── commands ──────────────────────────────────────────────────────────────────

const commands = {
  init(name) {
    if (!name) die('Usage: kangqore init <app-name>')
    const dir = path.resolve(process.cwd(), name)
    fs.mkdirSync(dir, { recursive: true })

    const appId = `app-${name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}`
    const manifest = {
      manifestVersion: '1.0',
      appId,
      name,
      version: '1.0.0',
      category: 'COMMUNITY',
      publisher: { name: 'Your Name', email: 'you@example.com', website: 'https://example.com' },
      description: `${name} — built on Kangqore View`,
      permissions: [{ resource: 'WorkItem', action: 'READ', reason: 'Read work items to render the app view' }],
      ontologyBindings: [{ objectType: 'WorkItem', relationshipTypes: ['belongsTo'] }],
      actions: [
        {
          name: 'SYNC_WORK_ITEM',
          displayName: 'Sync Work Item',
          description: 'Synchronise a work item with the external system of record',
          parameters: [{ name: 'workItemId', type: 'string', required: true, description: 'Work item id' }],
        },
      ],
      agents: [],
      uiWidgets: [],
    }

    fs.writeFileSync(path.join(dir, MANIFEST), JSON.stringify(manifest, null, 2) + '\n')
    fs.writeFileSync(
      path.join(dir, 'index.js'),
      `import { KangqoreClient, GovernanceError } from '@kangqore/view-sdk'

const kq = new KangqoreClient('${appId}', {
  baseUrl: process.env.KANGQORE_URL,
  clientId: process.env.KANGQORE_CLIENT_ID,
  clientSecret: process.env.KANGQORE_CLIENT_SECRET,
  tenantId: process.env.KANGQORE_TENANT,
})

try {
  const res = await kq.actions.invoke('SYNC_WORK_ITEM', { workItemId: 'wi-1' })
  console.log(res.result)
} catch (err) {
  if (err instanceof GovernanceError) {
    console.error(\`Refused (\${err.outcome}) — audit \${err.auditId}\`)
  } else throw err
}
`,
    )
    fs.writeFileSync(
      path.join(dir, 'package.json'),
      JSON.stringify(
        { name, version: '1.0.0', type: 'module', dependencies: { '@kangqore/view-sdk': '^1.0.0' } },
        null,
        2,
      ) + '\n',
    )
    fs.writeFileSync(path.join(dir, '.gitignore'), 'node_modules\n.env\n')

    console.log(`${c.green('✓')} Created ${c.bold(name)}/`)
    console.log(c.dim('  kangqore.manifest.json, index.js, package.json'))
    console.log(`\nNext:\n  cd ${name} && npm install\n  kangqore validate`)
  },

  async validate() {
    const { manifest } = readManifest()
    const result = await api('POST', '/api/developer/manifest/validate', manifest)
    if (!result.valid) {
      console.log(`${c.red('✗')} Manifest invalid:`)
      for (const e of result.errors) console.log(`  • ${e}`)
      process.exit(1)
    }
    console.log(`${c.green('✓')} Manifest valid`)
    if (result.governance) {
      const { score, notes } = result.governance
      const badge = score >= 80 ? c.green(`${score}/100 — certifiable`) : c.yellow(`${score}/100 — below the 80 certification threshold`)
      console.log(`  Governance score: ${badge}`)
      for (const n of notes) console.log(c.dim(`  • ${n}`))
    }
  },

  async test() {
    const { manifest } = readManifest()
    const run = await api('POST', `/api/developer/apps/${manifest.appId}/test`, {})
    for (const r of run.results) {
      const mark = r.passed ? c.green('✓') : c.red('✗')
      console.log(`  ${mark} ${r.name} ${c.dim(`(${r.outcome}, ${r.durationMs}ms)`)}`)
      if (!r.passed && r.reason) console.log(c.dim(`      ${r.reason}`))
    }
    const line = `${run.passedTests}/${run.totalTests} passed`
    console.log(run.failedTests === 0 ? `\n${c.green('✓')} ${line}` : `\n${c.red('✗')} ${line}`)
    process.exit(run.failedTests === 0 ? 0 : 1)
  },

  async deploy(env) {
    const { manifest } = readManifest()
    const environment = (env || 'SANDBOX').toUpperCase()
    const d = await api('POST', `/api/developer/apps/${manifest.appId}/deploy`, { environment })
    console.log(`${c.green('✓')} ${manifest.appId}@${d.version} → ${c.bold(environment)} (${d.status})`)
    if (d.logs) console.log(c.dim(d.logs.split('\n').map(l => `  ${l}`).join('\n')))
  },

  async publish() {
    const { manifest } = readManifest()
    const r = await api('POST', `/api/developer/apps/${manifest.appId}/publish`, {})
    console.log(`${c.green('✓')} Published ${c.bold(manifest.appId)}`)
    console.log(`  Governance score: ${r.governanceScore}/100`)
    console.log(`  Certified badge:  ${r.certifiedBadge ? c.green('yes') : c.yellow('no — needs 80+')}`)
    for (const n of r.certificationNotes || []) console.log(c.dim(`  • ${n}`))
  },

  async telemetry() {
    const { manifest } = readManifest()
    const t = await api('GET', `/api/developer/apps/${manifest.appId}/telemetry?sinceHours=24`)
    console.log(`${c.bold(manifest.appId)} ${c.dim('· last 24h')}`)
    console.log(`  calls ${t.totalCalls}   allowed ${c.green(t.allowed)}   denied ${c.red(t.denied)}   errors ${t.errors}`)
    console.log(`  credits ${t.creditsCharged}   avg ${t.avgDurationMs}ms   p95 ${t.p95DurationMs}ms`)
  },
}

const HELP = `
${c.bold('kangqore')} — Kangqore View developer CLI

  ${c.bold('kangqore init')} <name>        Scaffold a new app
  ${c.bold('kangqore validate')}           Validate the manifest and score governance
  ${c.bold('kangqore test')}               Run the suite against the governance kernel
  ${c.bold('kangqore deploy')} [env]       Deploy (SANDBOX | STAGING | PRODUCTION)
  ${c.bold('kangqore publish')}            Publish to the marketplace
  ${c.bold('kangqore telemetry')}          Show 24h call and denial counts

${c.dim('Environment:')}
  KANGQORE_URL            Instance URL (default https://app.kangqoreview.com)
  KANGQORE_CLIENT_ID      OAuth client id
  KANGQORE_CLIENT_SECRET  OAuth client secret
  KANGQORE_TENANT         Tenant (default "default")
`

async function main() {
  const [cmd, ...args] = process.argv.slice(2)
  if (!cmd || cmd === '--help' || cmd === '-h' || cmd === 'help') {
    console.log(HELP)
    return
  }
  if (cmd === '--version' || cmd === '-v') {
    console.log(require('../package.json').version)
    return
  }
  const fn = commands[cmd]
  if (!fn) die(`Unknown command "${cmd}". Run \`kangqore --help\`.`)
  await fn(...args)
}

main().catch(err => die(err.message))
