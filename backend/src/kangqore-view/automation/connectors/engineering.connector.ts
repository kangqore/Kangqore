import axios from 'axios'
import logger from '../../../utils/logger'
import type { ActionConnector as Connector, ConnectorContext, ConnectorResult } from './connector.interface'

const SUPPORTED = new Set([
  'DEPLOY_SERVICE', 'ROLLBACK_DEPLOYMENT', 'RESTART_SERVICE',
  'CREATE_INCIDENT', 'SCALE_RESOURCE', 'ROTATE_SECRET',
])

// Engineering connector — routes deployment, incident, and infra actions.
// Env vars:
//   DEPLOY_WEBHOOK_URL   — generic POST endpoint your CI/CD listens on
//   INCIDENT_WEBHOOK_URL — PagerDuty Events API v2 / Opsgenie / custom
//   PAGERDUTY_ROUTING_KEY — if you use PagerDuty v2 events API

export const EngineeringConnector: Connector = {
  name: 'engineering',

  supports(actionName: string): boolean {
    return SUPPORTED.has(actionName)
  },

  async execute(ctx: ConnectorContext): Promise<ConnectorResult> {
    const { actionName, params } = ctx

    if (actionName === 'CREATE_INCIDENT') {
      const pd = process.env.PAGERDUTY_ROUTING_KEY
      if (pd) {
        const body = {
          routing_key: pd,
          event_action: 'trigger',
          payload: {
            summary: params.title ?? params.description ?? 'Incident triggered by Kangqore View',
            severity: (params.priority ?? 'high').toLowerCase(),
            source: 'kangqore-view',
            custom_details: params,
          },
        }
        const res = await axios.post('https://events.pagerduty.com/v2/enqueue', body, { timeout: 8_000, validateStatus: () => true })
        if (res.status >= 400) {
          return { connector: 'engineering', status: 'ERROR', message: `PagerDuty ${res.status}: ${res.data?.message}` }
        }
        return { connector: 'engineering', status: 'OK', message: 'PagerDuty incident triggered', data: { dedup_key: res.data?.dedup_key } }
      }

      const webhook = process.env.INCIDENT_WEBHOOK_URL
      if (!webhook) {
        logger.warn(`[INCIDENT:MOCK] ${params.title ?? 'unnamed'} — severity=${params.priority ?? 'high'}`)
        return { connector: 'engineering', status: 'SKIPPED', message: 'No incident webhook configured — incident logged locally' }
      }
      const res = await axios.post(webhook, { actionName, params }, { timeout: 8_000, validateStatus: () => true })
      return res.status < 400
        ? { connector: 'engineering', status: 'OK', message: 'Incident webhook delivered' }
        : { connector: 'engineering', status: 'ERROR', message: `Incident webhook ${res.status}` }
    }

    // DEPLOY_SERVICE, ROLLBACK_DEPLOYMENT, RESTART_SERVICE, SCALE_RESOURCE, ROTATE_SECRET
    const webhook = process.env.DEPLOY_WEBHOOK_URL
    if (!webhook) {
      logger.info(`[DEPLOY:MOCK] ${actionName} — service=${params.service_name ?? params.service ?? 'unknown'}`)
      return {
        connector: 'engineering',
        status: 'SKIPPED',
        message: `DEPLOY_WEBHOOK_URL not configured — ${actionName} logged locally`,
        data: { service: params.service_name ?? params.service },
      }
    }

    const res = await axios.post(webhook, { action: actionName, params, timestamp: new Date().toISOString() }, {
      timeout: 15_000,
      validateStatus: () => true,
    })

    return res.status < 400
      ? { connector: 'engineering', status: 'OK', message: `${actionName} dispatched`, data: { status: res.status } }
      : { connector: 'engineering', status: 'ERROR', message: `Deploy webhook ${res.status}` }
  },
}
