export type ProjectStatus = 'active' | 'planned' | 'on-hold' | 'completed'
export type HealthStatus  = 'on-track' | 'at-risk' | 'behind' | 'completed'
export type TaskStatus    = 'backlog' | 'todo' | 'in-progress' | 'review' | 'done'
export type Priority      = 'critical' | 'high' | 'medium' | 'low'
export type IssueType     = 'bug' | 'feature' | 'task' | 'epic'
export type SprintStatus  = 'active' | 'planned' | 'completed'

export interface Project {
  id: string
  name: string
  client: string
  status: ProjectStatus
  health: HealthStatus
  healthScore: number
  category: string
  services: string[]
  owner: string
  team: string[]
  startDate: string
  endDate: string
  budget: number
  spent: number
  progress: number
  description: string
  pillarColor: string
  taskCount: number
  openIssues: number
}

export interface Task {
  id: string
  projectId: string
  projectName: string
  title: string
  description: string
  status: TaskStatus
  priority: Priority
  assignee: string
  dueDate: string
  labels: string[]
  storyPoints: number
  sprintId?: string
}

export interface Sprint {
  id: string
  projectId: string
  name: string
  goal: string
  startDate: string
  endDate: string
  status: SprintStatus
  velocity: number
  capacity: number
  completedPoints: number
}

export interface Issue {
  id: string
  projectId: string
  projectName: string
  title: string
  type: IssueType
  priority: Priority
  status: TaskStatus
  assignee: string
  reporter: string
  createdAt: string
  labels: string[]
  storyPoints: number
}
