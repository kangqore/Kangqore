import { CustomerProvisionPage } from './CustomerProvisionPage'

export function CustomerTwentySevenPage() {
  return (
    <CustomerProvisionPage cfg={{
      name:            'Orbis Capital Management',
      slug:            'twenty-seven',
      subdomain:       'customer-twenty-seven',
      industry:        'Financial Technology',
      planTier:        'ENTERPRISE',
      size:            '900–1,400 employees',
      oisBaseline:     74.6,
      oisTarget:       88.0,
      modules:         ['WAANDA', 'AEGIS', 'Finance', 'KIMMP', 'OIS', 'Trade-Compliance'],
      accentColor:     '#f59e0b',
      verticalEdition: 'fintech',
      personaName:     'FINX',
    }} />
  )
}
