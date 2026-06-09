import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import DashboardLayout from '../../../components/DashboardLayout';
import ServiceSelector from '../../../components/common/ServiceSelector';
import { 
  Building2, CreditCard, ShieldAlert, Save, Loader2, 
  MapPin, Globe, FileText, User, Phone, Mail, Plus, Trash2, CheckCircle, Scale, BadgeCheck, Shield
} from 'lucide-react';
import { toast } from 'sonner';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || '';

const ClientSettings = () => {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('profile');

  const [formData, setFormData] = useState({
      legalEntityName: '',
      registeredAddress: '',
      taxId: '',
      industryDomain: '',
      jurisdiction: '',
      dataResidency: '',
      billingContactName: '',
      billingContactEmail: '',
      billingContactPhone: '',
      escalationMatrix: [],
      authorityMatrix: [],
      interestedServices: []
  });

  // Fetch Settings
  const { data: profile, isLoading } = useQuery({
      queryKey: ['clientSettings'],
      queryFn: async () => {
          const token = localStorage.getItem('token');
          const res = await axios.get(`${BACKEND_URL}/api/client/settings`, {
              headers: { Authorization: `Bearer ${token}` }
          });
          return res.data;
      }
  });

  // Populate Form
  useEffect(() => {
      if (profile) {
          setFormData(prev => ({
              ...prev,
              ...profile,
              escalationMatrix: Array.isArray(profile.escalationMatrix) ? profile.escalationMatrix : [],
              authorityMatrix: Array.isArray(profile.authorityMatrix) ? profile.authorityMatrix : [],
              interestedServices: Array.isArray(profile.interestedServices) ? profile.interestedServices : []
          }));
      }
  }, [profile]);

  // Mutation to Save
  const mutation = useMutation({
      mutationFn: async (data) => {
          const token = localStorage.getItem('token');
          await axios.put(`${BACKEND_URL}/api/client/settings`, data, {
              headers: { Authorization: `Bearer ${token}` }
          });
      },
      onSuccess: () => {
          toast.success("Enterprise settings updated successfully");
          queryClient.invalidateQueries(['clientSettings']);
      },
      onError: (err) => {
          toast.error(err.response?.data?.error || "Failed to save settings");
      }
  });

  const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleEscalationChange = (index, field, value) => {
      const newMatrix = [...formData.escalationMatrix];
      newMatrix[index] = { ...newMatrix[index], [field]: value };
      setFormData(prev => ({ ...prev, escalationMatrix: newMatrix }));
  };

  const addEscalationRow = () => {
      setFormData(prev => ({
          ...prev,
          escalationMatrix: [...prev.escalationMatrix, { level: 'L1', name: '', email: '', phone: '' }]
      }));
  };

  const removeEscalationRow = (index) => {
      const newMatrix = formData.escalationMatrix.filter((_, i) => i !== index);
      setFormData(prev => ({ ...prev, escalationMatrix: newMatrix }));
  };

  const handleSave = () => {
      mutation.mutate(formData);
  };

  if (isLoading) return <div className="p-8 flex justify-center"><Loader2 className="animate-spin text-brand-blue" /></div>;

  const tabs = [
    { id: 'profile', label: 'Enterprise Profile', icon: Building2 },
    { id: 'billing', label: 'Billing Contacts', icon: CreditCard },
    { id: 'services', label: 'Services of Interest', icon: Building2 }, // Reusing icon or finding new one? Maybe default to Building2
    { id: 'escalation', label: 'Escalation Matrix', icon: ShieldAlert },
    { id: 'notifications', label: 'Notifications', icon: Mail },
    { id: 'compliance', label: 'Compliance', icon: Shield },
    { id: 'authority', label: 'Authority', icon: User },
    { id: 'governance', label: 'Governance', icon: Scale },
  ];

  return (
    <DashboardLayout role="client" title="Enterprise Settings" subtitle="Manage your organization entity and contacts">
      
      <div className="bg-white dark:bg-gray-900 dark:border-gray-800 rounded-2xl shadow-sm border border-gray-200 overflow-hidden min-h-[600px]">
        {/* Tabs Header */}
        <div className="border-b border-gray-200 bg-gray-50 dark:bg-gray-800 dark:border-gray-700/50 px-8 pt-6 flex gap-8 overflow-x-auto">
            {tabs.map(tab => (
                <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`pb-4 text-sm font-bold flex items-center gap-2 transition-all relative whitespace-nowrap ${
                        activeTab === tab.id 
                        ? 'text-brand-blue' 
                        : 'text-gray-500 hover:text-gray-700 dark:text-gray-300'
                    }`}
                >
                    <tab.icon className="w-4 h-4" />
                    {tab.label}
                    {activeTab === tab.id && (
                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-blue rounded-t-full" />
                    )}
                </button>
            ))}
        </div>

        {/* Content Area */}
        <div className="p-8 max-w-3xl">
            
            {/* PROFILE TAB */}
            {activeTab === 'profile' && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
                    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 p-4 rounded-lg flex gap-3 mb-6">
                        <Globe className="w-5 h-5 text-blue-600 mt-0.5" />
                        <div>
                            <h4 className="text-sm font-bold text-blue-900">Legal Entity Definition</h4>
                            <p className="text-xs text-blue-700 mt-1">These details determine your contracting entity, tax handling, and data residency compliance.</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase">Legal Entity Name</label>
                            <div className="relative">
                                <Building2 className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                                <input 
                                    name="legalEntityName"
                                    value={formData.legalEntityName}
                                    onChange={handleChange}
                                    className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-100 focus:border-brand-blue outline-none transition-all"
                                    placeholder="e.g. Acme Corp Global Ltd."
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase">Tax ID / VAT Number</label>
                            <div className="relative">
                                <FileText className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                                <input 
                                    name="taxId"
                                    value={formData.taxId}
                                    onChange={handleChange}
                                    className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-100 focus:border-brand-blue outline-none transition-all"
                                    placeholder="e.g. GB123456789"
                                />
                            </div>
                        </div>

                        <div className="col-span-2 space-y-2">
                            <label className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase">Registered Address</label>
                            <div className="relative">
                                <MapPin className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                                <input 
                                    name="registeredAddress"
                                    value={formData.registeredAddress}
                                    onChange={handleChange}
                                    className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-100 focus:border-brand-blue outline-none transition-all"
                                    placeholder="Full billing address"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase">Jurisdiction (Governing Law)</label>
                            <select 
                                name="jurisdiction"
                                value={formData.jurisdiction}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-100 focus:border-brand-blue outline-none transition-all"
                            >
                                <option value="">Select Jurisdiction</option>
                                <option value="US_DELAWARE">USA (Delaware)</option>
                                <option value="UK">United Kingdom</option>
                                <option value="EU_GERMANY">Germany</option>
                                <option value="SINGAPORE">Singapore</option>
                                <option value="INDIA">India</option>
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase">Data Residency Requirement</label>
                            <select 
                                name="dataResidency"
                                value={formData.dataResidency}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-100 focus:border-brand-blue outline-none transition-all"
                            >
                                <option value="">No Specific Requirement</option>
                                <option value="US_ONLY">US Only</option>
                                <option value="EU_ONLY">EU Only (GDPR Strict)</option>
                                <option value="APAC">APAC Region</option>
                            </select>
                        </div>
                    </div>
                </div>
            )}

            {/* BILLING TAB */}
            {activeTab === 'billing' && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
                    <div className="bg-green-50 dark:bg-green-900/20 border border-green-100 p-4 rounded-lg flex gap-3 mb-6">
                        <CreditCard className="w-5 h-5 text-green-600 mt-0.5" />
                        <div>
                            <h4 className="text-sm font-bold text-green-900">Billing Contact</h4>
                            <p className="text-xs text-green-700 mt-1">Invoices and financial notifications will be sent to this contact automatically.</p>
                        </div>
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-800 dark:border-gray-700 p-6 rounded-xl border border-gray-200 space-y-6">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase">Contact Name</label>
                            <div className="relative">
                                <User className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                                <input 
                                    name="billingContactName"
                                    value={formData.billingContactName}
                                    onChange={handleChange}
                                    className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-100 focus:border-brand-blue outline-none transition-all"
                                    placeholder="e.g. John Doe, Accounts Payable"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase">Email Address</label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                                    <input 
                                        name="billingContactEmail"
                                        value={formData.billingContactEmail}
                                        onChange={handleChange}
                                        className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-100 focus:border-brand-blue outline-none transition-all"
                                        placeholder="billing@company.com"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase">Phone Number</label>
                                <div className="relative">
                                    <Phone className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                                    <input 
                                        name="billingContactPhone"
                                        value={formData.billingContactPhone}
                                        onChange={handleChange}
                                        className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-100 focus:border-brand-blue outline-none transition-all"
                                        placeholder="+1 (555) 000-0000"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* SERVICES OF INTEREST TAB (New) */}
            {activeTab === 'services' && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
                    <div className="bg-indigo-50 border border-indigo-100 p-4 rounded-lg flex gap-3 mb-6">
                        <Building2 className="w-5 h-5 text-indigo-600 mt-0.5" />
                        <div>
                            <h4 className="text-sm font-bold text-indigo-900">Services of Interest</h4>
                            <p className="text-xs text-indigo-700 mt-1">Manage the services you are interested in or currently consuming.</p>
                        </div>
                    </div>
                    
                    <ServiceSelector 
                        selectedServices={formData.interestedServices}
                        onChange={(services) => setFormData(prev => ({ ...prev, interestedServices: services }))}
                        label="Your Service Portfolio"
                    />
                </div>
            )}

            {/* ESCALATION TAB */}
            {activeTab === 'escalation' && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
                    <div className="bg-amber-50 border border-amber-100 p-4 rounded-lg flex gap-3 mb-6">
                        <ShieldAlert className="w-5 h-5 text-amber-600 mt-0.5" />
                        <div>
                            <h4 className="text-sm font-bold text-amber-900">Escalation Matrix</h4>
                            <p className="text-xs text-amber-700 mt-1">Define who we should contact in case of critical incidents or blockers.</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        {formData.escalationMatrix.length === 0 && (
                            <div className="text-center py-8 bg-gray-50 dark:bg-gray-800 dark:border-gray-700 rounded-xl border border-dashed border-gray-200">
                                <p className="text-sm text-gray-500 mb-2">No escalation contacts defined.</p>
                            </div>
                        )}

                        {formData.escalationMatrix.map((contact, idx) => (
                            <div key={idx} className="flex gap-3 items-start p-4 bg-white dark:bg-gray-900 dark:border-gray-800 border border-gray-200 rounded-xl shadow-sm hover:border-blue-200 transition-colors">
                                <div className="w-24 shrink-0">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Level</label>
                                    <select
                                        value={contact.level}
                                        onChange={(e) => handleEscalationChange(idx, 'level', e.target.value)}
                                        className="w-full p-2 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:bg-white dark:bg-gray-900 dark:border-gray-800"
                                    >
                                        <option value="L1">Level 1</option>
                                        <option value="L2">Level 2</option>
                                        <option value="L3">Level 3 (Exec)</option>
                                    </select>
                                </div>
                                <div className="flex-1 space-y-3">
                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <label className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Name</label>
                                            <input
                                                value={contact.name}
                                                onChange={(e) => handleEscalationChange(idx, 'name', e.target.value)}
                                                className="w-full p-2 border border-gray-200 rounded-lg text-sm"
                                                placeholder="Contact Name"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Email</label>
                                            <input
                                                value={contact.email}
                                                onChange={(e) => handleEscalationChange(idx, 'email', e.target.value)}
                                                className="w-full p-2 border border-gray-200 rounded-lg text-sm"
                                                placeholder="Email Address"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Phone (Optional)</label>
                                        <input
                                            value={contact.phone}
                                            onChange={(e) => handleEscalationChange(idx, 'phone', e.target.value)}
                                            className="w-full p-2 border border-gray-200 rounded-lg text-sm"
                                            placeholder="+1 ..."
                                        />
                                    </div>
                                </div>
                                <button 
                                    onClick={() => removeEscalationRow(idx)}
                                    className="text-gray-400 hover:text-red-500 p-2"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        ))}
                        
                        <button 
                            onClick={addEscalationRow}
                            className="w-full py-3 border-2 border-dashed border-gray-200 rounded-xl text-gray-500 font-bold text-sm hover:border-brand-blue hover:text-brand-blue transition-all flex items-center center gap-2"
                        >
                            <Plus className="w-4 h-4" /> Add Escalation Contact
                        </button>
                    </div>
                </div>
            )}

            {/* NOTIFICATIONS TAB */}
            {activeTab === 'notifications' && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
                    <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-100 p-4 rounded-lg flex gap-3 mb-6">
                        <Mail className="w-5 h-5 text-purple-600 mt-0.5" />
                        <div>
                            <h4 className="text-sm font-bold text-purple-900">Communication Cadence</h4>
                            <p className="text-xs text-purple-700 mt-1">Control how often you receive executive summaries and operational updates.</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="p-4 bg-white dark:bg-gray-900 dark:border-gray-800 border border-gray-200 rounded-xl flex justify-between items-center shadow-sm">
                            <div>
                                <h5 className="font-bold text-gray-900 dark:text-white text-sm">Weekly Executive Summary</h5>
                                <p className="text-xs text-gray-500 mt-1">PDF report containing risks, decisions, and commercial status.</p>
                            </div>
                            <select className="border-gray-200 rounded-lg text-sm p-2 bg-gray-50 dark:bg-gray-800 dark:border-gray-700 font-bold text-gray-700 dark:text-gray-300">
                                <option>Every Monday (09:00 AM)</option>
                                <option>Every Friday (05:00 PM)</option>
                                <option>Monthly Only</option>
                            </select>
                        </div>

                        <div className="p-4 bg-white dark:bg-gray-900 dark:border-gray-800 border border-gray-200 rounded-xl flex justify-between items-center shadow-sm">
                            <div>
                                <h5 className="font-bold text-gray-900 dark:text-white text-sm">Critical Incident Alerts</h5>
                                <p className="text-xs text-gray-500 mt-1">Real-time SMS/Email for Severity 1 incidents.</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-[10px] font-bold uppercase">Always On</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* COMPLIANCE TAB */}
            {activeTab === 'compliance' && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
                    <div className="bg-gray-50 dark:bg-gray-800 dark:border-gray-700 p-6 rounded-xl border border-gray-200">
                         <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wide mb-4 flex items-center gap-2">
                             <Shield className="w-4 h-4 text-gray-500" /> Data Governance
                         </h3>
                         
                         <div className="grid grid-cols-2 gap-8">
                             <div>
                                 <p className="text-[10px] text-gray-400 font-bold uppercase mb-1">Data Residency</p>
                                 <p className="text-sm text-gray-800 dark:text-gray-50 font-medium">
                                     {formData.dataResidency === 'US_ONLY' ? '🇺🇸 United States (Virginia)' : 
                                      formData.dataResidency === 'EU_ONLY' ? '🇪🇺 European Union (Frankfurt)' : '🌐 Global Edge Network'}
                                 </p>
                             </div>
                             <div>
                                 <p className="text-[10px] text-gray-400 font-bold uppercase mb-1">Encryption Standard</p>
                                 <p className="text-sm text-gray-800 dark:text-gray-50 font-medium font-mono">AES-256 (At Rest) / TLS 1.3 (In Transit)</p>
                             </div>
                             <div>
                                 <p className="text-[10px] text-gray-400 font-bold uppercase mb-1">Access Scope</p>
                                 <p className="text-sm text-gray-800 dark:text-gray-50 font-medium">Role-Based Access Control (RBAC)</p>
                             </div>
                             <div>
                                 <p className="text-[10px] text-gray-400 font-bold uppercase mb-1">Audit Retention</p>
                                 <p className="text-sm text-gray-800 dark:text-gray-50 font-medium">7 Years (Financial & Decision Logs)</p>
                             </div>
                         </div>
                    </div>
                    
                    <div className="bg-blue-50 dark:bg-blue-900/20/50 p-4 rounded-lg border border-blue-100 text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                        <strong>Disclaimer:</strong> Kangqore acts as a Data Processor under GDPR/CCPA. 
                        You (the Client) retain full ownership of all intellectual property, decision logs, and uploaded artifacts.
                        Authorized Kangqore personnel may access data solely for delivery and support purposes.
                    </div>
                </div>
            )}

            {/* AUTHORITY TAB */}
            {activeTab === 'authority' && (
                 <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
                    <div className="bg-white dark:bg-gray-900 dark:border-gray-800 rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50 dark:bg-gray-800 dark:border-gray-700/50 flex justify-between items-center">
                            <div>
                                <h3 className="font-bold text-gray-900 dark:text-white text-sm">Authorized Signatories</h3>
                                <p className="text-xs text-gray-500">Personnel authorized to bind your organization to Risks, Costs, and Decisions.</p>
                            </div>
                            <span className="text-[10px] bg-gray-100 dark:bg-gray-800 dark:border-gray-700 text-gray-600 dark:text-gray-400 px-2 py-1 rounded border border-gray-200 font-medium uppercase">
                                Managed by Kangqore Admin
                            </span>
                        </div>
                        <table className="w-full text-sm text-left">
                            <thead className="bg-gray-50 dark:bg-gray-800 dark:border-gray-700 border-b border-gray-100">
                                <tr>
                                    <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase">Role</th>
                                    <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase">Name</th>
                                    <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase">Powers</th>
                                    <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase">Limit</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {profile?.authorityMatrix?.length === 0 && (
                                    <tr><td colSpan="4" className="p-6 text-center text-gray-400 italic">No authority matrix defined. Please contact your Account Manager.</td></tr>
                                )}
                                {profile?.authorityMatrix?.map(role => (
                                    <tr key={role.id}>
                                        <td className="px-6 py-4 font-bold text-gray-900 dark:text-white">{role.roleName}</td>
                                        <td className="px-6 py-4 text-gray-700 dark:text-gray-300">{role.name}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex gap-2">
                                                {role.canApproveBudget && <span title="Can Approve Budget" className="bg-green-100 text-green-700 px-1.5 py-0.5 rounded text-[10px] font-bold">$$$</span>}
                                                {role.canApproveScope && <span title="Can Approve Scope" className="bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded text-[10px] font-bold">SCOPE</span>}
                                                {role.canApproveGoLive && <span title="Can Approve Go-Live" className="bg-red-100 text-red-700 px-1.5 py-0.5 rounded text-[10px] font-bold">LIVE</span>}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 font-mono text-gray-500 text-xs">
                                            {role.signingLimit ? `$${role.signingLimit.toLocaleString()}` : 'Unlimited'}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                 </div>
            )}

            {/* GOVERNANCE TAB */}
            {activeTab === 'governance' && (
                 <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
                    <div className="bg-slate-50 border border-slate-200 p-4 rounded-lg flex gap-3 mb-6">
                        <Scale className="w-5 h-5 text-slate-600 dark:text-gray-400 mt-0.5" />
                        <div>
                            <h4 className="text-sm font-bold text-slate-900 dark:text-white">Governance Framework</h4>
                            <p className="text-xs text-slate-600 dark:text-gray-400 mt-1">
                                These rules define the operational boundaries of our engagement. 
                                They are derived from our Master Services Agreement (MSA), local laws, and security policies.
                            </p>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-900 dark:border-gray-800 rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-gray-50 dark:bg-gray-800 dark:border-gray-700 border-b border-gray-100">
                                <tr>
                                    <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase">Rule Name</th>
                                    <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase">Constraint / Limit</th>
                                    <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase">Defined By (Source)</th>
                                    <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                <tr className="hover:bg-gray-50 dark:bg-[#050505]/50 transition-colors">
                                    <td className="px-6 py-4 font-bold text-gray-900 dark:text-white">Budget Cap (Monthly)</td>
                                    <td className="px-6 py-4 font-mono text-gray-600 dark:text-gray-400">$50,000.00</td>
                                    <td className="px-6 py-4">
                                        <span className="flex items-center gap-1.5 text-xs font-bold text-blue-700 bg-blue-50 dark:bg-blue-900/20 px-2 py-1 rounded border border-blue-100 w-fit">
                                            <FileText className="w-3 h-3" /> MSA-2024 (Contract)
                                        </span>
                                    </td>
                                    <td className="px-6 py-4"><span className="text-xs font-bold text-green-600 flex items-center gap-1"><CheckCircle className="w-3 h-3" /> Active</span></td>
                                </tr>
                                <tr className="hover:bg-gray-50 dark:bg-[#050505]/50 transition-colors">
                                    <td className="px-6 py-4 font-bold text-gray-900 dark:text-white">Data Residency</td>
                                    <td className="px-6 py-4 font-mono text-gray-600 dark:text-gray-400">EU Only (Frankfurt)</td>
                                    <td className="px-6 py-4">
                                        <span className="flex items-center gap-1.5 text-xs font-bold text-purple-700 bg-purple-50 dark:bg-purple-900/20 px-2 py-1 rounded border border-purple-100 w-fit">
                                            <Globe className="w-3 h-3" /> GDPR (Law)
                                        </span>
                                    </td>
                                    <td className="px-6 py-4"><span className="text-xs font-bold text-green-600 flex items-center gap-1"><CheckCircle className="w-3 h-3" /> Enforced</span></td>
                                </tr>
                                <tr className="hover:bg-gray-50 dark:bg-[#050505]/50 transition-colors">
                                    <td className="px-6 py-4 font-bold text-gray-900 dark:text-white">Vendor Selection</td>
                                    <td className="px-6 py-4 font-mono text-gray-600 dark:text-gray-400">Pre-approved List Only</td>
                                    <td className="px-6 py-4">
                                        <span className="flex items-center gap-1.5 text-xs font-bold text-amber-700 bg-amber-50 px-2 py-1 rounded border border-amber-100 w-fit">
                                            <ShieldAlert className="w-3 h-3" /> Security Policy (Kangqore)
                                        </span>
                                    </td>
                                    <td className="px-6 py-4"><span className="text-xs font-bold text-green-600 flex items-center gap-1"><CheckCircle className="w-3 h-3" /> Active</span></td>
                                </tr>
                                <tr className="hover:bg-gray-50 dark:bg-[#050505]/50 transition-colors">
                                    <td className="px-6 py-4 font-bold text-gray-900 dark:text-white">Change Approval</td>
                                    <td className="px-6 py-4 font-mono text-gray-600 dark:text-gray-400">&gt; $5k requires VP Approval</td>
                                    <td className="px-6 py-4">
                                        <span className="flex items-center gap-1.5 text-xs font-bold text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 dark:border-gray-700 px-2 py-1 rounded border border-gray-200 w-fit">
                                            <User className="w-3 h-3" /> Internal Policy (Client)
                                        </span>
                                    </td>
                                    <td className="px-6 py-4"><span className="text-xs font-bold text-green-600 flex items-center gap-1"><CheckCircle className="w-3 h-3" /> Active</span></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                 </div>
            )}

            {/* Save Area */}
            {activeTab !== 'authority' && activeTab !== 'compliance' && activeTab !== 'notifications' && activeTab !== 'governance' && (
                <div className="mt-8 pt-6 border-t border-gray-200 flex justify-end">
                    <button 
                        onClick={handleSave}
                        disabled={mutation.isPending}
                        className="bg-brand-blue text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition-all flex items-center gap-2 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {mutation.isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                        Save Enterprise Settings
                    </button>
                </div>
            )}
            {/* GOVERNANCE TAB */}
            {activeTab === 'governance' && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
                    <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-100 p-4 rounded-lg flex gap-3 mb-6">
                        <Scale className="w-5 h-5 text-purple-600 mt-0.5" />
                        <div>
                            <h4 className="text-sm font-bold text-purple-900">Governance Framework</h4>
                            <p className="text-xs text-purple-700 mt-1">
                                These rules and constraints are defined by Kangqore Admin to ensure compliance with our Master Services Agreement.
                            </p>
                        </div>
                    </div>

                    {/* Rule Provenance (Why/Who/When) */}
                    {(formData.governanceRationale || formData.governanceApprovedBy || formData.governanceApprovedAt) && (
                        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 rounded-lg p-4 mb-6">
                            <h4 className="text-sm font-bold text-blue-900 mb-3 flex items-center gap-2">
                                <BadgeCheck className="w-4 h-4" /> Rule Provenance
                            </h4>
                            <div className="space-y-2 text-xs text-blue-800">
                                {formData.governanceRationale && (
                                    <div>
                                        <strong className="text-blue-900">Why these rules exist:</strong>
                                        <p className="mt-1 text-blue-700">{formData.governanceRationale}</p>
                                    </div>
                                )}
                                <div className="flex gap-6 mt-3">
                                    {formData.governanceApprovedBy && (
                                        <p><strong className="text-blue-900">Approved by:</strong> {formData.governanceApprovedBy}</p>
                                    )}
                                    {formData.governanceApprovedAt && (
                                        <p><strong className="text-blue-900">Last updated:</strong> {new Date(formData.governanceApprovedAt).toLocaleDateString()}</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="bg-white dark:bg-gray-900 dark:border-gray-800 border border-gray-200 rounded-xl p-6 shadow-sm">
                        <h4 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                           <FileText className="w-4 h-4 text-gray-400" /> Current Rules
                           {formData.rulesLastUpdated && (
                               <span className="text-xs font-normal text-gray-400 ml-auto">
                                   Last Updated: {new Date(formData.rulesLastUpdated).toLocaleDateString()}
                               </span>
                           )}
                        </h4>
                        
                        <div className="bg-gray-50 dark:bg-gray-800 dark:border-gray-700 p-6 rounded-lg border border-gray-200 text-sm text-gray-700 dark:text-gray-300 leading-relaxed font-mono whitespace-pre-wrap h-64 overflow-y-auto mb-6">
                            {formData.governanceRules || "No governance rules have been defined for this client profile yet."}
                        </div>

                        {/* Acknowledgement State */}
                        <div className="border-t border-gray-100 pt-6 flex items-center justify-between">
                            <div>
                                {formData.rulesAcknowledgedAt ? (
                                    formData.rulesLastUpdated && new Date(formData.rulesLastUpdated) > new Date(formData.rulesAcknowledgedAt) ? (
                                        // Case: Rules updated since last ack
                                        <div>
                                            <p className="text-amber-600 font-bold text-sm flex items-center gap-2">
                                                <BadgeCheck className="w-4 h-4" /> Re-acknowledgement Required
                                            </p>
                                            <p className="text-xs text-gray-500 mt-1">Rules have changed since your last review.</p>
                                        </div>
                                    ) : (
                                        // Case: Fully Acknowledged
                                        <div>
                                            <p className="text-green-600 font-bold text-sm flex items-center gap-2">
                                                <CheckCircle className="w-4 h-4" /> Acknowledged
                                            </p>
                                            <p className="text-xs text-gray-500 mt-1">
                                                By {formData.rulesAcknowledgedBy} on {new Date(formData.rulesAcknowledgedAt).toLocaleDateString()}
                                            </p>
                                        </div>
                                    )
                                ) : (
                                    // Case: Never Acknowledged
                                    <div>
                                        <p className="text-amber-600 font-bold text-sm flex items-center gap-2">
                                            <ShieldAlert className="w-4 h-4" /> Acknowledgement Pending
                                        </p>
                                        <p className="text-xs text-gray-500 mt-1">Please review and acknowledge these governance rules.</p>
                                    </div>
                                )}
                            </div>

                            {/* Action Button */}
                            {(!formData.rulesAcknowledgedAt || (formData.rulesLastUpdated && new Date(formData.rulesLastUpdated) > new Date(formData.rulesAcknowledgedAt))) && (
                                <button
                                    onClick={async () => {
                                        try {
                                            const token = localStorage.getItem('token');
                                            await axios.post(`${BACKEND_URL}/api/client/governance/acknowledge`, {}, {
                                                headers: { Authorization: `Bearer ${token}` }
                                            });
                                            toast.success("Governance rules acknowledged");
                                            queryClient.invalidateQueries(['clientSettings']);
                                        } catch (e) {
                                            toast.error("Failed to acknowledge rules");
                                        }
                                    }}
                                    className="px-6 py-2 bg-brand-gradient text-white rounded-lg font-bold text-sm shadow-lg shadow-purple-200 hover:shadow-purple-300 transition-all active:scale-95"
                                >
                                    I Understand & Agree
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}


        </div>
      </div>
    </DashboardLayout>
  );
};

export default ClientSettings;
