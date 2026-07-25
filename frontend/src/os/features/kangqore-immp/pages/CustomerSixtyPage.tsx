import { CustomerProvisionPage } from './CustomerProvisionPage'
export function CustomerSixtyPage() {
  return <CustomerProvisionPage cfg={{ customerRef: 'C60', name: 'ReachOut Communications', industry: 'Technology', region: 'UK', planTier: 'STARTER', currency: 'GBP', oisBaseline: 39.7, oisCurrent: 46.1, complianceFlags: ['UK_GDPR']  }} />
}
