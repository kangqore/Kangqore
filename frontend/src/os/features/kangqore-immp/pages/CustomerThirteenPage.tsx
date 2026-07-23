import { CustomerProvisionPage } from './CustomerProvisionPage'
export function CustomerThirteenPage() {
  return <CustomerProvisionPage cfg={{
    name: 'Customer Thirteen', slug: 'thirteen', subdomain: 'customer-thirteen',
    industry: 'AgriTech', planTier: 'STARTER',
    size: '1–10 employees', oisBaseline: 49.3, oisTarget: 68.0,
    modules: ['projects', 'finance', 'operations'],
    accentColor: '#10b981',
  }} />
}
