import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend,
} from 'recharts'
import { TrendingUp, Users, DollarSign, Activity } from 'lucide-react'
import { Card, CardHeader, CardTitle } from '@design-system/components/Card'
import { Badge } from '@design-system/components/Badge'
import { StatCard } from '@design-system/components/StatCard'
import { useInvestorStats } from '../useInvestorData'

// ─── mock data ────────────────────────────────────────────────────────────────

const ARR_DATA = [
  { month: 'Jan', arr: 880, mrr: 73 },
  { month: 'Feb', arr: 940, mrr: 78 },
  { month: 'Mar', arr: 1020, mrr: 85 },
  { month: 'Apr', arr: 1100, mrr: 92 },
  { month: 'May', arr: 1160, mrr: 97 },
  { month: 'Jun', arr: 1240, mrr: 103 },
]

const CLIENT_COHORTS = [
  { cohort: 'Pre-2025', retained: 85, churned: 15 },
  { cohort: 'Q1 2025',  retained: 78, churned: 22 },
  { cohort: 'Q2 2025',  retained: 91, churned: 9  },
  { cohort: 'Q3 2025',  retained: 88, churned: 12 },
  { cohort: 'Q4 2025',  retained: 94, churned: 6  },
  { cohort: 'Q1 2026',  retained: 100, churned: 0 },
]

const TOP_SEGMENTS = [
  { name: 'Digital Transformation', arr: 480000, clients: 12, growth: '+24%' },
  { name: 'PMO & Governance',        arr: 310000, clients: 8,  growth: '+18%' },
  { name: 'AI & Data Strategy',      arr: 240000, clients: 6,  growth: '+41%' },
  { name: 'Compliance & Risk',       arr: 130000, clients: 4,  growth: '+12%' },
  { name: 'Partner Delivery',        arr: 80000,  clients: 3,  growth: '+8%'  },
]

// ─── page ─────────────────────────────────────────────────────────────────────

export function InvestorReports() {
  const { data: statsData } = useInvestorStats()

  const stats = statsData ?? {
    revenue: '£1.24M', growthRate: '18.4%', activeClients: 33, pipelineValue: '£2.1M',
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h2 className="text-xl font-bold text-slate-900">Performance Reports</h2>
        <p className="text-sm text-slate-500 mt-0.5">ARR, cohort analysis and segment breakdown — as of June 2026</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="ARR"            value={String(stats.revenue).replace('$', '£')}           icon={<DollarSign className="w-5 h-5" />} iconColor="bg-violet-100 text-violet-600" />
        <StatCard label="Growth (QoQ)"   value={String(stats.growthRate)}                          icon={<TrendingUp  className="w-5 h-5" />} iconColor="bg-green-100 text-green-600"   />
        <StatCard label="Active Clients" value={Number(stats.activeClients)}                       icon={<Users       className="w-5 h-5" />} iconColor="bg-blue-100 text-blue-600"     />
        <StatCard label="Pipeline"       value={String(stats.pipelineValue).replace('$','£')}      icon={<Activity    className="w-5 h-5" />} iconColor="bg-amber-100 text-amber-600"   />
      </div>

      {/* ARR bridge */}
      <Card>
        <CardHeader><CardTitle>ARR & MRR trend (£k)</CardTitle></CardHeader>
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={ARR_DATA} margin={{ top: 10, right: 20, bottom: 0, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f3f7" />
            <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#9aaabf' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: '#9aaabf' }} axisLine={false} tickLine={false} tickFormatter={v => `£${v}k`} />
            <Tooltip formatter={(v: number, n: string) => [`£${v}k`, n.toUpperCase()]} contentStyle={{ borderRadius: 10, fontSize: 12, border: '1px solid #e4e8f0' }} />
            <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
            <Line type="monotone" dataKey="arr" stroke="#7c3aed" strokeWidth={2.5} dot={{ r: 4, fill: '#7c3aed' }} name="ARR" />
            <Line type="monotone" dataKey="mrr" stroke="#a78bfa" strokeWidth={2} dot={{ r: 3, fill: '#a78bfa' }} name="MRR" strokeDasharray="4 2" />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      {/* Client cohort retention */}
      <Card>
        <CardHeader><CardTitle>Client cohort retention (%)</CardTitle></CardHeader>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={CLIENT_COHORTS} barSize={28}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f3f7" />
            <XAxis dataKey="cohort" tick={{ fontSize: 10, fill: '#9aaabf' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: '#9aaabf' }} axisLine={false} tickLine={false} domain={[0, 100]} tickFormatter={v => `${v}%`} />
            <Tooltip formatter={(v: number) => [`${v}%`]} contentStyle={{ borderRadius: 10, fontSize: 12, border: '1px solid #e4e8f0' }} />
            <Bar dataKey="retained" fill="#7c3aed" radius={[6, 6, 0, 0]} name="Retained" />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      {/* Revenue by segment */}
      <Card>
        <CardHeader><CardTitle>Revenue by segment</CardTitle></CardHeader>
        <div className="space-y-3 mt-2">
          {TOP_SEGMENTS.map((seg, i) => {
            const pct = Math.round((seg.arr / TOP_SEGMENTS[0].arr) * 100)
            return (
              <div key={seg.name} className="flex items-center gap-4">
                <div className="w-5 text-xs font-bold text-slate-400">{i + 1}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium text-slate-700">{seg.name}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-500">{seg.clients} clients</span>
                      <Badge variant="success" size="sm">{seg.growth}</Badge>
                      <span className="text-xs font-bold text-slate-800 w-20 text-right">
                        £{(seg.arr / 1000).toFixed(0)}k
                      </span>
                    </div>
                  </div>
                  <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full bg-violet-500 transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </Card>
    </div>
  )
}
