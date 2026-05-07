import React from 'react';
import DashboardLayout from '../../../components/DashboardLayout';
import { ArrowLeft } from 'lucide-react';
import { useParams, Link } from 'react-router-dom';
import ClientEngagementDashboard from '../../../components/admin/ClientEngagementDashboard';

const AdminProjectManager = () => {
    const { clientId } = useParams();

    return (
        <DashboardLayout role="admin" title="Client Engagement Dashboard">
             <div className="flex items-center gap-4 mb-6">
                <Link to="/dashboard/admin/clients" className="p-2 bg-white dark:bg-gray-900 dark:border-gray-800 rounded-lg border border-gray-200 hover:bg-gray-50 text-gray-500">
                    <ArrowLeft className="w-5 h-5" /> Back to Clients
                </Link>
            </div>
            
            <ClientEngagementDashboard clientId={clientId} />
        </DashboardLayout>
    );
};

export default AdminProjectManager;
