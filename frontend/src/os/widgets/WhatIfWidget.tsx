import React, { useState } from 'react'
import { withWidgetContext, WidgetProps } from '../runtime/rendering/BaseWidget'

const HORIZON_OPTIONS = [
  { label: '30d', value: 30 },
  { label: '60d', value: 60 },
  { label: '90d', value: 90 },
]

interface SimResult {
  delta: number
  simulatedOis: number
  confidence: number
  recommendation: string
  scenario: string
  horizon: number
}

const Core: React.FC<WidgetProps> = ({ viewModel }) => {
  const [scenario,    setScenario]    = useState('')
  const [horizon,     setHorizon]     = useState(30)
  const [pending,     setPending]     = useState(false)
  const [liveResult,  setLiveResult]  = useState<SimResult | null>(null)
  const [simError,    setSimError]    = useState<string | null>(null)

  const oisScore         = viewModel.oisScore ?? null
  const scenarios: any[] = Array.isArray(viewModel.twinScenarios) ? viewModel.twinScenarios : []
  const exposure: any[]  = Array.isArray(viewModel.domainRiskExposure) ? viewModel.domainRiskExposure : []
  const riskScore        = viewModel.riskScore ?? 0

  async function handleSubmit() {
    const trimmed = scenario.trim()
    if (trimmed.length < 5 || pending) return
    setPending(true)
    setSimError(null)
    setLiveResult(null)

    try {
      const res = await fetch('/api/admin/gate8/twin/simulate', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scenario: trimmed, horizon }),
      })
      if (!res.ok) throw new Error(`${res.status}`)
      const data = await res.json()
      setLiveResult({ ...data, scenario: trimmed, horizon })
      setScenario('')
    } catch (err: any) {
      setSimError('Simulation unavailable — try again shortly')
    } finally {
      setPending(false)
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      void handleSubmit()
    }
  }

  const displayResult: SimResult | null = liveResult ?? (scenarios[0] ? {
    delta:          scenarios[0].delta,
    simulatedOis:   scenarios[0].simulatedOis,
    confidence:     scenarios[0].confidence,
    recommendation: scenarios[0].recommendation ?? '',
    scenario:       scenarios[0].scenario,
    horizon:        scenarios[0].horizon,
  } : null)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>

      {/* OIS baseline row */}
      {oisScore !== null && (
        <div style={{ display: 'flex', gap: 6 }}>
          <div style={{
            flex: 1, padding: '6px 10px', borderRadius: 6,
            background: 'var(--os-surface-3)', border: '1px solid var(--os-border-subtle)',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          }}>
            <span style={{ fontSize: 10, color: 'var(--os-text-4)' }}>Current OIS</span>
            <span style={{ fontSize: 18, fontWeight: 800, fontVariantNumeric: 'tabular-nums',
              color: oisScore >= 70 ? 'var(--os-success)' : 'var(--os-warning)' }}>
              {oisScore.toFixed(1)}
            </span>
          </div>
          <div style={{
            padding: '6px 10px', borderRadius: 6,
            background: 'var(--os-surface-3)', border: '1px solid var(--os-border-subtle)',
            textAlign: 'center',
          }}>
            <div style={{ fontSize: 13, fontWeight: 700, fontVariantNumeric: 'tabular-nums',
              color: riskScore > 30 ? 'var(--os-danger)' : 'var(--os-text-2)' }}>{riskScore}</div>
            <span style={{ fontSize: 9, color: 'var(--os-text-4)' }}>Risk</span>
          </div>
        </div>
      )}

      {/* Quick simulation input */}
      <div style={{
        padding: '8px 10px', borderRadius: 8,
        background: 'var(--os-surface-3)', border: '1px solid var(--os-border-subtle)',
        display: 'flex', flexDirection: 'column', gap: 6,
      }}>
        <span style={{ fontSize: 9, fontWeight: 700, color: 'var(--os-blue)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          G8.3 Digital Twin · Quick Simulation
        </span>
        <textarea
          value={scenario}
          onChange={e => setScenario(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Describe a change — e.g. 'Hire 3 engineers and close 2 enterprise deals'"
          rows={2}
          style={{
            fontSize: 11, color: 'var(--os-text-1)', lineHeight: 1.5,
            background: 'transparent', border: 'none', outline: 'none',
            resize: 'none', width: '100%', fontFamily: 'inherit',
          }}
        />
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 6 }}>
          <div style={{ display: 'flex', gap: 4 }}>
            {HORIZON_OPTIONS.map(h => (
              <button
                key={h.value}
                onClick={() => setHorizon(h.value)}
                style={{
                  fontSize: 9, fontWeight: 600, padding: '2px 7px', borderRadius: 4, cursor: 'pointer',
                  background:   horizon === h.value ? 'var(--os-blue-dim)' : 'transparent',
                  border:       horizon === h.value ? '1px solid var(--os-blue)44' : '1px solid var(--os-border-subtle)',
                  color:        horizon === h.value ? 'var(--os-blue)' : 'var(--os-text-4)',
                }}
              >
                {h.label}
              </button>
            ))}
          </div>
          <button
            onClick={() => void handleSubmit()}
            disabled={pending || scenario.trim().length < 5}
            style={{
              fontSize: 10, fontWeight: 700, padding: '4px 12px', borderRadius: 5,
              cursor: pending || scenario.trim().length < 5 ? 'default' : 'pointer',
              background: pending ? 'var(--os-surface-3)' : 'var(--os-blue-dim)',
              border: pending ? '1px solid var(--os-border-subtle)' : '1px solid var(--os-blue)44',
              color: pending ? 'var(--os-text-4)' : 'var(--os-blue)',
              opacity: scenario.trim().length < 5 ? 0.5 : 1,
            }}
          >
            {pending ? 'Running…' : 'Simulate →'}
          </button>
        </div>
      </div>

      {/* Error state */}
      {simError && (
        <div style={{
          padding: '5px 10px', borderRadius: 5, fontSize: 10,
          background: 'var(--os-danger-dim)', border: '1px solid var(--os-danger)33',
          color: 'var(--os-danger)',
        }}>
          {simError}
        </div>
      )}

      {/* Simulation result */}
      {displayResult && (
        <div style={{
          padding: '8px 11px', borderRadius: 6,
          background: displayResult.delta >= 0 ? 'var(--os-success)10' : 'var(--os-danger)10',
          border: `1px solid ${displayResult.delta >= 0 ? 'var(--os-success)' : 'var(--os-danger)'}33`,
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 9, fontWeight: 700, color: 'var(--os-text-4)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 3 }}>
                {liveResult ? 'Live Result' : 'Last Scenario'} · {displayResult.horizon}d
              </div>
              <div style={{ fontSize: 11, color: 'var(--os-text-2)', lineHeight: 1.4 }}>
                {displayResult.scenario.slice(0, 72)}
              </div>
              {displayResult.recommendation && (
                <div style={{ fontSize: 9, color: 'var(--os-text-3)', marginTop: 3 }}>
                  ↗ {displayResult.recommendation.slice(0, 72)}
                </div>
              )}
              <div style={{ fontSize: 9, color: 'var(--os-text-4)', marginTop: 3, fontVariantNumeric: 'tabular-nums' }}>
                {Math.round((displayResult.confidence ?? 0) * 100)}% confidence
              </div>
            </div>
            <div style={{ textAlign: 'right', flexShrink: 0 }}>
              <div style={{
                fontSize: 20, fontWeight: 800, lineHeight: 1,
                color: displayResult.delta >= 0 ? 'var(--os-success)' : 'var(--os-danger)',
                fontVariantNumeric: 'tabular-nums',
              }}>
                {displayResult.delta >= 0 ? '+' : ''}{displayResult.delta.toFixed(1)}
              </div>
              <div style={{ fontSize: 8, color: 'var(--os-text-4)' }}>OIS Δ</div>
            </div>
          </div>
        </div>
      )}

      {scenarios.length > 1 && !liveResult && (
        <div style={{ fontSize: 10, color: 'var(--os-text-4)', textAlign: 'center' }}>
          {scenarios.length} total scenarios · see Simulation Lab
        </div>
      )}
    </div>
  )
}

export const WhatIfWidget = withWidgetContext(Core)
