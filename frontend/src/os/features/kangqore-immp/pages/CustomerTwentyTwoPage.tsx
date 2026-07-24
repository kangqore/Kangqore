import { CustomerProvisionPage } from './CustomerProvisionPage'

export function CustomerTwentyTwoPage() {
  return (
    <CustomerProvisionPage cfg={{
      name:            'Veridian Clinic Group',
      slug:            'twenty-two',
      subdomain:       'customer-twenty-two',
      industry:        'Healthcare Technology',
      planTier:        'PRO',
      size:            '400–700 employees',
      oisBaseline:     64.8,
      oisTarget:       78.0,
      modules:         ['WAANDA', 'AEGIS', 'Projects', 'KIMMP', 'OIS', 'Clinical-Ops'],
      accentColor:     '#10b981',
      verticalEdition: 'healthtech',
      personaName:     'ARIA',
    }} />
  )
}
