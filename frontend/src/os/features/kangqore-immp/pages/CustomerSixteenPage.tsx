import { CustomerProvisionPage } from './CustomerProvisionPage'
export function CustomerSixteenPage() {
  return <CustomerProvisionPage cfg={{
    name: 'Customer Sixteen', slug: 'sixteen', subdomain: 'customer-sixteen',
    industry: 'CleanTech & Sustainability', planTier: 'PRO',
    size: '11–50 employees', oisBaseline: 53.6, oisTarget: 72.0,
    modules: ['projects', 'finance', 'operations', 'analytics'],
    accentColor: '#22c55e',
  }} />
}
