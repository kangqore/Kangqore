import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  User, Mail, Building2, Linkedin, Github, Twitter, 
  Save, ArrowLeft, Smartphone, MapPin, FileText,
  Shield, CheckCircle, Flag, FolderKanban, Clock, Trash2,
  AlertTriangle, XCircle
} from 'lucide-react';
import axios from 'axios';
import DashboardLayout from '../../components/DashboardLayout';
import { useAuth } from '../../context/AuthContext';

const AdminUserEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [activeTab, setActiveTab] = useState('profile');

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || '';

  const [formData, setFormData] = useState({
    name: '', company: '', phone: '', location: '', purpose: '',
    companyEmail: '', employeeEmail: '', collegeEmail: '',
    linkedin: '', github: '', twitter: '', gmail: '',
    age: '', gender: '', profession: '', role: '', status: '',
    isRedFlagged: false
  });

  useEffect(() => {
    if (currentUser?.role !== 'ADMIN') { navigate('/dashboard/client'); return; }
    fetchUserProfile();
  }, [id]);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(`${BACKEND_URL}/api/admin/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const userData = response.data.user;
      setProfile(userData);
      setFormData({
        name: userData.name || '', company: userData.company || '',
        phone: userData.phone || '', location: userData.location || '',
        purpose: userData.purpose || '', companyEmail: userData.companyEmail || '',
        employeeEmail: userData.employeeEmail || '', collegeEmail: userData.collegeEmail || '',
        linkedin: userData.linkedin || '', github: userData.github || '',
        twitter: userData.twitter || '', gmail: userData.gmail || '',
        age: userData.age || '', gender: userData.gender || '',
        profession: userData.profession || '', role: userData.role || '',
        status: userData.status || '', isRedFlagged: userData.isRedFlagged || false
      });
    } catch (err) {
      setError('Failed to load user profile');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true); setError('');
      const token = localStorage.getItem('token');
      await axios.patch(`${BACKEND_URL}/api/admin/users/${id}/profile`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSuccess('Profile updated successfully');
      setTimeout(() => setSuccess(''), 3000);
      fetchUserProfile();
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteUser = async (hard = false) => {
    const msg = hard ? 'PERMANENTLY DELETE this user?' : 'Mark as inactive?';
    if (!window.confirm(msg)) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${BACKEND_URL}/api/admin/users/${id}?hard=${hard}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      navigate('/dashboard/admin/users');
    } catch (err) { setError('Failed to delete user'); }
  };

  const tabs = [
    { id: 'details', label: 'Profile Details', icon: FileText },
    { id: 'edit', label: 'Edit Profile', icon: User },
    { id: 'activity', label: 'Activity', icon: Clock },
    { id: 'account', label: 'Account', icon: Shield }
  ];

  useEffect(() => {
    // Set default tab to 'details'
    setActiveTab('details');
  }, []);

  if (loading) {
    return <div className="min-h-screen bg-gray-50 dark:bg-[#050505] flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-blue"></div>
    </div>;
  }

  return (
    <DashboardLayout role="admin" title={`Edit: ${profile?.name}`} subtitle="Full admin control over user profile">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Back Navigation & Page Header */}
        <div className="bg-brand-gradient rounded-2xl p-6 text-white shadow-lg">
          <button 
            onClick={() => navigate('/dashboard/admin/users')} 
            className="flex items-center gap-2 text-white/80 hover:text-white mb-4 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" /> Back to User Management
          </button>
          <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold">{profile?.name || 'User Profile'}</h1>
                <p className="text-white/70 mt-1">Viewing profile as Admin • Full edit access</p>
              </div>
              <div className="flex gap-2">
                 <button onClick={() => setActiveTab('edit')} className="px-4 py-2 bg-white dark:bg-black/20 hover:bg-white dark:bg-black/30 rounded-lg text-sm font-medium backdrop-blur-sm transition-colors">
                    Edit Profile
                 </button>
              </div>
          </div>
        </div>

        {error && <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 rounded-xl text-red-700 flex items-center gap-2"><XCircle className="w-5 h-5" />{error}</div>}
        {success && <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 rounded-xl text-green-700 flex items-center gap-2"><CheckCircle className="w-5 h-5" />{success}</div>}

        {/* User Header */}
        <div className="bg-white dark:bg-gray-900 dark:border-gray-800 rounded-2xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 bg-brand-gradient rounded-full flex items-center justify-center text-white text-2xl font-bold relative">
                {profile?.avatarUrl ? <img src={profile.avatarUrl} alt="" className="w-full h-full rounded-full object-cover" /> : profile?.name?.charAt(0)}
                {profile?.isRedFlagged && <div className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center"><Flag className="w-3 h-3 text-white" /></div>}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{profile?.name}</h2>
                <p className="text-sm text-gray-500">{profile?.email}</p>
                <div className="flex gap-2 mt-2">
                  <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${profile?.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : profile?.status === 'SUSPENDED' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}`}>{profile?.status}</span>
                  <span className="px-2.5 py-1 bg-purple-100 text-purple-700 text-xs font-medium rounded-full">{profile?.role}</span>
                  <span className="px-2.5 py-1 bg-gray-100 dark:bg-[#0a0a0c] text-gray-600 dark:text-gray-400 text-xs font-medium rounded-full font-mono">ID: {profile?.customId || profile?.id?.substring(0,8)}</span>
                </div>
              </div>
            </div>
            <div className="text-right text-sm text-gray-500">
               <div className="flex flex-col gap-1">
                  <span className="flex items-center gap-2 justify-end"><Clock className="w-3 h-3" /> Joined {new Date(profile?.createdAt).toLocaleDateString()}</span>
                  <span className="flex items-center gap-2 justify-end"><Shield className="w-3 h-3" /> {profile?.role} Access</span>
                  <span className="flex items-center gap-2 justify-end"><MapPin className="w-3 h-3" /> {profile?.location || 'Location Unknown'}</span>
               </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white dark:bg-gray-900 dark:border-gray-800 rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="flex border-b border-gray-200 overflow-x-auto">
            {tabs.map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-4 text-sm font-medium transition-colors whitespace-nowrap ${activeTab === tab.id ? 'text-brand-blue border-b-2 border-brand-blue bg-blue-50 dark:bg-blue-900/20/50' : 'text-gray-500 hover:text-gray-700 dark:text-gray-300'}`}>
                <tab.icon className="w-4 h-4" />{tab.label}
              </button>
            ))}
          </div>

          <div className="p-8">
            {/* 1. Profile Details (Read Only) */}
            {activeTab === 'details' && (
                <div className="space-y-8 animate-in fade-in duration-300">
                    {/* Key Info Grid */}
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div className="p-4 bg-gray-50 dark:bg-gray-800 dark:border-gray-700 rounded-xl border border-gray-100">
                            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Contact Info</h3>
                            <div className="space-y-3">
                                <div><label className="text-xs text-gray-500 block">Phone</label><p className="font-medium text-gray-900 dark:text-white">{profile?.phone || '--'}</p></div>
                                <div><label className="text-xs text-gray-500 block">Personal Email</label><p className="font-medium text-gray-900 dark:text-white">{profile?.gmail || '--'}</p></div>
                                <div><label className="text-xs text-gray-500 block">Company Email</label><p className="font-medium text-gray-900 dark:text-white">{profile?.companyEmail || '--'}</p></div>
                            </div>
                        </div>
                         <div className="p-4 bg-gray-50 dark:bg-gray-800 dark:border-gray-700 rounded-xl border border-gray-100">
                            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Professional</h3>
                            <div className="space-y-3">
                                <div><label className="text-xs text-gray-500 block">Company</label><p className="font-medium text-gray-900 dark:text-white">{profile?.company || '--'}</p></div>
                                <div><label className="text-xs text-gray-500 block">Profession/Title</label><p className="font-medium text-gray-900 dark:text-white">{profile?.profession || '--'}</p></div>
                                <div><label className="text-xs text-gray-500 block">Location</label><p className="font-medium text-gray-900 dark:text-white">{profile?.location || '--'}</p></div>
                            </div>
                        </div>
                         <div className="p-4 bg-gray-50 dark:bg-gray-800 dark:border-gray-700 rounded-xl border border-gray-100">
                            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Socials & Links</h3>
                            <div className="space-y-3">
                                 {profile?.linkedin && <a href={profile.linkedin} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-blue-700 hover:underline"><Linkedin className="w-4 h-4" /> LinkedIn Profile</a>}
                                 {profile?.github && <a href={profile.github} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-gray-900 dark:text-white hover:underline"><Github className="w-4 h-4" /> GitHub Profile</a>}
                                 {profile?.twitter && <a href={profile.twitter} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-blue-400 hover:underline"><Twitter className="w-4 h-4" /> Twitter Profile</a>}
                                 {!profile?.linkedin && !profile?.github && !profile?.twitter && <p className="text-gray-400 italic">No social links linked.</p>}
                            </div>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                        <div>
                             <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2"><FileText className="w-5 h-5 text-gray-400" /> Purpose / Bio</h3>
                             <div className="p-5 bg-gray-50 dark:bg-gray-800 dark:border-gray-700 rounded-xl border border-gray-100 text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">
                                {profile?.purpose || profile?.bio || <span className="text-gray-400 italic">No purpose or bio provided.</span>}
                             </div>
                        </div>
                         <div>
                             <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2"><FolderKanban className="w-5 h-5 text-gray-400" /> Recent Files & Deals</h3>
                             {profile?.documents?.length > 0 ? (
                                <div className="space-y-2">
                                    {profile.documents.map((doc, idx) => (
                                        <a key={idx} href={doc} target="_blank" rel="noreferrer" className="flex items-center gap-3 p-3 bg-white dark:bg-gray-900 dark:border-gray-800 border border-gray-200 rounded-lg hover:border-brand-blue hover:shadow-sm transition-all group">
                                            <div className="p-2 bg-blue-50 dark:bg-blue-900/20 text-brand-blue rounded-lg group-hover:bg-brand-blue group-hover:text-white transition-colors"><FileText className="w-4 h-4" /></div>
                                            <div className="flex-1 overflow-hidden">
                                                <p className="font-medium text-gray-900 dark:text-white truncate">Document {idx + 1}</p>
                                                <p className="text-xs text-gray-500">Click to view file</p>
                                            </div>
                                        </a>
                                    ))}
                                </div>
                             ) : (
                                <div className="p-8 border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center text-center">
                                    <FolderKanban className="w-8 h-8 text-gray-300 mb-2" />
                                    <p className="text-gray-500">No files or deals associated.</p>
                                </div>
                             )}
                        </div>
                    </div>
                </div>
            )}

            {/* 2. Edit Profile Details */}
            {activeTab === 'edit' && (
              <form onSubmit={handleSubmit} className="animate-in fade-in duration-300">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="md:col-span-2"><h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Basic Information</h3></div>
                  
                  <div><label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Full Name</label>
                    <input type="text" name="name" value={formData.name} onChange={handleInputChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" /></div>
                  <div><label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Company</label>
                    <input type="text" name="company" value={formData.company} onChange={handleInputChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" /></div>
                  <div><label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Role</label>
                    <select name="role" value={formData.role} onChange={handleInputChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white dark:bg-gray-900 dark:border-gray-800">
                      <option value="CLIENT">Client</option><option value="PARTNER">Partner</option><option value="INVESTOR">Investor</option><option value="JOB_SEEKER">Job Seeker</option><option value="ADMIN">Admin</option>
                    </select></div>
                  <div><label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Status</label>
                    <select name="status" value={formData.status} onChange={handleInputChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white dark:bg-gray-900 dark:border-gray-800">
                      <option value="ACTIVE">Active</option><option value="INACTIVE">Inactive</option><option value="SUSPENDED">Suspended</option>
                    </select></div>
                  <div><label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Phone</label>
                    <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg" /></div>
                  <div><label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Location</label>
                    <input type="text" name="location" value={formData.location} onChange={handleInputChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg" /></div>
                  <div><label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Profession</label>
                    <input type="text" name="profession" value={formData.profession} onChange={handleInputChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg" /></div>
                  <div className="flex gap-4">
                    <div className="flex-1"><label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Age</label>
                      <input type="number" name="age" value={formData.age} onChange={handleInputChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg" /></div>
                    <div className="flex-1"><label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Gender</label>
                      <select name="gender" value={formData.gender} onChange={handleInputChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white dark:bg-gray-900 dark:border-gray-800">
                        <option value="">Select</option><option value="Male">Male</option><option value="Female">Female</option><option value="Other">Other</option>
                      </select></div>
                  </div>

                  <div className="md:col-span-2 mt-4"><h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Email Addresses</h3></div>
                  <div><label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Company Email</label>
                    <input type="email" name="companyEmail" value={formData.companyEmail} onChange={handleInputChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg" /></div>
                  <div><label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Personal Gmail</label>
                    <input type="email" name="gmail" value={formData.gmail} onChange={handleInputChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg" /></div>
                  <div><label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Employee Email</label>
                    <input type="email" name="employeeEmail" value={formData.employeeEmail} onChange={handleInputChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg" /></div>
                  <div><label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">College Email</label>
                    <input type="email" name="collegeEmail" value={formData.collegeEmail} onChange={handleInputChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg" /></div>

                  <div className="md:col-span-2 mt-4"><h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Social Links</h3></div>
                  <div><label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">LinkedIn</label>
                    <input type="url" name="linkedin" value={formData.linkedin} onChange={handleInputChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg" /></div>
                  <div><label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">GitHub</label>
                    <input type="url" name="github" value={formData.github} onChange={handleInputChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg" /></div>
                  <div><label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Twitter</label>
                    <input type="url" name="twitter" value={formData.twitter} onChange={handleInputChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg" /></div>

                  <div className="md:col-span-2 mt-4"><h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Admin Controls</h3></div>
                  <div className="md:col-span-2">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input type="checkbox" name="isRedFlagged" checked={formData.isRedFlagged} onChange={handleInputChange} className="w-5 h-5 text-red-600 rounded" />
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300"><Flag className="inline w-4 h-4 text-red-500 mr-1" />Red Flag this user</span>
                    </label>
                  </div>

                  <div className="md:col-span-2 mt-4"><label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Admin Notes / Purpose</label>
                    <textarea name="purpose" value={formData.purpose} onChange={handleInputChange} rows={4} className="w-full px-4 py-3 border border-gray-300 rounded-lg resize-y" placeholder="Admin notes..." /></div>
                </div>

                <div className="mt-8 flex gap-3">
                  <button type="submit" disabled={saving} className="px-6 py-3 bg-brand-gradient text-white rounded-lg font-semibold flex items-center gap-2 disabled:opacity-50">
                    <Save className="w-5 h-5" />{saving ? 'Saving...' : 'Save All Changes'}
                  </button>
                  <button type="button" onClick={() => navigate('/dashboard/admin/users')} className="px-6 py-3 bg-gray-200 text-gray-700 dark:text-gray-300 rounded-lg font-semibold">Cancel</button>
                </div>
              </form>
            )}

            {activeTab === 'activity' && (
              <div className="space-y-8 animate-in fade-in duration-300">
                <div>
                  <h3 className="text-sm font-bold text-gray-400 uppercase mb-4 flex items-center gap-2"><FolderKanban className="w-4 h-4" />Projects ({profile?.projects?.length || profile?._count?.projects || 0})</h3>
                  {profile?.projects?.length > 0 ? profile.projects.map(p => (
                    <div key={p.id} className="p-4 bg-gray-50 dark:bg-gray-800 dark:border-gray-700 rounded-xl border mb-2"><h4 className="font-semibold">{p.title || p.name}</h4><p className="text-sm text-gray-500">{p.description}</p></div>
                  )) : <p className="text-gray-500 text-sm">No projects found.</p>}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-400 uppercase mb-4 flex items-center gap-2"><Clock className="w-4 h-4" />Sessions</h3>
                  {profile?.sessions?.length > 0 ? profile.sessions.map(s => (
                    <div key={s.id} className="p-3 bg-gray-50 dark:bg-[#050505] rounded-lg flex justify-between mb-2"><span className="text-sm">{s.userAgent?.substring(0,50) || 'Unknown'}</span><span className="text-xs text-gray-400">{new Date(s.lastActive).toLocaleString()}</span></div>
                  )) : <p className="text-gray-500 text-sm">No sessions.</p>}
                </div>
              </div>
            )}

            {activeTab === 'account' && (
              <div className="p-6 bg-red-50 dark:bg-red-900/20 border border-red-200 rounded-xl space-y-4 animate-in fade-in duration-300">
                <h3 className="text-lg font-bold text-red-800">⚠️ Account Actions (Danger Zone)</h3>
                <p className="text-sm text-red-700">These actions are irreversible.</p>
                <div className="flex gap-4">
                  <button onClick={() => handleDeleteUser(false)} className="px-4 py-2 bg-orange-500 text-white rounded-lg flex items-center gap-2"><Trash2 className="w-4 h-4" />Soft Delete (Inactive)</button>
                  <button onClick={() => handleDeleteUser(true)} className="px-4 py-2 bg-red-600 text-white rounded-lg flex items-center gap-2"><Trash2 className="w-4 h-4" />Delete Forever</button>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="text-center text-sm text-gray-500 py-4"><strong>Admin Mode:</strong> User ID: {profile?.id}</div>
      </div>
    </DashboardLayout>
  );
};

export default AdminUserEdit;
