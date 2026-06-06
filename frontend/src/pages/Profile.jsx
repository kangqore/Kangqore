import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Building2, Linkedin, Github, Twitter, Camera, Save, X, ArrowLeft, Smartphone, Upload, Paperclip, FileText, Trash2, Briefcase, Folder, ExternalLink, Calendar, Plus, Link as LinkIcon, Award } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import DashboardLayout from '../components/DashboardLayout';

const Profile = ({ startEditing = false }) => {
  const { user: currentUser, updateUser } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editMode, setEditMode] = useState(startEditing);

  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || '';

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    companyEmail: '',
    employeeEmail: '',
    collegeEmail: '',
    linkedin: '',
    github: '',
    twitter: '',
    gmail: '',
    location: '',
    purpose: '',
    phone: '',
    documents: [],
    // Demographics
    age: '',
    gender: '',
    profession: '',
    // Portfolio
    portfolio: {
      coding: { leetcode: '', hackerrank: '', codechef: '' },
      design: { behance: '', dribbble: '' },
      personalWebsite: '',
      research: [], // Array of { title, link }
      certificates: [], // Array of { title, link }
      workExperience: [], // Array of { company, role, startDate, endDate, description }
      projects: [], // Array of { title, description, link, image }
      skills: [] // Array of { name, type }
    }
  });

  const fileInputRef = useRef(null);

  // Sync editMode with prop (navigation)
  useEffect(() => {
    setEditMode(startEditing);
  }, [startEditing]);

  // Fetch profile data
  useEffect(() => {
    fetchProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');

      const response = await axios.get(`${BACKEND_URL}/api/profile/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const userData = response.data.user;
      setProfile(userData);
      setFormData({
        name: userData.name || '',
        company: userData.company || '',
        companyEmail: userData.companyEmail || '',
        employeeEmail: userData.employeeEmail || '',
        collegeEmail: userData.collegeEmail || '',
        linkedin: userData.linkedin || '',
        github: userData.github || '',
        twitter: userData.twitter || '',
        gmail: userData.gmail || '',
        location: userData.location || '',
        purpose: userData.purpose || '',
        phone: userData.phone || '',
        documents: userData.documents || [],
        // Demographics
        age: userData.age || '',
        gender: userData.gender || '',
        profession: userData.profession || '',
        portfolio: userData.portfolio || {
          coding: { leetcode: '', hackerrank: '', codechef: '' },
          design: { behance: '', dribbble: '' },
          personalWebsite: '',
          research: [],
          certificates: [],
          workExperience: [],
          projects: [],
          skills: []
        }
      });
      setError('');
    } catch (err) {
      console.error('Profile fetch error:', err);
      if (err.response && (err.response.status === 401 || err.response.status === 404)) {
         setError('Session expired or invalid. Please log out and back in.');
      } else {
         setError('Failed to load profile. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePortfolioChange = (category, field, value) => {
    setFormData(prev => ({
      ...prev,
      portfolio: {
        ...prev.portfolio,
        [category]: {
          ...prev.portfolio[category],
          [field]: value
        }
      }
    }));
  };

  const handlePortfolioSimpleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      portfolio: {
        ...prev.portfolio,
        [field]: value
      }
    }));
  };

  const handleArrayFieldChange = (category, index, field, value) => {
     setFormData(prev => {
        const newArray = [...(prev.portfolio[category] || [])];
        newArray[index] = { ...newArray[index], [field]: value };
        return {
           ...prev,
           portfolio: { ...prev.portfolio, [category]: newArray }
        };
     });
  };

  const handleAddArrayItem = (category) => {
     setFormData(prev => ({
        ...prev,
        portfolio: {
           ...prev.portfolio,
           [category]: [...(prev.portfolio[category] || []), { title: '', link: '' }]
        }
     }));
  };

  const handleRemoveArrayItem = (category, index) => {
     setFormData(prev => {
        const newArray = prev.portfolio[category].filter((_, i) => i !== index);
        return {
           ...prev,
           portfolio: { ...prev.portfolio, [category]: newArray }
        };
     });
  };

    const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Gmail is no longer strictly required for updates, but recommended
    // if (!formData.gmail) ... (Removed)

    try {
      setSaving(true);
      setError('');
      const token = localStorage.getItem('token');
      
      // Prepare payload: Remove read-only fields and format data
      const payload = { ...formData };
      delete payload.name; // Backend blocks 'name'
      // email and role are likely not in formData, but if they are, remove them.
      if ('email' in payload) delete payload.email;
      if ('role' in payload) delete payload.role;
      
      // Handle Age (convert empty string to null)
      if (payload.age === '') {
        payload.age = null;
      } else {
        payload.age = parseInt(payload.age, 10);
      }


      console.log('Sending Profile Update Payload:', payload); // DEBUG

      await axios.patch(`${BACKEND_URL}/api/profile`, payload, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setSuccess('Profile updated successfully');
      setEditMode(false);
      fetchProfile(); // Refresh data
      
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('FULL PROFILE UPDATE ERROR:', err); // DEBUG
      console.error('Response Data:', err.response?.data); // DEBUG
      setError(err.response?.data?.error?.message || 'Failed to update profile');
      console.error('Profile update error:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    // Reset form to original profile data
    setFormData({
      name: profile.name || '',
      company: profile.company || '',
      companyEmail: profile.companyEmail || '',
      employeeEmail: profile.employeeEmail || '',
      linkedin: profile.linkedin || '',
      github: profile.github || '',
      twitter: profile.twitter || '',
      gmail: profile.gmail || '',
      phone: profile.phone || '',
      location: profile.location || '',
      purpose: profile.purpose || '',
      age: profile.age || '',
      gender: profile.gender || '',
      profession: profile.profession || '',
      documents: profile.documents || []
    });
    setEditMode(false);
    setError('');
  };

  const handleDocumentUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    try {
      setSaving(true); // Reusing saving state for visual feedback if wanted, or just handle silently
      const token = localStorage.getItem('token');
      
      const newDocuments = [...formData.documents];

      for (const file of files) {
        const uploadFormData = new FormData();
        uploadFormData.append('file', file); // API supports single file per request on /api/uploads, or array on /multiple. 
        // Using single loop for simplicity with current generic upload implementation or /multiple if available.
        // The backend /multiple endpoint exists: POST /api/uploads/multiple

        // Let's use the multiple endpoint if possible, but loop is safer if I'm not 100% sure of the frontend interface for it.
        // Actually, let's use the loop with the single endpoint I verified earlier in logic, or just loop.
        
        const uploadRes = await axios.post(`${BACKEND_URL}/api/uploads/single`, uploadFormData, {
          headers: { 
            Authorization: `Bearer ${token}`
          }
        });
        newDocuments.push(uploadRes.data.url);
      }

      setFormData(prev => ({ ...prev, documents: newDocuments }));
      // We don't save profile immediately, user must click Save Changes.
    } catch (err) {
      console.error('UPLOAD ERROR:', err); // DEBUG
      console.error('Upload Response:', err.response?.data); // DEBUG
      setError('Failed to upload some documents: ' + (err.response?.data?.error?.message || err.message));
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const removeDocument = (index) => {
    setFormData(prev => ({
      ...prev,
      documents: prev.documents.filter((_, i) => i !== index)
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-[#050505] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-blue"></div>
      </div>
    );
  }

  return (
    <DashboardLayout 
      role={(currentUser?.role || 'client').toLowerCase()} 
      title="Profile" 
      subtitle="Manage your personal information and preferences"
    >
      <div className="space-y-6">

        {/* Tabs */}
        <div className="flex items-center gap-4 border-b border-gray-200 mb-6">
          <button
            onClick={() => setEditMode(false)}
            className={`pb-3 px-1 text-sm font-medium transition-colors border-b-2 ${
              !editMode 
                ? 'border-brand-blue text-brand-blue' 
                : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-300'
            }`}
          >
            Profile View
          </button>
          <button
            onClick={() => setEditMode(true)}
            className={`pb-3 px-1 text-sm font-medium transition-colors border-b-2 ${
              editMode 
                ? 'border-brand-blue text-brand-blue' 
                : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-300'
            }`}
          >
            Edit Profile
          </button>
        </div>

        {/* Alert Messages */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 rounded-xl flex items-center justify-between">
            <div className="text-red-700 font-medium">{error}</div>
            <div className="flex gap-2">
              <button 
                onClick={fetchProfile}
                className="px-3 py-1 bg-white dark:bg-gray-900 dark:border-gray-800 border border-red-200 text-red-700 rounded-lg text-sm font-bold hover:bg-red-50"
              >
                Retry
              </button>
              {(error.includes('Session') || error.includes('log out')) && (
                 <button 
                    onClick={() => {
                        localStorage.removeItem('token');
                        localStorage.removeItem('user');
                        window.location.href = '/login';
                    }}
                    className="px-3 py-1 bg-red-700 text-white rounded-lg text-sm font-bold hover:bg-red-800"
                 >
                    Log Out
                 </button>
              )}
            </div>
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 rounded-xl text-green-700">
            {success}
          </div>
        )}

        {!editMode ? (
           /* RESUME VIEW */
           <div className="bg-white dark:bg-gray-900 dark:border-gray-800 rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              {/* Header / Cover */}
              <div className="h-32 bg-gradient-to-r from-blue-600 to-indigo-700"></div>
              <div className="px-8 pb-8">
                 <div className="relative flex justify-between items-end -mt-12 mb-6">
                    <div className="relative">
                       <div className="w-32 h-32 bg-white dark:bg-gray-900 dark:border-gray-800 rounded-full p-1.5 shadow-md">
                          {profile?.avatarUrl ? (
                            <img src={profile.avatarUrl} alt={profile.name} className="w-full h-full rounded-full object-cover bg-gray-100 dark:bg-[#0a0a0c]" />
                          ) : profile?.role === 'ADMIN' ? (
                            <img src="/assets/eqore_avatar.jpg" alt="Kangqore Admin" className="w-full h-full rounded-full object-cover" />
                          ) : (
                            <div className="w-full h-full rounded-full bg-brand-gradient flex items-center justify-center text-white text-4xl font-bold">
                              {profile?.name?.charAt(0).toUpperCase()}
                            </div>
                          )}
                       </div>
                    </div>
                    {/* Switch to Edit Button */}
                    <button 
                      onClick={() => setEditMode(true)}
                      className="mb-4 px-4 py-2 bg-white dark:bg-gray-900 dark:border-gray-800 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 shadow-sm"
                    >
                      Edit Profile
                    </button>
                 </div>

                 <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{profile?.name}</h1>
                    <p className="text-lg text-gray-600 dark:text-gray-400 font-medium">{profile?.profession || profile?.role?.replace('_', ' ')}</p>
                    <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
                       {profile?.location && (
                         <div className="flex items-center gap-1">
                           <Building2 className="w-4 h-4" />
                           {profile?.location}
                         </div>
                       )}
                       {profile?.company && (
                         <div className="flex items-center gap-1">
                           <Briefcase className="w-4 h-4" />
                           {profile?.company}
                         </div>
                       )}
                       <div className="flex items-center gap-1">
                          <Mail className="w-4 h-4" />
                          {profile?.email}
                       </div>
                    </div>
                 </div>

                 <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-10">
                    {/* Left Column: About & Experience */}
                    <div className="lg:col-span-2 space-y-8">
                       {/* About */}
                       <section>
                          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                             <User className="w-5 h-5 text-gray-400" />
                             About
                          </h3>
                          <p className="text-gray-600 dark:text-gray-400 leading-relaxed max-w-2xl">
                             {profile?.purpose || "No bio added yet."}
                          </p>
                       </section>

                       {/* Portfolio / Projects */}
                       {profile?.portfolio && (
                         <section>
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                               <FileText className="w-5 h-5 text-gray-400" />
                               Portfolio & Work
                            </h3>
                            
                            <div className="space-y-4">
                               {/* Personal Website */}
                               {profile.portfolio.personalWebsite && (
                                 <a 
                                   href={profile.portfolio.personalWebsite} 
                                   target="_blank" 
                                   rel="noopener noreferrer"
                                   className="block p-4 border border-gray-100 rounded-xl hover:border-blue-200 hover:bg-blue-50 dark:bg-blue-900/20/50 transition-colors"
                                 >
                                    <h4 className="font-semibold text-gray-900 dark:text-white text-sm">Personal Website</h4>
                                    <span className="text-brand-blue text-sm hover:underline">{profile.portfolio.personalWebsite}</span>
                                 </a>
                               )}
                               
                               {/* Research */}
                               {profile.portfolio.research?.length > 0 && (
                                 <div>
                                   <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wider">Research Papers</h4>
                                   <ul className="space-y-2">
                                     {profile.portfolio.research.map((item, i) => (
                                       <li key={i}>
                                         <a href={item.link} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline font-medium">
                                           {item.title}
                                         </a>
                                       </li>
                                     ))}
                                   </ul>
                                 </div>
                               )}
                               
                               {/* Case Studies */}
                               {profile.portfolio.caseStudies?.length > 0 && (
                                 <div>
                                   <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wider mt-4">Case Studies</h4>
                                   <ul className="space-y-2">
                                     {profile.portfolio.caseStudies.map((item, i) => (
                                       <li key={i}>
                                         <a href={item.link} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline font-medium">
                                           {item.title}
                                         </a>
                                       </li>
                                     ))}
                                   </ul>
                                 </div>
                               )}
                            </div>
                         </section>
                       )}
                       
                       {/* Work Experience */}
                       {profile?.portfolio?.workExperience?.length > 0 && (
                         <section>
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                               <Briefcase className="w-5 h-5 text-gray-400" />
                               Work Experience
                            </h3>
                            <div className="space-y-6 border-l-2 border-gray-100 pl-4 ml-2">
                               {profile.portfolio.workExperience.map((exp, i) => (
                                 <div key={i} className="relative">
                                    <div className="absolute -left-[21px] top-1 w-3 h-3 bg-gray-200 rounded-full border-2 border-white"></div>
                                    <h4 className="font-bold text-gray-900 dark:text-white">{exp.role}</h4>
                                    <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                                       <span className="font-medium">{exp.company}</span>
                                       {exp.location && <span> • {exp.location}</span>}
                                       <span className="text-gray-400"> • {exp.startDate} - {exp.current ? 'Present' : exp.endDate}</span>
                                    </div>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{exp.description}</p>
                                 </div>
                               ))}
                            </div>
                         </section>
                       )}

                       {/* Portfolio Projects */}
                       {profile?.portfolio?.projects?.length > 0 && (
                         <section>
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                               <Folder className="w-5 h-5 text-gray-400" />
                               Featured Projects
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                               {profile.portfolio.projects.map((project, i) => (
                                 <div key={i} className="border border-gray-200 rounded-xl p-4 hover:border-blue-300 transition-colors bg-white dark:bg-gray-900 dark:border-gray-800">
                                    <div className="flex justify-between items-start mb-2">
                                       <h4 className="font-bold text-gray-900 dark:text-white">{project.title}</h4>
                                       {project.link && (
                                         <a href={project.link} target="_blank" rel="noreferrer" className="text-gray-400 hover:text-blue-600">
                                            <ExternalLink className="w-4 h-4" />
                                         </a>
                                       )}
                                    </div>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3 mb-3">{project.description}</p>
                                    <div className="flex flex-wrap gap-2">
                                       {project.tags?.split(',').map((tag, t) => (
                                          <span key={t} className="px-2 py-0.5 bg-gray-100 dark:bg-[#0a0a0c] text-gray-600 dark:text-gray-400 text-xs rounded-md">
                                             {tag.trim()}
                                          </span>
                                       ))}
                                    </div>
                                 </div>
                               ))}
                            </div>
                         </section>
                       )}

                       {/* Documents */}
                       {profile?.documents?.length > 0 && (
                         <section>
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                               <Paperclip className="w-5 h-5 text-gray-400" />
                               Documents
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                               {profile.documents.map((doc, idx) => (
                                 <a 
                                   key={idx} 
                                   href={doc} 
                                   target="_blank" 
                                   rel="noreferrer"
                                   className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:border-blue-400 hover:shadow-sm transition-all bg-gray-50 dark:bg-gray-800 dark:border-gray-700"
                                 >
                                   <FileText className="w-5 h-5 text-gray-500" />
                                   <span className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate">{doc.split('/').pop()}</span>
                                 </a>
                               ))}
                            </div>
                         </section>
                       )}
                    </div>

                    {/* Right Column: Sidebar Info */}
                    <div className="space-y-8">
                       {/* Links */}
                       <div className="bg-gray-50 dark:bg-gray-800 dark:border-gray-700 p-6 rounded-2xl border border-gray-100">
                          <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-4">Connect</h3>
                          <div className="space-y-4">
                             {profile?.linkedin && (
                               <a href={profile.linkedin} target="_blank" rel="noreferrer" className="flex items-center gap-3 text-gray-600 dark:text-gray-400 hover:text-blue-700 transition-colors">
                                 <Linkedin className="w-5 h-5" />
                                 <span className="text-sm font-medium">LinkedIn</span>
                               </a>
                             )}
                             {profile?.github && (
                               <a href={profile.github} target="_blank" rel="noreferrer" className="flex items-center gap-3 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:text-white transition-colors">
                                 <Github className="w-5 h-5" />
                                 <span className="text-sm font-medium">GitHub</span>
                               </a>
                             )}
                             {profile?.twitter && (
                               <a href={profile.twitter} target="_blank" rel="noreferrer" className="flex items-center gap-3 text-gray-600 dark:text-gray-400 hover:text-blue-400 transition-colors">
                                 <Twitter className="w-5 h-5" />
                                 <span className="text-sm font-medium">Twitter</span>
                               </a>
                             )}
                             {profile?.phone && (
                               <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                                 <Smartphone className="w-5 h-5" />
                                 <span className="text-sm font-medium">{profile.phone}</span>
                               </div>
                             )}
                          </div>
                       </div>

                       {/* Skills Section */}
                       {profile?.portfolio?.skills?.length > 0 && (
                         <div className="bg-white dark:bg-gray-900 dark:border-gray-800 p-6 rounded-2xl border border-gray-100 shadow-sm">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                               <Award className="w-5 h-5 text-brand-blue" />
                               Skills
                            </h3>
                            <div className="space-y-4">
                               {['Technical', 'Soft Skills', 'Tools', 'Languages', 'Other'].map(type => {
                                  const skills = profile.portfolio.skills.filter(s => s.type === type);
                                  if (skills.length === 0) return null;
                                  return (
                                     <div key={type}>
                                        <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">{type}</h4>
                                        <div className="flex flex-wrap gap-2">
                                           {skills.map((skill, i) => (
                                              <span key={i} className="px-3 py-1 bg-gray-50 dark:bg-gray-800 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium border border-gray-200">
                                                 {skill.name}
                                              </span>
                                           ))}
                                        </div>
                                     </div>
                                  );
                               })}
                               {/* Catch-all for uncategorized or legacy skills without type */}
                               {profile.portfolio.skills.some(s => !s.type) && (
                                  <div>
                                     <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">General</h4>
                                     <div className="flex flex-wrap gap-2">
                                        {profile.portfolio.skills.filter(s => !s.type).map((skill, i) => (
                                           <span key={i} className="px-3 py-1 bg-gray-50 dark:bg-gray-800 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium border border-gray-200">
                                              {skill.name}
                                           </span>
                                        ))}
                                     </div>
                                  </div>
                               )}
                            </div>
                         </div>
                       )}

                       {/* Coding / Design Badges */}
                       {profile?.portfolio && (
                         <div className="space-y-6">
                            {(profile.portfolio.coding?.leetcode || profile.portfolio.coding?.hackerrank || profile.portfolio.coding?.codechef) && (
                              <div>
                                <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-3">Coding Accounts</h3>
                                <div className="flex flex-wrap gap-2">
                                  {profile.portfolio.coding.leetcode && (
                                    <a href={profile.portfolio.coding.leetcode} target="_blank" rel="noreferrer" className="px-3 py-1 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 text-xs font-semibold rounded-full border border-yellow-200">LeetCode</a>
                                  )}
                                  {profile.portfolio.coding.hackerrank && (
                                    <a href={profile.portfolio.coding.hackerrank} target="_blank" rel="noreferrer" className="px-3 py-1 bg-green-50 dark:bg-green-900/20 text-green-700 text-xs font-semibold rounded-full border border-green-200">HackerRank</a>
                                  )}
                                  {profile.portfolio.coding.codechef && (
                                    <a href={profile.portfolio.coding.codechef} target="_blank" rel="noreferrer" className="px-3 py-1 bg-gray-100 dark:bg-gray-800 dark:border-gray-700 text-gray-700 dark:text-gray-300 text-xs font-semibold rounded-full border border-gray-200">CodeChef</a>
                                  )}
                                </div>
                              </div>
                            )}

                            {(profile.portfolio.design?.behance || profile.portfolio.design?.dribbble) && (
                              <div>
                                <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-3">Design Accounts</h3>
                                <div className="flex flex-wrap gap-2">
                                  {profile.portfolio.design.behance && (
                                    <a href={profile.portfolio.design.behance} target="_blank" rel="noreferrer" className="px-3 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-700 text-xs font-semibold rounded-full border border-blue-200">Behance</a>
                                  )}
                                  {profile.portfolio.design.dribbble && (
                                    <a href={profile.portfolio.design.dribbble} target="_blank" rel="noreferrer" className="px-3 py-1 bg-pink-50 text-pink-700 text-xs font-semibold rounded-full border border-pink-200">Dribbble</a>
                                  )}
                                </div>
                              </div>
                            )}
                         </div>
                       )}
                    </div>
                 </div>
              </div>
           </div>
        ) : (
        /* EDIT FORM (Original Form) */
        <div className="bg-white dark:bg-gray-900 dark:border-gray-800 rounded-2xl shadow-sm border border-gray-200 p-8">
          {/* Avatar Section */}
          <div className="flex items-center gap-6 mb-8 pb-8 border-b border-gray-200">
            <div className="relative">
              <div className="w-24 h-24 bg-brand-gradient rounded-full flex items-center justify-center text-white text-3xl font-bold overflow-hidden">
                {profile?.avatarUrl ? (
                  <img src={profile.avatarUrl} alt={profile.name} className="w-full h-full rounded-full object-cover" />
                ) : profile?.role === 'ADMIN' ? (
                  <img src="/assets/eqore_avatar.jpg" alt="Kangqore Admin" className="w-full h-full rounded-full object-cover" />
                ) : (
                  profile?.name?.charAt(0).toUpperCase()
                )}
              </div>
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-0 right-0 w-8 h-8 bg-brand-gradient rounded-full flex items-center justify-center text-white hover:opacity-90 transition-colors"
                title="Upload new avatar"
              >
                <Camera className="w-4 h-4" />
              </button>
              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept="image/*"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;

                  try {
                    const formData = new FormData();
                    formData.append('file', file);
                    const token = localStorage.getItem('token');
                    
                    // Upload file
                    const uploadRes = await axios.post(`${BACKEND_URL}/api/uploads/single`, formData, {
                      headers: { 
                        Authorization: `Bearer ${token}`
                      }
                    });

                    // Update profile avatar
                    const avatarUrl = uploadRes.data.url;
                    await axios.patch(`${BACKEND_URL}/api/profile/avatar`, { avatarUrl }, {
                      headers: { Authorization: `Bearer ${token}` }
                    });

                    // Update UI
                    setProfile(prev => ({ ...prev, avatarUrl }));
                    // Sync to AuthContext so header avatar updates too
                    updateUser({ avatarUrl });
                    setSuccess('Avatar updated successfully');
                    setTimeout(() => setSuccess(''), 3000);
                  } catch (err) {
                    const errorResponse = err.response?.data?.error;
                    const message = typeof errorResponse === 'string' 
                      ? errorResponse 
                      : errorResponse?.message || err.message || 'Failed to upload avatar';
                    
                    setError(message);
                    console.error('Avatar upload error:', err);
                  }
                }}
              />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{profile?.name}</h2>
              <p className="text-sm text-gray-500">{profile?.email}</p>
              <span className="inline-block mt-2 px-3 py-1 bg-blue-100 text-blue-700 text-sm font-semibold rounded-full">
                {profile?.role}
              </span>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <div className="grid md:grid-cols-2 gap-6">

              
              {/* Full Name (Read-only) */}
              <div className="col-span-2">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={profile?.name || ''}
                    disabled
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg bg-gray-100 dark:bg-gray-800 dark:border-gray-700 cursor-not-allowed"
                  />
                  <p className="text-xs text-gray-500 mt-1">Cannot be changed</p>
                </div>
              </div>

              {/* Primary Email (Read-only) */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Primary Email <span className="text-xs text-gray-500">(Login)</span>
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    value={profile?.email || ''}
                    disabled
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg bg-gray-100 dark:bg-gray-800 dark:border-gray-700 cursor-not-allowed"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">Cannot be changed</p>
              </div>

              {/* Role (Read-only) */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Role
                </label>
                <input
                  type="text"
                  value={profile?.role || ''}
                  disabled
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 dark:bg-gray-800 dark:border-gray-700 cursor-not-allowed"
                />
                <p className="text-xs text-gray-500 mt-1">Cannot be changed</p>
              </div>

              {/* Company */}
              <div className="col-span-2">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Company / College Name
                </label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleInputChange}
                    disabled={!editMode}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-brand-blue disabled:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 disabled:cursor-not-allowed"
                    placeholder="Company Name"
                  />
                </div>
              </div>

              {/* Company Email */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Company Email
                </label>
                <input
                  type="email"
                  name="companyEmail"
                  value={formData.companyEmail}
                  onChange={handleInputChange}
                  disabled={!editMode}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-brand-blue disabled:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 disabled:cursor-not-allowed"
                  placeholder="you@company.com"
                />
              </div>

              {/* Employee Email */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Employee Email
                </label>
                <input
                  type="email"
                  name="employeeEmail"
                  value={formData.employeeEmail}
                  onChange={handleInputChange}
                  disabled={!editMode}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-brand-blue disabled:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 disabled:cursor-not-allowed"
                  placeholder="employee@work.com"
                />
              </div>

              {/* College Email */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  College / University Email
                </label>
                <input
                  type="email"
                  name="collegeEmail"
                  value={formData.collegeEmail}
                  onChange={handleInputChange}
                  disabled={!editMode}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-brand-blue disabled:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 disabled:cursor-not-allowed"
                  placeholder="student@university.edu"
                />
              </div>

               {/* Personal Gmail (Required) */}
               <div className="col-span-2 bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-100">
                <label className="block text-sm font-bold text-blue-900 mb-2">
                  Personal Gmail
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-blue" />
                  <input
                    type="email"
                    name="gmail"
                    value={formData.gmail}
                    onChange={handleInputChange}
                    disabled={!editMode}
                    className="w-full pl-10 pr-4 py-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-brand-blue disabled:bg-white dark:bg-gray-900 dark:border-gray-800 disabled:cursor-not-allowed"
                    placeholder="you@gmail.com"
                  />
                </div>
                <p className="text-xs text-blue-700 mt-1">Recommended for account recovery.</p>
              </div>

              {/* Phone */}
              <div className="col-span-2 md:col-span-1">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Phone Number
                </label>
                <div className="relative">
                  <Smartphone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    disabled={!editMode}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-brand-blue disabled:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 disabled:cursor-not-allowed"
                    placeholder="+1 (555) 000-0000"
                  />
                </div>
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Location / City
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  disabled={!editMode}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-brand-blue disabled:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 disabled:cursor-not-allowed"
                  placeholder="New York, USA"
                />
              </div>

              {/* Purpose (Message Box) */}
              <div className="col-span-2">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  What are you looking for? (Message / Purpose)
                </label>
                <textarea
                  name="purpose"
                  value={formData.purpose}
                  onChange={handleInputChange}
                  disabled={!editMode}
                  rows={4} // Message box height
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-brand-blue disabled:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 disabled:cursor-not-allowed resize-y"
                  placeholder="Tell us about yourself, your goals, or what kind of partnership/deals you are looking for..."
                />
              </div>

              {/* Portfolio & Achievements Section */}
              {profile?.role === 'JOB_SEEKER' && (
                <div className="col-span-2 border-t border-gray-100 pt-6 mt-2">
                  <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                     <FileText className="w-4 h-4 text-brand-blue" />
                     Portfolio & Achievements
                  </h3>
                  
                  <div className="space-y-6">
                    {/* Personal Website */}
                    <div>
                         <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Personal Website</label>
                         <input
                           type="url"
                           value={formData.portfolio?.personalWebsite || ''}
                           onChange={(e) => handlePortfolioSimpleChange('personalWebsite', e.target.value)}
                           disabled={!editMode}
                           className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-brand-blue disabled:bg-gray-100 dark:bg-gray-800 dark:border-gray-700"
                           placeholder="https://yourportfolio.com"
                         />
                    </div>

                    {/* Coding Platforms */}
                    <div className="grid md:grid-cols-3 gap-4">
                        <div>
                           <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">LeetCode</label>
                           <input
                             type="url"
                             value={formData.portfolio?.coding?.leetcode || ''}
                             onChange={(e) => handlePortfolioChange('coding', 'leetcode', e.target.value)}
                             disabled={!editMode}
                             className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 dark:bg-gray-800 dark:border-gray-700"
                             placeholder="LeetCode Profile URL"
                           />
                        </div>
                        <div>
                           <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">HackerRank</label>
                           <input
                             type="url"
                             value={formData.portfolio?.coding?.hackerrank || ''}
                             onChange={(e) => handlePortfolioChange('coding', 'hackerrank', e.target.value)}
                             disabled={!editMode}
                             className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 dark:bg-gray-800 dark:border-gray-700"
                             placeholder="HackerRank Profile URL"
                           />
                        </div>
                         <div>
                           <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">CodeChef</label>
                           <input
                             type="url"
                             value={formData.portfolio?.coding?.codechef || ''}
                             onChange={(e) => handlePortfolioChange('coding', 'codechef', e.target.value)}
                             disabled={!editMode}
                             className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 dark:bg-gray-800 dark:border-gray-700"
                             placeholder="CodeChef Profile URL"
                           />
                        </div>
                    </div>

                    {/* Design Platforms */}
                    <div className="grid md:grid-cols-2 gap-4">
                        <div>
                           <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Behance</label>
                           <input
                             type="url"
                             value={formData.portfolio?.design?.behance || ''}
                             onChange={(e) => handlePortfolioChange('design', 'behance', e.target.value)}
                             disabled={!editMode}
                             className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 dark:bg-gray-800 dark:border-gray-700"
                             placeholder="Behance Profile URL"
                           />
                        </div>
                        <div>
                           <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Dribbble</label>
                           <input
                             type="url"
                             value={formData.portfolio?.design?.dribbble || ''}
                             onChange={(e) => handlePortfolioChange('design', 'dribbble', e.target.value)}
                             disabled={!editMode}
                             className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 dark:bg-gray-800 dark:border-gray-700"
                             placeholder="Dribbble Profile URL"
                           />
                        </div>
                    </div>

                    {/* Dynamic Sections: Research, Case Studies, Certificates */}
                    {[
                      { key: 'research', label: 'Research Papers', icon: FileText },
                      { key: 'caseStudies', label: 'Case Studies', icon: FileText },
                      { key: 'certificates', label: 'Certificates', icon: FileText }
                    ].map((section) => (
                      <div key={section.key} className="border-t border-gray-100 pt-4">
                        <div className="flex items-center justify-between mb-3">
                           <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">{section.label}</label>
                           {editMode && (
                             <button
                               type="button"
                               onClick={() => handleAddArrayItem(section.key)}
                               className="text-xs font-semibold text-brand-blue hover:text-blue-700 bg-blue-50 dark:bg-blue-900/20 px-2 py-1 rounded-md"
                             >
                               + Add Item
                             </button>
                           )}
                        </div>
                        
                        <div className="space-y-3">
                           {(formData.portfolio?.[section.key] || []).map((item, index) => (
                             <div key={index} className="flex gap-2 items-start">
                                <div className="flex-1 space-y-2">
                                   <input
                                      type="text"
                                      value={item.title}
                                      onChange={(e) => handleArrayFieldChange(section.key, index, 'title', e.target.value)}
                                      disabled={!editMode}
                                      placeholder="Title (e.g. 'Advanced AI Research')"
                                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 dark:bg-gray-800 dark:border-gray-700"
                                   />
                                   <input
                                      type="url"
                                      value={item.link}
                                      onChange={(e) => handleArrayFieldChange(section.key, index, 'link', e.target.value)}
                                      disabled={!editMode}
                                      placeholder="URL (https://...)"
                                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 dark:bg-gray-800 dark:border-gray-700"
                                   />
                                </div>
                                {editMode && (
                                   <button
                                     type="button"
                                     onClick={() => handleRemoveArrayItem(section.key, index)}
                                     className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:bg-red-900/20 rounded-lg"
                                   >
                                     <Trash2 className="w-4 h-4" />
                                   </button>
                                )}
                             </div>
                           ))}
                           {(formData.portfolio?.[section.key] || []).length === 0 && (
                              <p className="text-xs text-gray-400 italic">No items added.</p>
                           )}
                        </div>
                      </div>
                    ))}

                  </div>
                </div>
              )}

              {/* Documents & Assets Section */}
              <div className="col-span-2 border-t border-gray-100 pt-6 mt-2">
                 <div className="flex items-center justify-between mb-4">
                   <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
                     <Paperclip className="w-4 h-4 text-brand-blue" />
                     Documents & Assets
                   </h3>
                   {editMode && (
                     <label className="cursor-pointer inline-flex items-center gap-2 text-sm text-brand-blue hover:text-blue-700 font-medium bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-colors">
                       <Upload className="w-4 h-4" />
                       Upload Files
                       <input 
                         type="file" 
                         multiple 
                         className="hidden" 
                         onChange={handleDocumentUpload}
                       />
                     </label>
                   )}
                 </div>
                 
                 {formData.documents && formData.documents.length > 0 ? (
                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                     {formData.documents.map((doc, index) => (
                       <div key={index} className="flex items-center gap-3 p-3 bg-white dark:bg-gray-900 dark:border-gray-800 border border-gray-200 rounded-lg group hover:border-blue-300 transition-colors">
                         <div className="w-10 h-10 bg-gray-100 dark:bg-[#0a0a0c] rounded-lg flex items-center justify-center flex-shrink-0">
                           <FileText className="w-5 h-5 text-gray-500" />
                         </div>
                         <div className="flex-1 min-w-0">
                           <a href={doc} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-brand-blue truncate block">
                             {doc.split('/').pop()}
                           </a>
                           <span className="text-xs text-gray-400">Document {index + 1}</span>
                         </div>
                         {editMode && (
                           <button
                             type="button"
                             onClick={() => removeDocument(index)}
                             className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:bg-red-900/20 rounded-lg transition-colors"
                             title="Remove document"
                           >
                             <Trash2 className="w-4 h-4" />
                           </button>
                         )}
                       </div>
                     ))}
                   </div>
                 ) : (
                   <div className="text-center py-6 bg-gray-50 dark:bg-gray-800 dark:border-gray-700 border border-gray-200 border-dashed rounded-xl">
                     <p className="text-sm text-gray-500">No documents uploaded yet.</p>
                     {editMode && <p className="text-xs text-gray-400 mt-1">Upload deals, partnership proposals, or assets.</p>}
                   </div>
                 )}
              </div>

              {/* Demographics Section */}
              <div className="col-span-2 border-t border-gray-100 pt-6 mt-2">
                 <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                   <User className="w-4 h-4 text-brand-blue" />
                   Professional Demographics
                 </h3>
                 <div className="grid md:grid-cols-3 gap-6">
                    {/* Age */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Age</label>
                      <input
                        type="number"
                        name="age"
                        value={formData.age}
                        onChange={handleInputChange}
                        disabled={!editMode}
                        min="18"
                        max="100"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-brand-blue disabled:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 disabled:cursor-not-allowed"
                        placeholder="e.g. 30"
                      />
                    </div>
                    {/* Gender */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Gender</label>
                      <select
                        name="gender"
                        value={formData.gender}
                        onChange={handleInputChange}
                        disabled={!editMode}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-brand-blue disabled:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 disabled:cursor-not-allowed"
                      >
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                        <option value="Prefer not to say">Prefer not to say</option>
                      </select>
                    </div>
                    {/* Profession */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Profession / Role</label>
                      <input
                        type="text"
                        name="profession"
                        value={formData.profession}
                        onChange={handleInputChange}
                        disabled={!editMode}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-brand-blue disabled:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 disabled:cursor-not-allowed"
                        placeholder="e.g. Software Engineer"
                      />
                    </div>
                 </div>
              </div>

              {/* SECTION: Work Experience */}
              <div className="col-span-2 mt-6 border-t border-gray-200 pt-6">
                 <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">Work Experience</h3>
                    <button 
                      type="button"
                      onClick={() => handleAddArrayItem('workExperience')}
                      className="flex items-center gap-2 text-sm font-medium text-brand-blue hover:text-blue-700"
                    >
                       <Plus className="w-4 h-4" /> Add Experience
                    </button>
                 </div>
                 
                 <div className="space-y-4">
                    {formData.portfolio.workExperience?.map((exp, index) => (
                       <div key={index} className="p-4 bg-gray-50 dark:bg-gray-800 dark:border-gray-700 rounded-xl border border-gray-200 relative group">
                          <button 
                             type="button" 
                             onClick={() => handleRemoveArrayItem('workExperience', index)}
                             className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors"
                          >
                             <Trash2 className="w-4 h-4" />
                          </button>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mr-8">
                             <div>
                                <label className="block text-xs font-semibold text-gray-500 mb-1">Company</label>
                                <input
                                   type="text"
                                   value={exp.company || ''}
                                   onChange={(e) => handleArrayFieldChange('workExperience', index, 'company', e.target.value)}
                                   className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                                   placeholder="Company Name"
                                />
                             </div>
                             <div>
                                <label className="block text-xs font-semibold text-gray-500 mb-1">Role / Job Title</label>
                                <input
                                   type="text"
                                   value={exp.role || ''}
                                   onChange={(e) => handleArrayFieldChange('workExperience', index, 'role', e.target.value)}
                                   className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                                   placeholder="e.g. Senior Developer"
                                />
                             </div>
                             <div>
                                <label className="block text-xs font-semibold text-gray-500 mb-1">Start Date</label>
                                <input
                                   type="text"
                                   value={exp.startDate || ''}
                                   onChange={(e) => handleArrayFieldChange('workExperience', index, 'startDate', e.target.value)}
                                   className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                                   placeholder="e.g. Jan 2020"
                                />
                             </div>
                             <div>
                                <label className="block text-xs font-semibold text-gray-500 mb-1">End Date</label>
                                <input
                                   type="text"
                                   value={exp.endDate || ''}
                                   onChange={(e) => handleArrayFieldChange('workExperience', index, 'endDate', e.target.value)}
                                   className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                                   placeholder="e.g. Present"
                                />
                             </div>
                             <div className="md:col-span-2">
                                <label className="block text-xs font-semibold text-gray-500 mb-1">Description</label>
                                <textarea
                                   value={exp.description || ''}
                                   onChange={(e) => handleArrayFieldChange('workExperience', index, 'description', e.target.value)}
                                   className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                                   rows={2}
                                   placeholder="Describe your responsibilities and achievements..."
                                />
                             </div>
                          </div>
                       </div>
                    ))}
                    {(!formData.portfolio.workExperience || formData.portfolio.workExperience.length === 0) && (
                       <p className="text-sm text-gray-500 italic">No work experience added.</p>
                    )}
                 </div>
              </div>

              {/* SECTION: Projects */}
              <div className="col-span-2 mt-6 border-t border-gray-200 pt-6 mb-6">
                 <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">Portfolio Projects</h3>
                    <button 
                      type="button"
                      onClick={() => handleAddArrayItem('projects')}
                      className="flex items-center gap-2 text-sm font-medium text-brand-blue hover:text-blue-700"
                    >
                       <Plus className="w-4 h-4" /> Add Project
                    </button>
                 </div>
                 
                 <div className="space-y-4">
                    {formData.portfolio.projects?.map((proj, index) => (
                       <div key={index} className="p-4 bg-gray-50 dark:bg-gray-800 dark:border-gray-700 rounded-xl border border-gray-200 relative group">
                          <button 
                             type="button" 
                             onClick={() => handleRemoveArrayItem('projects', index)}
                             className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors"
                          >
                             <Trash2 className="w-4 h-4" />
                          </button>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mr-8">
                             <div>
                                <label className="block text-xs font-semibold text-gray-500 mb-1">Project Title</label>
                                <input
                                   type="text"
                                   value={proj.title || ''}
                                   onChange={(e) => handleArrayFieldChange('projects', index, 'title', e.target.value)}
                                   className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                                   placeholder="Project Name"
                                />
                             </div>
                             <div>
                                <label className="block text-xs font-semibold text-gray-500 mb-1">Link (URL)</label>
                                <div className="relative">
                                   <LinkIcon className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                   <input
                                      type="url"
                                      value={proj.link || ''}
                                      onChange={(e) => handleArrayFieldChange('projects', index, 'link', e.target.value)}
                                      className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm"
                                      placeholder="https://..."
                                   />
                                </div>
                             </div>
                             <div className="md:col-span-2">
                                <label className="block text-xs font-semibold text-gray-500 mb-1">Tags (comma separated)</label>
                                <input
                                   type="text"
                                   value={proj.tags || ''}
                                   onChange={(e) => handleArrayFieldChange('projects', index, 'tags', e.target.value)}
                                   className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                                   placeholder="e.g. React, Node.js, Design"
                                />
                             </div>
                             <div className="md:col-span-2">
                                <label className="block text-xs font-semibold text-gray-500 mb-1">Description</label>
                                <textarea
                                   value={proj.description || ''}
                                   onChange={(e) => handleArrayFieldChange('projects', index, 'description', e.target.value)}
                                   className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                                   rows={2}
                                   placeholder="Brief description of the project..."
                                />
                             </div>
                          </div>
                       </div>
                    ))}
                    {(!formData.portfolio.projects || formData.portfolio.projects.length === 0) && (
                       <p className="text-sm text-gray-500 italic">No projects added.</p>
                    )}
                 </div>
              </div>

              {/* SECTION: Skills */}
              <div className="col-span-2 mt-6 border-t border-gray-200 pt-6 mb-6">
                 <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">Skills & Expertise</h3>
                    <button 
                      type="button"
                      onClick={() => handleAddArrayItem('skills')}
                      className="flex items-center gap-2 text-sm font-medium text-brand-blue hover:text-blue-700"
                    >
                       <Plus className="w-4 h-4" /> Add Skill
                    </button>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {formData.portfolio.skills?.map((skill, index) => (
                       <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 dark:border-gray-700 rounded-lg border border-gray-200 group">
                          <div className="flex-1">
                             <input
                                type="text"
                                value={skill.name || ''}
                                onChange={(e) => handleArrayFieldChange('skills', index, 'name', e.target.value)}
                                className="w-full px-3 py-1.5 bg-white dark:bg-gray-900 dark:border-gray-800 border border-gray-300 rounded-md text-sm mb-2"
                                placeholder="Skill Name (e.g. React)"
                             />
                             <select
                                value={skill.type || ''}
                                onChange={(e) => handleArrayFieldChange('skills', index, 'type', e.target.value)}
                                className="w-full px-3 py-1.5 bg-white dark:bg-gray-900 dark:border-gray-800 border border-gray-300 rounded-md text-xs text-gray-600 dark:text-gray-400"
                             >
                                <option value="">Select Category</option>
                                <option value="Technical">Technical</option>
                                <option value="Soft Skills">Soft Skills</option>
                                <option value="Tools">Tools</option>
                                <option value="Languages">Languages</option>
                                <option value="Other">Other</option>
                             </select>
                          </div>
                          <button 
                             type="button" 
                             onClick={() => handleRemoveArrayItem('skills', index)}
                             className="p-2 text-gray-400 hover:text-red-500 hover:bg-white dark:bg-black rounded-full transition-all"
                          >
                             <Trash2 className="w-4 h-4" />
                          </button>
                       </div>
                    ))}
                    {(!formData.portfolio.skills || formData.portfolio.skills.length === 0) && (
                       <div className="col-span-2 text-center py-8 border-2 border-dashed border-gray-200 rounded-xl">
                          <p className="text-sm text-gray-500 italic">No skills added yet.</p>
                       </div>
                    )}
                 </div>
              </div>

              {/* Social Links Start */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  LinkedIn
                </label>
                <div className="relative">
                  <Linkedin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="url"
                    name="linkedin"
                    value={formData.linkedin}
                    onChange={handleInputChange}
                    disabled={!editMode}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-brand-blue disabled:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 disabled:cursor-not-allowed"
                    placeholder="https://linkedin.com/in/yourname"
                  />
                </div>
              </div>

              {/* GitHub */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  GitHub
                </label>
                <div className="relative">
                  <Github className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="url"
                    name="github"
                    value={formData.github}
                    onChange={handleInputChange}
                    disabled={!editMode}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-brand-blue disabled:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 disabled:cursor-not-allowed"
                    placeholder="https://github.com/yourname"
                  />
                </div>
              </div>

              {/* Twitter */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  X (Twitter)
                </label>
                <div className="relative">
                  <Twitter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="url"
                    name="twitter"
                    value={formData.twitter}
                    onChange={handleInputChange}
                    disabled={!editMode}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-brand-blue disabled:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 disabled:cursor-not-allowed"
                    placeholder="https://twitter.com/yourname"
                  />
                </div>
              </div>

              {/* Gmail */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Gmail (Optional)
                </label>
                <input
                  type="email"
                  name="gmail"
                  value={formData.gmail}
                  onChange={handleInputChange}
                  disabled={!editMode}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-brand-blue disabled:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 disabled:cursor-not-allowed"
                  placeholder="you@gmail.com"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-8 flex gap-3">
              {!editMode ? (
                <button
                  type="button"
                  onClick={(e) => { e.preventDefault(); setEditMode(true); }}
                  className="px-6 py-3 bg-brand-gradient text-white rounded-lg font-semibold hover:opacity-90 transition-colors flex items-center gap-2"
                >
                  <User className="w-5 h-5" />
                  Edit Profile
                </button>
              ) : (
                <>
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Save className="w-5 h-5" />
                    {saving ? 'Saving...' : 'Save Changes'}
                  </button>
                  <button
                    type="button"
                    onClick={(e) => { e.preventDefault(); handleCancel(); }}
                    disabled={saving}
                    className="px-6 py-3 bg-gray-200 text-gray-700 dark:text-gray-300 rounded-lg font-semibold hover:bg-gray-300 transition-colors flex items-center gap-2 disabled:opacity-50"
                  >
                    <X className="w-5 h-5" />
                    Cancel
                  </button>
                </>
              )}
            </div>
          </form>

          {/* Enterprise Notice */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              <strong>Enterprise Account:</strong> Your role and primary email cannot be changed. Contact your administrator for account modifications.
            </p>
          </div>
        </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Profile;
