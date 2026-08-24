import React from 'react';
import UniversalServicePage from '../../../components/services/shared/UniversalServicePage';
import { servicesData } from '../../../data/servicesData';
import { departmentsData } from '../../../data/departmentsData';

const ManagedInfrastructureServices = () => {
  return (
    <UniversalServicePage 
      service={servicesData['managed-infrastructure-services']} 
      department={departmentsData.foundry} 
    />
  );
};

export default ManagedInfrastructureServices;
