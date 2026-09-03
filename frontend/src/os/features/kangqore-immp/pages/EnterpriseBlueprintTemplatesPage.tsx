import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@lib/api'

const USE_CASE_COLOR: Record<string, string> = {
  'Finance Automation':   '#4fc3f7',
  'PMO':                  '#a78bfa',
  'HR Intelligence':      '#00ddaa',
  'Legal Ops':            '#f59e0b',
  'Revenue Intelligence': '#ff9800',
}
const USE_CASE_ICON: Record<string, string> = {
  'Finance Automation':   '💰',
  'PMO':                  '📋',
  'HR Intelligence':      '👥',
  'Legal Ops':            '⚖️',
  'Revenue Intelligence': '📈',
}

export function EnterpriseBlueprintTemplatesPage() {
  const qc = useQueryClient()
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null)
  const [deployCustomerId, setDeployCustomerId] = useState('')
  const [deployResult, setDeployResult]         = useState<any>(null)
  const [deploying, setDeploying]               = useState(false)

  const templatesQ = useQuery({ queryKey: ['enterprise-templates'], queryFn: () => api.get('/admin/kangqore-immp/enterprise/blueprint-templates').then(r => r.data), staleTime: 60_000 })
  const bpsQ       = useQuery({ queryKey: ['blueprints-templates'], queryFn: () => api.get('/admin/kangqore-immp/customers/blueprints').then(r => (r.data ?? []).filter((b: any) => b.status === 'ACTIVE').slice(0, 30)), staleTime: 60_000 })

  const deployTemplate = async () => {
    if (!selectedTemplate || !deployCustomerId) return
    setDeploying(true); setDeployResult(null)
    const r = await api.post(`/admin/kangqore-immp/enterprise/blueprint-templates/${selectedTemplate.id}/deploy`, { customerId: deployCustomerId }).catch((e: any) => ({ data: { error: e?.response?.data?.error || 'Deploy failed' } }))
    setDeployResult(r.data)
    setDeploying(false)
    qc.invalidateQueries({ queryKey: ['enterprise-templates'] })
  }

  const templates: any[] = templatesQ.data?.templates ?? []
  const customers: any[] = bpsQ.data ?? []

  return (
    <div style={{ padding: '32px 40px', fontFamily: 'Inter, sans-serif', color: '#e4e8f0', maxWidth: 1100 }}>
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontSize: 11, color: '#00ddaa', fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 6 }}>S188 · Enterprise Enablement</div>
        <h1 style={{ margin: 0, fontSize: 26, fontWeight: 700, color: '#fff' }}>Enterprise Blueprint Templates</h1>
        <p style={{ margin: '6px 0 0', color: '#8899aa', fontSize: 13 }}>Curated Blueprint packs for enterprise use cases · white-glove configuration wizard</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 24 }}>
        {/* Template cards */}
        <div>
          {templates.length === 0 && templatesQ.isLoading ? (
            <div style={{ color: '#8899aa', padding: 20 }}>Loading templates…</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {templates.map((t: any) => {
                const color = USE_CASE_COLOR[t.useCase] ?? '#00ddaa'
                const icon  = USE_CASE_ICON[t.useCase] ?? '📦'
                const isSelected = selectedTemplate?.id === t.id
                return (
                  <div key={t.id} onClick={() => setSelectedTemplate(isSelected ? null : t)}
                    style={{ background: isSelected ? '#1e2d42' : '#1a2235', border: `1px solid ${isSelected ? color + '55' : '#263250'}`, borderRadius: 14, padding: '20px 24px', cursor: 'pointer', transition: 'border-color 0.2s' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
                      <div style={{ width: 44, height: 44, borderRadius: 12, background: `${color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 }}>{icon}</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                          <div style={{ fontSize: 15, fontWeight: 700, color: '#ccdde0' }}>{t.name}</div>
                          {isSelected && <span style={{ fontSize: 10, fontWeight: 800, color: color, background: `${color}18`, padding: '2px 8px', borderRadius: 5 }}>SELECTED</span>}
                        </div>
                        <div style={{ fontSize: 12, color: '#8899aa', lineHeight: 1.5, marginBottom: 10 }}>{t.description}</div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                          {(t.modules ?? []).map((m: string) => (
                            <span key={m} style={{ fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 5, background: `${color}15`, color: color }}>{m}</span>
                          ))}
                        </div>
                      </div>
                      <div style={{ textAlign: 'right', flexShrink: 0 }}>
                        <div style={{ fontSize: 20, fontWeight: 800, color: color }}>{t.deployCount}</div>
                        <div style={{ fontSize: 9, color: '#556', fontWeight: 700, textTransform: 'uppercase', letterSpacing: .5 }}>deploys</div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Deploy panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, alignSelf: 'start', position: 'sticky', top: 24 }}>
          <div style={{ background: '#1a2235', border: `1px solid ${selectedTemplate ? (USE_CASE_COLOR[selectedTemplate?.useCase] ?? '#00ddaa') + '44' : '#263250'}`, borderRadius: 12, padding: '20px 24px', transition: 'border-color 0.3s' }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#8899aa', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 14 }}>
              {selectedTemplate ? `Deploy: ${selectedTemplate.name}` : 'Select a template'}
            </div>
            {selectedTemplate ? (
              <>
                <div style={{ fontSize: 11, color: '#8899aa', lineHeight: 1.6, marginBottom: 14 }}>
                  <strong style={{ color: (USE_CASE_COLOR[selectedTemplate.useCase] ?? '#00ddaa') }}>Use case:</strong> {selectedTemplate.useCase}<br />
                  <strong style={{ color: '#ccdde0' }}>Modules:</strong> {(selectedTemplate.modules ?? []).join(', ')}
                </div>
                <select value={deployCustomerId} onChange={e => setDeployCustomerId(e.target.value)}
                  style={{ width: '100%', background: '#263250', border: '1px solid #3a4a60', color: '#e4e8f0', padding: '9px 12px', borderRadius: 7, fontSize: 13, marginBottom: 12 }}>
                  <option value="">Select customer…</option>
                  {customers.map((c: any) => <option key={c.id} value={c.id}>{c.customerName}</option>)}
                </select>
                <button onClick={deployTemplate} disabled={!deployCustomerId || deploying}
                  style={{ width: '100%', background: USE_CASE_COLOR[selectedTemplate.useCase] ?? '#00ddaa', border: 'none', color: '#0d1824', padding: '10px', borderRadius: 8, cursor: 'pointer', fontSize: 13, fontWeight: 700, opacity: deploying ? 0.7 : 1 }}>
                  {deploying ? 'Deploying…' : 'Deploy Template'}
                </button>
                {deployResult && (
                  <div style={{ marginTop: 12, background: '#0d1824', borderRadius: 8, padding: '12px 14px', fontSize: 12, color: deployResult.error ? '#ff5252' : '#10b981' }}>
                    {deployResult.error ? deployResult.error : `✓ ${deployResult.template} deployed to customer`}
                  </div>
                )}
              </>
            ) : (
              <div style={{ color: '#556', fontSize: 13, textAlign: 'center', padding: '20px 0' }}>Click a template card on the left to select it for deployment.</div>
            )}
          </div>

          <div style={{ background: '#0d1824', border: '1px solid #263250', borderRadius: 12, padding: '18px 20px', fontSize: 12, color: '#8899aa', lineHeight: 1.7 }}>
            <div style={{ fontWeight: 700, color: '#4fc3f7', marginBottom: 8 }}>White-glove deployment</div>
            <div>Each template deploys a pre-configured Blueprint with proven workflows, WAANDA agents, and HANUMANAS policies — zero configuration needed from the customer.</div>
          </div>
        </div>
      </div>
    </div>
  )
}
