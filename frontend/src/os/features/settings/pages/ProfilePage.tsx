import { useState, useEffect } from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'
import {
  User, Lock, Building2, Linkedin, Github, Twitter,
  CheckCircle2, AlertCircle, Eye, EyeOff, Phone,
  Calendar, Shield, LogOut, Loader2, Camera,
} from 'lucide-react'
import { useAuthStore } from '@store/auth'
import { useUIStore } from '@store/ui'
import { api, isDemo } from '@lib/api'

// ── Types ──────────────────────────────────────────────────────────────────────

interface FullProfile {
  id: string
  name: string
  email: string
  role: string
  company?: string
  phone?: string
  linkedin?: string
  github?: string
  twitter?: string
  avatarUrl?: string
  status?: string
  createdAt?: string
}

// ── Helpers ────────────────────────────────────────────────────────────────────

function initials(name: string) {
  return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
}

function memberSince(iso?: string) {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })
}

function passwordStrength(pw: string): { score: number; label: string; color: string } {
  if (!pw) return { score: 0, label: '', color: 'var(--os-surface-0)' }
  let score = 0
  if (pw.length >= 8)  score++
  if (pw.length >= 12) score++
  if (/[A-Z]/.test(pw)) score++
  if (/[0-9]/.test(pw)) score++
  if (/[^A-Za-z0-9]/.test(pw)) score++
  if (score <= 1) return { score,  label: 'Weak',   color: '#e2445c' }
  if (score <= 2) return { score,  label: 'Fair',   color: '#fdab3d' }
  if (score <= 3) return { score,  label: 'Good',   color: '#0073ea' }
  return             { score,  label: 'Strong', color: '#00c875' }
}

// ── Input field ────────────────────────────────────────────────────────────────

function Field({
  label, value, onChange, placeholder = '', type = 'text', icon: Icon, readOnly = false,
}: {
  label: string; value: string; onChange?: (v: string) => void
  placeholder?: string; type?: string; icon?: React.FC<{ className?: string }>
  readOnly?: boolean
}) {
  const [focused, setFocused] = useState(false)
  const [show, setShow]       = useState(false)
  const isPassword = type === 'password'

  return (
    <div>
      <label className="text-[11px] font-bold text-[var(--os-text-2)] uppercase tracking-wider block mb-1.5">{label}</label>
      <div className="relative">
        {Icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
            <Icon className="w-3.5 h-3.5 text-[var(--os-text-2)]" />
          </div>
        )}
        <input
          type={isPassword && !show ? 'password' : 'text'}
          value={value}
          onChange={e => onChange?.(e.target.value)}
          placeholder={placeholder}
          readOnly={readOnly}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className="w-full h-10 rounded-2xl text-sm outline-none transition-all"
          style={{
            background: readOnly ? 'var(--os-surface-0)' : 'var(--os-card)',
            border: `1px solid ${focused ? 'rgba(37,100,234,0.5)' : 'var(--os-border)'}`,
            paddingLeft:  Icon ? '2.25rem' : '0.875rem',
            paddingRight: isPassword ? '2.5rem' : '0.875rem',
            color: readOnly ? 'var(--os-text-2)' : 'var(--os-text-1)',
            cursor: readOnly ? 'not-allowed' : 'text',
          }}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShow(s => !s)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--os-text-2)] hover:text-[var(--os-text-1)] transition-colors"
          >
            {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        )}
      </div>
    </div>
  )
}

function StatusMsg({ status, ok, err }: { status: string; ok: string; err: string }) {
  if (status === 'ok')  return <p className="flex items-center gap-1.5 text-xs text-emerald-400"><CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" />{ok}</p>
  if (status === 'err') return <p className="flex items-center gap-1.5 text-xs text-red-400"><AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />{err}</p>
  return null
}

