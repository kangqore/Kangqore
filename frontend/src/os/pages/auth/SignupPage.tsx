import { useState, useEffect } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Eye, EyeOff, ArrowRight, Briefcase, Handshake, TrendingUp, GraduationCap, Check } from 'lucide-react'
import { Button } from '@design-system/components/Button'
import { Input } from '@design-system/components/Input'
import { cn } from '@design-system/cn'
import { useAuthStore, ROLE_REDIRECT } from '@store/auth'
import type { UserRole } from '@store/auth'

const schema = z.object({
  name:     z.string().min(2, 'Name must be at least 2 characters'),
  email:    z.string().email('Enter a valid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
})
type FormData = z.infer<typeof schema>

interface RoleCard {
  role: UserRole
  label: string
  description: string
  icon: React.ElementType
  color: string
  iconBg: string
}

const ROLE_CARDS: RoleCard[] = [
  {
    role: 'CLIENT',
    label: 'Client',
    description: 'Access your project delivery, reports, and communications',
    icon: Briefcase,
    color: 'border-blue-500 bg-blue-50',
    iconBg: 'bg-blue-100 text-blue-600',
  },
  {
    role: 'PARTNER',
    label: 'Partner',
    description: 'Manage tasks, deliverables, and earnings as a subcontractor',
    icon: Handshake,
    color: 'border-emerald-500 bg-emerald-50',
    iconBg: 'bg-emerald-100 text-emerald-600',
  },
  {
    role: 'INVESTOR',
    label: 'Investor',
    description: 'View financials, portfolio performance, and board materials',
    icon: TrendingUp,
    color: 'border-amber-500 bg-amber-50',
    iconBg: 'bg-amber-100 text-amber-600',
  },
  {
    role: 'JOB_SEEKER',
    label: 'Job Seeker',
    description: 'Apply for positions, track interviews, and manage your portfolio',
    icon: GraduationCap,
    color: 'border-blue-500 bg-blue-50',
    iconBg: 'bg-blue-100 text-blue-600',
  },
]

export function SignupPage() {
  const { signup, isLoading, error, clearError } = useAuthStore()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [selectedRole, setSelectedRole] = useState<UserRole>('CLIENT')
  const [showPwd, setShowPwd] = useState(false)

  // Pre-select role from invite token param
  useEffect(() => {
    const role = searchParams.get('role') as UserRole | null
    if (role && ROLE_CARDS.some(c => c.role === role)) setSelectedRole(role)
  }, [searchParams])

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  async function onSubmit(data: FormData) {
    clearError()
    try {
      await signup({
        ...data,
        role: selectedRole,
        inviteToken: searchParams.get('invite') ?? undefined,
      })
      navigate(ROLE_REDIRECT[selectedRole], { replace: true })
    } catch { /* error shown from store */ }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2.5 mb-5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-os-blue to-os-cyan flex items-center justify-center">
              <span className="text-white font-bold">K</span>
            </div>
            <span className="font-semibold text-slate-900 text-lg">Kangqore OS</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Create your account</h1>
          <p className="mt-1.5 text-sm text-slate-500">Choose how you'll use the platform</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
          {/* Role selector */}
          <p className="text-sm font-semibold text-slate-700 mb-3">I am a…</p>
          <div className="grid grid-cols-2 gap-3 mb-7">
            {ROLE_CARDS.map(card => {
              const Icon = card.icon
              const active = selectedRole === card.role
              return (
                <button
                  key={card.role}
                  type="button"
                  onClick={() => setSelectedRole(card.role)}
                  className={cn(
                    'relative flex flex-col gap-2 p-4 rounded-xl border-2 text-left transition-all duration-150 hover:shadow-sm',
                    active ? card.color : 'border-slate-200 bg-white hover:border-slate-300'
                  )}
                >
                  {active && (
                    <span className="absolute top-3 right-3 w-5 h-5 rounded-full bg-white flex items-center justify-center shadow-sm">
                      <Check className="w-3 h-3 text-blue-600" />
                    </span>
                  )}
                  <div className={cn('w-9 h-9 rounded-lg flex items-center justify-center', active ? card.iconBg : 'bg-slate-100 text-slate-400')}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <p className={cn('text-sm font-semibold', active ? 'text-slate-900' : 'text-slate-600')}>{card.label}</p>
                    <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">{card.description}</p>
                  </div>
                </button>
              )
            })}
          </div>

          {/* Form */}
          {error && (
            <div className="mb-5 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-sm text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Full name"
                placeholder="C.O.D.E."
                error={errors.name?.message}
                className="col-span-2 sm:col-span-1"
                {...register('name')}
              />
              <Input
                label="Work email"
                type="email"
                placeholder="you@company.com"
                error={errors.email?.message}
                className="col-span-2 sm:col-span-1"
                {...register('email')}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-slate-700">Password</label>
              <div className="relative">
                <input
                  type={showPwd ? 'text' : 'password'}
                  placeholder="At least 8 characters"
                  className={cn(
                    'w-full h-9 rounded-xl border bg-white text-sm text-slate-900 placeholder:text-slate-400',
                    'border-slate-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100',
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
              Create account
            </Button>
          </form>

          <p className="mt-5 text-center text-sm text-slate-500">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-600 hover:text-blue-700 font-medium">
              Sign in
            </Link>
          </p>
        </div>

        <p className="text-center text-xs text-slate-400 mt-5">
          By creating an account you agree to our{' '}
          <span className="text-blue-600 cursor-pointer hover:underline">Terms</span> and{' '}
          <span className="text-blue-600 cursor-pointer hover:underline">Privacy Policy</span>
        </p>
      </div>
    </div>
  )
}
