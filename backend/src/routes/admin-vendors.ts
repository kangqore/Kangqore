// @ts-nocheck
import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// GET /api/admin/vendors - List all vendors with details
router.get('/', async (req, res) => {
  try {
    const vendors: any = await prisma.vendor.findMany({
      where: { status: 'ACTIVE' },
      include: {
        contracts: true
      },
      orderBy: { name: 'asc' }
    });

    const formatted = vendors.map((v: any) => {
      // Calculate monthly spend from active contracts (simplified)
      const monthlySpend = v.contracts
        .filter((c: any) => c.status === 'ACTIVE')
        .reduce((sum: number, c: any) => sum + (Number(c.value) / 12), 0);
        
      // Find next renewal date
      const nextRenewal = v.contracts
        .filter((c: any) => c.renewalDate && new Date(c.renewalDate) > new Date())
        .sort((a: any, b: any) => new Date(a.renewalDate).getTime() - new Date(b.renewalDate).getTime())[0]?.renewalDate;

      return {
        id: v.id,
        name: v.name,
        category: v.category,
        tier: v.tier,
        risk: v.risk,
        spend: monthlySpend, // Number
        spendDisplay: `$${Math.round(monthlySpend/1000)}k/mo`,
        renewal: nextRenewal ? new Date(nextRenewal).toISOString().split('T')[0] : 'N/A'
      };
    });

    res.json(formatted);
  } catch (error) {
    console.error('Error fetching vendors:', error);
    res.status(500).json({ error: 'Failed to fetch vendors' });
  }
});

// GET /api/admin/vendors/stats - Aggregate Vendor Stats
router.get('/stats', async (req, res) => {
  try {
    const vendors: any = await prisma.vendor.findMany({
      where: { status: 'ACTIVE' },
      include: { contracts: true }
    });

    const totalAnnualSpend = vendors.reduce((sum: number, v: any) => {
       const vendorAnnual = v.contracts
         .filter((c: any) => c.status === 'ACTIVE')
         .reduce((Startsum: number, c: any) => Startsum + Number(c.value), 0);
       return sum + vendorAnnual;
    }, 0);

    const highRiskCount = vendors.filter((v: any) => v.risk === 'HIGH').length;
    
    // Renewals in next 90 days
    const ninetyDaysFromNow = new Date();
    ninetyDaysFromNow.setDate(ninetyDaysFromNow.getDate() + 90);
    
    const renewalsDue = vendors.reduce((count: number, v: any) => {
      const hasRenewal = v.contracts.some((c: any) => {
        if (!c.renewalDate) return false;
        const d = new Date(c.renewalDate);
        return d > new Date() && d <= ninetyDaysFromNow;
      });
      return hasRenewal ? count + 1 : count;
    }, 0);

    const spendByCategory = vendors.reduce((acc: any, v: any) => {
       const vendorAnnual = v.contracts.reduce((s: number, c: any) => s + Number(c.value), 0);
       acc[v.category] = (acc[v.category] || 0) + vendorAnnual;
       return acc;
    }, {});

    // Chart Data
    const chartData = Object.keys(spendByCategory).map(cat => ({
       name: cat,
       value: Math.round(spendByCategory[cat] / 100000), // Scaled down for chart logic if needed, or keeping raw
       rawVal: spendByCategory[cat],
       color: cat === 'Cloud' ? '#3b82f6' : cat === 'SaaS' ? '#10b981' : cat === 'Staffing' ? '#f59e0b' : '#6366f1'
    }));

    res.json({
       stats: [
         { label: 'Annual Spend', value: `$${(totalAnnualSpend / 1000000).toFixed(1)}M`, icon: 'DollarSign', bg: 'bg-blue-50', color: 'text-blue-600' },
         { label: 'Active Vendors', value: vendors.length.toString(), icon: 'Handshake', bg: 'bg-emerald-50', color: 'text-emerald-600' },
         { label: 'High Risk', value: highRiskCount.toString(), icon: 'AlertTriangle', bg: 'bg-red-50', color: 'text-red-600' },
         { label: 'Renewals Due', value: renewalsDue.toString(), sub: 'Next 90 days', icon: 'Calendar', bg: 'bg-amber-50', color: 'text-amber-600' }
       ],
       chartData
    });

  } catch (error) {
    console.error('Error fetching vendor stats:', error);
    res.status(500).json({ error: 'Failed to fetch vendor stats' });
  }
});

export default router;
