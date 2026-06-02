export type JobStatus       = 'open' | 'interview' | 'offer' | 'closed' | 'on-hold'
export type CandidateStage  = 'applied' | 'screening' | 'technical' | 'final' | 'offer' | 'hired' | 'rejected'
export type EmploymentType  = 'full-time' | 'part-time' | 'contract' | 'freelance'
export type Department      = 'engineering' | 'product' | 'sales' | 'delivery' | 'ops' | 'design'

export interface JobRole {
  id: string
  title: string
  department: Department
  type: EmploymentType
  status: JobStatus
  location: string
  remote: boolean
  salaryMin: number   // £k
  salaryMax: number   // £k
  postedDate: string
  targetStartDate?: string
  hiringManager: string
  applications: number
  inPipeline: number
  description: string
  requirements: string[]
  tags: string[]
}

export interface Candidate {
  id: string
  roleId: string
  name: string
  email: string
  location: string
  stage: CandidateStage
  appliedDate: string
  lastActivity: string
  cvScore?: number        // 0-100 KIMMP score
  notes: string
  tags: string[]
  source: 'linkedin' | 'referral' | 'careers-page' | 'agency' | 'direct'
}
