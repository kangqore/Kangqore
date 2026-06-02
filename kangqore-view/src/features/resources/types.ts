export type MemberStatus = 'active' | 'on-leave' | 'part-time'
export type Department   = 'Engineering' | 'Design' | 'Product' | 'Sales' | 'Operations' | 'Finance'

export interface TeamMember {
  id: string
  name: string
  role: string
  department: Department
  email: string
  location: string
  skills: string[]
  status: MemberStatus
  utilization: number   // 0–100 % of capacity currently allocated
  availability: number  // hours/week available
  billableRate: number  // £/hr
  projectIds: string[]
  joinDate: string
}

export interface Allocation {
  id: string
  memberId: string
  memberName: string
  projectId: string
  projectName: string
  projectColor: string
  hoursPerWeek: number
  startDate: string
  endDate: string
  allocationPct: number  // % of member's total capacity
}

export interface UtilizationDataPoint {
  week: string
  [memberId: string]: number | string
}
