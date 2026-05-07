import React, { useState } from 'react';
import DashboardLayout from '../../../components/DashboardLayout';
import { 
  Users, 
  MapPin, 
  Mail, 
  Phone, 
  Linkedin, 
  Award, 
  Briefcase,
  Globe,
  Clock,
  CheckCircle
} from 'lucide-react';

const TEAM_MEMBERS = [
  {
    id: 1,
    name: 'Sarah Jenning',
    role: 'Engagement Manager',
    category: 'Leadership',
    location: 'London, UK',
    email: 'sarah.j@kangqore.com',
    phone: '+44 20 7123 4567',
    avatar: '', // Placeholder logic in UI
    certifications: ['PMP', 'Scrum Master'],
    availability: 'Online',
    bio: 'Senior Engagement Manager with 10+ years of experience in FinTech transformations.'
  },
  {
    id: 2,
    name: 'Amit Patel',
    role: 'Lead Solution Architect',
    category: 'Core Team',
    location: 'Mumbai, India',
    email: 'amit.p@kangqore.com',
    phone: '+91 98765 43210',
    avatar: '',
    certifications: ['AWS Solution Architect Pro', 'TOGAF 9'],
    availability: 'In Meeting',
    bio: 'Expert in microservices architecture and cloud-native security patterns.'
  },
  {
    id: 3,
    name: 'Mike Ross',
    role: 'Senior Frontend Developer',
    category: 'Core Team',
    location: 'Bangalore, India',
    email: 'mike.r@kangqore.com',
    phone: '+91 98765 12345',
    avatar: '',
    certifications: ['React Certified'],
    availability: 'Offline', // Timezone difference
    bio: 'Specialist in high-performance React applications and D3.js visualizations.'
  },
  {
    id: 4,
    name: 'Priya Sharma',
    role: 'QA Lead',
    category: 'Extended Team',
    location: 'Pune, India',
    email: 'priya.s@kangqore.com',
    phone: '+91 98765 67890',
    avatar: '',
    certifications: ['ISTQB Advanced'],
    availability: 'Online',
    bio: 'Ensuring zero-defect delivery through automated testing pipelines.'
  },
  {
    id: 5,
    name: 'David Kim',
    role: 'DevOps Engineer (Shared)',
    category: 'Shared Services',
    location: 'Singapore',
    email: 'david.k@kangqore.com',
    phone: '+65 1234 5678',
    avatar: '',
    certifications: ['CKA', 'HashiCorp Terraform'],
    availability: 'Busy',
    bio: 'Managing CI/CD pipelines and cloud infrastructure reliability.'
  }
];

