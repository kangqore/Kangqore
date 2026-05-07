import React from 'react';
import DashboardLayout from '../../../components/DashboardLayout';
import EmailClient from '../../../components/Email/EmailClient';

const PartnerEmails = () => {
  return (
    <DashboardLayout role="partner" title="Partner Mailbox" subtitle="Official communications regarding projects and deliverables">
      <EmailClient role="partner" />
    </DashboardLayout>
  );
};

export default PartnerEmails;
