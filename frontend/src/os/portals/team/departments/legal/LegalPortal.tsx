import { Routes, Route, Navigate } from 'react-router-dom'
import { DeptShell }         from '../../DeptShell'
import { DEPT_MAP }          from '../../deptConfigs'
import { DeptWorkspace }     from '../shared/DeptWorkspace'
import { SharedMembers }     from '../shared/SharedMembers'
import { SharedStandups }    from '../shared/SharedStandups'
import { SharedKIMMP }       from '../shared/SharedKIMMP'
import { TeamTasks }         from '../../pages/TeamTasks'
import { TeamAnnouncements } from '../../pages/TeamAnnouncements'
import { TeamResources }     from '../../pages/TeamResources'
import { LegalContracts }    from './pages/LegalContracts'
import { LegalMatters }      from './pages/LegalMatters'
import { LegalNDAs }         from './pages/LegalNDAs'
import { LegalCalendar }     from './pages/LegalCalendar'
import { LegalEntities }     from './pages/LegalEntities'
import { LegalApprovals }    from './pages/LegalApprovals'
import { LegalClauses }      from './pages/LegalClauses'
import { LegalSchedule }     from './pages/LegalSchedule'
import { LegalAnalytics }    from './pages/LegalAnalytics'
import { LegalSkills }       from './pages/LegalSkills'
import { LegalServiceCentre } from './pages/LegalServiceCentre'

const cfg = DEPT_MAP['legal']

export function LegalPortal() {
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
        <Route path="contracts"     element={<LegalContracts />} />
        <Route path="matters"       element={<LegalMatters />} />
        <Route path="ndas"          element={<LegalNDAs />} />
        <Route path="calendar"      element={<LegalCalendar />} />
        <Route path="entities"      element={<LegalEntities />} />
        <Route path="approvals"     element={<LegalApprovals />} />
        <Route path="clauses"       element={<LegalClauses />} />
        <Route path="schedule"      element={<LegalSchedule />} />
        <Route path="analytics"     element={<LegalAnalytics />} />
        <Route path="skills"        element={<LegalSkills />} />
        <Route path="service-centre"element={<LegalServiceCentre />} />
        <Route path="*"             element={<Navigate to="/kangqore-view/team/legal" replace />} />
      </Routes>
    </DeptShell>
  )
}
