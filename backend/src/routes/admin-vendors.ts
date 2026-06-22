import { Router, Response, NextFunction } from 'express'
import { prisma } from '../lib/prisma'
import { authenticate, authorize, AuthenticatedRequest } from '../middleware/auth'

const router = Router()

const CATEGORY_COLORS: Record<string, string> = {
  Cloud:    '#3b82f6',
  SaaS:     '#10b981',
  Staffing: '#f59e0b',
}

// GET /api/admin/vendors
router.get('/', authenticate, authorize(['ADMIN']), async (_req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const vendors = await prisma.vendor.findMany({
      where: { status: 'ACTIVE' },
      include: { contracts: true },
      orderBy: { name: 'asc' },
    })

    const formatted = vendors.map(v => {
      const activeContracts = v.contracts.filter(c => c.status === 'ACTIVE')
      const monthlySpend = activeContracts.reduce((sum, c) => sum + Number(c.value) / 12, 0)
      const nextRenewal = v.contracts
        .filter(c => c.renewalDate && c.renewalDate > new Date())
        .sort((a, b) => a.renewalDate!.getTime() - b.renewalDate!.getTime())[0]?.renewalDate

      return {
        id:           v.id,
        name:         v.name,
        category:     v.category,
        tier:         v.tier,
        risk:         v.risk,
        spend:        monthlySpend,
        spendDisplay: `$${Math.round(monthlySpend / 1000)}k/mo`,
        renewal:      nextRenewal ? nextRenewal.toISOString().split('T')[0] : 'N/A',
      }
    })

    res.json(formatted)
  } catch (err) { next(err) }
})

// GET /api/admin/vendors/stats
router.get('/stats', authenticate, authorize(['ADMIN']), async (_req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const vendors = await prisma.vendor.findMany({
      where: { status: 'ACTIVE' },
      include: { contracts: true },
    })

    const totalAnnualSpend = vendors.reduce((sum, v) =>
      sum + v.contracts
        .filter(c => c.status === 'ACTIVE')
        .reduce((s, c) => s + Number(c.value), 0), 0)

    const highRiskCount = vendors.filter(v => v.risk === 'HIGH').length

    const ninetyDaysFromNow = new Date()
    ninetyDaysFromNow.setDate(ninetyDaysFromNow.getDate() + 90)

    const renewalsDue = vendors.filter(v =>
      v.contracts.some(c => {
        if (!c.renewalDate) return false
        return c.renewalDate > new Date() && c.renewalDate <= ninetyDaysFromNow
      })
    ).length

    const spendByCategory = vendors.reduce<Record<string, number>>((acc, v) => {
      const annual = v.contracts.reduce((s, c) => s + Number(c.value), 0)
      acc[v.category] = (acc[v.category] ?? 0) + annual
      return acc
    }, {})

    const chartData = Object.entries(spendByCategory).map(([name, rawVal]) => ({
      name,
      value:  Math.round(rawVal / 100_000),
      rawVal,
      color:  CATEGORY_COLORS[name] ?? '#6366f1',
    }))

    res.json({
      stats: [
        { label: 'Annual Spend',   value: `$${(totalAnnualSpend / 1_000_000).toFixed(1)}M`, icon: 'DollarSign',   bg: 'bg-blue-50',    color: 'text-blue-600'    },
        { label: 'Active Vendors', value: vendors.length.toString(),                          icon: 'Handshake',    bg: 'bg-emerald-50', color: 'text-emerald-600' },
        { label: 'High Risk',      value: highRiskCount.toString(),                           icon: 'AlertTriangle',bg: 'bg-red-50',     color: 'text-red-600'     },
        { label: 'Renewals Due',   value: renewalsDue.toString(), sub: 'Next 90 days',        icon: 'Calendar',     bg: 'bg-amber-50',   color: 'text-amber-600'   },
      ],
      chartData,
    })
  } catch (err) { next(err) }
})

export default router
