import { Routes, Route, Navigate } from 'react-router-dom'
import { DeptShell }           from '../../DeptShell'
import { DEPT_MAP }            from '../../deptConfigs'
import { DeptWorkspace }       from '../shared/DeptWorkspace'
import { SharedMembers }       from '../shared/SharedMembers'
import { SharedStandups }      from '../shared/SharedStandups'
import { SharedKIMMP }         from '../shared/SharedKIMMP'
import { TeamTasks }           from '../../pages/TeamTasks'
import { TeamAnnouncements }   from '../../pages/TeamAnnouncements'
import { TeamResources }       from '../../pages/TeamResources'
import { ProductRoadmap }      from './pages/ProductRoadmap'
import { ProductSprints }      from './pages/ProductSprints'
import { ProductFeatures }     from './pages/ProductFeatures'
import { ProductReleases }     from './pages/ProductReleases'
import { ProductResearch }     from './pages/ProductResearch'
import { ProductDesign }       from './pages/ProductDesign'
import { ProductPlaybooks }    from './pages/ProductPlaybooks'
import { ProductSchedule }     from './pages/ProductSchedule'
import { ProductAnalytics }    from './pages/ProductAnalytics'
import { ProductSkills }       from './pages/ProductSkills'
import { ProductServiceCentre }from './pages/ProductServiceCentre'

const cfg = DEPT_MAP['product']

export function ProductPortal() {
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
        <Route path="roadmap"         element={<ProductRoadmap />} />
        <Route path="sprints"         element={<ProductSprints />} />
        <Route path="features"        element={<ProductFeatures />} />
        <Route path="releases"        element={<ProductReleases />} />
        <Route path="research"        element={<ProductResearch />} />
        <Route path="design"          element={<ProductDesign />} />
        <Route path="playbooks"       element={<ProductPlaybooks />} />
        <Route path="schedule"        element={<ProductSchedule />} />
        <Route path="analytics"       element={<ProductAnalytics />} />
        <Route path="skills"          element={<ProductSkills />} />
        <Route path="service-centre"  element={<ProductServiceCentre />} />
        <Route path="*"               element={<Navigate to="/kangqore-view/team/product" replace />} />
      </Routes>
    </DeptShell>
  )
}
