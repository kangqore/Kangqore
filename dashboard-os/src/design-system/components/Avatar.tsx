import { cn } from '../cn'

const sizeMap = {
  xs: 'w-6 h-6 text-[10px]',
  sm: 'w-8 h-8 text-xs',
  md: 'w-9 h-9 text-sm',
  lg: 'w-11 h-11 text-base',
  xl: 'w-14 h-14 text-lg',
}

const statusColors = {
  online:  'bg-green-500',
  away:    'bg-amber-400',
  busy:    'bg-red-500',
  offline: 'bg-slate-300',
}

const brandColors = [
  'bg-purple-500', 'bg-blue-500', 'bg-emerald-500',
  'bg-orange-500', 'bg-pink-500', 'bg-indigo-500', 'bg-teal-500',
]

function getInitials(name: string) {
  return name
    .split(' ')
    .slice(0, 2)
    .map(n => n[0])
    .join('')
    .toUpperCase()
}

function getColor(name: string) {
  const index = name.charCodeAt(0) % brandColors.length
  return brandColors[index]
}

interface AvatarProps {
  name: string
  src?: string
  size?: keyof typeof sizeMap
  status?: keyof typeof statusColors
  className?: string
}

function Avatar({ name, src, size = 'md', status, className }: AvatarProps) {
  return (
    <div className={cn('relative flex-shrink-0 inline-flex', className)}>
      <div className={cn('rounded-full overflow-hidden flex items-center justify-center text-white font-semibold', sizeMap[size], !src && getColor(name))}>
        {src ? (
          <img src={src} alt={name} className="w-full h-full object-cover" />
        ) : (
          <span>{getInitials(name)}</span>
        )}
      </div>
      {status && (
        <span className={cn(
          'absolute bottom-0 right-0 rounded-full border-2 border-white',
          size === 'xs' || size === 'sm' ? 'w-2 h-2' : 'w-2.5 h-2.5',
          statusColors[status]
        )} />
      )}
    </div>
  )
}

interface AvatarGroupProps {
  users: { name: string; src?: string }[]
  max?: number
  size?: keyof typeof sizeMap
}

function AvatarGroup({ users, max = 4, size = 'sm' }: AvatarGroupProps) {
  const shown = users.slice(0, max)
  const rest = users.length - max

  return (
    <div className="flex -space-x-2">
      {shown.map((u, i) => (
        <div key={i} className="ring-2 ring-white rounded-full">
          <Avatar name={u.name} src={u.src} size={size} />
        </div>
      ))}
      {rest > 0 && (
        <div className={cn('ring-2 ring-white rounded-full flex items-center justify-center bg-slate-200 text-slate-600 font-semibold', sizeMap[size])}>
          <span className="text-[10px]">+{rest}</span>
        </div>
      )}
    </div>
  )
}

export { Avatar, AvatarGroup }
