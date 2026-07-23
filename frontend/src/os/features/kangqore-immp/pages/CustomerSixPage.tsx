import { CustomerProvisionPage } from './CustomerProvisionPage'
export function CustomerSixPage() {
  return <CustomerProvisionPage cfg={{
    name: 'Customer Six', slug: 'six', subdomain: 'customer-six',
    industry: 'Healthcare Technology', planTier: 'PRO',
    size: '51–200 employees', oisBaseline: 60.0, oisTarget: 77.0,
    modules: ['projects', 'finance', 'sales', 'hr', 'operations'],
    accentColor: '#0ea5e9',
  }} />
}
