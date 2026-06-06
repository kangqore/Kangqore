import React, { useState, useEffect } from 'react';
import { Briefcase, X, FileText, CheckCircle, Building2 } from 'lucide-react';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || '';

const CreateProjectModal = ({ onClose, onSuccess }) => {
    const [formData, setFormData] = useState({
        clientId: '',
        title: '',
        description: 'Primary engagement project'
    });
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(false);
    const [fetchingClients, setFetchingClients] = useState(true);

    useEffect(() => {
        const fetchClients = async () => {
            try {
                const token = localStorage.getItem('token');
                console.log('Fetching clients with token:', token ? 'Present' : 'Missing');
                
                const res = await axios.get(`${BACKEND_URL}/api/admin/users?role=CLIENT&limit=100`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                
                console.log('Clients API response:', res.data);
                console.log('Clients array:', res.data.users);
                console.log('Number of clients:', res.data.users?.length || 0);
                
                setClients(res.data.users || []);
            } catch (err) {
                console.error("Failed to fetch clients:", err);
                console.error("Error response:", err.response?.data);
                console.error("Error status:", err.response?.status);
                setClients([]); // Set empty array on error
            } finally {
                setFetchingClients(false);
            }
        };

        fetchClients();
    }, []);

    // Auto-update project title when client is selected
    useEffect(() => {
        if (formData.clientId) {
            const selectedClient = clients.find(c => c.id === formData.clientId);
            if (selectedClient) {
                setFormData(prev => ({
                    ...prev,
                    title: `Main Project - ${selectedClient.name || selectedClient.company || 'Client'}`
                }));
            }
        }
    }, [formData.clientId, clients]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!formData.clientId) {
            alert('Please select a client');
            return;
        }

        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const response = await axios.post(`${BACKEND_URL}/api/projects`, {
                ...formData,
                status: 'ACTIVE'
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            console.log('Project created successfully:', response.data);
            console.log('Created for client ID:', formData.clientId);
            
            // Backend returns the project directly in response.data
            onSuccess(response.data); // Pass created project data back
            onClose();
        } catch (err) {
            console.error(err);
            const errorMsg = err.response?.data?.error?.message || err.response?.data?.message || err.message;
            alert(`Failed to initialize project: ${errorMsg}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[999] p-4">
            <div className="bg-white dark:bg-gray-900 dark:border-gray-800 rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden animate-in fade-in zoom-in duration-250 border border-gray-100">
                {/* Header */}
                <div className="bg-brand-blue/5 px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-gradient-to-r from-blue-50 to-white">
                    <div className="flex items-center gap-3">
                        <div className="bg-brand-blue/10 p-2 rounded-lg">
                            <Briefcase className="w-5 h-5 text-brand-blue" />
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-900 dark:text-white">Initialize New Project</h3>
                            <p className="text-xs text-brand-blue font-medium">Create project for any client</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:bg-[#0a0a0c] p-2 rounded-full transition-all">
                        <X className="w-5 h-5" />
                    </button>
                </div>
                
                <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">
                    {/* Client Selection */}
                    <div>
                        <label className="flex items-center gap-2 text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                            <Building2 className="w-4 h-4 text-purple-500" />
                            Select Client <span className="text-red-500">*</span>
                        </label>
                        <select 
                            required
                            value={formData.clientId}
                            onChange={(e) => setFormData({ ...formData, clientId: e.target.value })}
                            className="w-full p-2.5 border border-gray-200 rounded-xl bg-white dark:bg-gray-900 dark:border-gray-800 focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue transition-all outline-none text-sm"
                            disabled={fetchingClients}
                        >
                            <option value="">Choose client for this project...</option>
                            {clients.length > 0 ? (
                                clients.map(c => (
                                    <option key={c.id} value={c.id}>
                                        {c.name || c.email} {c.company ? `(${c.company})` : ''}
                                    </option>
                                ))
                            ) : (
                                !fetchingClients && <option value="" disabled>No clients available</option>
                            )}
                        </select>
                        {fetchingClients && <p className="text-[10px] text-gray-400 mt-1 animate-pulse italic">Loading clients...</p>}
                        {!fetchingClients && clients.length === 0 && (
                            <p className="text-[10px] text-red-500 mt-1 font-medium">
                                ⚠️ No clients found. Please create a client first.
                            </p>
                        )}
                    </div>

                    {/* Project Title */}
                    <div>
                        <label className="flex items-center gap-2 text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                            <CheckCircle className="w-4 h-4 text-emerald-500" />
                            Project Title <span className="text-red-500">*</span>
                        </label>
                        <input 
                            required
                            type="text"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            placeholder="e.g. Q1 Infrastructure Modernization"
                            className="w-full p-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue transition-all outline-none text-sm placeholder:text-gray-400"
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label className="flex items-center gap-2 text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                            <FileText className="w-4 h-4 text-amber-500" />
                            Project Narrative / Scope
                        </label>
                        <textarea 
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            placeholder="Detail the primary objectives and scope of this engagement..."
                            className="w-full h-28 p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue transition-all outline-none text-sm resize-none placeholder:text-gray-400"
                        />
                    </div>

                    {/* Footer Actions */}
                    <div className="flex gap-3 justify-end pt-2">
                        <button 
                            type="button" 
                            onClick={onClose}
                            className="px-5 py-2.5 text-gray-500 font-bold hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-700 rounded-xl transition-all text-sm border border-transparent hover:border-gray-100"
                        >
                            Cancel
                        </button>
                        <button 
                            type="submit" 
                            disabled={loading || !formData.clientId}
                            className="px-6 py-2.5 bg-brand-blue text-white font-bold rounded-xl hover:bg-blue-700 transition-all shadow-md disabled:opacity-50 disabled:shadow-none flex items-center gap-2 text-sm"
                        >
                            {loading ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Initializing...
                                </>
                            ) : (
                                'Complete Project Initiation'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateProjectModal;
