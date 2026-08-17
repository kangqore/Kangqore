import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type ViewMode = 'list' | 'board' | 'kanban' | 'gantt'

interface UIStore {
  sidebarCollapsed: boolean
  railExpanded: boolean
  notificationPanelOpen: boolean
  viewMode: ViewMode
  supportedViews: ViewMode[]
  pinnedRailId: string | null
  toggleSidebar: () => void
  setSidebarCollapsed: (v: boolean) => void
  toggleRail: () => void
  setRailExpanded: (v: boolean) => void
  openNotificationPanel: () => void
  closeNotificationPanel: () => void
  setViewMode: (mode: ViewMode) => void
  registerPageViews: (views: ViewMode[]) => void
  setPinnedRailId: (id: string | null) => void
}

export const useUIStore = create<UIStore>()(
  persist(
    (set) => ({
      sidebarCollapsed: false,
      railExpanded: false,
      notificationPanelOpen: false,
      viewMode: 'board',
      supportedViews: ['list', 'board'],
      pinnedRailId: null,
      toggleSidebar: () => set(s => ({ sidebarCollapsed: !s.sidebarCollapsed })),
      setSidebarCollapsed: (v) => set({ sidebarCollapsed: v }),
      toggleRail: () => set(s => ({ railExpanded: !s.railExpanded })),
      setRailExpanded: (v) => set({ railExpanded: v }),
      openNotificationPanel: () => set({ notificationPanelOpen: true }),
      closeNotificationPanel: () => set({ notificationPanelOpen: false }),
      setViewMode: (mode) => set({ viewMode: mode }),
      registerPageViews: (views) => set({ supportedViews: views }),
      setPinnedRailId: (id) => set({ pinnedRailId: id }),
    }),
    { name: 'kangqore-ui', partialize: s => ({ sidebarCollapsed: s.sidebarCollapsed, railExpanded: s.railExpanded, viewMode: s.viewMode }) }
  )
)

