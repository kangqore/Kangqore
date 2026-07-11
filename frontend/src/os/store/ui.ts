import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type ViewMode = 'list' | 'board' | 'kanban' | 'gantt'

interface UIStore {
  sidebarCollapsed: boolean
  notificationPanelOpen: boolean
  viewMode: ViewMode
  supportedViews: ViewMode[]   // set by each page on mount; NOT persisted
  toggleSidebar: () => void
  setSidebarCollapsed: (v: boolean) => void
  openNotificationPanel: () => void
  closeNotificationPanel: () => void
  setViewMode: (mode: ViewMode) => void
  registerPageViews: (views: ViewMode[]) => void
}

export const useUIStore = create<UIStore>()(
  persist(
    (set) => ({
      sidebarCollapsed: false,
      notificationPanelOpen: false,
      viewMode: 'board',
      supportedViews: ['list', 'board'],
      toggleSidebar: () => set(s => ({ sidebarCollapsed: !s.sidebarCollapsed })),
      setSidebarCollapsed: (v) => set({ sidebarCollapsed: v }),
      openNotificationPanel: () => set({ notificationPanelOpen: true }),
      closeNotificationPanel: () => set({ notificationPanelOpen: false }),
      setViewMode: (mode) => set({ viewMode: mode }),
      registerPageViews: (views) => set({ supportedViews: views }),
    }),
    { name: 'kangqore-ui', partialize: s => ({ sidebarCollapsed: s.sidebarCollapsed, viewMode: s.viewMode }) }
  )
)
