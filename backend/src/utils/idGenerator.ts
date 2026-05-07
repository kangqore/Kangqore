
import { prisma } from '../lib/prisma';
import { Role } from '@prisma/client';

const ROLE_CODES: Record<Role, string> = {
  CLIENT: 'CL',
  PARTNER: 'PT',
  INVESTOR: 'IN',
  JOB_SEEKER: 'JS',
  ADMIN: 'AD',
  VISITOR: 'VS'
};

/**
 * Generates a custom ID in format KQ{YY}{SEQ}{ROLE}
 * Example: KQ260001CL
 */
export async function generateCustomId(role: Role): Promise<string> {
  const date = new Date();
  const year = date.getFullYear().toString().slice(-2); // 26
  const roleCode = ROLE_CODES[role] || 'VS'; // Default to VS (Visitor) if somehow unknown

  // Get count of users created this year
  // Since customId is new, we might overlap if we base strictly on count of all users.
  // Ideally, we find the highest sequence number for this year.
  // Format: KQ{YY}{XXXX}{XX}
  
  const prefix = `KQ${year}`;
  
  // Find the last created user with this prefix
  const lastUser = await prisma.user.findFirst({
    where: {
      customId: {
        startsWith: prefix
      }
    },
    orderBy: {
      customId: 'desc'
    },
    select: {
      customId: true
    }
  });

  let nextSeq = 1;

  if (lastUser && lastUser.customId) {
    // Extract sequence: KQ26 0001 CL
    // Index 4 to 8
    const seqStr = lastUser.customId.substring(4, 8);
    const seq = parseInt(seqStr, 10);
    if (!isNaN(seq)) {
      nextSeq = seq + 1;
    }
  }

  const paddedSeq = nextSeq.toString().padStart(4, '0');
  return `${prefix}${paddedSeq}${roleCode}`;
}
