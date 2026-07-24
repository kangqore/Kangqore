import { CustomerProvisionPage } from './CustomerProvisionPage'

export function CustomerTwentyThreePage() {
  return (
    <CustomerProvisionPage cfg={{
      name:            'NovaCare Diagnostics',
      slug:            'twenty-three',
      subdomain:       'customer-twenty-three',
      industry:        'Healthcare Technology',
      planTier:        'STARTER',
      size:            '80–150 employees',
      oisBaseline:     55.2,
      oisTarget:       70.0,
      modules:         ['WAANDA', 'OIS', 'Clinical-Ops', 'Projects'],
      accentColor:     '#10b981',
      verticalEdition: 'healthtech',
      personaName:     'ARIA',
    }} />
  )
}
