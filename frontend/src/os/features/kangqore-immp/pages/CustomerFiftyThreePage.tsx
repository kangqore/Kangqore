import { CustomerProvisionPage } from './CustomerProvisionPage'
export function CustomerFiftyThreePage() {
  return <CustomerProvisionPage cfg={{ customerRef: 'C53', name: 'Bluewater Marine', industry: 'Logistics', region: 'UK', planTier: 'PRO', currency: 'GBP', oisBaseline: 47.1, oisCurrent: 53.8, complianceFlags: ['UK_GDPR', 'ISO_27001']  }} />
}
