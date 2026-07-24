import { CustomerProvisionPage } from './CustomerProvisionPage'

export function CustomerTwentyOnePage() {
  return (
    <CustomerProvisionPage cfg={{
      name:            'Meridian Health Systems',
      slug:            'twenty-one',
      subdomain:       'customer-twenty-one',
      industry:        'Healthcare Technology',
      planTier:        'ENTERPRISE',
      size:            '1,200–1,800 employees',
      oisBaseline:     71.3,
      oisTarget:       85.0,
      modules:         ['WAANDA', 'AEGIS', 'Projects', 'KIMMP', 'OIS', 'Clinical-Ops'],
      accentColor:     '#10b981',
      verticalEdition: 'healthtech',
      personaName:     'ARIA',
    }} />
  )
}
