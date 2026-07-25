import { CustomerProvisionPage } from './CustomerProvisionPage'
export function CustomerFortyEightPage() {
  return <CustomerProvisionPage cfg={{ customerRef: 'C48', name: 'Ironclad Legal', industry: 'LegalTech', region: 'UK', planTier: 'PRO', currency: 'GBP', oisBaseline: 50.3, oisCurrent: 57.1, complianceFlags: ['UK_GDPR', 'SRA_REGULATED']  }} />
}
