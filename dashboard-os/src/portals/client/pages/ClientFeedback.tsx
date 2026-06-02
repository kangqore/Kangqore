import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Send, CheckCircle2 } from 'lucide-react'
import { Card } from '@design-system/components/Card'
import { Badge } from '@design-system/components/Badge'
import { Button } from '@design-system/components/Button'
import { Textarea } from '@design-system/components/Textarea'
import { api, isDemo } from '@lib/api'
import { useClientFeedback } from '../useClientData'

// ─── mock ─────────────────────────────────────────────────────────────────────

const MOCK_FEEDBACK = [
  {
    id: 'fb1', npsScore: 9, comment: 'The team has been incredibly responsive and the delivery quality has been excellent. The HIPAA compliance work was particularly thorough.',
    project: { title: 'HIPAA Compliance Layer' }, createdAt: '2026-05-20T10:00:00Z',
  },
  {
    id: 'fb2', npsScore: 7, comment: 'Good progress overall. Would appreciate more frequent status updates — sometimes we are left guessing on milestone timing.',
    project: { title: 'Patient Portal v2' }, createdAt: '2026-04-15T09:00:00Z',
  },
]

const PROJECTS_FOR_FEEDBACK = [
  { id: 'pj1', title: 'Patient Portal v2' },
  { id: 'pj5', title: 'Analytics Dashboard' },
]

// ─── helpers ──────────────────────────────────────────────────────────────────

function npsLabel(score: number) {
  if (score >= 9) return { label: 'Promoter',  color: 'text-green-600',  bg: 'bg-green-50'  }
  if (score >= 7) return { label: 'Passive',   color: 'text-amber-600',  bg: 'bg-amber-50'  }
  return               { label: 'Detractor', color: 'text-red-600',    bg: 'bg-red-50'    }
}

function NpsButton({ score, selected, onSelect }: { score: number; selected: boolean; onSelect: () => void }) {
  const { color, bg } = npsLabel(score)
  return (
    <button
      onClick={onSelect}
      className={`w-9 h-9 rounded-xl text-sm font-bold border-2 transition-all ${
        selected
          ? `${bg} ${color} border-current scale-110 shadow-sm`
          : 'bg-white border-slate-200 text-slate-400 hover:border-slate-300'
      }`}
    >
      {score}
    </button>
  )
}

const fmtDate = (s: string) => new Date(s).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })

// ─── page ─────────────────────────────────────────────────────────────────────

