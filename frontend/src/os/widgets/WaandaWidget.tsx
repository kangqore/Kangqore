// WAANDA Widget — Generation III Runtime
// Workspace-aware WAANDA intelligence interface: suggestions, capability routing, synthesis.

import React, { useState, useRef } from 'react'
import { withWidgetContext, WidgetProps } from '../runtime/rendering/BaseWidget'

const PRIORITY_COLOR: Record<string, string> = {
  CRITICAL: 'var(--os-danger)',
  HIGH:     'var(--os-warning)',
  MEDIUM:   'var(--os-blue)',
  LOW:      'var(--os-text-4)',
}

const Core: React.FC<WidgetProps> = ({ viewModel, onAction, capabilities }) => {
  const suggestions: any[] = Array.isArray(viewModel.waandaSuggestions) ? viewModel.waandaSuggestions : []
  const synthesis: string  = viewModel.kimmSynthesis ?? ''
  const phase: string      = viewModel.waandaPhase   ?? 'OBSERVE'
  const confidence: number = viewModel.confidence    ?? 0.9
  const briefings: any[]   = Array.isArray(viewModel.systemBriefings) ? viewModel.systemBriefings : []
  const topBrief           = briefings[0] ?? null

  const [prompt, setPrompt]       = useState('')
  const [submitting, setSubmitting] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const confPct = Math.round(confidence * 100)

  const handleAsk = async () => {
    if (!prompt.trim()) return
    const capKey = Object.keys(capabilities)[0] ?? 'cap.ai.plan'
    if (!capabilities[capKey]) { onAction('WAANDA_PROMPT_SUBMITTED', { prompt }); setPrompt(''); return }
    setSubmitting(true)
    try {
      await capabilities[capKey]({ prompt })
      onAction('WAANDA_PROMPT_SUBMITTED', { prompt })
      setPrompt('')
    } finally { setSubmitting(false) }
  }

  const handleKey = (e: React.KeyboardEvent) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); void handleAsk() } }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {/* Header: phase badge + confidence */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 7px', borderRadius: 4,
            background: 'var(--os-blue-dim)', color: 'var(--os-blue)', border: '1px solid var(--os-blue)22' }}>
            {phase}
          </span>
          <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--os-text-2)' }}>WAANDA</span>
        </div>
        <span style={{
          fontSize: 11, fontWeight: 700, fontVariantNumeric: 'tabular-nums',
          color: confPct >= 80 ? 'var(--os-success)' : 'var(--os-warning)',
        }}>{confPct}% conf</span>
      </div>

      {/* Top briefing synthesis */}
      {(synthesis || topBrief?.summary) && (
        <div style={{
          padding: '7px 10px', borderRadius: 7,
          background: 'var(--os-surface-3)', border: '1px solid var(--os-border-subtle)',
        }}>
          {topBrief?.priority && (
            <div style={{ fontSize: 9, fontWeight: 700, color: PRIORITY_COLOR[topBrief.priority] ?? 'var(--os-text-4)',
              textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 3 }}>
              {topBrief.priority}
            </div>
          )}
          <p style={{ fontSize: 11, color: 'var(--os-text-2)', margin: 0, lineHeight: 1.5 }}>
            {synthesis || topBrief?.summary}
          </p>
        </div>
      )}

      {/* WAANDA suggestions */}
      {suggestions.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
          <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--os-text-4)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Suggested Actions
          </div>
          {suggestions.slice(0, 2).map((sug: any) => (
            <div key={sug.id} style={{
              padding: '7px 10px', borderRadius: 7,
              background: 'var(--os-blue-dim)', border: '1px solid var(--os-blue)22',
            }}>
              <p style={{ fontSize: 11, color: 'var(--os-text-2)', margin: '0 0 6px', lineHeight: 1.45 }}>{sug.text}</p>
              {sug.options?.length > 0 && (
                <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
                  {sug.options.slice(0, 2).map((opt: any) => (
                    <button key={opt.id} onClick={() => onAction('EXECUTE_WAANDA_OPTION', { optionId: opt.id })} style={{
                      fontSize: 10, padding: '3px 9px', borderRadius: 4, cursor: 'pointer',
                      background: 'var(--os-surface-1)', color: 'var(--os-blue)',
                      border: '1px solid var(--os-blue)44', fontWeight: 600,
                    }}>
                      {opt.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Prompt input */}
      <div style={{ display: 'flex', gap: 6 }}>
        <input
          ref={inputRef}
          type="text"
          placeholder="Ask WAANDA…"
          value={prompt}
          onChange={e => setPrompt(e.target.value)}
          onKeyDown={handleKey}
          disabled={submitting}
          style={{
            flex: 1, fontSize: 12, padding: '7px 10px', borderRadius: 7,
            background: 'var(--os-surface-3)', border: '1px solid var(--os-border-subtle)',
            color: 'var(--os-text-1)', outline: 'none',
          }}
        />
        <button onClick={() => void handleAsk()} disabled={submitting || !prompt.trim()} style={{
          fontSize: 12, padding: '7px 14px', borderRadius: 7, cursor: submitting ? 'default' : 'pointer',
          background: 'var(--os-blue)', color: '#fff', border: 'none', fontWeight: 600,
          opacity: !prompt.trim() || submitting ? 0.5 : 1,
        }}>
          {submitting ? '…' : 'Ask'}
        </button>
      </div>
    </div>
  )
}

export const WaandaWidget = withWidgetContext(Core)
