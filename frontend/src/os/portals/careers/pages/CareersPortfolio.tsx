import { useState, useEffect } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { GitBranch, Link2, Globe, FileText, Plus, ExternalLink, Check, Trash2 } from 'lucide-react'
import { Card } from '@design-system/components/Card'
import { Button } from '@design-system/components/Button'
import { Input } from '@design-system/components/Input'
import { Textarea } from '@design-system/components/Textarea'
import { Badge } from '@design-system/components/Badge'
import { Spinner } from '@design-system/components/Spinner'
import { api } from '@lib/api'

// ─── types ────────────────────────────────────────────────────────────────────

interface WorkSample {
  id:    string
  title: string
  url:   string
  type:  string
  tags:  string[]
}

interface PortfolioForm {
  headline:     string
  summary:      string
  cvUrl:        string
  linkedinUrl:  string
  githubUrl:    string
  portfolioUrl: string
}

const EMPTY: PortfolioForm = {
  headline: '', summary: '', cvUrl: '', linkedinUrl: '', githubUrl: '', portfolioUrl: '',
}

const DEMO_SAMPLES: WorkSample[] = [
  { id: 'ws1', title: 'Distributed payment orchestration engine',  tags: ['Node.js', 'PostgreSQL', 'Redis'], url: 'https://github.com/example/payment-engine', type: 'OSS'     },
  { id: 'ws2', title: 'Real-time analytics pipeline — case study', tags: ['Kafka', 'ClickHouse', 'Go'],     url: 'https://example.dev/case-study',            type: 'Article' },
]

// ─── helpers ──────────────────────────────────────────────────────────────────

function LinkField({ icon, label, value, onChange, placeholder }: {
  icon: React.ReactNode; label: string; value: string
  onChange: (v: string) => void; placeholder: string
}) {
  return (
    <div>
      <label className="block text-xs font-semibold text-slate-500 mb-1.5 flex items-center gap-1.5">
        {icon} {label}
      </label>
      <Input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} />
    </div>
  )
}

// ─── page ─────────────────────────────────────────────────────────────────────

