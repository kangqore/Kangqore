export type WorkItemType = 'TASK' | 'BUG' | 'STORY' | 'EPIC' | 'MILESTONE' | 'INITIATIVE' | 'DELIVERABLE' | 'SPIKE'
export type WorkItemStatus =
  | 'DRAFT' | 'QUEUED' | 'READY' | 'IN_PROGRESS' | 'BLOCKED' | 'AT_RISK'
  | 'AWAITING_APPROVAL' | 'AWAITING_CUSTOMER' | 'UNDER_REVIEW' | 'ESCALATED'
  | 'COMPLETED' | 'CANCELLED'
export type WorkItemPriority = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW'

export interface WorkItem {
  id: string
  title: string; description?: string
  type: WorkItemType; status: WorkItemStatus; priority: WorkItemPriority
  projectId?: string; portfolioId?: string; parentId?: string
  assigneeId?: string; teamId?: string
  startDate?: string; dueDate?: string; completedAt?: string
  estimatedHours?: number; actualHours?: number; storyPoints?: number
  progress: number
  tags: string[]
  sortOrder: number
  objectId?: string
  createdAt: string; updatedAt: string
}

export interface WorkGoal {
  id: string; title: string; description?: string
  type: 'GOAL' | 'OBJECTIVE' | 'KEY_RESULT'
  status: 'ON_TRACK' | 'AT_RISK' | 'BEHIND' | 'ACHIEVED' | 'CANCELLED'
  progress: number; targetValue?: number; currentValue?: number; unit?: string
  ownerId?: string; teamId?: string; parentId?: string
  startDate?: string; dueDate?: string
}

export interface WorkPortfolio {
  id: string; name: string; description?: string
  status: string; health: number; progress: number
  startDate?: string; targetDate?: string
}

/** Every state the ontology can hold, in workflow order. */
export const STATUS_COLUMNS: WorkItemStatus[] = [
  'DRAFT', 'QUEUED', 'READY', 'IN_PROGRESS', 'BLOCKED', 'AT_RISK',
  'AWAITING_APPROVAL', 'AWAITING_CUSTOMER', 'UNDER_REVIEW', 'ESCALATED',
  'COMPLETED', 'CANCELLED',
]

/** The columns worth showing on a board by default — twelve is too many to scan. */
export const BOARD_COLUMNS: WorkItemStatus[] = [
  'QUEUED', 'READY', 'IN_PROGRESS', 'BLOCKED', 'AT_RISK', 'UNDER_REVIEW', 'COMPLETED',
]

export const STATUS_COLOR: Record<string, string> = {
  DRAFT:             'text-[var(--os-text-3)] bg-[var(--os-bg-2)]',
  QUEUED:            'text-[var(--os-text-3)] bg-[var(--os-bg-2)]',
  READY:             'text-blue-400 bg-blue-400/10',
  IN_PROGRESS:       'text-violet-400 bg-violet-400/10',
  BLOCKED:           'text-red-500 bg-red-500/10',
  AT_RISK:           'text-orange-500 bg-orange-500/10',
  AWAITING_APPROVAL: 'text-amber-400 bg-amber-400/10',
  AWAITING_CUSTOMER: 'text-amber-400 bg-amber-400/10',
  UNDER_REVIEW:      'text-cyan-400 bg-cyan-400/10',
  ESCALATED:         'text-red-600 bg-red-600/15',
  COMPLETED:         'text-emerald-500 bg-emerald-500/10',
  CANCELLED:         'text-[var(--os-text-3)] bg-[var(--os-bg-2)] line-through',
}

/** Human-readable label for a state constant. */
export const statusLabel = (s: string) =>
  s.replace(/_/g, ' ').toLowerCase().replace(/^\w/, c => c.toUpperCase())

export const PRIORITY_COLOR: Record<string, string> = {
  CRITICAL: 'text-red-500',
  HIGH:     'text-orange-500',
  MEDIUM:   'text-amber-500',
  LOW:      'text-[var(--os-text-3)]',
}

export const PRIORITY_DOT: Record<string, string> = {
  CRITICAL: 'bg-red-500',
  HIGH:     'bg-orange-500',
  MEDIUM:   'bg-amber-500',
  LOW:      'bg-[var(--os-text-3)]',
}

export const TYPE_ICON: Record<string, string> = {
  TASK:        '☐',
  BUG:         '🐛',
  STORY:       '📖',
  EPIC:        '⚡',
  MILESTONE:   '🏁',
  INITIATIVE:  '🎯',
  DELIVERABLE: '📦',
  SPIKE:       '🔬',
}
