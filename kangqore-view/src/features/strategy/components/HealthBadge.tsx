import { Badge } from '@design-system/components/Badge'
import type { HealthStatus } from '../types'

const MAP = {
  'on-track': { variant: 'success', label: 'On Track'  },
  'at-risk':  { variant: 'warning', label: 'At Risk'   },
  'behind':   { variant: 'danger',  label: 'Behind'    },
  'completed':{ variant: 'info',    label: 'Completed' },
} as const

export function HealthBadge({ status }: { status: HealthStatus }) {
  const { variant, label } = MAP[status]
  return <Badge variant={variant} dot size="sm">{label}</Badge>
}
