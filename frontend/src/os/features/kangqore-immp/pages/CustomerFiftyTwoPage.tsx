import { CustomerProvisionPage } from './CustomerProvisionPage'
export function CustomerFiftyTwoPage() {
  return <CustomerProvisionPage cfg={{ customerRef: 'C52', name: 'Crescent Energy', industry: 'Enterprise', region: 'EU', planTier: 'PRO', currency: 'EUR', oisBaseline: 54.7, oisCurrent: 61.3, complianceFlags: ['GDPR_EU', 'ISO_27001']  }} />
}
