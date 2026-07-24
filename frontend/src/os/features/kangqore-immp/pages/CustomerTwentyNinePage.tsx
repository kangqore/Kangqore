import { CustomerProvisionPage } from './CustomerProvisionPage'

export function CustomerTwentyNinePage() {
  return (
    <CustomerProvisionPage cfg={{
      name:            'PrismFX Payments',
      slug:            'twenty-nine',
      subdomain:       'customer-twenty-nine',
      industry:        'Financial Technology',
      planTier:        'PRO',
      size:            '250–500 employees',
      oisBaseline:     63.2,
      oisTarget:       77.0,
      modules:         ['WAANDA', 'AEGIS', 'Finance', 'OIS', 'Trade-Compliance'],
      accentColor:     '#f59e0b',
      verticalEdition: 'fintech',
      personaName:     'FINX',
    }} />
  )
}
