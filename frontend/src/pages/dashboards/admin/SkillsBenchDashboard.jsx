import React, { useState } from 'react';
import DashboardLayout from '../../../components/DashboardLayout';
import { 
  Award, BookOpen, Users, TrendingUp, 
  Search, Filter, ChevronRight 
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar 
} from 'recharts';

const SkillsBenchDashboard = () => {
  const [skills] = useState([
    { category: 'AI/ML Core', level: 85, demand: 90 },
    { category: 'Cloud Infra', level: 75, demand: 80 },
    { category: 'Data Eng', level: 70, demand: 85 },
    { category: 'Frontend', level: 90, demand: 60 },
    { category: 'Cybersec', level: 60, demand: 75 },
    { category: 'DevOps', level: 80, demand: 80 },
  ]);

  const [bench] = useState([
    { id: 1, name: 'Alex M.', role: 'Senior React Dev', tenure: '2 weeks', skills: ['React', 'Node.js', 'AWS'], cost: '$8k/mo' },
    { id: 2, name: 'Priya K.', role: 'Data Scientist', tenure: '1 week', skills: ['Python', 'PyTorch', 'SQL'], cost: '$12k/mo' },
    { id: 3, name: 'David B.', role: 'QA Engineer', tenure: '4 weeks', skills: ['Selenium', 'Jest', 'CI/CD'], cost: '$6k/mo' },
  ]);

  return (
    <DashboardLayout role="admin" title="Skills & Bench" subtitle="Differentiation engine & talent inventory.">
      <div className="space-y-6">
        
        {/* KPI Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-gray-900 dark:border-gray-800 p-5 rounded-xl border border-gray-100 shadow-sm text-center md:text-left">
            <p className="text-gray-500 text-xs uppercase tracking-wider">Certified Experts</p>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">42</h3>
            <p className="text-xs text-green-600 mt-1">+5 this month</p>
          </div>
          <div className="bg-white dark:bg-gray-900 dark:border-gray-800 p-5 rounded-xl border border-gray-100 shadow-sm text-center md:text-left">
            <p className="text-gray-500 text-xs uppercase tracking-wider">Bench Size</p>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">3</h3>
            <p className="text-xs text-gray-500 mt-1">4.5% of total Workforce</p>
          </div>
          <div className="bg-white dark:bg-gray-900 dark:border-gray-800 p-5 rounded-xl border border-gray-100 shadow-sm text-center md:text-left">
            <p className="text-gray-500 text-xs uppercase tracking-wider">Avg Bench Aging</p>
            <h3 className="text-2xl font-bold text-yellow-600 mt-1">12 Days</h3>
            <p className="text-xs text-gray-500 mt-1">Target: &lt; 14 Days</p>
          </div>
           <div className="bg-white dark:bg-gray-900 dark:border-gray-800 p-5 rounded-xl border border-gray-100 shadow-sm text-center md:text-left">
            <p className="text-gray-500 text-xs uppercase tracking-wider">Skill Gap Index</p>
            <h3 className="text-2xl font-bold text-blue-600 mt-1">15%</h3>
            <p className="text-xs text-blue-600 mt-1">Cybersecurity focus</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Skill Radar */}
          <div className="bg-white dark:bg-gray-900 dark:border-gray-800 p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-semibold text-gray-900 dark:text-white">Supply vs Demand</h3>
              <select className="text-xs border-gray-200 rounded-md">
                <option>All Depts</option>
              </select>
            </div>
             <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart outerRadius={90} data={skills}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="category" tick={{ fontSize: 11 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} hide />
                  <Radar name="Internal Capability" dataKey="level" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                  <Radar name="Market Demand" dataKey="demand" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.6} />
                  <Tooltip />
                </RadarChart>
              </ResponsiveContainer>
             </div>
             <div className="flex justify-center gap-4 mt-2 text-xs">
                <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-[#8884d8]"></div>Internal Capability</div>
                <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-[#82ca9d]"></div>Market Demand</div>
             </div>
          </div>

          {/* Bench List */}
          <div className="bg-white dark:bg-gray-900 dark:border-gray-800 rounded-xl shadow-sm border border-gray-100 flex flex-col">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h3 className="font-semibold text-gray-900 dark:text-white">Available on Bench</h3>
               <button className="p-2 hover:bg-gray-100 dark:bg-[#0a0a0c] rounded-full"><Filter className="w-4 h-4 text-gray-500" /></button>
            </div>
            <div className="flex-1 overflow-auto">
              <div className="divide-y divide-gray-100">
                {bench.map((person) => (
                  <div key={person.id} className="p-4 hover:bg-gray-50 dark:bg-[#050505] transition-colors flex items-center justify-between group">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-[#0a0a0c] flex items-center justify-center text-gray-500 font-bold">
                        {person.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white text-sm">{person.name}</p>
                        <p className="text-xs text-gray-500">{person.role}</p>
                      </div>
                    </div>
                    <div className="hidden sm:block text-right">
                       <p className="text-xs font-medium text-gray-900 dark:text-white">{person.tenure}</p>
                       <p className="text-[10px] text-gray-400">on bench</p>
                    </div>
                    <div className="flex gap-1">
                      {person.skills.slice(0, 2).map((skill, i) => (
                        <span key={i} className="px-2 py-1 bg-gray-100 dark:bg-[#0a0a0c] text-gray-600 dark:text-gray-400 text-[10px] rounded-full">{skill}</span>
                      ))}
                    </div>
                     <button className="opacity-0 group-hover:opacity-100 p-2 text-blue-600">
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
             <div className="p-4 border-t border-gray-100 bg-gray-50 dark:bg-gray-800 dark:border-gray-700">
               <button className="w-full py-2 bg-white dark:bg-gray-900 dark:border-gray-800 border border-gray-200 rounded-lg text-sm text-gray-600 dark:text-gray-400 font-medium hover:bg-gray-50">
                 Find Candidates for Deployment
               </button>
             </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default SkillsBenchDashboard;
