import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface UIStore {
  sidebarCollapsed: boolean
  notificationPanelOpen: boolean
  toggleSidebar: () => void
  setSidebarCollapsed: (v: boolean) => void
  openNotificationPanel: () => void
  closeNotificationPanel: () => void
}

export const useUIStore = create<UIStore>()(
  persist(
    (set) => ({
      sidebarCollapsed: false,
      notificationPanelOpen: false,
      toggleSidebar: () => set(s => ({ sidebarCollapsed: !s.sidebarCollapsed })),
      setSidebarCollapsed: (v) => set({ sidebarCollapsed: v }),
      openNotificationPanel: () => set({ notificationPanelOpen: true }),
      closeNotificationPanel: () => set({ notificationPanelOpen: false }),
    }),
    { name: 'kangqore-ui', partialize: s => ({ sidebarCollapsed: s.sidebarCollapsed }) }
  )
)
