import axios from 'axios'
import logger from '../../../utils/logger'
import type { ActionConnector as Connector, ConnectorContext, ConnectorResult } from './connector.interface'

const SUPPORTED = new Set(['SEND_EMAIL'])

// Email via SendGrid REST API — set SENDGRID_API_KEY + SENDGRID_FROM_EMAIL in .env.
// Falls back to SMTP logging (no actual send) when creds are absent.

export const EmailConnector: Connector = {
  name: 'email',

  supports(actionName: string): boolean {
    return SUPPORTED.has(actionName)
  },

  async execute(ctx: ConnectorContext): Promise<ConnectorResult> {
    const { params } = ctx
    const apiKey = process.env.SENDGRID_API_KEY
    const from = process.env.SENDGRID_FROM_EMAIL ?? 'noreply@kangqore.com'

    const to = params.to ?? params.recipient_email ?? params.email
    const subject = params.subject ?? '(no subject)'
    const body = params.body ?? params.message ?? params.content ?? ''

    if (!to) {
      return { connector: 'email', status: 'ERROR', message: 'params.to is required for SEND_EMAIL' }
    }

    if (!apiKey) {
      logger.info(`[EMAIL:MOCK] To=${to} | Subject=${subject}\n${body}`)
      return { connector: 'email', status: 'SKIPPED', message: 'SENDGRID_API_KEY not configured — email logged locally', data: { to, subject } }
    }

    const payload = {
      personalizations: [{ to: [{ email: to }] }],
      from: { email: from, name: params.from_name ?? 'Kangqore View' },
      subject,
      content: [{ type: 'text/plain', value: body }],
    }

    const res = await axios.post('https://api.sendgrid.com/v3/mail/send', payload, {
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      timeout: 10_000,
      validateStatus: () => true,
    })

    if (res.status >= 400) {
      const detail = res.data?.errors?.[0]?.message ?? 'SendGrid error'
      return { connector: 'email', status: 'ERROR', message: `SendGrid ${res.status}: ${detail}` }
    }

    return { connector: 'email', status: 'OK', message: `Email sent to ${to}`, data: { to, subject } }
  },
}
