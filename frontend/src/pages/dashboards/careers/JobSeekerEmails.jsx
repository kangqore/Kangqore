import React from 'react';
import DashboardLayout from '../../../components/DashboardLayout';
import EmailClient from '../../../components/Email/EmailClient';

const JobSeekerEmails = () => {
  return (
    <DashboardLayout role="job_seeker" title="My Inbox" subtitle="Communications regarding your applications and interviews">
      <EmailClient role="job_seeker" />
    </DashboardLayout>
  );
};

export default JobSeekerEmails;
