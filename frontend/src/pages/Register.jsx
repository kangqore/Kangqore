import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Phone, Building, Eye, EyeOff, Building2, Handshake, TrendingUp, Briefcase, ArrowLeft, CheckCircle, Clock, Lock as LockIcon } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const Register = () => {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState(null);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    role: '',
    phone: '',
    company: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const accessTypes = [
    { 
      id: 'CLIENT', 
      name: 'Client Access', 
      icon: Building2, 
      description: 'For enterprise customers & stakeholders',
      color: 'blue',
      bgColor: 'bg-blue-50',
      iconColor: 'text-brand-blue',
      borderColor: 'border-brand-blue'
    },
    { 
      id: 'PARTNER', 
      name: 'Partner Access', 
      icon: Handshake, 
      description: 'For technology & delivery partners',
      color: 'emerald',
      bgColor: 'bg-emerald-50',
      iconColor: 'text-emerald-600',
      borderColor: 'border-emerald-500'
    },
    { 
      id: 'INVESTOR', 
      name: 'Investor Access', 
      icon: TrendingUp, 
      description: 'For shareholders & board members',
      color: 'amber',
      bgColor: 'bg-amber-50',
      iconColor: 'text-amber-600',
      borderColor: 'border-amber-500'
    },
    { 
      id: 'JOB_SEEKER', 
      name: 'Job Seeker', 
      icon: Briefcase, 
      description: 'For candidates and applicants',
      color: 'purple',
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-600',
      borderColor: 'border-purple-500'
    }
  ];

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
    setFormData({ ...formData, role: role.id });
    setError('');
  };

  const handleBackToRoles = () => {
    setSelectedRole(null);
    setFormData({ email: '', password: '', confirmPassword: '', name: '', role: '', phone: '', company: '' });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          name: formData.name,
          role: formData.role,
          phone: formData.phone || null,
          company: formData.company || null
        }),
      });

      const text = await response.text();
      let data;
      try {
        data = text ? JSON.parse(text) : {};
      } catch (e) {
        console.error('Failed to parse register response:', text);
        throw new Error('Server returned an invalid response');
      }

      if (!response.ok) {
        throw new Error(data?.error?.message || data?.detail || 'Registration failed');
      }

      // Show success message - account created but pending approval
      setSuccess(true);
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Success View - Account Pending Approval
  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-[#050505] flex flex-col">
        <Header onMenuClick={() => setMobileMenuOpen(!mobileMenuOpen)} />
        
        <main className="flex-grow flex items-center justify-center">
          <div className="max-w-md mx-auto px-4 py-16 text-center">
            <div className="bg-white dark:bg-gray-900 dark:border-gray-800 rounded-3xl shadow-xl p-10">
              <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Clock className="w-10 h-10 text-amber-600" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Account Created!</h1>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Your account has been created successfully. You can now log in and start using the platform.
              </p>
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-8">
                <p className="text-amber-800 text-sm">
                  <strong>Next Steps:</strong> You can now log in and access your account.
                </p>
              </div>
              <Link
                to="/login"
                className="inline-flex items-center justify-center gap-2 w-full bg-gray-900 text-white py-4 rounded-xl font-semibold hover:bg-gray-800 transition-all"
              >
                Go to Login
              </Link>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#050505] flex flex-col">
      {/* Global Navbar */}
      <Header onMenuClick={() => setMobileMenuOpen(!mobileMenuOpen)} />

      {/* Main Content */}
      <main className="flex-grow">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          
          {/* Role Selection View */}
          {!selectedRole ? (
            <div className="space-y-8">
              {/* Header */}
              <div className="text-center">
                <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-3">Sign Up for Kangqore</h1>
                <p className="text-gray-600 dark:text-gray-400 text-lg">Select your access type to create your account.</p>
              </div>

              {/* Access Type Cards */}
              <div className="grid md:grid-cols-2 gap-4">
                {accessTypes.map((type) => {
                  const IconComponent = type.icon;
                  return (
                    <button
                      key={type.id}
                      onClick={() => handleRoleSelect(type)}
                      className="w-full bg-white dark:bg-gray-900 dark:border-gray-800 rounded-2xl p-6 text-left border-2 border-transparent hover:border-gray-200 transition-all duration-300 shadow-sm hover:shadow-md group"
                    >
                      <div className="flex items-center gap-5">
                        <div className={`w-14 h-14 ${type.bgColor} rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}>
                          <IconComponent className={`w-7 h-7 ${type.iconColor}`} />
                        </div>
                        <div className="flex-grow">
                          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">{type.name}</h3>
                          <p className="text-gray-500">{type.description}</p>
                        </div>
                        <div className="text-gray-300 group-hover:text-gray-400 transition-colors">
                          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>



              {/* Login Link */}
              <div className="text-center pt-6 border-t border-gray-200">
                <p className="text-gray-600 dark:text-gray-400">
                  Already have an account?{' '}
                  <Link to="/login" className="text-brand-blue hover:text-blue-700 font-semibold">
                    Sign In
                  </Link>
                </p>
              </div>
            </div>
          ) : (
            /* Registration Form View */
            <div className="max-w-xl mx-auto space-y-8">
              {/* Back Button */}
              <button
                onClick={handleBackToRoles}
                className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:text-white transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Back to access types</span>
              </button>

              {/* Selected Role Card */}
              <div className={`bg-white dark:bg-gray-900 dark:border-gray-800 rounded-2xl p-6 border-2 ${selectedRole.borderColor} shadow-sm`}>
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 ${selectedRole.bgColor} rounded-xl flex items-center justify-center`}>
                    <selectedRole.icon className={`w-6 h-6 ${selectedRole.iconColor}`} />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">{selectedRole.name}</h2>
                    <p className="text-gray-500 text-sm">{selectedRole.description}</p>
                  </div>
                  <CheckCircle className={`w-6 h-6 ${selectedRole.iconColor} ml-auto`} />
                </div>
              </div>

              {/* Registration Form */}
              <div className="bg-white dark:bg-gray-900 dark:border-gray-800 rounded-2xl shadow-lg p-8">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Create Your Account</h3>
                <p className="text-gray-500 text-sm mb-6">Fill in your details to create your account.</p>

                {error && (
                  <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 rounded-xl">
                    <p className="text-red-600 text-sm">{error}</p>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Full Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Full Name *</label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full pl-12 pr-4 py-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="John Doe"
                        required
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email Address *</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full pl-12 pr-4 py-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="you@company.com"
                        required
                      />
                    </div>
                  </div>

                  {/* Company */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Company / Organization</label>
                    <div className="relative">
                      <Building className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        value={formData.company}
                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                        className="w-full pl-12 pr-4 py-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Your Company"
                      />
                    </div>
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Phone Number</label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full pl-12 pr-4 py-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="+1 (555) 000-0000"
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Password *</label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        className="w-full pl-12 pr-12 py-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="••••••••"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:text-gray-400"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Confirm Password *</label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={formData.confirmPassword}
                        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                        className="w-full pl-12 pr-4 py-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="••••••••"
                        required
                      />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gray-900 text-white py-4 rounded-xl font-semibold hover:bg-gray-800 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl mt-6"
                  >
                    {loading ? 'Creating Account...' : 'Sign Up Now'}
                  </button>
                </form>

                {/* Login Link */}
                <div className="mt-6 text-center">
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Already have an account?{' '}
                    <Link to="/login" className="text-brand-blue hover:text-blue-700 font-semibold">
                      Sign In
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Global Footer */}
      <Footer />
    </div>
  );
};

export default Register;
