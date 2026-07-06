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
import { ITIncidents }      from './pages/ITIncidents'
import { ITServiceRequests } from './pages/ITServiceRequests'
import { ITChangeManagement } from './pages/ITChangeManagement'
import { ITAssets }         from './pages/ITAssets'
import { ITKnowledgeBase }  from './pages/ITKnowledgeBase'
import { ITInfrastructure } from './pages/ITInfrastructure'
import { ITSprintBoard }    from './pages/ITSprintBoard'
import { ITAutomations }      from './pages/ITAutomations'
import { ITApprovals }        from './pages/ITApprovals'
import { ITIntegrations }     from './pages/ITIntegrations'
import { ITAgentWorkspace }   from './pages/ITAgentWorkspace'
import { ITPlaybooks }        from './pages/ITPlaybooks'
import { ITRouting }          from './pages/ITRouting'
import { ITOnCall }           from './pages/ITOnCall'
import { ITSchedule }         from './pages/ITSchedule'
import { ITSupervisorView }   from './pages/ITSupervisorView'
import { ITAnalytics }        from './pages/ITAnalytics'
import { ITSkills }           from './pages/ITSkills'
import { ITServiceCentre }    from './pages/ITServiceCentre'

const cfg = DEPT_MAP['it']

export function ITPortal() {
  return (
    <DeptShell config={cfg}>
      <Routes>
        <Route index                   element={<DeptWorkspace config={cfg} />} />
        <Route path="my-work"          element={<TeamTasks />} />
        <Route path="announcements"    element={<TeamAnnouncements />} />
        <Route path="resources"        element={<TeamResources />} />
        <Route path="members"          element={<SharedMembers />} />
        <Route path="standups"         element={<SharedStandups />} />
        <Route path="kimmp"            element={<SharedKIMMP config={cfg} />} />
        <Route path="incidents"        element={<ITIncidents />} />
        <Route path="service-requests" element={<ITServiceRequests />} />
        <Route path="change-mgmt"      element={<ITChangeManagement />} />
        <Route path="assets"           element={<ITAssets />} />
        <Route path="knowledge-base"   element={<ITKnowledgeBase />} />
        <Route path="infrastructure"   element={<ITInfrastructure />} />
        <Route path="sprint-board"     element={<ITSprintBoard />} />
        <Route path="automations"     element={<ITAutomations />} />
        <Route path="approvals"       element={<ITApprovals />} />
        <Route path="integrations"    element={<ITIntegrations />} />
        <Route path="agent-workspace" element={<ITAgentWorkspace />} />
        <Route path="playbooks"       element={<ITPlaybooks />} />
        <Route path="routing"         element={<ITRouting />} />
        <Route path="on-call"         element={<ITOnCall />} />
        <Route path="schedule"        element={<ITSchedule />} />
        <Route path="supervisor"      element={<ITSupervisorView />} />
        <Route path="analytics"       element={<ITAnalytics />} />
        <Route path="skills"          element={<ITSkills />} />
        <Route path="service-centre"  element={<ITServiceCentre />} />
        <Route path="*"               element={<Navigate to="/kangqore-view/team/it" replace />} />
      </Routes>
    </DeptShell>
  )
}
