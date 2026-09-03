import { CustomerProvisionPage } from './CustomerProvisionPage'

export function CustomerTwentyFourPage() {
  return (
    <CustomerProvisionPage cfg={{
      name:            'Apex Legal Partners LLP',
      slug:            'twenty-four',
      subdomain:       'customer-twenty-four',
      industry:        'Legal Technology',
      planTier:        'ENTERPRISE',
      size:            '600–1,000 employees',
      oisBaseline:     68.7,
      oisTarget:       82.0,
      modules:         ['WAANDA', 'HANUMANAS', 'Projects', 'KIMMP', 'OIS', 'Matter-Management'],
      accentColor:     '#3b82f6',
      verticalEdition: 'legaltech',
      personaName:     'LEX',
    }} />
  )
}
