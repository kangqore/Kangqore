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
import { EngineeringSprints }      from './pages/EngineeringSprints'
import { EngineeringRepos }        from './pages/EngineeringRepos'
import { EngineeringArchitecture } from './pages/EngineeringArchitecture'
import { EngineeringDeployments }  from './pages/EngineeringDeployments'
import { EngineeringTechDebt }     from './pages/EngineeringTechDebt'
import { EngineeringMonitoring }   from './pages/EngineeringMonitoring'
import { EngineeringPlaybooks }    from './pages/EngineeringPlaybooks'
import { EngineeringOnCall }       from './pages/EngineeringOnCall'
import { EngineeringSchedule }     from './pages/EngineeringSchedule'
import { EngineeringAnalytics }    from './pages/EngineeringAnalytics'
import { EngineeringSkills }       from './pages/EngineeringSkills'
import { EngineeringServiceCentre } from './pages/EngineeringServiceCentre'

const cfg = DEPT_MAP['engineering']

export function EngineeringPortal() {
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
        <Route path="sprints"         element={<EngineeringSprints />} />
        <Route path="repos"           element={<EngineeringRepos />} />
        <Route path="architecture"    element={<EngineeringArchitecture />} />
        <Route path="deployments"     element={<EngineeringDeployments />} />
        <Route path="tech-debt"       element={<EngineeringTechDebt />} />
        <Route path="monitoring"      element={<EngineeringMonitoring />} />
        <Route path="playbooks"       element={<EngineeringPlaybooks />} />
        <Route path="on-call"         element={<EngineeringOnCall />} />
        <Route path="schedule"        element={<EngineeringSchedule />} />
        <Route path="analytics"       element={<EngineeringAnalytics />} />
        <Route path="skills"          element={<EngineeringSkills />} />
        <Route path="service-centre"  element={<EngineeringServiceCentre />} />
        <Route path="*"               element={<Navigate to="/kangqore-view/team/engineering" replace />} />
      </Routes>
    </DeptShell>
  )
}
