import { useEffect } from 'react'
import { useUIStore, type ViewMode } from '@store/ui'

/**
 * Call at the top of any page that supports view switching.
 * Registers which views are available; auto-corrects viewMode if the current
 * one isn't supported by this page.
 *
 * Example:
 *   usePageViews(['list', 'board', 'kanban', 'gantt'])
 */
export function usePageViews(views: ViewMode[]) {
  const { registerPageViews, viewMode, setViewMode } = useUIStore()

  useEffect(() => {
    registerPageViews(views)
    // If currently on a mode this page doesn't support, snap to first supported
    if (!views.includes(viewMode)) {
      setViewMode(views[0])
    }
    // On unmount reset to default so the toggle hides on non-collection pages
    return () => registerPageViews(['list', 'board'])
  }, []) // eslint-disable-line react-hooks/exhaustive-deps
}
