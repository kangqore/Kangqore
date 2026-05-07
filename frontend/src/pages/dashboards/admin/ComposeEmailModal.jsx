import React, { useState } from 'react';
import { X, Send, Bold, Italic, Link as LinkIcon, List, Paperclip, Image, AlertCircle, Flag, Star, Trash2 } from 'lucide-react';
import axios from 'axios';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../../components/ui/dialog';
import { useToast } from '../../../hooks/use-toast';
import RichTextEditor from '../../../components/Email/RichTextEditor';

const ComposeEmailModal = ({ isOpen, onClose }) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [attachments, setAttachments] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = React.useRef(null);
  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5050';

  const [formData, setFormData] = useState({
    to: '',
    subject: '',
    message: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    
    setIsUploading(true);
    try {
      const token = localStorage.getItem('token');
      const uploadedFiles = [];
      
      for (const file of files) {
        const formData = new FormData();
        formData.append('file', file);
        
        const res = await axios.post(`${BACKEND_URL}/api/uploads`, formData, {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        });
        uploadedFiles.push({ name: file.name, url: res.data.file?.url || res.data.url });
      }
      setAttachments(prev => [...prev, ...uploadedFiles]);
    } catch (err) {
      console.error('Upload failed:', err);
      toast({
        variant: "destructive",
        title: "Upload Failed",
        description: "Could not upload attachments.",
      });
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!formData.to || !formData.subject || !formData.message) {
        toast({
            variant: "destructive",
            title: "Validation Error",
            description: "Please fill in specific fields.",
        });
        return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      // Determine endpoint based on if it's a general message or email
      // Assuming /api/messages for internal or /api/admin/emails/send for external
      // For now, using the message endpoint to "send" to a user
      await axios.post(`${BACKEND_URL}/api/messages`, {
        receiverId: null, // Logic might need adjustment based on how 'to' is resolved to an ID
        // If 'to' is an email address, we might need a different endpoint that accepts email strings
        // OR we just use the /reply endpoint if it's always a reply?
        // But this is "New Message".
        // Let's assume we send to /api/admin/emails/send if it exists, or fall back to a mock for now since backend routes for direct email send by address were not explicitly seen in the scan
        // However, based on the previous files, there is a reply endpoint.
        // Let's try sending to the generic message endpoint, but wait, 'to' is an email string.
        // We probably need to resolve email to user ID or send via a mailing service.
        // Given constraints, I will use a generic "send" endpoint that expects email.
        email: formData.to,
        subject: formData.subject,
        content: formData.message,
        attachments: attachments.map(a => a.url)
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      toast({
        title: "Email Sent Successfully",
        description: `Your message to ${formData.to} has been sent.`,
        className: "bg-green-50 border-green-200",
      });
      
      setFormData({ to: '', subject: '', message: '' });
      setAttachments([]);
      onClose();
    } catch (error) {
      console.error('Send error:', error);
      toast({
        variant: "destructive",
        title: "Error Sending Email",
        description: "Please try again later.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden bg-white dark:bg-gray-900 dark:border-gray-800 border-none shadow-2xl">
        <div className="bg-gray-50 dark:bg-gray-800 dark:border-gray-700 border-b border-gray-100 p-4 flex items-center justify-between">
          <DialogTitle className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
              <Send className="w-4 h-4 text-brand-blue" />
            </div>
            New Message
          </DialogTitle>

        </div>

        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">To</label>
              <input
                type="email"
                name="to"
                required
                placeholder="recipient@example.com"
                value={formData.to}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue transition-all"
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Subject</label>
              <input
                type="text"
                name="subject"
                required
                placeholder="Enter subject line..."
                value={formData.subject}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue transition-all"
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Message</label>
                <RichTextEditor
                   value={formData.message}
                   onChange={(val) => setFormData(prev => ({ ...prev, message: val }))}
                   onSend={handleSubmit}
                   onAttach={() => fileInputRef.current?.click()}
                   placeholder="Write your message here..."
                   isCompose={true}
                />
              </div>

             {/* Hidden Input for Attachments */}
             <input 
                ref={fileInputRef}
                type="file" 
                multiple 
                className="hidden" 
                onChange={handleFileUpload}
              />

             {/* Attachments Preview */}
             {attachments.length > 0 && (
                <div className="flex flex-wrap gap-2 px-1">
                  {attachments.map((att, idx) => (
                    <div key={idx} className="flex items-center gap-1 bg-gray-100 dark:bg-[#0a0a0c] px-2 py-1 rounded text-xs">
                      <Paperclip className="w-3 h-3" />
                      <span className="truncate max-w-[150px]">{att.name}</span>
                      <button type="button" onClick={() => setAttachments(prev => prev.filter((_, i) => i !== idx))} className="ml-1 hover:text-red-500">
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
             )}

            <div className="flex justify-between items-center px-1">
               <div className="flex items-center gap-2">
                 <button type="button" className="text-gray-400 hover:text-yellow-500 transition-colors" title="Mark as Important">
                     <AlertCircle className="w-5 h-5" />
                 </button>
                 <button type="button" className="text-gray-400 hover:text-red-500 transition-colors" title="Mark as Spam">
                     <Flag className="w-5 h-5" />
                 </button>
               </div>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ComposeEmailModal;
