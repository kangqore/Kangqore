import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Eye, CheckCircle, MessageSquare, ArrowRight, Zap, Target, Activity, Compass } from 'lucide-react';
import { useToast } from '../../../hooks/use-toast';
import DashboardLayout from '../../../components/DashboardLayout';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || '';

const ClientVision = ({ isTabContent = false }) => {
    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);
    const [feedback, setFeedback] = useState('');
    const { toast } = useToast();

    useEffect(() => {
        fetchProject();
    }, []);

    const fetchProject = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get(`${BACKEND_URL}/api/projects`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.data.projects?.length > 0) {
                setProject(res.data.projects[0]);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const handleVisionResponse = async (status) => {
        try {
            const token = localStorage.getItem('token');
            await axios.post(`${BACKEND_URL}/api/projects/${project.id}/vision/respond`, {
                status,
                feedback: status === 'REVISION_REQUESTED' ? feedback : null
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            toast({ 
                title: status === 'APPROVED' ? "Vision Approved" : "Revision Requested",
                description: status === 'APPROVED' ? "We will move forward with this strategy." : "Your feedback has been sent to our team."
            });
            fetchProject();
        } catch (e) {
            toast({ title: "Failed to send response", variant: "destructive" });
        }
    };

    const Content = () => {
        if (loading) return <div className="p-12 text-center animate-pulse text-slate-400">Loading strategy...</div>;
        if (!project) return <div className="p-12 text-center text-gray-400">No active project found.</div>;

        return (
            <div className="max-w-6xl mx-auto p-8 space-y-12 animate-in fade-in duration-700">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start gap-8">
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 text-brand-blue font-black uppercase tracking-[0.2em] text-[10px]">
                            <Compass className="w-4 h-4" />
                            North Star strategy
                        </div>
                        <h1 className="text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-[0.9]">
                            Product <span className="text-brand-blue">Vision</span>
                        </h1>
                        <p className="text-xl text-slate-500 max-w-2xl font-medium leading-relaxed">
                            The strategic roadmap and future-state definition for your product ecosystem, authored by Kangqore engineering leadership.
                        </p>
                    </div>

                    <div className={`p-6 rounded-[2rem] border-2 ${
                        project.visionStatus === 'APPROVED' ? 'bg-green-50 dark:bg-green-900/20 border-green-100 text-green-700' :
                        project.visionStatus === 'REVISION_REQUESTED' ? 'bg-amber-50 border-amber-100 text-amber-700' :
                        'bg-slate-50 border-slate-100 text-slate-400'
                    }`}>
                        <p className="text-[10px] font-black uppercase tracking-widest mb-1 text-center">Status</p>
                        <p className="text-lg font-black text-center">{project.visionStatus || 'PENDING'}</p>
                    </div>
                </div>

                {/* Vision Content */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    <div className="lg:col-span-2 space-y-12">
                        <div className="bg-white dark:bg-gray-900 dark:border-gray-800 p-12 rounded-[3rem] shadow-2xl border border-slate-50">
                            <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-8 flex items-center gap-3">
                                <Target className="w-6 h-6 text-brand-blue" />
                                Strategic Narrative
                            </h2>
                            <div className="prose prose-slate prose-lg max-w-none text-slate-600 dark:text-gray-400 leading-relaxed font-medium">
                                {project.vision || "Your product vision is currently being drafted by our strategy team. Check back shortly."}
                            </div>

                            {project.vision && project.visionStatus !== 'APPROVED' && (
                                <div className="mt-16 pt-12 border-t border-slate-100 space-y-8">
                                    <h3 className="text-lg font-black text-slate-900 dark:text-white">Sign-off or Feedback</h3>
                                    <textarea 
                                        className="w-full p-6 bg-slate-50 border-none rounded-3xl text-sm font-medium focus:ring-2 ring-brand-blue transition-all"
                                        placeholder="Provide feedback if you'd like revisions..."
                                        rows={4}
                                        value={feedback}
                                        onChange={(e) => setFeedback(e.target.value)}
                                    />
                                    <div className="flex gap-4">
                                        <button 
                                            onClick={() => handleVisionResponse('APPROVED')}
                                            className="flex-1 py-4 bg-brand-blue text-white rounded-2xl font-black hover:bg-blue-700 transition shadow-xl flex items-center justify-center gap-2"
                                        >
                                            <CheckCircle className="w-5 h-5" />
                                            Approve Strategy
                                        </button>
                                        <button 
                                            onClick={() => handleVisionResponse('REVISION_REQUESTED')}
                                            className="flex-1 py-4 bg-white dark:bg-gray-900 dark:border-gray-800 text-slate-900 dark:text-white border-2 border-slate-200 rounded-2xl font-black hover:bg-slate-50 transition flex items-center justify-center gap-2"
                                        >
                                            <MessageSquare className="w-5 h-5" />
                                            Request Revision
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="space-y-8">
                        <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white space-y-6">
                            <h3 className="text-lg font-black flex items-center gap-2">
                                <Zap className="w-5 h-5 text-yellow-400" />
                                Workflows
                            </h3>
                            <div className="space-y-3">
                                {project.visionWorkflows?.workflows?.map((w, i) => (
                                    <div key={i} className="flex items-center gap-3 group">
                                        <div className="w-1.5 h-1.5 bg-brand-blue rounded-full group-hover:scale-150 transition" />
                                        <span className="text-sm font-bold text-slate-300 group-hover:text-white transition">{w}</span>
                                    </div>
                                )) || <p className="text-sm text-slate-500 italic">No workflows defined yet.</p>}
                            </div>
                        </div>

                        <div className="p-8 bg-brand-blue/5 rounded-[2.5rem] border border-brand-blue/10 space-y-6">
                                <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                                <Activity className="w-5 h-5 text-brand-blue" />
                                Core Features
                            </h3>
                            <div className="space-y-4">
                                    {project.visionWorkflows?.features?.map((f, i) => (
                                    <div key={i} className="bg-white dark:bg-gray-900 dark:border-gray-800 p-4 rounded-2xl shadow-sm border border-brand-blue/5 flex items-center justify-between group">
                                        <span className="text-sm font-black text-slate-700 dark:text-gray-300">{f}</span>
                                        <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-brand-blue transition translate-x-0 group-hover:translate-x-1" />
                                    </div>
                                    )) || <p className="text-sm text-slate-400 italic">Roadmap items pending.</p>}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    if (isTabContent) {
        return <Content />;
    }

    return (
        <DashboardLayout role="client" title="Product Vision" subtitle="Strategic roadmap & North Star definition">
            <Content />
        </DashboardLayout>
    );
};

export default ClientVision;
