import React from 'react'
import { withWidgetContext, WidgetProps } from '../runtime/rendering/BaseWidget'

const Core: React.FC<WidgetProps> = ({ viewModel }) => {
  const isListening: boolean     = viewModel.isListening === true
  const synthesis: string | null = viewModel.kimmSynthesis ?? null
  const avgTrust: number         = viewModel.avgTrust ?? 0
  const avgPct                   = Math.round(avgTrust * 100)

  let sessions: any[] = []
  if (Array.isArray(viewModel.liveSessions)) {
    sessions = viewModel.liveSessions
  } else if (Array.isArray(viewModel.conversations)) {
    sessions = viewModel.conversations
  }

  const voiceCol    = isListening ? 'var(--os-success)' : 'var(--os-text-4)'
  const voiceBg     = isListening ? 'var(--os-success)10' : 'var(--os-surface-3)'
  const voiceBorder = isListening ? '1px solid var(--os-success)33' : '1px solid var(--os-border-subtle)'
  const voiceLabel  = isListening ? 'ACTIVE' : 'STANDBY'

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>

      {/* Voice status hero */}
      <div style={{
        padding: '10px 12px', borderRadius: 8,
        background: voiceBg, border: voiceBorder,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8,
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{
              width: 8, height: 8, borderRadius: '50%', background: voiceCol,
              boxShadow: isListening ? `0 0 6px ${voiceCol}` : 'none',
            }} />
            <span style={{ fontSize: 10, fontWeight: 700, color: voiceCol, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Voice · {voiceLabel}
            </span>
          </div>
          <div style={{ fontSize: 9, color: 'var(--os-text-4)', marginTop: 3 }}>
            KIMMP {isListening ? 'is listening for commands and signals' : 'is in standby mode'}
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: 16, fontWeight: 800, color: 'var(--os-text-1)', fontVariantNumeric: 'tabular-nums' }}>
            {sessions.length}
          </div>
          <div style={{ fontSize: 8, color: 'var(--os-text-4)' }}>feeds</div>
        </div>
      </div>

      {/* KIMMP synthesis */}
      {synthesis && (
        <div style={{
          padding: '6px 10px', borderRadius: 5, fontSize: 11, lineHeight: 1.5,
          background: 'var(--os-blue-dim)', border: '1px solid var(--os-blue)33',
          color: 'var(--os-text-2)', fontStyle: 'italic',
        }}>
          <span style={{ color: 'var(--os-blue)', fontWeight: 700, fontStyle: 'normal', marginRight: 5 }}>KIMMP</span>
          {synthesis}
        </div>
      )}

      {/* Stats */}
      <div style={{ display: 'flex', gap: 6 }}>
        {[
          { label: 'Intel Feeds', value: sessions.length, warn: false       },
          { label: 'Avg Trust',   value: `${avgPct}%`,    warn: avgPct < 50 },
        ].map(({ label, value, warn }) => (
          <div key={label} style={{
            flex: 1, padding: '6px 4px', borderRadius: 6, textAlign: 'center',
            background: warn ? 'var(--os-danger-dim)' : 'var(--os-surface-3)',
            border: warn ? '1px solid var(--os-danger)44' : '1px solid var(--os-border-subtle)',
          }}>
            <div style={{ fontSize: 15, fontWeight: 700, lineHeight: 1, color: warn ? 'var(--os-danger)' : 'var(--os-text-1)', fontVariantNumeric: 'tabular-nums' }}>{value}</div>
            <span style={{ fontSize: 10, color: 'var(--os-text-4)', marginTop: 2, display: 'block' }}>{label}</span>
          </div>
        ))}
      </div>

      {/* Intelligence feeds */}
      {sessions.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <div style={{ fontSize: 9, fontWeight: 700, color: 'var(--os-text-4)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Intelligence Feeds
          </div>
          {sessions.slice(0, 3).map((s: any) => {
            const trust = Math.round((s.trustScore ?? 0) * 100)
            return (
              <div key={s.id} style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '5px 10px', borderRadius: 5,
                background: 'var(--os-surface-3)', border: '1px solid var(--os-border-subtle)',
              }}>
                <div style={{
                  width: 6, height: 6, borderRadius: '50%', flexShrink: 0,
                  background: 'var(--os-success)', boxShadow: '0 0 4px var(--os-success)',
                }} />
                <span style={{ fontSize: 11, color: 'var(--os-text-2)', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {s.company ?? s.name ?? s.sessionType ?? s.id}
                </span>
                <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--os-success)', flexShrink: 0, fontVariantNumeric: 'tabular-nums' }}>
                  {trust}%
                </span>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export const VoiceWidget = withWidgetContext(Core)
