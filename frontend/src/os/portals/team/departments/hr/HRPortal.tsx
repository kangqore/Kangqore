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
import { HRHeadcount }      from './pages/HRHeadcount'
import { HRRecruitment }    from './pages/HRRecruitment'
import { HROnboarding }     from './pages/HROnboarding'
import { HRPerformance }    from './pages/HRPerformance'
import { HRLeave }          from './pages/HRLeave'
import { HRPolicies }       from './pages/HRPolicies'
import { HRTraining }       from './pages/HRTraining'
import { HRPlaybooks }      from './pages/HRPlaybooks'
import { HRSchedule }       from './pages/HRSchedule'
import { HRAnalytics }      from './pages/HRAnalytics'
import { HRSkills }         from './pages/HRSkills'
import { HRServiceCentre }  from './pages/HRServiceCentre'

const cfg = DEPT_MAP['hr']

export function HRPortal() {
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
        <Route path="headcount"     element={<HRHeadcount />} />
        <Route path="recruitment"   element={<HRRecruitment />} />
        <Route path="onboarding"    element={<HROnboarding />} />
        <Route path="performance"   element={<HRPerformance />} />
        <Route path="leave"         element={<HRLeave />} />
        <Route path="policies"      element={<HRPolicies />} />
        <Route path="training"      element={<HRTraining />} />
        <Route path="playbooks"     element={<HRPlaybooks />} />
        <Route path="schedule"      element={<HRSchedule />} />
        <Route path="analytics"     element={<HRAnalytics />} />
        <Route path="skills"        element={<HRSkills />} />
        <Route path="service-centre"element={<HRServiceCentre />} />
        <Route path="*"             element={<Navigate to="/kangqore-view/team/hr" replace />} />
      </Routes>
    </DeptShell>
  )
}
