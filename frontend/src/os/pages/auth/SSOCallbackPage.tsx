import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Brain } from 'lucide-react'
import { useAuthStore, ROLE_REDIRECT } from '@store/auth'
import type { UserRole } from '@store/auth'

export function SSOCallbackPage() {
  const navigate = useNavigate()
  const { setUserFromSSO } = useAuthStore()

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const token        = params.get('token')
    const refreshToken = params.get('refreshToken')
    const rawUser      = params.get('user')

    if (!token || !rawUser) {
      navigate('/login?sso_error=1', { replace: true })
      return
    }

    try {
      const user = JSON.parse(decodeURIComponent(rawUser))

      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify(user))
      if (refreshToken) localStorage.setItem('refreshToken', refreshToken)

      setUserFromSSO(user, token)

      const role = (user.role ?? 'ADMIN') as UserRole
      navigate(ROLE_REDIRECT[role] ?? '/kangqore-view/admin/dashboard', { replace: true })
    } catch {
      navigate('/login?sso_error=1', { replace: true })
    }
  }, [navigate, setUserFromSSO])

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f1117]">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-os-blue to-os-cyan flex items-center justify-center animate-pulse">
          <Brain className="w-6 h-6 text-white" />
        </div>
        <p className="text-sm text-slate-400">Completing sign-in…</p>
      </div>
    </div>
  )
}
