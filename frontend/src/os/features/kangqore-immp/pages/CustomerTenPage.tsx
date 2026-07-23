import { CustomerProvisionPage } from './CustomerProvisionPage'
export function CustomerTenPage() {
  return <CustomerProvisionPage cfg={{
    name: 'Customer Ten', slug: 'ten', subdomain: 'customer-ten',
    industry: 'Government & Public Sector', planTier: 'ENTERPRISE',
    size: '201–500 employees', oisBaseline: 66.0, oisTarget: 82.0,
    modules: ['projects', 'finance', 'sales', 'hr', 'operations', 'analytics', 'leadership'],
    isMilestone: true,
    milestoneLabel: '🏆 10th Customer — Double-digit milestone!',
    accentColor: '#7c3aed',
  }} />
}
