import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@lib/api'
import { BidsEngagement, IntakeData } from './intakeTypes'
import { useIntakeStore } from './useIntakeStore'

// ─── Query keys ───────────────────────────────────────────────────────────────
export const BIDS_KEYS = {
  engagement: ['bids', 'engagement'] as const,
  status:     ['bids', 'status'] as const,
}

// ─── Fetch engagement ─────────────────────────────────────────────────────────
export function useBidsEngagement() {
  return useQuery({
    queryKey: BIDS_KEYS.engagement,
    queryFn:  async () => {
      const { data } = await api.get<{ engagement: BidsEngagement }>('/client/bids/engagement')
      return data.engagement
    },
    retry:    1,
    staleTime: 30_000,
  })
}

// ─── Poll WAANDA processing status ───────────────────────────────────────────
export function useBidsStatus(enabled: boolean) {
  return useQuery({
    queryKey:          BIDS_KEYS.status,
    queryFn:           async () => {
      const { data } = await api.get<{ status: string; waandaDraftAt: string | null }>('/client/bids/intake/status')
      return data
    },
    enabled,
    refetchInterval:   d => {
      // Stop polling once WAANDA is done
      const status = d.state.data?.status
      if (status === 'WAANDA_DRAFT' || status === 'CONSULTANT_REVIEW' || status === 'ACTIVE') return false
      return 3000
    },
    staleTime: 0,
  })
}

// ─── Auto-save draft ──────────────────────────────────────────────────────────
export function useIntakeSave() {
  const setLastSavedAt = useIntakeStore(s => s.setLastSavedAt)
  const setDirty       = useIntakeStore(s => s.setDirty)

  return useMutation({
    mutationFn: async (intakeData: IntakeData) => {
      const { data } = await api.post<{ ok: boolean; savedAt: string }>('/client/bids/intake/save', { intakeData })
      return data
    },
    onSuccess: d => {
      setLastSavedAt(new Date(d.savedAt).toLocaleTimeString())
      setDirty(false)
    },
  })
}

// ─── Final submit → triggers WAANDA ──────────────────────────────────────────
export function useIntakeSubmit() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (intakeData: IntakeData) => {
      const { data } = await api.post<{ ok: boolean; status: string }>('/client/bids/intake/submit', { intakeData })
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BIDS_KEYS.status })
    },
  })
}
