/**
 * ClientSettings — real saves
 * Profile → PATCH /auth/profile → updates auth store + localStorage
 * Password → POST /auth/change-password
 * Notifications / Preferences → localStorage (no backend endpoint)
 */
import { useState, useEffect } from 'react'
import { useMutation } from '@tanstack/react-query'
import {
  User, Bell, Shield, Sliders, Camera, Eye, EyeOff,
  CheckCircle2, AlertCircle, Smartphone, Globe, Clock,
} from 'lucide-react'
import { useAuthStore } from '@store/auth'
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
  s.textContent = `@keyframes _fadeUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:none}}`
  document.head.appendChild(s)
}
const anim = (d: number): React.CSSProperties => ({ animation: `_fadeUp 0.55s ${EASE} ${d}ms both` })

// ── localStorage helpers ──────────────────────────────────────────────────────

function lsGet<T>(key: string, fallback: T): T {
  try { const v = localStorage.getItem(key); return v ? JSON.parse(v) as T : fallback } catch { return fallback }
}
function lsSet(key: string, value: unknown) {
  try { localStorage.setItem(key, JSON.stringify(value)) } catch {}
}

// ── Tabs ──────────────────────────────────────────────────────────────────────

const TABS = [
  { id: 'profile',       label: 'Profile',       Icon: User     },
  { id: 'notifications', label: 'Notifications', Icon: Bell     },
  { id: 'security',      label: 'Security',      Icon: Shield   },
  { id: 'preferences',   label: 'Preferences',   Icon: Sliders  },
]

// ── Toggle ────────────────────────────────────────────────────────────────────

function Toggle({ on, onChange }: { on: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      role="switch" aria-checked={on} onClick={() => onChange(!on)}
      style={{
        width: 42, height: 24, borderRadius: 99, position: 'relative', flexShrink: 0,
        background: on ? GREEN : EDGE, cursor: 'pointer', border: 'none',
        transition: `background 0.2s ${EASE}`,
        boxShadow: on ? `0 0 10px ${GREEN}40` : 'none',
      }}
    >
      <div style={{
        position: 'absolute', top: 4, borderRadius: '50%',
        width: 16, height: 16, background: '#fff',
        left: on ? 22 : 4, transition: `left 0.2s ${EASE}`,
        boxShadow: '0 1px 3px rgba(0,0,0,0.4)',
      }} />
    </button>
  )
}

// ── Section card ──────────────────────────────────────────────────────────────

function Section({ title, description, children }: { title: string; description?: string; children: React.ReactNode }) {
  return (
    <div style={{ borderRadius: 20, background: CARD, border: `1px solid ${EDGE}`, overflow: 'hidden', boxShadow: `inset 0 1px 0 rgba(255,255,255,0.03)` }}>
      <div style={{ padding: '18px 24px', borderBottom: `1px solid ${EDGE}`, background: RAISE }}>
        <p style={{ fontSize: 14, fontWeight: 700, color: '#f1f5f9', margin: 0 }}>{title}</p>
        {description && <p style={{ fontSize: 12, color: '#475569', margin: '4px 0 0' }}>{description}</p>}
      </div>
      <div style={{ padding: 24 }}>{children}</div>
    </div>
  )
}

// ── Field ─────────────────────────────────────────────────────────────────────

