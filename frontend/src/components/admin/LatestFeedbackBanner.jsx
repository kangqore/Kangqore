import React from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Quote, Star, Award, TrendingUp, User, Building2 } from 'lucide-react';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || '';

const LatestFeedbackBanner = ({ clientId }) => {
    const { data: feedback = null, isLoading } = useQuery({
        queryKey: ['latest-client-feedback', clientId],
        queryFn: async () => {
            const token = localStorage.getItem('token');
            const res = await axios.get(`${BACKEND_URL}/api/feedback?clientId=${clientId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            // Get the most recent one
            return res.data[0] || null;
        },
        enabled: !!clientId
    });

    if (isLoading || !feedback) return null;

    return (
        <div className="relative mb-8 group">
            {/* Background Glow */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden" />
            
            <div className="relative bg-white dark:bg-gray-900 dark:border-gray-800/80 backdrop-blur-xl rounded-[2.5rem] p-8 sm:p-10 border border-blue-100/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden transition-all duration-500 hover:shadow-lg hover:-translate-y-1">
                {/* Decorative Accent */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden pointer-events-none transition-all duration-700"></div>
                
                <div className="flex flex-col lg:flex-row gap-10 items-center">
                    {/* Left: Company Logo Meta */}
                    <div className="flex flex-col items-center lg:items-start text-center lg:text-left gap-4 shrink-0">
                        <div className="relative">
                            <div className="w-24 h-24 rounded-3xl bg-slate-50 p-1 flex items-center justify-center border-2 border-brand-blue/10 shadow-sm transition-transform duration-500 group-hover:scale-105">
                                {feedback.logoUrl ? (
                                    <img src={feedback.logoUrl} alt="Company Logo" className="w-20 h-20 object-contain rounded-2xl" />
                                ) : (
                                    <Building2 className="w-10 h-10 text-slate-300" />
                                )}
                            </div>
                            <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-white dark:bg-gray-900 dark:border-gray-800 rounded-xl shadow-md border border-blue-50 flex items-center justify-center">
                                <Award className="w-4 h-4 text-brand-blue" />
                            </div>
                        </div>
                        
                        <div>
                            <div className="flex items-center gap-2 justify-center lg:justify-start">
                                {[...Array(5)].map((_, i) => (
                                    <Star 
                                        key={i} 
                                        className={`w-3.5 h-3.5 ${
                                            (feedback.npsScore / 2) > i 
                                                ? 'text-[#F9C013] fill-[#F9C013]' 
                                                : 'text-slate-200'
                                        }`} 
                                    />
                                ))}
                            </div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2">{feedback.companyName || 'Corporate Participant'}</p>
                        </div>
                    </div>

                    {/* Middle: The Quote */}
                    <div className="flex-1 relative px-4 sm:px-8">
                        <Quote className="absolute -left-2 -top-4 w-12 h-12 text-blue-100 opacity-50 pointer-events-none" />
                        <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white leading-relaxed italic tracking-tight">
                            "{feedback.testimonial || feedback.comment}"
                        </h2>
                        
                        <div className="mt-6 flex flex-wrap items-center gap-4 justify-center lg:justify-start">
                            <div className="flex items-center gap-3 bg-slate-50 px-4 py-2 rounded-2xl border border-slate-100">
                                {feedback.photoUrl ? (
                                    <img src={feedback.photoUrl} alt="Client" className="w-8 h-8 rounded-full border border-brand-blue/20" />
                                ) : (
                                    <div className="w-8 h-8 rounded-full bg-white dark:bg-gray-900 dark:border-gray-800 flex items-center justify-center border border-slate-200">
                                        <User className="w-4 h-4 text-slate-400" />
                                    </div>
                                )}
                                <div>
                                    <p className="text-xs font-black text-slate-900 dark:text-white leading-none">{feedback.clientName || feedback.client?.name || 'Authorized Lead'}</p>
                                    <p className="text-[10px] font-bold text-slate-500 mt-0.5">{feedback.designation}</p>
                                </div>
                            </div>
                            
                            {feedback.project && (
                                <div className="text-[10px] font-black bg-blue-50 dark:bg-blue-900/20/50 text-brand-blue px-3 py-1.5 rounded-lg border border-blue-100/50 uppercase tracking-wider">
                                    Ref: {feedback.project.title}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right: CTA/Action */}
                    <div className="shrink-0">
                         <div className="flex flex-col items-center gap-2">
                            <div className="w-12 h-12 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center border border-blue-100 group-hover:bg-brand-blue group-hover:translate-x-1 transition-all">
                                <Award className="w-6 h-6 text-brand-blue group-hover:text-white transition-colors" />
                            </div>
                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Sentiment: High Fidelity</span>
                         </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LatestFeedbackBanner;
