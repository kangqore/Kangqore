import { motion } from 'framer-motion'
import {
  Building2, Users, DollarSign, TrendingUp, TrendingDown, Minus,
} from 'lucide-react'
import { Badge }    from '@design-system/components/Badge'
import { Progress } from '@design-system/components/Progress'
import { StatCard } from '@design-system/components/StatCard'
import { Avatar }   from '@design-system/components/Avatar'
import { useDepartmentsStore } from '../store'
import { staggerContainer, staggerChild, spring } from '@os/motion'
import type { Department } from '../types'

// ── Lookup maps ───────────────────────────────────────────────────────────────

const STATUS_BADGE: Record<string, 'success' | 'info' | 'warning' | 'neutral'> = {
  active: 'success', scaling: 'info', restructuring: 'warning', new: 'neutral',
}

const BUDGET_TEXT: Record<string, string> = {
  'on-track': 'text-os-success',
  'over':     'text-os-danger',
  'under':    'text-os-blue',
  'at-risk':  'text-os-warning',
}

// ── Sub-components ────────────────────────────────────────────────────────────

function TrendIcon({ trend }: { trend: 'up' | 'down' | 'neutral' }) {
  if (trend === 'up')   return <TrendingUp   className="w-3 h-3 text-os-success" />
  if (trend === 'down') return <TrendingDown className="w-3 h-3 text-os-danger" />
  return                       <Minus        className="w-3 h-3 text-[var(--os-text-2)]" />
}

