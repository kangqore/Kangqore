import React from 'react';
import DashboardLayout from '../../../components/DashboardLayout';
import { Link as LinkIcon, FolderOpen, Shield, MessageSquare, ExternalLink } from 'lucide-react';

const ClientLinks = ({ isTabContent = false }) => {
    const linkCategories = [
        {
            title: "Project Resources",
            icon: FolderOpen,
            color: "text-brand-blue",
            links: [
                { name: "Figma Design System", url: "#", type: "Design" },
                { name: "JIRA Board", url: "#", type: "Management" },
                { name: "GitHub Repository", url: "#", type: "Code" },
                { name: "API Documentation", url: "#", type: "Docs" }
            ]
        },
        {
            title: "Compliance & Governance",
            icon: Shield,
            color: "text-purple-600",
            links: [
                { name: "Security Audit Report", url: "#", type: "Security" },
                { name: "Data Processing Agreement", url: "#", type: "Legal" },
                { name: "SOC2 Compliance Cert", url: "#", type: "Compliance" }
            ]
        },
        {
            title: "Communication Channels",
            icon: MessageSquare,
            color: "text-green-600",
            links: [
                { name: "Slack Channel #project-alpha", url: "#", type: "Chat" },
                { name: "Weekly Sync Zoom", url: "#", type: "Meeting" },
                { name: "Escalation Matrix", url: "#", type: "Support" }
            ]
        }
    ];

    const Content = () => (
        <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-12 animate-in fade-in duration-700">
            <div className="flex flex-col md:flex-row justify-between items-end gap-6">
                <div>
                   <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">
                        Important <span className="text-brand-blue">Links</span>
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 font-medium mt-2 max-w-2xl">
                        Centralized repository for all external tools, documentation, and communication channels.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {linkCategories.map((category, idx) => (
                    <div key={idx} className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 shadow-xl shadow-slate-100/50 dark:shadow-none border border-slate-50 dark:border-slate-800 hover:shadow-2xl hover:shadow-brand-blue/5 transition-all duration-300 group">
                        <div className="flex items-center gap-4 mb-8">
                            <div className={`p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl group-hover:scale-110 transition-transform duration-300`}>
                                <category.icon className={`w-8 h-8 ${category.color}`} />
                            </div>
                            <h3 className="text-xl font-black text-slate-900 dark:text-white">{category.title}</h3>
                        </div>

                        <ul className="space-y-4">
                            {category.links.map((link, i) => (
                                <li key={i}>
                                    <a href={link.url} className="flex items-center justify-between p-4 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 group/link transition-colors border border-transparent hover:border-slate-100 dark:hover:border-slate-700">
                                        <div className="flex items-center gap-3">
                                            <LinkIcon className="w-4 h-4 text-slate-300 dark:text-slate-600 group-hover/link:text-brand-blue transition-colors" />
                                            <span className="font-bold text-slate-700 dark:text-slate-200">{link.name}</span>
                                        </div>
                                        <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-md group-hover/link:bg-white dark:group-hover/link:bg-slate-700 group-hover/link:shadow-sm transition-all">{link.type}</span>
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
        </div>
    );

    if (isTabContent) return <Content />;

    return (
        <DashboardLayout role="client" title="Important Links" subtitle="Quick access to external project resources">
            <Content />
        </DashboardLayout>
    );
};

export default ClientLinks;
