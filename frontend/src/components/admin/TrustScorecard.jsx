import React from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Scale, Clock, CreditCard, Activity, TrendingUp, AlertTriangle } from 'lucide-react';
import { useParams } from 'react-router-dom';

const TrustScorecard = ({ clientId }) => {
    const { data: strategy, isLoading } = useQuery({
        queryKey: ['admin-strategy', clientId],
        queryFn: async () => {
            const token = localStorage.getItem('token');
            const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/admin/clients/${clientId}/strategy`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            return res.data;
        }
    });

    if (isLoading) return <div className="animate-pulse h-64 bg-gray-50 dark:bg-gray-800 dark:border-gray-700 rounded-2xl"></div>;

    const { trust, commercials, risk } = strategy || {};

    const getScoreColor = (score) => {
        if (score >= 80) return 'text-green-600 bg-green-50 border-green-200';
        if (score >= 50) return 'text-amber-600 bg-amber-50 border-amber-200';
        return 'text-red-600 bg-red-50 border-red-200';
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* TRUST & FRICTION */}
            <div className="bg-white dark:bg-gray-900 dark:border-gray-800 rounded-2xl border border-gray-200 shadow-sm p-6">
                <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-4">
                    <Scale className="w-5 h-5 text-indigo-600" /> Trust Scorecard
                </h3>
                
                <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-gray-50 dark:bg-gray-800 dark:border-gray-700 rounded-xl border border-gray-100">
                        <div className="flex items-center gap-2 mb-1 text-xs font-bold text-gray-500 uppercase">
                            <Clock className="w-3 h-3" /> Decision Latency
                        </div>
                        <p className="text-xl font-bold text-gray-900 dark:text-white">{trust?.avgDecisionDays || 0} <span className="text-sm font-normal text-gray-500">days</span></p>
                        <p className="text-[10px] text-gray-400 mt-1">Goal: &lt; 2 days</p>
                    </div>

                    <div className="p-3 bg-gray-50 dark:bg-gray-800 dark:border-gray-700 rounded-xl border border-gray-100">
                        <div className="flex items-center gap-2 mb-1 text-xs font-bold text-gray-500 uppercase">
                            <CreditCard className="w-3 h-3" /> Payment Speed
                        </div>
                        <p className="text-xl font-bold text-gray-900 dark:text-white">{trust?.avgPaymentDays || 0} <span className="text-sm font-normal text-gray-500">days</span></p>
                        <p className="text-[10px] text-gray-400 mt-1">Goal: Net 30</p>
                    </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="flex justify-between items-center">
                        <span className="text-xs font-bold text-gray-500 uppercase">Risk Appetite</span>
                        <span className={`text-xs font-bold px-2 py-1 rounded border ${getScoreColor(risk?.appetiteScore || 0)}`}>
                            {risk?.appetiteScore > 50 ? 'Aggressive' : 'Conservative'} ({Math.round(risk?.appetiteScore || 0)}%)
                        </span>
                    </div>
                    <div className="w-full bg-gray-100 dark:bg-[#0a0a0c] rounded-full h-1.5 mt-2">
                        <div className="bg-indigo-600 h-1.5 rounded-full" style={{ width: `${risk?.appetiteScore || 0}%` }}></div>
                    </div>
                </div>
            </div>

            {/* COMMERCIAL 360 */}
            <div className="bg-white dark:bg-gray-900 dark:border-gray-800 rounded-2xl border border-gray-200 shadow-sm p-6">
                <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-4">
                    <TrendingUp className="w-5 h-5 text-emerald-600" /> Commercial 360
                </h3>

                <div className="space-y-4">
                    <div>
                        <p className="text-xs text-gray-500">Lifetime Contract Value</p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">₹{(commercials?.lifetimeValue || 0).toLocaleString()}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-[10px] text-gray-500 uppercase font-bold">Realized</p>
                            <p className="text-sm font-bold text-emerald-600">₹{(commercials?.realizedRevenue || 0).toLocaleString()}</p>
                        </div>
                        <div>
                            <p className="text-[10px] text-gray-500 uppercase font-bold">Pipeline</p>
                            <p className="text-sm font-bold text-blue-600">₹{(commercials?.pipelineValue || 0).toLocaleString()}</p>
                        </div>
                    </div>
                    
                    <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                         <span className="text-xs text-gray-500">Active Projects</span>
                         <span className="text-sm font-bold text-gray-900 dark:text-white">{commercials?.activeProjects || 0}</span>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default TrustScorecard;
