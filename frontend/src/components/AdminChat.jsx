import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, Send, Paperclip, FileText, X } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const AdminChat = () => {
  const { user: currentUser } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [selectedChatUser, setSelectedChatUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [attachments, setAttachments] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [loading, setLoading] = useState(true);

  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || '';

  useEffect(() => {
    fetchConversations();
    const interval = setInterval(fetchConversations, 15000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (selectedChatUser) {
        fetchMessages(selectedChatUser);
    }
  }, [selectedChatUser]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchConversations = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${BACKEND_URL}/api/messages/admin/conversations`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setConversations(res.data.conversations);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching conversations:', error);
      setLoading(false);
    }
  };

  const fetchMessages = async (targetUserId) => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${BACKEND_URL}/api/messages/admin/${targetUserId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessages(res.data.messages);
    } catch (error) {
      console.error('Error fetching chat:', error);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if ((!inputText.trim() && attachments.length === 0) || !selectedChatUser) return;

    const payload = {
      content: inputText,
      receiverId: selectedChatUser,
      attachments: attachments
    };

    const optimisticMsg = {
      id: Date.now().toString(),
      content: inputText,
      senderId: currentUser.id,
      receiverId: selectedChatUser,
      attachments: attachments,
      createdAt: new Date().toISOString(),
      sender: { ...currentUser }
    };

    setMessages(prev => [...prev, optimisticMsg]);
    setInputText('');
    setAttachments([]);

    try {
      const token = localStorage.getItem('token');
      await axios.post(`${BACKEND_URL}/api/messages`, payload, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchMessages(selectedChatUser);
    } catch (error) {
      console.error('Failed to send:', error);
      alert('Failed to send message');
    }
  };

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
        uploadedUrls.push(res.data.file.url);
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

  return (
    <div className="bg-white dark:bg-gray-900 dark:border-gray-800 rounded-2xl shadow-sm border border-gray-200 overflow-hidden h-[calc(100vh-220px)] flex">
        {/* Sidebar List */}
        <div className="w-80 border-r border-gray-200 flex flex-col bg-gray-50 dark:bg-gray-800 dark:border-gray-700/50">
          <div className="p-4 border-b border-gray-200">
             <h2 className="font-semibold text-gray-700 dark:text-gray-300">Inbox</h2>
          </div>
          <div className="flex-1 overflow-y-auto">
            {conversations.length === 0 ? (
                <div className="p-8 text-center text-gray-400 text-sm">No conversations yet.</div>
            ) : conversations.map((chat) => (
              <button
                key={chat.user.id}
                onClick={() => setSelectedChatUser(chat.user.id)}
                className={`w-full p-4 flex items-start gap-3 hover:bg-white dark:bg-gray-900 dark:border-gray-800 transition-colors text-left border-b border-gray-100 ${
                  selectedChatUser === chat.user.id ? 'bg-white dark:bg-gray-900 dark:border-gray-800 border-l-4 border-l-brand-blue shadow-sm' : ''
                }`}
              >
                <div className="relative flex-shrink-0">
                  <img 
                    src={chat.user.avatarUrl || `https://ui-avatars.com/api/?name=${chat.user.name}&background=random`} 
                    alt={chat.user.name} 
                    className="w-10 h-10 rounded-full" 
                  />
                  {chat.unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full shadow-sm">
                          {chat.unreadCount}
                      </span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className={`text-sm font-semibold truncate ${selectedChatUser === chat.user.id ? 'text-brand-blue' : 'text-gray-900 dark:text-white'}`}>
                      {chat.user.name}
                    </span>
                    <span className="text-xs text-gray-400 flex-shrink-0">
                         {new Date(chat.lastMessage.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 truncate mb-1">
                    {chat.lastMessage.content}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col bg-white dark:bg-black">
           {selectedChatUser ? (
             <>
                 <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-white dark:bg-gray-900 dark:border-gray-800">
                    <div className="flex items-center gap-3">
                         <h3 className="font-bold text-gray-900 dark:text-white">
                             {conversations.find(c => c.user.id === selectedChatUser)?.user.name}
                         </h3>
                    </div>
                 </div>

                 <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-[#050505]/30">
                    {messages.map((msg) => {
                        const isMe = msg.senderId === currentUser?.id;
                        return (
                            <div key={msg.id} className={`flex gap-3 ${isMe ? 'flex-row-reverse' : ''}`}>
                                <div className={`max-w-[70%] ${isMe ? 'items-end' : 'items-start'}`}>
                                     {msg.attachments && Array.isArray(msg.attachments) && msg.attachments.length > 0 && (
                                       <div className={`mb-2 space-y-2 ${isMe ? 'flex flex-col items-end' : ''}`}>
                                          {msg.attachments.map((url, idx) => (
                                             <div key={idx} className="bg-white dark:bg-gray-900 dark:border-gray-800 p-2 rounded-lg border border-gray-200">
                                                {renderAttachment(url)}
                                             </div>
                                          ))}
                                       </div>
                                    )}

                                    <div className={`p-3 rounded-2xl ${
                                        isMe 
                                          ? 'bg-brand-blue text-white rounded-br-none' 
                                          : 'bg-white dark:bg-gray-900 dark:border-gray-800 border border-gray-200 text-gray-800 dark:text-gray-50 rounded-bl-none shadow-sm'
                                      }`}>
                                        <p className="text-sm">{msg.content}</p>
                                    </div>
                                    <span className="text-[10px] text-gray-400 mt-1 block text-right">
                                      {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                </div>
                            </div>
                        )
                    })}
                    <div ref={messagesEndRef} />
                 </div>

                 <div className="p-4 border-t border-gray-200 bg-white dark:bg-gray-900 dark:border-gray-800">
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

                     <form onSubmit={handleSendMessage} className="flex gap-2">
                        <button
                           type="button"
                           onClick={() => fileInputRef.current?.click()}
                           className="p-2 text-gray-400 hover:bg-gray-100 dark:bg-[#0a0a0c] rounded-full"
                        >
                            <Paperclip className="w-5 h-5" />
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
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            className="flex-1 bg-gray-100 dark:bg-gray-800 dark:border-gray-700 border-0 rounded-lg px-4 focus:ring-2 focus:ring-brand-blue"
                            placeholder="Type a reply..."
                        />
                        <button 
                            type="submit"
                            disabled={!inputText.trim() && attachments.length === 0}
                            className="p-2 bg-brand-blue text-white rounded-lg hover:opacity-90 disabled:opacity-50"
                        >
                            <Send className="w-5 h-5" />
                        </button>
                     </form>
                 </div>
             </>
           ) : (
              <div className="flex items-center justify-center h-full text-gray-400">
                  Select a conversation to start chatting
              </div>
           )}
        </div>
    </div>
  );
};

export default AdminChat;
