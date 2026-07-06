import { prisma } from '../../lib/prisma'
import { decryptConfig } from '../../lib/vault'
import { executeIntegration, testIntegration, getHealth, getDeadLetterQueue, allCapabilities, whoCanDo, getManifests } from '../../integrations'
import { ConnectorRegistry } from '../../integrations'
import type { Platform } from '../../integrations/types'
import { randomBytes } from 'crypto'

export interface DispatchRequest {
  platform:        Platform
  action:          string
  params:          Record<string, any>
  userId:          string
  kimmActionId?:   string
  idempotencyKey?: string   // alias accepted from callers; merged with kimmActionId
}

export interface DispatchResult {
  ok:             boolean
  summary:        string
  data?:          any
  error?:         string
  idempotencyKey: string
}

export class KimmpToolDispatch {

  // ── Execute an external action ────────────────────────────────────────────
  static async dispatch(req: DispatchRequest): Promise<DispatchResult> {
    const { platform, action, params, userId, kimmActionId } = req

    // Load + decrypt config
    const stored = await prisma.orgIntegrationConfig.findUnique({
      where: { userId_platform: { userId, platform } },
    })
    if (!stored || !stored.enabled) {
      return { ok: false, summary: `${platform} integration not configured`, error: 'NOT_CONFIGURED', idempotencyKey: '' }
    }

    let config: Record<string, string>
    try {
      config = decryptConfig(stored.config as string)
    } catch {
      return { ok: false, summary: 'Failed to decrypt integration config', error: 'DECRYPT_FAILED', idempotencyKey: '' }
    }

    const idempotencyKey = kimmActionId ?? req.idempotencyKey ?? randomBytes(8).toString('hex')
    const result = await executeIntegration(platform, action, params, config, userId, idempotencyKey)

    // Persist to audit log
    try {
      await (prisma as any).aegisAuditLog.create({
        data: {
          eventType:   'KIMMP_EXTERNAL_WRITE',
          actorId:     userId,
          resourceId:  kimmActionId ?? idempotencyKey,
          resourceType: 'KIMMP_ACTION',
          outcome:     result.ok ? 'SUCCESS' : 'FAILURE',
          metadata:    { platform, action, params, summary: result.summary, idempotencyKey },
        },
      })
    } catch { /* audit log is non-critical */ }

    // Update lastUsedAt
    if (result.ok) {
      await prisma.orgIntegrationConfig.update({
        where: { userId_platform: { userId, platform } },
        data:  { lastUsedAt: new Date() },
      })
    }

    return { ...result, idempotencyKey }
  }

  // ── Save / update config (encrypts before storing) ────────────────────────
  static async saveConfig(
    userId:    string,
    platform:  Platform,
    rawConfig: Record<string, string>,
  ): Promise<void> {
    const { encryptConfig } = await import('../../lib/vault')
    const encrypted = encryptConfig(rawConfig)
    await prisma.orgIntegrationConfig.upsert({
      where:  { userId_platform: { userId, platform } },
      create: { userId, platform, config: encrypted, enabled: true },
      update: { config: encrypted, enabled: true, updatedAt: new Date() },
    })
  }

  // ── Test connectivity ─────────────────────────────────────────────────────
  static async test(userId: string, platform: Platform): Promise<{ ok: boolean; message: string }> {
    const stored = await prisma.orgIntegrationConfig.findUnique({
      where: { userId_platform: { userId, platform } },
    })
    if (!stored) return { ok: false, message: 'Not configured' }
    let config: Record<string, string>
    try { config = decryptConfig(stored.config as string) }
    catch { return { ok: false, message: 'Config decryption failed' } }
    return testIntegration(platform, config, userId)
  }

  // ── Health ────────────────────────────────────────────────────────────────
  static getHealth(userId: string, platform: Platform) {
    return getHealth(userId, platform)
  }

  static getDeadLetterQueue() {
    return getDeadLetterQueue()
  }

  // ── Capability Registry ───────────────────────────────────────────────────
  static allCapabilities()                 { return allCapabilities() }
  static whoCanDo(capability: string)      { return whoCanDo(capability) }
  static manifests()                       { return getManifests() }

  // ── List configured integrations for a user ───────────────────────────────
  static async listForUser(userId: string) {
    const rows = await prisma.orgIntegrationConfig.findMany({ where: { userId } })
    return rows.map(r => ({
      platform:    r.platform as Platform,
      enabled:     r.enabled,
      lastUsedAt:  r.lastUsedAt,
      health:      getHealth(userId, r.platform as Platform),
      manifest:    ConnectorRegistry.get(r.platform as Platform)?.manifest,
    }))
  }
}
