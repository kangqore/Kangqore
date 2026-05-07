import React from 'react';
import { Map, ArrowRight } from 'lucide-react';

const ClientRoadmap = () => {
    return (
        <div className="bg-white dark:bg-gray-900 dark:border-gray-800 p-6 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                   <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                       <Map className="w-5 h-5" />
                   </div>
                   <div>
                       <h3 className="font-bold text-gray-900 dark:text-white">Strategic Roadmap</h3>
                       <p className="text-xs text-gray-500">High-level view of our trajectory</p>
                   </div>
                </div>
                <button className="text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-lg hover:bg-indigo-100 transition-colors">
                    View Full Roadmap
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
                {/* Connecting Line (Desktop) */}
                <div className="hidden md:block absolute top-[16px] left-[16%] right-[16%] h-0.5 bg-gray-100 dark:bg-[#0a0a0c] -z-10"></div>

                {/* NOW */}
                <div className="relative">
                    <div className="flex items-center gap-2 mb-3">
                        <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center border-4 border-white shadow-sm z-10">
                            <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></div>
                        </div>
                        <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">Now (Q1 2026)</span>
                    </div>
                    <div className="bg-emerald-50/50 p-4 rounded-xl border border-emerald-100">
                        <h4 className="font-bold text-gray-900 dark:text-white text-sm mb-2">MVP Launch & Scale</h4>
                        <ul className="space-y-2">
                            <li className="flex items-start gap-2 text-xs text-gray-600 dark:text-gray-400">
                                <span className="mt-1 w-1.5 h-1.5 rounded-full bg-emerald-400 flex-shrink-0"></span>
                                Core Platform Release v1.0
                            </li>
                            <li className="flex items-start gap-2 text-xs text-gray-600 dark:text-gray-400">
                                <span className="mt-1 w-1.5 h-1.5 rounded-full bg-emerald-400 flex-shrink-0"></span>
                                Initial User Onboarding (50 users)
                            </li>
                            <li className="flex items-start gap-2 text-xs text-gray-600 dark:text-gray-400">
                                <span className="mt-1 w-1.5 h-1.5 rounded-full bg-emerald-400 flex-shrink-0"></span>
                                Payment Gateway Integration
                            </li>
                        </ul>
                    </div>
                </div>

                {/* NEXT */}
                <div className="relative">
                    <div className="flex items-center gap-2 mb-3">
                        <div className="w-8 h-8 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center border-4 border-white shadow-sm z-10">
                            <div className="w-3 h-3 rounded-full bg-blue-400"></div>
                        </div>
                        <span className="text-xs font-bold uppercase tracking-wider text-blue-600">Next (Q2 2026)</span>
                    </div>
                    <div className="bg-white dark:bg-gray-900 dark:border-gray-800 p-4 rounded-xl border border-gray-200">
                        <h4 className="font-bold text-gray-900 dark:text-white text-sm mb-2">Market Expansion</h4>
                        <ul className="space-y-2">
                            <li className="flex items-start gap-2 text-xs text-gray-600 dark:text-gray-400">
                                <span className="mt-1 w-1.5 h-1.5 rounded-full bg-blue-200 flex-shrink-0"></span>
                                iOS & Android Native Apps
                            </li>
                            <li className="flex items-start gap-2 text-xs text-gray-600 dark:text-gray-400">
                                <span className="mt-1 w-1.5 h-1.5 rounded-full bg-blue-200 flex-shrink-0"></span>
                                Multi-currency Support
                            </li>
                        </ul>
                    </div>
                </div>

                {/* LATER */}
                <div className="relative">
                    <div className="flex items-center gap-2 mb-3">
                        <div className="w-8 h-8 rounded-full bg-gray-50 dark:bg-gray-800 dark:border-gray-700 flex items-center justify-center border-4 border-white shadow-sm z-10">
                            <div className="w-3 h-3 rounded-full bg-gray-300"></div>
                        </div>
                        <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Later (H2 2026)</span>
                    </div>
                    <div className="bg-white dark:bg-gray-900 dark:border-gray-800 p-4 rounded-xl border border-dashed border-gray-200 opacity-75">
                        <h4 className="font-bold text-gray-900 dark:text-white text-sm mb-2">AI Intelligence Layer</h4>
                        <ul className="space-y-2">
                            <li className="flex items-start gap-2 text-xs text-gray-500">
                                <span className="mt-1 w-1.5 h-1.5 rounded-full bg-gray-300 flex-shrink-0"></span>
                                Predictive Analytics Module
                            </li>
                            <li className="flex items-start gap-2 text-xs text-gray-500">
                                <span className="mt-1 w-1.5 h-1.5 rounded-full bg-gray-300 flex-shrink-0"></span>
                                Automated Marketing Workflows
                            </li>
                        </ul>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default ClientRoadmap;
