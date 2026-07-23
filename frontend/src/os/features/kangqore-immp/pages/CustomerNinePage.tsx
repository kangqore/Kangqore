import { CustomerProvisionPage } from './CustomerProvisionPage'
export function CustomerNinePage() {
  return <CustomerProvisionPage cfg={{
    name: 'Customer Nine', slug: 'nine', subdomain: 'customer-nine',
    industry: 'Logistics & Supply Chain', planTier: 'PRO',
    size: '51–200 employees', oisBaseline: 58.0, oisTarget: 73.0,
    modules: ['projects', 'finance', 'operations', 'analytics'],
    accentColor: '#14b8a6',
  }} />
}
