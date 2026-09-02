// ---------------------------------------------------------------------------
// WAANDA Bootstrap — Constitutional Boot Authority
//
// Single entry point for the Kangqore Enterprise Cognitive OS.
// index.ts handles infrastructure only (Express, HTTP, Socket.io).
// Everything cognitive is owned and initialized here.
//
// ─── Boot Sequence ───────────────────────────────────────────────────────────
//   0.  Authority Layer      — WaandaAuthority init (supreme authority registry)
//   1.  Memory Layer         — PostgresMemoryProvider warm-up
//   2.  HANUMANAS Governance     — 80 agents + event cascade → HanumanasAdapter registered
//   3.  KORE Runtime         — twin runtime + language registries → KoreAdapter registered
//   4.  KEOS Runtime         — mission kernel + capability registry warm-up → KeosAdapter registered
//   5.  Enterprise Domains   — self-registration via domains/index.ts
//   6.  Capabilities         — domain capability counts + AnalyticsRegistry
//   7.  Twin Networks        — self-registration via domains/twin/index.ts
//   8.  Prediction Models    — self-registration via domains/prediction/index.ts
//   9.  Cognitive Library    — 7 scheduler agents (117 cognitive components) → KimmpAdapter registered
//  10.  Mission Runtime      — KIMMP LoopScheduler declared as mission engine
//  11.  Infrastructure       — CronManager, CDC, KB index, SystemRAG
//
// Phase C — Registration Instead of Imports:
//   WaandaBootstrap does NOT import individual domains, twins, or models.
//   Each group exposes an index.ts that self-registers on import.
//   WAANDA calls `await import('../../domains')` — not `import { SalesDomain }`.
//
// Subsystems registered via index.ts mount (after boot):
//   VIS, ALIS, eQORE — adapter registered when their routers are mounted
// ---------------------------------------------------------------------------

import { DomainRegistry }   from '../edf/core/DomainRegistry'
import { CapabilityRegistry } from '../kernel/CapabilityRegistry'
import { WaandaAuthority }  from './WaandaAuthority'

// HANUMANAS — governance shield
import { HanumanasScheduler, HanumanasEventEmitter } from '../esf/hanumanas'

// Cognitive Library — scheduler agents (kangqore-immp = 117 cognitive components)
import { ScoutScheduler }        from '../../kangqore-immp/scout/scoutScheduler'
import { GoalScheduler }         from '../../kangqore-immp/goals/goalScheduler'
import { ProactiveScheduler }    from '../../kangqore-immp/proactive/proactiveScheduler'
import { TwinScheduler }         from '../../kangqore-immp/twin/twinScheduler'
import { LoopScheduler }         from '../../kangqore-immp/agents/loopScheduler'
import { MetaBriefingScheduler } from '../../kangqore-immp/agents/metaBriefingScheduler'
import { KIMMLearningScheduler } from '../../kangqore-immp/learning/kimmpLearningScheduler'

// Infrastructure
import { CronManager } from '../../jobs/CronManager'
import { CdcService }  from '../../lib/cdc/cdcService'
import { OntologyWebhookSubscriptionService } from '../eof/OntologyWebhookSubscription'
import { KimmpOperationalWebhookService } from '../kimmp/gateway/KimmpOperationalWebhook'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface BootPhase {
  phase:   string
  status:  'ok' | 'warn' | 'error'
  detail?: string
  ms:      number
}

// ---------------------------------------------------------------------------
// WAANDA — the boot authority
// ---------------------------------------------------------------------------

interface SubsystemReport {
  status:      'OPERATIONAL' | 'DEGRADED' | 'OFFLINE'
  reportedAt:  Date
  details?:    Record<string, unknown>
}

