import { CustomerProvisionPage } from './CustomerProvisionPage'
export function CustomerEightPage() {
  return <CustomerProvisionPage cfg={{
    name: 'Customer Eight', slug: 'eight', subdomain: 'customer-eight',
    industry: 'Education & EdTech', planTier: 'STARTER',
    size: '1–50 employees', oisBaseline: 45.0, oisTarget: 60.0,
    modules: ['projects', 'sales', 'hr'],
    accentColor: '#ec4899',
  }} />
}
