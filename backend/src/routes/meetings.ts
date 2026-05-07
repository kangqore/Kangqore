import { Router, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma';
import { authenticate, AuthenticatedRequest, authorize } from '../middleware/auth';
import { notifyMeetingScheduled } from '../services/notificationService';

const router = Router();

// GET /api/meetings/client (List own meetings)
router.get('/client', authenticate, authorize(['CLIENT']), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    console.log('🔍 GET /api/meetings/client - User:', req.user?.id, req.user?.email, req.user?.role);
    
    if (!req.user) {
      console.error('❌ No user in request');
      return res.status(401).json({ message: 'User not authenticated' });
    }
    
    console.log('📋 Fetching meetings for client:', req.user.id);
    const meetings = await prisma.meeting.findMany({
      where: { clientId: req.user.id },
      orderBy: { startTime: 'asc' },
      include: {
        creator: {
            select: { name: true, email: true }
        }
      }
    });
    console.log('✓ Found meetings:', meetings.length);

    // Also fetch Consultation Requests for this user (by email)
    console.log('📅 Fetching consultations for email:', req.user.email);
    const consultations = await prisma.consultation.findMany({
      where: { email: req.user.email },
      orderBy: { createdAt: 'desc' }
    });
    console.log('✓ Found consultations:', consultations.length);

    console.log('✅ Sending response');
    res.json({ meetings, consultations });
  } catch (error) {
    console.error('❌ Error in GET /api/meetings/client:', error);
    next(error);
  }
});

// GET /api/meetings/:id (Detail view)
router.get('/:id', authenticate, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const meeting = await prisma.meeting.findUnique({
        where: { id },
        include: {
            creator: {
                select: { name: true, email: true }
            }
        }
      });
  
      if (!meeting) {
        return res.status(404).json({ message: 'Meeting not found' });
      }
  
      // Strict Access Control: Only Client Owner or Admin
      if (req.user!.role !== 'ADMIN' && meeting.clientId !== req.user!.id) {
          return res.status(403).json({ message: 'Access denied' });
      }
  
      res.json(meeting);
    } catch (error) {
      next(error);
    }
  });

// POST /api/meetings (Admin only)
router.post('/', authenticate, authorize(['ADMIN']), async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { 
        title, 
        type, 
        meetingMode,
        location,
        platform, 
        startTime, 
        endTime, 
        timezone, 
        joinLink, 
        description, 
        clientId,
        recordingLink,
        momUrl
    } = req.body;

    const meeting = await prisma.meeting.create({
      data: {
        title,
        type, // CALL, VIDEO, VC
        meetingMode,
        location,
        platform, // ZOOM, MEET, TEAMS, PHONE
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        timezone,
        joinLink,
        clientId,
        recordingLink,
        momUrl,
        createdBy: req.user!.id
      }
    });

    // Notify the client about the new meeting
    if (clientId) {
      await notifyMeetingScheduled(clientId, title, 'client');
    }

    res.status(201).json(meeting);
  } catch (error) {
    next(error);
  }
});

export default router;
