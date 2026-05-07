import React from 'react';
import DashboardLayout from '../../../components/DashboardLayout';
import EmailClient from '../../../components/Email/EmailClient';

const ClientEmails = ({ isTabContent = false }) => {
  const content = (
      <EmailClient role="client" />
  );

  if (isTabContent) return content;

  return (
    <DashboardLayout role="client" title="Messages" subtitle="Manage your communications with the Kangqore team">
      {content}
    </DashboardLayout>
  );
};

export default ClientEmails;
