import Stripe from 'stripe'
import { prisma } from '../../lib/prisma'

const STRIPE_KEY = process.env.STRIPE_SECRET_KEY ?? ''

let _stripe: Stripe | null = null

export function getStripe(): Stripe | null {
  if (!STRIPE_KEY) return null
  if (!_stripe) _stripe = new Stripe(STRIPE_KEY, { apiVersion: '2026-06-24.dahlia' })
  return _stripe
}

export function stripeEnabled(): boolean {
  return !!STRIPE_KEY
}

// Sync ListingTier rows → Stripe products + recurring prices
export async function syncTiersToStripe(): Promise<{ synced: number; skipped: number }> {
  const stripe = getStripe()
  if (!stripe) return { synced: 0, skipped: 0 }

  const tiers = await (prisma as any).listingTier.findMany({ where: { isActive: true, monthlyPrice: { gt: 0 } } })
  let synced = 0

  for (const tier of tiers) {
    let productId = tier.stripeProductId
    let priceId   = tier.stripePriceId

    // Create or retrieve product
    if (!productId) {
      const product = await stripe.products.create({
        name:        `Kangqore ${tier.name} Tier`,
        description: tier.features.join(', '),
        metadata:    { tierId: tier.id, tierName: tier.name },
      })
      productId = product.id
    }

    // Create or retrieve price — always in cents
    if (!priceId) {
      const price = await stripe.prices.create({
        product:    productId,
        unit_amount: Math.round(tier.monthlyPrice * 100),
        currency:   'usd',
        recurring:  { interval: 'month' },
        metadata:   { tierId: tier.id },
      })
      priceId = price.id
    }

    await (prisma as any).listingTier.update({
      where: { id: tier.id },
      data:  { stripeProductId: productId, stripePriceId: priceId },
    })
    synced++
  }

  return { synced, skipped: tiers.filter((t: any) => t.monthlyPrice === 0).length }
}

// Create a Stripe Checkout Session for a paid listing purchase
export async function createCheckoutSession(opts: {
  listingId: string
  amount:    number        // in USD
  currency:  string
  partnerId: string
  successUrl: string
  cancelUrl:  string
}): Promise<{ sessionId: string; url: string; chargeId: string }> {
  const stripe = getStripe()
  if (!stripe) throw new Error('Stripe not configured')

  const listing = await (prisma as any).marketplaceListing.findUnique({ where: { id: opts.listingId } })
  if (!listing) throw new Error('Listing not found')

  const charge = await (prisma as any).marketplaceCharge.create({
    data: {
      listingId:  opts.listingId,
      partnerId:  opts.partnerId,
      amount:     opts.amount,
      platformFee: opts.amount * listing.platformFee,
      currency:   opts.currency,
      status:     'PENDING',
    },
  })

  const session = await stripe.checkout.sessions.create({
    mode:             'payment',
    payment_method_types: ['card'],
    line_items: [{
      price_data: {
        currency:     opts.currency.toLowerCase(),
        unit_amount:  Math.round(opts.amount * 100),
        product_data: { name: listing.name, description: listing.description?.slice(0, 255) },
      },
      quantity: 1,
    }],
    success_url: `${opts.successUrl}?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url:  opts.cancelUrl,
    metadata: {
      chargeId:  charge.id,
      listingId: opts.listingId,
      partnerId: opts.partnerId,
    },
  })

  await (prisma as any).marketplaceCharge.update({
    where: { id: charge.id },
    data:  { stripeSessionId: session.id },
  })

  return { sessionId: session.id, url: session.url!, chargeId: charge.id }
}

// Create or update a Stripe subscription for a tenant
export async function upsertSubscription(opts: {
  tenantId:     string
  stripePriceId: string
  tenantName:   string
  tenantEmail?: string
}): Promise<{ subscriptionId: string; status: string; currentPeriodEnd: Date }> {
  const stripe = getStripe()
  if (!stripe) throw new Error('Stripe not configured')

  const tenant = await (prisma as any).tenantOrganisation.findUnique({ where: { id: opts.tenantId } })
  if (!tenant) throw new Error('Tenant not found')

  let customerId = tenant.stripeCustomerId

  // Create Stripe customer if not exists
  if (!customerId) {
    const customer = await stripe.customers.create({
      name:     opts.tenantName,
      email:    opts.tenantEmail,
      metadata: { tenantId: opts.tenantId },
    })
    customerId = customer.id
    await (prisma as any).tenantOrganisation.update({
      where: { id: opts.tenantId },
      data:  { stripeCustomerId: customerId },
    })
  }

  // Cancel existing subscription if present
  if (tenant.stripeSubscriptionId) {
    await stripe.subscriptions.cancel(tenant.stripeSubscriptionId).catch(() => null)
  }

  // Create new subscription
  const sub = await stripe.subscriptions.create({
    customer:  customerId,
    items:     [{ price: opts.stripePriceId }],
    payment_behavior: 'default_incomplete',
    expand:    ['latest_invoice.payment_intent'],
  })

  const periodEnd = new Date((sub as any).current_period_end * 1000)
  const status    = mapStripeStatus(sub.status)

  await (prisma as any).tenantOrganisation.update({
    where: { id: opts.tenantId },
    data: {
      stripeSubscriptionId: sub.id,
      subscriptionStatus:   status,
      currentPeriodEnd:     periodEnd,
    },
  })

  return { subscriptionId: sub.id, status, currentPeriodEnd: periodEnd }
}

export function mapStripeStatus(status: string): string {
  if (status === 'active')   return 'active'
  if (status === 'trialing') return 'trial'
  if (status === 'past_due') return 'past_due'
  if (status === 'canceled' || status === 'unpaid') return 'churned'
  return status
}

// Aggregate revenue metrics from DB (not Stripe API — instant, no rate-limit risk)
export async function getRevenueMetrics() {
  const charges = await (prisma as any).marketplaceCharge.findMany({
    orderBy: { createdAt: 'desc' },
    take: 500,
  })
  const tenants = await (prisma as any).tenantOrganisation.findMany({ where: { isActive: true } })

  const captured  = charges.filter((c: any) => c.status === 'CAPTURED')
  const pending   = charges.filter((c: any) => c.status === 'PENDING')
  const refunded  = charges.filter((c: any) => c.status === 'REFUNDED')
  const totalRevenue    = captured.reduce((s: number, c: any) => s + c.amount - c.platformFee, 0)
  const platformRevenue = captured.reduce((s: number, c: any) => s + c.platformFee, 0)

  const activeSubscriptions = tenants.filter((t: any) => t.subscriptionStatus === 'active' || t.subscriptionStatus === 'trial')
  const tierCounts: Record<string, number> = {}
  tenants.forEach((t: any) => { tierCounts[t.planTier] = (tierCounts[t.planTier] ?? 0) + 1 })

  // MRR estimate from tier pricing
  const tiers = await (prisma as any).listingTier.findMany()
  const tierPrice: Record<string, number> = {}
  tiers.forEach((t: any) => { tierPrice[t.name] = t.monthlyPrice })
  const mrr = tenants
    .filter((t: any) => t.subscriptionStatus === 'active')
    .reduce((s: number, t: any) => s + (tierPrice[t.planTier] ?? 0), 0)

  return {
    totalRevenue,
    platformRevenue,
    totalCharges:  charges.length,
    capturedCount: captured.length,
    pendingCount:  pending.length,
    refundedCount: refunded.length,
    mrr,
    activeSubscriptions: activeSubscriptions.length,
    tierCounts,
    recentCharges: charges.slice(0, 10),
  }
}
