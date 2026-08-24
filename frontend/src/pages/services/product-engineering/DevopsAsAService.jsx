import React from 'react';
import UniversalServicePage from '../../../components/services/shared/UniversalServicePage';
import { servicesData } from '../../../data/servicesData';
import { departmentsData } from '../../../data/departmentsData';

const DevopsAsAService = () => {
  return (
    <UniversalServicePage 
      service={servicesData['devops-as-a-service']} 
      department={departmentsData.foundry} 
    />
  );
};

export default DevopsAsAService;
