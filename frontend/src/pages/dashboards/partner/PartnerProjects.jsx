import React, { useState } from 'react';
import DashboardLayout from '../../../components/DashboardLayout';
import { 
  FolderKanban, 
  ExternalLink, 
  GitBranch, 
  Clock, 
  CheckCircle, 
  Users,
  Code2,
  Terminal,
  ArrowRight
} from 'lucide-react';
import { Link } from 'react-router-dom';

const MY_PROJECTS = [
  {
    id: 'PRJ-2026-001',
    name: 'FinTech Platform Modernization',
    client: 'Acme Corp', // In reality, might obscure client name depending on NDA
    role: 'Frontend Developer (React)',
    status: 'In Progress',
    startDate: 'Jan 05, 2026',
    endDate: 'Mar 30, 2026',
    techStack: ['React', 'TypeScript', 'Tailwind', 'Recharts'],
    repoUrl: '#',
    boardUrl: '#',
    lead: 'Sarah Jenning'
  },
  {
    id: 'PRJ-2025-012',
    name: 'E-Commerce Mobile App',
    client: 'ShopifyPlus',
    role: 'React Native Engineer',
    status: 'Completed',
    startDate: 'Oct 01, 2025',
    endDate: 'Dec 15, 2025',
    techStack: ['React Native', 'Firebase', 'Redux'],
    repoUrl: '#',
    boardUrl: '#',
    lead: 'Mike Ross'
  }
];

const PartnerProjects = () => {
  return (
    <DashboardLayout role="partner" title="My Projects" subtitle="Active engagements and historical records">
      <div className="space-y-6">
        
        {/* Active Projects */}
        {MY_PROJECTS.filter(p => p.status === 'In Progress').map(project => (
            <div key={project.id} className="bg-white dark:bg-gray-900 dark:border-gray-800 rounded-2xl border border-gray-200 shadow-sm p-6 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 dark:bg-blue-900/20 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110"></div>
                
                <div className="relative z-10">
                    <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg">
                                <Code2 className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-blue-600 transition-colors">{project.name}</h3>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className="text-xs font-bold text-gray-500 bg-gray-100 dark:bg-gray-800 dark:border-gray-700 px-2 py-0.5 rounded border border-gray-200">{project.id}</span>
                                    <span className="text-xs text-gray-400">•</span>
                                    <span className="text-xs font-medium text-gray-500 flex items-center gap-1">
                                        <Users className="w-3 h-3" /> Lead: {project.lead}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                             <a href={project.repoUrl} className="p-2 bg-gray-100 dark:bg-[#0a0a0c] text-gray-600 dark:text-gray-400 rounded-lg hover:bg-gray-200 hover:text-black transition-colors" title="View Repository">
                                 <GitBranch className="w-4 h-4" />
                             </a>
                             <a href={project.boardUrl} className="p-2 bg-gray-100 dark:bg-[#0a0a0c] text-gray-600 dark:text-gray-400 rounded-lg hover:bg-gray-200 hover:text-black transition-colors" title="View Jira/Linear Board">
                                 <FolderKanban className="w-4 h-4" />
                             </a>
                             <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full uppercase border border-green-200 flex items-center gap-1">
                                 <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div> Active
                             </span>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                        <div className="bg-gray-50 dark:bg-gray-800 dark:border-gray-700 rounded-xl p-4 border border-gray-100">
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">My Role</p>
                            <p className="font-bold text-gray-900 dark:text-white">{project.role}</p>
                            <p className="text-xs text-gray-500 mt-1">Full-time commitment</p>
                        </div>
                        <div className="bg-gray-50 dark:bg-gray-800 dark:border-gray-700 rounded-xl p-4 border border-gray-100">
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Timeline</p>
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-600 dark:text-gray-400">{project.startDate}</span>
                                <ArrowRight className="w-3 h-3 text-gray-400" />
                                <span className="font-bold text-gray-900 dark:text-white">{project.endDate}</span>
                            </div>
                            <div className="w-full bg-gray-200 h-1.5 rounded-full mt-3 overflow-hidden">
                                <div className="bg-blue-600 h-full rounded-full" style={{ width: '35%' }}></div>
                            </div>
                        </div>
                        <div className="bg-gray-50 dark:bg-gray-800 dark:border-gray-700 rounded-xl p-4 border border-gray-100">
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Tech Stack</p>
                            <div className="flex flex-wrap gap-2">
                                {project.techStack.map(tech => (
                                    <span key={tech} className="px-2 py-1 bg-white dark:bg-gray-900 dark:border-gray-800 border border-gray-200 rounded text-xs font-medium text-gray-600 dark:text-gray-400">
                                        {tech}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100">
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                            <span className="flex items-center gap-1"><Terminal className="w-4 h-4" /> 12 Commits this week</span>
                            <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> 140 Hours logged</span>
                        </div>
                        <Link to={`/dashboard/partner/tasks`} className="text-sm font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1">
                            View My Tasks <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                </div>
            </div>
        ))}

        {/* Completed History Header */}
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mt-8 mb-4">Engagement History</h3>
        
        <div className="bg-white dark:bg-gray-900 dark:border-gray-800 rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
             <div className="overflow-x-auto">
                 <table className="w-full text-sm text-left">
                     <thead className="bg-gray-50 dark:bg-[#050505] text-gray-500 font-bold uppercase text-xs">
                         <tr>
                             <th className="px-6 py-4">Project Name</th>
                             <th className="px-6 py-4">Role</th>
                             <th className="px-6 py-4">Period</th>
                             <th className="px-6 py-4">Stack</th>
                             <th className="px-6 py-4">Feedback</th>
                         </tr>
                     </thead>
                     <tbody className="divide-y divide-gray-100">
                         {MY_PROJECTS.filter(p => p.status === 'Completed').map(project => (
                             <tr key={project.id} className="hover:bg-gray-50 dark:bg-[#050505] transition-colors">
                                 <td className="px-6 py-4">
                                     <p className="font-bold text-gray-900 dark:text-white">{project.name}</p>
                                     <p className="text-xs text-gray-500">{project.client}</p>
                                 </td>
                                 <td className="px-6 py-4 text-gray-600 dark:text-gray-400">{project.role}</td>
                                 <td className="px-6 py-4 text-gray-600 dark:text-gray-400">
                                     {project.startDate} - {project.endDate}
                                 </td>
                                 <td className="px-6 py-4">
                                     <div className="flex gap-1">
                                         {project.techStack.slice(0, 2).map((t, i) => (
                                             <span key={i} className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 dark:border-gray-700 rounded text-xs text-gray-600 dark:text-gray-400 border border-gray-200">{t}</span>
                                         ))}
                                         {project.techStack.length > 2 && <span className="text-xs text-gray-400">+{project.techStack.length - 2}</span>}
                                     </div>
                                 </td>
                                 <td className="px-6 py-4">
                                     <span className="inline-flex items-center gap-1 text-green-600 font-bold bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded-full text-xs">
                                         <CheckCircle className="w-3 h-3" /> 5.0 Rating
                                     </span>
                                 </td>
                             </tr>
                         ))}
                     </tbody>
                 </table>
             </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default PartnerProjects;
