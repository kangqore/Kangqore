import { Routes, Route, Navigate } from 'react-router-dom'
import { DeptShell }              from '../../DeptShell'
import { DEPT_MAP }               from '../../deptConfigs'
import { DeptWorkspace }          from '../shared/DeptWorkspace'
import { SharedMembers }          from '../shared/SharedMembers'
import { SharedStandups }         from '../shared/SharedStandups'
import { SharedKIMMP }            from '../shared/SharedKIMMP'
import { TeamTasks }              from '../../pages/TeamTasks'
import { TeamAnnouncements }      from '../../pages/TeamAnnouncements'
import { TeamResources }          from '../../pages/TeamResources'
import { CSAgentWorkspace }       from './pages/CSAgentWorkspace'
import { CSAccounts }             from './pages/CSAccounts'
import { CSHealth }               from './pages/CSHealth'
import { CSQBRs }                 from './pages/CSQBRs'
import { CSRenewals }             from './pages/CSRenewals'
import { CSOnboarding }           from './pages/CSOnboarding'
import { CSExpansion }            from './pages/CSExpansion'
import { CSPlaybooks }            from './pages/CSPlaybooks'
import { CSRouting }              from './pages/CSRouting'
import { CSSupervisorView }       from './pages/CSSupervisorView'
import { CSSchedule }             from './pages/CSSchedule'
import { CSAnalytics }            from './pages/CSAnalytics'
import { CSSkills }               from './pages/CSSkills'
import { CSServiceCentre }        from './pages/CSServiceCentre'

const cfg = DEPT_MAP['customer-success']

export function CustomerSuccessPortal() {
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
        <Route path="agent-workspace" element={<CSAgentWorkspace />} />
        <Route path="accounts"        element={<CSAccounts />} />
        <Route path="health"          element={<CSHealth />} />
        <Route path="qbrs"            element={<CSQBRs />} />
        <Route path="renewals"        element={<CSRenewals />} />
        <Route path="onboarding"      element={<CSOnboarding />} />
        <Route path="expansion"       element={<CSExpansion />} />
        <Route path="playbooks"       element={<CSPlaybooks />} />
        <Route path="routing"         element={<CSRouting />} />
        <Route path="supervisor"      element={<CSSupervisorView />} />
        <Route path="schedule"        element={<CSSchedule />} />
        <Route path="analytics"       element={<CSAnalytics />} />
        <Route path="skills"          element={<CSSkills />} />
        <Route path="service-centre"  element={<CSServiceCentre />} />
        <Route path="*"               element={<Navigate to="/kangqore-view/team/customer-success" replace />} />
      </Routes>
    </DeptShell>
  )
}
