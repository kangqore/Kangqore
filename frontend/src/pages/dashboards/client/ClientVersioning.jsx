import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Layers, GitBranch, Terminal, Shield, CheckCircle2, Circle, Clock, ArrowUpRight } from 'lucide-react';
import DashboardLayout from '../../../components/DashboardLayout';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5050';

const ClientVersioning = ({ isTabContent = false }) => {
    const [versions, setVersions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchVersions();
    }, []);

    const fetchVersions = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get(`${BACKEND_URL}/api/client/versions`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setVersions(res.data || []);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const mockVersions = versions.length > 0 ? versions : [
        { version: 'v2.4.0-prod', stage: 'Production', date: '2026-02-01', changes: 'Critical security patches and UI acceleration.', status: 'STABLE' },
        { version: 'v2.5.0-beta.2', stage: 'Staging', date: '2026-02-04', changes: 'New analytics dashboard and MNC pillar integration.', status: 'TESTING' },
        { version: 'v3.0.0-alpha', stage: 'Sandbox', date: '2026-02-06', changes: 'Agentic AI core upgrade and autonomous systems.', status: 'DEVELOPMENT' }
    ];

    const Content = () => {
        if (loading) return <div className="p-12 text-center animate-pulse text-slate-400">Loading version control...</div>;

        return (
            <div className="max-w-6xl mx-auto p-8 space-y-12 animate-in fade-in duration-700">
                <div className="space-y-4">
                    <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">
                        Product <span className="text-brand-blue">Versioning</span>
                    </h1>
                    <p className="text-slate-500 font-medium max-w-2xl">
                        Manage and monitor the deployment stages of your product ecosystem across environments.
                    </p>
                </div>

                <div className="grid gap-6">
                    {mockVersions.map((v, i) => (
                        <div key={i} className="bg-white dark:bg-gray-900 dark:border-gray-800 border border-slate-100 rounded-[2.5rem] p-10 shadow-xl shadow-slate-100/50 hover:border-brand-blue/30 transition-all flex flex-col md:flex-row gap-8 items-start">
                            <div className="shrink-0">
                                <div className="w-16 h-16 bg-slate-50 rounded-3xl flex items-center justify-center mb-4">
                                    <Layers className="w-8 h-8 text-brand-blue" />
                                </div>
                                <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                                    v.stage === 'Production' ? 'bg-green-100 text-green-700' :
                                    v.stage === 'Staging' ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-700'
                                }`}>
                                    {v.stage}
                                </span>
                            </div>

                            <div className="flex-1 space-y-6">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-3">
                                            {v.version}
                                            {v.status === 'STABLE' && <Shield className="w-5 h-5 text-green-500" />}
                                        </h3>
                                        <p className="text-sm font-bold text-slate-300 uppercase mt-1 flex items-center gap-2">
                                            <Clock className="w-3 h-3" /> Released: {new Date(v.date).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <div className="flex gap-2">
                                        <button className="p-3 bg-slate-900 text-white rounded-2xl hover:bg-slate-800 transition">
                                            <Terminal className="w-5 h-5" />
                                        </button>
                                        <button className="p-3 bg-slate-50 text-slate-900 dark:text-white rounded-2xl hover:bg-slate-100 transition">
                                            <GitBranch className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>

                                <div className="bg-slate-50 p-6 rounded-3xl">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Changelog Summary</p>
                                    <p className="text-sm text-slate-600 dark:text-gray-400 font-medium italic">"{v.changes}"</p>
                                </div>

                                <div className="flex items-center gap-8 pt-4">
                                    <div className="flex items-center gap-2">
                                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                                        <span className="text-xs font-bold text-slate-500 uppercase">Security Scan Passed</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                                        <span className="text-xs font-bold text-slate-500 uppercase">Load Tests Nominal</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Circle className="w-4 h-4 text-slate-200" />
                                        <span className="text-xs font-bold text-slate-300 uppercase">Audit Logging Active</span>
                                    </div>
                                </div>
                            </div>

                            <button className="px-6 py-4 bg-brand-blue text-white rounded-3xl font-black text-sm hover:bg-blue-700 transition flex items-center gap-2 group shadow-xl">
                                Deploy Details
                                <ArrowUpRight className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                            </button>
                        </div>
                    ))}
                </div>

                {/* Pipeline Visualisation Placeholder */}
                <div className="bg-slate-900 rounded-[3rem] p-12 text-center space-y-8">
                    <h3 className="text-xl font-black text-white">CI/CD Pipeline Flow</h3>
                    <div className="flex items-center justify-center gap-6">
                        {['Build', 'Test', 'Secure', 'Staging', 'Prod'].map((step, i) => (
                            <React.Fragment key={step}>
                                <div className="flex flex-col items-center gap-3">
                                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${i < 4 ? 'bg-brand-blue/20 text-brand-blue' : 'bg-green-500 text-white shadow-lg shadow-green-500/30'}`}>
                                        {i < 4 ? <CheckCircle2 className="w-6 h-6" /> : <Layers className="w-6 h-6" />}
                                    </div>
                                    <span className="text-[10px] font-black text-white uppercase tracking-widest">{step}</span>
                                </div>
                                {i < 4 && <div className="w-12 h-0.5 bg-slate-800" />}
                            </React.Fragment>
                        ))}
                    </div>
                </div>
            </div>
        );
    };

    if (isTabContent) return <Content />;

    return (
        <DashboardLayout role="client" title="Product Versioning" subtitle="Deployment stages & environment management">
            <Content />
        </DashboardLayout>
    );
};

export default ClientVersioning;
