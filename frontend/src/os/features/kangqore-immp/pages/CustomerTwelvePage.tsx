import { CustomerProvisionPage } from './CustomerProvisionPage'
export function CustomerTwelvePage() {
  return <CustomerProvisionPage cfg={{
    name: 'Customer Twelve', slug: 'twelve', subdomain: 'customer-twelve',
    industry: 'PropTech', planTier: 'PRO',
    size: '11–50 employees', oisBaseline: 55.8, oisTarget: 74.0,
    modules: ['projects', 'sales', 'finance', 'analytics'],
    accentColor: '#f59e0b',
  }} />
}
