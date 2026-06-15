import axios from 'axios'

export const DEMO_TOKEN = 'demo-token'

export const isDemo = () => localStorage.getItem('token') === DEMO_TOKEN

export const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
})

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

let isRefreshing = false
let failQueue: Array<{ resolve: (v: unknown) => void; reject: (e: unknown) => void }> = []

function drainQueue(err: unknown, token?: string) {
  failQueue.forEach(p => err ? p.reject(err) : p.resolve(token))
  failQueue = []
}

function clearSession() {
  localStorage.removeItem('token')
  localStorage.removeItem('user')
  localStorage.removeItem('refreshToken')
  localStorage.removeItem('kangqore-auth')
  window.location.href = '/login'
}

// On 401: attempt token refresh once, then retry. Redirect to login on failure.
// In demo mode: skip refresh (demo-token always 401s — never boot demo users).
api.interceptors.response.use(
  res => res,
  async err => {
    const original = err.config
    if (err.response?.status !== 401 || isDemo() || original._retry) {
      return Promise.reject(err)
    }

    const refreshToken = localStorage.getItem('refreshToken')
    if (!refreshToken) { clearSession(); return Promise.reject(err) }

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failQueue.push({ resolve, reject })
      }).then(token => {
        original.headers.Authorization = `Bearer ${token}`
        return api(original)
      })
    }

    original._retry = true
    isRefreshing = true

    try {
      const { data } = await axios.post('/api/sessions/refresh', { refreshToken })
      const newToken: string = data.accessToken   // backend returns accessToken, not token
      localStorage.setItem('token', newToken)
      if (data.refreshToken) localStorage.setItem('refreshToken', data.refreshToken)
      api.defaults.headers.common.Authorization = `Bearer ${newToken}`
      drainQueue(null, newToken)
      original.headers.Authorization = `Bearer ${newToken}`
      return api(original)
    } catch (refreshErr) {
      drainQueue(refreshErr)
      clearSession()
      return Promise.reject(refreshErr)
    } finally {
      isRefreshing = false
    }
  }
)
