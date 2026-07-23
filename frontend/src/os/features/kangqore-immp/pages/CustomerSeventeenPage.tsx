import { CustomerProvisionPage } from './CustomerProvisionPage'
export function CustomerSeventeenPage() {
  return <CustomerProvisionPage cfg={{
    name: 'Customer Seventeen', slug: 'seventeen', subdomain: 'customer-seventeen',
    industry: 'FinTech (Payments & Lending)', planTier: 'ENTERPRISE',
    size: '201–500 employees', oisBaseline: 71.2, oisTarget: 87.0,
    modules: ['projects', 'finance', 'sales', 'operations', 'analytics', 'hr', 'leadership'],
    accentColor: '#3b82f6',
  }} />
}
