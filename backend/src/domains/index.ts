// ---------------------------------------------------------------------------
// Enterprise Domain Self-Registration
//
// Import this file once and all 4 domains register themselves into the
// DomainRegistry. WAANDA.boot() calls `await import('../domains')` —
// it does not need to name each domain individually. This is Phase C:
// registration instead of imports.
// ---------------------------------------------------------------------------

import { DomainRegistry }  from '../kangqore-view/edf/core/DomainRegistry'
import { SalesDomain }     from './sales/SalesDomain'
import { CustomerDomain }  from './customer/CustomerDomain'
import { AnalyticsDomain } from './analytics/AnalyticsDomain'
import { SimulationDomain } from './simulation/SimulationDomain'

for (const domain of [SalesDomain, CustomerDomain, AnalyticsDomain, SimulationDomain]) {
  try {
    DomainRegistry.register(domain)
  } catch {
    // idempotent — already registered on re-import (dev HMR etc.)
  }
}
