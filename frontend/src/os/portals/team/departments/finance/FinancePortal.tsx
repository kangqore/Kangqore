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
import { FinanceBudget }    from './pages/FinanceBudget'
import { FinanceInvoices }  from './pages/FinanceInvoices'
import { FinanceExpenses }  from './pages/FinanceExpenses'
import { FinanceForecasting } from './pages/FinanceForecasting'
import { FinanceMonthEnd }  from './pages/FinanceMonthEnd'
import { FinanceApprovals } from './pages/FinanceApprovals'
import { FinanceVendors }   from './pages/FinanceVendors'
import { FinanceSchedule }  from './pages/FinanceSchedule'
import { FinanceAnalytics } from './pages/FinanceAnalytics'
import { FinanceSkills }    from './pages/FinanceSkills'
import { FinanceServiceCentre } from './pages/FinanceServiceCentre'

const cfg = DEPT_MAP['finance']

export function FinancePortal() {
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
        <Route path="budget"        element={<FinanceBudget />} />
        <Route path="invoices"      element={<FinanceInvoices />} />
        <Route path="expenses"      element={<FinanceExpenses />} />
        <Route path="forecasting"   element={<FinanceForecasting />} />
        <Route path="month-end"     element={<FinanceMonthEnd />} />
        <Route path="approvals"     element={<FinanceApprovals />} />
        <Route path="vendors"       element={<FinanceVendors />} />
        <Route path="schedule"      element={<FinanceSchedule />} />
        <Route path="analytics"     element={<FinanceAnalytics />} />
        <Route path="skills"        element={<FinanceSkills />} />
        <Route path="service-centre"element={<FinanceServiceCentre />} />
        <Route path="*"             element={<Navigate to="/kangqore-view/team/finance" replace />} />
      </Routes>
    </DeptShell>
  )
}
