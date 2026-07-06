import { Routes, Route } from 'react-router-dom'
import '../../os.css'
import { DepartmentSelector }  from './DepartmentSelector'
import { ITPortal }            from './departments/it/ITPortal'
import { HRPortal }            from './departments/hr/HRPortal'
import { FinancePortal }       from './departments/finance/FinancePortal'
import { SecurityPortal }      from './departments/security/SecurityPortal'
import { LegalPortal }         from './departments/legal/LegalPortal'
import { SupportPortal }       from './departments/support/SupportPortal'
import { FacilitiesPortal }    from './departments/facilities/FacilitiesPortal'
import { SupplyChainPortal }   from './departments/supply-chain/SupplyChainPortal'
import { TeamServiceCentre }        from './pages/TeamServiceCentre'
import { MarketingPortal }          from './departments/marketing/MarketingPortal'
import { SalesPortal }              from './departments/sales/SalesPortal'
import { CustomerSuccessPortal }    from './departments/customer-success/CustomerSuccessPortal'
import { ProductPortal }            from './departments/product/ProductPortal'
import { EngineeringPortal }        from './departments/engineering/EngineeringPortal'
import { DeliveryPortal }           from './departments/delivery/DeliveryPortal'
import { RiskCompliancePortal }     from './departments/risk-compliance/RiskCompliancePortal'
import { ProcurementPortal }        from './departments/procurement/ProcurementPortal'
import { DataAnalyticsPortal }      from './departments/data-analytics/DataAnalyticsPortal'
import { AIAutomationPortal }       from './departments/ai-automation/AIAutomationPortal'
import { InnovationPortal }         from './departments/innovation-rd/InnovationPortal'
import { OperationsPortal }         from './departments/operations/OperationsPortal'

export function TeamPortal() {
  return (
    <Routes>
      <Route index                      element={<DepartmentSelector />} />
      <Route path="it/*"                element={<ITPortal />} />
      <Route path="hr/*"                element={<HRPortal />} />
      <Route path="finance/*"           element={<FinancePortal />} />
      <Route path="security/*"          element={<SecurityPortal />} />
      <Route path="legal/*"             element={<LegalPortal />} />
      <Route path="support/*"           element={<SupportPortal />} />
      <Route path="facilities/*"        element={<FacilitiesPortal />} />
      <Route path="supply-chain/*"      element={<SupplyChainPortal />} />
      <Route path="marketing/*"         element={<MarketingPortal />} />
      <Route path="sales/*"             element={<SalesPortal />} />
      <Route path="customer-success/*"  element={<CustomerSuccessPortal />} />
      <Route path="product/*"           element={<ProductPortal />} />
      <Route path="engineering/*"       element={<EngineeringPortal />} />
      <Route path="delivery/*"          element={<DeliveryPortal />} />
      <Route path="risk-compliance/*"   element={<RiskCompliancePortal />} />
      <Route path="procurement/*"       element={<ProcurementPortal />} />
      <Route path="data-analytics/*"    element={<DataAnalyticsPortal />} />
      <Route path="ai-automation/*"     element={<AIAutomationPortal />} />
      <Route path="innovation-rd/*"     element={<InnovationPortal />} />
      <Route path="operations/*"        element={<OperationsPortal />} />
      <Route path="service-centre/*"    element={<TeamServiceCentre />} />
    </Routes>
  )
}
