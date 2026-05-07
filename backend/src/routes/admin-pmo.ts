
// @ts-nocheck
import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// GET /api/admin/pmo/stats - Aggregate Portfolio Stats
router.get('/stats', async (req, res) => {
  try {
    const projects: any = await prisma.project.findMany({
      where: { status: { not: 'ARCHIVED' } },
      include: {
        risks: { where: { severity: 'HIGH' } }
      }
    });

    const activeProjects = projects.filter(p => p.status === 'ACTIVE');
    const totalValue = projects.reduce((sum, p) => sum + Number(p.budget || 0), 0);
    const criticalRisks = projects.reduce((sum, p) => sum + p.risks.length, 0);
    const avgHealth = projects.length > 0 
      ? Math.round(projects.reduce((sum, p) => sum + (p.health ?? 0), 0) / projects.length)
      : 0;

    // Investment Mix
    const categories = ['Transformation', 'Run & Maintain', 'Innovation / R&D', 'Compliance'];
    const investmentMix = categories.map(cat => {
      const catProjects = projects.filter(p => p.category === cat);
      const value = catProjects.reduce((sum, p) => sum + Number(p.budget || 0), 0);
      // Hardcoded colors for now matching frontend
      const colors: Record<string, string> = {
        'Transformation': '#4f46e5',
        'Run & Maintain': '#0ea5e9', 
        'Innovation / R&D': '#8b5cf6',
        'Compliance': '#64748b'
      };
      
      const category = cat || 'Transformation'; // Safe fallback
      return { name: cat, value: Number(value), color: colors[category] || '#cbd5e1' };
    }).filter(i => i.value > 0);

    // Health Trend (Mock for now, needs historical snapshot table)
    const healthTrend = [
        { month: 'Jan', health: 94, budget: 98 },
        { month: 'Feb', health: 93, budget: 96 },
        { month: 'Mar', health: 92, budget: 92 },
        { month: 'Apr', health: avgHealth - 2, budget: 85 },
        { month: 'May', health: avgHealth + 1, budget: 88 },
        { month: 'Jun', health: avgHealth, budget: 91 },
    ];

    res.json({
      stats: [
        { label: 'Total Portfolio Value', value: `$${(totalValue / 1000000).toFixed(1)}M`, change: '+12%', icon: 'DollarSign', color: 'text-green-600', bg: 'bg-green-50' },
        { label: 'Active Programs', value: activeProjects.length.toString(), change: '2 New', icon: 'FolderKanban', color: 'text-blue-600', bg: 'bg-blue-50' },
        { label: 'Avg Portfolio Health', value: `${avgHealth}%`, change: '-1.5%', icon: 'ActivityIcon', color: 'text-emerald-600', bg: 'bg-emerald-50' },
        { label: 'Critical Escalations', value: criticalRisks.toString(), change: `${criticalRisks > 0 ? '+' : ''}0`, icon: 'AlertTriangle', color: 'text-red-600', bg: 'bg-red-50' },
      ],
      investmentMix,
      healthTrend
    });
  } catch (error) {
    console.error('Error fetching PMO stats:', error);
    res.status(500).json({ error: 'Failed to fetch PMO stats' });
  }
});

// GET /api/admin/pmo/projects - List of Strategic Programs
router.get('/projects', async (req, res) => {
  try {
    const projects: any = await prisma.project.findMany({
      where: { status: 'ACTIVE' },
      take: 20,
      orderBy: { budget: 'desc' },
      include: {
        client: { select: { name: true } },
        lead: { select: { name: true } }
      }
    });

    const formatted = projects.map(p => ({
      id: p.id,
      name: p.title,
      clientName: p.client.name,
      status: (p.health ?? 100) < 80 ? 'At Risk' : ((p.health ?? 100) < 90 ? 'Watch' : 'On Track'),
      progress: p.progress ?? 0,
      budget: Number(p.budget ?? 0),
      spend: Number(p.spend ?? 0),
      lead: p.lead?.name ?? 'Unassigned',
      nextGate: p.nextGate ?? 'Planning'
    }));

    res.json(formatted);

  } catch (error) {
    console.error('Error fetching PMO projects:', error);
    res.status(500).json({ error: 'Failed to fetch PMO projects' });
  }
});

export default router;
