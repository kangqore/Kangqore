import { CustomerProvisionPage } from './CustomerProvisionPage'
export function CustomerFiftyPage() {
  return <CustomerProvisionPage cfg={{ customerRef: 'C50', name: 'Quantum Asset Mgmt', industry: 'FinTech', region: 'US', planTier: 'ENTERPRISE', currency: 'USD', oisBaseline: 70.2, oisCurrent: 77.9, complianceFlags: ['SOC2_TYPE_II', 'FCA_AUTHORISED']  }} />
}
