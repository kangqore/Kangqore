import { useQuery } from '@tanstack/react-query'
import { MapPin, Clock, DollarSign, Wifi, ChevronRight } from 'lucide-react'
import { Card, CardBody } from '@design-system/components/Card'
import { Badge } from '@design-system/components/Badge'
import { Button } from '@design-system/components/Button'
import { JOB_ROLES } from '@features/careers/data'
import { api } from '@lib/api'

const DEPT_COLOR: Record<string, string> = {
  engineering: 'bg-blue-50 text-blue-700', product: 'bg-purple-50 text-purple-700',
  sales: 'bg-green-50 text-green-700', delivery: 'bg-orange-50 text-orange-700',
  ops: 'bg-slate-900/40 backdrop-blur-2xl saturate-200 shadow-[inset_0_1px_0_rgba(255,255,255,0.15),0_8px_32px_rgba(0,0,0,0.3)] ring-1 ring-white/10 text-slate-500', design: 'bg-pink-50 text-pink-700',
}

const PERKS = [
  { icon: '🌍', label: 'Remote-friendly', desc: 'Work from anywhere — async-first culture' },
  { icon: '📈', label: 'Equity',           desc: 'Share options in a fast-growing company'  },
  { icon: '🎓', label: 'L&D budget',       desc: '£1,500/year learning & development fund'  },
  { icon: '🏥', label: 'Private health',   desc: 'Full medical + dental cover (UK)'         },
  { icon: '🧘', label: 'Wellness',         desc: 'Wellbeing stipend + mental health support' },
  { icon: '⚡', label: 'Fast-paced',       desc: 'Small team, high impact, no bureaucracy'  },
]

export function CareersHome() {
  const { data: liveJobs } = useQuery({
    queryKey: ['careers', 'jobs'],
    queryFn: () => api.get('/careers/jobs').then(r => r.data.jobs ?? []),
    staleTime: 1000 * 60 * 10,
  })

  const mockRoles = JOB_ROLES.filter(r => ['open', 'interview'].includes(r.status))

  // Map live jobs to the shape the template expects
  const openRoles = liveJobs?.length
    ? (liveJobs as Record<string, unknown>[]).map(j => ({
        id:           String(j.id),
        title:        String(j.title ?? ''),
        department:   String(j.department ?? 'engineering').toLowerCase(),
        type:         String(j.type ?? 'full-time'),
        location:     String(j.location ?? 'Remote'),
        description:  String(j.description ?? ''),
        status:       'open' as const,
        remote:       String(j.location ?? '').toLowerCase().includes('remote'),
        salaryMin:    0,
        salaryMax:    0,
        requirements: [] as string[],
      }))
    : mockRoles

  return (
    <div className="flex-1 overflow-y-auto px-6 lg:px-10 py-8 space-y-10">
      {/* Hero */}
      <div className="bg-gradient-to-r from-[#0f1117] to-[#1a1d2e] rounded-2xl p-8 text-white">
        <div className="max-w-xl">
          <p className="text-blue-400 text-sm font-semibold mb-2 tracking-wide uppercase">We're hiring</p>
          <h2 className="text-2xl font-bold tracking-tight leading-tight mb-3">
            Build the OS that runs companies.<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-os-blue to-os-cyan">
              Join Kangqore.
            </span>
          </h2>
          <p className="text-slate-500 text-sm leading-relaxed">
            We're a fast-growing product studio building Kangqore OS — an AI-powered platform for strategy, delivery, and intelligence.
            {openRoles.length} roles open now.
          </p>
        </div>
      </div>

      {/* Open roles */}
      <div>
        <h3 className="text-base font-bold text-white mb-4">Open Positions ({openRoles.length})</h3>
        <div className="space-y-3">
          {openRoles.map(role => (
            <Card key={role.id} className="hover:border-blue-200 hover:bg-blue-50/20 transition-all cursor-pointer">
              <CardBody className="p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <h4 className="font-semibold text-white">{role.title}</h4>
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${DEPT_COLOR[role.department]}`}>
                        {role.department}
                      </span>
                      {role.remote && (
                        <span className="flex items-center gap-1 text-xs text-blue-600 font-medium">
                          <Wifi className="w-3 h-3" /> Remote OK
                        </span>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-3 text-xs text-slate-500 mt-1">
                      <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{role.location}</span>
                      {role.salaryMin > 0 && (
                        <span className="flex items-center gap-1"><DollarSign className="w-3 h-3" />£{role.salaryMin}k–£{role.salaryMax}k</span>
                      )}
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{role.type}</span>
                    </div>
                    <p className="text-sm text-slate-500 mt-2 line-clamp-2">{role.description}</p>
                  </div>
                  <div className="flex-shrink-0 flex flex-col items-end gap-2">
                    <Badge variant="success" size="sm" dot>Open</Badge>
                    <Button size="sm" rightIcon={<ChevronRight className="w-3.5 h-3.5" />}>
                      Apply
                    </Button>
                  </div>
                </div>

                {/* Requirements preview */}
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {role.requirements.slice(0, 3).map((req, i) => (
                    <span key={i} className="text-xs bg-slate-900/40 backdrop-blur-2xl saturate-200 shadow-[inset_0_1px_0_rgba(255,255,255,0.15),0_8px_32px_rgba(0,0,0,0.3)] ring-1 ring-white/10 text-slate-500 px-2 py-0.5 rounded-full">{req}</span>
                  ))}
                  {role.requirements.length > 3 && (
                    <span className="text-xs text-slate-500">+{role.requirements.length - 3} more</span>
                  )}
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      </div>

      {/* Perks */}
      <div>
        <h3 className="text-base font-bold text-white mb-4">Why Kangqore?</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {PERKS.map(p => (
            <div key={p.label} className="bg-slate-900/40 backdrop-blur-2xl saturate-200 shadow-[inset_0_1px_0_rgba(255,255,255,0.15),0_8px_32px_rgba(0,0,0,0.3)] ring-1 ring-white/10 border border-white/10 border-t-white/20 rounded-xl p-4">
              <span className="text-2xl mb-2 block">{p.icon}</span>
              <p className="text-sm font-semibold text-white">{p.label}</p>
              <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{p.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
