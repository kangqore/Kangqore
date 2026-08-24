import React from 'react';
import UniversalServicePage from '../../../components/services/shared/UniversalServicePage';
import { servicesData } from '../../../data/servicesData';
import { departmentsData } from '../../../data/departmentsData';

const ManagedServicesInfra = () => {
  return (
    <UniversalServicePage 
      service={servicesData['managed-services']} 
      department={departmentsData.foundry} 
    />
  );
};

export default ManagedServicesInfra;
