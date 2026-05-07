
import { Router } from 'express';
import { prisma } from '../lib/prisma';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

// =====================================================
// IP & ACCELERATORS CATALOG
// =====================================================

// Get all IP assets
router.get('/ip', authenticate, authorize(['ADMIN']), async (req, res) => {
  try {
    const { type, search } = req.query;

    const where: any = {};
    if (type) where.type = type;
    if (search) {
      where.OR = [
        { title: { contains: search as string, mode: 'insensitive' } },
        { description: { contains: search as string, mode: 'insensitive' } }
      ];
    }

    const assets = await prisma.iPAsset.findMany({
      where,
      orderBy: { downloads: 'desc' }
    });

    res.json({ assets });
  } catch (error) {
    console.error('Error fetching IP assets:', error);
    res.status(500).json({ error: 'Failed to fetch IP assets' });
  }
});

// Register new IP asset
router.post('/ip', authenticate, authorize(['ADMIN']), async (req, res) => {
  try {
    const { title, description, type, version, status, tags } = req.body;

    const newAsset = await prisma.iPAsset.create({
      data: {
        title,
        description,
        type: type || 'COMPONENT',
        version: version || '1.0.0',
        status: status || 'ACTIVE',
        tags: tags || [],
        owner: 'Kangqore Labs'
      }
    });

    res.json({ asset: newAsset });
  } catch (error) {
    console.error('Error registering IP asset:', error);
    res.status(500).json({ error: 'Failed to register IP asset' });
  }
});

export default router;