export const WAANDA = {
  _booted:      false,
  _bootedAt:    null as Date | null,
  _phases:      [] as BootPhase[],
  _subsystems:  {} as Record<string, SubsystemReport>,

  // ── Public API ────────────────────────────────────────────────────────────

  async boot(): Promise<void> {
    if (this._booted) return
    const t0 = Date.now()

    console.log('[WAANDA] ══════════════════════════════════════════════')
    console.log('[WAANDA] BOOT SEQUENCE — Kangqore Enterprise Cognitive OS')
    console.log('[WAANDA] ══════════════════════════════════════════════')

    // Authority layer — must be first
    await this._run('Phase 0  · Authority Layer',    () => this._bootAuthority())

    // Infrastructure layer
    await this._run('Phase 1  · Memory Layer',       () => this._bootMemory())
    await this._run('Phase 2  · HANUMANAS Governance',   () => this._bootHanumanas())
    await this._run('Phase 3  · KORE Runtime',       () => this._bootKore())
    await this._run('Phase 4  · KEOS Runtime',       () => this._bootKeos())

    // Enterprise Platform layer
    await this._run('Phase 5  · Enterprise Domains', () => this._bootDomains())
    await this._run('Phase 6  · Capabilities',       () => this._bootCapabilities())
    await this._run('Phase 7  · Twin Networks',      () => this._bootTwins())
    await this._run('Phase 8  · Prediction Models',  () => this._bootPredictions())

    // Cognitive layer
    await this._run('Phase 9  · Cognitive Library',  () => this._bootCognitiveLibrary())
    await this._run('Phase 10 · Mission Runtime',    () => this._bootMissionRuntime())
    await this._run('Phase 11 · Infrastructure',     () => this._bootInfrastructure())

    this._booted   = true
    this._bootedAt = new Date()

    const errors  = this._phases.filter(p => p.status === 'error').length
    const elapsed = Date.now() - t0

    if (errors > 0) {
      console.warn(`[WAANDA] ════ OPERATIONAL WITH ${errors} DEGRADED PHASE(S) (${elapsed}ms) ════`)
    } else {
      console.log(`[WAANDA] ════ OPERATIONAL — Enterprise Cognitive OS Ready (${elapsed}ms) ════`)
    }
  },

  // External subsystems call this after their own boot to register with WAANDA.
  // WAANDA does not block on them — they report voluntarily when ready.
  reportSubsystem(id: string, info: { status: 'OPERATIONAL' | 'DEGRADED' | 'OFFLINE'; details?: Record<string, unknown> }): void {
    this._subsystems[id] = { ...info, reportedAt: new Date() }
    console.log(`[WAANDA] ← ${id.toUpperCase()} reported ${info.status}`)
  },

  status(): Record<string, unknown> {
    const domains = DomainRegistry.getAll()
    const authorityHealth = WaandaAuthority.healthCheck()
    const authorityRegistered = WaandaAuthority.getRegisteredSystems()
    return {
      system:    'WAANDA',
      fullName:  'WAANDA — Enterprise Cognitive Operating System',
      booted:    this._booted,
      bootedAt:  this._bootedAt,
      phases:    this._phases,
      domains:   domains.map(d => ({
        id:           d.metadata.id,
        name:         d.metadata.name,
        version:      d.metadata.version,
        ready:        DomainRegistry.isDomainReady(d.metadata.id),
        capabilities: d.capabilities.length,
        twins:        d.twins.length,
        goals:        d.goals.length,
      })),
      authority: {
        initialized:  WaandaAuthority._initialized,
        registered:   authorityRegistered.length,
        subsystems:   authorityRegistered,
        health:       authorityHealth,
      },
      subsystems: Object.fromEntries(
        Object.entries(this._subsystems).map(([k, v]) => [k, v.status])
      ),
      subsystemDetails: this._subsystems,
      timestamp: new Date().toISOString(),
    }
  },

  // ── Boot Phases ───────────────────────────────────────────────────────────

  async _run(name: string, fn: () => Promise<void>): Promise<void> {
    const t = Date.now()
    try {
      await fn()
      const ms = Date.now() - t
      this._phases.push({ phase: name, status: 'ok', ms })
      console.log(`[WAANDA]   ✓ ${name} (${ms}ms)`)
    } catch (err: any) {
      const ms = Date.now() - t
      this._phases.push({ phase: name, status: 'error', detail: err?.message, ms })
      console.error(`[WAANDA]   ✗ ${name} — ${err?.message ?? 'unknown error'}`)
    }
  },

  async _bootAuthority(): Promise<void> {
    WaandaAuthority.initialize()
  },

  async _bootMemory(): Promise<void> {
    // Eagerly warm the provider so it's ready before missions start.
    const { CognitiveMemoryManager } = await import('../../immp/core/CognitiveMemoryManager')
    CognitiveMemoryManager.getProvider()
  },

  async _bootHanumanas(): Promise<void> {
    HanumanasScheduler.start()
    await HanumanasEventEmitter.init()
    this.reportSubsystem('aegis', {
      status:  'OPERATIONAL',
      details: { agents: 80, engines: 10, schedulerStarted: true },
    })
    // Register HANUMANAS under WAANDA authority
    const { HanumanasAdapter } = await import('./adapters/HanumanasAdapter')
    WaandaAuthority.register(HanumanasAdapter)
  },

  async _bootKore(): Promise<void> {
    // KORE Runtime — KEOS twin runtime + language registries
    // Singletons initialize on first use; boot declares ownership.
    const { KeosEventBus } = await import('../kernel/KeosEventBus')
    KeosEventBus.publish('WAANDA_BOOT', { phase: 'KORE', timestamp: new Date().toISOString() })
    this.reportSubsystem('kore', {
      status:  'OPERATIONAL',
      details: { eventBusPublished: true },
    })
    const { KoreAdapter } = await import('./adapters/KoreAdapter')
    WaandaAuthority.register(KoreAdapter)
  },

  async _bootKeos(): Promise<void> {
    // KEOS Runtime — warm up CapabilityRegistry (lightweight DB touch)
    const caps = await CapabilityRegistry.listCapabilities().catch(() => [])
    this.reportSubsystem('keos', {
      status:  'OPERATIONAL',
      details: { capabilitiesWarmedUp: caps.length },
    })
    const { KeosAdapter } = await import('./adapters/KeosAdapter')
    WaandaAuthority.register(KeosAdapter)
  },

  async _bootDomains(): Promise<void> {
    // Phase C: single import triggers self-registration of all 4 enterprise domains.
    // WaandaBootstrap does NOT name SalesDomain, CustomerDomain, etc. individually.
    await import('../../domains')
    const all = DomainRegistry.getAll()
    this.reportSubsystem('domains', {
      status:  all.length > 0 ? 'OPERATIONAL' : 'DEGRADED',
      details: { registered: all.map(d => d.metadata.id) },
    })
  },

  async _bootCapabilities(): Promise<void> {
    // Log capability inventory from the EDF domain registry
    const all = DomainRegistry.getAll()
    const total = all.reduce((n, d) => n + d.capabilities.length, 0)
    // Initialize AnalyticsRegistry singleton
    const { AnalyticsRegistry } = await import('../../domains/analytics/AnalyticsRegistry')
    AnalyticsRegistry.getInstance()
    if (total === 0 && all.length === 0) throw new Error('No domains registered — capability count is 0')
  },

  async _bootTwins(): Promise<void> {
    // Phase C: single import triggers self-registration of CustomerTwin + FinanceTwin.
    await import('../../domains/twin')
  },

  async _bootPredictions(): Promise<void> {
    // Phase C: single import triggers self-registration of Churn + Revenue models.
    await import('../../domains/prediction')
  },

  async _bootCognitiveLibrary(): Promise<void> {
    // kangqore-immp = the WAANDA Cognitive Library (117 components across 30+ directories)
    ScoutScheduler.start()
    GoalScheduler.start()
    ProactiveScheduler.start()
    TwinScheduler.start()
    KIMMLearningScheduler.start()
    this.reportSubsystem('cognitive', {
      status:  'OPERATIONAL',
      details: { schedulers: ['scout', 'goal', 'proactive', 'twin', 'learning'] },
    })
    const { KimmpAdapter } = await import('./adapters/KimmpAdapter')
    WaandaAuthority.register(KimmpAdapter)
  },

  async _bootMissionRuntime(): Promise<void> {
    // The KIMMP LoopScheduler IS the Mission Runtime.
    // MetaBriefingScheduler generates WAANDA's executive briefings.
    LoopScheduler.start()
    MetaBriefingScheduler.start()
    this.reportSubsystem('kimmp', {
      status:  'OPERATIONAL',
      details: { loopScheduler: true, metaBriefingScheduler: true },
    })
  },

  async _bootInfrastructure(): Promise<void> {
    CronManager.initialize()
    await CdcService.init()
    await OntologyWebhookSubscriptionService.init()
    await KimmpOperationalWebhookService.init()
    this.reportSubsystem('infrastructure', {
      status:  'OPERATIONAL',
      details: { cronManager: true, cdc: true, ontologyWebhooks: true, kimmpOperationalWebhooks: true },
    })

    // KB index + SystemRAG are heavy — defer until after port is bound
    setImmediate(() => {
      import('./intelligence/ConciergeRetrieval').then(({ indexKnowledgeBase, startKbWatcher }) => {
        indexKnowledgeBase().catch(() => {}).finally(() => startKbWatcher())
      }).catch(() => {})

      import('../../kangqore-immp/agents/systemRAG').then(({ SystemRAG }) => {
        SystemRAG.warmUp().catch(() => {})
      }).catch(() => {})
    })
  },
}
