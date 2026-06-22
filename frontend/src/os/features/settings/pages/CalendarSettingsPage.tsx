/**
 * CalendarSettingsPage — Apple-grade rebuild
 * 4-surface dark system, no light-theme classes
 */
import { useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Calendar, CheckCircle2, XCircle, RefreshCw, Trash2, AlertCircle, Wifi } from 'lucide-react'
import { api, isDemo } from '@lib/api'

// ── Design tokens ─────────────────────────────────────────────────────────────

const CARD  = '#0d1117'
const RAISE = '#121d30'
const EDGE  = '#1e2b40'
const BLUE  = '#2564ea'
const GREEN = '#00c875'
const RED   = '#e2445c'
const AMBER = '#fdab3d'
const EASE  = 'cubic-bezier(0.16, 1, 0.3, 1)'

let _inj = false
function ensureKf() {
  if (_inj) return; _inj = true
  const s = document.createElement('style')
  s.textContent = `
    @keyframes _fadeUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:none}}
    @keyframes _spin{to{transform:rotate(360deg)}}
  `
  document.head.appendChild(s)
}
const anim = (d: number): React.CSSProperties => ({ animation: `_fadeUp 0.55s ${EASE} ${d}ms both` })

// ── Types ─────────────────────────────────────────────────────────────────────

interface CalendarIntegration {
  id: string
  provider: 'GOOGLE' | 'MICROSOFT'
  accountEmail: string
  status: 'ACTIVE' | 'INACTIVE' | 'ERROR'
  lastSyncedAt?: string
}

// ── Provider config ────────────────────────────────────────────────────────────

const PROVIDERS = [
  {
    id: 'GOOGLE' as const,
    name: 'Google Calendar',
    description: 'Sync meetings, block busy slots, and surface Google Meet links automatically.',
    color: '#ea4335',
    logoLetter: 'G',
    authUrl: '/api/oauth/google?scope=calendar',
    features: ['Auto-block busy slots', 'Google Meet link sync', 'Bi-directional event sync'],
  },
  {
    id: 'MICROSOFT' as const,
    name: 'Microsoft / Outlook',
    description: 'Connect Microsoft 365 or Outlook for Teams meetings and calendar sync.',
    color: '#0078d4',
    logoLetter: 'M',
    authUrl: '/api/oauth/microsoft?scope=calendar',
    features: ['Microsoft Teams link sync', 'Outlook calendar sync', 'M365 shared calendars'],
  },
]

const fmtDate = (s: string) => new Date(s).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })

// ── Loading spinner ────────────────────────────────────────────────────────────

function Spinner() {
  return (
    <div style={{
      width: 16, height: 16, borderRadius: '50%', flexShrink: 0,
      border: `2px solid ${EDGE}`,
      borderTopColor: BLUE,
      animation: '_spin 0.7s linear infinite',
    }} />
  )
}

// ── Provider card ─────────────────────────────────────────────────────────────

