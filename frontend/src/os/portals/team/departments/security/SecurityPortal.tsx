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
import { SecurityRiskRegister }    from './pages/SecurityRiskRegister'
import { SecurityVulnerabilities } from './pages/SecurityVulnerabilities'
import { SecurityIncidents }       from './pages/SecurityIncidents'
import { SecurityAccessReviews }   from './pages/SecurityAccessReviews'
import { SecurityControls }        from './pages/SecurityControls'
import { SecurityPenTest }         from './pages/SecurityPenTest'
import { SecurityAwareness }       from './pages/SecurityAwareness'
import { SecurityPlaybooks }       from './pages/SecurityPlaybooks'
import { SecurityRouting }         from './pages/SecurityRouting'
import { SecurityOnCall }          from './pages/SecurityOnCall'
import { SecuritySupervisorView }  from './pages/SecuritySupervisorView'
import { SecuritySchedule }        from './pages/SecuritySchedule'
import { SecurityAnalytics }       from './pages/SecurityAnalytics'
import { SecuritySkills }          from './pages/SecuritySkills'
import { SecurityServiceCentre }   from './pages/SecurityServiceCentre'

const cfg = DEPT_MAP['security']

export function SecurityPortal() {
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
        <Route path="risk-register"   element={<SecurityRiskRegister />} />
        <Route path="vulnerabilities" element={<SecurityVulnerabilities />} />
        <Route path="incidents"       element={<SecurityIncidents />} />
        <Route path="access-reviews"  element={<SecurityAccessReviews />} />
        <Route path="controls"        element={<SecurityControls />} />
        <Route path="pen-test"        element={<SecurityPenTest />} />
        <Route path="awareness"       element={<SecurityAwareness />} />
        <Route path="playbooks"       element={<SecurityPlaybooks />} />
        <Route path="routing"         element={<SecurityRouting />} />
        <Route path="on-call"         element={<SecurityOnCall />} />
        <Route path="supervisor"      element={<SecuritySupervisorView />} />
        <Route path="schedule"        element={<SecuritySchedule />} />
        <Route path="analytics"       element={<SecurityAnalytics />} />
        <Route path="skills"          element={<SecuritySkills />} />
        <Route path="service-centre"  element={<SecurityServiceCentre />} />
        <Route path="*"               element={<Navigate to="/kangqore-view/team/security" replace />} />
      </Routes>
    </DeptShell>
  )
}
