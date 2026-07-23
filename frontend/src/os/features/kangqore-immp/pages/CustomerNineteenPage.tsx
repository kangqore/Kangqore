import { CustomerProvisionPage } from './CustomerProvisionPage'
export function CustomerNineteenPage() {
  return <CustomerProvisionPage cfg={{
    name: 'Customer Nineteen', slug: 'nineteen', subdomain: 'customer-nineteen',
    industry: 'Aerospace & Defence', planTier: 'ENTERPRISE',
    size: '501–1000 employees', oisBaseline: 78.3, oisTarget: 91.0,
    modules: ['projects', 'finance', 'operations', 'analytics', 'hr', 'leadership', 'sales'],
    accentColor: '#64748b',
  }} />
}
