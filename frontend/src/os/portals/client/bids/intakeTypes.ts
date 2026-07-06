// ─── BIDS™ Intake — TypeScript types ─────────────────────────────────────────

export type QuestionType =
  | 'maturity_slider'
  | 'multi_select'
  | 'single_select'
  | 'range_select'
  | 'yes_no_expand'
  | 'priority_rank'
  | 'open_text'
  | 'confidence_rating'

export interface SelectOption {
  value: string
  label: string
  icon?: string
}

export interface WaandaHint {
  condition: (answer: any) => boolean
  text: string
}

export interface IntakeQuestion {
  id:          string
  type:        QuestionType
  label:       string
  description?: string
  required:    boolean
  options?:    SelectOption[]
  min?:        number
  max?:        number
  maxLength?:  number
  sensitive?:  boolean
  expandLabel?: string            // for yes_no_expand: label of the follow-up
  expandType?:  QuestionType     // type of the follow-up question
  expandOptions?: SelectOption[] // options for the follow-up if multi/single select
  waandaHints?: WaandaHint[]
  pillarIds:   number[]          // which BIDS™ pillars this question feeds
}

export interface IntakeEngine {
  id:          number
  name:        string
  tagline:     string
  icon:        string
  color:       string
  pillarIds:   number[]
  questions:   IntakeQuestion[]
}

export interface FoundationData {
  clientName:  string
  industry:    string
  companySize: string
  hqCountry:   string
  biggestChallenge: string
  assessmentTrigger: string[]
}

export interface IntakeData {
  foundation:   Partial<FoundationData>
  engines:      Record<string, Record<string, any>>   // engineId → questionId → answer
  sectionsDone: number[]
}

export interface BidsEngagement {
  id:                  string
  clientName:          string
  industry:            string
  status:              string
  notes:               string | null    // Executive Intelligence Report™ (WAANDA draft, consultant-refined)
  intakeData:          IntakeData | null
  pillarScores:        PillarScore[]
  engineScores:        EngineScore[]
  deliverables:        Deliverable[]
  waandaDraftAt:       string | null
  consultantApprovedAt: string | null
  publishedToClientAt: string | null
  roadmap:             TransformationRoadmap | null
  roadmapGeneratedAt:  string | null
  roadmapActivatedAt:  string | null
  coigBaseline:        CoigBaseline | null
  seededProjectId:     string | null
}

export interface RoadmapGoal {
  title:         string
  pillarId:      number
  pillarName:    string
  successMetric: string
  category:      string
}

export interface RoadmapProject {
  title:           string
  description:     string
  linkedPillarIds: number[]
  durationWeeks:   number
  category:        string
  type:            string
}

export interface RoadmapPhase {
  horizon:  '30-day' | '60-day' | '90-day' | '180-day'
  label:    string
  focus:    string
  priority: 'Critical' | 'High' | 'Medium'
  goals:    RoadmapGoal[]
  projects: RoadmapProject[]
}

export interface ServicePrescription {
  pillarId:           number
  pillarName:         string
  currentScore:       number
  targetScore:        number
  recommendedService: string
  rationale:          string
}

export interface TransformationRoadmap {
  phases:               RoadmapPhase[]
  servicePrescriptions: ServicePrescription[]
}

export interface CoigBaseline {
  overallScore:  number
  pillarScores:  { pillarId: number; score: number }[]
  capturedAt:    string
}

export interface PillarScore {
  pillarId:        number
  pillarName:      string
  engineId:        number
  engineName:      string
  score:           number
  maturity:        'Foundational' | 'Developing' | 'Capable' | 'Advanced' | 'Leading'
  finding:         string
  recommendations: string[]
}

export interface EngineScore {
  engineId:   number
  engineName: string
  score:      number
  pillarIds:  number[]
  summary:    string
}

export interface Deliverable {
  n:           number
  name:        string
  status:      'PENDING' | 'IN_PROGRESS' | 'COMPLETE'
  completedAt: string | null
}

export type MaturityLevel = 'Foundational' | 'Developing' | 'Capable' | 'Advanced' | 'Leading'

export const MATURITY_LABELS: MaturityLevel[] = ['Foundational', 'Developing', 'Capable', 'Advanced', 'Leading']

export const MATURITY_COLORS: Record<MaturityLevel, string> = {
  Foundational: '#e2445c',
  Developing:   '#fdab3d',
  Capable:      '#4ab6d4',
  Advanced:     '#2564ea',
  Leading:      '#00c875',
}
