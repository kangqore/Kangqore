import { CustomerProvisionPage } from './CustomerProvisionPage'
export function CustomerSixtyFourPage() {
  return <CustomerProvisionPage cfg={{ customerRef: 'C64', name: 'Trident Aerospace', industry: 'Enterprise', region: 'US', planTier: 'ENTERPRISE', currency: 'USD', oisBaseline: 71.4, oisCurrent: 78.6, complianceFlags: ['SOC2_TYPE_II', 'ITAR_COMPLIANT']  }} />
}