function Field({ label, value, onChange, type = 'text', placeholder, disabled = false, hint }: {
  label: string; value: string; onChange?: (v: string) => void
  type?: string; placeholder?: string; disabled?: boolean; hint?: string
}) {
  const [focused, setFocused] = useState(false)
  return (
    <div>
      <label style={{ display: 'block', fontSize: 10, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#334155', marginBottom: 8 }}>{label}</label>
      <input
        type={type} value={value} onChange={e => onChange?.(e.target.value)} placeholder={placeholder}
        disabled={disabled} onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
        style={{
          width: '100%', background: disabled ? `${RAISE}80` : RAISE,
          border: `1px solid ${focused ? `${BLUE}60` : EDGE}`,
          borderRadius: 10, padding: '10px 14px', fontSize: 13,
          color: disabled ? '#475569' : '#e2e8f0', outline: 'none',
          fontFamily: 'inherit', boxSizing: 'border-box', cursor: disabled ? 'not-allowed' : 'text',
        }}
      />
      {hint && <p style={{ fontSize: 11, color: '#334155', margin: '5px 0 0' }}>{hint}</p>}
    </div>
  )
}

// ── Feedback banner (success / error) ────────────────────────────────────────

function Banner({ type, message }: { type: 'success' | 'error'; message: string }) {
  const color = type === 'success' ? GREEN : RED
  const Icon  = type === 'success' ? CheckCircle2 : AlertCircle
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 10,
      padding: '12px 14px', borderRadius: 12, marginBottom: 16,
      background: `${color}0a`, border: `1px solid ${color}25`,
    }}>
      <Icon style={{ width: 14, height: 14, color, flexShrink: 0 }} />
      <span style={{ fontSize: 13, color }}>{message}</span>
    </div>
  )
}

// ── Save button ───────────────────────────────────────────────────────────────

function SaveBtn({ onClick, saving, saved }: { onClick: () => void; saving?: boolean; saved: boolean }) {
  return (
    <button onClick={onClick} disabled={saving} style={{
      display: 'inline-flex', alignItems: 'center', gap: 8,
      padding: '10px 20px', borderRadius: 10, border: `1px solid ${saved ? `${GREEN}30` : 'transparent'}`,
      background: saved ? `${GREEN}14` : saving ? `${BLUE}80` : BLUE,
      color: saved ? GREEN : '#fff', fontSize: 13, fontWeight: 600,
      cursor: saving ? 'wait' : 'pointer',
      boxShadow: saved || saving ? 'none' : `0 4px 14px ${BLUE}40`,
      transition: `all 0.25s ${EASE}`,
    }}>
      {saved ? <><CheckCircle2 style={{ width: 14, height: 14 }} /> Saved</> : saving ? 'Saving…' : 'Save changes'}
    </button>
  )
}

// ── Notification row ──────────────────────────────────────────────────────────

function NotifRow({ label, description, on, onChange }: { label: string; description: string; on: boolean; onChange: (v: boolean) => void }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, padding: '14px 0', borderBottom: `1px solid ${EDGE}` }}>
      <div style={{ flex: 1 }}>
        <p style={{ fontSize: 13, fontWeight: 600, color: '#e2e8f0', margin: 0 }}>{label}</p>
        <p style={{ fontSize: 11, color: '#475569', margin: '3px 0 0' }}>{description}</p>
      </div>
      <Toggle on={on} onChange={onChange} />
    </div>
  )
}

// ── safe store patch (works even before HMR picks up patchUser) ───────────────

function applyUserPatch(patch: Record<string, unknown>) {
  try {
    const raw = localStorage.getItem('user')
    const current = raw ? JSON.parse(raw) : {}
    const updated = { ...current, ...patch }
    localStorage.setItem('user', JSON.stringify(updated))
    // Update Zustand state directly — no dependency on patchUser action
    useAuthStore.setState({ user: updated })
  } catch {
    // Silently ignore — store update is best-effort
  }
}

// ── error message extraction ──────────────────────────────────────────────────

function extractApiError(err: unknown, fallback: string): string {
  const r = (err as { response?: { data?: { error?: string; message?: string } }; message?: string })
  return r?.response?.data?.error
      ?? r?.response?.data?.message
      ?? (r?.message && r.message !== 'Network Error' ? r.message : null)
      ?? fallback
}

// ── PROFILE TAB ───────────────────────────────────────────────────────────────