const ClientTeam = () => {
  const [filter, setFilter] = useState('All');

  const categories = ['All', 'Leadership', 'Core Team', 'Extended Team', 'Shared Services'];

  const filteredMembers = filter === 'All' 
    ? TEAM_MEMBERS 
    : TEAM_MEMBERS.filter(m => m.category === filter);

  return (
    <DashboardLayout role="client" title="Project Team" subtitle="Meet the experts driving your engagement">
      
      {/* 1. Team Composition Summary */}
      <div className="bg-white dark:bg-gray-900 dark:border-gray-800 p-6 rounded-2xl border border-gray-200 shadow-sm mb-8">
          <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Team Composition</h3>
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total Headcount: 12</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100">
                  <div className="flex items-center gap-2 mb-1">
                      <Briefcase className="w-4 h-4 text-blue-700" />
                      <span className="text-xs font-bold text-blue-800 uppercase">Onshore (UK/US)</span>
                  </div>
                  <p className="text-2xl font-bold text-blue-900">2 <span className="text-xs font-normal text-blue-600">Resources</span></p>
                  <p className="text-[10px] text-blue-500 mt-1">Leadership & Strategy</p>
              </div>
               <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl border border-purple-100">
                  <div className="flex items-center gap-2 mb-1">
                      <Globe className="w-4 h-4 text-purple-700" />
                      <span className="text-xs font-bold text-purple-800 uppercase">Offshore (India)</span>
                  </div>
                  <p className="text-2xl font-bold text-purple-900">8 <span className="text-xs font-normal text-purple-600">Resources</span></p>
                  <p className="text-[10px] text-purple-500 mt-1">Development & QA</p>
              </div>
               <div className="p-4 bg-amber-50 rounded-xl border border-amber-100">
                  <div className="flex items-center gap-2 mb-1">
                      <Users className="w-4 h-4 text-amber-700" />
                      <span className="text-xs font-bold text-amber-800 uppercase">Nearshore (SG)</span>
                  </div>
                  <p className="text-2xl font-bold text-amber-900">2 <span className="text-xs font-normal text-amber-600">Resources</span></p>
                  <p className="text-[10px] text-amber-500 mt-1">DevOps & Support</p>
              </div>
               <div className="p-4 bg-gray-50 dark:bg-gray-800 dark:border-gray-700 rounded-xl border border-gray-100 flex flex-col justify-center items-center text-center">
                   <p className="text-xs text-gray-500 font-bold uppercase mb-1">Scale Up Available</p>
                   <button className="px-3 py-1.5 bg-white dark:bg-gray-900 dark:border-gray-800 border border-gray-200 shadow-sm text-xs font-bold text-gray-700 dark:text-gray-300 rounded-lg hover:text-brand-blue transition-colors">
                       Request Resources
                   </button>
              </div>
          </div>
      </div>

      {/* 2. Team Grid */}
      <div>
           {/* Filters */}
           <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2">
               {categories.map(cat => (
                   <button
                       key={cat}
                       onClick={() => setFilter(cat)}
                       className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                           filter === cat 
                           ? 'bg-brand-blue text-white shadow-md' 
                           : 'bg-white dark:bg-gray-900 dark:border-gray-800 text-gray-600 dark:text-gray-400 border border-gray-200 hover:bg-gray-50'
                       }`}
                   >
                       {cat}
                   </button>
               ))}
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
               {filteredMembers.map(member => (
                   <div key={member.id} className="bg-white dark:bg-gray-900 dark:border-gray-800 rounded-2xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow group">
                       {/* Header Card */}
                       <div className="p-6 border-b border-gray-100 relative">
                           <div className="absolute top-4 right-4">
                               <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-[10px] font-bold uppercase border ${
                                   member.availability === 'Online' ? 'bg-green-50 text-green-700 border-green-100' :
                                   member.availability === 'Busy' ? 'bg-amber-50 text-amber-700 border-amber-100' :
                                   'bg-gray-50 dark:bg-gray-800 dark:border-gray-700 text-gray-500 border-gray-100'
                               }`}>
                                   <span className={`w-1.5 h-1.5 rounded-full ${
                                       member.availability === 'Online' ? 'bg-green-500' :
                                       member.availability === 'Busy' ? 'bg-amber-500' :
                                       'bg-gray-400'
                                   }`} />
                                   {member.availability}
                               </span>
                           </div>

                           <div className="flex items-center gap-4">
                               <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-xl font-bold shadow-inner ${
                                   member.category === 'Leadership' ? 'bg-blue-100 text-blue-700' :
                                   member.category === 'Core Team' ? 'bg-indigo-100 text-indigo-700' :
                                   'bg-gray-100 dark:bg-gray-800 dark:border-gray-700 text-gray-600 dark:text-gray-400'
                               }`}>
                                   {member.name.split(' ').map(n => n[0]).join('')}
                               </div>
                               <div>
                                   <h4 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-brand-blue transition-colors">{member.name}</h4>
                                   <p className="text-sm text-brand-blue font-medium">{member.role}</p>
                                   <div className="flex items-center gap-1 mt-1 text-xs text-gray-500">
                                       <MapPin className="w-3 h-3" /> {member.location}
                                   </div>
                               </div>
                           </div>

                           <p className="mt-4 text-xs text-gray-600 dark:text-gray-400 leading-relaxed line-clamp-2">
                               {member.bio}
                           </p>

                           <div className="flex flex-wrap gap-2 mt-3">
                               {member.certifications.map((cert, idx) => (
                                   <span key={idx} className="flex items-center gap-1 px-2 py-1 bg-gray-50 dark:bg-gray-800 dark:border-gray-700 text-gray-600 dark:text-gray-400 text-[10px] font-bold rounded border border-gray-100">
                                       <Award className="w-3 h-3 text-amber-500" /> {cert}
                                   </span>
                               ))}
                           </div>
                       </div>

                       {/* Footer Actions */}
                       <div className="bg-gray-50 dark:bg-[#050505]/50 p-4 grid grid-cols-2 gap-4">
                           <a href={`mailto:${member.email}`} className="flex items-center justify-center gap-2 py-2 bg-white dark:bg-gray-900 dark:border-gray-800 border border-gray-200 rounded-lg text-xs font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-50 hover:text-brand-blue transition-colors">
                               <Mail className="w-3.5 h-3.5" /> Email
                           </a>
                           <a href={`tel:${member.phone}`} className="flex items-center justify-center gap-2 py-2 bg-white dark:bg-gray-900 dark:border-gray-800 border border-gray-200 rounded-lg text-xs font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-50 hover:text-brand-blue transition-colors">
                               <Phone className="w-3.5 h-3.5" /> Call
                           </a>
                       </div>
                   </div>
               ))}
           </div>
      </div>

    </DashboardLayout>
  );
};

export default ClientTeam;
