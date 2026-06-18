import { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Save } from 'lucide-react'
import { Card, CardBody } from '@design-system/components/Card'
import { Button } from '@design-system/components/Button'
import { Spinner } from '@design-system/components/Spinner'
import { api, isDemo } from '@lib/api'

// Backend: day is 0-6 where 0=Sunday, 1=Monday … 6=Saturday
const DAYS = [1, 2, 3, 4, 5, 6, 0] as const // display Mon–Sun
const DAY_LABELS: Record<number, string> = { 0:'Sun', 1:'Mon', 2:'Tue', 3:'Wed', 4:'Thu', 5:'Fri', 6:'Sat' }

type DayRule = { enabled: boolean; start: string; end: string }
type Schedule = Record<number, DayRule>

const DEFAULT_SCHEDULE: Schedule = {
  0: { enabled: false, start: '09:00', end: '17:00' },
  1: { enabled: true,  start: '09:00', end: '17:00' },
  2: { enabled: true,  start: '09:00', end: '17:00' },
  3: { enabled: true,  start: '09:00', end: '17:00' },
  4: { enabled: true,  start: '09:00', end: '17:00' },
  5: { enabled: true,  start: '09:00', end: '17:00' },
  6: { enabled: false, start: '09:00', end: '17:00' },
}

const TIMEZONES = [
  'UTC','Asia/Kolkata','America/New_York','America/Los_Angeles','America/Chicago',
  'Europe/London','Europe/Paris','Europe/Berlin','Asia/Tokyo','Asia/Singapore',
  'Australia/Sydney','America/Toronto','America/Sao_Paulo',
]

interface AvailabilitySchedule {
  id: string
  name: string
  timezone: string
  isDefault: boolean
  rules: { day: number; startTime: string; endTime: string }[]
}

export function AvailabilityPage() {
  const queryClient = useQueryClient()
  const [schedule, setSchedule] = useState<Schedule>(DEFAULT_SCHEDULE)
  const [timezone, setTimezone] = useState('UTC')
  const [scheduleId, setScheduleId] = useState<string | null>(null)

  const { data, isLoading } = useQuery<AvailabilitySchedule[]>({
    queryKey: ['scheduling-availability'],
    queryFn: () => api.get('/scheduling/availability').then(r => r.data.schedules ?? []),
    enabled: !isDemo(),
    staleTime: 1000 * 60 * 5,
  })

  useEffect(() => {
    if (!data?.length) return
    const def = data.find(s => s.isDefault) ?? data[0]
    setScheduleId(def.id)
    setTimezone(def.timezone ?? 'UTC')

    const hydrated: Schedule = { ...DEFAULT_SCHEDULE }
    // disable all first
    for (const day of DAYS) hydrated[day] = { ...DEFAULT_SCHEDULE[day], enabled: false }
    for (const rule of def.rules) {
      const d = rule.day
      hydrated[d] = { enabled: true, start: rule.startTime, end: rule.endTime }
    }
    setSchedule(hydrated)
  }, [data])

  const { mutate: save, isPending: saving } = useMutation({
    mutationFn: () => {
      const rules = DAYS
        .filter(d => schedule[d].enabled)
        .map(d => ({ day: d, startTime: schedule[d].start, endTime: schedule[d].end }))

      const payload = {
        name: 'Default schedule',
        timezone,
        isDefault: true,
        rules,
        overrides: [],
      }

      return scheduleId
        ? api.put(`/scheduling/availability/${scheduleId}`, payload)
        : api.post('/scheduling/availability', payload)
    },
    onSuccess: (res) => {
      const saved = res.data.schedule
      if (saved?.id) setScheduleId(saved.id)
      queryClient.invalidateQueries({ queryKey: ['scheduling-availability'] })
    },
  })

  const toggle = (day: number) =>
    setSchedule(s => ({ ...s, [day]: { ...s[day], enabled: !s[day].enabled } }))

  const setTime = (day: number, field: 'start' | 'end', val: string) =>
    setSchedule(s => ({ ...s, [day]: { ...s[day], [field]: val } }))

  if (isLoading) return <div className="flex items-center gap-2 text-sm text-slate-500"><Spinner size="sm" /> Loading…</div>

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-white">Availability</h2>
          <p className="text-sm text-slate-500 mt-1">Set the hours you're available for bookings each week.</p>
        </div>
        <Button size="sm" leftIcon={<Save className="w-3.5 h-3.5" />} onClick={() => save()} loading={saving}>
          Save
        </Button>
      </div>

      {/* Timezone */}
      <Card>
        <CardBody className="p-5">
          <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest block mb-2">Timezone</label>
          <select
            value={timezone}
            onChange={e => setTimezone(e.target.value)}
            className="h-9 rounded-xl border border-os-border bg-os-s1 text-sm text-white px-3 focus:outline-none focus:border-blue-400 w-full max-w-xs"
          >
            {TIMEZONES.map(tz => <option key={tz} value={tz}>{tz}</option>)}
          </select>
        </CardBody>
      </Card>

      {/* Weekly schedule */}
      <Card>
        <div className="divide-y divide-[#2E2854]">
          {DAYS.map(day => {
            const slot = schedule[day]
            return (
              <div key={day} className="flex items-center gap-4 px-5 py-3.5">
                <button
                  onClick={() => toggle(day)}
                  className={`relative w-9 h-5 rounded-full transition-colors flex-shrink-0 ${slot.enabled ? 'bg-os-blue' : 'bg-slate-700'}`}
                >
                  <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${slot.enabled ? 'translate-x-4' : 'translate-x-0.5'}`} />
                </button>

                <span className={`text-sm w-8 font-medium ${slot.enabled ? 'text-white' : 'text-slate-600'}`}>
                  {DAY_LABELS[day]}
                </span>

                {slot.enabled ? (
                  <div className="flex items-center gap-2 flex-1">
                    <input type="time" value={slot.start} onChange={e => setTime(day, 'start', e.target.value)}
                      className="h-8 rounded-lg border border-os-border bg-os-s1 text-sm text-white px-2 focus:outline-none focus:border-blue-400" />
                    <span className="text-slate-500 text-sm">–</span>
                    <input type="time" value={slot.end} onChange={e => setTime(day, 'end', e.target.value)}
                      className="h-8 rounded-lg border border-os-border bg-os-s1 text-sm text-white px-2 focus:outline-none focus:border-blue-400" />
                  </div>
                ) : (
                  <span className="text-xs text-slate-600 flex-1">Unavailable</span>
                )}
              </div>
            )
          })}
        </div>
      </Card>
    </div>
  )
}