function ProfileTab() {
  const { user } = useAuthStore()
  const initials = (user?.name ?? 'U').split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()

  const [form, setForm] = useState({
    name:    user?.name    ?? '',
    phone:   '',
    company: user?.company ?? 'Synapse Health',
    title:   '',
    bio:     '',
  })
  const [banner, setBanner] = useState<{ type: 'success' | 'error'; message: string } | null>(null)
  const set = (k: keyof typeof form) => (v: string) => setForm(f => ({ ...f, [k]: v }))

  const { mutate, isPending, isSuccess } = useMutation({
    mutationFn: async () => {
      if (isDemo()) {
        // Demo mode: update localStorage + Zustand directly
        applyUserPatch({
          name:    form.name.trim()    || undefined,
          company: form.company.trim() || undefined,
        })
        return
      }
      const { data } = await api.patch('/profile', {
        company: form.company.trim() || undefined,
        phone:   form.phone.trim()   || undefined,
      })
      applyUserPatch(data.user ?? {})
    },
    onSuccess: () => {
      setBanner({ type: 'success', message: 'Profile updated successfully.' })
      setTimeout(() => setBanner(null), 3000)
    },
    onError: (err: unknown) => {
      setBanner({ type: 'error', message: extractApiError(err, 'Failed to save profile.') })
    },
  })

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Avatar */}
      <Section title="Profile Photo" description="Your photo appears on documents and to your account manager.">
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <div style={{ position: 'relative', flexShrink: 0 }}>
            <div style={{
              width: 72, height: 72, borderRadius: '50%',
              background: `linear-gradient(135deg, ${BLUE}, ${BLUE}88)`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 24, fontWeight: 800, color: '#fff', border: `3px solid ${EDGE}`,
            }}>
              {initials}
            </div>
            <button style={{
              position: 'absolute', bottom: 0, right: 0,
              width: 24, height: 24, borderRadius: '50%', border: 'none',
              background: BLUE, display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', boxShadow: `0 2px 8px ${BLUE}50`,
            }}>
              <Camera style={{ width: 11, height: 11, color: '#fff' }} />
            </button>
          </div>
          <div>
            <p style={{ fontSize: 13, fontWeight: 600, color: '#f1f5f9', margin: '0 0 4px' }}>{user?.name}</p>
            <p style={{ fontSize: 11, color: '#475569', margin: '0 0 12px' }}>{user?.email}</p>
            <button style={{ padding: '7px 14px', borderRadius: 9, fontSize: 12, fontWeight: 600, background: RAISE, border: `1px solid ${EDGE}`, color: '#94a3b8', cursor: 'pointer' }}>
              Upload photo
            </button>
          </div>
        </div>
      </Section>

      {/* Personal info */}
      <Section title="Personal Information" description="Changes are saved to your account immediately.">
        {banner && <Banner type={banner.type} message={banner.message} />}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
          <Field label="Full name"  value={form.name}    onChange={isDemo() ? set('name') : undefined} disabled={!isDemo()} placeholder="Your full name" hint={!isDemo() ? 'Name is managed by your workspace admin.' : undefined} />
          <Field label="Email"      value={user?.email ?? ''} disabled hint="Email is managed by your workspace admin." />
          <Field label="Phone"      value={form.phone}   onChange={set('phone')}   placeholder="+91 98765 43210" />
          <Field label="Company"    value={form.company} onChange={set('company')} placeholder="Your organisation" />
          <Field label="Job title"  value={form.title}   onChange={set('title')}   placeholder="e.g. CTO" />
        </div>
        <div style={{ marginBottom: 20 }}>
          <label style={{ display: 'block', fontSize: 10, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#334155', marginBottom: 8 }}>Bio</label>
          <textarea
            value={form.bio} onChange={e => setForm(f => ({ ...f, bio: e.target.value }))}
            rows={3} placeholder="A brief introduction (optional)…"
            style={{ width: '100%', background: RAISE, border: `1px solid ${EDGE}`, borderRadius: 10, padding: '10px 14px', fontSize: 13, color: '#e2e8f0', outline: 'none', resize: 'vertical', fontFamily: 'inherit', boxSizing: 'border-box' }}
          />
        </div>
        <SaveBtn onClick={() => mutate()} saving={isPending} saved={isSuccess && !banner?.type.startsWith('e')} />
      </Section>
    </div>
  )
}

