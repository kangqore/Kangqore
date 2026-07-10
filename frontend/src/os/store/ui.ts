import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface UIStore {
  sidebarCollapsed: boolean
  notificationPanelOpen: boolean
  viewMode: 'board' | 'list'
  toggleSidebar: () => void
  setSidebarCollapsed: (v: boolean) => void
  openNotificationPanel: () => void
  closeNotificationPanel: () => void
  setViewMode: (mode: 'board' | 'list') => void
}

export const useUIStore = create<UIStore>()(
  persist(
    (set) => ({
      sidebarCollapsed: false,
      notificationPanelOpen: false,
      viewMode: 'board',
      toggleSidebar: () => set(s => ({ sidebarCollapsed: !s.sidebarCollapsed })),
      setSidebarCollapsed: (v) => set({ sidebarCollapsed: v }),
      openNotificationPanel: () => set({ notificationPanelOpen: true }),
      closeNotificationPanel: () => set({ notificationPanelOpen: false }),
      setViewMode: (mode) => set({ viewMode: mode }),
    }),
    { name: 'kangqore-ui', partialize: s => ({ sidebarCollapsed: s.sidebarCollapsed, viewMode: s.viewMode }) }
  )
)