export function CareersPortfolio() {
  const queryClient = useQueryClient()
  const [form, setForm]         = useState<PortfolioForm>(EMPTY)
  const [samples, setSamples]   = useState<WorkSample[]>([])
  const [addTitle, setAddTitle] = useState('')
  const [addUrl, setAddUrl]     = useState('')
  const [dirty, setDirty]       = useState(false)
  const [saved, setSaved]       = useState(false)

  const set = (k: keyof PortfolioForm, v: string) => { setForm(f => ({ ...f, [k]: v })); setDirty(true); setSaved(false) }

  // ── load profile ─────────────────────────────────────────────────────────
  const { data: profile, isLoading } = useQuery({
    queryKey: ['profile', 'me'],
    queryFn: () => api.get('/profile/me').then(r => r.data),
    staleTime: 1000 * 60 * 5,
  })

  useEffect(() => {
    if (!profile) return
    const p = profile.portfolio ?? {}
    setForm({
      headline:     p.headline     ?? profile.profession ?? '',
      summary:      p.summary      ?? profile.purpose    ?? '',
      cvUrl:        p.cvUrl        ?? '',
      linkedinUrl:  p.linkedinUrl  ?? profile.linkedin   ?? '',
      githubUrl:    p.githubUrl    ?? profile.github     ?? '',
      portfolioUrl: p.portfolioUrl ?? '',
    })
    setSamples(p.workSamples ?? DEMO_SAMPLES)
    setDirty(false)
  }, [profile])

  // ── save ─────────────────────────────────────────────────────────────────
  const { mutate: saveProfile, isPending } = useMutation({
    mutationFn: () => api.patch('/profile', {
      linkedin:  form.linkedinUrl,
      github:    form.githubUrl,
      portfolio: {
        headline:     form.headline,
        summary:      form.summary,
        cvUrl:        form.cvUrl,
        linkedinUrl:  form.linkedinUrl,
        githubUrl:    form.githubUrl,
        portfolioUrl: form.portfolioUrl,
        workSamples:  samples,
      },
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile', 'me'] })
      setSaved(true)
      setDirty(false)
      setTimeout(() => setSaved(false), 3000)
    },
  })

  // ── work samples ─────────────────────────────────────────────────────────
  function addSample() {
    if (!addTitle.trim() || !addUrl.trim()) return
    setSamples(s => [...s, { id: `ws-${Date.now()}`, title: addTitle.trim(), url: addUrl.trim(), type: 'Link', tags: [] }])
    setAddTitle('')
    setAddUrl('')
    setDirty(true)
  }

  function removeSample(id: string) {
    setSamples(s => s.filter(x => x.id !== id))
    setDirty(true)
  }

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 text-sm text-slate-500 py-10">
        <Spinner size="sm" /> Loading your portfolio…
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-white">Portfolio</h2>
          <p className="text-sm text-slate-500 mt-0.5">Your profile visible to the hiring team</p>
        </div>
        <Button
          variant={saved ? 'secondary' : 'primary'}
          size="sm"
          loading={isPending}
          leftIcon={saved ? <Check className="w-4 h-4" /> : undefined}
          onClick={() => saveProfile()}
          disabled={!dirty && !saved}
        >
          {saved ? 'Saved!' : 'Save profile'}
        </Button>
      </div>

      {/* Profile */}
      <Card>
        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Profile</p>
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1.5">Headline</label>
            <Input value={form.headline} onChange={e => set('headline', e.target.value)} placeholder="e.g. Senior Backend Engineer · Node.js, Go" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1.5">Personal statement</label>
            <Textarea value={form.summary} onChange={e => set('summary', e.target.value)} rows={4} placeholder="Tell the hiring team about yourself…" />
          </div>
        </div>
      </Card>

      {/* Links */}
      <Card>
        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Links</p>
        <div className="space-y-3">
          <LinkField icon={<FileText className="w-3.5 h-3.5" />} label="CV / Resume"   value={form.cvUrl}        onChange={v => set('cvUrl', v)}        placeholder="https://drive.google.com/…" />
          <LinkField icon={<Link2    className="w-3.5 h-3.5" />} label="LinkedIn"      value={form.linkedinUrl}  onChange={v => set('linkedinUrl', v)}  placeholder="https://linkedin.com/in/…" />
          <LinkField icon={<GitBranch className="w-3.5 h-3.5" />} label="GitHub"       value={form.githubUrl}    onChange={v => set('githubUrl', v)}    placeholder="https://github.com/…" />
          <LinkField icon={<Globe    className="w-3.5 h-3.5" />} label="Portfolio site" value={form.portfolioUrl} onChange={v => set('portfolioUrl', v)} placeholder="https://yoursite.com" />
        </div>
        {[
          { url: form.linkedinUrl,  icon: <Link2     className="w-4 h-4" />, label: 'LinkedIn'  },
          { url: form.githubUrl,    icon: <GitBranch className="w-4 h-4" />, label: 'GitHub'    },
          { url: form.portfolioUrl, icon: <Globe     className="w-4 h-4" />, label: 'Portfolio' },
          { url: form.cvUrl,        icon: <FileText  className="w-4 h-4" />, label: 'CV'        },
        ].filter(l => l.url).length > 0 && (
          <div className="flex items-center gap-4 mt-4 pt-4 border-t border-white/10 border-t-white/20 flex-wrap">
            {[
              { url: form.linkedinUrl,  icon: <Link2     className="w-4 h-4" />, label: 'LinkedIn'  },
              { url: form.githubUrl,    icon: <GitBranch className="w-4 h-4" />, label: 'GitHub'    },
              { url: form.portfolioUrl, icon: <Globe     className="w-4 h-4" />, label: 'Portfolio' },
              { url: form.cvUrl,        icon: <FileText  className="w-4 h-4" />, label: 'CV'        },
            ].filter(l => l.url).map(l => (
              <a key={l.label} href={l.url} target="_blank" rel="noreferrer"
                className="flex items-center gap-1.5 text-xs text-blue-600 hover:underline">
                {l.icon} {l.label} <ExternalLink className="w-3 h-3" />
              </a>
            ))}
          </div>
        )}
      </Card>

      {/* Work samples */}
      <Card>
        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Work samples</p>
        <div className="space-y-3 mb-4">
          {samples.map(s => (
            <div key={s.id} className="flex items-start gap-3 p-3 bg-slate-900 rounded-xl group">
              <div className="flex-1 min-w-0">
                <a href={s.url} target="_blank" rel="noreferrer"
                  className="text-sm font-medium text-slate-200 hover:text-blue-600 hover:underline flex items-center gap-1">
                  {s.title} <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100" />
                </a>
                <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                  <Badge variant="neutral" size="sm">{s.type}</Badge>
                  {s.tags.map(t => <Badge key={t} variant="info" size="sm">{t}</Badge>)}
                </div>
              </div>
              <button
                onClick={() => removeSample(s.id)}
                className="opacity-0 group-hover:opacity-100 p-1 rounded-lg hover:bg-slate-200 text-slate-500 hover:text-red-500 transition-all"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
          {samples.length === 0 && (
            <p className="text-sm text-slate-500 text-center py-4">No work samples yet — add one below.</p>
          )}
        </div>

        <div className="border-t border-white/10 border-t-white/20 pt-4 space-y-2">
          <p className="text-xs font-semibold text-slate-500 mb-2">Add a work sample</p>
          <Input value={addTitle} onChange={e => setAddTitle(e.target.value)} placeholder="Project or article title" />
          <Input value={addUrl}   onChange={e => setAddUrl(e.target.value)}   placeholder="URL" />
          <Button
            variant="secondary" size="sm"
            leftIcon={<Plus className="w-3.5 h-3.5" />}
            disabled={!addTitle.trim() || !addUrl.trim()}
            onClick={addSample}
          >
            Add sample
          </Button>
        </div>
      </Card>
    </div>
  )
}
