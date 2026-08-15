import axios from 'axios'
import logger from '../../utils/logger'
import type { Connector, ConnectorContext, ConnectorResult } from './connector.interface'

const SUPPORTED = new Set([
  'CREATE_STRIPE_CUSTOMER', 'UPDATE_STRIPE_CUSTOMER',
  'CREATE_STRIPE_SUBSCRIPTION', 'UPDATE_STRIPE_SUBSCRIPTION', 'CANCEL_STRIPE_SUBSCRIPTION', 'PAUSE_STRIPE_SUBSCRIPTION',
  'CREATE_STRIPE_INVOICE', 'FINALIZE_STRIPE_INVOICE', 'VOID_STRIPE_INVOICE', 'SEND_STRIPE_INVOICE',
  'CREATE_STRIPE_REFUND', 'CREATE_STRIPE_COUPON', 'CREATE_STRIPE_PRICE', 'APPLY_STRIPE_COUPON', 'GENERATE_STRIPE_REPORT',
])

// Requires: STRIPE_SECRET_KEY
export const StripeConnector: Connector = {
  name: 'stripe',

  supports(actionName: string): boolean {
    return SUPPORTED.has(actionName)
  },

  async execute(ctx: ConnectorContext): Promise<ConnectorResult> {
    const { actionName, params } = ctx
    const key = process.env.STRIPE_SECRET_KEY

    if (!key) {
      logger.warn(`[STRIPE:MOCK] ${actionName} — STRIPE_SECRET_KEY not configured`)
      return { connector: 'stripe', status: 'SKIPPED', message: 'STRIPE_SECRET_KEY not configured' }
    }

    const headers = { Authorization: `Bearer ${key}`, 'Content-Type': 'application/x-www-form-urlencoded' }
    const api     = 'https://api.stripe.com/v1'

    const form = (data: Record<string, any>): string =>
      Object.entries(data).filter(([, v]) => v !== undefined && v !== null).map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`).join('&')

    try {
      if (actionName === 'CREATE_STRIPE_CUSTOMER') {
        const res = await axios.post(`${api}/customers`, form({ email: params.email, name: params.name, phone: params.phone, description: params.description }), { headers, timeout: 10_000 })
        return { connector: 'stripe', status: 'OK', message: `Stripe customer created: ${res.data.id}`, data: { id: res.data.id } }
      }

      if (actionName === 'UPDATE_STRIPE_CUSTOMER') {
        const res = await axios.post(`${api}/customers/${params.customerId}`, form({ email: params.email, name: params.name, phone: params.phone, description: params.description }), { headers, timeout: 10_000 })
        return { connector: 'stripe', status: 'OK', message: `Stripe customer updated: ${res.data.id}`, data: { id: res.data.id } }
      }

      if (actionName === 'CREATE_STRIPE_SUBSCRIPTION') {
        const body: any = { customer: params.customerId, 'items[0][price]': params.priceId }
        if (params.quantity)   body['items[0][quantity]'] = params.quantity
        if (params.trialDays)  body.trial_period_days = params.trialDays
        if (params.coupon)     body.coupon = params.coupon
        const res = await axios.post(`${api}/subscriptions`, form(body), { headers, timeout: 10_000 })
        return { connector: 'stripe', status: 'OK', message: `Subscription created: ${res.data.id}`, data: { id: res.data.id, status: res.data.status } }
      }

      if (actionName === 'CANCEL_STRIPE_SUBSCRIPTION') {
        const endpoint = params.atPeriodEnd === false
          ? `${api}/subscriptions/${params.subscriptionId}`
          : `${api}/subscriptions/${params.subscriptionId}`
        const body = params.atPeriodEnd === false ? {} : { cancel_at_period_end: true }
        const res = params.atPeriodEnd === false
          ? await axios.delete(endpoint, { headers, timeout: 10_000 })
          : await axios.post(endpoint, form(body), { headers, timeout: 10_000 })
        return { connector: 'stripe', status: 'OK', message: `Subscription ${params.subscriptionId} cancelled` }
      }

      if (actionName === 'CREATE_STRIPE_INVOICE') {
        const res = await axios.post(`${api}/invoices`, form({ customer: params.customerId, description: params.description, days_until_due: params.daysUntilDue, auto_advance: params.autoAdvance }), { headers, timeout: 10_000 })
        return { connector: 'stripe', status: 'OK', message: `Invoice created: ${res.data.id}`, data: { id: res.data.id } }
      }

      if (actionName === 'FINALIZE_STRIPE_INVOICE') {
        const res = await axios.post(`${api}/invoices/${params.invoiceId}/finalize`, form({ auto_advance: params.autoAdvance }), { headers, timeout: 10_000 })
        return { connector: 'stripe', status: 'OK', message: `Invoice ${res.data.id} finalized` }
      }

      if (actionName === 'SEND_STRIPE_INVOICE') {
        await axios.post(`${api}/invoices/${params.invoiceId}/send`, '', { headers, timeout: 10_000 })
        return { connector: 'stripe', status: 'OK', message: `Invoice ${params.invoiceId} sent to customer` }
      }

      if (actionName === 'CREATE_STRIPE_REFUND') {
        const res = await axios.post(`${api}/refunds`, form({ payment_intent: params.paymentIntentId, amount: params.amount, reason: params.reason }), { headers, timeout: 10_000 })
        return { connector: 'stripe', status: 'OK', message: `Refund created: ${res.data.id}`, data: { id: res.data.id, status: res.data.status } }
      }

      if (actionName === 'CREATE_STRIPE_COUPON') {
        const body: any = { name: params.name, duration: params.duration }
        if (params.percentOff)     body.percent_off = params.percentOff
        if (params.amountOff)      { body.amount_off = params.amountOff; body.currency = (params.currency ?? 'GBP').toLowerCase() }
        if (params.durationMonths) body.duration_in_months = params.durationMonths
        if (params.maxRedemptions) body.max_redemptions = params.maxRedemptions
        const res = await axios.post(`${api}/coupons`, form(body), { headers, timeout: 10_000 })
        return { connector: 'stripe', status: 'OK', message: `Coupon created: ${res.data.id}`, data: { id: res.data.id } }
      }

      logger.warn(`[STRIPE] No explicit handler for ${actionName}`)
      return { connector: 'stripe', status: 'SKIPPED', message: `No real handler for ${actionName}` }
    } catch (e: any) {
      const msg = e.response?.data?.error?.message ?? e.message
      return { connector: 'stripe', status: 'ERROR', message: msg }
    }
  },
}
