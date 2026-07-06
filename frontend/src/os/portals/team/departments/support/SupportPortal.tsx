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
import { SupportQueue }           from './pages/SupportQueue'
import { SupportSLA }             from './pages/SupportSLA'
import { SupportEscalations }     from './pages/SupportEscalations'
import { SupportCSAT }            from './pages/SupportCSAT'
import { SupportKnowledgeBase }   from './pages/SupportKnowledgeBase'
import { SupportAgentPerformance } from './pages/SupportAgentPerformance'
import { SupportBacklog }         from './pages/SupportBacklog'
import { SupportAgentWorkspace }  from './pages/SupportAgentWorkspace'
import { SupportPlaybooks }       from './pages/SupportPlaybooks'
import { SupportRouting }         from './pages/SupportRouting'
import { SupportOnCall }          from './pages/SupportOnCall'
import { SupportSupervisorView }  from './pages/SupportSupervisorView'
import { SupportSchedule }        from './pages/SupportSchedule'
import { SupportAnalytics }       from './pages/SupportAnalytics'
import { SupportSkills }          from './pages/SupportSkills'
import { SupportServiceCentre }   from './pages/SupportServiceCentre'

const cfg = DEPT_MAP['support']

export function SupportPortal() {
  return (
    <DeptShell config={cfg}>
      <Routes>
        <Route index                 element={<DeptWorkspace config={cfg} />} />
        <Route path="my-work"        element={<TeamTasks />} />
        <Route path="announcements"  element={<TeamAnnouncements />} />
        <Route path="resources"      element={<TeamResources />} />
        <Route path="members"        element={<SharedMembers />} />
        <Route path="standups"       element={<SharedStandups />} />
        <Route path="kimmp"          element={<SharedKIMMP config={cfg} />} />
        <Route path="queue"          element={<SupportQueue />} />
        <Route path="sla"            element={<SupportSLA />} />
        <Route path="escalations"    element={<SupportEscalations />} />
        <Route path="csat"           element={<SupportCSAT />} />
        <Route path="knowledge"      element={<SupportKnowledgeBase />} />
        <Route path="performance"    element={<SupportAgentPerformance />} />
        <Route path="backlog"        element={<SupportBacklog />} />
        <Route path="agent-workspace"element={<SupportAgentWorkspace />} />
        <Route path="playbooks"      element={<SupportPlaybooks />} />
        <Route path="routing"        element={<SupportRouting />} />
        <Route path="on-call"        element={<SupportOnCall />} />
        <Route path="supervisor"     element={<SupportSupervisorView />} />
        <Route path="schedule"       element={<SupportSchedule />} />
        <Route path="analytics"      element={<SupportAnalytics />} />
        <Route path="skills"         element={<SupportSkills />} />
        <Route path="service-centre" element={<SupportServiceCentre />} />
        <Route path="*"              element={<Navigate to="/kangqore-view/team/support" replace />} />
      </Routes>
    </DeptShell>
  )
}
