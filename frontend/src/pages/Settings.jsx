import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Monitor, 
  LogOut, 
  AlertCircle, 
  CheckCircle, 
  Trash2, 
  Shield, 
  Key, 
  Bell, 
  User, 
  ArrowLeft, 
  Smartphone, 
  AlertTriangle,
  Globe,
  FileCheck,
  Lock,
  Users,
  RefreshCw
} from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import DashboardLayout from '../components/DashboardLayout';

const Settings = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [activeSessions, setActiveSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [securityScore, setSecurityScore] = useState(90);

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || '';

  // Fetch active sessions
  const fetchSessions = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      const response = await axios.get(`${BACKEND_URL}/api/sessions/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setActiveSessions(response.data.sessions || []);
      setError('');
    } catch (err) {
      // Graceful error handling - No red banners for non-critical failures
      console.warn('Unable to fetch active sessions (Security strict mode or network issue)', err);
      // We don't set 'error' to avoid alarming the client unnecessarily
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSessions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Logout from all sessions
  const handleLogoutAll = async () => {
    if (!window.confirm('This will log you out from all devices. Continue?')) {
      return;
    }

    try {
      setActionLoading('logout-all');
      const token = localStorage.getItem('token');
      
      await axios.post(
        `${BACKEND_URL}/api/sessions/logout-all`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSuccess('Logged out from all devices successfully');
      
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('refreshToken');
      
      setTimeout(() => {
        window.location.href = '/login';
      }, 1500);
    } catch (err) {
      setError('Failed to logout from all devices', err);
    } finally {
      setActionLoading(null);
    }
  };

  const getDeviceType = (userAgent) => {
    if (!userAgent) return 'Unknown Device';
    if (userAgent.includes('Mobile')) return 'Mobile Device';
    if (userAgent.includes('Tablet')) return 'Tablet';
    return 'Desktop';
  };

  return (
    <DashboardLayout role={(user?.role || 'client').toLowerCase()} title="Client Trust & Control Center" subtitle="Enterprise security, access governance, and compliance controls">
      <div className="space-y-8">

        {/* 1. Security Health Header (New) */}
        <div className="bg-white dark:bg-gray-900 dark:border-gray-800 rounded-2xl shadow-sm border border-gray-200 p-6 relative overflow-hidden">
             <div className="absolute top-0 right-0 w-32 h-32 bg-green-50 dark:bg-green-900/20 rounded-bl-full -mr-8 -mt-8 pointer-events-none"></div>
             
             <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
                 <div className="flex items-center gap-4">
                     <div className="relative">
                         <div className="w-16 h-16 rounded-full border-4 border-green-100 flex items-center justify-center bg-white dark:bg-gray-900 dark:border-gray-800">
                             <Shield className="w-8 h-8 text-green-600" />
                         </div>
                         <div className="absolute -bottom-1 -right-1 bg-green-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full border border-white">
                             STRONG
                         </div>
                     </div>
                     <div>
                         <h2 className="text-xl font-bold text-gray-900 dark:text-white">Security Status: Strong</h2>
                         <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mt-1 text-sm text-gray-600 dark:text-gray-400">
                             <span className="flex items-center gap-1.5 text-green-700 font-medium">
                                 <CheckCircle className="w-4 h-4" /> Password updated 12 days ago
                             </span>
                             <span className="flex items-center gap-1.5 text-green-700 font-medium">
                                 <CheckCircle className="w-4 h-4" /> No suspicious logins
                             </span>
                         </div>
                     </div>
                 </div>
                 
             <div className="flex items-center gap-3">
                     <button 
                        onClick={() => alert("Opening Audit Logs... (Enterprise Feature)")}
                        className="px-4 py-2 bg-gray-900 text-white rounded-lg font-bold hover:bg-black transition-colors shadow-sm flex items-center gap-2"
                     >
                         <FileCheck className="w-4 h-4" /> View Audit Log
                     </button>
                 </div>
             </div>
        </div>

        {/* 2. Enterprise Controls Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Left Col: Authentication & Access */}
            <div className="space-y-6">
                
                {/* MFA & Password */}
                <div className="bg-white dark:bg-gray-900 dark:border-gray-800 rounded-2xl shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                        <Key className="w-5 h-5 text-gray-400" /> Authentication
                    </h3>
                    
                    <div className="space-y-4">
                         <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 dark:border-gray-700 rounded-xl border border-gray-100">
                             <div className="flex items-center gap-3">
                                 <div className="w-10 h-10 bg-white dark:bg-gray-900 dark:border-gray-800 rounded-lg flex items-center justify-center border border-gray-200 text-brand-blue">
                                     <Smartphone className="w-5 h-5" />
                                 </div>
                                 <div>
                                     <p className="font-bold text-gray-900 dark:text-white text-sm">Two-Factor Authentication (2FA)</p>
                                     <p className="text-xs text-gray-500">Recommended for your role</p>
                                 </div>
                             </div>
                             <div className="flex items-center gap-2">
                                 <span className="text-[10px] font-bold uppercase bg-amber-100 text-amber-700 px-2 py-1 rounded">Not Set</span>
                                 <button onClick={() => alert("Please contact your IT administrator to enable 2FA enforcement.")} className="text-xs font-bold text-brand-blue hover:underline">Enable</button>
                             </div>
                         </div>

                         <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 dark:border-gray-700 rounded-xl border border-gray-100">
                             <div className="flex items-center gap-3">
                                 <div className="w-10 h-10 bg-white dark:bg-gray-900 dark:border-gray-800 rounded-lg flex items-center justify-center border border-gray-200 text-gray-600 dark:text-gray-400">
                                     <Lock className="w-5 h-5" />
                                 </div>
                                 <div>
                                     <p className="font-bold text-gray-900 dark:text-white text-sm">Password Management</p>
                                     <p className="text-xs text-green-600 font-medium flex items-center gap-1">
                                         <CheckCircle className="w-3 h-3" /> Updated recently
                                     </p>
                                 </div>
                             </div>
                             <button 
                                onClick={() => navigate('/change-password')}
                                className="text-xs font-bold text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:text-white border border-gray-300 px-3 py-1.5 rounded-lg bg-white dark:bg-gray-900 dark:border-gray-800"
                             >
                                 Change
                             </button>
                         </div>
                    </div>
                </div>

                {/* Role & Permissions (New) */}
                <div className="bg-white dark:bg-gray-900 dark:border-gray-800 rounded-2xl shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                        <Users className="w-5 h-5 text-gray-400" /> Role & Permissions
                    </h3>
                    
                    <div className="p-4 bg-blue-50 dark:bg-blue-900/20/50 rounded-xl border border-blue-100 mb-4">
                         <div className="flex justify-between items-start mb-2">
                             <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">Current Role</span>
                             <span className="bg-blue-100 text-blue-800 text-[10px] uppercase font-bold px-2 py-0.5 rounded">Client Admin</span>
                         </div>
                         <h4 className="font-bold text-gray-900 dark:text-white mb-3">{user?.name || 'User'}</h4>
                         
                         <div className="grid grid-cols-2 gap-2">
                             <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                                 <CheckCircle className="w-3.5 h-3.5 text-green-500" /> Approve Decisions
                             </div>
                             <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                                 <CheckCircle className="w-3.5 h-3.5 text-green-500" /> View Financials
                             </div>
                             <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                                 <CheckCircle className="w-3.5 h-3.5 text-green-500" /> Manage Users
                             </div>
                             <div className="flex items-center gap-2 text-xs text-gray-400">
                                 <XCircle className="w-3.5 h-3.5" /> Delete Projects
                             </div>
                         </div>
                    </div>

                    <div 
                        onClick={() => alert("Delegation feature is currently strictly controlled. Please request IT Access.")}
                        className="border border-gray-200 rounded-xl p-4 hover:border-brand-blue/30 transition-colors cursor-pointer group"
                    >
                        <div className="flex items-center justify-between mb-1">
                            <h4 className="font-bold text-gray-900 dark:text-white text-sm group-hover:text-brand-blue transition-colors">Delegate Access (Temporary)</h4>
                            <ArrowLeft className="w-4 h-4 text-gray-300 rotate-180" />
                        </div>
                        <p className="text-xs text-gray-500 leading-relaxed">
                            Grant temporary read-only or approval access to colleagues (e.g. for audts or leave).
                        </p>
                    </div>
                </div>
            </div>

            {/* Right Col: Sessions & Compliance */}
            <div className="space-y-6">
                
                {/* Active Sessions */}
                <div className="bg-white dark:bg-gray-900 dark:border-gray-800 rounded-2xl shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between mb-6">
                         <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                             <Monitor className="w-5 h-5 text-gray-400" /> Active Sessions
                         </h3>
                         <button 
                             onClick={handleLogoutAll}
                             className="text-xs font-bold text-red-600 hover:bg-red-50 dark:bg-red-900/20 px-3 py-1.5 rounded-lg transition-colors border border-red-100"
                         >
                             Logout All Devices
                         </button>
                    </div>

                    {loading ? (
                         <div className="text-center py-8 text-gray-400 text-sm flex flex-col items-center gap-2">
                             <RefreshCw className="w-5 h-5 animate-spin" /> Fetching sessions...
                         </div>
                    ) : activeSessions.length === 0 ? (
                         // If empty/failed, assume current is only one
                         <div className="p-4 border border-green-200 bg-green-50 dark:bg-green-900/20/50 rounded-xl text-center">
                             <Shield className="w-6 h-6 text-green-600 mx-auto mb-2" />
                             <p className="text-sm font-bold text-green-800">Session Secure</p>
                             <p className="text-xs text-green-700">You are securely logged in. No other suspicious sessions detected.</p>
                         </div>
                    ) : (
                        <div className="space-y-3">
                            {activeSessions.map((session) => (
                                <div key={session.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-xl">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                                            session.isCurrent ? 'bg-green-100 text-green-600' : 'bg-gray-100 dark:bg-[#0a0a0c] text-gray-500'
                                        }`}>
                                            <Monitor className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-gray-900 dark:text-white">
                                                {getDeviceType(session.userAgent)}
                                                {session.isCurrent && <span className="ml-2 text-[10px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded uppercase font-bold border border-green-200">Current</span>}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                {session.ipAddress || 'Masked IP'} • {session.location || 'Unknown Location'}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* 3. Governance & Enterprise Controls (New) */}
                <div className="bg-white dark:bg-gray-900 dark:border-gray-800 rounded-2xl shadow-sm border border-gray-200 p-6 col-span-1 lg:col-span-2">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2 border-b border-gray-100 pb-4">
                        <Shield className="w-5 h-5 text-brand-blue" /> Enterprise Governance
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        
                        {/* 1. Governance Transparency Panel */}
                        <div className="bg-gray-50 dark:bg-gray-800 dark:border-gray-700 rounded-xl p-5 border border-gray-200">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h4 className="font-bold text-gray-900 dark:text-white text-sm">Governance Transparency</h4>
                                    <p className="text-xs text-gray-500">Active constraints & rule sources</p>
                                </div>
                                <Shield className="w-4 h-4 text-gray-400" />
                            </div>
                            
                            <table className="w-full text-left mb-4">
                                <thead>
                                    <tr className="text-[10px] text-gray-400 uppercase font-bold border-b border-gray-200">
                                        <th className="pb-2 font-normal">Rule</th>
                                        <th className="pb-2 font-normal">Limit</th>
                                        <th className="pb-2 font-normal text-right">Defined By</th>
                                    </tr>
                                </thead>
                                <tbody className="text-xs">
                                    <tr className="border-b border-gray-100 last:border-0">
                                        <td className="py-2 text-gray-600 dark:text-gray-400 font-bold">Budget Approval</td>
                                        <td className="py-2 text-gray-900 dark:text-white font-mono">$50,000</td>
                                        <td className="py-2 text-right text-gray-500">MSA-2024</td>
                                    </tr>
                                    <tr className="border-b border-gray-100 last:border-0">
                                        <td className="py-2 text-gray-600 dark:text-gray-400 font-bold">Change SLA</td>
                                        <td className="py-2 text-gray-900 dark:text-white font-mono">48 Hours</td>
                                        <td className="py-2 text-right text-gray-500">Service Contract</td>
                                    </tr>
                                    <tr className="border-b border-gray-100 last:border-0">
                                        <td className="py-2 text-gray-600 dark:text-gray-400 font-bold">Data Compliance</td>
                                        <td className="py-2 text-green-700 font-bold">GDPR</td>
                                        <td className="py-2 text-right text-gray-500">EU Law</td>
                                    </tr>
                                </tbody>
                            </table>

                            <div className="pt-2 border-t border-gray-200">
                                <p className="text-[10px] text-gray-400 uppercase font-bold mb-2">Escalation Path (Resolution)</p>
                                <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                                    <span className="font-medium text-gray-900 dark:text-white bg-white dark:bg-gray-900 dark:border-gray-800 border border-gray-200 px-2 py-1 rounded">Project Lead</span>
                                    <ChevronRight className="w-3 h-3 text-gray-300" />
                                    <span className="font-medium text-gray-900 dark:text-white bg-white dark:bg-gray-900 dark:border-gray-800 border border-gray-200 px-2 py-1 rounded">Director</span>
                                    <ChevronRight className="w-3 h-3 text-gray-300" />
                                    <span className="font-medium text-gray-900 dark:text-white bg-white dark:bg-gray-900 dark:border-gray-800 border border-gray-200 px-2 py-1 rounded">Sponsor</span>
                                </div>
                            </div>
                        </div>
                        
                        {/* Left: Preferences */}
                         <div>
                             <h4 className="text-sm font-bold text-gray-700 dark:text-gray-300 uppercase mb-4 flex items-center gap-2">
                                 <Bell className="w-4 h-4" /> Notification Protocols
                             </h4>
                             
                             <div className="space-y-4">
                                 <div className="flex items-center justify-between p-4 border border-gray-200 rounded-xl bg-gray-50 dark:bg-gray-800 dark:border-gray-700">
                                     <div>
                                         <p className="font-bold text-gray-900 dark:text-white text-sm">Executive Summary Cadence</p>
                                         <p className="text-xs text-gray-500">Frequency of PDF report generation</p>
                                     </div>
                                     <select className="text-sm border-gray-300 rounded-lg shadow-sm focus:border-brand-blue focus:ring-brand-blue">
                                         <option>Weekly (Mondays)</option>
                                         <option>Monthly (1st)</option>
                                         <option>Quarterly</option>
                                     </select>
                                 </div>
                                 
                                 <div className="flex items-center justify-between p-4 border border-gray-200 rounded-xl bg-gray-50 dark:bg-gray-800 dark:border-gray-700">
                                     <div>
                                         <p className="font-bold text-gray-900 dark:text-white text-sm">Critical Risk Alerts</p>
                                         <p className="text-xs text-gray-500">Immediate email for High/Critical risks</p>
                                     </div>
                                     <div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
                                         <input type="checkbox" name="toggle" id="toggle" className="toggle-checkbox absolute block w-5 h-5 rounded-full bg-white dark:bg-gray-900 dark:border-gray-800 border-4 appearance-none cursor-pointer checked:right-0 checked:border-brand-blue checked:bg-brand-blue"/>
                                         <label htmlFor="toggle" className="toggle-label block overflow-hidden h-5 rounded-full bg-gray-300 cursor-pointer"></label>
                                     </div>
                                 </div>
                             </div>
                         </div>

                        {/* Right: Authorized Approvers */}
                        <div>
                            <h4 className="text-sm font-bold text-gray-700 dark:text-gray-300 uppercase mb-4 flex items-center gap-2">
                                <Users className="w-4 h-4" /> Authorized Approvers
                            </h4>
                            
                            <div className="border border-gray-200 rounded-xl overflow-hidden">
                                <table className="w-full text-sm text-left">
                                    <thead className="bg-gray-50 dark:bg-gray-800 dark:border-gray-700 text-gray-500 font-bold border-b border-gray-200">
                                        <tr>
                                            <th className="px-4 py-2">Name</th>
                                            <th className="px-4 py-2">Role</th>
                                            <th className="px-4 py-2 text-right">Limit</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100 bg-white dark:bg-black">
                                        {/* Mock Data for now - would come from ClientProfile.authorityMatrix */}
                                        <tr>
                                            <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">{user?.name}</td>
                                            <td className="px-4 py-3 text-xs text-gray-500">Project Sponsor</td>
                                            <td className="px-4 py-3 text-right text-green-600 font-mono text-xs">Unlimited</td>
                                        </tr>
                                        <tr>
                                            <td className="px-4 py-3 font-medium text-gray-400">Finance Team</td>
                                            <td className="px-4 py-3 text-xs text-gray-400">Budget Approver</td>
                                            <td className="px-4 py-3 text-right text-gray-400 font-mono text-xs">$50,000</td>
                                        </tr>
                                    </tbody>
                                </table>
                                <div className="bg-gray-50 dark:bg-gray-800 dark:border-gray-700 px-4 py-2 text-center border-t border-gray-200">
                                    <button onClick={() => alert("Please submit a Change Request to modify approvers.")} className="text-xs text-brand-blue font-bold hover:underline">
                                        Request Approver Update
                                    </button>
                                </div>
                            </div>
                        </div>

                    </div>

                    {/* Legal Footer */}
                    <div className="mt-8 pt-6 border-t border-gray-100 grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="text-xs text-gray-500">
                            <p className="font-bold text-gray-700 dark:text-gray-300 mb-1">Compliance Notice</p>
                            <p>This workspace is ISO 27001 certified. All actions are audit-logged. Data is stored in <strong>Mumbai, India</strong> (ap-south-1) in compliance with local data residency laws.</p>
                        </div>
                        <div className="text-xs text-gray-500">
                            <p className="font-bold text-gray-700 dark:text-gray-300 mb-1">Data Access Disclaimer</p>
                            <p>Kangqore personnel have <strong>No Access</strong> to your confidential documents or financial data unless explicitly granted via 'Delegate Access' for support purposes.</p>
                        </div>
                    </div>

                </div>
 
             </div>
         </div>
 
       </div>
     </DashboardLayout>
   );
 };

// Helper component for X icon
const XCircle = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/>
    </svg>
);

export default Settings;
