import React from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Star, MessageSquare, Briefcase, Award, Building2, User, Quote } from 'lucide-react';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || '';

const ClientFeedbackList = ({ clientId, projectId, title = "Client Satisfaction & NPS" }) => {
    
    // Fetch Feedback
    const { data: feedbacks = [], isLoading } = useQuery({
        queryKey: ['admin-feedback', clientId, projectId],
        queryFn: async () => {
            const token = localStorage.getItem('token');
            const params = new URLSearchParams();
            if (clientId) params.append('clientId', clientId);
            if (projectId) params.append('projectId', projectId);
            
            const res = await axios.get(`${BACKEND_URL}/api/feedback?${params.toString()}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            return res.data;
        },
        enabled: !!clientId || !!projectId
    });

    if (isLoading) return (
        <div className="p-12 text-center">
            <div className="flex justify-center mb-4">
                <div className="w-12 h-12 border-4 border-brand-blue/20 border-t-brand-blue rounded-full animate-spin"></div>
            </div>
            <p className="text-gray-500 font-medium animate-pulse">Analyzing feedback patterns...</p>
        </div>
    );

    if (feedbacks.length === 0) return (
        <div className="p-12 text-center bg-gray-50 dark:bg-gray-800 dark:border-gray-700/50 rounded-[2rem] border-2 border-dashed border-gray-100">
            <MessageSquare className="w-10 h-10 text-gray-200 mx-auto mb-4" />
            <p className="text-gray-400 font-medium italic">No performance benchmarks available yet.</p>
        </div>
    );

    return (
        <div className="bg-gray-50 dark:bg-gray-800 dark:border-gray-700/30 rounded-[2.5rem] p-4 sm:p-10 border border-gray-100/50">
            {/* 1️⃣ Section Header Upgrade */}
            <div className="px-6 mb-8">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-3 tracking-tight">
                        <MessageSquare className="w-6 h-6 text-brand-blue" />
                        {title}
                        <span className="ml-2 text-xs font-black bg-blue-50 dark:bg-blue-900/20 text-brand-blue px-3 py-1 rounded-full border border-blue-100/50 uppercase tracking-wider">
                            {feedbacks.length} Review{feedbacks.length !== 1 ? 's' : ''}
                        </span>
                    </h3>
                </div>
                <div className="h-px w-full bg-gradient-to-r from-transparent via-gray-200 to-transparent opacity-60" />
            </div>

            {/* 2️⃣ Review Card Redesign & 4️⃣ Card Elevation */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {feedbacks.map((item, idx) => (
                    <div 
                        key={item.id} 
                        className="group relative bg-white dark:bg-gray-900 dark:border-gray-800 rounded-[2rem] p-8 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-50 hover:shadow-[0_20px_40px_rgba(0,0,0,0.06)] hover:-translate-y-1.5 transition-all duration-500 animate-in fade-in slide-in-from-bottom-4"
                        style={{ animationDelay: `${idx * 150}ms` }}
                    >
                        {/* Top Row: Identity & Stars */}
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-6">
                            <div className="flex items-center gap-5">
                                {/* 🔹 Avatar Refinement */}
                                <div className="relative">
                                    {item.photoUrl ? (
                                        <img src={item.photoUrl} alt="Client" className="w-14 h-14 rounded-full object-cover border-2 border-brand-blue/10 shadow-sm" />
                                    ) : item.logoUrl ? (
                                        <img src={item.logoUrl} alt="Logo" className="w-14 h-14 rounded-full object-cover border-2 border-brand-blue/10 shadow-sm" />
                                    ) : (
                                        <div className="w-14 h-14 rounded-full bg-slate-50 flex items-center justify-center border-2 border-brand-blue/5">
                                            <User className="w-6 h-6 text-brand-blue/40" />
                                        </div>
                                    )}
                                    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-white dark:bg-gray-900 dark:border-gray-800 rounded-full flex items-center justify-center shadow-sm border border-gray-100">
                                        <Award className="w-3 h-3 text-brand-blue" />
                                    </div>
                                </div>
                                
                                <div>
                                    <div className="flex items-center gap-2 mb-0.5">
                                        <h4 className="text-lg font-black text-slate-900 dark:text-white tracking-tight leading-none">{item.clientName || item.client?.name || 'Authorized Client'}</h4>

                                    </div>
                                    <div className="flex items-center gap-2">
                                        <p className="text-sm text-slate-500 font-bold">
                                            {item.designation} <span className="text-slate-300 font-medium mx-1">at</span> {item.companyName}
                                        </p>
                                        {item.logoUrl && item.photoUrl && (
                                            <img src={item.logoUrl} alt="Company" className="w-4 h-4 rounded object-contain grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all pointer-events-none" />
                                        )}
                                    </div>
                                    {item.idNumber && (
                                        <div className="mt-1">
                                            <span className="text-[10px] font-black bg-slate-100 text-slate-500 px-2 py-0.5 rounded-md uppercase tracking-tighter" title={`Identity Verified: ${item.idNumber}`}>
                                                SEC-ID: {item.idNumber}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="flex flex-col items-end gap-1.5 self-stretch sm:self-auto">
                                {/* 🔹 Stars Polish */}
                                <div className="bg-slate-50/50 px-3 py-1.5 rounded-full border border-gray-100/50 flex items-center gap-1 group-hover:bg-yellow-50 dark:bg-yellow-900/20/30 group-hover:border-yellow-100/50 transition-colors">
                                    {[...Array(5)].map((_, i) => (
                                        <Star 
                                            key={i} 
                                            className={`w-4 h-4 transition-all duration-300 ${
                                                (item.npsScore / 2) > i 
                                                    ? 'text-[#F9C013] fill-[#F9C013] drop-shadow-[0_0_8px_rgba(249,192,19,0.3)]' 
                                                    : 'text-slate-200'
                                            } hover:scale-125`} 
                                        />
                                    ))}
                                </div>
                                {/* 🔹 Date Refinement */}
                                <span className="text-xs text-slate-400 font-black uppercase tracking-widest">{new Date(item.createdAt).toLocaleDateString('en-US', { day: '2-digit', month: '2-digit', year: 'numeric' })}</span>
                            </div>
                        </div>
                        
                        {/* 🔹 Project Tag */}
                        {item.project && (
                             <div className="mb-6 px-4 py-2 bg-slate-50 rounded-xl inline-flex items-center gap-2.5 border border-slate-100/80 group-hover:bg-blue-50 dark:bg-blue-900/20/30 group-hover:border-blue-100/30 transition-colors cursor-default">
                                <div className="w-1.5 h-1.5 rounded-full bg-brand-blue animate-pulse" />
                                <span className="text-xs font-black text-slate-500 uppercase tracking-wider">{item.project.title}</span>
                             </div>
                        )}

                        {/* 🔹 Feedback Box (Quoted Content Layout) */}
                        {item.comment && (
                            <div className="relative mb-6">
                                <div className="absolute -left-2 -top-2 opacity-5 pointer-events-none">
                                    <Quote className="w-12 h-12 text-slate-900 dark:text-white" />
                                </div>
                                <div className="bg-slate-50/40 p-1 rounded-[1.5rem] border border-slate-100/30 shadow-[inset_0_2px_4px_rgba(0,0,0,0.01)] group-hover:bg-white dark:bg-gray-900 dark:border-gray-800 transition-all duration-500">
                                    <p className="text-base text-slate-700 dark:text-gray-300 leading-relaxed p-6 italic font-medium">
                                        "{item.comment}"
                                    </p>
                                </div>
                            </div>
                        )}
                        
                        {/* 🔹 Testimonial Highlight Line */}
                        {item.testimonial && (
                            <div className="mt-8 relative pl-8 border-l-4 border-brand-gradient">
                                <div className="absolute left-0 top-1/2 -translate-y-1/2 -ml-2 w-4 h-4 bg-white dark:bg-gray-900 dark:border-gray-800 rounded-full flex items-center justify-center border border-indigo-100 shadow-sm">
                                    <Award className="w-2.5 h-2.5 text-brand-blue" />
                                </div>
                                <p className="text-md text-slate-900 dark:text-white italic font-black leading-snug tracking-tight">
                                    "{item.testimonial}"
                                </p>
                                <p className="text-[10px] font-black text-brand-blue uppercase tracking-[0.2em] mt-2 opacity-60">Executive Endorsement</p>
                            </div>
                        )}
                    </div>
                ))}
            </div>
            
            {/* 7️⃣ Reduce Empty Space / Footer Branding */}
            <div className="mt-12 text-center opacity-20 hover:opacity-100 transition-opacity duration-700 pointer-events-none">
                <p className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-900 dark:text-white">End Alignment Report</p>
            </div>
        </div>
    );
};

export default ClientFeedbackList;
