export type PartnerStatus   = 'active' | 'onboarding' | 'paused' | 'offboarded'
export type PartnerTier     = 'platinum' | 'gold' | 'silver' | 'associate'
export type PartnerType     = 'subcontractor' | 'agency' | 'freelancer' | 'consultancy'
export type TaskStatus      = 'assigned' | 'in-progress' | 'review' | 'completed' | 'overdue'
export type PaymentStatus   = 'pending' | 'paid' | 'overdue' | 'processing'
export type DeliverableStatus = 'not-started' | 'in-progress' | 'submitted' | 'approved' | 'revision'

export interface PartnerContact {
  name: string
  role: string
  email: string
  phone?: string
}

export interface Partner {
  id: string
  name: string
  type: PartnerType
  tier: PartnerTier
  status: PartnerStatus
  country: string
  specialisms: string[]
  rating: number          // 0–5
  projectIds: string[]
  contact: PartnerContact
  joinDate: string
  totalEarned: number
  pendingPayment: number
  activeTasks: number
  completedProjects: number
  description: string
  logo: string
  hourlyRate: number
}

export interface PartnerTask {
  id: string
  partnerId: string
  partnerName: string
  projectId: string
  projectName: string
  title: string
  description: string
  status: TaskStatus
  priority: 'critical' | 'high' | 'medium' | 'low'
  assignedDate: string
  dueDate: string
  completedDate?: string
  storyPoints: number
  fee: number
}

export interface Deliverable {
  id: string
  partnerId: string
  partnerName: string
  projectId: string
  projectName: string
  title: string
  description: string
  status: DeliverableStatus
  dueDate: string
  submittedDate?: string
  approvedDate?: string
  fee: number
  feedback?: string
}

export interface PartnerPayment {
  id: string
  partnerId: string
  partnerName: string
  invoiceNumber: string
  description: string
  amount: number
  status: PaymentStatus
  issuedDate: string
  dueDate: string
  paidDate?: string
}

export interface PartnerNote {
  id: string
  partnerId: string
  content: string
  author: string
  date: string
  type: 'general' | 'performance' | 'issue' | 'praise'
}
