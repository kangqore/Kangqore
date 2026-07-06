import { Routes, Route, Navigate } from 'react-router-dom'
import { DeptShell }        from '../../DeptShell'
import { DEPT_MAP }         from '../../deptConfigs'
import { DeptWorkspace }    from '../shared/DeptWorkspace'
import { SharedMembers }    from '../shared/SharedMembers'
import { SharedStandups }   from '../shared/SharedStandups'
import { SharedKIMMP }      from '../shared/SharedKIMMP'
import { TeamTasks }        from '../../pages/TeamTasks'
import { TeamAnnouncements } from '../../pages/TeamAnnouncements'
import { TeamResources }    from '../../pages/TeamResources'
import { ProcRequests }     from './pages/ProcRequests'
import { ProcOrders }       from './pages/ProcOrders'
import { ProcVendors }      from './pages/ProcVendors'
import { ProcContracts }    from './pages/ProcContracts'
import { ProcSpend }        from './pages/ProcSpend'
import { ProcCatalogue }    from './pages/ProcCatalogue'
import { ProcApprovals }    from './pages/ProcApprovals'
import { ProcAnalytics }    from './pages/ProcAnalytics'
import { ProcSkills }       from './pages/ProcSkills'
import { ProcSchedule }     from './pages/ProcSchedule'
import { ProcServiceCentre } from './pages/ProcServiceCentre'

const cfg = DEPT_MAP['procurement']

export function ProcurementPortal() {
  return (
    <DeptShell config={cfg}>
      <Routes>
        <Route index                  element={<DeptWorkspace config={cfg} />} />
        <Route path="my-work"         element={<TeamTasks />} />
        <Route path="announcements"   element={<TeamAnnouncements />} />
        <Route path="resources"       element={<TeamResources />} />
        <Route path="members"         element={<SharedMembers />} />
        <Route path="standups"        element={<SharedStandups />} />
        <Route path="kimmp"           element={<SharedKIMMP config={cfg} />} />
        <Route path="requests"        element={<ProcRequests />} />
        <Route path="orders"          element={<ProcOrders />} />
        <Route path="vendors"         element={<ProcVendors />} />
        <Route path="contracts"       element={<ProcContracts />} />
        <Route path="spend"           element={<ProcSpend />} />
        <Route path="catalogue"       element={<ProcCatalogue />} />
        <Route path="approvals"       element={<ProcApprovals />} />
        <Route path="analytics"       element={<ProcAnalytics />} />
        <Route path="skills"          element={<ProcSkills />} />
        <Route path="schedule"        element={<ProcSchedule />} />
        <Route path="service-centre"  element={<ProcServiceCentre />} />
        <Route path="*"               element={<Navigate to="/kangqore-view/team/procurement" replace />} />
      </Routes>
    </DeptShell>
  )
}
