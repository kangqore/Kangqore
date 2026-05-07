import React, { useState, useEffect } from 'react';
import { Mail, MessageSquare, Clock, CheckCircle, XCircle, Search, User, Phone } from 'lucide-react';
import axios from 'axios';
import DashboardLayout from '../../components/DashboardLayout';
import AdminChat from '../../components/AdminChat'; // NEW

const ContactsManagement = () => {
  const [activeTab, setActiveTab] = useState('messages'); // 'messages' | 'chats'
  
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedContact, setSelectedContact] = useState(null);
  const [stats, setStats] = useState(null);

  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5050';
 // Restart 123


  useEffect(() => {
    if (activeTab === 'messages') {
        fetchContacts();
        fetchStats();
    }
  }, [filter, activeTab]);

  const fetchContacts = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      let url = `${BACKEND_URL}/api/contact?inquiryType=General Inquiry,Media,Alumni,Career Seekers,Investor Relations`;
      if (filter !== 'all') {
        url += `&status=${filter.toUpperCase()}`;
      }

      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setContacts(response.data.contacts || []);
    } catch (error) {
      console.error('Error fetching contacts:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${BACKEND_URL}/api/contact/stats`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStats(response.data.stats);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  // ... (Update Status, Get Status Color helper functions remain same)
  const updateStatus = async (id, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(
        `${BACKEND_URL}/api/contact/${id}`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchContacts();
      fetchStats();
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      NEW: 'bg-blue-100 text-blue-700',
      IN_PROGRESS: 'bg-yellow-100 text-yellow-700',
      REPLIED: 'bg-green-100 text-green-700',
      CLOSED: 'bg-gray-100 text-gray-700'
    };
    return colors[status] || 'bg-gray-100 text-gray-700';
  };

  const filteredContacts = contacts.filter(c =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.subject?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <DashboardLayout role="admin" title="Communications" subtitle="Manage contact inquiries and client chats">
      
      {/* Tabs */}
      <div className="flex gap-4 border-b border-gray-200 mb-6">
        <button 
          onClick={() => setActiveTab('messages')}
          className={`pb-3 px-1 text-sm font-medium transition-colors border-b-2 ${
            activeTab === 'messages' 
              ? 'border-brand-blue text-brand-blue' 
              : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-300'
          }`}
        >
           <div className="flex items-center gap-2">
             <Mail className="w-4 h-4" />
             <span>Form Submissions</span>
           </div>
        </button>
        <button 
          onClick={() => setActiveTab('chats')}
          className={`pb-3 px-1 text-sm font-medium transition-colors border-b-2 ${
            activeTab === 'chats' 
              ? 'border-brand-blue text-brand-blue' 
              : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-300'
          }`}
        >
           <div className="flex items-center gap-2">
             <MessageSquare className="w-4 h-4" />
             <span>Client Chats</span>
           </div>
        </button>
      </div>

      {activeTab === 'chats' ? (
         <AdminChat />
      ) : (
        <>
          {/* Stats Cards */}
          {stats && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-white dark:bg-gray-900 dark:border-gray-800 rounded-xl p-4 shadow-sm border border-gray-100">
                <p className="text-sm text-gray-500 mb-1">Total</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
              </div>
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 shadow-sm border border-blue-100">
                <p className="text-sm text-blue-700 mb-1">New</p>
                <p className="text-2xl font-bold text-blue-900">{stats.new}</p>
              </div>
              <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-xl p-4 shadow-sm border border-yellow-100">

            <p className="text-sm text-yellow-700 mb-1">In Progress</p>
            <p className="text-2xl font-bold text-yellow-900">{stats.inProgress}</p>
          </div>
          <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-4 shadow-sm border border-green-100">
            <p className="text-sm text-green-700 mb-1">Replied</p>
            <p className="text-2xl font-bold text-green-900">{stats.replied}</p>
          </div>
        </div>
      )}

      {/* Filters and Search */}
      <div className="bg-white dark:bg-gray-900 dark:border-gray-800 rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, email, or subject..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-brand-blue"
            />
          </div>

          {/* Status Filter */}
          <div className="flex gap-2">
            {['all', 'new', 'in_progress', 'replied', 'closed'].map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-3 py-1.5 text-sm font-medium rounded-lg capitalize ${
                  filter === status
                    ? 'bg-brand-blue text-white'
                    : 'bg-gray-50 dark:bg-[#050505] text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:bg-[#0a0a0c]'
                }`}
              >
                {status.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>
      </div>

        {/* Contacts Table */}
        <div className="bg-white dark:bg-gray-900 dark:border-gray-800 rounded-xl shadow-sm overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-blue"></div>
            </div>
          ) : filteredContacts.length === 0 ? (
            <div className="text-center py-12">
              <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No contact submissions found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-800 dark:border-gray-700 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contact
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Subject
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Message Preview
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-black divide-y divide-gray-200">
                  {filteredContacts.map((contact) => (
                    <tr key={contact.id} className="hover:bg-gray-50 dark:bg-[#050505]">
                      <td className="px-6 py-4">
                        <div>
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4 text-gray-400" />
                            <p 
                              className="font-medium text-gray-900 dark:text-white hover:text-brand-blue cursor-pointer transition-colors"
                              onClick={() => setSelectedContact(contact)}
                            >
                              {contact.name}
                            </p>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                            <Mail className="w-4 h-4" />
                            {contact.email}
                          </div>
                          {contact.phone && (
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                              <Phone className="w-4 h-4" />
                              {contact.phone}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-900 dark:text-white">
                        {contact.subject || <span className="text-gray-400">No subject</span>}
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-gray-900 dark:text-white truncate max-w-xs">
                          {contact.message.substring(0, 80)}...
                        </p>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {new Date(contact.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(contact.status)}`}>
                          {contact.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => setSelectedContact(contact)}
                            className="text-brand-blue hover:text-blue-800 text-sm font-medium"
                          >
                            View
                          </button>
                          {contact.status === 'NEW' && (
                            <button
                              onClick={() => updateStatus(contact.id, 'IN_PROGRESS')}
                              className="text-yellow-600 hover:text-yellow-800 text-sm font-medium"
                            >
                              Start
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Detail Modal */}
        {selectedContact && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-900 dark:border-gray-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Contact Message</h2>
                  <button
                    onClick={() => setSelectedContact(null)}
                    className="text-gray-400 hover:text-gray-600 dark:text-gray-400"
                  >
                    <XCircle className="w-6 h-6" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Name</label>
                      <p className="text-gray-900 dark:text-white font-medium">{selectedContact.name}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Email</label>
                      <p className="text-gray-900 dark:text-white">{selectedContact.email}</p>
                    </div>
                  </div>

                  {selectedContact.phone && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">Phone</label>
                      <p className="text-gray-900 dark:text-white">{selectedContact.phone}</p>
                    </div>
                  )}

                  {selectedContact.subject && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">Subject</label>
                      <p className="text-gray-900 dark:text-white font-medium">{selectedContact.subject}</p>
                    </div>
                  )}

                  <div>
                    <label className="text-sm font-medium text-gray-500">Message</label>
                    <div className="mt-2 p-4 bg-gray-50 dark:bg-[#050505] rounded-lg">
                      <p className="text-gray-900 dark:text-white whitespace-pre-wrap">{selectedContact.message}</p>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-500 mb-2 block">Quick Actions</label>
                    <div className="flex gap-3">
                      <a
                        href={`mailto:${selectedContact.email}?subject=Re: ${selectedContact.subject || 'Inquiry'}&body=Hi ${selectedContact.name},\n\nThank you for reaching out regarding ${selectedContact.subject || 'your inquiry'}.`}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-900/20 text-brand-blue rounded-lg font-medium hover:bg-blue-100 transition-colors"
                      >
                        <Mail className="w-4 h-4" />
                        Reply Only
                      </a>
                      <button
                        onClick={() => {
                          if (window.confirm('Are you sure you want to reject this contact?')) {
                            updateStatus(selectedContact.id, 'CLOSED');
                            setSelectedContact(null);
                          }
                        }}
                        className="flex items-center gap-2 px-4 py-2 bg-red-50 dark:bg-red-900/20 text-red-600 rounded-lg font-medium hover:bg-red-100 transition-colors"
                      >
                        <XCircle className="w-4 h-4" />
                        Reject
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-500">Status</label>
                    <div className="flex gap-2 mt-2">
                      {['NEW', 'IN_PROGRESS', 'REPLIED', 'CLOSED'].map((status) => (
                        <button
                          key={status}
                          onClick={() => {
                            updateStatus(selectedContact.id, status);
                            setSelectedContact(null);
                          }}
                          className={`px-4 py-2 rounded-lg font-medium text-sm ${
                            selectedContact.status === status
                              ? getStatusColor(status)
                              : 'bg-gray-100 dark:bg-[#0a0a0c] text-gray-700 dark:text-gray-300 hover:bg-gray-200'
                          }`}
                        >
                          {status.replace('_', ' ')}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="text-xs text-gray-500">
                    <p>Received: {new Date(selectedContact.createdAt).toLocaleString()}</p>
                    <p>Source: {selectedContact.source || 'contact-page'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </>
    )}
    </DashboardLayout>
  );
};

export default ContactsManagement;
