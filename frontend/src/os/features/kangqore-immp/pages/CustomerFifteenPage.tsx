import { CustomerProvisionPage } from './CustomerProvisionPage'
export function CustomerFifteenPage() {
  return <CustomerProvisionPage cfg={{
    name: 'Customer Fifteen', slug: 'fifteen', subdomain: 'customer-fifteen',
    industry: 'Media & Entertainment', planTier: 'PRO',
    size: '51–200 employees', oisBaseline: 58.2, oisTarget: 77.0,
    modules: ['projects', 'sales', 'analytics', 'operations'],
    accentColor: '#ec4899',
  }} />
}
