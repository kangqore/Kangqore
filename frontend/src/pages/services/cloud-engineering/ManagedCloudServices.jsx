import React from 'react';
import UniversalServicePage from '../../../components/services/shared/UniversalServicePage';
import { servicesData } from '../../../data/servicesData';
import { departmentsData } from '../../../data/departmentsData';

const ManagedCloudServices = () => {
  return (
    <UniversalServicePage 
      service={servicesData['managed-cloud-services']} 
      department={departmentsData.foundry} 
    />
  );
};

export default ManagedCloudServices;
