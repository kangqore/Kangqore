import React, { useState } from 'react';
import { 
    X, CheckCircle, AlertTriangle, HelpCircle, Loader2, 
    Type, AlignLeft, Flag, Target, Zap, ArrowRight 
} from 'lucide-react';

const CreateChangeRequestModal = ({ isOpen, onClose, onSubmit, isLoading }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'MEDIUM',
    type: 'FEATURE',
    expectations: ''
  });

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const getPriorityColor = (p) => {
      switch(p) {
          case 'LOW': return 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100 ring-emerald-500';
          case 'MEDIUM': return 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100 ring-blue-500';
          case 'HIGH': return 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100 ring-amber-500';
          case 'CRITICAL': return 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100 ring-red-500';
          default: return 'bg-gray-50 text-gray-700 border-gray-200 ring-gray-400';
      }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white dark:bg-gray-900 dark:border-gray-800 rounded-2xl w-full max-w-lg shadow-2xl border border-white/20 overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-300">
        
        {/* Premium Header */}
        <div className="px-6 py-5 border-b border-white/10 flex justify-between items-center bg-brand-gradient relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none overflow-hidden"></div>
          
          <div className="flex items-center gap-3 relative z-10">
              <div className="p-2 bg-white dark:bg-gray-900 dark:border-gray-800/20 backdrop-blur-md rounded-lg text-white shadow-inner border border-white/10">
                <Zap className="w-5 h-5 fill-current" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white leading-tight">New Change Request</h2>
                <p className="text-xs text-blue-50 font-medium opacity-90">Define scope, rationale, and impact</p>
              </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white dark:bg-black/20 text-blue-50 hover:text-white transition-all active:scale-95 relative z-10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Area */}
        <div className="overflow-y-auto custom-scrollbar flex-1 bg-gray-50 dark:bg-[#050505]/30">
            <form id="cr-form" onSubmit={handleSubmit} className="p-6 space-y-6">
            
            {/* Title & Type */}
            <div className="grid grid-cols-12 gap-5">
                <div className="col-span-8 space-y-1.5">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5 ml-1">
                        <Type className="w-3.5 h-3.5 text-blue-500" /> Request Title
                    </label>
                    <input
                        type="text"
                        name="title"
                        required
                        autoFocus
                        value={formData.title}
                        onChange={handleChange}
                        placeholder="e.g., Salesforce Integration V2"
                        className="w-full px-4 py-3 text-sm rounded-xl border border-gray-200 bg-white dark:bg-gray-900 dark:border-gray-800 shadow-sm focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all placeholder:text-gray-300 font-medium text-gray-900 dark:text-white"
                    />
                </div>
                
                <div className="col-span-4 space-y-1.5">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5 ml-1">
                        <Target className="w-3.5 h-3.5 text-purple-500" /> Type
                    </label>
                    <div className="relative group">
                        <select
                            name="type"
                            value={formData.type}
                            onChange={handleChange}
                            className="w-full pl-3 pr-8 py-3 text-sm rounded-xl border border-gray-200 bg-white dark:bg-gray-900 dark:border-gray-800 shadow-sm focus:ring-4 focus:ring-purple-100 focus:border-purple-500 outline-none transition-all appearance-none font-medium text-gray-900 dark:text-white cursor-pointer hover:border-purple-200"
                        >
                            <option value="FEATURE">Feature</option>
                            <option value="INFRASTRUCTURE">Infra</option>
                            <option value="DESIGN">Design</option>
                            <option value="BUG">Bug Fix</option>
                            <option value="OTHER">Other</option>
                        </select>
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 group-hover:text-purple-500 transition-colors">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                        </div>
                    </div>
                </div>
            </div>

            {/* Priority */}
            <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5 ml-1">
                    <Flag className="w-3.5 h-3.5 text-amber-500" /> Priority Level
                </label>
                <div className="grid grid-cols-4 gap-3">
                    {['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'].map((p) => {
                        const isActive = formData.priority === p;
                        const baseColor = getPriorityColor(p);
                        
                        return (
                        <label 
                            key={p} 
                            className={`
                                cursor-pointer rounded-xl py-2.5 flex flex-col items-center justify-center transition-all duration-300 relative overflow-hidden group border shadow-sm
                                ${isActive ? `ring-2 ring-offset-2 ring-offset-white ${baseColor.split(' ').pop()} ${baseColor}` : 'bg-white dark:bg-gray-900 dark:border-gray-800 border-gray-100 text-gray-400 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-600 dark:text-gray-400'}
                            `}
                        >
                            <input 
                                type="radio" 
                                name="priority" 
                                value={p} 
                                checked={isActive} 
                                onChange={handleChange}
                                className="hidden" 
                            />
                            <span className={`text-[10px] font-black tracking-wide ${isActive ? '' : 'font-bold'}`}>{p}</span>
                            {isActive && <div className="absolute inset-0 bg-current opacity-[0.05]" />}
                        </label>
                    )})}
                </div>
            </div>

            {/* Description */}
            <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5 ml-1">
                    <AlignLeft className="w-3.5 h-3.5 text-gray-400" /> Description & Rationale
                </label>
                <textarea
                name="description"
                required
                rows={2}
                value={formData.description}
                onChange={handleChange}
                placeholder="Why is this change necessary? What problem does it solve?"
                className="w-full px-4 py-3 text-sm rounded-xl border border-gray-200 bg-white dark:bg-gray-900 dark:border-gray-800 shadow-sm focus:ring-4 focus:ring-gray-100 focus:border-gray-400 outline-none transition-all resize-none placeholder:text-gray-300 leading-relaxed"
                />
            </div>

            {/* Business Expectations */}
            <div className="space-y-1.5">
                <div className="flex items-center justify-between ml-1">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-500" /> Acceptance Criteria
                    </label>
                    <div className="group relative">
                        <HelpCircle className="w-3.5 h-3.5 text-gray-300 hover:text-blue-500 cursor-help transition-colors" />
                        <div className="absolute bottom-full right-0 mb-2 w-64 p-3 bg-gray-900 text-white text-[10px] leading-relaxed rounded-xl opacity-0 group-hover:opacity-100 transition-all transform translate-y-1 group-hover:translate-y-0 pointer-events-none z-50 shadow-xl border border-gray-700">
                            List specific conditions that must be met for this change to be considered complete.
                            <div className="absolute -bottom-1 right-1 w-2 h-2 bg-gray-900 rotate-45 border-r border-b border-gray-700"></div>
                        </div>
                    </div>
                </div>
                <textarea
                name="expectations"
                rows={2}
                value={formData.expectations}
                onChange={handleChange}
                placeholder="e.g., System must handle 10k concurrent users..."
                className="w-full px-4 py-3 text-sm rounded-xl border border-gray-200 bg-white dark:bg-gray-900 dark:border-gray-800 shadow-sm focus:ring-4 focus:ring-emerald-50 focus:border-emerald-500 outline-none transition-all resize-none placeholder:text-gray-300"
                />
            </div>

            {/* Warning Note */}
            <div className="bg-amber-50/80 border border-amber-100 rounded-xl p-4 flex gap-3 items-start shadow-sm ring-1 ring-amber-500/5">
                <div className="p-1.5 bg-amber-100 rounded-lg text-amber-600 mt-0.5 shadow-sm">
                    <AlertTriangle className="w-3.5 h-3.5" />
                </div>
                <div className="text-xs text-amber-900/80 leading-relaxed">
                    <span className="font-bold text-amber-900 block mb-0.5">Impact Analysis Required</span>
                    Submitting this request will auto-trigger a <strong>Budget & Timeline</strong> assessment by the governance team.
                </div>
            </div>

            </form>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 dark:bg-gray-800 dark:border-gray-700 flex items-center justify-between gap-3">
             <button
                type="button"
                onClick={onClose}
                disabled={isLoading}
                className="text-xs font-bold text-gray-500 hover:text-gray-800 dark:text-gray-50 transition-colors px-4 py-2 hover:bg-gray-100 dark:bg-[#0a0a0c] rounded-lg"
            >
                Cancel
            </button>
            <button
                type="submit"
                form="cr-form"
                disabled={isLoading}
                className="relative overflow-hidden group px-6 py-2.5 rounded-xl bg-brand-gradient text-white text-xs font-bold hover:shadow-lg transition-all active:scale-95 flex items-center gap-2"
            >
                <div className="absolute inset-0 bg-white dark:bg-black/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                {isLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin relative z-10" /> : <div className="relative z-10 flex items-center gap-2">Submit Request <ArrowRight className="w-3.5 h-3.5" /></div>}
            </button>
        </div>

      </div>
    </div>
  );
};

export default CreateChangeRequestModal;