export function ClientFeedback() {
  const { data }   = useClientFeedback()
  const feedbacks  = (data as typeof MOCK_FEEDBACK | undefined)?.length ? data as typeof MOCK_FEEDBACK : MOCK_FEEDBACK
  const queryClient = useQueryClient()

  const [nps,        setNps]        = useState<number | null>(null)
  const [comment,    setComment]    = useState('')
  const [projectId,  setProjectId]  = useState(PROJECTS_FOR_FEEDBACK[0].id)
  const [submitted,  setSubmitted]  = useState(false)

  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      if (!isDemo()) await api.post('/feedback', { projectId, npsScore: nps, comment })
    },
    onSuccess: () => {
      setSubmitted(true)
      queryClient.invalidateQueries({ queryKey: ['client', 'feedback'] })
    },
  })

  const avgNps = feedbacks.length
    ? Math.round(feedbacks.reduce((s, f) => s + f.npsScore, 0) / feedbacks.length * 10) / 10
    : null

  return (
    <div className="space-y-8 max-w-2xl">
      <div>
        <h2 className="text-xl font-bold text-slate-900">Feedback</h2>
        <p className="text-sm text-slate-500 mt-0.5">Your satisfaction matters — share how we're doing</p>
      </div>

      {/* Current NPS summary */}
      {avgNps !== null && (
        <Card>
          <div className="flex items-center gap-4">
            <div className="text-center">
              <div className={`text-4xl font-bold ${npsLabel(Math.round(avgNps)).color}`}>{avgNps}</div>
              <div className="text-xs text-slate-400 mt-0.5">Your NPS</div>
            </div>
            <div className="h-12 w-px bg-slate-100" />
            <div>
              <Badge variant={avgNps >= 9 ? 'success' : avgNps >= 7 ? 'warning' : 'danger'} size="md">
                {npsLabel(Math.round(avgNps)).label}
              </Badge>
              <p className="text-xs text-slate-500 mt-1">Based on {feedbacks.length} feedback submission{feedbacks.length !== 1 ? 's' : ''}</p>
            </div>
          </div>
        </Card>
      )}

      {/* Submit new feedback */}
      {submitted ? (
        <Card className="text-center py-8">
          <CheckCircle2 className="w-10 h-10 text-green-500 mx-auto mb-3" />
          <p className="text-lg font-semibold text-slate-800">Thank you for your feedback!</p>
          <p className="text-sm text-slate-500 mt-1">We read every response and use it to improve.</p>
          <Button variant="secondary" size="sm" className="mt-4" onClick={() => { setSubmitted(false); setNps(null); setComment('') }}>
            Submit another
          </Button>
        </Card>
      ) : (
        <Card>
          <h3 className="text-base font-semibold text-slate-900 mb-1">Share your feedback</h3>
          <p className="text-xs text-slate-500 mb-5">How likely are you to recommend Kangqore to a colleague?</p>

          {/* Project selector */}
          <div className="mb-5">
            <label className="block text-xs font-semibold text-slate-500 mb-2">Project</label>
            <select
              value={projectId}
              onChange={e => setProjectId(e.target.value)}
              className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400"
            >
              {PROJECTS_FOR_FEEDBACK.map(p => (
                <option key={p.id} value={p.id}>{p.title}</option>
              ))}
            </select>
          </div>

          {/* NPS scale */}
          <div className="mb-2">
            <label className="block text-xs font-semibold text-slate-500 mb-3">
              NPS score (0 = not likely, 10 = extremely likely)
            </label>
            <div className="flex items-center gap-1.5 flex-wrap">
              {Array.from({ length: 11 }, (_, i) => (
                <NpsButton key={i} score={i} selected={nps === i} onSelect={() => setNps(i)} />
              ))}
            </div>
            <div className="flex justify-between text-[10px] text-slate-400 mt-1.5 px-1">
              <span>Not likely at all</span>
              <span>Extremely likely</span>
            </div>
          </div>

          {nps !== null && (
            <div className={`mt-3 p-2.5 rounded-xl ${npsLabel(nps).bg}`}>
              <p className={`text-xs font-semibold ${npsLabel(nps).color}`}>
                {nps >= 9 ? 'You\'re a Promoter — thank you!' : nps >= 7 ? 'You\'re Passive — help us improve.' : 'You\'re a Detractor — please tell us more.'}
              </p>
            </div>
          )}

          {/* Comment */}
          <div className="mt-5">
            <label className="block text-xs font-semibold text-slate-500 mb-2">What's one thing we could do better?</label>
            <Textarea
              value={comment}
              onChange={e => setComment(e.target.value)}
              rows={3}
              placeholder="Your comment (optional)…"
            />
          </div>

          <div className="mt-5 flex justify-end">
            <Button
              variant="primary"
              size="sm"
              leftIcon={<Send className="w-3.5 h-3.5" />}
              disabled={nps === null || isPending}
              onClick={() => mutate()}
            >
              Submit feedback
            </Button>
          </div>
        </Card>
      )}

      {/* History */}
      {feedbacks.length > 0 && (
        <div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Previous submissions</p>
          <div className="space-y-3">
            {feedbacks.map(f => {
              const { label, color, bg } = npsLabel(f.npsScore)
              return (
                <Card key={f.id}>
                  <div className="flex items-start gap-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-lg ${bg} ${color} flex-shrink-0`}>
                      {f.npsScore}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant={f.npsScore >= 9 ? 'success' : f.npsScore >= 7 ? 'warning' : 'danger'} size="sm">{label}</Badge>
                        <span className="text-xs text-slate-400">{f.project?.title}</span>
                      </div>
                      {f.comment && <p className="text-sm text-slate-600 leading-relaxed">{f.comment}</p>}
                      <p className="text-[11px] text-slate-400 mt-1">{fmtDate(f.createdAt)}</p>
                    </div>
                  </div>
                </Card>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
