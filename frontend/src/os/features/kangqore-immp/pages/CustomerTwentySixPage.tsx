import { CustomerProvisionPage } from './CustomerProvisionPage'

export function CustomerTwentySixPage() {
  return (
    <CustomerProvisionPage cfg={{
      name:            'ClearPath Compliance Ltd',
      slug:            'twenty-six',
      subdomain:       'customer-twenty-six',
      industry:        'Legal Technology',
      planTier:        'PRO',
      size:            '150–300 employees',
      oisBaseline:     59.4,
      oisTarget:       73.0,
      modules:         ['WAANDA', 'AEGIS', 'Projects', 'OIS', 'Matter-Management'],
      accentColor:     '#3b82f6',
      verticalEdition: 'legaltech',
      personaName:     'LEX',
    }} />
  )
}
