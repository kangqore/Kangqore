import { Outlet } from 'react-router-dom'

export function PortalLayout() {
  return (
    <div className="flex flex-col h-screen bg-[#f8f9fb] overflow-hidden">
      <Outlet />
    </div>
  )
}
