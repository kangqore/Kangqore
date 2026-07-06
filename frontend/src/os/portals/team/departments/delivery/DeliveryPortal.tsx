import { Routes, Route, Navigate } from 'react-router-dom'
import { DeptShell }              from '../../DeptShell'
import { DEPT_MAP }               from '../../deptConfigs'
import { DeptWorkspace }          from '../shared/DeptWorkspace'
import { SharedMembers }          from '../shared/SharedMembers'
import { SharedStandups }         from '../shared/SharedStandups'
import { SharedKIMMP }            from '../shared/SharedKIMMP'
import { TeamTasks }              from '../../pages/TeamTasks'
import { TeamAnnouncements }      from '../../pages/TeamAnnouncements'
import { DeliveryProjects }       from './pages/DeliveryProjects'
import { DeliveryResources }      from './pages/DeliveryResources'
import { DeliveryMilestones }     from './pages/DeliveryMilestones'
import { DeliveryRisks }          from './pages/DeliveryRisks'
import { DeliverySOWs }           from './pages/DeliverySOWs'
import { DeliveryReports }        from './pages/DeliveryReports'
import { DeliveryPlaybooks }      from './pages/DeliveryPlaybooks'
import { DeliveryOnCall }         from './pages/DeliveryOnCall'
import { DeliverySupervisorView } from './pages/DeliverySupervisorView'
import { DeliverySchedule }       from './pages/DeliverySchedule'
import { DeliveryAnalytics }      from './pages/DeliveryAnalytics'
import { DeliverySkills }         from './pages/DeliverySkills'
import { DeliveryServiceCentre }  from './pages/DeliveryServiceCentre'

const cfg = DEPT_MAP['delivery']

export function DeliveryPortal() {
  return (
    <DeptShell config={cfg}>
      <Routes>
        <Route index                 element={<DeptWorkspace config={cfg} />} />
        <Route path="my-work"        element={<TeamTasks />} />
        <Route path="announcements"  element={<TeamAnnouncements />} />
        <Route path="resources"      element={<DeliveryResources />} />
        <Route path="members"        element={<SharedMembers />} />
        <Route path="standups"       element={<SharedStandups />} />
        <Route path="kimmp"          element={<SharedKIMMP config={cfg} />} />
        <Route path="projects"       element={<DeliveryProjects />} />
        <Route path="milestones"     element={<DeliveryMilestones />} />
        <Route path="risks"          element={<DeliveryRisks />} />
        <Route path="sows"           element={<DeliverySOWs />} />
        <Route path="reports"        element={<DeliveryReports />} />
        <Route path="playbooks"      element={<DeliveryPlaybooks />} />
        <Route path="on-call"        element={<DeliveryOnCall />} />
        <Route path="supervisor"     element={<DeliverySupervisorView />} />
        <Route path="schedule"       element={<DeliverySchedule />} />
        <Route path="analytics"      element={<DeliveryAnalytics />} />
        <Route path="skills"         element={<DeliverySkills />} />
        <Route path="service-centre" element={<DeliveryServiceCentre />} />
        <Route path="*"              element={<Navigate to="/kangqore-view/team/delivery" replace />} />
      </Routes>
    </DeptShell>
  )
}
