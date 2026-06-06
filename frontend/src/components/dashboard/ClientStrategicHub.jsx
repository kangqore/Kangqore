import React, { useState } from 'react';
import { 
  Building2, 
  MapPin, 
  Globe, 
  Shield, 
  CreditCard, 
  TrendingUp, 
  Activity, 
  Award,
  ChevronRight,
  PieChart as PieChartIcon,
  BarChart2,
  Info,
  CheckCircle,
  Save,
  X
} from 'lucide-react';
import StrategicRadarChart from '../charts/StrategicRadarChart';
import ResourceAllocationChart from '../charts/ResourceAllocationChart';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || '';

const ClientStrategicHub = ({ profile, clientUser, stats, clientId }) => {
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const queryClient = useQueryClient();

  // Update Profile Mutation
  const updateProfile = useMutation({
      mutationFn: async (data) => {
          const token = localStorage.getItem('token');
          await axios.put(`${BACKEND_URL}/api/client-profiles/${clientId}/profile`, data, {
              headers: { Authorization: `Bearer ${token}` }
          });
      },
      onSuccess: () => {
          queryClient.invalidateQueries(['client-profile', clientId]);
          setIsEditing(false);
      }
  });

  // Fallback data if profile is not provided (Improved for Account Readiness)
  const clientProfile = profile || {
    legalEntityName: clientUser?.company || clientUser?.name || "Profile Not Initialized",
    registeredAddress: "Address Not Verified",
    taxId: "Unverified",
    industryDomain: clientUser?.profession || "Consulting",
    jurisdiction: "Not Set",
    dataResidency: "Standard Cloud (Global)",
    interestedServices: clientUser?.interestedServices || ["Project Management"]
  };

  const tabs = [
    { id: 'profile', label: 'Company Profile', icon: Building2 },
    { id: 'strategic', label: 'Strategic Alignment', icon: Award },
    { id: 'resources', label: 'Resource Dynamics', icon: Activity },
  ];

  // Fetch Latest Feedback to get Company Logo
  const effectiveClientId = clientId || profile?.userId;
  const { data: latestFeedback } = useQuery({
      queryKey: ['latest-client-feedback', effectiveClientId],
      queryFn: async () => {
          const token = localStorage.getItem('token');
          const res = await axios.get(`${BACKEND_URL}/api/feedback?clientId=${effectiveClientId}`, {
              headers: { Authorization: `Bearer ${token}` }
          });
          return res.data[0] || null;
      },
      enabled: !!effectiveClientId
  });

  const companyLogo = latestFeedback?.logoUrl || clientUser?.avatarUrl;

  return (
    <div className="bg-white dark:bg-gray-900 dark:border-gray-800 rounded-2xl border border-gray-200 shadow-sm overflow-hidden animate-in fade-in duration-700">
      {/* Header */}
      <div className="bg-gray-50 dark:bg-gray-800 dark:border-gray-700 border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-600 rounded-lg text-white">
            <Globe className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-gray-900 dark:text-white">Strategic Hub</h3>
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Enterprise Engagement Layer</p>
          </div>
        </div>
        
        <div className="flex bg-gray-200 p-1 rounded-lg">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
                activeTab === tab.id 
                ? 'bg-white dark:bg-gray-900 dark:border-gray-800 text-blue-600 shadow-sm' 
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-300'
              }`}
            >
              <tab.icon className="w-3.5 h-3.5" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="p-6">
        {/* Tab Content: Profile */}
        {activeTab === 'profile' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start animate-in slide-in-from-left-2 duration-300">
            {/* Left: Branding & Info */}
            <div className="lg:col-span-1 space-y-6">
              {isEditing ? (
                 <form onSubmit={(e) => {
                     e.preventDefault();
                     const fd = new FormData(e.target);
                     updateProfile.mutate(Object.fromEntries(fd));
                 }} className="space-y-4 bg-gray-50 dark:bg-gray-800 dark:border-gray-700 p-4 rounded-xl border border-blue-200">
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500">Legal Entity Name</label>
                        <input name="legalEntityName" defaultValue={clientProfile.legalEntityName} className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Company Name" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500">Industry Domain</label>
                        <input name="industryDomain" defaultValue={clientProfile.industryDomain} className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" placeholder="e.g. Fintech" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500">Registered Address</label>
                        <textarea name="registeredAddress" defaultValue={clientProfile.registeredAddress} className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" rows={3} placeholder="Full Address" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500">Data Residency</label>
                        <select name="dataResidency" defaultValue={clientProfile.dataResidency} className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none">
                            <option>Standard Cloud (Global)</option>
                            <option>EU Region (GDPR)</option>
                            <option>India (Local)</option>
                            <option>US (Federal)</option>
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500">Jurisdiction</label>
                        <input name="jurisdiction" defaultValue={clientProfile.jurisdiction} className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" placeholder="e.g. Delaware, US" />
                    </div>

                    <div className="flex gap-2 pt-2">
                        <button type="submit" className="flex-1 bg-blue-600 text-white font-bold py-2 rounded-lg text-xs flex items-center justify-center gap-2 hover:bg-blue-700">
                            <Save className="w-3.5 h-3.5" /> Save Changes
                        </button>
                        <button type="button" onClick={() => setIsEditing(false)} className="px-3 bg-white dark:bg-gray-900 dark:border-gray-800 text-gray-600 dark:text-gray-400 border border-gray-200 font-bold py-2 rounded-lg text-xs hover:bg-gray-50">
                            <X className="w-3.5 h-3.5" />
                        </button>
                    </div>
                 </form>
              ) : (
                <>
                  <div className="flex flex-col items-center p-6 bg-gray-50 dark:bg-gray-800 dark:border-gray-700 rounded-2xl border border-gray-100 border-dashed">
                    <div className="w-20 h-20 bg-white dark:bg-gray-900 dark:border-gray-800 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-center mb-4 overflow-hidden">
                      {companyLogo ? (
                        <img src={companyLogo} alt="Logo" className="w-full h-full object-contain p-2 rounded-xl" />
                      ) : (
                        <Building2 className="w-10 h-10 text-gray-300" />
                      )}
                    </div>
                    <h4 className="text-lg font-black text-gray-900 dark:text-white text-center">{clientProfile.legalEntityName}</h4>
                    <p className="text-xs text-blue-600 font-bold mt-1 uppercase">{clientProfile.industryDomain}</p>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-[10px] text-gray-400 font-bold uppercase">Registered Address</p>
                        <p className="text-xs text-gray-700 dark:text-gray-300 font-medium leading-relaxed">{clientProfile.registeredAddress}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Shield className="w-4 h-4 text-gray-400" />
                      <div>
                        <p className="text-[10px] text-gray-400 font-bold uppercase">Data Residency</p>
                        <p className="text-xs text-gray-700 dark:text-gray-300 font-medium">{clientProfile.dataResidency}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Globe className="w-4 h-4 text-gray-400" />
                      <div>
                        <p className="text-[10px] text-gray-400 font-bold uppercase">Jurisdiction</p>
                        <p className="text-xs text-gray-700 dark:text-gray-300 font-medium">{clientProfile.jurisdiction}</p>
                      </div>
                    </div>
                    
                    {/* Edit Button */}
                    <button 
                        onClick={() => setIsEditing(true)}
                        className="w-full mt-2 text-xs text-blue-600 font-bold border border-blue-100 bg-blue-50 dark:bg-blue-900/20/50 rounded-lg py-2 hover:bg-blue-50 dark:bg-blue-900/20 transition-colors flex items-center justify-center gap-1"
                    >
                        Edit Profile Details
                    </button>
                  </div>
                </>
              )}
            </div>

            {/* Right: Detailed Fields */}
            <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-white dark:bg-gray-900 dark:border-gray-800 border border-gray-100 rounded-xl hover:shadow-md transition-shadow">
                <div className="flex items-center gap-2 mb-3">
                  <CreditCard className="w-4 h-4 text-emerald-500" />
                  <h5 className="text-xs font-bold text-gray-900 dark:text-white uppercase">Financial Id</h5>
                </div>
                <p className="text-xl font-black text-gray-900 dark:text-white">{clientProfile.taxId}</p>
                <p className="text-[10px] text-gray-400 mt-1 italic">Verified Tax ID for compliance</p>
              </div>

              <div className="p-4 bg-white dark:bg-gray-900 dark:border-gray-800 border border-gray-100 rounded-xl hover:shadow-md transition-shadow">
                <div className="flex items-center gap-2 mb-3">
                  <TrendingUp className="w-4 h-4 text-blue-500" />
                  <h5 className="text-xs font-bold text-gray-900 dark:text-white uppercase">Growth Trajectory</h5>
                </div>
                <p className="text-xl font-black text-blue-600">+12.4% <span className="text-xs font-medium text-gray-400">Quarterly</span></p>
                <p className="text-[10px] text-gray-400 mt-1 italic">Internal platform benchmark</p>
              </div>


              {/* Authority Matrix Section */}
              <div className="md:col-span-2 pt-4 border-t border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <h5 className="text-xs font-bold text-gray-900 dark:text-white uppercase flex items-center gap-2">
                    <Shield className="w-3.5 h-3.5 text-blue-600" /> Identity & Authority Matrix
                  </h5>
                  <span className="text-[10px] text-gray-400">Authorized Signatories</span>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-gray-50">
                        <th className="py-2 text-[10px] font-bold text-gray-400 uppercase">Stakeholder</th>
                        <th className="py-2 text-[10px] font-bold text-gray-400 uppercase text-center">Budget</th>
                        <th className="py-2 text-[10px] font-bold text-gray-400 uppercase text-center">Scope</th>
                        <th className="py-2 text-[10px] font-bold text-gray-400 uppercase text-center">Go-Live</th>
                        <th className="py-2 text-[10px] font-bold text-gray-400 uppercase text-right">Limit</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {(clientProfile.authorityMatrix && clientProfile.authorityMatrix.length > 0) ? (
                        clientProfile.authorityMatrix.map((role, idx) => (
                          <tr key={idx} className="hover:bg-gray-50 dark:bg-[#050505]/50 transition-colors">
                            <td className="py-3">
                              <p className="text-xs font-bold text-gray-900 dark:text-white">{role.name}</p>
                              <p className="text-[10px] text-gray-500">{role.roleName}</p>
                            </td>
                            <td className="py-3 text-center">
                              {role.canApproveBudget ? <CheckCircle className="w-3.5 h-3.5 text-emerald-500 mx-auto" /> : <div className="w-1.5 h-1.5 bg-gray-200 rounded-full mx-auto" />}
                            </td>
                            <td className="py-3 text-center">
                              {role.canApproveScope ? <CheckCircle className="w-3.5 h-3.5 text-emerald-500 mx-auto" /> : <div className="w-1.5 h-1.5 bg-gray-200 rounded-full mx-auto" />}
                            </td>
                            <td className="py-3 text-center">
                              {role.canApproveGoLive ? <CheckCircle className="w-3.5 h-3.5 text-emerald-500 mx-auto" /> : <div className="w-1.5 h-1.5 bg-gray-200 rounded-full mx-auto" />}
                            </td>
                            <td className="py-3 text-right">
                              <p className="text-xs font-bold text-gray-700 dark:text-gray-300">{role.signingLimit ? `₹${Number(role.signingLimit).toLocaleString()}` : '-'}</p>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={5} className="py-8 text-center bg-gray-50 dark:bg-[#050505]/50 rounded-lg">
                            <div className="flex flex-col items-center">
                              <Shield className="w-8 h-8 text-gray-300 mb-2" />
                              <p className="text-xs font-bold text-gray-500">Identity & Authority Matrix Pending</p>
                              <p className="text-[10px] text-gray-400 mt-1">Official signatories have not been initialized for this client.</p>
                            </div>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="md:col-span-2 p-4 bg-blue-50 dark:bg-blue-900/20/50 border border-blue-100 rounded-xl">
                <h5 className="text-xs font-bold text-blue-800 uppercase mb-3 flex items-center gap-2">
                  <Shield className="w-3.5 h-3.5" /> Enrolled Service Pillars
                </h5>
                <div className="flex flex-wrap gap-2">
                  {clientProfile.interestedServices.map((service, idx) => (
                    <span key={idx} className="bg-white dark:bg-gray-900 dark:border-gray-800 px-3 py-1 rounded-full text-xs font-bold text-blue-600 border border-blue-100 shadow-sm flex items-center gap-1.5">
                      <ChevronRight className="w-3 h-3" /> {service}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab Content: Strategic Alignment */}
        {activeTab === 'strategic' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center animate-in slide-in-from-right-2 duration-300">
            <div>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h4 className="text-lg font-black text-gray-900 dark:text-white">Engagement Fidelity</h4>
                  <p className="text-xs text-gray-500">Cross-dimensional alignment score across 5 key pillars.</p>
                </div>
                <div className="p-3 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-full border border-blue-100">
                  <PieChartIcon className="w-5 h-5" />
                </div>
              </div>

              <div className="space-y-4">
                <div className="p-4 bg-gray-50 dark:bg-gray-800 dark:border-gray-700 rounded-xl border border-gray-100">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-bold text-gray-700 dark:text-gray-300">Governance Velocity</span>
                    <span className="text-xs font-black text-blue-600 uppercase">Excellent</span>
                  </div>
                  <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-600 rounded-full" style={{ width: '85%' }} />
                  </div>
                </div>

                <div className="p-4 bg-gray-50 dark:bg-gray-800 dark:border-gray-700 rounded-xl border border-gray-100">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-bold text-gray-700 dark:text-gray-300">Compliance Adherence</span>
                    <span className="text-xs font-black text-emerald-600 uppercase">Optimal</span>
                  </div>
                  <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full" style={{ width: '94%' }} />
                  </div>
                </div>
              </div>
            </div>

            <div>
              <StrategicRadarChart />
            </div>
          </div>
        )}

        {/* Tab Content: Resources */}
        {activeTab === 'resources' && (
          <div className="animate-in slide-in-from-bottom-2 duration-300">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h4 className="text-lg font-black text-gray-900 dark:text-white">Resource Consumption Analytics</h4>
                <p className="text-xs text-gray-500">Weekly allocation of human and system capital across engagement tracks.</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="flex items-center gap-1.5 text-[10px] font-bold text-gray-400 bg-gray-50 dark:bg-gray-800 dark:border-gray-700 px-2 py-1 rounded border border-gray-100">
                  <Info className="w-3 h-3 text-blue-400" /> Real-time Telemetry
                </span>
                <div className="p-3 bg-purple-50 dark:bg-purple-900/20 text-purple-600 rounded-full border border-purple-100">
                  <BarChart2 className="w-5 h-5" />
                </div>
              </div>
            </div>

            <div className="p-4 bg-gray-50 dark:bg-gray-800 dark:border-gray-700/50 rounded-2xl border border-gray-100">
              <ResourceAllocationChart />
            </div>

            <div className="grid grid-cols-3 gap-4 mt-6">
              <div className="p-3 text-center">
                <p className="text-2xl font-black text-blue-600">124h</p>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Engineering</p>
              </div>
              <div className="p-3 text-center border-x border-gray-100">
                <p className="text-2xl font-black text-purple-600">42h</p>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Governance</p>
              </div>
              <div className="p-3 text-center">
                <p className="text-2xl font-black text-emerald-600">18h</p>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Strategic</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClientStrategicHub;
