import React from 'react'

export type StatusVariant = 'success' | 'warning' | 'danger' | 'info' | 'default'

interface StatusBadgeProps {
  status: StatusVariant
  label: string
  className?: string
}

const variantStyles: Record<StatusVariant, string> = {
  success: 'bg-success-bg text-success border border-success/20',
  warning: 'bg-warning-bg text-warning border border-warning/20',
  danger:  'bg-danger-bg text-danger border border-danger/20',
  info:    'bg-info-bg text-info border border-info/20',
  default: 'bg-surface-secondary text-text-secondary border border-border',
}

export function StatusBadge({ status, label, className = '' }: StatusBadgeProps) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-[11px] font-semibold tracking-wide ${variantStyles[status]} ${className}`}>
      {label}
    </span>
  )
}
