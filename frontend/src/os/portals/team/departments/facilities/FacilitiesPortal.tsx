import { Routes, Route, Navigate } from 'react-router-dom'
import { DeptShell }           from '../../DeptShell'
import { DEPT_MAP }            from '../../deptConfigs'
import { DeptWorkspace }       from '../shared/DeptWorkspace'
import { SharedMembers }       from '../shared/SharedMembers'
import { SharedStandups }      from '../shared/SharedStandups'
import { SharedKIMMP }         from '../shared/SharedKIMMP'
import { TeamTasks }           from '../../pages/TeamTasks'
import { TeamAnnouncements }   from '../../pages/TeamAnnouncements'
import { TeamResources }       from '../../pages/TeamResources'
import { FacilitiesWorkOrders }  from './pages/FacilitiesWorkOrders'
import { FacilitiesSpace }       from './pages/FacilitiesSpace'
import { FacilitiesAssets }      from './pages/FacilitiesAssets'
import { FacilitiesVendors }     from './pages/FacilitiesVendors'
import { FacilitiesInspections } from './pages/FacilitiesInspections'
import { FacilitiesLeases }      from './pages/FacilitiesLeases'
import { FacilitiesSchedule }    from './pages/FacilitiesSchedule'
import { FacilitiesAnalytics }   from './pages/FacilitiesAnalytics'
import { FacilitiesSkills }      from './pages/FacilitiesSkills'
import { FacilitiesServiceCentre } from './pages/FacilitiesServiceCentre'

const cfg = DEPT_MAP['facilities']

export function FacilitiesPortal() {
  return (
    <DeptShell config={cfg}>
      <Routes>
        <Route index                element={<DeptWorkspace config={cfg} />} />
        <Route path="my-work"       element={<TeamTasks />} />
        <Route path="announcements" element={<TeamAnnouncements />} />
        <Route path="resources"     element={<TeamResources />} />
        <Route path="members"       element={<SharedMembers />} />
        <Route path="standups"      element={<SharedStandups />} />
        <Route path="kimmp"         element={<SharedKIMMP config={cfg} />} />
        <Route path="work-orders"   element={<FacilitiesWorkOrders />} />
        <Route path="space"         element={<FacilitiesSpace />} />
        <Route path="assets"        element={<FacilitiesAssets />} />
        <Route path="vendors"       element={<FacilitiesVendors />} />
        <Route path="inspections"   element={<FacilitiesInspections />} />
        <Route path="leases"        element={<FacilitiesLeases />} />
        <Route path="schedule"      element={<FacilitiesSchedule />} />
        <Route path="analytics"     element={<FacilitiesAnalytics />} />
        <Route path="skills"        element={<FacilitiesSkills />} />
        <Route path="service-centre"element={<FacilitiesServiceCentre />} />
        <Route path="*"             element={<Navigate to="/kangqore-view/team/facilities" replace />} />
      </Routes>
    </DeptShell>
  )
}