// ── NOTIFICATIONS TAB ─────────────────────────────────────────────────────────

const NOTIF_DEFAULT = {
  email: { invoice: true, projectUpdate: true, meetingReminder: true, supportReply: true, changeRequest: false, report: true },
  inApp: { invoice: true, projectUpdate: true, meetingReminder: true, supportReply: true, changeRequest: true,  report: false },
}
type NotifState = typeof NOTIF_DEFAULT

const NOTIF_ROWS: { key: keyof NotifState['email']; label: string; description: string }[] = [
  { key: 'invoice',         label: 'New Invoice',           description: 'When a new invoice is raised or a payment is due.'      },
  { key: 'projectUpdate',   label: 'Project Updates',       description: 'Sprint completions, milestones, and status changes.'    },
  { key: 'meetingReminder', label: 'Meeting Reminders',     description: '24 hours and 15 minutes before a scheduled meeting.'    },
  { key: 'supportReply',    label: 'Support Reply',         description: 'When your account manager replies to a ticket.'         },
  { key: 'changeRequest',   label: 'Change Request Status', description: 'Approvals, rejections, and CR updates.'                 },
  { key: 'report',          label: 'Monthly Report',        description: 'When your executive report is ready to view.'           },
]

function NotificationsTab() {
  const [state, setState] = useState<NotifState>(() => lsGet('kangqore_client_notif', NOTIF_DEFAULT))
  const [saved, setSaved] = useState(false)

  const toggle = (section: 'email' | 'inApp', key: keyof NotifState['email'], v: boolean) => {
    setState(s => ({ ...s, [section]: { ...s[section], [key]: v } }))
    setSaved(false)
  }

  const save = () => {
    lsSet('kangqore_client_notif', state)
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <Section title="Email Notifications" description="Receive email alerts for important events.">
        <div>
          {NOTIF_ROWS.map(row => (
            <NotifRow key={row.key} label={row.label} description={row.description}
              on={state.email[row.key]} onChange={v => toggle('email', row.key, v)} />
          ))}
          <div style={{ paddingTop: 20 }}>
            <SaveBtn onClick={save} saved={saved} />
          </div>
        </div>
      </Section>

      <Section title="In-App Notifications" description="Control what appears in your notification panel.">
        <div>
          {NOTIF_ROWS.map(row => (
            <NotifRow key={row.key} label={row.label} description={row.description}
              on={state.inApp[row.key]} onChange={v => toggle('inApp', row.key, v)} />
          ))}
        </div>
      </Section>
    </div>
  )
}

// ── SECURITY TAB ──────────────────────────────────────────────────────────────

