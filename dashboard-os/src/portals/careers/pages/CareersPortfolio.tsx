import { useState } from 'react'
import { Github, Linkedin, Globe, FileText, Plus, ExternalLink, Check } from 'lucide-react'
import { Card } from '@design-system/components/Card'
import { Button } from '@design-system/components/Button'
import { Input } from '@design-system/components/Input'
import { Textarea } from '@design-system/components/Textarea'
import { Badge } from '@design-system/components/Badge'

// Mock initial profile state
const INITIAL = {
  headline:      'Senior Backend Engineer · Node.js, PostgreSQL, distributed systems',
  summary:       'I build reliable, scalable backend systems. 8 years experience across fintech, healthtech and SaaS. Led the backend rebuild of a platform processing £40M/month at my last company.',
  cvUrl:         'https://drive.google.com/file/d/example',
  linkedinUrl:   'https://linkedin.com/in/priya-chatterjee',
  githubUrl:     'https://github.com/priya-dev',
  portfolioUrl:  '',
}

const WORK_SAMPLES = [
  { id: 'ws1', title: 'Distributed payment orchestration engine',   tags: ['Node.js', 'PostgreSQL', 'Redis'], url: 'https://github.com/priya-dev/payment-engine',  type: 'OSS'       },
  { id: 'ws2', title: 'Real-time analytics pipeline — case study',  tags: ['Kafka', 'ClickHouse', 'Go'],      url: 'https://priya.dev/case-study-analytics',        type: 'Article'   },
  { id: 'ws3', title: 'API design handbook (team resource)',         tags: ['REST', 'OpenAPI', 'GraphQL'],     url: 'https://github.com/priya-dev/api-handbook',     type: 'GitHub'    },
]

function LinkField({
  icon, label, value, onChange, placeholder,
}: {
  icon: React.ReactNode; label: string; value: string; onChange: (v: string) => void; placeholder: string
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

export function CareersPortfolio() {
  const [form, setForm]     = useState(INITIAL)
  const [saved, setSaved]   = useState(false)
  const [addUrl, setAddUrl] = useState('')
  const [addTitle, setAddTitle] = useState('')

  const set = (k: keyof typeof form, v: string) => { setForm(f => ({ ...f, [k]: v })); setSaved(false) }

  function save() {
    // POST to /api/profile or similar — no endpoint exists yet, just show saved state
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Portfolio</h2>
          <p className="text-sm text-slate-500 mt-0.5">Your profile visible to the hiring team</p>
        </div>
        <Button
          variant={saved ? 'secondary' : 'primary'}
          size="sm"
          leftIcon={saved ? <Check className="w-4 h-4" /> : undefined}
          onClick={save}
        >
          {saved ? 'Saved!' : 'Save profile'}
        </Button>
      </div>

      {/* Profile */}
      <Card>
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Profile</p>
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
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Links</p>
        <div className="space-y-3">
          <LinkField icon={<FileText className="w-3.5 h-3.5" />}  label="CV / Resume"   value={form.cvUrl}        onChange={v => set('cvUrl', v)}        placeholder="https://drive.google.com/…" />
          <LinkField icon={<Linkedin className="w-3.5 h-3.5" />}  label="LinkedIn"      value={form.linkedinUrl}  onChange={v => set('linkedinUrl', v)}  placeholder="https://linkedin.com/in/…" />
          <LinkField icon={<Github   className="w-3.5 h-3.5" />}  label="GitHub"        value={form.githubUrl}    onChange={v => set('githubUrl', v)}    placeholder="https://github.com/…" />
          <LinkField icon={<Globe    className="w-3.5 h-3.5" />}  label="Portfolio site" value={form.portfolioUrl} onChange={v => set('portfolioUrl', v)} placeholder="https://yoursite.com" />
        </div>
        <div className="flex items-center gap-4 mt-4 pt-4 border-t border-slate-100 flex-wrap">
          {[
            { url: form.linkedinUrl,  icon: <Linkedin className="w-4 h-4" />, label: 'LinkedIn'  },
            { url: form.githubUrl,    icon: <Github   className="w-4 h-4" />, label: 'GitHub'    },
            { url: form.portfolioUrl, icon: <Globe    className="w-4 h-4" />, label: 'Portfolio' },
            { url: form.cvUrl,        icon: <FileText className="w-4 h-4" />, label: 'CV'        },
          ].filter(l => l.url).map(l => (
            <a key={l.label} href={l.url} target="_blank" rel="noreferrer"
              className="flex items-center gap-1.5 text-xs text-blue-600 hover:underline">
              {l.icon} {l.label} <ExternalLink className="w-3 h-3" />
            </a>
          ))}
        </div>
      </Card>

      {/* Work samples */}
      <Card>
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Work samples</p>
        <div className="space-y-3 mb-4">
          {WORK_SAMPLES.map(s => (
            <div key={s.id} className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl group">
              <div className="flex-1 min-w-0">
                <a href={s.url} target="_blank" rel="noreferrer"
                  className="text-sm font-medium text-slate-800 hover:text-blue-600 hover:underline flex items-center gap-1">
                  {s.title} <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100" />
                </a>
                <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                  <Badge variant="neutral" size="sm">{s.type}</Badge>
                  {s.tags.map(t => <Badge key={t} variant="info" size="sm">{t}</Badge>)}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Add new sample */}
        <div className="border-t border-slate-100 pt-4 space-y-2">
          <p className="text-xs font-semibold text-slate-400 mb-2">Add a work sample</p>
          <Input value={addTitle} onChange={e => setAddTitle(e.target.value)} placeholder="Project or article title" />
          <Input value={addUrl}   onChange={e => setAddUrl(e.target.value)}   placeholder="URL" />
          <Button
            variant="secondary"
            size="sm"
            leftIcon={<Plus className="w-3.5 h-3.5" />}
            disabled={!addTitle.trim() || !addUrl.trim()}
            onClick={() => { setAddTitle(''); setAddUrl('') }}
          >
            Add sample
          </Button>
        </div>
      </Card>
    </div>
  )
}
