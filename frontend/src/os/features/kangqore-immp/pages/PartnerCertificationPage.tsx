import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Award, Shield, TrendingUp, Plus, CheckCircle2, Star } from 'lucide-react'
import { api } from '@lib/api'
import { KIMMPSignalBar } from '@components/KIMMPSignalBar'

const T1   = 'var(--os-text-1)'
const T2   = 'var(--os-text-2)'
const BDR  = 'var(--os-border)'
const CARD = 'var(--os-card)'
const GRN  = '#10b981'
const BLUE = '#579bfc'
const AMB  = '#f59e0b'
const PURP = '#7c3aed'
const TEAL = '#0d9488'

const CERT_COLOR: Record<string, string>  = { CERTIFIED_IMPLEMENTER: TEAL, CERTIFIED_INTEGRATOR: BLUE, CERTIFIED_RESELLER: PURP }
const CERT_BOOST: Record<string, string>  = { CERTIFIED_IMPLEMENTER: '+2%', CERTIFIED_INTEGRATOR: '+5%', CERTIFIED_RESELLER: '+8%' }
const CERT_LABEL: Record<string, string>  = { CERTIFIED_IMPLEMENTER: 'Implementer', CERTIFIED_INTEGRATOR: 'Integrator', CERTIFIED_RESELLER: 'Reseller' }

interface Partner { id: string; name: string; tier: string; slug: string }
interface Cert    { id: string; partnerId: string; certType: string; status: string; score?: number; issuedAt: string; expiresAt?: string; partner: Partner }
interface LBEntry { id: string; name: string; tier: string; totalRevenue: number; commissionRate: number; topCert?: string; certCount: number }

