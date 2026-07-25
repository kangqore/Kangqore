import { CustomerProvisionPage } from './CustomerProvisionPage'
export function CustomerThirtyEightPage() {
  return <CustomerProvisionPage cfg={{ customerRef: 'C38', name: 'Nimble Health', industry: 'HealthTech', region: 'EU', planTier: 'PRO', currency: 'EUR', oisBaseline: 61.2, oisCurrent: 67.8, complianceFlags: ['GDPR_EU', 'MDR_CERTIFIED'] }} />
}
