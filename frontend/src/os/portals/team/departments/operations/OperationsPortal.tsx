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
import { OpsProcesses }     from './pages/OpsProcesses'
import { OpsCapacity }      from './pages/OpsCapacity'
import { OpsVendors }       from './pages/OpsVendors'
import { OpsBCP }           from './pages/OpsBCP'
import { OpsSLATracker }    from './pages/OpsSLATracker'
import { OpsApprovals }     from './pages/OpsApprovals'
import { OpsReporting }     from './pages/OpsReporting'
import { OpsAnalytics }     from './pages/OpsAnalytics'
import { OpsSkills }        from './pages/OpsSkills'
import { OpsSchedule }      from './pages/OpsSchedule'
import { OpsServiceCentre } from './pages/OpsServiceCentre'

const cfg = DEPT_MAP['operations']

export function OperationsPortal() {
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
        <Route path="processes"       element={<OpsProcesses />} />
        <Route path="capacity"        element={<OpsCapacity />} />
        <Route path="vendors"         element={<OpsVendors />} />
        <Route path="bcp"             element={<OpsBCP />} />
        <Route path="sla"             element={<OpsSLATracker />} />
        <Route path="approvals"       element={<OpsApprovals />} />
        <Route path="reporting"       element={<OpsReporting />} />
        <Route path="analytics"       element={<OpsAnalytics />} />
        <Route path="skills"          element={<OpsSkills />} />
        <Route path="schedule"        element={<OpsSchedule />} />
        <Route path="service-centre"  element={<OpsServiceCentre />} />
        <Route path="*"               element={<Navigate to="/kangqore-view/team/operations" replace />} />
      </Routes>
    </DeptShell>
  )
}
