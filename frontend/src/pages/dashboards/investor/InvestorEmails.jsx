import React from 'react';
import DashboardLayout from '../../../components/DashboardLayout';
import EmailClient from '../../../components/Email/EmailClient';

const InvestorEmails = () => {
  return (
    <DashboardLayout role="investor" title="Investor Communications" subtitle="Secure messaging channel with Kangqore Administration">
      <EmailClient role="investor" />
    </DashboardLayout>
  );
};

export default InvestorEmails;
