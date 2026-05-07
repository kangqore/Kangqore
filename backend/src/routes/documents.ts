import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { requireAuth, requireRole } from '../middleware/rbac';
import { upload } from '../middleware/upload';

const requireAdmin = requireRole(['ADMIN']);

const router = Router();
const prisma = new PrismaClient();

// CLIENT/ADMIN: Upload a document
router.post('/upload', requireAuth, upload.single('file'), async (req: any, res) => {
  try {
    const { title, description, type, clientId, projectId } = req.body;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    if (!clientId) {
      return res.status(400).json({ error: 'Client ID is required' });
    }

    // Build URL
    const baseUrl = process.env.BACKEND_URL || `http://localhost:${process.env.PORT || 5050}`;
    const fileUrl = `${baseUrl}/uploads/${file.filename}`;

    const doc = await prisma.document.create({
      data: {
        title: title || file.originalname,
        description,
        url: fileUrl,
        type: type || 'ASSET',
        size: file.size,
        clientId,
        projectId,
        uploadedBy: req.user?.userId || 'ADMIN'
      }
    });

    res.status(201).json({ document: doc });
  } catch (error: any) {
    console.error('Error uploading document:', error);
    res.status(500).json({ error: error.message || 'Failed to upload document' });
  }
});

// ADMIN: Create a document record (manual link)
router.post('/', requireAuth, requireAdmin, async (req, res) => {
  try {
    const { title, description, url, type, size, clientId, projectId } = req.body;

    if (!clientId || !url || !title) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const doc = await prisma.document.create({
      data: {
        title,
        description,
        url,
        type: type || 'ASSET',
        size: size || 0,
        clientId,
        projectId,
        uploadedBy: req.user?.userId || 'ADMIN'
      }
    });

    res.status(201).json({ document: doc });
  } catch (error) {
    console.error('Error creating document:', error);
    res.status(500).json({ error: 'Failed to create document record' });
  }
});

// ADMIN: List documents for a specific client/project
router.get('/', requireAuth, requireAdmin, async (req, res) => {
  try {
    const { clientId, projectId } = req.query;
    
    const where: any = {};
    if (clientId) where.clientId = String(clientId);
    if (projectId) where.projectId = String(projectId);

    if (Object.keys(where).length === 0) {
      return res.status(400).json({ error: 'Client ID or Project ID is required' });
    }

    const docs = await prisma.document.findMany({
      where,
      orderBy: { createdAt: 'desc' }
    });

    res.json({ documents: docs });
  } catch (error) {
    console.error('Error fetching documents:', error);
    res.status(500).json({ error: 'Failed to fetch documents' });
  }
});

// CLIENT: List my received documents
router.get('/my-documents', requireAuth, async (req, res) => {
  try {
    const docs = await prisma.document.findMany({
      where: { clientId: req.user?.userId },
      orderBy: { createdAt: 'desc' }
    });

    res.json({ documents: docs });
  } catch (error) {
    console.error('Error fetching client documents:', error);
    res.status(500).json({ error: 'Failed to fetch documents' });
  }
});

// ADMIN: Delete a document
router.delete('/:id', requireAuth, requireAdmin, async (req, res) => {
  try {
    await prisma.document.delete({
      where: { id: req.params.id }
    });
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting document:', error);
    res.status(500).json({ error: 'Failed to delete document' });
  }
});

export default router;
