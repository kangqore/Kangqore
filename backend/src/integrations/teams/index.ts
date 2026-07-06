import type { IntegrationAdapter, IntegrationConfig, IntegrationResult, IntegrationTestResult } from '../types'

export const TeamsAdapter: IntegrationAdapter = {
  actions: () => ['sendMessage', 'sendAdaptiveCard', 'createChannel', 'sendChannelMessage'],

  async test(config: IntegrationConfig): Promise<IntegrationTestResult> {
    if (!config.webhookUrl) return { ok: false, message: 'Missing webhook URL' }
    try {
      const res = await fetch(config.webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ '@type': 'MessageCard', '@context': 'http://schema.org/extensions', text: 'Kangqore OS — AEGIS connection test ✓' }),
      })
      return res.ok ? { ok: true, message: 'Teams webhook connected' } : { ok: false, message: `HTTP ${res.status}` }
    } catch (e: any) {
      return { ok: false, message: e.message }
    }
  },

  async execute(action: string, params: Record<string, any>, config: IntegrationConfig): Promise<IntegrationResult> {
    try {
      switch (action) {
        case 'sendMessage':
        case 'sendChannelMessage': {
          const res = await fetch(config.webhookUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ '@type': 'MessageCard', '@context': 'http://schema.org/extensions', themeColor: params.color ?? '0076D7', summary: params.text, sections: [{ activityText: params.text }] }),
          })
          return res.ok ? { ok: true, summary: 'Message sent to Teams' } : { ok: false, summary: `HTTP ${res.status}`, error: 'API_ERROR' }
        }

        case 'sendAdaptiveCard': {
          const card = params.card ?? { type: 'AdaptiveCard', body: [{ type: 'TextBlock', text: params.text ?? 'Notification from Kangqore OS' }] }
          const res = await fetch(config.webhookUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ type: 'message', attachments: [{ contentType: 'application/vnd.microsoft.card.adaptive', content: card }] }),
          })
          return res.ok ? { ok: true, summary: 'Adaptive card sent to Teams' } : { ok: false, summary: `HTTP ${res.status}`, error: 'API_ERROR' }
        }

        default:
          return { ok: false, summary: `Unknown action: ${action}`, error: 'UNKNOWN_ACTION' }
      }
    } catch (e: any) {
      return { ok: false, summary: `Teams error: ${e.message}`, error: 'EXCEPTION' }
    }
  },
}
