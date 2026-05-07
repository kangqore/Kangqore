import React from 'react';
import DashboardLayout from '../../../components/DashboardLayout';
import { Construction } from 'lucide-react';

const ClientPlaceholder = ({ title, subtitle, role = 'client' }) => {
  return (
    <DashboardLayout role={role} title={title} subtitle={subtitle}>
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center p-8 bg-white dark:bg-gray-900 dark:border-gray-800 rounded-2xl border border-dashed border-gray-200">
        <div className="w-16 h-16 bg-gray-50 dark:bg-[#050505] rounded-full flex items-center justify-center mb-4">
          <Construction className="w-8 h-8 text-gray-400" />
        </div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Coming Soon</h2>
        <p className="text-gray-500 max-w-md">
          The <span className="font-semibold text-gray-700 dark:text-gray-300">{title}</span> module is currently under development. 
          Please check back later for updates.
        </p>
      </div>
    </DashboardLayout>
  );
};

export default ClientPlaceholder;
