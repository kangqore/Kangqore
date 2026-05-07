import { Router, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma';
import { authenticate, AuthenticatedRequest, authorize } from '../middleware/auth';
import { createError } from '../middleware/errorHandler';

const router = Router();

// Get Media Stats (Must be before /:id routes)
router.get('/stats', authenticate, authorize(['ADMIN']), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const total = await prisma.mediaFile.count();
    const totalSize = await prisma.mediaFile.aggregate({
      _sum: { size: true }
    });

    res.json({
      totalCount: total,
      totalSize: totalSize._sum.size || 0
    });
  } catch (error) {
    next(error);
  }
});

// Get all media files
router.get('/', authenticate, authorize(['ADMIN']), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { page = 1, limit = 20, folder, file_type, search } = req.query;

    const where: any = {};
    if (folder) where.folder = String(folder);
    if (file_type) {
      if (file_type === 'image') where.mimeType = { startsWith: 'image/' };
      if (file_type === 'document') where.mimeType = { not: { startsWith: 'image/' } };
    }
    if (search) {
      where.OR = [
        { title: { contains: String(search), mode: 'insensitive' } },
        { originalName: { contains: String(search), mode: 'insensitive' } }
      ];
    }

    const mediaFiles = await prisma.mediaFile.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: parseInt(limit as string),
      skip: (parseInt(page as string) - 1) * parseInt(limit as string)
    });

    const total = await prisma.mediaFile.count({ where });

    // Get unique folders
    const folders = await prisma.mediaFile.findMany({
      select: { folder: true },
      distinct: ['folder'],
      where: { folder: { not: '' } }
    });

    res.json({
      items: mediaFiles.map(f => ({
        ...f,
        url: `/uploads/${f.filename}`, // Construct URL
        file_type: f.mimeType.startsWith('image/') ? 'image' : 'document',
        created_at: f.createdAt,
        original_name: f.originalName
      })),
      folders: folders.map(f => f.folder).filter(Boolean),
      pagination: {
        page: parseInt(page as string),
        limit: parseInt(limit as string),
        total,
        pages: Math.ceil(total / parseInt(limit as string))
      }
    });
  } catch (error) {
    next(error);
  }
});

// Bulk Delete
router.post('/bulk-delete', authenticate, authorize(['ADMIN']), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const ids = req.body; // Expect array of strings
    if (!Array.isArray(ids)) throw createError('Invalid request body', 400);

    await prisma.mediaFile.deleteMany({
      where: { id: { in: ids } }
    });

    res.json({ message: 'Files deleted successfully' });
  } catch (error) {
    next(error);
  }
});

// Get single media file
router.get('/:id', authenticate, authorize(['ADMIN']), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const mediaFile = await prisma.mediaFile.findUnique({
      where: { id }
    });

    if (!mediaFile) {
      throw createError('Media file not found', 404);
    }

    res.json(mediaFile);
  } catch (error) {
    next(error);
  }
});

// Delete media file
router.delete('/:id', authenticate, authorize(['ADMIN']), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const mediaFile = await prisma.mediaFile.findUnique({
      where: { id }
    });

    if (!mediaFile) {
      throw createError('Media file not found', 404);
    }

    // Optionally delete from disk here (fs.unlink)

    await prisma.mediaFile.delete({
      where: { id }
    });

    res.json({ message: 'Media file deleted successfully' });
  } catch (error) {
    next(error);
  }
});

export default router;
