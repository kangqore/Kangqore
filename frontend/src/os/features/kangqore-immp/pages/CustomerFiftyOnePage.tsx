import { CustomerProvisionPage } from './CustomerProvisionPage'
export function CustomerFiftyOnePage() {
  return <CustomerProvisionPage cfg={{ customerRef: 'C51', name: 'Pinnacle Education', industry: 'EdTech', region: 'UK', planTier: 'STARTER', currency: 'GBP', oisBaseline: 38.4, oisCurrent: 44.2, complianceFlags: ['UK_GDPR']  }} />
}
