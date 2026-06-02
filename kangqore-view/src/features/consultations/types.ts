export type ConsultationStatus =
  | 'PENDING'
  | 'CONTACTED'
  | 'SCHEDULED'
  | 'RESCHEDULED'
  | 'COMPLETED'
  | 'CANCELLED'

export interface Consultation {
  id:                   string
  name:                 string
  email:                string
  phone?:               string
  company?:             string
  service?:             string
  services?:            string[]
  topic?:               string
  preferredDate?:       string
  message?:             string
  source:               string
  status:               ConsultationStatus
  notes?:               string
  scheduledAt?:         string
  previousScheduledAt?: string
  meetingMode?:         string
  meetingLink?:         string
  location?:            string
  assignedTo?:          string
  contactedAt?:         string
  createdAt:            string
  updatedAt:            string
}

export interface ConsultationStats {
  total:       number
  pending:     number
  contacted:   number
  scheduled:   number
  completed:   number
  rescheduled: number
}
