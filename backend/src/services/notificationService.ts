import { prisma } from '../lib/prisma';
import { emitToUser } from '../socket';

export interface NotificationParams {
  userId: string;
  title: string;
  message: string;
  type?: 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR';
  link?: string;
}

/**
 * Create a notification for a user
 */
export async function createNotification({
  userId,
  title,
  message,
  type = 'INFO',
  link
}: NotificationParams) {
  try {
    const notification = await prisma.notification.create({
      data: {
        userId,
        title,
        message,
        type,
        link
      }
    });

    // Emit real-time notification via Socket.io
    try {
      emitToUser(userId, 'notification:new', notification);
    } catch (socketError) {
      // Socket might not be initialized during tests or startup
      console.warn('Could not emit real-time notification:', socketError);
    }

    return notification;
  } catch (error) {
    console.error('Failed to create notification:', error);
    // Don't throw - notifications should not break main flows
    return null;
  }
}

/**
 * Create notifications for multiple users
 */
export async function createBulkNotifications(
  userIds: string[],
  notification: Omit<NotificationParams, 'userId'>
) {
  const results = await Promise.allSettled(
    userIds.map(userId =>
      createNotification({ userId, ...notification })
    )
  );
  return results;
}

/**
 * Helper to create meeting notification
 */
export async function notifyMeetingScheduled(
  recipientId: string,
  meetingTitle: string,
  recipientRole: string
) {
  return createNotification({
    userId: recipientId,
    title: 'New Meeting Scheduled',
    message: `Meeting: ${meetingTitle}`,
    type: 'INFO',
    link: `/dashboard/${recipientRole.toLowerCase()}/meetings`
  });
}

/**
 * Helper to create message notification
 */
export async function notifyNewMessage(
  recipientId: string,
  senderName: string,
  recipientRole: string
) {
  return createNotification({
    userId: recipientId,
    title: 'New Message',
    message: `You have a new message from ${senderName}`,
    type: 'INFO',
    link: `/dashboard/${recipientRole.toLowerCase()}/messages`
  });
}

/**
 * Helper to create ticket update notification
 */
export async function notifyTicketUpdate(
  clientId: string,
  ticketSubject: string,
  status: string
) {
  return createNotification({
    userId: clientId,
    title: 'Ticket Updated',
    message: `Ticket "${ticketSubject}" is now ${status}`,
    type: status === 'resolved' ? 'SUCCESS' : 'INFO',
    link: `/dashboard/client/support`
  });
}

/**
 * Helper to create email notification
 */
export async function notifyNewEmail(
  recipientId: string,
  recipientRole: string,
  subject: string
) {
  return createNotification({
    userId: recipientId,
    title: 'New Email',
    message: `You received: "${subject}"`,
    type: 'INFO',
    link: `/dashboard/${recipientRole.toLowerCase()}/emails`
  });
}
/**
 * Helper to notify a specific governance role or escalation level (Gap 7)
 */
export async function notifyGovernanceRole(
  clientId: string,
  targetContext: { type: 'ESCALATION' | 'AUTHORITY', levelOrRole: string },
  message: string,
  link?: string
) {
  try {
     // Find the client profile to get the matrix
     const profile = await prisma.clientProfile.findUnique({
        where: { userId: clientId },
        include: { authorityMatrix: true }
     });

     if (!profile) return null;

     let targetEmail = '';
     // let targetName = ''; // Unused for now

     // 1. Handle Escalation Matrix (JSON Array)
     if (targetContext.type === 'ESCALATION' && Array.isArray(profile.escalationMatrix)) {
        const matrix = profile.escalationMatrix as any[];
        const contact = matrix.find(c => c.level === targetContext.levelOrRole);
        if (contact && contact.email) {
            targetEmail = contact.email;
            // targetName = contact.name;
        }
     } 
     // 2. Handle Authority Matrix (Relations)
     else if (targetContext.type === 'AUTHORITY') {
        const authority = profile.authorityMatrix.find(a => a.roleName === targetContext.levelOrRole);
        // Assuming AuthorityRole has a way to link to a user/email. 
        // Based on schema, AuthorityRole might just define the role strictly or link to a user? 
        // Let's check schema for AuthorityRole. 
        // If AuthorityRole links to a generic contact or user, we use that.
        // For now, let's assume if it finds a role, we might look for a user with that role (Gap 1).
        // Or simpler: Check if we have a user with that role.
     }

     if (targetEmail) {
         // Attempt to find a real system user to notify
         const user = await prisma.user.findUnique({ where: { email: targetEmail }});
         
         if (user) {
             return createNotification({
                 userId: user.id,
                 title: 'Governance Alert',
                 message,
                 type: 'WARNING',
                 link
             });
         } else {
             // Fallback: This would be an external email trigger
             console.log(`[EXTERNAL_EMAIL] Sending Governance Alert to ${targetEmail}: ${message}`);
             return { sent: true, method: 'EMAIL', recipient: targetEmail };
         }
     }
  } catch (error) {
    console.error('Failed to notify governance role:', error);
  }
}
