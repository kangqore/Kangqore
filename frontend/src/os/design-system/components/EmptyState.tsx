import { motion } from 'framer-motion'
import { cn } from '../cn'
import { Button } from './Button'

interface EmptyStateProps {
  icon?: React.ReactNode
  title: string
  description?: string
  action?: {
    label: string
    onClick: () => void
  }
  secondaryAction?: {
    label: string
    onClick: () => void
  }
  className?: string
}

function EmptyState({ icon, title, description, action, secondaryAction, className }: EmptyStateProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center py-16 px-6 text-center', className)}>
      {icon && (
        <motion.div
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: [0.45, 0, 0.55, 1] }}
          className="w-14 h-14 rounded-2xl bg-[#0F172A] border border-[#2E2854] flex items-center justify-center mb-5 text-slate-400"
        >
          {icon}
        </motion.div>
      )}
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 220, damping: 26, delay: 0.1 }}
      >
        <h3 className="text-base font-semibold text-white">{title}</h3>
        {description && (
          <p className="mt-1.5 text-sm text-slate-500 max-w-xs">{description}</p>
        )}
        {(action || secondaryAction) && (
          <div className="mt-5 flex items-center justify-center gap-2">
            {action && (
              <Button size="sm" onClick={action.onClick}>{action.label}</Button>
            )}
            {secondaryAction && (
              <Button size="sm" variant="ghost" onClick={secondaryAction.onClick}>{secondaryAction.label}</Button>
            )}
          </div>
        )}
      </motion.div>
    </div>
  )
}

export { EmptyState }
