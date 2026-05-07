import React, { useState } from 'react';
import { Shield, AlertTriangle, XPromise } from 'lucide-react';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5050';

const ProgressOverrideModal = ({ projectId, currentProgress, onClose, onSuccess }) => {
    const [progress, setProgress] = useState(currentProgress || 0);
    const [reason, setReason] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            await axios.post(`${BACKEND_URL}/api/admin/projects/${projectId}/override-progress`, {
                progress: parseInt(progress),
                reason
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            onSuccess();
            onClose();
        } catch (error) {
            console.error('Failed to override progress:', error);
            alert('Failed to override progress. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-900 dark:border-gray-800 rounded-xl shadow-xl max-w-md w-full overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className="bg-amber-50 px-6 py-4 border-b border-amber-100 flex justify-between items-center">
                    <h3 className="font-bold text-amber-900 flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5" /> Override Project Progress
                    </h3>
                    <button onClick={onClose} className="text-amber-700 hover:bg-amber-100 p-1 rounded">
                        ✕
                    </button>
                </div>
                
                <form onSubmit={handleSubmit} className="p-6">
                    <div className="mb-6">
                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                            Manual Progress Percentage
                        </label>
                        <div className="flex items-center gap-4">
                            <input 
                                type="range" 
                                min="0" 
                                max="100" 
                                value={progress} 
                                onChange={(e) => setProgress(e.target.value)}
                                className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-amber-600"
                            />
                            <span className="text-2xl font-bold text-gray-900 dark:text-white w-16 text-right">{progress}%</span>
                        </div>
                    </div>

                    <div className="mb-6">
                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                            Reason for Override <span className="text-red-500">*</span>
                        </label>
                        <textarea 
                            required
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            placeholder="Explain why you are manually overriding the calculated progress..."
                            className="w-full h-32 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-sm"
                            minLength={10}
                        />
                        <p className="text-xs text-amber-600 mt-2 flex items-start gap-1">
                            <Shield className="w-3 h-3 mt-0.5 shrink-0" />
                            <strong>Transparency Note:</strong> This reason will be visible to the client on their dashboard to maintain trust.
                        </p>
                    </div>

                    <div className="flex gap-3 justify-end">
                        <button 
                            type="button" 
                            onClick={onClose}
                            className="px-4 py-2 text-gray-600 dark:text-gray-400 font-bold hover:bg-gray-50 dark:bg-[#050505] rounded-lg transition-colors"
                        >
                            Cancel
                        </button>
                        <button 
                            type="submit" 
                            disabled={loading}
                            className="px-4 py-2 bg-amber-600 text-white font-bold rounded-lg hover:bg-amber-700 transition-colors shadow-sm disabled:opacity-50"
                        >
                            {loading ? 'Saving...' : 'Confirm Override'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProgressOverrideModal;
