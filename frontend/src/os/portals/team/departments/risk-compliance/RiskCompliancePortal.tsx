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
import { RCRiskRegister }   from './pages/RCRiskRegister'
import { RCFrameworks }     from './pages/RCFrameworks'
import { RCAuditManagement } from './pages/RCAuditManagement'
import { RCVendorRisk }     from './pages/RCVendorRisk'
import { RCPolicies }       from './pages/RCPolicies'
import { RCExceptions }     from './pages/RCExceptions'
import { RCPlaybooks }      from './pages/RCPlaybooks'
import { RCAnalytics }      from './pages/RCAnalytics'
import { RCSkills }         from './pages/RCSkills'
import { RCSchedule }       from './pages/RCSchedule'
import { RCServiceCentre }  from './pages/RCServiceCentre'

const cfg = DEPT_MAP['risk-compliance']

export function RiskCompliancePortal() {
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
        <Route path="risk-register"   element={<RCRiskRegister />} />
        <Route path="frameworks"      element={<RCFrameworks />} />
        <Route path="audits"          element={<RCAuditManagement />} />
        <Route path="vendor-risk"     element={<RCVendorRisk />} />
        <Route path="policies"        element={<RCPolicies />} />
        <Route path="exceptions"      element={<RCExceptions />} />
        <Route path="playbooks"       element={<RCPlaybooks />} />
        <Route path="analytics"       element={<RCAnalytics />} />
        <Route path="skills"          element={<RCSkills />} />
        <Route path="schedule"        element={<RCSchedule />} />
        <Route path="service-centre"  element={<RCServiceCentre />} />
        <Route path="*"               element={<Navigate to="/kangqore-view/team/risk-compliance" replace />} />
      </Routes>
    </DeptShell>
  )
}
