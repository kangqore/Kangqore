import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { api } from '@lib/api'

export type UserRole = 'ADMIN' | 'CLIENT' | 'PARTNER' | 'INVESTOR' | 'JOB_SEEKER'

export interface AuthUser {
  id: string
  name: string
  email: string
  role: UserRole
}

interface AuthStore {
  user: AuthUser | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null

  login: (email: string, password: string) => Promise<void>
  signup: (data: SignupPayload) => Promise<void>
  loginAsDemo: () => void
  logout: () => void
  clearError: () => void
}

export interface SignupPayload {
  name: string
  email: string
  password: string
  role: UserRole
  inviteToken?: string
}

export const ROLE_REDIRECT: Record<UserRole, string> = {
  ADMIN:      '/os/strategy',
  CLIENT:     '/os/strategy',   // Phase 5a will become /portal/client
  PARTNER:    '/os/strategy',   // Phase 5b will become /portal/partner
  INVESTOR:   '/os/strategy',   // Phase 5c will become /portal/investor
  JOB_SEEKER: '/os/strategy',   // Phase 5d will become /portal/careers
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (email, password) => {
        set({ isLoading: true, error: null })
        try {
          const { data } = await api.post<{ token: string; user: AuthUser }>('/auth/login', { email, password })
          set({ user: data.user, token: data.token, isAuthenticated: true, isLoading: false })
        } catch (err: unknown) {
          const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message ?? 'Invalid credentials'
          set({ error: msg, isLoading: false })
          throw err
        }
      },

      signup: async (payload) => {
        set({ isLoading: true, error: null })
        try {
          const { data } = await api.post<{ token: string; user: AuthUser }>('/auth/signup', payload)
          set({ user: data.user, token: data.token, isAuthenticated: true, isLoading: false })
        } catch (err: unknown) {
          const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message ?? 'Signup failed'
          set({ error: msg, isLoading: false })
          throw err
        }
      },

      loginAsDemo: () => set({
        user: { id: 'demo', name: 'Mahesh Kumar', email: 'admin@kangqore.com', role: 'ADMIN' },
        token: 'demo-token',
        isAuthenticated: true,
        error: null,
      }),

      logout: () => {
        set({ user: null, token: null, isAuthenticated: false, error: null })
        localStorage.removeItem('kangqore-auth')
        window.location.href = '/login'
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: 'kangqore-auth',
      partialize: s => ({ user: s.user, token: s.token, isAuthenticated: s.isAuthenticated }),
    }
  )
)
