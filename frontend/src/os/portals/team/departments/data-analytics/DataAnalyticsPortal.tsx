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
import { DADashboards }     from './pages/DADashboards'
import { DAReports }        from './pages/DAReports'
import { DAKPIRegistry }    from './pages/DAKPIRegistry'
import { DADataSources }    from './pages/DADataSources'
import { DAGovernance }     from './pages/DAGovernance'
import { DABIRequests }     from './pages/DABIRequests'
import { DAForecasting }    from './pages/DAForecasting'
import { DAAnalytics }      from './pages/DAAnalytics'
import { DASkills }         from './pages/DASkills'
import { DASchedule }       from './pages/DASchedule'
import { DAServiceCentre }  from './pages/DAServiceCentre'

const cfg = DEPT_MAP['data-analytics']

export function DataAnalyticsPortal() {
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
        <Route path="dashboards"      element={<DADashboards />} />
        <Route path="reports"         element={<DAReports />} />
        <Route path="kpi-registry"    element={<DAKPIRegistry />} />
        <Route path="data-sources"    element={<DADataSources />} />
        <Route path="governance"      element={<DAGovernance />} />
        <Route path="bi-requests"     element={<DABIRequests />} />
        <Route path="forecasting"     element={<DAForecasting />} />
        <Route path="analytics"       element={<DAAnalytics />} />
        <Route path="skills"          element={<DASkills />} />
        <Route path="schedule"        element={<DASchedule />} />
        <Route path="service-centre"  element={<DAServiceCentre />} />
        <Route path="*"               element={<Navigate to="/kangqore-view/team/data-analytics" replace />} />
      </Routes>
    </DeptShell>
  )
}
