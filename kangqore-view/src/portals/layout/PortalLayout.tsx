import { Outlet } from 'react-router-dom'
import { SiteNav } from '@components/shell/SiteNav'

export function PortalLayout() {
  return (
    <div className="flex flex-col h-screen bg-[#f8f9fb] overflow-hidden pt-[7.5rem]">
      <SiteNav />
      <Outlet />
    </div>
  )
}