function DeptCard({ dept }: { dept: Department }) {
  const budgetPct   = Math.min(Math.round((dept.spent / Math.max(dept.budget * 0.5, 1)) * 100), 100)
  const healthColor = dept.deliveryHealth >= 80 ? '#059669' : dept.deliveryHealth >= 60 ? '#d97706' : '#ef4444'
  const growthPos   = dept.revenueGrowth.startsWith('+')

  return (
    <motion.div
      variants={staggerChild}
      whileHover={{ y: -3, transition: spring.smooth }}
      className="bg-[var(--os-card)] rounded-2xl border border-[var(--os-border)] overflow-hidden shadow-sm flex flex-col"
      style={{ borderTop: `2px solid ${dept.color}` }}
    >
      {/* Header */}
      <div className="px-5 pt-5 pb-4 flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div
            className="w-9 h-9 rounded-2xl flex items-center justify-center flex-shrink-0"
            style={{ background: `${dept.color}18` }}
          >
            <Building2 className="w-4 h-4" style={{ color: dept.color }} />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-bold text-[var(--os-text-1)] leading-tight truncate">{dept.name}</p>
            <p className="text-[10px] text-[var(--os-text-2)] font-mono mt-0.5">{dept.costCenter}</p>
          </div>
        </div>
        <Badge variant={STATUS_BADGE[dept.status]} size="sm" dot>
          {dept.status.charAt(0).toUpperCase() + dept.status.slice(1)}
        </Badge>
      </div>

      {/* Division head */}
      <div className="px-5 pb-4">
        <div
          className="flex items-center gap-3 p-3 rounded-2xl"
          style={{ background: `${dept.color}0c` }}
        >
          <Avatar name={dept.head} size="sm" />
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-[var(--os-text-1)] truncate">{dept.head}</p>
            <p className="text-[10px] text-[var(--os-text-2)] truncate">{dept.headTitle}</p>
          </div>
          <div className="flex gap-3 text-center flex-shrink-0">
            <div>
              <p className="text-sm font-bold text-[var(--os-text-1)]">{dept.headcount}</p>
              <p className="text-[10px] text-[var(--os-text-2)]">FTE</p>
            </div>
            {dept.openRoles > 0 && (
              <div>
                <p className="text-sm font-bold text-os-warning">{dept.openRoles}</p>
                <p className="text-[10px] text-[var(--os-text-2)]">Open</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Revenue stats */}
      <div className="grid grid-cols-3 gap-3 px-5 pb-4">
        <div>
          <p className="text-[10px] text-[var(--os-text-2)] uppercase tracking-wide mb-1">Revenue MTD</p>
          <p className="text-sm font-bold text-[var(--os-text-1)]">₹{dept.revenue}Cr</p>
          <p className="text-[10px] font-semibold" style={{ color: growthPos ? '#059669' : '#ef4444' }}>
            {dept.revenueGrowth}
          </p>
        </div>
        <div>
          <p className="text-[10px] text-[var(--os-text-2)] uppercase tracking-wide mb-1">Pipeline</p>
          <p className="text-sm font-bold text-[var(--os-text-1)]">₹{dept.pipeline}Cr</p>
          <p className="text-[10px] text-[var(--os-text-2)]">{dept.activeClients} clients</p>
        </div>
        <div>
          <p className="text-[10px] text-[var(--os-text-2)] uppercase tracking-wide mb-1">Projects</p>
          <p className="text-sm font-bold text-[var(--os-text-1)]">{dept.activeProjects}</p>
          <p className="text-[10px] text-[var(--os-text-2)]">active</p>
        </div>
      </div>

      {/* Delivery health */}
      <div className="px-5 pb-4">
        <div className="flex items-center justify-between mb-1.5">
          <p className="text-[10px] text-[var(--os-text-2)] uppercase tracking-wide">Delivery Health</p>
          <p className="text-[11px] font-bold" style={{ color: healthColor }}>
            {dept.deliveryHealth}%
          </p>
        </div>
        <div className="h-1.5 bg-[var(--os-surface-0)] border border-[var(--os-border)] rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{
              width: `${dept.deliveryHealth}%`,
              background: dept.color,
              boxShadow: `0 0 8px ${dept.color}50`,
            }}
          />
        </div>
      </div>

      {/* Budget utilisation */}
      <div className="px-5 pb-4">
        <div className="flex items-center justify-between mb-1.5">
          <p className="text-[10px] text-[var(--os-text-2)] uppercase tracking-wide">H1 Budget</p>
          <p className={`text-[11px] font-bold ${BUDGET_TEXT[dept.budgetStatus]}`}>
            ₹{dept.spent}k / ₹{Math.round(dept.budget * 0.5)}k
          </p>
        </div>
        <Progress
          value={budgetPct}
          color={dept.budgetStatus === 'over' || dept.budgetStatus === 'at-risk' ? 'danger' : 'brand'}
          size="sm"
        />
      </div>

      {/* KPIs */}
      <div className="px-5 pb-4 flex-1">
        <div className="grid grid-cols-2 gap-2">
          {dept.kpis.slice(0, 4).map(kpi => (
            <div key={kpi.metric} className="bg-[var(--os-surface-0)] border border-[var(--os-border)] rounded-2xl p-2.5">
              <TrendIcon trend={kpi.trend} />
              <p className="text-xs font-semibold text-[var(--os-text-1)] leading-tight mt-1">{kpi.value}</p>
              <p className="text-[10px] text-[var(--os-text-2)] leading-tight mt-0.5 truncate">{kpi.metric}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Services footer */}
      <div className="px-5 py-3 border-t border-[var(--os-border)] flex flex-wrap gap-1.5">
        {dept.services.slice(0, 3).map(s => (
          <span
            key={s}
            className="text-[10px] px-2 py-0.5 rounded-2xl font-medium"
            style={{ background: `${dept.color}12`, color: dept.color }}
          >
            {s}
          </span>
        ))}
        {dept.services.length > 3 && (
          <span className="text-[10px] px-2 py-0.5 rounded-2xl text-[var(--os-text-2)] bg-[var(--os-surface-0)] border border-[var(--os-border)] font-medium">
            +{dept.services.length - 3} more
          </span>
        )}
      </div>
    </motion.div>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────

export function DepartmentsOverview() {
  const { departments, totalHeadcount, totalBudget, totalSpent } = useDepartmentsStore()

  const openRoles    = departments.reduce((s, d) => s + d.openRoles, 0)
  const scalingCount = departments.filter(d => d.status === 'scaling').length
  const totalRevenue = departments.reduce((s, d) => s + d.revenue, 0)

  return (
    <div className="space-y-8">
      <div>
        <p className="text-[10px] uppercase tracking-widest font-semibold mb-1" style={{ color: 'var(--os-text-3)' }}>Organisation</p>
        <h1 className="text-[22px] font-black tracking-tight" style={{ color: 'var(--os-text-1)' }}>Departments</h1>
        <p className="text-sm mt-1" style={{ color: 'var(--os-text-2)' }}>Headcount, budgets, and org structure</p>
      </div>

      {/* KPI strip */}
      <motion.div
        className="grid grid-cols-2 lg:grid-cols-4 gap-4"
        variants={staggerContainer(0.05)}
        initial="hidden"
        animate="visible"
      >
        {[
          {
            label: 'Total Headcount',
            value: totalHeadcount(),
            icon: <Users className="w-5 h-5" />,
            iconColor: 'brand',
            changeLabel: `${openRoles} open roles`,
          },
          {
            label: 'Revenue MTD',
            value: `₹${totalRevenue.toFixed(1)}Cr`,
            icon: <TrendingUp className="w-5 h-5" />,
            iconColor: 'success',
            changeLabel: 'Across all divisions',
          },
          {
            label: 'Budget YTD',
            value: `₹${totalSpent()}k`,
            icon: <DollarSign className="w-5 h-5" />,
            iconColor: 'warning',
            changeLabel: `of ₹${Math.round(totalBudget() * 0.5)}k H1 plan`,
          },
          {
            label: 'Divisions',
            value: departments.length,
            icon: <Building2 className="w-5 h-5" />,
            iconColor: 'purple',
            changeLabel: `${scalingCount} scaling now`,
          },
        ].map(card => (
          <motion.div key={card.label} variants={staggerChild}>
            <StatCard
              label={card.label}
              value={card.value}
              icon={card.icon}
              iconColor={card.iconColor}
              changeLabel={card.changeLabel}
            />
          </motion.div>
        ))}
      </motion.div>

      {/* Department cards */}
      <motion.div
        className="grid grid-cols-1 lg:grid-cols-2 gap-5"
        variants={staggerContainer(0.07)}
        initial="hidden"
        animate="visible"
      >
        {departments.map(dept => (
          <DeptCard key={dept.id} dept={dept} />
        ))}
      </motion.div>

    </div>
  )
}
