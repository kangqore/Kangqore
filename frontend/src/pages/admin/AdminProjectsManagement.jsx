import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
    Briefcase, Plus, Search, Calendar, CheckCircle, 
    FileText, Clock, AlertCircle, ChevronRight, User, 
    ArrowLeft, Layers, Paperclip, ExternalLink
} from 'lucide-react';
import DashboardLayout from '../../components/DashboardLayout';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || '';

const AdminProjectsManagement = () => {
    const [view, setView] = useState('list'); // 'list' | 'detail' | 'create'
    const [projects, setProjects] = useState([]);
    const [selectedProject, setSelectedProject] = useState(null);
    const [loading, setLoading] = useState(true);
    const [clients, setClients] = useState([]); // For dropdown
    const [partners, setPartners] = useState([]); // For dropdown
    const [searchTerm, setSearchTerm] = useState('');

    // Forms
    const [newProject, setNewProject] = useState({ title: '', description: '', clientId: '', partnerId: '' });
    const [newTask, setNewTask] = useState({ title: '', description: '', priority: 'medium', dueDate: '' });

    useEffect(() => {
        fetchProjects();
        fetchUsers();
    }, []);

    const fetchProjects = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get(`${BACKEND_URL}/api/admin/projects`, { 
                headers: { Authorization: `Bearer ${token}` }
            });
            // Safely handle if response is an array or object wrapping array
            const data = res.data;
            if (Array.isArray(data)) {
                setProjects(data);
            } else if (data && Array.isArray(data.projects)) {
                setProjects(data.projects);
            } else {
                setProjects([]);
                console.warn('Unexpected response format for projects:', data);
            }
        } catch (error) {
            console.error('Error fetching projects', error);
            setProjects([]);
        } finally {
            setLoading(false);
        }
    };

    const fetchUsers = async () => {
        try {
            const token = localStorage.getItem('token');
            const [clientsRes, partnersRes] = await Promise.all([
                axios.get(`${BACKEND_URL}/api/admin/users?role=CLIENT&limit=100`, { headers: { Authorization: `Bearer ${token}` } }),
                axios.get(`${BACKEND_URL}/api/admin/users?role=PARTNER&limit=100`, { headers: { Authorization: `Bearer ${token}` } })
            ]);
            setClients(clientsRes.data.users || []);
            setPartners(partnersRes.data.users || []);
        } catch (e) { console.error(e); }
    };

    const handleCreateProject = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            await axios.post(`${BACKEND_URL}/api/projects`, newProject, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert('Project Created!');
            setView('list');
            fetchProjects();
        } catch (e) {
            alert('Failed to create project');
        }
    };

    const handleCreateTask = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            await axios.post(`${BACKEND_URL}/api/projects/${selectedProject.id}/tasks`, {
                ...newTask,
                partnerId: selectedProject.partnerId 
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert('Task Added!');
            setNewTask({ title: '', description: '', priority: 'medium', dueDate: '' });
            const res = await axios.get(`${BACKEND_URL}/api/projects/${selectedProject.id}`, { headers: { Authorization: `Bearer ${token}` } });
            setSelectedProject(res.data);
        } catch (e) {
            alert('Failed to add task');
        }
    };

    const openProject = async (project) => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get(`${BACKEND_URL}/api/projects/${project.id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setSelectedProject(res.data);
            setView('detail');
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const filteredProjects = projects.filter(p => 
        p.title?.toLowerCase().includes(searchTerm.toLowerCase()) || 
        p.client?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.clientId?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <DashboardLayout role="admin" title="Projects & Tasks" subtitle="Manage client projects and partner delivery">
            {view === 'list' && (
                <div className="space-y-6">
                    <div className="flex justify-between items-center">
                        <div className="relative w-64">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"/>
                            <input 
                                type="text" 
                                placeholder="Search projects..." 
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-brand-blue outline-none transition-all" 
                            />
                        </div>
                        <button 
                            onClick={() => setView('create')}
                            className="bg-brand-blue text-white px-4 py-2 rounded-lg flex items-center gap-2 font-medium hover:bg-blue-700"
                        >
                            <Plus className="w-4 h-4" /> New Project
                        </button>
                    </div>

                    <div className="bg-white dark:bg-gray-900 dark:border-gray-800 rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 dark:bg-[#050505] text-xs uppercase text-gray-500 font-semibold">
                                <tr>
                                    <th className="px-6 py-4">Title</th>
                                    <th className="px-6 py-4">Client</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4">Deliverables</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filteredProjects.length > 0 ? (
                                    filteredProjects.map(p => (
                                    <tr key={p.id} className="hover:bg-gray-50 dark:bg-[#050505]">
                                        <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{p.title}</td>
                                        <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{p.client?.name || p.clientId}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${p.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-gray-100 dark:bg-[#0a0a0c] text-gray-500'}`}>
                                                {p.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500">
                                            {p._count?.deliverables || 0} submitted
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button 
                                                onClick={() => openProject(p)}
                                                className="text-brand-blue font-medium text-sm hover:underline"
                                            >
                                                Manage
                                            </button>
                                        </td>
                                    </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-8 text-center text-gray-400 text-sm">
                                            {searchTerm ? `No projects found for "${searchTerm}"` : 'No projects found.'}
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {view === 'create' && (
                <div className="max-w-2xl mx-auto bg-white dark:bg-gray-900 dark:border-gray-800 p-8 rounded-2xl shadow-sm border border-gray-100">
                    <div className="flex items-center gap-4 mb-6">
                        <button onClick={() => setView('list')} className="p-2 hover:bg-gray-100 dark:bg-[#0a0a0c] rounded-full">
                            <ArrowLeft className="w-5 h-5 text-gray-500"/>
                        </button>
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Create New Project</h2>
                    </div>
                    <form onSubmit={handleCreateProject} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Project Title</label>
                            <input 
                                required
                                type="text" 
                                className="w-full p-2 border rounded-lg"
                                value={newProject.title}
                                onChange={e => setNewProject({...newProject, title: e.target.value})}
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Client</label>
                                <select 
                                    required
                                    className="w-full p-2 border rounded-lg bg-white dark:bg-gray-900 dark:border-gray-800"
                                    value={newProject.clientId}
                                    onChange={e => setNewProject({...newProject, clientId: e.target.value})}
                                >
                                    <option value="">Select Client</option>
                                    {clients.map(c => <option key={c.id} value={c.id}>{c.name} ({c.company})</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Assign Partner (Optional)</label>
                                <select 
                                    className="w-full p-2 border rounded-lg bg-white dark:bg-gray-900 dark:border-gray-800"
                                    value={newProject.partnerId}
                                    onChange={e => setNewProject({...newProject, partnerId: e.target.value})}
                                >
                                    <option value="">Select Partner</option>
                                    {partners.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                                </select>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
                            <textarea 
                                className="w-full p-2 border rounded-lg h-32"
                                value={newProject.description}
                                onChange={e => setNewProject({...newProject, description: e.target.value})}
                            />
                        </div>
                        <div className="flex justify-end pt-4">
                            <button type="submit" className="bg-brand-blue text-white px-6 py-2 rounded-lg font-bold hover:bg-blue-700">Create Project</button>
                        </div>
                    </form>
                </div>
            )}

            {view === 'detail' && selectedProject && (
                <div className="space-y-6 animate-in fade-in">
                    {/* Header */}
                    <div className="flex items-center gap-4">
                        <button onClick={() => setView('list')} className="p-2 hover:bg-gray-100 dark:bg-[#0a0a0c] rounded-full">
                            <ArrowLeft className="w-5 h-5 text-gray-500"/>
                        </button>
                        <div>
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white">{selectedProject.title}</h2>
                            <p className="text-sm text-gray-500">{selectedProject.client?.company} • Partner: {selectedProject.partnerId ? 'Assigned' : 'Unassigned'}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Tasks Section */}
                        <div className="space-y-4">
                            <div className="bg-white dark:bg-gray-900 dark:border-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100">
                                <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                    <Layers className="w-5 h-5 text-brand-blue" /> Project Tasks
                                </h3>
                                
                                {/* Add Task */}
                                <div className="bg-gray-50 dark:bg-gray-800 dark:border-gray-700 p-4 rounded-xl border border-gray-200 mb-4">
                                    <h4 className="text-xs font-bold uppercase text-gray-500 mb-3">Add New Task</h4>
                                    <div className="space-y-3">
                                        <input 
                                            placeholder="Task Title" 
                                            className="w-full p-2 text-sm border rounded-lg"
                                            value={newTask.title}
                                            onChange={e => setNewTask({...newTask, title: e.target.value})}
                                        />
                                        <div className="flex gap-2">
                                            <select 
                                                className="flex-1 p-2 text-sm border rounded-lg"
                                                value={newTask.priority}
                                                onChange={e => setNewTask({...newTask, priority: e.target.value})}
                                            >
                                                <option value="low">Low Priority</option>
                                                <option value="medium">Medium Priority</option>
                                                <option value="high">High Priority</option>
                                            </select>
                                            <input 
                                                type="date"
                                                className="flex-1 p-2 text-sm border rounded-lg"
                                                value={newTask.dueDate}
                                                onChange={e => setNewTask({...newTask, dueDate: e.target.value})}
                                            />
                                        </div>
                                        <button 
                                            onClick={handleCreateTask}
                                            disabled={!newTask.title}
                                            className="w-full py-2 bg-gray-900 text-white text-sm font-bold rounded-lg hover:bg-black disabled:opacity-50"
                                        >
                                            Add Task
                                        </button>
                                    </div>
                                </div>

                                {/* Task List */}
                                <div className="space-y-2">
                                    {selectedProject.tasks?.length === 0 && <p className="text-center text-sm text-gray-400 py-4">No tasks yet.</p>}
                                    {selectedProject.tasks?.map(task => (
                                        <div key={task.id} className="flex items-center justify-between p-3 bg-white dark:bg-gray-900 dark:border-gray-800 border border-gray-100 rounded-lg shadow-sm">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-2 h-2 rounded-full ${task.status === 'completed' ? 'bg-green-500' : 'bg-gray-300'}`} />
                                                <div>
                                                    <p className={`text-sm font-medium ${task.status === 'completed' ? 'line-through text-gray-400' : 'text-gray-900 dark:text-white'}`}>{task.title}</p>
                                                    <p className="text-xs text-gray-500">{task.status}</p>
                                                </div>
                                            </div>
                                            <span className="text-xs font-mono bg-gray-100 dark:bg-[#0a0a0c] px-2 py-0.5 rounded">{task.priority}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Deliverables Section */}
                        <div className="space-y-4">
                            <div className="bg-white dark:bg-gray-900 dark:border-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100">
                                <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                    <CheckCircle className="w-5 h-5 text-emerald-600" /> Deliverables
                                </h3>
                                <div className="space-y-3">
                                    {selectedProject.deliverables?.length === 0 && <p className="text-center text-sm text-gray-400 py-4">No deliverables submitted.</p>}
                                    {selectedProject.deliverables?.map(del => (
                                        <div key={del.id} className="p-4 bg-emerald-50/50 border border-emerald-100 rounded-xl">
                                            <div className="flex justify-between items-start mb-2">
                                                <h4 className="font-bold text-gray-900 dark:text-white text-sm">{del.title}</h4>
                                                <span className="text-[10px] font-bold uppercase bg-white dark:bg-gray-900 dark:border-gray-800 text-emerald-700 px-2 py-0.5 rounded border border-emerald-100">
                                                    {del.status}
                                                </span>
                                            </div>
                                            <p className="text-xs text-gray-600 dark:text-gray-400 mb-3">{del.description}</p>
                                            {del.attachments && del.attachments.length > 0 && (
                                                <div className="flex gap-2">
                                                    {del.attachments.map((att, i) => (
                                                        <a 
                                                            key={i} 
                                                            href={typeof att === 'string' ? att : att.url}
                                                            target="_blank" 
                                                            rel="noreferrer"
                                                            className="flex items-center gap-1 text-xs font-bold text-emerald-700 bg-white dark:bg-gray-900 dark:border-gray-800 px-2 py-1 rounded border border-emerald-200 hover:bg-emerald-50"
                                                        >
                                                            <Paperclip className="w-3 h-3" /> File
                                                        </a>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </DashboardLayout>
    );
};

export default AdminProjectsManagement;