function SaveBtn({ onClick, loading, disabled, label = 'Save changes', demoLabel = 'Demo — read only' }: {
  onClick: () => void; loading: boolean; disabled: boolean; label?: string; demoLabel?: string
}) {
  const demo = isDemo()
  return (
    <button
      onClick={onClick}
      disabled={loading || disabled || demo}
      className="flex items-center gap-2 px-4 py-2 rounded-2xl text-sm font-semibold transition-all disabled:opacity-40"
      style={{ background: 'rgba(37,100,234,0.15)', border: '1px solid rgba(37,100,234,0.3)', color: '#2564ea' }}
    >
      {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
      {loading ? 'Saving…' : demo ? demoLabel : label}
    </button>
  )
}

function SectionCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-2xl p-6 space-y-5 bg-[var(--os-card)] border border-[var(--os-border)]">
      {children}
    </div>
  )
}

function SectionHeader({ icon: Icon, title, subtitle }: {
  icon: React.FC<{ className?: string }>; title: string; subtitle?: string
}) {
  return (
    <div className="flex items-start gap-3 pb-1 border-b border-[var(--os-border)]">
      <div className="w-8 h-8 rounded-2xl flex items-center justify-center flex-shrink-0 mt-0.5"
        style={{ background: 'rgba(124,58,237,0.12)', border: '1px solid rgba(124,58,237,0.2)' }}>
        <Icon className="w-4 h-4 text-purple-400" />
      </div>
      <div>
        <h3 className="text-sm font-bold text-os-1 leading-tight">{title}</h3>
        {subtitle && <p className="text-[11px] text-os-2 mt-0.5">{subtitle}</p>}
      </div>
    </div>
  )
}

// ── Main page ─────────────────────────────────────────────────────────────────