function SecurityTab() {
  const [pw, setPw]         = useState({ current: '', next: '', confirm: '' })
  const [showCurrent, setShowCurrent] = useState(false)
  const [showNext,    setShowNext]    = useState(false)
  const [twoFa, setTwoFa]   = useState(false)
  const [banner, setBanner] = useState<{ type: 'success' | 'error'; message: string } | null>(null)
  const set = (k: keyof typeof pw) => (v: string) => setPw(p => ({ ...p, [k]: v }))

  const pwMatch  = pw.next.length > 0 && pw.next === pw.confirm
  const pwStrong = pw.next.length >= 8
  const canSubmit = pw.current && pwMatch && pwStrong

  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      if (isDemo()) throw new Error('Password cannot be changed in demo mode.')
      await api.post('/profile/change-password', { currentPassword: pw.current, newPassword: pw.next })
    },
    onSuccess: () => {
      setBanner({ type: 'success', message: 'Password changed successfully.' })
      setPw({ current: '', next: '', confirm: '' })
      setTimeout(() => setBanner(null), 3500)
    },
    onError: (err: unknown) => {
      setBanner({ type: 'error', message: extractApiError(err, 'Failed to change password.') })
    },
  })

  const SESSIONS = [
    { device: 'Chrome on macOS',   location: 'Mumbai, India', last: 'Now',        current: true  },
    { device: 'Safari on iPhone',  location: 'Mumbai, India', last: '2 hours ago',current: false },
    { device: 'Chrome on Windows', location: 'Delhi, India',  last: '3 days ago', current: false },
  ]

  const pwInput = (field: 'current' | 'next', showState: boolean, toggle: () => void) => (
    <div style={{ position: 'relative' }}>
      <input
        type={showState ? 'text' : 'password'}
        value={pw[field === 'current' ? 'current' : 'next']}
        onChange={e => set(field === 'current' ? 'current' : 'next')(e.target.value)}
        placeholder={field === 'current' ? '••••••••' : 'Min. 8 characters'}
        style={{
          width: '100%', background: RAISE, borderRadius: 10,
          border: `1px solid ${pw[field === 'current' ? 'current' : 'next'] && field === 'next'
            ? (pwStrong ? `${GREEN}50` : `${AMBER}50`) : EDGE}`,
          padding: '10px 40px 10px 14px', fontSize: 13, color: '#e2e8f0',
          outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box',
        }}
      />
      <button onClick={toggle} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#334155' }}>
        {showState ? <EyeOff style={{ width: 14, height: 14 }} /> : <Eye style={{ width: 14, height: 14 }} />}
      </button>
    </div>
  )

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <Section title="Change Password" description="Use a strong, unique password for your account.">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 440 }}>
          {banner && <Banner type={banner.type} message={banner.message} />}

          <div>
            <label style={{ display: 'block', fontSize: 10, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#334155', marginBottom: 8 }}>Current password</label>
            {pwInput('current', showCurrent, () => setShowCurrent(v => !v))}
          </div>

          <div>
            <label style={{ display: 'block', fontSize: 10, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#334155', marginBottom: 8 }}>New password</label>
            {pwInput('next', showNext, () => setShowNext(v => !v))}
            {pw.next && (
              <div style={{ display: 'flex', gap: 4, marginTop: 8 }}>
                {[2, 4, 8, 12].map(threshold => (
                  <div key={threshold} style={{ flex: 1, height: 3, borderRadius: 99, background: pw.next.length >= threshold ? (pw.next.length >= 12 ? GREEN : AMBER) : EDGE, transition: `background 0.2s` }} />
                ))}
              </div>
            )}
          </div>

          <div>
            <label style={{ display: 'block', fontSize: 10, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#334155', marginBottom: 8 }}>Confirm new password</label>
            <input
              type="password" value={pw.confirm} onChange={e => set('confirm')(e.target.value)}
              placeholder="Re-enter new password"
              style={{ width: '100%', background: RAISE, border: `1px solid ${pw.confirm ? (pwMatch ? `${GREEN}50` : `${RED}50`) : EDGE}`, borderRadius: 10, padding: '10px 14px', fontSize: 13, color: '#e2e8f0', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }}
            />
            {pw.confirm && !pwMatch && <p style={{ fontSize: 11, color: RED, margin: '5px 0 0' }}>Passwords do not match.</p>}
          </div>

          <div>
            <button
              disabled={!canSubmit || isPending}
              onClick={() => mutate()}
              style={{
                padding: '10px 20px', borderRadius: 10, border: 'none',
                background: canSubmit ? BLUE : RAISE,
                border: `1px solid ${canSubmit ? 'transparent' : EDGE}`,
                color: canSubmit ? '#fff' : '#334155',
                fontSize: 13, fontWeight: 600,
                cursor: canSubmit && !isPending ? 'pointer' : 'not-allowed',
                boxShadow: canSubmit ? `0 4px 14px ${BLUE}40` : 'none',
              }}
            >
              {isPending ? 'Changing…' : 'Change password'}
            </button>
          </div>
        </div>
      </Section>

      <Section title="Two-Factor Authentication" description="Add a second layer of security to your account.">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ width: 40, height: 40, borderRadius: 12, flexShrink: 0, background: twoFa ? `${GREEN}14` : RAISE, border: `1px solid ${twoFa ? `${GREEN}25` : EDGE}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Smartphone style={{ width: 16, height: 16, color: twoFa ? GREEN : '#475569' }} />
            </div>
            <div>
              <p style={{ fontSize: 13, fontWeight: 600, color: '#f1f5f9', margin: 0 }}>Authenticator App</p>
              <p style={{ fontSize: 11, color: '#475569', margin: '3px 0 0' }}>
                {twoFa ? '2FA is enabled.' : 'Use Google Authenticator or Authy.'}
              </p>
            </div>
          </div>
          <Toggle on={twoFa} onChange={setTwoFa} />
        </div>
      </Section>

      <Section title="Active Sessions" description="Devices currently signed into your account.">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {SESSIONS.map((s, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '12px 14px', borderRadius: 12, background: RAISE, border: `1px solid ${s.current ? `${GREEN}25` : EDGE}` }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', flexShrink: 0, background: s.current ? GREEN : '#334155', boxShadow: s.current ? `0 0 8px ${GREEN}60` : 'none' }} />
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 12, fontWeight: 600, color: '#e2e8f0', margin: 0 }}>
                  {s.device}
                  {s.current && <span style={{ marginLeft: 8, fontSize: 9, fontWeight: 700, color: GREEN, background: `${GREEN}14`, border: `1px solid ${GREEN}25`, padding: '2px 6px', borderRadius: 999, textTransform: 'uppercase' }}>Current</span>}
                </p>
                <p style={{ fontSize: 11, color: '#475569', margin: '2px 0 0' }}>{s.location} · {s.last}</p>
              </div>
              {!s.current && (
                <button style={{ fontSize: 11, fontWeight: 600, padding: '4px 10px', borderRadius: 8, background: `${RED}0a`, border: `1px solid ${RED}20`, color: RED, cursor: 'pointer' }}>
                  Revoke
                </button>
              )}
            </div>
          ))}
        </div>
      </Section>
    </div>
  )
}

// ── PREFERENCES TAB ───────────────────────────────────────────────────────────

const PREF_DEFAULT = { timezone: 'Asia/Kolkata', dateFormat: 'DD/MM/YYYY', language: 'en', currency: 'INR', compact: false, animations: true }

function PreferencesTab() {
  const [prefs, setPrefs] = useState(() => lsGet('kangqore_client_prefs', PREF_DEFAULT))
  const [saved, setSaved] = useState(false)
  const set = (k: keyof typeof PREF_DEFAULT, v: string | boolean) => { setPrefs(p => ({ ...p, [k]: v })); setSaved(false) }

  const save = () => { lsSet('kangqore_client_prefs', prefs); setSaved(true); setTimeout(() => setSaved(false), 2500) }

  const selectCss: React.CSSProperties = {
    width: '100%', background: RAISE, border: `1px solid ${EDGE}`,
    borderRadius: 10, padding: '10px 14px', fontSize: 13, color: '#e2e8f0',
    outline: 'none', appearance: 'none', cursor: 'pointer', fontFamily: 'inherit', boxSizing: 'border-box',
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <Section title="Regional Settings" description="Set your timezone, date format, and language.">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
          {([
            ['Timezone',         'timezone',   [['Asia/Kolkata','India Standard Time (IST)'],['UTC','UTC'],['America/New_York','Eastern Time (ET)'],['Europe/London','GMT / BST'],['Asia/Dubai','Gulf Standard Time (GST)'],['Asia/Singapore','Singapore Time (SGT)']]],
            ['Date format',      'dateFormat', [['DD/MM/YYYY','DD/MM/YYYY'],['MM/DD/YYYY','MM/DD/YYYY'],['YYYY-MM-DD','YYYY-MM-DD'],['D MMM YYYY','D MMM YYYY']]],
            ['Language',         'language',   [['en','English'],['hi','Hindi'],['ar','Arabic'],['fr','French']]],
            ['Currency display', 'currency',   [['INR','₹ Indian Rupee (INR)'],['USD','$ US Dollar (USD)'],['GBP','£ British Pound (GBP)'],['AED','AED Dirham (AED)']]],
          ] as [string, keyof typeof PREF_DEFAULT, [string, string][]][]).map(([label, key, opts]) => (
            <div key={key}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 10, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#334155', marginBottom: 8 }}>
                {key === 'timezone' && <Clock style={{ width: 10, height: 10 }} />}
                {key === 'language' && <Globe style={{ width: 10, height: 10 }} />}
                {label}
              </label>
              <select value={String(prefs[key])} onChange={e => set(key, e.target.value)} style={selectCss}>
                {opts.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
              </select>
            </div>
          ))}
        </div>
        <SaveBtn onClick={save} saved={saved} />
      </Section>

      <Section title="Display" description="Customize the portal's visual behaviour.">
        {([
          ['compact',    'Compact view',  'Reduce spacing for a denser information layout.'],
          ['animations', 'Animations',    'Enable entrance animations and transitions.'],
        ] as [keyof typeof PREF_DEFAULT, string, string][]).map(([key, label, desc]) => (
          <NotifRow key={key} label={label} description={desc}
            on={!!prefs[key]} onChange={v => set(key, v)} />
        ))}
      </Section>
    </div>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────

export function ClientSettings() {
  const [tab, setTab] = useState<'profile' | 'notifications' | 'security' | 'preferences'>('profile')
  useEffect(() => { ensureKf() }, [])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div style={anim(0)}>
        <h2 style={{ fontSize: 20, fontWeight: 700, color: '#f1f5f9', margin: 0 }}>Settings</h2>
        <p style={{ fontSize: 13, color: '#475569', margin: '6px 0 0' }}>Manage your profile, notifications, and account preferences.</p>
      </div>

      {/* Tab bar */}
      <div style={{ ...anim(40), display: 'flex', gap: 4, padding: 4, borderRadius: 14, background: CARD, border: `1px solid ${EDGE}`, width: 'fit-content' }}>
        {TABS.map(t => {
          const active = tab === t.id
          return (
            <button key={t.id} onClick={() => setTab(t.id as typeof tab)} style={{
              display: 'flex', alignItems: 'center', gap: 7, padding: '8px 16px', borderRadius: 10, border: 'none',
              background: active ? RAISE : 'transparent', color: active ? '#f1f5f9' : '#475569',
              fontSize: 13, fontWeight: active ? 600 : 500, cursor: 'pointer',
              boxShadow: active ? `inset 0 1px 0 rgba(10,15,30,0.5), 0 1px 3px rgba(0,0,0,0.3)` : 'none',
              borderBottom: `2px solid ${active ? BLUE : 'transparent'}`,
              transition: `all 0.2s ${EASE}`,
            }}>
              <t.Icon style={{ width: 13, height: 13 }} />
              {t.label}
            </button>
          )
        })}
      </div>

      <div style={anim(80)}>
        {tab === 'profile'       && <ProfileTab />}
        {tab === 'notifications' && <NotificationsTab />}
        {tab === 'security'      && <SecurityTab />}
        {tab === 'preferences'   && <PreferencesTab />}
      </div>
    </div>
  )
}
