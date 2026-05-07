import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { default as React, useCallback, useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  Home, Users, FileText, BarChart3, Settings, LogOut, Bell, Search, User,
  Menu, X, ChevronDown, Building2, Handshake, TrendingUp, Briefcase, Shield,
  FolderKanban, ClipboardList, MessageSquare, Download, HelpCircle,
  Star, Trash2, Calendar, AlertTriangle, Bookmark, LayoutDashboard, Loader2, CalendarDays, Mail, Layers, Link as LinkIcon, FileCheck, UserPen, UserX,
  Target, Inbox, Send, Flag, Receipt, GitCommit, Clock, Server,
  Activity, Award, FileSignature, ShieldCheck, Lightbulb, Zap, Layout, AlertOctagon, LifeBuoy
} from 'lucide-react';
import axios from 'axios';

import { useAuth } from '../context/AuthContext';
import DashboardFloatingButtons from './DashboardFloatingButtons';
import ClientNorthStar from './dashboard/ClientNorthStar';
import { useClientDashboard } from '../hooks/useDashboardData';
import { useSearch } from '../hooks/useSearch';
import { useSocket } from '../hooks/useSocket';

// Debounce helper
const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
};

const DashboardLayout = ({ children, role, title, subtitle, headerActions }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout, loading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 1024);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
  
  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const searchRef = useRef(null);
  
  // Notification State
  const [showNotifications, setShowNotifications] = useState(false);
  const notifRef = useRef(null);
  const queryClient = useQueryClient();
  const { summary: summaryQuery } = useClientDashboard();
  const summaryData = summaryQuery?.data;

  // Fetch Unread Count (Poll every 30s)
  const { data: unreadData } = useQuery({
    queryKey: ['notifications-count'],
    queryFn: async () => {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL || 'http://localhost:5050'}/api/notifications/unread-count`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return res.data;
    },
    refetchInterval: 30000,
    retry: false,
    enabled: !!user
  });

  // Real-time socket notifications
  const { onNotification, connected: socketConnected } = useSocket();
  
  // Listen for real-time notifications and invalidate queries
  useEffect(() => {
    if (!onNotification) return;
    
    const unsubscribe = onNotification((notification) => {
      console.log('🔔 Real-time notification received:', notification);
      // Immediately invalidate notification queries to refresh data
      queryClient.invalidateQueries(['notifications-count']);
      queryClient.invalidateQueries(['notifications-list']);
    });
    
    return unsubscribe;
  }, [onNotification, queryClient]);

  // Fetch Notifications List (when open)
  const { data: notificationsData } = useQuery({
    queryKey: ['notifications-list'],
    queryFn: async () => {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL || 'http://localhost:5050'}/api/notifications?limit=5`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return res.data;
    },
    enabled: showNotifications && !!user
  });

  const markReadMutation = useMutation({
    mutationFn: async (id) => {
      const token = localStorage.getItem('token');
      await axios.patch(`${process.env.REACT_APP_BACKEND_URL || 'http://localhost:5050'}/api/notifications/${id}/read`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['notifications-count']);
      queryClient.invalidateQueries(['notifications-list']);
    }
  });

  const handleNotificationClick = (file) => {
    if (!file.isRead) {
      markReadMutation.mutate(file.id);
    }
    setShowNotifications(false);
    if (file.link) navigate(file.link);
  };

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
    }
  }, [user, loading, navigate]);

  // Role-based access control: Redirect non-admin users from admin dashboard
  useEffect(() => {
    if (!loading && user && role === 'admin') {
      if (user.role !== 'ADMIN') {
        // Non-admin user trying to access admin dashboard - redirect to their proper dashboard
        const redirectPath = 
          user.role === 'CLIENT' ? '/dashboard/client' :
          user.role === 'PARTNER' ? '/dashboard/partner' :
          user.role === 'INVESTOR' ? '/dashboard/investor' :
          user.role === 'JOB_SEEKER' ? '/dashboard/careers' :
          '/dashboard/client';
        navigate(redirectPath, { replace: true });
      }
    }
  }, [user, loading, role, navigate]);

  // Handle window resize for responsive sidebar
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (!mobile) {
        setSidebarOpen(true);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Listen for the floating menu button toggle event
  useEffect(() => {
    const handleMenuToggle = () => {
      setSidebarOpen(prev => !prev);
    };
    window.addEventListener('toggleDashboardMenu', handleMenuToggle);
    return () => window.removeEventListener('toggleDashboardMenu', handleMenuToggle);
  }, []);

  // Close sidebar on navigation (mobile only)
  useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false);
    }
  }, [location.pathname, isMobile]);

  // Fix: Persist Sidebar Scroll Position
  // Since Layout component remounts on route change, we store scroll pos in sessionStorage
  useEffect(() => {
    const nav = document.getElementById('dashboard-sidebar-nav');
    if (!nav) return;

    const storageKey = `sidebar-scroll-${role}`;
    
    // Restore scroll
    const savedScroll = sessionStorage.getItem(storageKey);
    if (savedScroll) {
      nav.scrollTop = parseInt(savedScroll, 10);
    }

    // Save scroll on change
    const handleScroll = () => {
      sessionStorage.setItem(storageKey, nav.scrollTop.toString());
    };

    nav.addEventListener('scroll', handleScroll);
    return () => nav.removeEventListener('scroll', handleScroll);
  }, [role]);

  // Universal Search
  const { data: searchData, isLoading: searchLoading } = useSearch(searchQuery);
  const results = searchData?.results || { projects: [], users: [], leads: [], tasks: [], insights: [] };
  const hasResults = Object.values(results).some(arr => arr.length > 0);

  // Close search and notifications on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSearchDropdown(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchResultClick = (path) => {
    setSearchQuery('');
    setShowSearchDropdown(false);
    navigate(path);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const roleConfig = {
    client: {
      icon: Building2,
      color: 'blue',
      bgColor: 'bg-brand-gradient',
      navItems: [
        { name: 'Overview', icon: Home, path: '/dashboard/client' },
        { name: 'Product & Delivery', icon: FolderKanban, path: '/dashboard/client/projects' }, 
        
        { name: 'Governance & Control', icon: Shield, path: '/dashboard/client/control' },
        { name: 'Risks & Dependencies', icon: AlertTriangle, path: '/dashboard/client/risks' },
        
        { name: 'Collaboration & Communication', icon: CalendarDays, path: '/dashboard/client/meetings' },
        
        { name: 'Support & Resources', icon: LifeBuoy, path: '/dashboard/client/support' },
      ]
    },
    partner: {
      icon: Handshake,
      color: 'emerald',
      bgColor: 'bg-brand-gradient',
      navItems: [
        { name: 'Overview', icon: Home, path: '/dashboard/partner' },
        { name: 'Tasks', icon: ClipboardList, path: '/dashboard/partner/tasks' },
        { name: 'Documents', icon: FileText, path: '/dashboard/partner/documents' },
        { name: 'Meetings', icon: CalendarDays, path: '/dashboard/partner/meetings' },
        { name: 'Messages', icon: MessageSquare, path: '/dashboard/partner/messages' },
        { name: 'Emails', icon: Mail, path: '/dashboard/partner/emails' },
      ]
    },
    investor: {
      icon: TrendingUp,
      color: 'amber',
      bgColor: 'bg-brand-gradient',
      navItems: [
        { name: 'Overview', icon: Home, path: '/dashboard/investor' },
        { name: 'Reports', icon: BarChart3, path: '/dashboard/investor/reports' },
        { name: 'Documents', icon: FileText, path: '/dashboard/investor/documents' },
        { name: 'Updates', icon: Bell, path: '/dashboard/investor/updates' }, // NEW
        { name: 'Meetings', icon: CalendarDays, path: '/dashboard/investor/meetings' }, // NEW
        { name: 'Messages', icon: MessageSquare, path: '/dashboard/investor/messages' }, // NEW
        { name: 'Emails', icon: Mail, path: '/dashboard/investor/emails' }, // NEW
      ]
    },
    job_seeker: {
      icon: Briefcase,
      color: 'purple',
      bgColor: 'bg-brand-gradient',
      navItems: [
        { name: 'Overview', icon: Home, path: '/dashboard/careers' },
        { name: 'Work', icon: Briefcase, path: '/dashboard/careers/work' }, // NEW
        { name: 'Portfolio', icon: FolderKanban, path: '/dashboard/careers/portfolio' }, // NEW
        { name: 'Jobs', icon: Search, path: '/dashboard/careers/jobs' }, // Renamed from Open Positions
        { name: 'Public Career Site', icon: Building2, path: '/careers' }, // NEW Link to Public Site
        { name: 'Applications', icon: ClipboardList, path: '/dashboard/careers/applications' }, // Renamed from My Applications
        { name: 'Interviews', icon: CalendarDays, path: '/dashboard/careers/interviews' }, // NEW
        { name: 'Messages', icon: MessageSquare, path: '/dashboard/careers/messages' }, // NEW
        { name: 'Emails', icon: Mail, path: '/dashboard/careers/emails' }, // NEW
        { name: 'Documents', icon: FileText, path: '/dashboard/careers/documents' }, // NEW
      ]
    },
    admin: {
      icon: Shield,
      color: 'red',
      bgColor: 'bg-brand-gradient',
      navItems: [
        // 1. Overview
        { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard/admin' },
        { name: 'Clients', icon: Building2, path: '/dashboard/admin/clients' },
        { name: 'Partners', icon: Handshake, path: '/dashboard/admin/partners' },

        // 2. PMO & Governance (New Layer)
        { name: 'PMO & Governance', isHeader: true },
        { name: 'Program Portfolio', icon: FolderKanban, path: '/dashboard/admin/pmo' },
        { name: 'Escalations', icon: AlertTriangle, path: '/dashboard/admin/escalations' },
        { name: 'Steering Cmte', icon: Users, path: '/dashboard/admin/steering' },
        { name: 'Decision Logs', icon: GitCommit, path: '/dashboard/admin/decisions' },
        { name: 'Risks & Dependencies', icon: AlertOctagon, path: '/dashboard/admin/risk' },
        { name: 'Change Control', icon: TrendingUp, path: '/dashboard/admin/change-control' },

        // 3. Service Lines (P&L)
        { name: 'Service Lines', isHeader: true },
        { name: 'Overview', icon: BarChart3, path: '/dashboard/admin/services' },
        { name: 'AI & Autonomous', icon: Star, path: '/dashboard/admin/services/ai-autonomous' },
        { name: 'Cloud & DevOps', icon: Server, path: '/dashboard/admin/services/cloud-devops' },
        { name: 'Cybersecurity', icon: ShieldCheck, path: '/dashboard/admin/services/cybersecurity' },
        { name: 'Modernization', icon: Layers, path: '/dashboard/admin/services/modernization' },
        { name: 'Consulting', icon: Briefcase, path: '/dashboard/admin/services/consulting' },

        // 4. Delivery
        { name: 'Delivery Execution', isHeader: true },
        { name: 'Projects', icon: Layers, path: '/dashboard/admin/engagements' },
        { name: 'Delivery Health', icon: Activity, path: '/dashboard/admin/delivery-health' },
        { name: 'AI Infrastructure', icon: Server, path: '/dashboard/admin/infrastructure' },

        // 4. Talent
        { name: 'Talent', isHeader: true },
        { name: 'Capacity Mgmt', icon: Users, path: '/dashboard/admin/capacity' },
        { name: 'Skills & Bench', icon: Award, path: '/dashboard/admin/skills' },

        // 5. Finance
        { name: 'Finance', isHeader: true },
        { name: 'KPI Analytics', icon: BarChart3, path: '/dashboard/admin/kpi' },
        { name: 'Billing', icon: Receipt, path: '/dashboard/admin/billing' },
        { name: 'Contracts', icon: FileSignature, path: '/dashboard/admin/contracts' },

        // 6. Risk & Compliance
        { name: 'Risk & Compliance', isHeader: true },
        { name: 'Audit Logs', icon: Clock, path: '/dashboard/admin/audit-logs' },
        { name: 'Compliance', icon: ShieldCheck, path: '/dashboard/admin/compliance' },

        // 7. Vendor & Ecosystem
        { name: 'Vendor & Ecosystem', isHeader: true },
        { name: 'Vendors & Alliances', icon: Handshake, path: '/dashboard/admin/vendors' },

        // 8. IP & Accelerators
        { name: 'IP & Accelerators', isHeader: true },
        { name: 'IP Catalog', icon: Lightbulb, path: '/dashboard/admin/ip' },

        // 8. CRM & Stakeholders
        { name: 'CRM & Stakeholders', isHeader: true },

        { name: 'User Mgmt', icon: UserPen, path: '/dashboard/admin/users' },
        { name: 'Leads (CRM)', icon: Target, path: '/dashboard/admin/leads' },
        { name: 'Consultations', icon: Calendar, path: '/dashboard/admin/consultations' },
        { name: 'Messages', icon: Inbox, path: '/dashboard/admin/contacts' },
        { name: 'Emails', icon: Send, path: '/dashboard/admin/emails' },

        // 9. System
        { name: 'System', isHeader: true },
        { name: 'Content (CMS)', icon: FileText, path: '/dashboard/admin/content' },
      ]
    }
  };

  const config = roleConfig[role] || roleConfig.client;
  const RoleIcon = config.icon;

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-[#0a0a0c]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Exit Impersonation Banner */}
      {localStorage.getItem('adminToken') && (
        <div className="bg-red-600 text-white px-4 py-2 text-center text-sm font-bold flex items-center justify-center gap-4 fixed top-0 w-full z-[60]">
          <span>PRIVELEGED ACCESS: You are currently impersonating a user.</span>
          <button 
            onClick={() => {
              localStorage.setItem('token', localStorage.getItem('adminToken'));
              localStorage.setItem('user', localStorage.getItem('adminUser'));
              localStorage.removeItem('adminToken');
              localStorage.removeItem('adminUser');
              window.location.href = '/dashboard/admin';
            }}
            className="bg-white dark:bg-black text-red-600 px-3 py-1 rounded-md text-xs uppercase tracking-wider hover:bg-red-50 transition-colors"
          >
            Exit Impersonation
          </button>
        </div>
      )}

      {/* Top Navigation */}
      <header className={`bg-white dark:bg-gray-900 shadow-sm fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b border-gray-200 dark:border-gray-800 ${localStorage.getItem('adminToken') ? 'top-10' : ''}`}>
        <div className="flex items-center justify-between h-24 px-6 lg:px-10">
          {/* Left: Logo & Toggle */}
          <div className="flex items-center gap-8">
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-3 rounded-xl hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-800 lg:hidden min-w-[44px] min-h-[44px] flex items-center justify-center"
              aria-label="Toggle menu"
            >
              {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
            <Link to="/" className="flex items-center gap-2">
              <img 
                src="https://customer-assets.emergentagent.com/job_cog-site-clone/artifacts/focgf8oz_Logo%2BText.png" 
                alt="Kangqore" 
                className="h-40"
                style={{ filter: 'brightness(0) saturate(100%) invert(27%) sepia(98%) saturate(2395%) hue-rotate(201deg) brightness(95%) contrast(101%)' }}
              />
            </Link>
            <div className={`hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full ${config.bgColor} text-white text-xs font-medium shadow-sm flex-shrink-0 ml-24`}>
              <RoleIcon className="w-3.5 h-3.5" />
              <span className="capitalize">{(role || 'client').replace('_', ' ')} Dashboard</span>
            </div>
          </div>

          {/* Center: Badge + Search */}
          <div className="hidden md:flex items-center gap-4 flex-1 max-w-lg ml-24 mr-8">

            <div className="relative flex-1 max-w-xs" ref={searchRef}>
            <div className="relative w-full">
              {searchLoading ? (
                <Loader2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-blue-500 animate-spin" />
              ) : (
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              )}
              <input 
                type="text" 
                placeholder={role === 'admin' ? "Search users, pages..." : "Search projects, files, tickets..."}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => searchQuery.length >= 2 && setShowSearchDropdown(true)}
                className="w-full pl-10 pr-4 py-2 bg-gray-100 dark:bg-gray-800 dark:border-gray-700 border-0 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              
              {/* Search Results Dropdown */}
              {showSearchDropdown && hasResults && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-100 dark:border-gray-700 overflow-hidden z-50 max-h-[500px] overflow-y-auto">
                  
                  {/* Users Section (Admin) */}
                  {results.users.length > 0 && (
                    <div className="p-2">
                      <p className="px-3 py-1 text-xs font-semibold text-gray-400 uppercase">Users</p>
                      {results.users.map((u) => (
                        <button
                          key={u.id}
                          onClick={() => handleSearchResultClick(`/dashboard/admin/users?highlight=${u.id}`)}
                          className="w-full flex items-center gap-3 px-3 py-2 hover:bg-gray-50 dark:bg-[#050505] rounded-lg text-left transition-colors"
                        >
                          <div className="w-8 h-8 bg-blue-50 dark:bg-blue-900/30 rounded-full flex items-center justify-center text-sm font-bold text-blue-600 dark:text-blue-400">
                            {u.name?.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900 dark:text-gray-100 text-sm">{u.name}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">{u.company} • {u.role}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Projects Section */}
                  {results.projects.length > 0 && (
                    <div className="p-2 border-t border-gray-100">
                      <p className="px-3 py-1 text-xs font-semibold text-gray-400 uppercase">Projects</p>
                      {results.projects.map((p) => (
                        <button
                          key={p.id}
                          onClick={() => handleSearchResultClick(role === 'admin' ? `/dashboard/admin/engagements` : `/dashboard/client/projects`)}
                          className="w-full flex items-center gap-3 px-3 py-2 hover:bg-gray-50 dark:bg-[#050505] rounded-lg text-left transition-colors"
                        >
                          <div className="w-8 h-8 bg-purple-50 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
                            <FolderKanban className="w-4 h-4 text-purple-600" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white text-sm">{p.title}</p>
                            <p className="text-xs text-gray-500 line-clamp-1">{p.description}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Leads Section (Admin) */}
                  {results.leads.length > 0 && (
                    <div className="p-2 border-t border-gray-100">
                      <p className="px-3 py-1 text-xs font-semibold text-gray-400 uppercase">Leads & Inquiries</p>
                      {results.leads.map((l) => (
                        <button
                          key={l.id}
                          onClick={() => handleSearchResultClick(`/dashboard/admin/leads`)}
                          className="w-full flex items-center gap-3 px-3 py-2 hover:bg-gray-50 dark:bg-[#050505] rounded-lg text-left transition-colors"
                        >
                          <div className="w-8 h-8 bg-orange-50 rounded-lg flex items-center justify-center">
                            <Target className="w-4 h-4 text-orange-600" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white text-sm">{l.name}</p>
                            <p className="text-xs text-gray-500 line-clamp-1">{l.subject}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Tasks Section */}
                  {results.tasks.length > 0 && (
                    <div className="p-2 border-t border-gray-100">
                      <p className="px-3 py-1 text-xs font-semibold text-gray-400 uppercase">Tasks</p>
                      {results.tasks.map((t) => (
                        <button
                          key={t.id}
                          onClick={() => handleSearchResultClick(role === 'admin' ? `/dashboard/admin/tasks` : `/dashboard/client/tasks`)}
                          className="w-full flex items-center gap-3 px-3 py-2 hover:bg-gray-50 dark:bg-[#050505] rounded-lg text-left transition-colors"
                        >
                          <div className="w-8 h-8 bg-emerald-50 rounded-lg flex items-center justify-center">
                            <ClipboardList className="w-4 h-4 text-emerald-600" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white text-sm">{t.title}</p>
                            <p className="text-xs text-gray-500">{t.status} • {t.project?.title}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
              
              {/* No Results */}
              {showSearchDropdown && searchQuery.length >= 2 && !searchLoading && !hasResults && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-100 dark:border-gray-700 p-6 text-center z-50">
                  <Search className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                  <p className="text-gray-500 text-sm">No results found for "{searchQuery}"</p>
                </div>
              )}
            </div>
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
             <button
              onClick={() => navigate(role === 'job_seeker' ? '/dashboard/careers/settings' : `/dashboard/${role}/settings`)}
              className="p-3 rounded-xl hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 relative min-w-[44px] min-h-[44px] flex items-center justify-center transition-colors"
              aria-label="Settings"
            >
              <Settings className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>
            <div className="relative" ref={notifRef}>
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-3 rounded-xl hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 relative min-w-[44px] min-h-[44px] flex items-center justify-center transition-colors"
                aria-label="Notifications"
              >
                <Bell className={`w-5 h-5 ${showNotifications ? 'text-blue-600' : 'text-gray-600 dark:text-gray-400'}`} />
                {unreadData?.count > 0 && (
                  <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                )}
              </button>

              {/* Notifications Dropdown */}
              {showNotifications && (
                <div className="absolute top-full right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-100 dark:border-gray-700 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between bg-gray-50/50 dark:bg-gray-900/50">
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100">Notifications</h3>
                    {unreadData?.count > 0 && (
                      <span className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full font-medium">
                        {unreadData.count} New
                      </span>
                    )}
                  </div>
                  
                  <div className="max-h-[400px] overflow-y-auto">
                    {notificationsData?.notifications?.length > 0 ? (
                      <div className="divide-y divide-gray-50">
                        {notificationsData.notifications.map((notif) => (
                          <button
                            key={notif.id}
                            onClick={() => handleNotificationClick(notif)}
                            className={`w-full text-left p-4 hover:bg-gray-50 dark:bg-[#050505] transition-colors flex gap-3 ${
                              !notif.isRead ? 'bg-blue-50/30' : ''
                            }`}
                          >
                            <div className={`mt-1 w-2 h-2 rounded-full flex-shrink-0 ${
                              !notif.isRead ? 'bg-blue-500' : 'bg-transparent'
                            }`} />
                            <div className="flex-1">
                              <p className={`text-sm ${!notif.isRead ? 'font-semibold text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-400'}`}>
                                {notif.title}
                              </p>
                              <p className="text-xs text-gray-500 mt-1 line-clamp-2">{notif.message}</p>
                              <p className="text-[10px] text-gray-400 mt-2">
                                {new Date(notif.createdAt).toLocaleString()}
                              </p>
                            </div>
                          </button>
                        ))}
                      </div>
                    ) : (
                      <div className="p-8 text-center text-gray-500">
                        <Bell className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                        <p className="text-sm">No notifications yet</p>
                      </div>
                    )}
                  </div>
                  
                  <div className="p-2 border-t border-gray-100 bg-gray-50 dark:bg-gray-800 dark:border-gray-700/50 text-center">
                    <Link 
                      to={`/dashboard/${
                        (role === 'job_seeker' || location.pathname.includes('/careers')) ? 'careers' : 
                        (role || location.pathname.split('/')[2] || 'client')
                      }/notifications`}
                      className="text-xs font-medium text-brand-blue hover:text-blue-700 transition-colors"
                      onClick={() => setShowNotifications(false)}
                    >
                      View All Activity
                    </Link>
                  </div>
                </div>
              )}
            </div>
            <div className="flex items-center gap-2 sm:gap-3 pl-2 sm:pl-3 border-l border-gray-200">
              {/* Avatar & Name - Clickable to Profile */}
              <Link 
                to={role === 'admin' ? '/profile' : `/dashboard/${role}/profile`}
                className="flex items-center gap-2 hover:opacity-80 transition-opacity cursor-pointer"
              >
                {/* Avatar */}
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-brand-gradient flex items-center justify-center text-white font-semibold overflow-hidden">
                  {user.avatarUrl ? (
                    <img 
                      src={user.avatarUrl} 
                      alt={user.name}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : user.role === 'ADMIN' ? (
                    <img 
                      src="/assets/eqore_avatar.jpg" 
                      alt="Kangqore Admin"
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <span className="text-sm">{user.name?.charAt(0).toUpperCase()}</span>
                  )}
                </div>
              
                <div className="hidden sm:block text-right">
                  <p className="text-sm font-medium text-gray-900 dark:text-white hover:text-brand-blue transition-colors">{user.name}</p>
                  <p className="text-xs text-gray-500 capitalize">{user.role?.replace('_', ' ')}</p>
                </div>
              </Link>
              
              <button 
                onClick={handleLogout}
                className="flex items-center justify-center gap-2 p-3 rounded-xl hover:bg-red-50 dark:bg-red-900/20 text-gray-600 dark:text-gray-400 hover:text-red-600 transition-colors min-w-[44px] min-h-[44px]"
                title="Logout"
                aria-label="Logout"
              >
                <LogOut className="w-5 h-5" />
                <span className="hidden lg:inline text-sm font-medium">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Sidebar */}
      <aside className={`fixed top-24 left-0 bottom-0 w-64 bg-white dark:bg-gray-900 shadow-lg border-r border-gray-200 dark:border-gray-800 transform transition-transform duration-300 ease-in-out z-40 flex flex-col ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
        <nav className="px-4 py-4 space-y-1 flex-1 overflow-y-auto" id="dashboard-sidebar-nav">
          {config.navItems.map((item, index) => {
            // Handle divider items
            if (item.isDivider) {
              return <div key={`divider-${index}`} className="border-t border-gray-200 my-2" />;
            }
            // Handle header items
            if (item.isHeader) {
              return (
                <div key={`header-${index}`} className="px-4 mt-6 mb-2 text-xs font-bold text-gray-400 uppercase tracking-wider">
                  {item.name}
                </div>
              );
            }
            
            // Fix: Active state uses startsWith for sub-paths (excluding root dashboard path)
            const isActive = location.pathname === item.path || (
              item.path !== '/dashboard/admin' && 
              item.path !== '/dashboard/client' &&
              item.path !== '/dashboard/partner' &&
              item.path !== '/dashboard/investor' &&
              location.pathname.startsWith(item.path + '/')
            );
            
            const ItemIcon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  isActive 
                    ? `${config.bgColor} text-white shadow-md` 
                    : 'text-gray-600 dark:text-gray-400 hover:bg-brand-gradient hover:text-white'
                }`}
              >
                <ItemIcon className="w-5 h-5" />
                <span className="font-medium">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Admin: Role Switcher */}
        {role === 'admin' && user?.role === 'admin' && (
          <div className="flex-shrink-0 p-4 border-t border-gray-200 bg-gray-50 dark:bg-gray-800 dark:border-gray-700">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-3">Preview As</p>
            <div className="space-y-1">
              <Link
                to="/dashboard/client"
                className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:bg-white dark:bg-black hover:text-brand-blue rounded-lg transition-colors"
              >
                <Building2 className="w-4 h-4" />
                <span>Client View</span>
              </Link>
              <Link
                to="/dashboard/partner"
                className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:bg-white dark:bg-black hover:text-emerald-600 rounded-lg transition-colors"
              >
                <Handshake className="w-4 h-4" />
                <span>Partner View</span>
              </Link>
              <Link
                to="/dashboard/investor"
                className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:bg-white dark:bg-black hover:text-amber-600 rounded-lg transition-colors"
              >
                <TrendingUp className="w-4 h-4" />
                <span>Investor View</span>
              </Link>
              <Link
                to="/dashboard/careers"
                className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:bg-white dark:bg-black hover:text-purple-600 rounded-lg transition-colors"
              >
                <Briefcase className="w-4 h-4" />
                <span>Job Seeker View</span>
              </Link>
            </div>
          </div>
        )}
      </aside>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className={`pt-24 transition-all duration-300 ${sidebarOpen ? 'lg:pl-64' : ''}`}>
        
        {/* Client North Star - Engagement Health Bar */}
        {role === 'client' && <ClientNorthStar data={summaryData} isLoading={summaryQuery?.isLoading} />}

        <div className="p-4 sm:p-6 lg:p-8 overflow-x-hidden">
          {/* Page Header */}
          <div className="mb-6 sm:mb-8 flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">{title}</h1>
              {subtitle && <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 mt-1">{subtitle}</p>}
            </div>
            {headerActions && (
              <div className="flex-shrink-0 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
                {headerActions}
              </div>
            )}
          </div>

          {/* Page Content */}
          <div className="w-full">
            {children}
          </div>
        </div>
      </main>

      {/* Floating Buttons */}
      <DashboardFloatingButtons />
    </div>
  );
};

export default DashboardLayout;
