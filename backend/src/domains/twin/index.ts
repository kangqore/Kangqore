// ---------------------------------------------------------------------------
// Twin Network Self-Registration
//
// Import this file to register all twin networks into TwinNetworkRegistry.
// WAANDA.boot() calls `await import('../domains/twin')` — it does not need
// to name CustomerTwinNetwork or FinanceTwinNetwork individually.
// ---------------------------------------------------------------------------

import { TwinNetworkRegistry } from './TwinNetworkRegistry'
import { CustomerTwinNetwork }  from './CustomerTwinNetwork'
import { FinanceTwinNetwork }   from './FinanceTwinNetwork'

const registry = TwinNetworkRegistry.getInstance()
registry.registerNetwork(new CustomerTwinNetwork())
registry.registerNetwork(new FinanceTwinNetwork())
