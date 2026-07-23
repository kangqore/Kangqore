import { CustomerProvisionPage } from './CustomerProvisionPage'
export function CustomerTwentyPage() {
  return <CustomerProvisionPage cfg={{
    name: 'Customer Twenty', slug: 'twenty', subdomain: 'customer-twenty',
    industry: 'Professional Services', planTier: 'PRO',
    size: '51–200 employees', oisBaseline: 59.1, oisTarget: 78.0,
    modules: ['projects', 'finance', 'sales', 'hr', 'analytics'],
    isMilestone: true,
    milestoneLabel: '🎯 20th Customer — Commercial chapter complete!',
    accentColor: '#7c3aed',
  }} />
}
