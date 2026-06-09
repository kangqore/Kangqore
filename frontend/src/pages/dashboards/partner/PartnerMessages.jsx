import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import DashboardLayout from '../../../components/DashboardLayout';
import { MessageSquare, Send, Info, Shield, Paperclip, FileText, X } from 'lucide-react';

const PartnerMessages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [attachments, setAttachments] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || '';

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchMessages = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${BACKEND_URL}/api/partner/messages`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessages(res.data);
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
    // Poll for new messages every 15s
    const interval = setInterval(fetchMessages, 15000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setIsUploading(true);
    try {
      const token = localStorage.getItem('token');
      const uploadedUrls = [];

      for (const file of files) {
        const formData = new FormData();
        formData.append('file', file);

        const res = await axios.post(`${BACKEND_URL}/api/uploads`, formData, {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        });
        uploadedUrls.push(res.data.file?.url || res.data.url);
      }

      setAttachments(prev => [...prev, ...uploadedUrls]);
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Failed to upload file');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const removeAttachment = (index) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const renderAttachment = (url) => {
    const isImage = url.match(/\.(jpeg|jpg|gif|png)$/i);
    const fileName = url.split('/').pop();

    if (isImage) {
      return (
        <a href={url} target="_blank" rel="noopener noreferrer" className="block mt-2">
            <img src={url} alt="attachment" className="max-w-[200px] max-h-[200px] rounded-lg border border-gray-200" />
        </a>
      );
    }
    return (
      <a href={url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 mt-2 p-3 bg-gray-50 dark:bg-gray-800 dark:border-gray-700 rounded-lg border border-gray-200 hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 transition-colors">
        <FileText className="w-5 h-5 text-gray-500" />
        <span className="text-sm text-gray-700 dark:text-gray-300 truncate max-w-[200px]">{fileName}</span>
      </a>
    );
  };

  const handleSendMessage = async () => {
    const finalContent = newMessage.trim() || (attachments.length > 0 ? 'Sent an attachment' : '');
    
    if (!finalContent && attachments.length === 0) return;
    
    setSending(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${BACKEND_URL}/api/partner/messages`, {
        content: finalContent,
        attachments: attachments
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setNewMessage('');
      setAttachments([]);
      fetchMessages(); // Refresh list
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message');
    } finally {
      setSending(false);
    }
  };

  return (
    <DashboardLayout role="partner" title="Messages" subtitle="Coordination with Admin">
      {/* Enterprise Rules Banner */}
      <div className="mb-4 bg-amber-50 border border-amber-100 rounded-xl p-4 flex gap-3 text-amber-800 text-sm">
        <Shield className="w-5 h-5 flex-shrink-0 mt-0.5" />
        <div>
          <strong>Work Notes Only:</strong> This channel is for task clarification, delivery questions, and compliance reminders. Messages are between you and Admin/PM only — no partner-to-partner or partner-to-client communication.
        </div>
      </div>

      <div className="bg-white dark:bg-gray-900 dark:border-gray-800 rounded-2xl shadow-sm border border-gray-100 h-[600px] flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50 dark:bg-gray-800 dark:border-gray-700/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 dark:text-white">Admin Support</h3>
              <p className="text-xs text-gray-500">Project coordination channel</p>
            </div>
          </div>
          <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
            Online
          </span>
        </div>

        {/* Messages List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-[#050505]/30">
          {loading && <div className="text-center py-8 text-gray-400">Loading messages...</div>}
          {!loading && messages.length === 0 && (
            <div className="text-center py-12">
              <MessageSquare className="w-12 h-12 mx-auto text-gray-300 mb-3" />
              <p className="text-gray-500 text-sm">No messages yet. Start a conversation with Admin.</p>
            </div>
          )}
          {messages.map(msg => {
            // Determine if message is from the Partner (Me)
            const isMe = msg.sender?.role === 'PARTNER';
            
            return (
              <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[70%] ${isMe ? 'order-2' : 'order-1'}`}>
                  <div className={`p-3 rounded-2xl ${isMe ? 'bg-emerald-600 text-white rounded-br-sm' : 'bg-white dark:bg-gray-900 dark:border-gray-800 border border-gray-100 text-gray-800 dark:text-gray-50 rounded-bl-sm shadow-sm'}`}>
                    {msg.attachments && Array.isArray(msg.attachments) && msg.attachments.length > 0 && (
                       <div className={`mb-2 space-y-2 ${isMe ? 'flex flex-col items-end' : ''}`}>
                          {msg.attachments.map((url, idx) => (
                             <div key={idx} className="bg-white dark:bg-gray-900 dark:border-gray-800 p-2 rounded-lg border border-gray-200 text-black">
                                {renderAttachment(url)}
                             </div>
                          ))}
                       </div>
                    )}
                    <p className="text-sm">{msg.content}</p>
                  </div>
                  <div className={`flex items-center gap-2 mt-1 ${isMe ? 'justify-end' : 'justify-start'}`}>
                    <span className={`text-[10px] ${isMe ? 'text-gray-400' : 'text-gray-400'}`}>
                      {msg.sender?.name || (isMe ? 'You' : 'Admin')}
                    </span>
                    <span className="text-[10px] text-gray-300">•</span>
                    <span className={`text-[10px] ${isMe ? 'text-gray-400' : 'text-gray-400'}`}>
                      {new Date(msg.createdAt).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 border-t border-gray-100 bg-white dark:bg-gray-900 dark:border-gray-800 rounded-b-2xl">
          {/* Attachment Previews */}
          {attachments.length > 0 && (
            <div className="flex gap-2 mb-3 overflow-x-auto pb-2">
              {attachments.map((url, idx) => (
                <div key={idx} className="relative group shrink-0">
                  <div className="w-16 h-16 bg-gray-50 dark:bg-gray-800 dark:border-gray-700 border border-gray-200 rounded-lg flex items-center justify-center overflow-hidden">
                     {url.match(/\.(jpeg|jpg|gif|png)$/i) ? (
                        <img src={url} alt="preview" className="w-full h-full object-cover" />
                     ) : (
                        <FileText className="w-8 h-8 text-gray-400" />
                     )}
                  </div>
                  <button 
                     onClick={() => removeAttachment(idx)}
                     className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                     <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
          
          <div className="flex gap-2 items-center">
            <button
               disabled={isUploading}
               onClick={() => fileInputRef.current?.click()}
               className="p-3 text-gray-400 hover:text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 rounded-xl transition-colors relative"
               title="Attach file"
            >
              <Paperclip className="w-5 h-5" />
              {isUploading && (
                 <span className="absolute top-0 right-0 w-2 h-2 bg-blue-500 rounded-full animate-ping"></span>
              )}
            </button>
            <input 
               type="file"
               multiple
               ref={fileInputRef}
               className="hidden"
               onChange={handleFileUpload}
            />
            <input 
              type="text" 
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Type a message to Admin..." 
              className="flex-1 bg-gray-50 border-0 rounded-xl px-4 py-3 focus:ring-2 focus:ring-emerald-500 focus:bg-white dark:bg-gray-900 dark:border-gray-800 transition-all"
            />
            <button 
              onClick={handleSendMessage}
              disabled={sending || (!newMessage.trim() && attachments.length === 0)}
              className="p-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};
export default PartnerMessages;

