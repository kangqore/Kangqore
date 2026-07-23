import { CustomerProvisionPage } from './CustomerProvisionPage'
export function CustomerFourteenPage() {
  return <CustomerProvisionPage cfg={{
    name: 'Customer Fourteen', slug: 'fourteen', subdomain: 'customer-fourteen',
    industry: 'Energy & Utilities', planTier: 'ENTERPRISE',
    size: '201–500 employees', oisBaseline: 67.4, oisTarget: 84.0,
    modules: ['projects', 'finance', 'operations', 'analytics', 'hr', 'leadership'],
    accentColor: '#ef4444',
  }} />
}
