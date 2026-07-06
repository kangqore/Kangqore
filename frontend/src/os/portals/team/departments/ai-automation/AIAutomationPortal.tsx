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
import { AIAgentRegistry }  from './pages/AIAgentRegistry'
import { AIWorkflows }      from './pages/AIWorkflows'
import { AILLMOps }         from './pages/AILLMOps'
import { AIAutomationHub }  from './pages/AIAutomationHub'
import { AIGovernance }     from './pages/AIGovernance'
import { AIExperiments }    from './pages/AIExperiments'
import { AIAnalytics }      from './pages/AIAnalytics'
import { AISkills }         from './pages/AISkills'
import { AISchedule }       from './pages/AISchedule'
import { AIServiceCentre }  from './pages/AIServiceCentre'

const cfg = DEPT_MAP['ai-automation']

export function AIAutomationPortal() {
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
        <Route path="agents"          element={<AIAgentRegistry />} />
        <Route path="workflows"       element={<AIWorkflows />} />
        <Route path="llm-ops"         element={<AILLMOps />} />
        <Route path="automation"      element={<AIAutomationHub />} />
        <Route path="governance"      element={<AIGovernance />} />
        <Route path="experiments"     element={<AIExperiments />} />
        <Route path="analytics"       element={<AIAnalytics />} />
        <Route path="skills"          element={<AISkills />} />
        <Route path="schedule"        element={<AISchedule />} />
        <Route path="service-centre"  element={<AIServiceCentre />} />
        <Route path="*"               element={<Navigate to="/kangqore-view/team/ai-automation" replace />} />
      </Routes>
    </DeptShell>
  )
}
