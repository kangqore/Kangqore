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
import { MarketingCampaigns }    from './pages/MarketingCampaigns'
import { MarketingContent }      from './pages/MarketingContent'
import { MarketingBrand }        from './pages/MarketingBrand'
import { MarketingSEO }          from './pages/MarketingSEO'
import { MarketingEvents }       from './pages/MarketingEvents'
import { MarketingBudget }       from './pages/MarketingBudget'
import { MarketingPlaybooks }    from './pages/MarketingPlaybooks'
import { MarketingSchedule }     from './pages/MarketingSchedule'
import { MarketingAnalytics }    from './pages/MarketingAnalytics'
import { MarketingSkills }       from './pages/MarketingSkills'
import { MarketingServiceCentre } from './pages/MarketingServiceCentre'

const cfg = DEPT_MAP['marketing']

export function MarketingPortal() {
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
        <Route path="campaigns"       element={<MarketingCampaigns />} />
        <Route path="content"         element={<MarketingContent />} />
        <Route path="brand"           element={<MarketingBrand />} />
        <Route path="seo"             element={<MarketingSEO />} />
        <Route path="events"          element={<MarketingEvents />} />
        <Route path="budget"          element={<MarketingBudget />} />
        <Route path="playbooks"       element={<MarketingPlaybooks />} />
        <Route path="schedule"        element={<MarketingSchedule />} />
        <Route path="analytics"       element={<MarketingAnalytics />} />
        <Route path="skills"          element={<MarketingSkills />} />
        <Route path="service-centre"  element={<MarketingServiceCentre />} />
        <Route path="*"               element={<Navigate to="/kangqore-view/team/marketing" replace />} />
      </Routes>
    </DeptShell>
  )
}
