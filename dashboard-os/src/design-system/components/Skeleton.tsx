import { cn } from '../cn'

// ─── Base shimmer block ───────────────────────────────────────────────────────

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  width?: string
  height?: string
  rounded?: 'sm' | 'md' | 'lg' | 'full'
}

const roundedMap = {
  sm:   'rounded',
  md:   'rounded-lg',
  lg:   'rounded-xl',
  full: 'rounded-full',
}

function Skeleton({ className, width, height, rounded = 'md', style, ...props }: SkeletonProps) {
  return (
    <div
      aria-hidden="true"
      className={cn('skeleton-shimmer', roundedMap[rounded], className)}
      style={{ width, height, ...style }}
      {...props}
    />
  )
}

// ─── Text lines ───────────────────────────────────────────────────────────────

interface SkeletonTextProps {
  lines?: number
  className?: string
  lastLineWidth?: string
}

function SkeletonText({ lines = 3, className, lastLineWidth = '60%' }: SkeletonTextProps) {
  return (
    <div className={cn('space-y-2', className)} aria-hidden="true">
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          height="14px"
          width={i === lines - 1 ? lastLineWidth : '100%'}
        />
      ))}
    </div>
  )
}

// ─── Full stat card shimmer ───────────────────────────────────────────────────

function SkeletonStatCard({ className }: { className?: string }) {
  return (
    <div className={cn('bg-white border border-slate-200 shadow-sm rounded-xl p-5 space-y-3', className)} aria-hidden="true">
      <div className="flex items-center justify-between">
        <Skeleton height="12px" width="40%" />
        <Skeleton height="32px" width="32px" rounded="lg" />
      </div>
      <Skeleton height="28px" width="55%" />
      <Skeleton height="12px" width="35%" />
    </div>
  )
}

// ─── Table row shimmer ────────────────────────────────────────────────────────

function SkeletonRow({ cols = 4, className }: { cols?: number; className?: string }) {
  const widths = ['30%', '20%', '20%', '15%', '15%']
  return (
    <div className={cn('flex items-center gap-4 py-3 px-4', className)} aria-hidden="true">
      {Array.from({ length: cols }).map((_, i) => (
        <Skeleton key={i} height="14px" width={widths[i % widths.length]} className="flex-shrink-0" />
      ))}
    </div>
  )
}

// ─── Card body shimmer ────────────────────────────────────────────────────────

function SkeletonCard({ rows = 3, className }: { rows?: number; className?: string }) {
  return (
    <div className={cn('bg-white border border-slate-200 shadow-sm rounded-xl overflow-hidden', className)} aria-hidden="true">
      <div className="p-5 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <Skeleton height="16px" width="35%" />
          <Skeleton height="20px" width="48px" rounded="full" />
        </div>
      </div>
      <div className="divide-y divide-slate-50">
        {Array.from({ length: rows }).map((_, i) => (
          <SkeletonRow key={i} />
        ))}
      </div>
    </div>
  )
}

export { Skeleton, SkeletonText, SkeletonStatCard, SkeletonRow, SkeletonCard }
