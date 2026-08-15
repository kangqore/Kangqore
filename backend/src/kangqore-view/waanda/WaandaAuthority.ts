// ---------------------------------------------------------------------------
// WaandaAuthority — Supreme Authority Registry
//
// Singleton that holds the registry of all Kangqore subsystems under
// WAANDA's governance. Every subsystem registers here on boot. WAANDA
// synthesises their intelligence, issues strategic directives, and
// arbitrates cross-system conflicts.
//
// Not a command-and-control hub — WAANDA governs at the meta level.
// Subsystems reason independently; WAANDA steers when the meta-view demands it.
// ---------------------------------------------------------------------------

import {
  WaandaSubsystem,
  WaandaDirective,
  DirectiveResult,
  SubsystemHealth,
  SubsystemIntelligence,
  SubsystemName,
  DirectiveType,
  createDirective,
} from './WaandaDirective'

import { prisma } from '../../lib/prisma'
import logger from '../../utils/logger'

// ---------------------------------------------------------------------------
// Internal types
// ---------------------------------------------------------------------------

interface RegisteredSubsystem {
  subsystem:    WaandaSubsystem
  registeredAt: Date
}

export interface SubsystemReport {
  name:         SubsystemName
  status:       SubsystemHealth['status']
  registeredAt: Date
  lastActive:   Date
  metrics:      Record<string, number | string>
}

// Escalation from AEGIS or any subsystem — WAANDA decides what action to take
export interface WaandaEscalation {
  from:    SubsystemName | string
  threat:  string
  tier:    'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
  source:  string
  action?: string          // the action the subsystem wanted to take
  context: Record<string, unknown>
}

// ---------------------------------------------------------------------------
// WaandaAuthority singleton
// ---------------------------------------------------------------------------

