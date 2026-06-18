import { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Save } from 'lucide-react'
import { Card, CardBody } from '@design-system/components/Card'
import { Button } from '@design-system/components/Button'
import { Spinner } from '@design-system/components/Spinner'
import { api, isDemo } from '@lib/api'

const DAYS = ['monday','tuesday','wednesday','thursday','friday','saturday','sunday'] as const
const DAY_LABELS: Record<string, string> = {
  monday:'Mon', tuesday:'Tue', wednesday:'Wed', thursday:'Thu',
  friday:'Fri', saturday:'Sat', sunday:'Sun',
}
type Day = typeof DAYS[number]
interface DaySlot { enabled: boolean; start: string; end: string }
type Schedule = Record<Day, DaySlot>

const DEFAULT_SCHEDULE: Schedule = Object.fromEntries(
  DAYS.map(d => [d, { enabled: ['monday','tuesday','wednesday','thursday','friday'].includes(d), start:'09:00', end:'17:00' }])
) as Schedule

const TIMEZONES = [
  'UTC','Asia/Kolkata','America/New_York','America/Los_Angeles','America/Chicago',
  'Europe/London','Europe/Paris','Europe/Berlin','Asia/Tokyo','Asia/Singapore',
  'Australia/Sydney','America/Toronto','America/Sao_Paulo',
]

export function AvailabilityPage() {
  const queryClient = useQueryClient()
  const [schedule, setSchedule] = useState<Schedule>(DEFAULT_SCHEDULE)
  const [timezone, setTimezone] = useState('UTC')

  const { data, isLoading } = useQuery({
    queryKey: ['scheduling-availability'],
    queryFn: () => api.get('/scheduling/availability').then(r => r.data),
    enabled: !isDemo(),
    staleTime: 1000 * 60 * 5,
  })

  useEffect(() => {
    if (!data) return
    if (data.availability) {
      const hydrated: Schedule = { ...DEFAULT_SCHEDULE }
      for (const slot of data.availability) {
        const day = slot.dayOfWeek?.toLowerCase() as Day
        if (day && DAYS.includes(day)) {
          hydrated[day] = { enabled: true, start: slot.startTime ?? '09:00', end: slot.endTime ?? '17:00' }
        }
      }
      setSchedule(hydrated)
    }
    if (data.timezone) setTimezone(data.timezone)
  }, [data])

  const { mutate: save, isPending: saving } = useMutation({
    mutationFn: () => {
      const slots = DAYS.filter(d => schedule[d].enabled).map(d => ({
        dayOfWeek: d.toUpperCase(),
        startTime: schedule[d].start,
        endTime:   schedule[d].end,
      }))
      return api.put('/scheduling/availability', { slots, timezone })
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['scheduling-availability'] }),
  })

  const toggle = (day: Day) => setSchedule(s => ({ ...s, [day]: { ...s[day], enabled: !s[day].enabled } }))
  const setTime = (day: Day, field: 'start' | 'end', val: string) =>
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
                {/* Toggle */}
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
                    <input
                      type="time"
                      value={slot.start}
                      onChange={e => setTime(day, 'start', e.target.value)}
                      className="h-8 rounded-lg border border-os-border bg-os-s1 text-sm text-white px-2 focus:outline-none focus:border-blue-400"
                    />
                    <span className="text-slate-500 text-sm">–</span>
                    <input
                      type="time"
                      value={slot.end}
                      onChange={e => setTime(day, 'end', e.target.value)}
                      className="h-8 rounded-lg border border-os-border bg-os-s1 text-sm text-white px-2 focus:outline-none focus:border-blue-400"
                    />
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
