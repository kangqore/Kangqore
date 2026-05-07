import React, { useState } from 'react';
import DashboardLayout from '../../../components/DashboardLayout';
import { Building2, Calendar, MapPin, Plus, Briefcase, ExternalLink, Edit2, Download } from 'lucide-react';

const CareersWork = () => {
    const [experiences, setExperiences] = useState([
        { 
            id: 1, 
            role: 'Senior Frontend Developer', 
            company: 'TechCorp Inc.', 
            location: 'San Francisco, CA',
            startDate: '2021-03', 
            endDate: 'Present',
            current: true,
            description: 'Leading the frontend team in rebuilding the core product dashboard using React and TypeScript.'
        },
        { 
            id: 2, 
            role: 'Web Developer', 
            company: 'Creative Agency', 
            location: 'Austin, TX',
            startDate: '2019-01', 
            endDate: '2021-02',
            current: false,
            description: 'Developed responsive websites for various clients using HTML, CSS, and Vue.js.'
        }
    ]);

    return (
        <DashboardLayout 
            role="job_seeker" 
            title="My Work Experience" 
            subtitle="Manage your professional history and resume details."
        >
            <div className="flex flex-col lg:flex-row gap-8">
                {/* Main Content - Work History */}
                <div className="flex-1 space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Experience</h2>
                        <button className="flex items-center gap-2 text-sm font-medium text-brand-blue hover:text-blue-700">
                            <Plus className="w-4 h-4" />
                            Add Experience
                        </button>
                    </div>

                    <div className="bg-white dark:bg-gray-900 dark:border-gray-800 rounded-xl shadow-sm border border-gray-100 divide-y divide-gray-100">
                        {experiences.map((exp) => (
                            <div key={exp.id} className="p-6 hover:bg-gray-50 dark:bg-[#050505] transition-colors group">
                                <div className="flex justify-between items-start">
                                    <div className="flex gap-4">
                                        <div className="w-12 h-12 rounded-lg bg-indigo-50 flex items-center justify-center flex-shrink-0">
                                            <Briefcase className="w-6 h-6 text-indigo-600" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-gray-900 dark:text-white">{exp.role}</h3>
                                            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-gray-600 dark:text-gray-400 mt-1">
                                                <span className="flex items-center gap-1 font-medium">
                                                    <Building2 className="w-3.5 h-3.5" />
                                                    {exp.company}
                                                </span>
                                                <span className="text-gray-300">•</span>
                                                <span className="flex items-center gap-1">
                                                    <MapPin className="w-3.5 h-3.5" />
                                                    {exp.location}
                                                </span>
                                                <span className="text-gray-300">•</span>
                                                <span className="flex items-center gap-1 text-gray-500">
                                                    <Calendar className="w-3.5 h-3.5" />
                                                    {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                                                </span>
                                            </div>
                                            <p className="text-gray-600 dark:text-gray-400 mt-3 text-sm leading-relaxed">
                                                {exp.description}
                                            </p>
                                        </div>
                                    </div>
                                    <button className="opacity-0 group-hover:opacity-100 p-2 hover:bg-gray-200 rounded-lg transition-all text-gray-400 hover:text-gray-600 dark:text-gray-400">
                                        <Edit2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Sidebar - Resume & Skills */}
                <div className="w-full lg:w-80 space-y-6">
                    <div className="bg-white dark:bg-gray-900 dark:border-gray-800 rounded-xl shadow-sm border border-gray-100 p-6">
                        <h3 className="font-bold text-gray-900 dark:text-white mb-4">Resume</h3>
                        <div className="p-4 border border-gray-200 rounded-lg bg-gray-50 dark:bg-gray-800 dark:border-gray-700 flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                                    <span className="text-xs font-bold text-red-600">PDF</span>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-900 dark:text-white">My_Resume.pdf</p>
                                    <p className="text-xs text-gray-500">Updated 2 days ago</p>
                                </div>
                            </div>
                            <button className="text-gray-400 hover:text-gray-600 dark:text-gray-400">
                                <Download className="w-4 h-4" />
                            </button>
                        </div>
                        <button className="w-full py-2.5 bg-brand-blue text-white rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-sm">
                            Upload New Resume
                        </button>
                    </div>

                    <div className="bg-white dark:bg-gray-900 dark:border-gray-800 rounded-xl shadow-sm border border-gray-100 p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-bold text-gray-900 dark:text-white">Skills</h3>
                            <button className="text-xs text-brand-blue font-medium hover:underline">Edit</button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {['React', 'Node.js', 'UI Design', 'TypeScript', 'Tailwind CSS', 'Figma'].map((skill) => (
                                <span key={skill} className="px-3 py-1 bg-gray-100 dark:bg-[#0a0a0c] text-gray-700 dark:text-gray-300 rounded-full text-xs font-medium">
                                    {skill}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default CareersWork;
