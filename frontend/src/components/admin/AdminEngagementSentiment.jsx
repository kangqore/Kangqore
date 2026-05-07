import React from 'react';
import { 
  Zap, 
  TrendingUp, 
  Clock, 
  AlertCircle, 
  ShieldAlert,
  Ghost,
  Gauge
} from 'lucide-react';

const AdminEngagementSentiment = ({ perception, loading }) => {
    if (loading) return <div className="animate-pulse h-64 bg-gray-50 dark:bg-gray-800 dark:border-gray-700 rounded-2xl border border-gray-100"></div>;
    
    const { confidenceScore = 100, escalationProbability = 'Low', metrics = {}, engagementSignals = {} } = perception || {};

    const getProbColor = (prob) => {
        if (prob === 'High') return 'text-red-600 bg-red-50 border-red-100';
        if (prob === 'Medium') return 'text-amber-600 bg-amber-50 border-amber-100';
        return 'text-emerald-600 bg-emerald-50 border-emerald-100';
    };

    const getScoreColor = (score) => {
        if (score < 50) return 'text-red-600';
        if (score < 75) return 'text-amber-600';
        return 'text-blue-600';
    };

    return (
        <div className="bg-white dark:bg-gray-900 dark:border-gray-800 rounded-2xl border border-gray-200 shadow-sm overflow-hidden flex flex-col h-full">
            <div className="px-6 py-4 border-b border-gray-50 flex items-center justify-between">
                <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <Zap className="w-4 h-4 text-amber-500" /> Engagement Sentiment
                </h3>
                <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border ${getProbColor(escalationProbability)}`}>
                    Escalation: {escalationProbability}
                </span>
            </div>

            <div className="p-6 flex-1 flex flex-col justify-between">
                {/* Confidence Score Gauge Simulation */}
                <div className="flex flex-col items-center mb-6">
                    <div className="relative w-32 h-32 flex items-center justify-center">
                        <svg className="w-full h-full transform -rotate-90">
                            <circle
                                cx="64"
                                cy="64"
                                r="50"
                                stroke="currentColor"
                                strokeWidth="8"
                                fill="transparent"
                                className="text-gray-100"
                            />
                            <circle
                                cx="64"
                                cy="64"
                                r="50"
                                stroke="currentColor"
                                strokeWidth="8"
                                fill="transparent"
                                strokeDasharray={314}
                                strokeDashoffset={314 - (314 * (confidenceScore / 100))}
                                strokeLinecap="round"
                                className={`${getScoreColor(confidenceScore)} transition-all duration-1000`}
                            />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-3xl font-black text-gray-900 dark:text-white">{confidenceScore}</span>
                            <span className="text-[10px] text-gray-400 font-bold uppercase">Confidence</span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 bg-gray-50 dark:bg-gray-800 dark:border-gray-700 rounded-xl border border-gray-100">
                        <div className="flex items-center gap-2 mb-1">
                            <Ghost className="w-3.5 h-3.5 text-gray-400" />
                            <p className="text-[10px] font-bold text-gray-400 uppercase">Silence Status</p>
                        </div>
                        <p className={`text-sm font-bold ${metrics.silenceDays > 7 ? 'text-red-600' : 'text-gray-900 dark:text-white'}`}>
                            {metrics.silenceDays || 0} Days Quiet
                        </p>
                    </div>

                    <div className="p-3 bg-gray-50 dark:bg-gray-800 dark:border-gray-700 rounded-xl border border-gray-100">
                        <div className="flex items-center gap-2 mb-1">
                            <Clock className="w-3.5 h-3.5 text-gray-400" />
                            <p className="text-[10px] font-bold text-gray-400 uppercase">Avg Approval</p>
                        </div>
                        <p className="text-sm font-bold text-gray-900 dark:text-white">
                            {engagementSignals.avgApprovalHours || 0}h Latency
                        </p>
                    </div>

                    <div className="p-3 bg-gray-50 dark:bg-gray-800 dark:border-gray-700 rounded-xl border border-gray-100">
                        <div className="flex items-center gap-2 mb-1">
                            <AlertCircle className="w-3.5 h-3.5 text-amber-500" />
                            <p className="text-[10px] font-bold text-gray-400 uppercase">Pending Resp</p>
                        </div>
                        <p className="text-sm font-bold text-gray-900 dark:text-white">
                            {metrics.pendingDependencies || 0} Actions
                        </p>
                    </div>

                    <div className="p-3 bg-gray-50 dark:bg-gray-800 dark:border-gray-700 rounded-xl border border-gray-100">
                        <div className="flex items-center gap-2 mb-1">
                            <ShieldAlert className="w-3.5 h-3.5 text-red-500" />
                            <p className="text-[10px] font-bold text-gray-400 uppercase">Stale Decisions</p>
                        </div>
                        <p className="text-sm font-bold text-gray-900 dark:text-white">
                            {engagementSignals.staleDecisionsCount || 0} Critical
                        </p>
                    </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-50">
                    <p className="text-[10px] text-gray-400 text-center italic">
                        Signals derived from 30-day interaction telemetry
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AdminEngagementSentiment;
