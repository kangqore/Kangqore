import React, { useState } from 'react';
import DashboardLayout from '../../../components/DashboardLayout';
import { Plus, Folder, ExternalLink, Image as ImageIcon, Trash2, Edit } from 'lucide-react';

const CareersPortfolio = () => {
    // Mock Data
    const [portfolioItems, setPortfolioItems] = useState([
        { id: 1, title: 'E-Commerce Redesign', items: 3, type: 'Design', date: '2023-12-01' },
        { id: 2, title: 'Mobile Banking App', items: 5, type: 'Development', date: '2023-10-15' },
    ]);

    return (
        <DashboardLayout 
            role="job_seeker" 
            title="My Portfolio" 
            subtitle="Showcase your best work to potential employers."
        >
            <div className="flex justify-end mb-6">
                <button className="flex items-center gap-2 px-4 py-2 bg-brand-gradient text-white rounded-xl shadow-md hover:shadow-lg transition-all">
                    <Plus className="w-4 h-4" />
                    Add Project
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {portfolioItems.map((item) => (
                    <div key={item.id} className="bg-white dark:bg-gray-900 dark:border-gray-800 rounded-xl shadow-sm border border-gray-100 overflow-hidden group hover:shadow-md transition-all">
                        <div className="h-40 bg-gray-100 dark:bg-[#0a0a0c] flex items-center justify-center relative">
                            {/* Placeholder Image Area */}
                            <Folder className="w-12 h-12 text-gray-300" />
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                                <button className="p-2 bg-white dark:bg-black rounded-full hover:bg-gray-100">
                                    <Edit className="w-4 h-4 text-gray-700 dark:text-gray-300" />
                                </button>
                                <button className="p-2 bg-white dark:bg-black rounded-full hover:bg-red-50 text-red-600">
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                        <div className="p-5">
                            <div className="flex items-start justify-between mb-2">
                                <div>
                                    <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-1">{item.title}</h3>
                                    <span className="text-xs text-brand-blue font-medium bg-blue-50 dark:bg-blue-900/20 px-2 py-0.5 rounded-full">
                                        {item.type}
                                    </span>
                                </div>
                            </div>
                            <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-50 text-xs text-gray-500">
                                <span className="flex items-center gap-1">
                                    <ImageIcon className="w-3 h-3" />
                                    {item.items} items
                                </span>
                                <span>{new Date(item.date).toLocaleDateString()}</span>
                            </div>
                        </div>
                    </div>
                ))}

                {/* Empty State / Add New Card */}
                <button className="border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center h-[280px] hover:border-brand-blue hover:bg-blue-50 dark:bg-blue-900/20/10 transition-colors group">
                    <div className="w-12 h-12 rounded-full bg-gray-50 dark:bg-[#050505] flex items-center justify-center mb-3 group-hover:bg-blue-100 transition-colors">
                        <Plus className="w-6 h-6 text-gray-400 group-hover:text-brand-blue" />
                    </div>
                    <span className="font-medium text-gray-600 dark:text-gray-400 group-hover:text-brand-blue">Create New Project</span>
                    <span className="text-sm text-gray-400 mt-1">Upload images, PDFs, or links</span>
                </button>
            </div>
        </DashboardLayout>
    );
};

export default CareersPortfolio;