export function PartnerCertificationPage() {
  const qc = useQueryClient()
  const [showForm, setShowForm] = useState(false)
  const [form, setForm]         = useState({ partnerId: '', certType: 'CERTIFIED_IMPLEMENTER', score: '85', notes: '' })
  const [tab, setTab]           = useState<'certs' | 'leaderboard'>('certs')

  const { data: certsData }  = useQuery({ queryKey: ['partner-certs'],       queryFn: () => api.get('/admin/kangqore-immp/partners/certifications').then(r => r.data) })
  const { data: lbData }     = useQuery({ queryKey: ['partner-leaderboard'], queryFn: () => api.get('/admin/kangqore-immp/partners/leaderboard').then(r => r.data) })
  const { data: partnersData } = useQuery({ queryKey: ['partners-list'],     queryFn: () => api.get('/admin/kangqore-immp/partners').then(r => r.data) })

  const certifyMut = useMutation({
    mutationFn: (body: any) => api.post(`/admin/kangqore-immp/partners/${body.partnerId}/certify`, body),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['partner-certs'] }); qc.invalidateQueries({ queryKey: ['partner-leaderboard'] }); setShowForm(false) },
  })

  const certs:   Cert[]   = certsData?.certifications ?? []
  const lb:      LBEntry[] = lbData?.leaderboard ?? []
  const partners           = partnersData?.partners ?? []
  const activeCerts        = certs.filter(c => c.status === 'ACTIVE').length

  return (
    <div className="space-y-6">
      <KIMMPSignalBar module="Partner Certification" />

      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black tracking-tight" style={{ color: T1 }}>Partner Certification Program</h2>
          <p className="text-[10px] uppercase tracking-widest font-semibold mt-0.5" style={{ color: T2 }}>
            Implementer · Integrator · Reseller · Commission tier boost · Leaderboard
          </p>
        </div>
        <button onClick={() => setShowForm(true)}
          className="flex items-center gap-1.5 text-sm font-semibold px-3 py-2 rounded-2xl"
          style={{ background: PURP, color: '#fff' }}>
          <Plus className="w-3.5 h-3.5" /> Issue Certificate
        </button>
      </div>

      {/* Cert tier cards */}
      <div className="grid grid-cols-3 gap-3">
        {Object.entries(CERT_COLOR).map(([certType, color]) => (
          <div key={certType} className="rounded-2xl p-4 space-y-2"
            style={{ background: `${color}0c`, border: `1.5px solid ${color}30` }}>
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5" style={{ color }} />
              <p className="text-sm font-black" style={{ color }}>{CERT_LABEL[certType]}</p>
            </div>
            <p className="text-[10px] leading-relaxed" style={{ color: T2 }}>
              {certType === 'CERTIFIED_IMPLEMENTER' ? 'Deploy Kangqore for customers. Baseline certification for all partners.'
               : certType === 'CERTIFIED_INTEGRATOR' ? 'Build integrations and custom workflows on the Kangqore platform.'
               : 'Resell Kangqore to enterprise customers. Highest commercial tier.'}
            </p>
            <div className="flex items-center justify-between pt-1">
              <span className="text-xs font-black" style={{ color }}>
                {certs.filter(c => c.certType === certType && c.status === 'ACTIVE').length} active
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                style={{ background: `${color}18`, color }}>
                {CERT_BOOST[certType]} commission
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { l: 'Active Certs', v: activeCerts, color: GRN },
          { l: 'Partners Certified', v: new Set(certs.filter(c=>c.status==='ACTIVE').map(c=>c.partnerId)).size, color: BLUE },
          { l: 'Avg Commission Boost', v: activeCerts > 0 ? '+4%' : '—', color: AMB },
          { l: 'Leaderboard Entries', v: lb.length, color: PURP },
        ].map(s => (
          <div key={s.l} className="rounded-2xl p-4 text-center" style={{ background: CARD, border: `1px solid ${BDR}` }}>
            <p className="text-2xl font-black" style={{ color: s.color }}>{s.v}</p>
            <p className="text-[10px] uppercase tracking-wider mt-0.5" style={{ color: T2 }}>{s.l}</p>
          </div>
        ))}
      </div>

      {/* Tab toggle */}
      <div className="flex gap-1 p-1 rounded-2xl" style={{ background: CARD, border: `1px solid ${BDR}` }}>
        {(['certs', 'leaderboard'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)}
            className="flex-1 text-xs font-semibold py-2 rounded-2xl transition-colors"
            style={{ background: tab === t ? PURP : 'transparent', color: tab === t ? '#fff' : T2 }}>
            {t === 'certs' ? 'Certifications' : 'Partner Leaderboard'}
          </button>
        ))}
      </div>

      {tab === 'certs' && (
        <div className="rounded-2xl overflow-hidden" style={{ border: `1px solid ${BDR}` }}>
          <div style={{ background: CARD }}>
            {certs.length === 0 && (
              <p className="text-sm text-center py-8" style={{ color: T2 }}>No certifications issued yet.</p>
            )}
            {certs.map((c, i) => {
              const color = CERT_COLOR[c.certType] ?? BLUE
              return (
                <div key={c.id} className="flex items-center gap-3 px-5 py-4"
                  style={{ borderBottom: i < certs.length - 1 ? `1px solid ${BDR}` : undefined }}>
                  <div className="w-9 h-9 rounded-2xl flex items-center justify-center flex-shrink-0"
                    style={{ background: `${color}18` }}>
                    <Award className="w-4 h-4" style={{ color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate" style={{ color: T1 }}>{c.partner?.name ?? c.partnerId}</p>
                    <p className="text-[10px] mt-0.5" style={{ color: T2 }}>
                      {CERT_LABEL[c.certType]} · Issued {new Date(c.issuedAt).toLocaleDateString('en-GB')}
                      {c.expiresAt && ` · Expires ${new Date(c.expiresAt).toLocaleDateString('en-GB')}`}
                    </p>
                  </div>
                  {c.score != null && (
                    <span className="text-xs font-black" style={{ color: c.score >= 85 ? GRN : AMB }}>{c.score}%</span>
                  )}
                  <span className="text-[9px] font-bold px-2 py-0.5 rounded-full"
                    style={{ background: `${color}18`, color }}>{CERT_LABEL[c.certType]}</span>
                  {c.status === 'ACTIVE' && <CheckCircle2 className="w-4 h-4 flex-shrink-0" style={{ color: GRN }} />}
                </div>
              )
            })}
          </div>
        </div>
      )}

      {tab === 'leaderboard' && (
        <div className="rounded-2xl overflow-hidden" style={{ border: `1px solid ${BDR}` }}>
          <div className="px-5 py-3 flex items-center gap-2" style={{ background: CARD, borderBottom: `1px solid ${BDR}` }}>
            <TrendingUp className="w-4 h-4" style={{ color: T2 }} />
            <p className="text-sm font-semibold" style={{ color: T1 }}>Partners ranked by total revenue</p>
          </div>
          <div style={{ background: CARD }}>
            {lb.length === 0 && <p className="text-sm text-center py-8" style={{ color: T2 }}>No partner revenue data yet.</p>}
            {lb.map((p, i) => (
              <div key={p.id} className="flex items-center gap-3 px-5 py-4"
                style={{ borderBottom: i < lb.length - 1 ? `1px solid ${BDR}` : undefined }}>
                <span className="text-lg font-black w-7 text-center" style={{ color: i < 3 ? AMB : T2 }}>#{i + 1}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate" style={{ color: T1 }}>{p.name}</p>
                  <p className="text-[10px] mt-0.5" style={{ color: T2 }}>
                    {p.tier} · {(p.commissionRate * 100).toFixed(0)}% commission · {p.certCount} certs
                  </p>
                </div>
                {p.topCert && (
                  <span className="text-[9px] font-bold px-2 py-0.5 rounded-full"
                    style={{ background: `${CERT_COLOR[p.topCert] ?? BLUE}18`, color: CERT_COLOR[p.topCert] ?? BLUE }}>
                    {CERT_LABEL[p.topCert]}
                  </span>
                )}
                <span className="text-sm font-black font-variant-numeric" style={{ color: GRN }}>
                  £{p.totalRevenue.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Issue cert modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.5)' }}>
          <div className="rounded-2xl p-6 w-full max-w-md space-y-4" style={{ background: CARD, border: `1px solid ${BDR}` }}>
            <h3 className="font-black text-lg" style={{ color: T1 }}>Issue Certification</h3>
            <div>
              <label className="text-xs font-semibold mb-1 block" style={{ color: T2 }}>Partner</label>
              <select value={form.partnerId} onChange={e => setForm(p => ({ ...p, partnerId: e.target.value }))}
                className="w-full text-sm px-3 py-2 rounded-2xl"
                style={{ background: 'var(--os-surface)', border: `1px solid ${BDR}`, color: T1 }}>
                <option value="">Select partner…</option>
                {partners.map((p: any) => <option key={p.id} value={p.id}>{p.name} ({p.tier})</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold mb-1 block" style={{ color: T2 }}>Certification Type</label>
              <select value={form.certType} onChange={e => setForm(p => ({ ...p, certType: e.target.value }))}
                className="w-full text-sm px-3 py-2 rounded-2xl"
                style={{ background: 'var(--os-surface)', border: `1px solid ${BDR}`, color: T1 }}>
                <option value="CERTIFIED_IMPLEMENTER">Certified Implementer (+2% commission)</option>
                <option value="CERTIFIED_INTEGRATOR">Certified Integrator (+5% commission)</option>
                <option value="CERTIFIED_RESELLER">Certified Reseller (+8% commission)</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold mb-1 block" style={{ color: T2 }}>Assessment Score (%)</label>
              <input type="number" min="0" max="100"
                className="w-full text-sm px-3 py-2 rounded-2xl"
                style={{ background: 'var(--os-surface)', border: `1px solid ${BDR}`, color: T1 }}
                value={form.score} onChange={e => setForm(p => ({ ...p, score: e.target.value }))} />
            </div>
            <div className="rounded-2xl p-3" style={{ background: `${PURP}12`, border: `1px solid ${PURP}30` }}>
              <p className="text-xs" style={{ color: T2 }}>
                <Star className="w-3 h-3 inline mr-1" style={{ color: PURP }} />
                Certification valid for 12 months. Commission rate will be boosted automatically on issue.
              </p>
            </div>
            <div className="flex gap-2 pt-1">
              <button onClick={() => setShowForm(false)} className="flex-1 text-sm py-2 rounded-2xl" style={{ background: `${BDR}50`, color: T2 }}>Cancel</button>
              <button
                onClick={() => certifyMut.mutate({ partnerId: form.partnerId, certType: form.certType, score: parseFloat(form.score) })}
                disabled={certifyMut.isPending || !form.partnerId}
                className="flex-1 text-sm font-semibold py-2 rounded-2xl" style={{ background: PURP, color: '#fff', opacity: !form.partnerId ? 0.5 : 1 }}>
                {certifyMut.isPending ? 'Issuing…' : 'Issue Certificate'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
