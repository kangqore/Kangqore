import { create } from 'zustand'
import { PROJECTS, TASKS, SPRINTS, ISSUES } from './data'
import type { Project, Task, TaskStatus, Issue } from './types'

interface ProjectsStore {
  projects: Project[]
  tasks: Task[]
  sprints: typeof SPRINTS
  issues: Issue[]
  selectedProjectId: string
  setSelectedProject: (id: string) => void
  moveTask: (taskId: string, newStatus: TaskStatus) => void
  tasksForProject: (projectId: string) => Task[]
  issuesForProject: (projectId: string) => Issue[]
  activeSprintForProject: (projectId: string) => typeof SPRINTS[0] | undefined
}

export const useProjectsStore = create<ProjectsStore>((set, get) => ({
  projects: PROJECTS,
  tasks: TASKS,
  sprints: SPRINTS,
  issues: ISSUES,
  selectedProjectId: 'pj1',

  setSelectedProject: (id) => set({ selectedProjectId: id }),

  moveTask: (taskId, newStatus) =>
    set(s => ({
      tasks: s.tasks.map(t => t.id === taskId ? { ...t, status: newStatus } : t),
    })),

  tasksForProject: (projectId) =>
    get().tasks.filter(t => t.projectId === projectId),

  issuesForProject: (projectId) =>
    get().issues.filter(i => i.projectId === projectId),

  activeSprintForProject: (projectId) =>
    get().sprints.find(s => s.projectId === projectId && s.status === 'active'),
}))
