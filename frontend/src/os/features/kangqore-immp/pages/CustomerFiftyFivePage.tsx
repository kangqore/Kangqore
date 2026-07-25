import { CustomerProvisionPage } from './CustomerProvisionPage'
export function CustomerFiftyFivePage() {
  return <CustomerProvisionPage cfg={{ customerRef: 'C55', name: 'Starling PropTech', industry: 'Enterprise', region: 'UK', planTier: 'PRO', currency: 'GBP', oisBaseline: 51.8, oisCurrent: 58.4, complianceFlags: ['UK_GDPR', 'ISO_27001']  }} />
}
