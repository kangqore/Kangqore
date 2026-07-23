import { CustomerProvisionPage } from './CustomerProvisionPage'
export function CustomerElevenPage() {
  return <CustomerProvisionPage cfg={{
    name: 'Customer Eleven', slug: 'eleven', subdomain: 'customer-eleven',
    industry: 'Legal Tech', planTier: 'ENTERPRISE',
    size: '51–200 employees', oisBaseline: 62.1, oisTarget: 80.0,
    modules: ['projects', 'finance', 'operations', 'analytics', 'hr'],
    accentColor: '#0d9488',
  }} />
}
