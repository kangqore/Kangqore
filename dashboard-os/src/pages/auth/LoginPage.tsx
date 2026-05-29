import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Eye, EyeOff, ArrowRight, Target, LayoutDashboard, Brain, Zap } from 'lucide-react'
import { Button } from '@design-system/components/Button'
import { Input } from '@design-system/components/Input'
import { useAuthStore, ROLE_REDIRECT } from '@store/auth'
import { cn } from '@design-system/cn'

const schema = z.object({
  email:    z.string().email('Enter a valid email'),
  password: z.string().min(1, 'Password is required'),
})
type FormData = z.infer<typeof schema>

const FEATURES = [
  { icon: Target,          label: 'Strategy & Portfolio',  desc: 'OKRs, pillars, roadmaps' },
  { icon: LayoutDashboard, label: 'Projects & Agile',      desc: 'Gantt, Kanban, sprints'  },
  { icon: Brain,           label: 'KIMMP Intelligence',    desc: 'AI signals and decisions' },
]

export function LoginPage() {
  const { login, loginAsDemo, isLoading, error, clearError } = useAuthStore()
  const navigate = useNavigate()
  const location = useLocation()
  const [showPwd, setShowPwd] = useState(false)

  const from = (location.state as { from?: { pathname: string } })?.from?.pathname

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  async function onSubmit(data: FormData) {
    clearError()
    try {
      await login(data.email, data.password)
      const user = useAuthStore.getState().user
      navigate(from ?? (user ? ROLE_REDIRECT[user.role] : '/os/strategy'), { replace: true })
    } catch { /* error shown from store */ }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left — brand panel */}
      <div className="hidden lg:flex lg:w-[45%] bg-[#0f1117] flex-col justify-between p-12">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-500 to-violet-700 flex items-center justify-center">
            <span className="text-white font-bold">K</span>
          </div>
          <div>
            <p className="text-white font-semibold leading-none">Kangqore</p>
            <p className="text-slate-500 text-xs mt-0.5">Company OS</p>
          </div>
        </div>

        <div>
          <h1 className="text-4xl font-bold text-white leading-tight">
            Strategy meets<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-violet-400">
              execution.
            </span>
          </h1>
          <p className="mt-4 text-slate-400 text-base leading-relaxed max-w-sm">
            One OS for your entire company — portfolio, projects, finance, CRM, and intelligence in one place.
          </p>

          <div className="mt-10 space-y-4">
            {FEATURES.map(f => (
              <div key={f.label} className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-purple-950/60 border border-purple-900/40 flex items-center justify-center flex-shrink-0">
                  <f.icon className="w-4 h-4 text-purple-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-white">{f.label}</p>
                  <p className="text-xs text-slate-500">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <p className="text-slate-600 text-xs">© 2026 Kangqore. All rights reserved.</p>
      </div>

      {/* Right — form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-slate-50">
        <div className="w-full max-w-sm">
          {/* Mobile logo */}
          <div className="flex items-center gap-2.5 mb-8 lg:hidden">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-violet-700 flex items-center justify-center">
              <span className="text-white font-bold text-sm">K</span>
            </div>
            <span className="font-semibold text-slate-900">Kangqore OS</span>
          </div>

          <h2 className="text-2xl font-bold text-slate-900">Welcome back</h2>
          <p className="mt-1.5 text-sm text-slate-500">Sign in to your workspace</p>

          {error && (
            <div className="mt-5 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-sm text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="mt-7 space-y-4">
            <Input
              label="Email"
              type="email"
              placeholder="you@kangqore.com"
              error={errors.email?.message}
              {...register('email')}
            />

            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-slate-700">Password</label>
                <Link to="/forgot-password" className="text-xs text-purple-600 hover:text-purple-700 font-medium">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <input
                  type={showPwd ? 'text' : 'password'}
                  placeholder="••••••••"
                  className={cn(
                    'w-full h-9 rounded-xl border bg-white text-sm text-slate-900 placeholder:text-slate-400',
                    'border-slate-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-100',
                    'outline-none transition-all duration-150 pl-3 pr-10',
                    errors.password && 'border-red-400 focus:border-red-400 focus:ring-red-100'
                  )}
                  {...register('password')}
                />
                <button
                  type="button"
                  onClick={() => setShowPwd(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-red-600">{errors.password.message}</p>}
            </div>

            <Button type="submit" className="w-full mt-2" loading={isLoading} rightIcon={<ArrowRight className="w-4 h-4" />}>
              Sign in
            </Button>
          </form>

          <div className="relative my-5">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-slate-50 px-3 text-xs text-slate-400">or</span>
            </div>
          </div>

          <button
            onClick={() => { loginAsDemo(); navigate('/os/strategy', { replace: true }) }}
            className="w-full flex items-center justify-center gap-2 h-9 rounded-xl border-2 border-dashed border-purple-200 text-sm font-semibold text-purple-600 hover:bg-purple-50 hover:border-purple-400 transition-all duration-150"
          >
            <Zap className="w-4 h-4" />
            Continue as Demo (no login required)
          </button>

          <p className="mt-6 text-center text-sm text-slate-500">
            Don't have an account?{' '}
            <Link to="/signup" className="text-purple-600 hover:text-purple-700 font-medium">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
