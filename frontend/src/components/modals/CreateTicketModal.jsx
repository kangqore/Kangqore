import React, { useState } from 'react';
import { X, Send, AlertTriangle, LifeBuoy, Zap } from 'lucide-react';

const CreateTicketModal = ({ isOpen, onClose, onSubmit, isLoading }) => {
  const [formData, setFormData] = useState({
    subject: '',
    category: 'TECHNICAL',
    priority: 'MEDIUM',
    content: ''
  });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    // Reset form
    setFormData({ subject: '', category: 'TECHNICAL', priority: 'MEDIUM', content: '' });
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white dark:bg-gray-900 dark:border-gray-800 w-full max-w-lg rounded-2xl shadow-2xl border border-gray-100 overflow-hidden animate-in zoom-in-95 duration-300">
        <div className="bg-brand-gradient p-6 text-white flex justify-between items-center">
            <div>
                <h2 className="text-xl font-black tracking-tight">Raise Support Ticket</h2>
                <p className="text-blue-100 text-xs mt-1">Our engineering team will respond within SLA</p>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-white dark:bg-black/10 rounded-full transition-colors">
                <X className="w-5 h-5" />
            </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5">Subject</label>
                <input 
                    required
                    type="text" 
                    placeholder="Brief summary of the issue..."
                    className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 dark:border-gray-700 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-blue outline-none text-sm font-medium"
                    value={formData.subject}
                    onChange={(e) => setFormData({...formData, subject: e.target.value})}
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5">Priority</label>
                    <select 
                        className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 dark:border-gray-700 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-blue outline-none text-sm font-bold"
                        value={formData.priority}
                        onChange={(e) => setFormData({...formData, priority: e.target.value})}
                    >
                        <option value="LOW">Low</option>
                        <option value="MEDIUM">Medium</option>
                        <option value="HIGH">High</option>
                        <option value="CRITICAL">Critical</option>
                    </select>
                </div>
                <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5">Category</label>
                    <select 
                        className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 dark:border-gray-700 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-blue outline-none text-sm font-bold"
                        value={formData.category}
                        onChange={(e) => setFormData({...formData, category: e.target.value})}
                    >
                        <option value="TECHNICAL">Technical Issue</option>
                        <option value="BILLING">Billing/Account</option>
                        <option value="FEATURE">Feature Request</option>
                        <option value="SLA">SLA Inquiry</option>
                    </select>
                </div>
            </div>

            <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5">Description</label>
                <textarea 
                    required
                    rows="4"
                    placeholder="Please provide as much detail as possible, including steps to reproduce or account IDs..."
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 dark:border-gray-700 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-blue outline-none text-sm font-medium resize-none"
                    value={formData.content}
                    onChange={(e) => setFormData({...formData, content: e.target.value})}
                ></textarea>
            </div>

            <div className="pt-4 flex gap-3">
                <button 
                    type="button" 
                    onClick={onClose}
                    className="flex-1 px-4 py-3 bg-gray-100 dark:bg-gray-800 dark:border-gray-700 text-gray-600 dark:text-gray-400 text-sm font-bold rounded-xl hover:bg-gray-200 transition-colors"
                >
                    Cancel
                </button>
                <button 
                    type="submit" 
                    disabled={isLoading}
                    className="flex-2 px-8 py-3 bg-brand-gradient text-white text-sm font-black rounded-xl hover:shadow-lg transition-all flex items-center justify-center gap-2 group"
                >
                    {isLoading ? (
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    ) : (
                        <Send className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    )}
                    {isLoading ? "Submitting..." : "Submit Ticket"}
                </button>
            </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTicketModal;
