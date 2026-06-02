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

// On 401 clear session and redirect — but not when in demo mode
// (demo-token will always 401, we don't want to boot demo users)
api.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401 && !isDemo()) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      localStorage.removeItem('kangqore-auth')
      window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)
