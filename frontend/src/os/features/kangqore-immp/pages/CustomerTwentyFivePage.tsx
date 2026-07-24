import { CustomerProvisionPage } from './CustomerProvisionPage'

export function CustomerTwentyFivePage() {
  return (
    <CustomerProvisionPage cfg={{
      name:            'Stellaris Law Group',
      slug:            'twenty-five',
      subdomain:       'customer-twenty-five',
      industry:        'Legal Technology',
      planTier:        'PRO',
      size:            '200–400 employees',
      oisBaseline:     62.1,
      oisTarget:       75.0,
      modules:         ['WAANDA', 'AEGIS', 'Projects', 'KIMMP', 'OIS', 'Matter-Management'],
      accentColor:     '#3b82f6',
      verticalEdition: 'legaltech',
      personaName:     'LEX',
    }} />
  )
}
