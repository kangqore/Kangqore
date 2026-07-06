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
import { SalesPipeline }          from './pages/SalesPipeline'
import { SalesLeads }             from './pages/SalesLeads'
import { SalesProposals }         from './pages/SalesProposals'
import { SalesAccounts }          from './pages/SalesAccounts'
import { SalesTargets }           from './pages/SalesTargets'
import { SalesContracts }         from './pages/SalesContracts'
import { SalesAgentWorkspace }    from './pages/SalesAgentWorkspace'
import { SalesPlaybooks }         from './pages/SalesPlaybooks'
import { SalesRouting }           from './pages/SalesRouting'
import { SalesSupervisorView }    from './pages/SalesSupervisorView'
import { SalesSchedule }          from './pages/SalesSchedule'
import { SalesAnalytics }         from './pages/SalesAnalytics'
import { SalesSkills }            from './pages/SalesSkills'
import { SalesServiceCentre }     from './pages/SalesServiceCentre'

const cfg = DEPT_MAP['sales']

export function SalesPortal() {
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
        <Route path="agent-workspace" element={<SalesAgentWorkspace />} />
        <Route path="pipeline"        element={<SalesPipeline />} />
        <Route path="leads"           element={<SalesLeads />} />
        <Route path="proposals"       element={<SalesProposals />} />
        <Route path="accounts"        element={<SalesAccounts />} />
        <Route path="targets"         element={<SalesTargets />} />
        <Route path="contracts"       element={<SalesContracts />} />
        <Route path="playbooks"       element={<SalesPlaybooks />} />
        <Route path="routing"         element={<SalesRouting />} />
        <Route path="supervisor"      element={<SalesSupervisorView />} />
        <Route path="schedule"        element={<SalesSchedule />} />
        <Route path="analytics"       element={<SalesAnalytics />} />
        <Route path="skills"          element={<SalesSkills />} />
        <Route path="service-centre"  element={<SalesServiceCentre />} />
        <Route path="*"               element={<Navigate to="/kangqore-view/team/sales" replace />} />
      </Routes>
    </DeptShell>
  )
}
