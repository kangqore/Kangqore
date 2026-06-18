import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Calendar, CheckCircle2, XCircle, RefreshCw, Trash2 } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardBody } from '@design-system/components/Card'
import { Badge } from '@design-system/components/Badge'
import { Button } from '@design-system/components/Button'
import { Spinner } from '@design-system/components/Spinner'
import { api, isDemo } from '@lib/api'

interface CalendarIntegration {
  id: string
  provider: 'GOOGLE' | 'MICROSOFT'
  accountEmail: string
  status: 'ACTIVE' | 'INACTIVE' | 'ERROR'
  lastSyncedAt?: string
}

const PROVIDERS = [
  {
    id: 'GOOGLE',
    name: 'Google Calendar',
    description: 'Sync meetings and block busy slots automatically.',
    logo: 'G',
    color: 'bg-red-100 text-red-600',
    authUrl: '/api/oauth/google?scope=calendar',
  },
  {
    id: 'MICROSOFT',
    name: 'Microsoft / Outlook',
    description: 'Connect Microsoft 365 or Outlook calendar.',
    logo: '⊞',
    color: 'bg-blue-100 text-blue-600',
    authUrl: '/api/oauth/microsoft?scope=calendar',
  },
]

export function CalendarSettingsPage() {
  const queryClient = useQueryClient()

  const { data: integrations = [], isLoading } = useQuery<CalendarIntegration[]>({
    queryKey: ['calendar-integrations'],
    queryFn: () => api.get('/scheduling/calendar-integrations').then(r => r.data.integrations ?? r.data ?? []),
    enabled: !isDemo(),
    staleTime: 1000 * 60 * 2,
  })

  const { mutate: disconnect, isPending: disconnecting } = useMutation({
    mutationFn: (id: string) => api.delete(`/scheduling/calendar-integrations/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['calendar-integrations'] }),
  })


  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold text-white">Calendar Integrations</h2>
        <p className="text-sm text-slate-500 mt-1">
          Connect your calendars to automatically block busy slots and sync scheduled events.
        </p>
      </div>

      {isLoading && <div className="flex items-center gap-2 text-sm text-slate-500"><Spinner size="sm" /> Loading…</div>}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {PROVIDERS.map(provider => {
          const connected = integrations.find(i => i.provider === provider.id)
          return (
            <Card key={provider.id} className={connected ? 'border-green-200 bg-green-50/30' : ''}>
              <CardBody className="p-5">
                <div className="flex items-start gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-lg flex-shrink-0 ${provider.color}`}>
                    {provider.logo}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <p className="font-semibold text-white">{provider.name}</p>
                      {connected && (
                        <Badge variant="success" size="sm" dot>
                          {connected.status === 'ACTIVE' ? 'Connected' : connected.status}
                        </Badge>
                      )}
                    </div>
                    {connected
                      ? <p className="text-xs text-slate-500">{connected.accountEmail}</p>
                      : <p className="text-xs text-slate-500">{provider.description}</p>
                    }
                    {connected?.lastSyncedAt && (
                      <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                        <RefreshCw className="w-3 h-3" />
                        Last synced {new Date(connected.lastSyncedAt).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </div>

                <div className="mt-4 flex gap-2">
                  {connected ? (
                    <Button
                      variant="ghost"
                      size="sm"
                      leftIcon={<Trash2 className="w-3.5 h-3.5" />}
                      onClick={() => disconnect(connected.id)}
                      disabled={disconnecting}
                    >
                      Disconnect
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      leftIcon={<Calendar className="w-3.5 h-3.5" />}
                      onClick={() => { window.location.href = provider.authUrl }}
                    >
                      Connect
                    </Button>
                  )}
                </div>
              </CardBody>
            </Card>
          )
        })}
      </div>

      {/* Status list */}
      {integrations.length > 0 && (
        <Card>
          <CardHeader><CardTitle>Active Integrations</CardTitle></CardHeader>
          <CardBody className="p-0">
            <div className="divide-y divide-[#2E2854]">
              {integrations.map(i => (
                <div key={i.id} className="flex items-center gap-4 px-5 py-3.5">
                  {i.status === 'ACTIVE'
                    ? <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
                    : <XCircle     className="w-4 h-4 text-red-500   flex-shrink-0" />
                  }
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white">{i.provider === 'GOOGLE' ? 'Google Calendar' : 'Microsoft Calendar'}</p>
                    <p className="text-xs text-slate-500">{i.accountEmail}</p>
                  </div>
                  <Badge variant={i.status === 'ACTIVE' ? 'success' : 'danger'} size="sm">{i.status}</Badge>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      )}
    </div>
  )
}
