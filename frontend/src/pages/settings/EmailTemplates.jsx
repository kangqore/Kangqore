import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Mail, Loader2, Save, Trash2, CheckCircle2 } from 'lucide-react';
import { useToast } from '../../hooks/use-toast';

const TEMPLATE_TYPES = [
  { value: 'CONFIRMATION', label: 'Booking Confirmation' },
  { value: 'REMINDER_24H', label: '24 Hour Reminder' },
  { value: 'REMINDER_1H', label: '1 Hour Reminder' },
  { value: 'CANCELLATION', label: 'Cancellation Notice' }
];

const AVAILABLE_VARIABLES = [
  '{{invitee_name}}',
  '{{event_name}}',
  '{{date}}',
  '{{time}}',
  '{{join_url}}',
  '{{host_name}}'
];

export default function EmailTemplates() {
  const { toast } = useToast();
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [selectedType, setSelectedType] = useState('CONFIRMATION');
  const [subject, setSubject] = useState('');
  const [bodyHtml, setBodyHtml] = useState('');

  useEffect(() => {
    fetchTemplates();
  }, []);

  useEffect(() => {
    // When selected type changes, populate form with existing template if any
    const existing = templates.find(t => t.type === selectedType && !t.eventTypeId);
    if (existing) {
      setSubject(existing.subject);
      setBodyHtml(existing.bodyHtml);
    } else {
      setSubject('');
      setBodyHtml('');
    }
  }, [selectedType, templates]);

  const fetchTemplates = async () => {
    try {
      const token = localStorage.getItem('token');
      const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5050';
      const res = await axios.get(`${BACKEND_URL}/api/scheduling/email-templates`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) {
        setTemplates(res.data.templates);
      }
    } catch (err) {
      console.error(err);
      toast({ title: 'Error', description: 'Failed to load templates', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!subject || !bodyHtml) {
      toast({ title: 'Error', description: 'Subject and body are required', variant: 'destructive' });
      return;
    }

    setSaving(true);
    try {
      const token = localStorage.getItem('token');
      const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5050';
      const res = await axios.post(`${BACKEND_URL}/api/scheduling/email-templates`, {
        type: selectedType,
        subject,
        bodyHtml
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) {
        toast({ title: 'Success', description: 'Template saved successfully' });
        fetchTemplates();
      }
    } catch (err) {
      console.error(err);
      toast({ title: 'Error', description: err.response?.data?.error || 'Failed to save template', variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    const existing = templates.find(t => t.type === selectedType && !t.eventTypeId);
    if (!existing) return;

    if (!window.confirm('Are you sure you want to reset this template to the system default?')) return;

    setSaving(true);
    try {
      const token = localStorage.getItem('token');
      const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5050';
      const res = await axios.delete(`${BACKEND_URL}/api/scheduling/email-templates/${existing.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) {
        toast({ title: 'Success', description: 'Template reset to default' });
        fetchTemplates();
      }
    } catch (err) {
      console.error(err);
      toast({ title: 'Error', description: 'Failed to reset template', variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  const insertVariable = (variable) => {
    setBodyHtml(prev => prev + variable);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-brand-blue" />
      </div>
    );
  }

  const existingTemplate = templates.find(t => t.type === selectedType && !t.eventTypeId);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
          <Mail className="w-6 h-6 text-brand-blue" />
          Email Templates
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2">
          Customize the emails sent to your invitees. Global templates apply to all event types.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-1 space-y-2">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Email Type</h3>
          {TEMPLATE_TYPES.map(type => (
            <button
              key={type.value}
              onClick={() => setSelectedType(type.value)}
              className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all flex items-center justify-between ${
                selectedType === type.value
                  ? 'bg-brand-blue text-white shadow-md'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              {type.label}
              {templates.find(t => t.type === type.value && !t.eventTypeId) && (
                <CheckCircle2 className="w-4 h-4 opacity-75" />
              )}
            </button>
          ))}
        </div>

        <div className="md:col-span-3 bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-gray-900 dark:text-white text-lg">
              {TEMPLATE_TYPES.find(t => t.value === selectedType)?.label}
            </h3>
            {existingTemplate && (
              <span className="px-3 py-1 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 rounded-full text-xs font-bold uppercase tracking-wider">
                Customized
              </span>
            )}
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Subject</label>
              <input
                type="text"
                value={subject}
                onChange={e => setSubject(e.target.value)}
                className="w-full px-4 py-2 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-brand-blue outline-none transition-all dark:text-white"
                placeholder="e.g. Confirmed: {{event_name}} on {{date}}"
              />
            </div>

            <div>
              <div className="flex justify-between items-end mb-1">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">HTML Body</label>
                <div className="flex gap-2 text-xs">
                  {AVAILABLE_VARIABLES.map(v => (
                    <button
                      key={v}
                      onClick={() => insertVariable(v)}
                      className="px-2 py-1 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded text-gray-600 dark:text-gray-300 font-mono transition-colors"
                    >
                      {v}
                    </button>
                  ))}
                </div>
              </div>
              <textarea
                value={bodyHtml}
                onChange={e => setBodyHtml(e.target.value)}
                rows={12}
                className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-brand-blue outline-none transition-all font-mono text-sm dark:text-white"
                placeholder="<p>Hi {{invitee_name}},</p><p>Your meeting {{event_name}} is confirmed.</p>"
              />
              <p className="text-xs text-gray-500 mt-2">
                Note: You can use HTML tags to format your email. The system default template will be used if you leave this blank or reset it.
              </p>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-700">
            {existingTemplate && (
              <button
                onClick={handleDelete}
                disabled={saving}
                className="px-4 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl font-medium transition-colors flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Reset to Default
              </button>
            )}
            <button
              onClick={handleSave}
              disabled={saving || !subject || !bodyHtml}
              className="px-6 py-2 bg-brand-blue text-white rounded-xl font-medium shadow-md shadow-brand-blue/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-2 disabled:opacity-50 disabled:pointer-events-none"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Save Template
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
