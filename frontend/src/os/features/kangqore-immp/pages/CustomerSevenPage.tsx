import { CustomerProvisionPage } from './CustomerProvisionPage'
export function CustomerSevenPage() {
  return <CustomerProvisionPage cfg={{
    name: 'Customer Seven', slug: 'seven', subdomain: 'customer-seven',
    industry: 'Manufacturing & Industry', planTier: 'ENTERPRISE',
    size: '201–500 employees', oisBaseline: 52.0, oisTarget: 68.0,
    modules: ['projects', 'finance', 'sales', 'hr', 'operations', 'analytics'],
    accentColor: '#f97316',
  }} />
}
