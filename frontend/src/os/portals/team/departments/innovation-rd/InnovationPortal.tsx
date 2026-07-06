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
import { InnovIdeas }       from './pages/InnovIdeas'
import { InnovExperiments } from './pages/InnovExperiments'
import { InnovPrototypes }  from './pages/InnovPrototypes'
import { InnovResearch }    from './pages/InnovResearch'
import { InnovPatents }     from './pages/InnovPatents'
import { InnovPartners }    from './pages/InnovPartners'
import { InnovAnalytics }   from './pages/InnovAnalytics'
import { InnovSkills }      from './pages/InnovSkills'
import { InnovSchedule }    from './pages/InnovSchedule'
import { InnovServiceCentre } from './pages/InnovServiceCentre'

const cfg = DEPT_MAP['innovation-rd']

export function InnovationPortal() {
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
        <Route path="ideas"           element={<InnovIdeas />} />
        <Route path="experiments"     element={<InnovExperiments />} />
        <Route path="prototypes"      element={<InnovPrototypes />} />
        <Route path="research"        element={<InnovResearch />} />
        <Route path="patents"         element={<InnovPatents />} />
        <Route path="partners"        element={<InnovPartners />} />
        <Route path="analytics"       element={<InnovAnalytics />} />
        <Route path="skills"          element={<InnovSkills />} />
        <Route path="schedule"        element={<InnovSchedule />} />
        <Route path="service-centre"  element={<InnovServiceCentre />} />
        <Route path="*"               element={<Navigate to="/kangqore-view/team/innovation-rd" replace />} />
      </Routes>
    </DeptShell>
  )
}
