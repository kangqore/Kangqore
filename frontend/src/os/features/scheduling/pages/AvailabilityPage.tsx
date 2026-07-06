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

  if (isLoading) return <div className="flex items-center gap-2 text-sm text-[var(--os-text-2)]"><Spinner size="sm" /> Loading…</div>

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-[var(--os-text-1)]">Availability</h2>
          <p className="text-sm text-[var(--os-text-2)] mt-1">Configure your weekly booking hours and timezone.</p>
        </div>
        <Button size="sm" leftIcon={<Save className="w-4 h-4" />} onClick={() => save()} loading={saving} className="shadow-sm">
          Save Changes
        </Button>
      </div>

      <Card className="overflow-hidden border border-[var(--os-border)] shadow-sm">
        {/* Timezone Section */}
        <div className="p-6 border-b border-[var(--os-border)] bg-[var(--os-surface-0)]/50">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-sm font-semibold text-[var(--os-text-1)]">Timezone</h3>
              <p className="text-xs text-[var(--os-text-2)] mt-0.5">All booking times will be converted to this timezone.</p>
            </div>
            <select
              value={timezone}
              onChange={e => setTimezone(e.target.value)}
              className="h-10 rounded-xl border border-[var(--os-border)] bg-[var(--os-surface-0)] text-sm text-[var(--os-text-1)] px-4 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 w-full sm:w-64 shadow-sm transition-all cursor-pointer"
            >
              {TIMEZONES.map(tz => <option key={tz} value={tz}>{tz}</option>)}
            </select>
          </div>
        </div>

        {/* Weekly schedule */}
        <div className="divide-y divide-[var(--os-border)] bg-[var(--os-surface-0)]">
          {DAYS.map(day => {
            const slot = schedule[day]
            return (
              <div key={day} className={`flex items-center gap-6 px-6 py-4 transition-colors ${slot.enabled ? '' : 'bg-[var(--os-surface-0)]/30 opacity-70'}`}>
                {/* Sleek Toggle */}
                <button
                  onClick={() => toggle(day)}
                  className={`relative w-11 h-6 rounded-full transition-all duration-300 ease-in-out flex-shrink-0 focus:outline-none focus:ring-2 focus:ring-blue-500/50 ${slot.enabled ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'}`}
                >
                  <span className={`absolute top-[2px] left-[2px] w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-300 ease-in-out ${slot.enabled ? 'translate-x-5' : 'translate-x-0'}`} />
                </button>

                <span className={`text-sm w-10 font-semibold ${slot.enabled ? 'text-[var(--os-text-1)]' : 'text-[var(--os-text-2)]'}`}>
                  {DAY_LABELS[day]}
                </span>

                {slot.enabled ? (
                  <div className="flex items-center gap-3 flex-1">
                    <input type="time" value={slot.start} onChange={e => setTime(day, 'start', e.target.value)}
                      className="h-9 w-[120px] rounded-lg border border-[var(--os-border)] bg-[var(--os-surface-0)] text-sm text-[var(--os-text-1)] px-3 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 shadow-sm transition-all" />
                    <span className="text-[var(--os-text-2)] text-sm font-medium">–</span>
                    <input type="time" value={slot.end} onChange={e => setTime(day, 'end', e.target.value)}
                      className="h-9 w-[120px] rounded-lg border border-[var(--os-border)] bg-[var(--os-surface-0)] text-sm text-[var(--os-text-1)] px-3 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 shadow-sm transition-all" />
                  </div>
                ) : (
                  <div className="flex-1 text-sm text-[var(--os-text-2)] font-medium italic">
                    Unavailable
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </Card>
    </div>
  )
}
