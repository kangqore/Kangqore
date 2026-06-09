import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useToast } from '../../../hooks/use-toast';
import DashboardLayout from '../../../components/DashboardLayout';
import { 
  Building2, 
  Search, 
  Briefcase, 
  CheckCircle,
  TrendingUp,
  X,
  Loader,
  Mail,
  Lock,
  User,
  Filter,
  ChevronDown,
  Zap,
  ShieldAlert,
  Clock,
  ArrowUpRight,
  Shield,
  MessageSquare,
  AlertTriangle
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import ServiceSelector from '../../../components/common/ServiceSelector';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || '';

const AddClientModal = ({ onClose, onSuccess }) => {
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        company: '',
        role: 'CLIENT',
        interestedServices: []
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            await axios.post(`${BACKEND_URL}/api/admin/users`, formData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast({
                title: "Success",
                description: "Client onboarded successfully",
                className: "bg-green-50 border-green-200"
            });
            onSuccess();
            onClose();
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Error",
                description: error.response?.data?.error || 'Failed to create client'
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in">
            <div className="bg-white dark:bg-gray-900 dark:border-gray-800 rounded-3xl w-full max-w-md shadow-2xl border border-gray-100 overflow-hidden">
                <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-center bg-gray-50 dark:bg-gray-800 dark:border-gray-700/50">
                    <div>
                        <h3 className="font-black text-xl text-slate-900 dark:text-white tracking-tight">Onboard New Client</h3>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Enterprise Initialization</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white dark:bg-gray-900 dark:border-gray-800 rounded-xl transition-all shadow-sm border border-transparent hover:border-gray-200 group">
                         <X className="w-5 h-5 text-gray-400 group-hover:text-slate-900 dark:text-white" />
                    </button>
                </div>
                
                <form onSubmit={handleSubmit} className="p-8 space-y-5">
                    <div className="space-y-1">
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] ml-1">Company / Entity Name</label>
                        <div className="relative group">
                            <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-brand-blue transition-colors" />
                            <input 
                                required
                                type="text"
                                className="w-full pl-11 pr-4 py-3 bg-slate-50/50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue outline-none transition-all placeholder:text-slate-300 font-medium"
                                placeholder="e.g. Reliance Industries"
                                value={formData.company}
                                onChange={(e) => setFormData({...formData, company: e.target.value})}
                            />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] ml-1">Primary Representative</label>
                        <div className="relative group">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-brand-blue transition-colors" />
                            <input 
                                required
                                type="text"
                                className="w-full pl-11 pr-4 py-3 bg-slate-50/50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue outline-none transition-all placeholder:text-slate-300 font-medium"
                                placeholder="Full Name"
                                value={formData.name}
                                onChange={(e) => setFormData({...formData, name: e.target.value})}
                            />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] ml-1">Official Email (Authentication)</label>
                        <div className="relative group">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-brand-blue transition-colors" />
                            <input 
                                required
                                type="email"
                                className="w-full pl-11 pr-4 py-3 bg-slate-50/50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue outline-none transition-all placeholder:text-slate-300 font-medium"
                                placeholder="name@company.com"
                                value={formData.email}
                                onChange={(e) => setFormData({...formData, email: e.target.value})}
                            />
                        </div>
                    </div>

                    <div className="space-y-1">
                         <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] ml-1">Initial Security Access</label>
                         <div className="relative group">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-brand-blue transition-colors" />
                            <input 
                                required
                                type="password"
                                className="w-full pl-11 pr-4 py-3 bg-slate-50/50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue outline-none transition-all placeholder:text-slate-300 font-medium"
                                placeholder="••••••••"
                                value={formData.password}
                                onChange={(e) => setFormData({...formData, password: e.target.value})}
                            />
                        </div>
                        <p className="text-[9px] font-bold text-slate-400 mt-1 uppercase tracking-wider ml-1">Force reset required upon activation</p>
                    </div>

                    <div className="pt-2">
                        <ServiceSelector 
                            selectedServices={formData.interestedServices}
                            onChange={(services) => setFormData({...formData, interestedServices: services})}
                            label="Governance Pillars"
                        />
                    </div>

                    <div className="pt-4">
                        <button 
                            type="submit" 
                            disabled={loading}
                            className="w-full bg-brand-gradient text-white font-black py-4 rounded-2xl shadow-xl hover:shadow-2xl hover:-translate-y-0.5 transition-all disabled:opacity-50 flex justify-center items-center gap-3 active:scale-[0.98]"
                        >
                            {loading ? (
                                <Loader className="w-5 h-5 animate-spin" />
                            ) : (
                                <>
                                    <Zap className="w-5 h-5" /> 
                                    <span>ACTIVATE ACCOUNT</span>
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const AdminClients = () => {
    const { toast } = useToast();
    const navigate = useNavigate();
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isOnboarding, setIsOnboarding] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [filters, setFilters] = useState({
        industry: 'All',
        health: 'All'
    });

    const fetchClients = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const res = await axios.get(`${BACKEND_URL}/api/admin/users?role=CLIENT`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            const fetchedClients = res.data.users || [];
            
            const clientsWithMetrics = await Promise.all(fetchedClients.map(async (client) => {
                try {
                    const metricRes = await axios.get(`${BACKEND_URL}/api/admin/client-signals/${client.id}`, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    return { ...client, signals: metricRes.data };
                } catch (e) {
                    return { ...client, signals: null };
                }
            }));

            setClients(clientsWithMetrics);
        } catch (error) {
            console.error("Failed to fetch clients", error);
            toast({
                variant: "destructive",
                title: "Error",
                description: "Failed to load client data"
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchClients();
    }, []);

    const industries = ['All', ...new Set(clients.map(c => c.clientProfile?.industryDomain).filter(Boolean))];
    const healthLevels = ['All', 'LOW', 'MEDIUM', 'HIGH'];

    const filteredClients = clients.filter(c => {
        const matchesSearch = 
            (c.company || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
            (c.name || '').toLowerCase().includes(searchQuery.toLowerCase());
        
        const matchesIndustry = filters.industry === 'All' || c.clientProfile?.industryDomain === filters.industry;
        const matchesHealth = filters.health === 'All' || c.signals?.signals?.risk_level === filters.health;

        return matchesSearch && matchesIndustry && matchesHealth;
    });
    
    return (
        <DashboardLayout role="admin" title="Client Management" subtitle="Omni-Governance & Enterprise Portfolio Layer">
            
            {/* 1️⃣ Controls Row Upgrade */}
            <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6 mb-10">
                <div className="flex flex-col sm:flex-row items-center gap-4 w-full xl:w-auto">
                    {/* Larger Search Bar */}
                    <div className="relative w-full sm:w-[480px] group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-brand-blue transition-colors" />
                        <input 
                            type="text" 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search by company, representative, or domain..." 
                            className="w-full pl-12 pr-4 py-3.5 bg-white dark:bg-gray-900 dark:border-gray-800 border border-slate-200 rounded-[1.25rem] text-sm font-medium focus:ring-4 focus:ring-brand-blue/5 focus:border-brand-blue outline-none transition-all shadow-sm"
                        />
                    </div>

                    {/* Filter Dropdowns */}
                    <div className="relative">
                        <button 
                            onClick={() => setIsFilterOpen(!isFilterOpen)}
                            className={`flex items-center gap-2 px-4 py-3.5 bg-white dark:bg-gray-900 dark:border-gray-800 border rounded-2xl text-xs font-black transition-all uppercase tracking-wider ${
                                isFilterOpen || filters.industry !== 'All' || filters.health !== 'All'
                                ? 'border-brand-blue text-brand-blue ring-4 ring-brand-blue/5' 
                                : 'border-slate-200 text-slate-600 dark:text-gray-400 hover:bg-slate-50'
                            }`}
                        >
                            <Filter className="w-4 h-4" />
                            {filters.industry !== 'All' || filters.health !== 'All' ? 'Filters Active' : 'Filters'}
                            <ChevronDown className={`w-3.5 h-3.5 ml-1 opacity-50 transition-transform ${isFilterOpen ? 'rotate-180' : ''}`} />
                        </button>

                        {isFilterOpen && (
                            <>
                                <div 
                                    className="fixed inset-0 z-10" 
                                    onClick={() => setIsFilterOpen(false)} 
                                />
                                <div className="absolute left-0 mt-3 w-72 bg-white dark:bg-gray-900 dark:border-gray-800 border border-slate-100 rounded-3xl shadow-2xl p-6 z-20 animate-in fade-in zoom-in-95 duration-200">
                                    <div className="space-y-6">
                                        <div>
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 px-1">Industry Domain</p>
                                            <div className="flex flex-wrap gap-2">
                                                {industries.map(industry => (
                                                    <button
                                                        key={industry}
                                                        onClick={() => setFilters({ ...filters, industry })}
                                                        className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all border ${
                                                            filters.industry === industry
                                                            ? 'bg-brand-blue text-white border-brand-blue shadow-md'
                                                            : 'bg-slate-50 text-slate-500 border-slate-100 hover:bg-slate-50 hover:text-slate-900 dark:text-white'
                                                        }`}
                                                    >
                                                        {industry}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        <div>
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 px-1">Health Status</p>
                                            <div className="flex flex-wrap gap-2">
                                                {healthLevels.map(level => (
                                                    <button
                                                        key={level}
                                                        onClick={() => setFilters({ ...filters, health: level })}
                                                        className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all border ${
                                                            filters.health === level
                                                            ? 'bg-brand-blue text-white border-brand-blue shadow-md'
                                                            : 'bg-slate-50 text-slate-500 border-slate-100 hover:bg-slate-50 hover:text-slate-900 dark:text-white'
                                                        }`}
                                                    >
                                                        {level}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="pt-2 border-t border-slate-50 flex justify-between items-center">
                                            <button 
                                                onClick={() => {
                                                    setFilters({ industry: 'All', health: 'All' });
                                                    setIsFilterOpen(false);
                                                }}
                                                className="text-[9px] font-black text-slate-400 uppercase tracking-widest hover:text-rose-500 transition-colors"
                                            >
                                                Clear All
                                            </button>
                                            <button 
                                                onClick={() => setIsFilterOpen(false)}
                                                className="bg-slate-900 text-white px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest shadow-lg shadow-slate-900/10 hover:-translate-y-0.5 transition-all active:scale-95"
                                            >
                                                Apply
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>

                {/* Primary CTA */}
                <button 
                    onClick={() => setIsOnboarding(true)}
                    className="w-full xl:w-auto bg-brand-gradient text-white px-8 py-4 rounded-2xl font-black text-sm shadow-xl hover:shadow-2xl hover:-translate-y-1 active:translate-y-0 transition-all flex items-center justify-center gap-3 uppercase tracking-widest whitespace-nowrap"
                >
                    <Building2 className="w-5 h-5" /> Onboard New Client
                </button>
            </div>

            {isOnboarding && <AddClientModal onClose={() => setIsOnboarding(false)} onSuccess={fetchClients} />}

            {loading ? (
                <div className="flex flex-col justify-center items-center py-32 space-y-4">
                    <div className="relative">
                        <div className="w-16 h-16 border-4 border-blue-50 rounded-full" />
                        <div className="absolute inset-0 w-16 h-16 border-4 border-brand-blue border-t-transparent rounded-full animate-spin" />
                    </div>
                    <p className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] animate-pulse">Syncing Enterprise Layer...</p>
                </div>
            ) : filteredClients.length === 0 ? (
                <div className="text-center py-32 bg-slate-50/50 rounded-[3rem] border border-dashed border-gray-200">
                    <div className="w-20 h-20 bg-white dark:bg-gray-900 dark:border-gray-800 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-sm border border-gray-100">
                        <Search className="w-10 h-10 text-slate-200" />
                    </div>
                    <h3 className="font-black text-2xl text-slate-900 dark:text-white tracking-tight mb-2">No results found</h3>
                    <p className="text-slate-500 font-medium">Try adjusting your filters or search terms.</p>
                </div>
            ) : (
                /* 2️⃣ Grid Layout Depth */
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredClients.map((client, idx) => (
                        <div 
                            key={client.id} 
                            style={{ animationDelay: `${idx * 100}ms` }}
                            className="group relative bg-white dark:bg-gray-900 dark:border-gray-800 rounded-[2.5rem] border border-slate-100 p-8 shadow-[0_4px_25px_rgba(0,0,0,0.03)] transition-all duration-500 hover:shadow-[0_25px_60px_rgba(0,0,0,0.08)] hover:-translate-y-2 hover:border-brand-blue/20 animate-in fade-in slide-in-from-bottom-5 cursor-pointer flex flex-col"
                            onClick={() => navigate(`/dashboard/admin/clients/${client.id}`)}
                        >
                            {/* Top row: Identity */}
                            <div className="flex justify-between items-start mb-6">
                                <div className="flex items-center gap-5">
                                    <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center border border-slate-200/50 shadow-sm group-hover:scale-110 transition-transform duration-500 overflow-hidden shrink-0">
                                        {client.avatarUrl ? (
                                             <img src={client.avatarUrl} alt="Logo" className="w-full h-full object-cover" />
                                        ) : (
                                            <Building2 className="w-7 h-7 text-slate-300" />
                                        )}
                                    </div>
                                    <div className="min-w-0">
                                        <h3 className="font-black text-lg text-slate-900 dark:text-white truncate leading-tight group-hover:text-brand-blue transition-colors">
                                            {client.company || client.name}
                                        </h3>
                                        <div className="mt-1.5 flex items-center gap-2">
                                            <span className="px-2.5 py-1 bg-slate-100 text-slate-600 dark:text-gray-400 rounded-lg text-[9px] font-black uppercase tracking-wider">
                                                {client.clientProfile?.industryDomain || 'Technology'}
                                            </span>
                                            {client.isRedFlagged && (
                                                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Relationship Layer */}
                            <div className="space-y-3 mb-8">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center shrink-0">
                                        <User className="w-4 h-4 text-indigo-600" />
                                    </div>
                                    <div>
                                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-0.5">Account Lead</p>
                                        <p className="text-sm font-bold text-slate-700 dark:text-gray-300">{client.name}</p>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center shrink-0">
                                            <Clock className="w-4 h-4 text-slate-400" />
                                        </div>
                                        <div>
                                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-0.5">Last Pulse</p>
                                            <p className="text-xs font-bold text-slate-500">
                                                {client.lastLoginAt ? new Date(client.lastLoginAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'Pending Sync'}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center -space-x-2">
                                        {[...Array(3)].map((_, i) => (
                                            <div key={i} className="w-6 h-6 rounded-full border-2 border-white bg-slate-200" />
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="h-px w-full bg-slate-100 mb-8" />

                            {/* Metrics Section */}
                            <div className="grid grid-cols-2 gap-x-8 gap-y-6 mb-8 flex-1">
                                <div className="group/metric">
                                    <div className="flex items-center gap-2 mb-1.5">
                                        <TrendingUp className="w-3.5 h-3.5 text-slate-400 group-hover/metric:text-brand-blue transition-colors" />
                                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.15em]">Revenue</p>
                                    </div>
                                    <p className="text-base font-black text-slate-900 dark:text-white">
                                        {client.signals?.signals?.total_revenue ? `₹${client.signals.signals.total_revenue.toLocaleString()}` : <span className="text-slate-400 font-bold italic">Not billed yet</span>}
                                    </p>
                                </div>
                                <div className="group/metric">
                                    <div className="flex items-center gap-2 mb-1.5">
                                        <Briefcase className="w-3.5 h-3.5 text-slate-400 group-hover/metric:text-brand-blue transition-colors" />
                                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.15em]">Projects</p>
                                    </div>
                                    <p className="text-base font-black text-slate-900 dark:text-white">{client._count?.projects || 0}</p>
                                </div>
                                <div className="group/metric">
                                    <div className="flex items-center gap-2 mb-1.5">
                                        <MessageSquare className="w-3.5 h-3.5 text-slate-400 group-hover/metric:text-brand-blue transition-colors" />
                                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.15em]">Reviews</p>
                                    </div>
                                    <p className="text-base font-black text-slate-900 dark:text-white">{client._count?.clientFeedbacks || 0}</p>
                                </div>
                                <div className="group/metric">
                                    <div className="flex items-center gap-2 mb-1.5">
                                        <AlertTriangle className={`w-3.5 h-3.5 ${client._count?.risks > 0 ? 'text-amber-500' : 'text-slate-400'} group-hover/metric:text-brand-blue transition-colors`} />
                                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.15em]">Open Risks</p>
                                    </div>
                                    <p className={`text-base font-black ${client._count?.risks > 0 ? 'text-amber-600' : 'text-slate-900 dark:text-white'}`}>
                                        {client._count?.risks || 0}
                                    </p>
                                </div>
                            </div>

                            {/* Health Indicator Strip */}
                            <div className="flex items-center justify-between mb-3 px-1">
                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Account Health</p>
                                <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border ${
                                    client.signals?.signals?.risk_level === 'LOW' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                                    client.signals?.signals?.risk_level === 'MEDIUM' ? 'bg-amber-50 text-amber-700 border-amber-100' :
                                    'bg-rose-50 text-rose-700 border-rose-100'
                                }`}>
                                    <Shield className="w-3 h-3" />
                                    <span className="text-[8px] font-black uppercase tracking-wider">{client.signals?.signals?.risk_level || 'STABLE'}</span>
                                </div>
                            </div>
                            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mb-8">
                                <div 
                                    className={`h-full transition-all duration-1000 ease-out ${
                                        client.signals?.signals?.intent_score > 70 ? 'bg-brand-blue' :
                                        client.signals?.signals?.intent_score > 40 ? 'bg-amber-400' :
                                        'bg-rose-500'
                                    }`}
                                    style={{ width: `${client.signals?.signals?.intent_score || 85}%` }}
                                />
                            </div>

                            <button className="w-full py-4 bg-slate-50 border border-slate-100 rounded-2xl text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] group-hover:bg-brand-blue group-hover:text-white group-hover:border-brand-blue transition-all flex items-center justify-center gap-2">
                                VIEW DETAILED PROFILE <ArrowUpRight className="w-4 h-4" />
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </DashboardLayout>
    );
};

export default AdminClients;
