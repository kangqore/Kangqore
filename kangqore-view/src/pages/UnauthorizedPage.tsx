import { useNavigate } from 'react-router-dom'
import { ShieldOff } from 'lucide-react'
import { Button } from '@design-system/components/Button'
import { useAuthStore, ROLE_REDIRECT } from '@store/auth'

export function UnauthorizedPage() {
  const navigate = useNavigate()
  const { user, logout } = useAuthStore()

  const goHome = () => {
    if (user?.role) {
      navigate(ROLE_REDIRECT[user.role], { replace: true })
    } else {
      navigate('/login', { replace: true })
    }
  }

  return (
    <div className="min-h-screen bg-[#f8f9fb] flex items-center justify-center p-6">
      <div className="max-w-sm w-full text-center">
        <div className="w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center mx-auto mb-6">
          <ShieldOff className="w-8 h-8 text-red-500" />
        </div>
        <h1 className="text-xl font-bold text-slate-900 mb-2">Access Denied</h1>
        <p className="text-sm text-slate-500 mb-6 leading-relaxed">
          Your account ({user?.role ?? 'unknown role'}) doesn't have permission to view this page.
        </p>
        <div className="flex flex-col gap-2">
          <Button onClick={goHome} className="w-full">
            Go to my dashboard
          </Button>
          <Button variant="ghost" onClick={logout} className="w-full text-slate-500">
            Sign in as a different user
          </Button>
        </div>
      </div>
    </div>
  )
}
