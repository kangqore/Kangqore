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
import { SupplyChainProduction }  from './pages/SupplyChainProduction'
import { SupplyChainInventory }   from './pages/SupplyChainInventory'
import { SupplyChainSuppliers }   from './pages/SupplyChainSuppliers'
import { SupplyChainQC }          from './pages/SupplyChainQC'
import { SupplyChainProcurement } from './pages/SupplyChainProcurement'
import { SupplyChainLogistics }   from './pages/SupplyChainLogistics'
import { SupplyChainBOM }         from './pages/SupplyChainBOM'
import { SupplyChainSchedule }    from './pages/SupplyChainSchedule'
import { SupplyChainAnalytics }   from './pages/SupplyChainAnalytics'
import { SupplyChainSkills }      from './pages/SupplyChainSkills'
import { SupplyChainServiceCentre } from './pages/SupplyChainServiceCentre'

const cfg = DEPT_MAP['supply-chain']

export function SupplyChainPortal() {
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
        <Route path="production"    element={<SupplyChainProduction />} />
        <Route path="inventory"     element={<SupplyChainInventory />} />
        <Route path="suppliers"     element={<SupplyChainSuppliers />} />
        <Route path="qc"            element={<SupplyChainQC />} />
        <Route path="procurement"   element={<SupplyChainProcurement />} />
        <Route path="logistics"     element={<SupplyChainLogistics />} />
        <Route path="bom"           element={<SupplyChainBOM />} />
        <Route path="schedule"      element={<SupplyChainSchedule />} />
        <Route path="analytics"     element={<SupplyChainAnalytics />} />
        <Route path="skills"        element={<SupplyChainSkills />} />
        <Route path="service-centre"element={<SupplyChainServiceCentre />} />
        <Route path="*"             element={<Navigate to="/kangqore-view/team/supply-chain" replace />} />
      </Routes>
    </DeptShell>
  )
}
