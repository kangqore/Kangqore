import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { api } from '@lib/api'
import {
  Globe, Users, Building2, Package, TrendingUp, Star,
  Mail, BarChart3, Handshake, Award, ArrowUpRight, Cpu,
} from 'lucide-react'

const S: Record<string, React.CSSProperties> = {
  page:    { display: 'flex', flexDirection: 'column', gap: 24, padding: '4px 0' },
  grid3:   { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 },
  grid2:   { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 },
  card:    { background: 'var(--os-surface-1)', border: '1px solid var(--os-border)', borderRadius: 10, padding: 18, display: 'flex', flexDirection: 'column', gap: 12 },
  cardH:   { fontSize: 11, fontWeight: 700, letterSpacing: '.06em', color: 'var(--os-text-3)', textTransform: 'uppercase' as const },
  row:     { display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px', borderRadius: 7, background: 'var(--os-surface-2)', border: '1px solid var(--os-border-subtle)' },
  badge:   { display: 'inline-flex', alignItems: 'center', gap: 3, fontSize: 10, fontWeight: 600, padding: '2px 7px', borderRadius: 20 },
}

function relDate(d: string): string {
  if (!d) return '—'
  const diff = Math.floor((Date.now() - new Date(d).getTime()) / 86400000)
  if (diff === 0) return 'Today'
  if (diff === 1) return '1d ago'
  if (diff < 7) return `${diff}d ago`
  return new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
}

export const EcosystemWorkspacePage: React.FC = () => {
  const { data: partnerEmails } = useQuery({
    queryKey: ['ws-partner-emails'],
    queryFn: () => api.get('/admin/partner-emails?limit=15').then(r => r.data).catch(() => []),
  })
  const { data: deployments } = useQuery({
    queryKey: ['ws-ent-deployments'],
    queryFn: () => api.get('/admin/enterprise/deployments').then(r => r.data).catch(() => []),
  })
  const { data: marketplace } = useQuery({
    queryKey: ['ws-marketplace'],
    queryFn: () => api.get('/admin/marketplace').then(r => r.data).catch(() => null),
  })
  const { data: packs } = useQuery({
    queryKey: ['ws-packs'],
    queryFn: () => api.get('/admin/packs').then(r => r.data).catch(() => []),
  })
  const { data: partners } = useQuery({
    queryKey: ['ws-admin-partners'],
    queryFn: () => api.get('/admin/partners').then(r => r.data).catch(() => []),
  })

  const emailList = Array.isArray(partnerEmails) ? partnerEmails : (partnerEmails?.emails ?? partnerEmails?.data ?? [])
  const deployList = Array.isArray(deployments) ? deployments : (deployments?.deployments ?? deployments?.data ?? [])
  const packList   = Array.isArray(packs) ? packs : (packs?.packs ?? packs?.data ?? [])
  const partnerList = Array.isArray(partners) ? partners : (partners?.partners ?? partners?.data ?? [])

  const mktStats   = marketplace?.stats ?? marketplace ?? null

  return (
    <div style={S.page}>

      {/* ── Summary ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
        {[
          { icon: Handshake, label: 'Partners', val: partnerList.length.toString(), col: '#10b981' },
          { icon: Globe,     label: 'Deployments', val: deployList.length.toString(), col: '#579bfc' },
          { icon: Package,   label: 'Industry Packs', val: packList.length.toString(), col: '#a78bfa' },
          { icon: Mail,      label: 'Partner Comms', val: emailList.length.toString(), col: '#f59e0b' },
        ].map(m => (
          <div key={m.label} style={{ ...S.card, flexDirection: 'row', alignItems: 'center', gap: 14, padding: 14 }}>
            <div style={{ width: 38, height: 38, borderRadius: 9, background: m.col + '15', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <m.icon size={18} color={m.col} />
            </div>
            <div>
              <div style={{ fontSize: 20, fontWeight: 800, color: 'var(--os-text-1)', fontVariantNumeric: 'tabular-nums' }}>{m.val}</div>
              <div style={{ fontSize: 10, color: 'var(--os-text-3)' }}>{m.label}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={S.grid2}>
        {/* ── Partner Activity ── */}
        <div style={S.card}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Handshake size={13} color="#10b981" />
            <span style={S.cardH}>Partner Activity</span>
          </div>

          {/* Partner list */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
            {partnerList.slice(0, 5).length === 0 ? (
              <div style={{ color: 'var(--os-text-4)', fontSize: 12, textAlign: 'center', padding: 8 }}>No partners found</div>
            ) : partnerList.slice(0, 5).map((p: any, i: number) => (
              <div key={p.id ?? i} style={S.row}>
                <Building2 size={11} color="var(--os-text-3)" />
                <span style={{ flex: 1, fontSize: 11.5, color: 'var(--os-text-1)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {p.name ?? p.company ?? 'Partner'}
                </span>
                <span style={{ ...S.badge, background: '#10b98118', color: '#10b981' }}>
                  {p.tier ?? p.status ?? p.partnerType ?? 'ACTIVE'}
                </span>
              </div>
            ))}
          </div>

          {/* Recent partner comms */}
          <div>
            <div style={{ fontSize: 10, color: 'var(--os-text-4)', fontWeight: 600, marginBottom: 6 }}>RECENT COMMUNICATIONS</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
              {emailList.slice(0, 5).length === 0 ? (
                <div style={{ color: 'var(--os-text-4)', fontSize: 11, textAlign: 'center', padding: '8px 0' }}>No communications</div>
              ) : emailList.slice(0, 5).map((e: any, i: number) => (
                <div key={e.id ?? i} style={S.row}>
                  <Mail size={10} color="var(--os-text-4)" />
                  <span style={{ flex: 1, fontSize: 11, color: 'var(--os-text-1)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {e.subject ?? e.title ?? 'Email'}
                  </span>
                  <span style={{ fontSize: 9, color: 'var(--os-text-4)', flexShrink: 0 }}>
                    {relDate(e.receivedAt ?? e.createdAt ?? '')}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Marketplace Stats ── */}
        <div style={S.card}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <BarChart3 size={13} color="#a78bfa" />
            <span style={S.cardH}>Marketplace & SDK</span>
          </div>

          {mktStats ? (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              {Object.entries(mktStats).filter(([k]) => !['id','createdAt','updatedAt'].includes(k)).slice(0, 6).map(([k, v]: [string, any]) => (
                <div key={k} style={{ padding: '10px 8px', borderRadius: 8, background: 'var(--os-surface-2)', border: '1px solid var(--os-border-subtle)', textAlign: 'center' }}>
                  <div style={{ fontSize: 16, fontWeight: 800, color: '#a78bfa', fontVariantNumeric: 'tabular-nums' }}>
                    {typeof v === 'number' ? (v >= 1000 ? `${(v / 1000).toFixed(1)}K` : v.toString()) : String(v ?? '—')}
                  </div>
                  <div style={{ fontSize: 9, color: 'var(--os-text-4)', marginTop: 2 }}>
                    {k.replace(/([A-Z])/g, ' $1').trim()}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ color: 'var(--os-text-4)', fontSize: 12, textAlign: 'center', padding: '10px 0' }}>No marketplace data</div>
          )}

          {/* Industry Packs */}
          <div>
            <div style={{ fontSize: 10, color: 'var(--os-text-4)', fontWeight: 600, marginBottom: 6 }}>INDUSTRY PACKS</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {packList.slice(0, 8).length === 0 ? (
                <span style={{ fontSize: 11, color: 'var(--os-text-4)' }}>No packs deployed</span>
              ) : packList.slice(0, 8).map((pk: any, i: number) => (
                <span key={pk.id ?? i} style={{ ...S.badge, background: '#a78bfa18', color: '#a78bfa', padding: '4px 10px' }}>
                  <Package size={9} /> {pk.name ?? pk.title ?? `Pack ${i + 1}`}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Enterprise Deployments ── */}
      <div style={S.card}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <Globe size={13} color="#579bfc" />
          <span style={S.cardH}>Enterprise Deployments</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8 }}>
          {deployList.slice(0, 6).length === 0 ? (
            <div style={{ gridColumn: '1/-1', color: 'var(--os-text-4)', fontSize: 12, textAlign: 'center', padding: 12 }}>No enterprise deployments</div>
          ) : deployList.slice(0, 6).map((d: any, i: number) => (
            <div key={d.id ?? i} style={{ padding: '10px 12px', borderRadius: 8, background: 'var(--os-surface-2)', border: '1px solid var(--os-border-subtle)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <span style={{ fontSize: 11.5, fontWeight: 600, color: 'var(--os-text-1)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '70%' }}>
                  {d.clientName ?? d.name ?? d.tenant ?? `Deployment ${i + 1}`}
                </span>
                <span style={{ ...S.badge, background: d.status === 'ACTIVE' ? '#10b98118' : 'var(--os-surface-3)', color: d.status === 'ACTIVE' ? '#10b981' : 'var(--os-text-3)', flexShrink: 0 }}>
                  {d.status ?? 'ACTIVE'}
                </span>
              </div>
              {d.blueprintVersion && (
                <div style={{ fontSize: 9.5, color: 'var(--os-text-4)' }}>Blueprint v{d.blueprintVersion}</div>
              )}
              {d.oisScore != null && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 4 }}>
                  <div style={{ flex: 1, height: 3, borderRadius: 3, background: 'var(--os-surface-3)' }}>
                    <div style={{ height: '100%', borderRadius: 3, width: `${d.oisScore}%`, background: d.oisScore >= 75 ? 'var(--os-success)' : d.oisScore >= 55 ? 'var(--os-warning)' : 'var(--os-danger)' }} />
                  </div>
                  <span style={{ fontSize: 9, color: 'var(--os-text-4)', fontVariantNumeric: 'tabular-nums' }}>OIS {d.oisScore.toFixed(1)}</span>
                </div>
              )}
              <div style={{ fontSize: 9, color: 'var(--os-text-4)', marginTop: 3 }}>
                {relDate(d.deployedAt ?? d.createdAt ?? '')}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
