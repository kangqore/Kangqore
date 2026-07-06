import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { IntakeData, FoundationData } from './intakeTypes'

interface IntakeStore {
  engagementId:    string | null
  currentSection:  number   // 0 = foundation, 1–6 = engines, 7 = review
  intakeData:      IntakeData
  lastSavedAt:     string | null
  isDirty:         boolean

  setEngagementId:    (id: string) => void
  setSection:         (n: number) => void
  nextSection:        () => void
  prevSection:        () => void
  setFoundation:      (patch: Partial<FoundationData>) => void
  setAnswer:          (engineId: number, questionId: string, value: any) => void
  markSectionDone:    (sectionIndex: number) => void
  setLastSavedAt:     (ts: string) => void
  setDirty:           (v: boolean) => void
  reset:              () => void
}

const EMPTY_INTAKE: IntakeData = {
  foundation:   {},
  engines:      {},
  sectionsDone: [],
}

export const useIntakeStore = create<IntakeStore>()(
  persist(
    (set, get) => ({
      engagementId:   null,
      currentSection: 0,
      intakeData:     EMPTY_INTAKE,
      lastSavedAt:    null,
      isDirty:        false,

      setEngagementId: id => set({ engagementId: id }),

      setSection: n => set({ currentSection: n }),

      nextSection: () => set(s => ({
        currentSection: Math.min(s.currentSection + 1, 7),
        isDirty: true,
      })),

      prevSection: () => set(s => ({
        currentSection: Math.max(s.currentSection - 1, 0),
      })),

      setFoundation: patch => set(s => ({
        intakeData: {
          ...s.intakeData,
          foundation: { ...s.intakeData.foundation, ...patch },
        },
        isDirty: true,
      })),

      setAnswer: (engineId, questionId, value) => set(s => ({
        intakeData: {
          ...s.intakeData,
          engines: {
            ...s.intakeData.engines,
            [engineId]: {
              ...(s.intakeData.engines[engineId] ?? {}),
              [questionId]: value,
            },
          },
        },
        isDirty: true,
      })),

      markSectionDone: (sectionIndex) => set(s => ({
        intakeData: {
          ...s.intakeData,
          sectionsDone: s.intakeData.sectionsDone.includes(sectionIndex)
            ? s.intakeData.sectionsDone
            : [...s.intakeData.sectionsDone, sectionIndex],
        },
      })),

      setLastSavedAt: ts => set({ lastSavedAt: ts, isDirty: false }),

      setDirty: v => set({ isDirty: v }),

      reset: () => set({
        engagementId:   null,
        currentSection: 0,
        intakeData:     EMPTY_INTAKE,
        lastSavedAt:    null,
        isDirty:        false,
      }),
    }),
    {
      name:    'bids-intake-draft',
      storage: createJSONStorage(() => localStorage),
      partialize: s => ({
        engagementId:   s.engagementId,
        currentSection: s.currentSection,
        intakeData:     s.intakeData,
        lastSavedAt:    s.lastSavedAt,
      }),
    }
  )
)

// Selector helpers
export const selectEngineAnswers = (engineId: number) =>
  (s: IntakeStore) => s.intakeData.engines[engineId] ?? {}

export const selectAnswer = (engineId: number, questionId: string) =>
  (s: IntakeStore) => s.intakeData.engines[engineId]?.[questionId]

export const selectSectionDone = (sectionIndex: number) =>
  (s: IntakeStore) => s.intakeData.sectionsDone.includes(sectionIndex)

export const selectProgress = (s: IntakeStore) => {
  const totalSections = 7 // 0 foundation + 6 engines
  const done = s.intakeData.sectionsDone.length
  return Math.round((done / totalSections) * 100)
}