export const WaandaAuthority = {
  _registry: new Map<SubsystemName, RegisteredSubsystem>(),
  _initialized: false,

  // ── Init ─────────────────────────────────────────────────────────────────

  initialize(): void {
    if (this._initialized) return
    this._initialized = true
    logger.info('[WAANDA:AUTHORITY] Initialized — awaiting subsystem registration')
  },

  // ── Registration ─────────────────────────────────────────────────────────

  register(subsystem: WaandaSubsystem): void {
    this._registry.set(subsystem.name, {
      subsystem,
      registeredAt: new Date(),
    })
    logger.info(`[WAANDA:AUTHORITY] ${subsystem.name} registered under supreme authority`)
  },

  getRegisteredSystems(): SubsystemReport[] {
    return Array.from(this._registry.entries()).map(([name, entry]) => {
      const health = entry.subsystem.getHealth()
      return {
        name,
        status:       health.status,
        registeredAt: entry.registeredAt,
        lastActive:   health.lastActive,
        metrics:      health.metrics,
      }
    })
  },

  isRegistered(name: SubsystemName): boolean {
    return this._registry.has(name)
  },

  // ── Directives ───────────────────────────────────────────────────────────

  async issueDirective(
    to:      SubsystemName,
    type:    DirectiveType,
    payload: Record<string, unknown>,
    reason?: string,
    ttlMs?:  number,
  ): Promise<DirectiveResult> {
    const entry = this._registry.get(to)
    const directive = createDirective(to, type, payload, reason, ttlMs)

    if (!entry) {
      logger.warn(`[WAANDA:AUTHORITY] Directive to unregistered subsystem: ${to}`)
      const result: DirectiveResult = {
        directiveId: directive.id,
        subsystem:   to,
        accepted:    false,
        detail:      'Subsystem not registered',
        resolvedAt:  new Date(),
      }
      await this._logDirective(directive, result)
      return result
    }

    logger.info(`[WAANDA:AUTHORITY] → ${to} [${type}]${reason ? ` — ${reason}` : ''}`)

    let result: DirectiveResult
    try {
      result = await entry.subsystem.receiveDirective(directive)
    } catch (err: any) {
      result = {
        directiveId: directive.id,
        subsystem:   to,
        accepted:    false,
        detail:      err?.message ?? 'Unknown error',
        resolvedAt:  new Date(),
      }
    }

    await this._logDirective(directive, result)
    return result
  },

  async broadcastDirective(
    type:    DirectiveType,
    payload: Record<string, unknown>,
    reason?: string,
  ): Promise<DirectiveResult[]> {
    const names = Array.from(this._registry.keys())
    logger.info(`[WAANDA:AUTHORITY] BROADCAST [${type}] to ${names.length} subsystems`)
    return Promise.all(
      names.map(name => this.issueDirective(name, type, payload, reason))
    )
  },

  // ── Escalation (AEGIS → WAANDA → decision) ────────────────────────────────

  async receiveEscalation(escalation: WaandaEscalation): Promise<void> {
    logger.warn(
      `[WAANDA:AUTHORITY] ESCALATION from ${escalation.from} — ${escalation.tier}: ${escalation.threat}`
    )

    // Import KIMMP flag to check current governance mode
    let currentETI = 0
    try {
      const { TrustEngine } = await import('../../kangqore-immp/cognition/trustEngine')
      const eti = await TrustEngine.getETI().catch(() => null)
      currentETI = eti?.overall ?? 0
    } catch {}

    if (escalation.tier === 'CRITICAL') {
      // WAANDA decides: if ETI is healthy (>=70), trust the escalation and pause KIMMP
      // If ETI is low, WAANDA is already in a degraded state — just notify
      if (currentETI >= 70 && this._registry.has('KIMMP')) {
        await this.issueDirective('KIMMP', 'PAUSE', {
          reason:    'AEGIS CRITICAL escalation',
          threat:    escalation.threat,
          source:    escalation.source,
          escalationTier: escalation.tier,
        }, `AEGIS escalation: ${escalation.threat}`)

        await this.issueDirective('AEGIS', 'REPORT', {
          investigate: escalation.source,
          context:     escalation.context,
        }, 'Post-escalation investigation')
      }

      // Emit WebSocket event so CEO sees it
      try {
        const { emitToAdmins } = await import('../../socket')
        emitToAdmins('kimmp:aegis-escalation', {
          threat:   escalation.threat,
          tier:     escalation.tier,
          from:     escalation.from,
          source:   escalation.source,
          action:   escalation.action,
          kimmpPaused: currentETI >= 70,
          timestamp: new Date().toISOString(),
        })
      } catch {}
    }

    // Log escalation as a signal
    try {
      const { SignalLedger } = await import('../../kangqore-immp/signals/signalLedger.service')
      await SignalLedger.record({
        sourceModule:   'waanda.authority',
        signalType:     `AEGIS_ESCALATION_${escalation.tier}`,
        signalCategory: 'RISK',
        signalValue:    `${escalation.from}: ${escalation.threat}`,
        severity:       escalation.tier as any,
        confidence:     0.95,
        metadata:       escalation.context,
      }).catch(() => {})
    } catch {}
  },

  // ── Health Check ─────────────────────────────────────────────────────────

  healthCheck(): Record<SubsystemName, SubsystemHealth> {
    const result = {} as Record<SubsystemName, SubsystemHealth>
    for (const [name, entry] of this._registry.entries()) {
      try {
        result[name] = entry.subsystem.getHealth()
      } catch {
        result[name] = {
          subsystem:  name,
          status:     'UNKNOWN',
          lastActive: entry.registeredAt,
          metrics:    {},
        }
      }
    }
    return result
  },

  // Collect SubsystemIntelligence from all registered systems
  collectIntelligence(): SubsystemIntelligence[] {
    const results: SubsystemIntelligence[] = []
    for (const [, entry] of this._registry.entries()) {
      try {
        results.push(entry.subsystem.getIntelligence())
      } catch {}
    }
    return results
  },

  // ── DB Logging ───────────────────────────────────────────────────────────

  async _logDirective(directive: WaandaDirective, result: DirectiveResult): Promise<void> {
    try {
      await (prisma as any).waandaDirectiveLog.create({
        data: {
          directiveId: directive.id,
          to:          directive.to,
          type:        directive.type,
          payload:     directive.payload as any,
          reason:      directive.reason ?? null,
          accepted:    result.accepted,
          result:      { detail: result.detail } as any,
          issuedAt:    directive.issuedAt,
          resolvedAt:  result.resolvedAt,
        },
      })
    } catch {}
  },
}
