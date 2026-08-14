import axios from 'axios'
import logger from '../../utils/logger'
import type { Connector, ConnectorContext, ConnectorResult } from './connector.interface'

const SUPPORTED = new Set(['SEND_SLACK_MESSAGE', 'SEND_RELAY_MESSAGE'])

// Slack incoming webhook — set SLACK_WEBHOOK_URL in .env to enable live delivery.
// Teams incoming webhook — set TEAMS_WEBHOOK_URL in .env.
// SEND_RELAY_MESSAGE is internal-only; always logged, never needs creds.

export const SlackConnector: Connector = {
  name: 'slack',

  supports(actionName: string): boolean {
    return SUPPORTED.has(actionName) || actionName === 'SEND_TEAMS_MESSAGE'
  },

  async execute(ctx: ConnectorContext): Promise<ConnectorResult> {
    const { actionName, params } = ctx

    if (actionName === 'SEND_RELAY_MESSAGE') {
      logger.info(`[RELAY] ${params.sender ?? 'system'} → ${params.recipient}: ${params.message}`)
      return { connector: 'slack', status: 'OK', message: 'Relay message logged internally', data: { channel: 'relay' } }
    }

    if (actionName === 'SEND_TEAMS_MESSAGE') {
      const webhookUrl = process.env.TEAMS_WEBHOOK_URL
      if (!webhookUrl) {
        return { connector: 'slack', status: 'SKIPPED', message: 'TEAMS_WEBHOOK_URL not configured' }
      }
      const body = {
        '@type': 'MessageCard',
        '@context': 'http://schema.org/extensions',
        themeColor: '0078D4',
        summary: params.subject ?? 'Kangqore View notification',
        sections: [{ activityTitle: params.subject ?? 'Message', activityText: params.body }],
      }
      const res = await axios.post(webhookUrl, body, { timeout: 8_000, validateStatus: () => true })
      if (res.status >= 400) {
        return { connector: 'slack', status: 'ERROR', message: `Teams webhook responded ${res.status}` }
      }
      return { connector: 'slack', status: 'OK', message: 'Teams message sent', data: { status: res.status } }
    }

    // SEND_SLACK_MESSAGE
    const webhookUrl = process.env.SLACK_WEBHOOK_URL
    if (!webhookUrl) {
      return { connector: 'slack', status: 'SKIPPED', message: 'SLACK_WEBHOOK_URL not configured' }
    }

    const text = params.message ?? params.body ?? '(no message)'
    const channel = params.channel ? `#${params.channel.replace(/^#/, '')}` : undefined
    const body: Record<string, any> = { text }
    if (channel) body.channel = channel
    if (params.subject) body.attachments = [{ title: params.subject, text }]

    const res = await axios.post(webhookUrl, body, { timeout: 8_000, validateStatus: () => true })
    if (res.status >= 400) {
      return { connector: 'slack', status: 'ERROR', message: `Slack webhook responded ${res.status}` }
    }
    return { connector: 'slack', status: 'OK', message: 'Slack message sent', data: { channel: channel ?? 'default' } }
  },
}
