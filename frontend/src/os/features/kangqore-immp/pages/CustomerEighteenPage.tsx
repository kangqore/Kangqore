import { CustomerProvisionPage } from './CustomerProvisionPage'
export function CustomerEighteenPage() {
  return <CustomerProvisionPage cfg={{
    name: 'Customer Eighteen', slug: 'eighteen', subdomain: 'customer-eighteen',
    industry: 'GovTech & Public Sector', planTier: 'ENTERPRISE',
    size: '201–500 employees', oisBaseline: 64.9, oisTarget: 81.0,
    modules: ['projects', 'finance', 'operations', 'analytics', 'hr'],
    accentColor: '#6366f1',
  }} />
}
