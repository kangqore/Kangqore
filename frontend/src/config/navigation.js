// Navigation configuration for different user roles
export const navigationConfig = {
  CLIENT: [
    { path: '/dashboard/client', label: 'Overview', icon: 'Home' },
    { path: '/dashboard/client/projects', label: 'Projects', icon: 'Folder' },
    { path: '/dashboard/client/deliverables', label: 'Deliverables', icon: 'Package' },
    { path: '/dashboard/client/reports', label: 'Reports', icon: 'BarChart3' },
    { path: '/dashboard/client/documents', label: 'Documents', icon: 'FileText' },
    { path: '/profile', label: 'Profile', icon: 'User' },
    { path: '/settings', label: 'Settings', icon: 'Settings' },
    { path: '/dashboard/client/support', label: 'Support', icon: 'HelpCircle' }
  ],
  
  PARTNER: [
    { path: '/dashboard/partner', label: 'Overview', icon: 'Home' },
    { path: '/dashboard/partner/projects', label: 'Projects', icon: 'Folder' },
    { path: '/dashboard/partner/collaboration', label: 'Collaboration', icon: 'Users' },
    { path: '/dashboard/partner/resources', label: 'Resources', icon: 'BookOpen' },
    { path: '/dashboard/partner/analytics', label: 'Analytics', icon: 'TrendingUp' },
    { path: '/profile', label: 'Profile', icon: 'User' },
    { path: '/settings', label: 'Settings', icon: 'Settings' }
  ],
  
  INVESTOR: [
    { path: '/dashboard/investor', label: 'Overview', icon: 'Home' },
    { path: '/dashboard/investor/portfolio', label: 'Portfolio', icon: 'Briefcase' },
    { path: '/dashboard/investor/reports', label: 'Reports', icon: 'FileText' },
    { path: '/dashboard/investor/documents', label: 'Documents', icon: 'FolderOpen' },
    { path: '/profile', label: 'Profile', icon: 'User' },
    { path: '/settings', label: 'Settings', icon: 'Settings' }
  ],
  
  JOB_SEEKER: [
{ path: '/dashboard/careers', label: 'Overview', icon: 'Home' },
    { path: '/dashboard/careers/applications', label: 'My Applications', icon: 'Briefcase' },
    { path: '/dashboard/careers/openings', label: 'Job Openings', icon: 'Search' },
    { path: '/dashboard/careers/profile', label: 'Career Profile', icon: 'User' },
    { path: '/profile', label: 'Profile', icon: 'UserCircle' },
    { path: '/settings', label: 'Settings', icon: 'Settings' }
  ],
  
  ADMIN: [
    { path: '/dashboard/admin', label: 'Overview', icon: 'LayoutDashboard' },
    { path: '/dashboard/admin/users', label: 'Users', icon: 'Users' },
    { path: '/dashboard/admin/consultations', label: 'Consultations', icon: 'Calendar' },
    { path: '/dashboard/admin/contacts', label: 'Contact Forms', icon: 'Mail' },
    { path: '/dashboard/admin/applications', label: 'Job Applications', icon: 'Briefcase' },
    { path: '/dashboard/admin/projects', label: 'Projects', icon: 'Folder' },
    { path: '/dashboard/admin/content', label: 'Content', icon: 'FileText' },
    { path: '/dashboard/admin/media', label: 'Media', icon: 'Image' },
    { path: '/dashboard/admin/analytics', label: 'Analytics', icon: 'BarChart3' },
    { path: '/dashboard/admin/audit', label: 'Audit Logs', icon: 'Shield' },
    { path: '/profile', label: 'Profile', icon: 'User' },
    { path: '/settings', label: 'Settings', icon: 'Settings' }
  ]
};

/**
 * Get navigation items for a specific role
 * @param role - User's role
 * @returns Navigation items for that role
 */
export const getNavigationForRole = (role) => {
  return navigationConfig[role] || [];
};

/**
 * Check if a user has access to a route
 * @param role - User's role
 * @param path - Route path to check
 * @returns Boolean indicating access
 */
export const hasAccessToRoute = (role, path) => {
  const navItems = getNavigationForRole(role);
  return navItems.some(item => path.startsWith(item.path));
};
