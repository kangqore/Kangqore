import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type Theme = 'light' | 'dark' | 'system'

interface ThemeState {
  theme: Theme
  setTheme: (theme: Theme) => void
  _hasHydrated: boolean
  setHasHydrated: (state: boolean) => void
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      theme: 'system',
      _hasHydrated: false,
      setHasHydrated: (state) => set({ _hasHydrated: state }),
      setTheme: (theme) => {
        set({ theme })
        
        // Apply immediately to document
        const root = window.document.documentElement
        root.classList.remove('light', 'dark')
        
        if (theme === 'system') {
          const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
          root.classList.add(systemTheme)
        } else {
          root.classList.add(theme)
        }
      },
    }),
    {
      name: 'kq-theme-storage',
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true)
        if (state?.theme) {
          state.setTheme(state.theme)
        }
      }
    }
  )
)

// Helper to initialize theme on app mount without waiting for React hydration
export function initializeTheme() {
  if (typeof window === 'undefined') return
  
  const root = window.document.documentElement
  try {
    const storage = localStorage.getItem('kq-theme-storage')
    if (storage) {
      const parsed = JSON.parse(storage)
      const theme = parsed.state?.theme || 'system'
      
      root.classList.remove('light', 'dark')
      if (theme === 'system') {
        const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
        root.classList.add(systemTheme)
      } else {
        root.classList.add(theme)
      }
    }
  } catch (e) {
    // Fallback to system if parsing fails
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    root.classList.add(systemTheme)
  }
}
