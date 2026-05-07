import React from 'react';
import DashboardLayout from '../../../components/DashboardLayout';
import { 
  Users, Calendar, FileText, CheckSquare, 
  ExternalLink, Clock 
} from 'lucide-react';

const SteeringDashboard = () => {
  const upcomingMeetings = [
    { id: 1, title: 'Q3 Strategic Review', date: 'Oct 15, 2024', time: '10:00 AM', status: 'Confirmed', attendees: 8 },
    { id: 2, title: 'AI Ethics Committee', date: 'Oct 18, 2024', time: '2:00 PM', status: 'Tentative', attendees: 5 },
    { id: 3, title: 'Monthly Portfolio Gate', date: 'Oct 25, 2024', time: '11:00 AM', status: 'Draft', attendees: 12 },
  ];

  const recentDecisions = [
    { title: 'Approved GenAI Pilot Budget', date: 'Sept 30', status: 'Approved', impact: 'High' },
    { title: 'Deferred Cloud Vendor Selection', date: 'Sept 15', status: 'Deferred', impact: 'Medium' },
    { title: 'Endorsed Diversity Hiring Initiative', date: 'Sept 01', status: 'Endorsed', impact: 'Low' },
  ];

  return (
    <DashboardLayout role="admin" title="Steering Committees" subtitle="High-level governance & strategic alignment.">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Scheduled Meetings */}
        <div className="lg:col-span-2 space-y-6">
           <div className="bg-white dark:bg-gray-900 dark:border-gray-800 rounded-xl shadow-sm border border-gray-100 overflow-hidden">
             <div className="p-6 border-b border-gray-100 flex justify-between items-center">
               <h3 className="font-bold text-gray-900 dark:text-white">Upcoming Committees</h3>
               <button className="text-sm text-brand-blue font-medium">+ Schedule New</button>
             </div>
             <div className="divide-y divide-gray-100">
               {upcomingMeetings.map((meeting) => (
                 <div key={meeting.id} className="p-6 flex items-start sm:items-center flex-col sm:flex-row gap-4 hover:bg-gray-50 dark:bg-[#050505] transition-colors">
                   <div className="flex-shrink-0 w-16 text-center bg-gray-100 dark:bg-[#0a0a0c] rounded-lg p-2">
                     <span className="block text-xs font-bold text-gray-500 uppercase">{meeting.date.split(' ')[0]}</span>
                     <span className="block text-xl font-bold text-gray-900 dark:text-white">{meeting.date.split(' ')[1].replace(',', '')}</span>
                   </div>
                   <div className="flex-1">
                     <h4 className="text-lg font-bold text-gray-900 dark:text-white">{meeting.title}</h4>
                     <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                       <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {meeting.time}</span>
                       <span className="flex items-center gap-1"><Users className="w-4 h-4" /> {meeting.attendees} Attendees</span>
                     </div>
                   </div>
                   <div className="flex items-center gap-3">
                     <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                       meeting.status === 'Confirmed' ? 'bg-green-100 text-green-700' : 'bg-gray-100 dark:bg-[#0a0a0c] text-gray-600 dark:text-gray-400'
                     }`}>
                       {meeting.status}
                     </span>
                     <button className="p-2 text-gray-400 hover:text-brand-blue transition-colors">
                       <ExternalLink className="w-5 h-5" />
                     </button>
                   </div>
                 </div>
               ))}
             </div>
           </div>

           {/* Meeting Materials / Pre-reads */}
           <div className="bg-white dark:bg-gray-900 dark:border-gray-800 rounded-xl shadow-sm border border-gray-100 p-6">
             <h3 className="font-bold text-gray-900 dark:text-white mb-4">Pending Pre-reads</h3>
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
               {[1, 2].map(i => (
                 <div key={i} className="border border-gray-200 rounded-lg p-4 flex items-center gap-4 hover:border-brand-blue transition-colors cursor-pointer">
                   <div className="p-3 bg-red-50 dark:bg-red-900/20 text-red-600 rounded-lg">
                     <FileText className="w-6 h-6" />
                   </div>
                   <div>
                     <p className="font-semibold text-gray-900 dark:text-white text-sm">Q3 Financial Deck.pdf</p>
                     <p className="text-xs text-gray-500">Added 2 hours ago by Sarah</p>
                   </div>
                 </div>
               ))}
             </div>
           </div>
        </div>

        {/* Right Column: Recent Outcomes */}
        <div className="space-y-6">
           <div className="bg-white dark:bg-gray-900 dark:border-gray-800 rounded-xl shadow-sm border border-gray-100 p-6">
             <h3 className="font-bold text-gray-900 dark:text-white mb-4">Recent Decisions</h3>
             <div className="space-y-4">
               {recentDecisions.map((decision, i) => (
                 <div key={i} className="flex gap-3 items-start pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                   <div className="mt-1">
                     <CheckSquare className="w-4 h-4 text-emerald-500" />
                   </div>
                   <div>
                     <p className="text-sm font-semibold text-gray-900 dark:text-white">{decision.title}</p>
                     <div className="flex items-center gap-2 mt-1">
                       <span className="text-xs text-gray-500">{decision.date}</span>
                       <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold uppercase ${
                         decision.status === 'Approved' ? 'bg-green-400/20 text-green-700' : 
                         decision.status === 'Deferred' ? 'bg-amber-400/20 text-amber-700' : 'bg-blue-400/20 text-blue-700'
                       }`}>
                         {decision.status}
                       </span>
                     </div>
                   </div>
                 </div>
               ))}
             </div>
             <button className="w-full mt-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-700 font-medium transition-colors">
               View Full Decision Log
             </button>
           </div>
        </div>

      </div>
    </DashboardLayout>
  );
};

export default SteeringDashboard;
