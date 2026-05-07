import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../../components/DashboardLayout';
import { Save, Shield, Bell, Globe, Mail, Lock, Eye, EyeOff, CheckCircle, AlertCircle, Loader2, Key } from 'lucide-react';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5050';

const SystemSettings = () => {
  const [activeTab, setActiveTab] = useState('general');
  
  // Password form state
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });
  
  const [status, setStatus] = useState('idle');
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState({});

  // Password strength calculator
  const calculatePasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (password.length >= 12) strength++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^a-zA-Z0-9]/.test(password)) strength++;
    return strength;
  };

  const getStrengthLabel = (strength) => {
    if (strength <= 1) return { label: 'Weak', color: 'bg-red-500' };
    if (strength <= 2) return { label: 'Fair', color: 'bg-orange-500' };
    if (strength <= 3) return { label: 'Good', color: 'bg-yellow-500' };
    if (strength <= 4) return { label: 'Strong', color: 'bg-green-500' };
    return { label: 'Very Strong', color: 'bg-emerald-600' };
  };

  const passwordStrength = calculatePasswordStrength(formData.newPassword);
  const strengthInfo = getStrengthLabel(passwordStrength);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.currentPassword) {
      newErrors.currentPassword = 'Current password is required';
    }
    
    if (!formData.newPassword) {
      newErrors.newPassword = 'New password is required';
    } else if (formData.newPassword.length < 8) {
      newErrors.newPassword = 'Password must be at least 8 characters';
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your new password';
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    if (formData.currentPassword && formData.newPassword && 
        formData.currentPassword === formData.newPassword) {
      newErrors.newPassword = 'New password must be different from current password';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setStatus('loading');
    setMessage('');

    try {
      const token = localStorage.getItem('token');
      
      await axios.post(
        `${BACKEND_URL}/api/profile/change-password`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setStatus('success');
      setMessage('Password changed successfully!');
      setFormData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      
      setTimeout(() => {
        setStatus('idle');
        setMessage('');
      }, 3000);
    } catch (error) {
      setStatus('error');
      setMessage(error.response?.data?.error || 'Failed to change password. Please try again.');
    }
  };

  const tabs = ['General', 'Security', 'Notifications', 'Integrations', 'Change Password'];

  return (
    <DashboardLayout 
      role="admin" 
      title="System Settings" 
      subtitle="Configure platform-wide settings and policies."
    >
      <div className="max-w-4xl space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        
        {/* Settings Tabs */}
        <div className="flex flex-wrap gap-2 border-b border-gray-200 mb-6">
          {tabs.map((tab) => (
             <button
                key={tab}
                onClick={() => setActiveTab(tab.toLowerCase().replace(' ', '-'))}
                className={`px-4 py-2 font-medium text-sm transition-colors border-b-2 ${
                   activeTab === tab.toLowerCase().replace(' ', '-')
                      ? 'border-brand-blue text-brand-blue'
                      : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-300'
                }`}
             >
                {tab}
             </button>
          ))}
        </div>

        {/* Content Area */}
        <div className={activeTab !== 'change-password' ? "bg-white rounded-2xl shadow-sm border border-gray-100 p-8" : ""}>
           
           {/* GENERAL TAB */}
           {activeTab === 'general' && (
              <div className="space-y-6">
                 <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                       <Globe className="w-5 h-5 text-gray-500" />
                       Platform Configuration
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                       <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Platform Name</label>
                          <input type="text" defaultValue="Kangqore" className="w-full p-2 border border-gray-200 rounded-lg" />
                       </div>
                       <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Support Email</label>
                          <input type="email" defaultValue="support@kangqore.com" className="w-full p-2 border border-gray-200 rounded-lg" />
                       </div>
                    </div>
                 </div>
                 
                 <div className="pt-6 border-t border-gray-100">
                    <button className="flex items-center gap-2 px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors">
                       <Save className="w-4 h-4" />
                       Save Changes
                    </button>
                 </div>
              </div>
           )}

           {/* SECURITY TAB */}
           {activeTab === 'security' && (
               <div className="space-y-6">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                     <Shield className="w-5 h-5 text-gray-500" />
                     Access Control
                  </h3>
                  <div className="space-y-4">
                     <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 dark:border-gray-700 rounded-xl">
                        <div>
                           <p className="font-medium text-gray-900 dark:text-white">Two-Factor Authentication (2FA)</p>
                           <p className="text-sm text-gray-500">Enforce 2FA for all admin accounts</p>
                        </div>
                        <div className="w-12 h-6 bg-brand-blue rounded-full relative cursor-pointer">
                           <div className="absolute right-1 top-1 w-4 h-4 bg-white dark:bg-black rounded-full"></div>
                        </div>
                     </div>
                     <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 dark:border-gray-700 rounded-xl">
                        <div>
                           <p className="font-medium text-gray-900 dark:text-white">Session Timeout</p>
                           <p className="text-sm text-gray-500">Auto-logout after inactivity</p>
                        </div>
                        <select className="bg-white dark:bg-gray-900 dark:border-gray-800 border border-gray-200 rounded-lg text-sm p-1">
                           <option>30 minutes</option>
                           <option>1 hour</option>
                           <option>4 hours</option>
                        </select>
                     </div>
                     <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 dark:border-gray-700 rounded-xl">
                        <div>
                           <p className="font-medium text-gray-900 dark:text-white">IP Whitelisting</p>
                           <p className="text-sm text-gray-500">Restrict admin access by IP address</p>
                        </div>
                        <div className="w-12 h-6 bg-gray-300 rounded-full relative cursor-pointer">
                           <div className="absolute left-1 top-1 w-4 h-4 bg-white dark:bg-black rounded-full"></div>
                        </div>
                     </div>
                  </div>
               </div>
           )}

           {/* NOTIFICATIONS TAB */}
           {activeTab === 'notifications' && (
              <div className="space-y-6">
                 <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <Bell className="w-5 h-5 text-gray-500" />
                    Notification Preferences
                 </h3>
                 <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 dark:border-gray-700 rounded-xl">
                       <div>
                          <p className="font-medium text-gray-900 dark:text-white">Email Notifications</p>
                          <p className="text-sm text-gray-500">Receive email alerts for new users</p>
                       </div>
                       <div className="w-12 h-6 bg-brand-blue rounded-full relative cursor-pointer">
                          <div className="absolute right-1 top-1 w-4 h-4 bg-white dark:bg-black rounded-full"></div>
                       </div>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 dark:border-gray-700 rounded-xl">
                       <div>
                          <p className="font-medium text-gray-900 dark:text-white">System Alerts</p>
                          <p className="text-sm text-gray-500">Critical system notifications</p>
                       </div>
                       <div className="w-12 h-6 bg-brand-blue rounded-full relative cursor-pointer">
                          <div className="absolute right-1 top-1 w-4 h-4 bg-white dark:bg-black rounded-full"></div>
                       </div>
                    </div>
                 </div>
              </div>
           )}

           {/* INTEGRATIONS TAB */}
           {activeTab === 'integrations' && (
              <div className="space-y-6">
                 <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <Mail className="w-5 h-5 text-gray-500" />
                    Third-Party Integrations
                 </h3>
                 <div className="text-center py-8 text-gray-500">
                    <p>No integrations configured yet.</p>
                    <button className="mt-4 px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-700 transition-colors">
                       Add Integration
                    </button>
                 </div>
              </div>
           )}

           {/* CHANGE PASSWORD TAB */}
           {activeTab === 'change-password' && (
              <div className="space-y-6">
                 
                 <form onSubmit={handlePasswordSubmit} className="max-w-md space-y-5 mt-6">
                    {/* Success/Error Messages */}
                    {status === 'success' && (
                      <div className="flex items-center gap-3 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 rounded-xl text-green-700">
                        <CheckCircle className="w-5 h-5 flex-shrink-0" />
                        <p className="text-sm font-medium">{message}</p>
                      </div>
                    )}
                    {status === 'error' && (
                      <div className="flex items-center gap-3 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 rounded-xl text-red-700">
                        <AlertCircle className="w-5 h-5 flex-shrink-0" />
                        <p className="text-sm">{message}</p>
                      </div>
                    )}

                    {/* Current Password */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Current Password</label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type={showPasswords.current ? 'text' : 'password'}
                          name="currentPassword"
                          value={formData.currentPassword}
                          onChange={handleInputChange}
                          className={`w-full pl-10 pr-10 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 ${
                            errors.currentPassword ? 'border-red-300 bg-red-50 dark:bg-red-900/20' : 'border-gray-200'
                          }`}
                          placeholder="Enter current password"
                        />
                        <button
                          type="button"
                          onClick={() => togglePasswordVisibility('current')}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:text-gray-400"
                        >
                          {showPasswords.current ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                      {errors.currentPassword && (
                        <p className="text-red-500 text-sm mt-1">{errors.currentPassword}</p>
                      )}
                      <div className="flex justify-end mt-2">
                        <Link to="/forgot-password" className="text-sm text-brand-blue hover:text-blue-700 font-medium">
                          Forgot your current password?
                        </Link>
                      </div>
                    </div>

                    {/* New Password */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">New Password</label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type={showPasswords.new ? 'text' : 'password'}
                          name="newPassword"
                          value={formData.newPassword}
                          onChange={handleInputChange}
                          className={`w-full pl-10 pr-10 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 ${
                            errors.newPassword ? 'border-red-300 bg-red-50 dark:bg-red-900/20' : 'border-gray-200'
                          }`}
                          placeholder="Enter new password"
                        />
                        <button
                          type="button"
                          onClick={() => togglePasswordVisibility('new')}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:text-gray-400"
                        >
                          {showPasswords.new ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                      {errors.newPassword && (
                        <p className="text-red-500 text-sm mt-1">{errors.newPassword}</p>
                      )}
                      
                      {/* Password Strength */}
                      {formData.newPassword && (
                        <div className="mt-3">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs text-gray-500">Password Strength</span>
                            <span className={`text-xs font-medium ${passwordStrength <= 2 ? 'text-red-600' : 'text-green-600'}`}>
                              {strengthInfo.label}
                            </span>
                          </div>
                          <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                            <div 
                              className={`h-full ${strengthInfo.color} transition-all duration-300`}
                              style={{ width: `${(passwordStrength / 5) * 100}%` }}
                            />
                          </div>
                          <ul className="mt-2 space-y-1">
                            <li className={`text-xs flex items-center gap-1 ${formData.newPassword.length >= 8 ? 'text-green-600' : 'text-gray-400'}`}>
                              {formData.newPassword.length >= 8 ? <CheckCircle className="w-3 h-3" /> : <span className="w-3 h-3 rounded-full border border-current" />}
                              At least 8 characters
                            </li>
                            <li className={`text-xs flex items-center gap-1 ${/[A-Z]/.test(formData.newPassword) && /[a-z]/.test(formData.newPassword) ? 'text-green-600' : 'text-gray-400'}`}>
                              {/[A-Z]/.test(formData.newPassword) && /[a-z]/.test(formData.newPassword) ? <CheckCircle className="w-3 h-3" /> : <span className="w-3 h-3 rounded-full border border-current" />}
                              Upper & lowercase letters
                            </li>
                            <li className={`text-xs flex items-center gap-1 ${/[0-9]/.test(formData.newPassword) ? 'text-green-600' : 'text-gray-400'}`}>
                              {/[0-9]/.test(formData.newPassword) ? <CheckCircle className="w-3 h-3" /> : <span className="w-3 h-3 rounded-full border border-current" />}
                              At least one number
                            </li>
                          </ul>
                        </div>
                      )}
                    </div>

                    {/* Confirm Password */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Confirm New Password</label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type={showPasswords.confirm ? 'text' : 'password'}
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleInputChange}
                          className={`w-full pl-10 pr-10 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 ${
                            errors.confirmPassword ? 'border-red-300 bg-red-50 dark:bg-red-900/20' : 
                            formData.confirmPassword && formData.newPassword === formData.confirmPassword ? 'border-green-300 bg-green-50 dark:bg-green-900/20' : 'border-gray-200'
                          }`}
                          placeholder="Confirm new password"
                        />
                        <button
                          type="button"
                          onClick={() => togglePasswordVisibility('confirm')}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:text-gray-400"
                        >
                          {showPasswords.confirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                      {errors.confirmPassword && (
                        <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
                      )}
                      {formData.confirmPassword && formData.newPassword === formData.confirmPassword && !errors.confirmPassword && (
                        <p className="text-green-600 text-sm mt-1 flex items-center gap-1">
                          <CheckCircle className="w-4 h-4" /> Passwords match
                        </p>
                      )}
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={status === 'loading'}
                      className="w-full py-3 bg-brand-gradient text-white font-semibold rounded-xl hover:opacity-90 focus:ring-4 focus:ring-blue-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {status === 'loading' ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Changing Password...
                        </>
                      ) : (
                        <>
                          <Key className="w-5 h-5" />
                          Change Password
                        </>
                      )}
                    </button>

                    {/* Footer Text */}
                    <div className="pt-4 text-center">
                      <p className="text-xs text-gray-400 mb-1">
                        For security, you'll be redirected to Settings after changing your password.
                      </p>
                      <p className="text-xs">
                        <span className="text-gray-400">Don't remember your password? </span>
                        <Link to="/forgot-password" className="text-brand-blue hover:underline font-medium">
                          Reset via email
                        </Link>
                      </p>
                    </div>
                 </form>
              </div>
           )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default SystemSettings;
