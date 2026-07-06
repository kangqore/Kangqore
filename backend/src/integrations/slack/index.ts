import type { IntegrationAdapter, IntegrationConfig, IntegrationResult, IntegrationTestResult } from '../types'

const ACTIONS = ['sendMessage', 'sendBlocks', 'uploadFile'] as const

async function post(webhookUrl: string, payload: object): Promise<{ ok: boolean; status: number }> {
  const res = await fetch(webhookUrl, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify(payload),
  })
  return { ok: res.ok, status: res.status }
}

export const SlackAdapter: IntegrationAdapter = {
  actions: () => [...ACTIONS],

  async test(config: IntegrationConfig): Promise<IntegrationTestResult> {
    if (!config.webhookUrl) return { ok: false, message: 'webhookUrl is required' }
    const { ok, status } = await post(config.webhookUrl, {
      text: '✅ Kangqore OS — Slack integration connected successfully.',
    })
    return ok
      ? { ok: true, message: 'Slack webhook verified' }
      : { ok: false, message: `Webhook returned HTTP ${status}` }
  },

  async execute(action: string, params: Record<string, any>, config: IntegrationConfig): Promise<IntegrationResult> {
    const webhookUrl = config.webhookUrl
    if (!webhookUrl) return { ok: false, summary: 'No webhookUrl configured', error: 'MISSING_CONFIG' }

    switch (action) {
      case 'sendMessage': {
        const text = params.text ?? params.message ?? '(no message)'
        const payload: any = { text }
        if (params.channel) payload.channel = params.channel
        if (params.username) payload.username = params.username
        const { ok } = await post(webhookUrl, payload)
        return ok
          ? { ok: true, summary: `Message sent to Slack: "${text.slice(0, 60)}"` }
          : { ok: false, summary: 'Slack message failed', error: 'WEBHOOK_ERROR' }
      }
      case 'sendBlocks': {
        const blocks = params.blocks ?? []
        const { ok } = await post(webhookUrl, { text: params.text ?? '', blocks })
        return ok
          ? { ok: true, summary: 'Rich block message sent to Slack' }
          : { ok: false, summary: 'Slack blocks message failed', error: 'WEBHOOK_ERROR' }
      }
      case 'uploadFile':
        return { ok: false, summary: 'File upload requires Slack Bot token (not webhook)', error: 'UNSUPPORTED' }
      default:
        return { ok: false, summary: `Unknown Slack action: ${action}`, error: 'UNKNOWN_ACTION' }
    }
  },
}
