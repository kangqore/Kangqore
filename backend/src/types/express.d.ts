
import { Role } from '@prisma/client';

declare global {
  namespace Express {
    interface User {
      id: string;      // Database ID
      userId: string;  // JWT uses userId, map to id 
      role: string;
      email: string;
      name: string;
      sessionId?: string;
      company?: string | null;
      
      // Social IDs
      googleId?: string | null;
      linkedinId?: string | null;
      appleId?: string | null;
      
      // Team / Department RBAC
      deptId?: string | null;
      departmentSlug?: string | null;
      isDepartmentLead?: boolean;
      isDepartmentHr?: boolean;
      teamCategory?: string | null;
    }
  }
}
