import axios from 'axios'

export const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
})

// Attach JWT on every request
api.interceptors.request.use(config => {
  const raw = localStorage.getItem('kangqore-auth')
  if (raw) {
    try {
      const { state } = JSON.parse(raw) as { state: { token: string } }
      if (state?.token) config.headers.Authorization = `Bearer ${state.token}`
    } catch { /* ignore */ }
  }
  return config
})

// On 401, clear auth and redirect to login
api.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      localStorage.removeItem('kangqore-auth')
      window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)