export function ProfilePage() {
  const { user, logout } = useAuthStore()
  const demo = isDemo()

  // Fetch full profile (includes linkedin, github, twitter, company, createdAt)
  const { data: profile, isLoading: profileLoading } = useQuery<FullProfile>({
    queryKey: ['auth-me-full'],
    queryFn: () => api.get('/auth/me').then(r => r.data.user),
    enabled: !demo,
    staleTime: 1000 * 60 * 5,
  })

  const live: FullProfile = profile ?? {
    id:      user?.id      ?? '',
    name:    user?.name    ?? '',
    email:   user?.email   ?? '',
    role:    user?.role    ?? 'ADMIN',
    company: user?.company ?? '',
  }

  // ── Personal details form ──────────────────────────────────────────────────
  const [pf, setPf] = useState({ name: '', company: '', phone: '' })
  const [pfStatus, setPfStatus] = useState<'idle' | 'ok' | 'err'>('idle')
  const [pfErr,    setPfErr]    = useState('')

  useEffect(() => {
    setPf({ name: live.name, company: live.company ?? '', phone: live.phone ?? '' })
  }, [live.name, live.company, live.phone])

  const { mutate: saveProfile, isPending: savingProfile } = useMutation({
    mutationFn: () => api.patch('/auth/profile', { name: pf.name, company: pf.company, phone: pf.phone }),
    onSuccess: res => {
      useAuthStore.setState(s => ({ user: s.user ? { ...s.user, name: res.data.user.name, company: res.data.user.company } : s.user }))
      setPfStatus('ok'); setTimeout(() => setPfStatus('idle'), 3000)
    },
    onError: (e: any) => { setPfErr(e?.response?.data?.error ?? 'Failed to save'); setPfStatus('err') },
  })

  const pfDirty = pf.name !== live.name || pf.company !== (live.company ?? '') || pf.phone !== (live.phone ?? '')

  // ── Social links form ──────────────────────────────────────────────────────
  const [social, setSocial] = useState({ linkedin: '', github: '', twitter: '' })
  const [socialStatus, setSocialStatus] = useState<'idle' | 'ok' | 'err'>('idle')
  const [socialErr,    setSocialErr]    = useState('')

  useEffect(() => {
    setSocial({ linkedin: live.linkedin ?? '', github: live.github ?? '', twitter: live.twitter ?? '' })
  }, [live.linkedin, live.github, live.twitter])

  const { mutate: saveSocial, isPending: savingSocial } = useMutation({
    mutationFn: () => api.patch('/auth/profile', social),
    onSuccess: () => { setSocialStatus('ok'); setTimeout(() => setSocialStatus('idle'), 3000) },
    onError: (e: any) => { setSocialErr(e?.response?.data?.error ?? 'Failed to save'); setSocialStatus('err') },
  })

  const socialDirty = social.linkedin !== (live.linkedin ?? '') || social.github !== (live.github ?? '') || social.twitter !== (live.twitter ?? '')

  // ── Password form ──────────────────────────────────────────────────────────
  const [pw, setPw]           = useState({ current: '', next: '', confirm: '' })
  const [pwStatus, setPwStatus] = useState<'idle' | 'ok' | 'err'>('idle')
  const [pwErr,    setPwErr]    = useState('')
  const strength = passwordStrength(pw.next)

  const { mutate: changePw, isPending: changingPw } = useMutation({
    mutationFn: () => api.post('/auth/change-password', { currentPassword: pw.current, newPassword: pw.next }),
    onSuccess: () => { setPw({ current: '', next: '', confirm: '' }); setPwStatus('ok'); setTimeout(() => setPwStatus('idle'), 4000) },
    onError: (e: any) => { setPwErr(e?.response?.data?.error ?? 'Failed to change password'); setPwStatus('err') },
  })

  const submitPw = () => {
    setPwErr(''); setPwStatus('idle')
    if (!pw.current) { setPwErr('Enter your current password'); setPwStatus('err'); return }
    if (pw.next.length < 8) { setPwErr('New password must be at least 8 characters'); setPwStatus('err'); return }
    if (pw.next !== pw.confirm) { setPwErr('Passwords do not match'); setPwStatus('err'); return }
    changePw()
  }

  const avatarInitials = initials(live.name || 'U')
  const roleLabel = live.role?.replace('_', ' ') ?? 'Admin'

  return (
    <div className="grid grid-cols-1 xl:grid-cols-[280px_1fr] gap-6">

      {/* ── Left column: identity card ──────────────────────────────────────── */}
      <div className="space-y-4">

        {/* Avatar card */}
        <div className="rounded-2xl p-6 flex flex-col items-center text-center space-y-4 bg-[var(--os-card)] border border-[var(--os-border)]">
          {profileLoading
            ? <div className="w-20 h-20 rounded-2xl animate-pulse bg-[var(--os-surface-0)]" />
            : (
              <div className="relative group cursor-pointer" title="Change profile photo">
                <div className="w-20 h-20 rounded-2xl flex items-center justify-center text-2xl font-bold tracking-tight text-white"
                  style={{ background: 'linear-gradient(135deg, #7c3aed, #2564ea)',
                           boxShadow: '0 0 24px rgba(124,58,237,0.3)' }}>
                  {avatarInitials}
                </div>
                <div className="absolute inset-0 rounded-2xl flex flex-col items-center justify-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                  style={{ background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(2px)' }}>
                  <Camera className="w-5 h-5 text-white" />
                  <span className="text-[10px] font-semibold text-white">Change</span>
                </div>
              </div>
            )
          }
          <div>
            <p className="text-base font-bold text-[var(--os-text-1)]">{live.name}</p>
            <p className="text-xs text-[var(--os-text-2)] mt-0.5 break-all">{live.email}</p>
          </div>
          <span className="text-[11px] font-bold px-3 py-1 rounded-full"
            style={{ color: '#7f53f9', background: 'rgba(127,83,249,0.12)', border: '1px solid rgba(127,83,249,0.25)' }}>
            {roleLabel}
          </span>
          {live.company && (
            <div className="flex items-center gap-1.5 text-xs text-[var(--os-text-2)]">
              <Building2 className="w-3.5 h-3.5 text-[var(--os-text-2)]" />
              {live.company}
            </div>
          )}
        </div>

        {/* Account meta */}
        <div className="rounded-2xl p-5 space-y-3.5 bg-[var(--os-card)] border border-[var(--os-border)]">
          <p className="text-[10px] font-bold text-[var(--os-text-2)] uppercase tracking-widest">Account Info</p>

          {[
            { icon: Calendar, label: 'Member since', value: memberSince(live.createdAt) },
            { icon: Shield,   label: 'Status',        value: live.status ?? 'Active' },
            { icon: User,     label: 'Account ID',    value: live.id?.slice(0, 8).toUpperCase() ?? '—' },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-[var(--os-text-2)]">
                <Icon className="w-3.5 h-3.5 text-[var(--os-text-2)]" />
                {label}
              </div>
              <span className="text-xs font-medium text-[var(--os-text-1)]">{value}</span>
            </div>
          ))}
        </div>

        {/* Social links (read-only summary) */}
        {(live.linkedin || live.github || live.twitter) && (
          <div className="rounded-2xl p-5 space-y-3 bg-[var(--os-card)] border border-[var(--os-border)]">
            <p className="text-[10px] font-bold text-[var(--os-text-2)] uppercase tracking-widest">Connected Profiles</p>
            {live.linkedin && (
              <a href={live.linkedin} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 text-xs text-[var(--os-text-2)] hover:text-[#0a66c2] transition-colors">
                <Linkedin className="w-3.5 h-3.5" /> LinkedIn
              </a>
            )}
            {live.github && (
              <a href={live.github} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 text-xs text-[var(--os-text-2)] hover:text-[var(--os-text-1)] transition-colors">
                <Github className="w-3.5 h-3.5" /> GitHub
              </a>
            )}
            {live.twitter && (
              <a href={live.twitter} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 text-xs text-[var(--os-text-2)] hover:text-[#1da1f2] transition-colors">
                <Twitter className="w-3.5 h-3.5" /> Twitter / X
              </a>
            )}
          </div>
        )}
      </div>

      {/* ── Right column: forms ─────────────────────────────────────────────── */}
      <div className="space-y-6">

        {/* Personal Details */}
        <SectionCard>
          <SectionHeader icon={User} title="Personal Details" subtitle="Your name, company, and contact number." />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Full Name" value={pf.name} onChange={v => { setPf(f => ({ ...f, name: v })); setPfStatus('idle') }}
              placeholder="Your full name" icon={User} />
            <Field label="Email address" value={live.email} readOnly placeholder="Email" icon={User} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Company / Organisation" value={pf.company} onChange={v => { setPf(f => ({ ...f, company: v })); setPfStatus('idle') }}
              placeholder="e.g. Kangqore" icon={Building2} />
            <Field label="Phone" value={pf.phone} onChange={v => { setPf(f => ({ ...f, phone: v })); setPfStatus('idle') }}
              placeholder="+44 7700 000000" icon={Phone} />
          </div>
          <div className="flex items-center gap-4">
            <SaveBtn onClick={() => saveProfile()} loading={savingProfile} disabled={!pfDirty || !pf.name.trim()} />
            <StatusMsg status={pfStatus} ok="Profile updated" err={pfErr} />
          </div>
        </SectionCard>

        {/* Social Links */}
        <SectionCard>
          <SectionHeader icon={Linkedin} title="Social & Professional Links"
            subtitle="Displayed on your profile card. Full URLs or handles accepted." />
          <div className="space-y-4">
            <Field label="LinkedIn" value={social.linkedin}
              onChange={v => { setSocial(s => ({ ...s, linkedin: v })); setSocialStatus('idle') }}
              placeholder="https://linkedin.com/in/yourname" icon={Linkedin} />
            <Field label="GitHub" value={social.github}
              onChange={v => { setSocial(s => ({ ...s, github: v })); setSocialStatus('idle') }}
              placeholder="https://github.com/yourname" icon={Github} />
            <Field label="Twitter / X" value={social.twitter}
              onChange={v => { setSocial(s => ({ ...s, twitter: v })); setSocialStatus('idle') }}
              placeholder="https://x.com/yourhandle" icon={Twitter} />
          </div>
          <div className="flex items-center gap-4">
            <SaveBtn onClick={() => saveSocial()} loading={savingSocial} disabled={!socialDirty} />
            <StatusMsg status={socialStatus} ok="Links saved" err={socialErr} />
          </div>
        </SectionCard>

        {/* Security */}
        <SectionCard>
          <SectionHeader icon={Lock} title="Change Password"
            subtitle="Use a strong password with a mix of letters, numbers, and symbols." />

          <Field label="Current Password" value={pw.current} type="password"
            onChange={v => { setPw(p => ({ ...p, current: v })); setPwStatus('idle') }}
            placeholder="Your current password" icon={Lock} />

          <div className="space-y-2">
            <Field label="New Password" value={pw.next} type="password"
              onChange={v => { setPw(p => ({ ...p, next: v })); setPwStatus('idle') }}
              placeholder="Min 8 characters" icon={Lock} />
            {pw.next && (
              <div className="space-y-1">
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map(i => (
                    <div key={i} className="flex-1 h-1 rounded-full transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
                      style={{ background: i <= strength.score ? strength.color : 'var(--os-border)' }} />
                  ))}
                </div>
                <p className="text-[11px] font-semibold" style={{ color: strength.color }}>{strength.label}</p>
              </div>
            )}
          </div>

          <Field label="Confirm New Password" value={pw.confirm} type="password"
            onChange={v => { setPw(p => ({ ...p, confirm: v })); setPwStatus('idle') }}
            placeholder="Repeat new password" icon={Lock} />

          {pw.confirm && pw.next && pw.confirm !== pw.next && (
            <p className="flex items-center gap-1.5 text-xs text-red-400">
              <AlertCircle className="w-3.5 h-3.5" /> Passwords don't match
            </p>
          )}

          <div className="flex items-center gap-4">
            <SaveBtn onClick={submitPw} loading={changingPw}
              disabled={!pw.current || !pw.next || !pw.confirm}
              label="Update password" />
            <StatusMsg status={pwStatus} ok="Password changed successfully" err={pwErr} />
          </div>
        </SectionCard>

        {/* UI Preferences */}
        <SectionCard>
          <SectionHeader icon={Eye} title="UI Preferences"
            subtitle="Customize the interface to suit your workflow." />
          
          <div className="flex items-center justify-between py-2">
            <div>
              <p className="text-[13px] font-semibold text-os-1 mb-0.5">Auto-hide Topbar</p>
              <p className="text-[11px] text-os-2">Hide the top bar globally when the mouse leaves the top edge of the screen.</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer flex-shrink-0 ml-4">
              <input type="checkbox" className="sr-only peer"
                checked={useUIStore(s => s.autoHideTopbar)}
                onChange={(e) => useUIStore.getState().setAutoHideTopbar(e.target.checked)}
              />
              <div className="w-9 h-5 bg-[var(--os-border)] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#2564ea]"></div>
            </label>
          </div>
        </SectionCard>

        {/* Session / Danger */}
        <SectionCard>
          <SectionHeader icon={Shield} title="Session & Security"
            subtitle="Sign out from this device or all active sessions." />
          <div className="flex flex-wrap gap-3">
            <button
              onClick={logout}
              className="flex items-center gap-2 px-4 py-2 rounded-2xl text-sm font-semibold transition-all"
              style={{ color: '#e2445c', background: 'rgba(226,68,92,0.08)', border: '1px solid rgba(226,68,92,0.2)' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(226,68,92,0.15)' }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(226,68,92,0.08)' }}
            >
              <LogOut className="w-3.5 h-3.5" />
              Sign out
            </button>
            <button
              onClick={async () => {
                try { await api.post('/auth/logout-all') } catch { /* best-effort */ }
                logout()
              }}
              className="flex items-center gap-2 px-4 py-2 rounded-2xl text-sm font-semibold transition-all"
              style={{ color: '#e2445c', background: 'rgba(226,68,92,0.08)', border: '1px solid rgba(226,68,92,0.2)' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(226,68,92,0.15)' }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(226,68,92,0.08)' }}
            >
              <Shield className="w-3.5 h-3.5" />
              Sign out all devices
            </button>
          </div>
          {demo && (
            <p className="text-[11px] text-amber-500 mt-1">Demo session — sign out navigates to login.</p>
          )}
        </SectionCard>

      </div>
    </div>
  )
}
