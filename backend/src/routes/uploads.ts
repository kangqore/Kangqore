import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { requireAuth } from '../middleware/rbac';
import { upload } from '../middleware/upload';

const router = Router();
const prisma = new PrismaClient();

// Single file upload
router.post('/single', requireAuth, upload.single('file'), async (req: any, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const mediaFile = await prisma.mediaFile.create({
      data: {
        filename: req.file.filename,
        originalName: req.file.originalname,
        mimeType: req.file.mimetype,
        size: req.file.size,
        path: req.file.path,
        uploadedBy: req.user!.userId || req.user!.id
      }
    });

    const baseUrl = process.env.BACKEND_URL || `http://localhost:${process.env.PORT || 5050}`;
    const fileUrl = `${baseUrl}/uploads/${req.file.filename}`;

    res.status(201).json({
      url: fileUrl,
      file: mediaFile
    });
  } catch (error) {
    console.error('Error in single upload:', error);
    res.status(500).json({ error: 'Internal server error during upload' });
  }
});

// Multiple files upload
router.post('/multiple', requireAuth, upload.array('files', 10), async (req: any, res) => {
  try {
    const files = req.files as Express.Multer.File[];
    if (!files || files.length === 0) {
      return res.status(400).json({ error: 'No files uploaded' });
    }

    const mediaFiles = await Promise.all(
      files.map(async (file) => {
        return await prisma.mediaFile.create({
          data: {
            filename: file.filename,
            originalName: file.originalname,
            mimeType: file.mimetype,
            size: file.size,
            path: file.path,
            uploadedBy: req.user!.userId || req.user!.id
          }
        });
      })
    );

    const baseUrl = process.env.BACKEND_URL || `http://localhost:${process.env.PORT || 5050}`;
    const fileUrls = mediaFiles.map(file => ({
      ...file,
      url: `${baseUrl}/uploads/${file.filename}`
    }));

    res.status(201).json({ files: fileUrls });
  } catch (error) {
    console.error('Error in multiple upload:', error);
    res.status(500).json({ error: 'Internal server error during upload' });
  }
});

export default router;
