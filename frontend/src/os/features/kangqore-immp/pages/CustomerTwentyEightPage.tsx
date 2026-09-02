import { CustomerProvisionPage } from './CustomerProvisionPage'

export function CustomerTwentyEightPage() {
  return (
    <CustomerProvisionPage cfg={{
      name:            'Quantex Trading Systems',
      slug:            'twenty-eight',
      subdomain:       'customer-twenty-eight',
      industry:        'Financial Technology',
      planTier:        'ENTERPRISE',
      size:            '500–900 employees',
      oisBaseline:     69.9,
      oisTarget:       83.0,
      modules:         ['WAANDA', 'HANUMANAS', 'Finance', 'KIMMP', 'OIS', 'Trade-Compliance'],
      accentColor:     '#f59e0b',
      verticalEdition: 'fintech',
      personaName:     'FINX',
    }} />
  )
}
