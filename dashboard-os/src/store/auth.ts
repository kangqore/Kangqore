import { create } from 'zustand'
import { api, DEMO_TOKEN } from '@lib/api'

export type UserRole = 'ADMIN' | 'CLIENT' | 'PARTNER' | 'INVESTOR' | 'JOB_SEEKER'

export interface AuthUser {
  id: string
  name: string
  email: string
  role: UserRole
  company?: string
  avatarUrl?: string
}

interface AuthStore {
  user: AuthUser | null
  token: string | null
  isAuthenticated: boolean
  isDemo: boolean
  isLoading: boolean
  error: string | null

  login:       (email: string, password: string) => Promise<void>
  signup:      (data: SignupPayload) => Promise<void>
  loginAsDemo: (role?: UserRole) => void
  logout:      () => void
  clearError:  () => void
  syncFromWebsite: () => boolean   // hydrate from website session if present
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
  CLIENT:     '/portal/client',
  PARTNER:    '/portal/partner',
  INVESTOR:   '/portal/investor',
  JOB_SEEKER: '/portal/careers',
}

// Write auth state to the same localStorage keys the frontend website uses
// so a single login works across both apps on the same domain.
function persistToWebsiteKeys(token: string, user: AuthUser) {
  localStorage.setItem('token', token)
  localStorage.setItem('user', JSON.stringify(user))
}

function clearWebsiteKeys() {
  localStorage.removeItem('token')
  localStorage.removeItem('user')
  localStorage.removeItem('refreshToken')
}

// Read a session that was established by the website (frontend/)
function readWebsiteSession(): { token: string; user: AuthUser } | null {
  try {
    const token = localStorage.getItem('token')
    const raw   = localStorage.getItem('user')
    if (!token || !raw) return null
    const user  = JSON.parse(raw) as AuthUser
    if (!user?.id || !user?.role) return null
    return { token, user }
  } catch {
    return null
  }
}

export const useAuthStore = create<AuthStore>((set, _get) => {
  // Hydrate immediately from whatever session is present (website or own)
  const websiteSession = readWebsiteSession()
  const initial = websiteSession
    ? { user: websiteSession.user, token: websiteSession.token, isAuthenticated: true, isDemo: websiteSession.token === DEMO_TOKEN }
    : { user: null, token: null, isAuthenticated: false, isDemo: false }

  return {
    ...initial,
    isLoading: false,
    error: null,

    login: async (email, password) => {
      set({ isLoading: true, error: null })
      try {
        const { data } = await api.post<{ token: string; refreshToken: string; user: AuthUser }>(
          '/auth/login', { email, password }
        )
        persistToWebsiteKeys(data.token, data.user)
        set({ user: data.user, token: data.token, isAuthenticated: true, isDemo: false, isLoading: false })
      } catch (err: unknown) {
        const msg = (err as { response?: { data?: { message?: string } } })
          ?.response?.data?.message ?? 'Invalid credentials'
        set({ error: msg, isLoading: false })
        throw err
      }
    },

    signup: async (payload) => {
      set({ isLoading: true, error: null })
      try {
        const { data } = await api.post<{ token: string; refreshToken: string; user: AuthUser }>(
          '/auth/register', payload
        )
        persistToWebsiteKeys(data.token, data.user)
        set({ user: data.user, token: data.token, isAuthenticated: true, isDemo: false, isLoading: false })
      } catch (err: unknown) {
        const msg = (err as { response?: { data?: { message?: string } } })
          ?.response?.data?.message ?? 'Signup failed'
        set({ error: msg, isLoading: false })
        throw err
      }
    },

    loginAsDemo: (role: UserRole = 'ADMIN') => {
      const demoUsers: Record<UserRole, AuthUser> = {
        ADMIN:      { id: 'demo-admin',    name: 'Mahesh Kumar',  email: 'admin@kangqore.com',    role: 'ADMIN'      },
        CLIENT:     { id: 'demo-client',   name: 'Dr. Priya Rao', email: 'priya@synapsehealth.com',role: 'CLIENT'     },
        PARTNER:    { id: 'demo-partner',  name: 'Dev Patel',     email: 'dev@kangqore.com',       role: 'PARTNER'    },
        INVESTOR:   { id: 'demo-investor', name: 'James Whitfield',email:'james@whitfieldvc.com',  role: 'INVESTOR'   },
        JOB_SEEKER: { id: 'demo-job',      name: 'Mia Johansson', email: 'mia.j@outlook.com',      role: 'JOB_SEEKER' },
      }
      const user = demoUsers[role]
      persistToWebsiteKeys(DEMO_TOKEN, user)
      set({ user, token: DEMO_TOKEN, isAuthenticated: true, isDemo: true, error: null })
    },

    logout: () => {
      clearWebsiteKeys()
      set({ user: null, token: null, isAuthenticated: false, error: null })
      window.location.href = '/login'
    },

    clearError: () => set({ error: null }),

    syncFromWebsite: () => {
      const session = readWebsiteSession()
      if (session) {
        set({ user: session.user, token: session.token, isAuthenticated: true })
        return true
      }
      return false
    },
  }
})