function ProviderCard({
  provider, connected, onConnect, onDisconnect, disconnecting,
}: {
  provider: typeof PROVIDERS[0]
  connected: CalendarIntegration | undefined
  onConnect: () => void
  onDisconnect: () => void
  disconnecting: boolean
}) {
  const isConnected = !!connected
  const isError     = connected?.status === 'ERROR'
  const statusColor = isError ? RED : isConnected ? GREEN : '#334155'

  return (
    <div style={{
      borderRadius: 20, overflow: 'hidden',
      background: CARD, border: `1px solid ${isConnected ? `${statusColor}30` : EDGE}`,
      boxShadow: isConnected ? `0 0 32px ${statusColor}08, inset 0 1px 0 rgba(13,17,23,0.4)` : `inset 0 1px 0 rgba(255,255,255,0.02)`,
      transition: `all 0.3s ${EASE}`,
      position: 'relative', overflow: 'visible',
    }}>
      {/* Ambient glow on connected */}
      {isConnected && (
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none', borderRadius: 20,
          background: `radial-gradient(ellipse at 10% 0%, ${statusColor}07 0%, transparent 60%)`,
        }} />
      )}

      {/* Header */}
      <div style={{
        padding: '20px 22px 0',
        display: 'flex', alignItems: 'flex-start', gap: 16,
      }}>
        {/* Logo */}
        <div style={{
          width: 48, height: 48, borderRadius: 14, flexShrink: 0,
          background: `${provider.color}14`, border: `1px solid ${provider.color}25`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 20, fontWeight: 900, color: provider.color, letterSpacing: '-0.02em',
        }}>
          {provider.logoLetter}
        </div>

        {/* Name + status */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <p style={{ fontSize: 14, fontWeight: 700, color: '#f1f5f9', margin: 0 }}>{provider.name}</p>
            {isConnected && (
              <span style={{
                display: 'inline-flex', alignItems: 'center', gap: 5,
                fontSize: 9, fontWeight: 700, padding: '3px 8px', borderRadius: 999,
                textTransform: 'uppercase', letterSpacing: '0.08em',
                color: statusColor, background: `${statusColor}14`, border: `1px solid ${statusColor}25`,
              }}>
                {isError
                  ? <><AlertCircle style={{ width: 9, height: 9 }} /> Error</>
                  : <><Wifi style={{ width: 9, height: 9 }} /> Connected</>
                }
              </span>
            )}
          </div>
          {connected
            ? (
              <div>
                <p style={{ fontSize: 12, color: '#475569', margin: 0 }}>{connected.accountEmail}</p>
                {connected.lastSyncedAt && (
                  <p style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: '#334155', margin: '4px 0 0' }}>
                    <RefreshCw style={{ width: 10, height: 10 }} />
                    Last synced {fmtDate(connected.lastSyncedAt)}
                  </p>
                )}
              </div>
            )
            : <p style={{ fontSize: 12, color: '#475569', margin: 0, lineHeight: 1.5 }}>{provider.description}</p>
          }
        </div>
      </div>

      {/* Feature list (only when not connected) */}
      {!isConnected && (
        <div style={{ padding: '14px 22px 0' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {provider.features.map(f => (
              <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{
                  width: 14, height: 14, borderRadius: '50%', flexShrink: 0,
                  background: `${provider.color}14`, border: `1px solid ${provider.color}25`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <div style={{ width: 4, height: 4, borderRadius: '50%', background: provider.color }} />
                </div>
                <span style={{ fontSize: 11, color: '#475569' }}>{f}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Divider */}
      <div style={{ margin: '18px 22px 0', height: 1, background: EDGE }} />

      {/* Action button */}
      <div style={{ padding: '14px 22px 20px' }}>
        {isConnected ? (
          <button
            onClick={onDisconnect}
            disabled={disconnecting}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 7,
              padding: '8px 14px', borderRadius: 10,
              background: `${RED}0a`, border: `1px solid ${RED}25`,
              color: RED, fontSize: 12, fontWeight: 600, cursor: 'pointer',
              transition: `all 0.15s ${EASE}`,
              opacity: disconnecting ? 0.6 : 1,
            }}
            onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = `${RED}16`}
            onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = `${RED}0a`}
          >
            {disconnecting
              ? <Spinner />
              : <Trash2 style={{ width: 12, height: 12 }} />
            }
            {disconnecting ? 'Disconnecting…' : 'Disconnect'}
          </button>
        ) : (
          <button
            onClick={onConnect}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 7,
              padding: '9px 16px', borderRadius: 10, border: 'none',
              background: provider.color, color: '#fff',
              fontSize: 12, fontWeight: 700, cursor: 'pointer',
              boxShadow: `0 4px 14px ${provider.color}40`,
              transition: `all 0.2s ${EASE}`,
            }}
            onMouseEnter={e => (e.currentTarget as HTMLElement).style.boxShadow = `0 6px 20px ${provider.color}55`}
            onMouseLeave={e => (e.currentTarget as HTMLElement).style.boxShadow = `0 4px 14px ${provider.color}40`}
          >
            <Calendar style={{ width: 12, height: 12 }} />
            Connect {provider.name.split(' ')[0]}
          </button>
        )}
      </div>
    </div>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────

export function CalendarSettingsPage() {
  const queryClient = useQueryClient()

  useEffect(() => { ensureKf() }, [])

  const { data: integrations = [], isLoading } = useQuery<CalendarIntegration[]>({
    queryKey: ['calendar-integrations'],
    queryFn:  () => api.get('/scheduling/calendar-integrations').then(r => r.data.integrations ?? r.data ?? []),
    enabled:  !isDemo(),
    staleTime: 1000 * 60 * 2,
  })

  const { mutate: disconnect, isPending: disconnecting } = useMutation({
    mutationFn: (id: string) => api.delete(`/scheduling/calendar-integrations/${id}`),
    onSuccess:  () => queryClient.invalidateQueries({ queryKey: ['calendar-integrations'] }),
  })

  const connected = integrations.length
  const active    = integrations.filter(i => i.status === 'ACTIVE').length

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>

      {/* Header */}
      <div style={anim(0)}>
        <h2 style={{ fontSize: 18, fontWeight: 700, color: '#f1f5f9', margin: 0 }}>Calendar Integrations</h2>
        <p style={{ fontSize: 13, color: '#475569', margin: '6px 0 0' }}>
          Connect your calendars to automatically block busy slots and sync scheduled events.
        </p>
      </div>

      {/* Status summary — only shown when connected */}
      {connected > 0 && !isLoading && (
        <div style={{
          ...anim(40),
          borderRadius: 16, padding: '16px 20px',
          background: `${GREEN}08`, border: `1px solid ${GREEN}20`,
          display: 'flex', alignItems: 'center', gap: 14,
        }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10, flexShrink: 0,
            background: `${GREEN}14`, border: `1px solid ${GREEN}25`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <CheckCircle2 style={{ width: 16, height: 16, color: GREEN }} />
          </div>
          <div>
            <p style={{ fontSize: 13, fontWeight: 600, color: '#f1f5f9', margin: 0 }}>
              {active} of {connected} calendar{connected !== 1 ? 's' : ''} syncing
            </p>
            <p style={{ fontSize: 11, color: '#475569', margin: '3px 0 0' }}>
              Busy slots are being blocked automatically across your connected accounts.
            </p>
          </div>
        </div>
      )}

      {/* Loading */}
      {isLoading && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', ...anim(60) }}>
          <Spinner />
          <span style={{ fontSize: 13, color: '#475569' }}>Loading integrations…</span>
        </div>
      )}

      {/* Provider cards */}
      <div style={{ ...anim(80), display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
        {PROVIDERS.map((provider, i) => {
          const conn = integrations.find(int => int.provider === provider.id)
          return (
            <div key={provider.id} style={{ animation: `_fadeUp 0.55s ${EASE} ${80 + i * 60}ms both` }}>
              <ProviderCard
                provider={provider}
                connected={conn}
                onConnect={() => { window.location.href = provider.authUrl }}
                onDisconnect={() => conn && disconnect(conn.id)}
                disconnecting={disconnecting}
              />
            </div>
          )
        })}
      </div>

      {/* Active integrations table */}
      {integrations.length > 0 && (
        <div style={anim(200)}>
          <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#334155', margin: '0 0 12px' }}>
            Active Integrations
          </p>
          <div style={{
            borderRadius: 16, overflow: 'hidden',
            background: CARD, border: `1px solid ${EDGE}`,
          }}>
            {integrations.map((int, i) => {
              const isOk    = int.status === 'ACTIVE'
              const color   = isOk ? GREEN : int.status === 'ERROR' ? RED : AMBER
              const provCfg = PROVIDERS.find(p => p.id === int.provider)

              return (
                <div key={int.id} style={{
                  display: 'flex', alignItems: 'center', gap: 16,
                  padding: '14px 20px',
                  background: i % 2 === 0 ? CARD : RAISE,
                  borderBottom: i < integrations.length - 1 ? `1px solid ${EDGE}` : 'none',
                }}>
                  {/* Provider icon */}
                  <div style={{
                    width: 32, height: 32, borderRadius: 9, flexShrink: 0,
                    background: provCfg ? `${provCfg.color}14` : RAISE,
                    border: `1px solid ${provCfg ? `${provCfg.color}25` : EDGE}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 13, fontWeight: 900, color: provCfg?.color ?? '#64748b',
                  }}>
                    {provCfg?.logoLetter ?? '?'}
                  </div>

                  {/* Info */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: 13, fontWeight: 600, color: '#f1f5f9', margin: 0 }}>
                      {int.provider === 'GOOGLE' ? 'Google Calendar' : 'Microsoft Calendar'}
                    </p>
                    <p style={{ fontSize: 11, color: '#475569', margin: '2px 0 0' }}>{int.accountEmail}</p>
                  </div>

                  {/* Status */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    {isOk
                      ? <CheckCircle2 style={{ width: 14, height: 14, color: GREEN, flexShrink: 0 }} />
                      : <XCircle     style={{ width: 14, height: 14, color: RED,   flexShrink: 0 }} />
                    }
                    <span style={{
                      fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 999,
                      color, background: `${color}14`, border: `1px solid ${color}25`,
                    }}>
                      {int.status}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Empty state */}
      {!isLoading && integrations.length === 0 && (
        <div style={{
          ...anim(120),
          borderRadius: 20, padding: '40px 28px', textAlign: 'center',
          background: CARD, border: `1px solid ${EDGE}`,
        }}>
          <div style={{
            width: 56, height: 56, borderRadius: 16, margin: '0 auto 16px',
            background: `${BLUE}0a`, border: `1px solid ${BLUE}20`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Calendar style={{ width: 24, height: 24, color: BLUE }} />
          </div>
          <p style={{ fontSize: 15, fontWeight: 700, color: '#f1f5f9', margin: '0 0 6px' }}>No calendars connected</p>
          <p style={{ fontSize: 12, color: '#475569', margin: 0, lineHeight: 1.6 }}>
            Connect Google or Microsoft to start syncing meetings and blocking busy slots.
          </p>
        </div>
      )}
    </div>
  )
}
