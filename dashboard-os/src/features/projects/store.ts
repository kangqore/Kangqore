import { create } from 'zustand'
import { PROJECTS, TASKS, SPRINTS, ISSUES } from './data'
import type { Project, Task, TaskStatus, ProjectStatus, HealthStatus, Issue } from './types'

interface ProjectsStore {
  projects: Project[]
  tasks: Task[]
  sprints: typeof SPRINTS
  issues: Issue[]
  selectedProjectId: string
  isLoading: boolean
  error: string | null
  hydrate: (projects: Project[]) => void
  setSelectedProject: (id: string) => void
  updateProjectStatus: (id: string, status: ProjectStatus) => void
  updateProjectHealth: (id: string, health: HealthStatus) => void
  updateProject:       (id: string, patch: Partial<Project>) => void
  moveTask: (taskId: string, newStatus: TaskStatus) => void
  tasksForProject: (projectId: string) => Task[]
  issuesForProject: (projectId: string) => Issue[]
  activeSprintForProject: (projectId: string) => typeof SPRINTS[0] | undefined
}

export const useProjectsStore = create<ProjectsStore>((set, get) => ({
  projects: PROJECTS,
  isLoading: false,
  error: null,
  hydrate: (projects) => set({ projects, isLoading: false, error: null }),
  tasks: TASKS,
  sprints: SPRINTS,
  issues: ISSUES,
  selectedProjectId: 'pj1',

  setSelectedProject: (id) => set({ selectedProjectId: id }),

  updateProjectStatus: (id, status) =>
    set(s => ({ projects: s.projects.map(p => p.id === id ? { ...p, status } : p) })),

  updateProjectHealth: (id, health) =>
    set(s => ({ projects: s.projects.map(p => p.id === id ? { ...p, health } : p) })),

  updateProject: (id, patch) =>
    set(s => ({ projects: s.projects.map(p => p.id === id ? { ...p, ...patch } : p) })),

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
